import 'dotenv/config'
import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const isProduction = process.env.NODE_ENV === 'production'
const MP_ACCESS_TOKEN = isProduction
  ? process.env.MP_ACCESS_TOKEN_PROD
  : process.env.MP_ACCESS_TOKEN_TEST

if (!MP_ACCESS_TOKEN) {
  console.error(`❌ Variável ${isProduction ? 'MP_ACCESS_TOKEN_PROD' : 'MP_ACCESS_TOKEN_TEST'} não definida no .env`)
  process.exit(1)
}

const isTestToken = MP_ACCESS_TOKEN.startsWith('TEST-')
console.log(`💳 Mercado Pago: ${isTestToken ? 'TESTE 🧪 (sandbox)' : 'PRODUÇÃO 🚀'}`)

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
if (!N8N_WEBHOOK_URL) console.warn('⚠️  N8N_WEBHOOK_URL não definida — notificações desativadas')

const mp = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })

// ── Pedidos em arquivo local ─────────────────────────────────
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

function loadOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')) } catch { return {} }
}

function saveOrder(ref, data) {
  const orders = loadOrders()
  orders[ref] = data
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

function getOrder(ref) {
  return loadOrders()[ref] || null
}

// ────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// ── Criar preferência de pagamento ──────────────────────────
app.post('/api/criar-pagamento', async (req, res) => {
  try {
    const { items, payer, origin } = req.body

    const ref = `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    saveOrder(ref, {
      giftIds: items.map(i => i.id),
      payerName: payer.name,
      payerPhone: payer.phone,
    })

    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
    const backUrls = {
      back_urls: {
        success: `${origin}/pagamento/sucesso`,
        failure: `${origin}/pagamento/falha`,
        pending: `${origin}/pagamento/pendente`,
      },
      ...(!isLocalhost && { auto_return: 'approved' }),
    }

    const preference = new Preference(mp)
    const result = await preference.create({
      body: {
        external_reference: ref,
        items: items.map((item) => ({
          id: String(item.id),
          title: String(item.title),
          quantity: 1,
          unit_price: Number(item.price),
          currency_id: 'BRL',
        })),
        payer: { name: payer.name },
        ...backUrls,
      },
    })

    res.json({
      id: result.id,
      checkout_url: isTestToken ? result.sandbox_init_point : result.init_point,
    })
  } catch (error) {
    const detail = error?.cause ?? error?.message ?? error
    console.error('❌ Erro MP:', JSON.stringify(detail, null, 2))
    const message = !isProduction
      ? `Erro MP: ${JSON.stringify(detail)}`
      : 'Erro ao criar preferência de pagamento.'
    res.status(500).json({ error: message })
  }
})

// ── Webhook Mercado Pago ─────────────────────────────────────
app.post('/api/webhook', async (req, res) => {
  res.sendStatus(200)

  const { type, data } = req.body
  if (type !== 'payment' || !data?.id) return

  try {
    const payment = await new Payment(mp).get({ id: data.id })
    if (!payment || payment.status !== 'approved') return

    const ref = payment.external_reference
    const order = ref ? getOrder(ref) : null

    if (!order) {
      console.warn('⚠️  Pedido não encontrado para ref:', ref)
      return
    }

    const payload = {
      payment_id: payment.id,
      status: payment.status,
      amount: payment.transaction_amount,
      date: new Date().toISOString(),
      payer: {
        name: order.payerName,
        phone: order.payerPhone,
      },
      gift_ids: order.giftIds,
    }

    console.log('✅ Pagamento aprovado:', JSON.stringify(payload, null, 2))

    if (N8N_WEBHOOK_URL) {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      console.log('📨 Notificação enviada para n8n')
    }
  } catch (err) {
    console.error('❌ Erro no webhook:', err)
  }
})

// ── SPA fallback ─────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
