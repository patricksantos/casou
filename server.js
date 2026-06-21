import 'dotenv/config'
import express from 'express'
import path from 'path'
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

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// ── Criar preferência de pagamento ──────────────────────────
app.post('/api/criar-pagamento', async (req, res) => {
  try {
    const { items, payer, origin } = req.body

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
    const body = {
      items: items.map((item) => ({
        id: String(item.id),
        title: String(item.title),
        quantity: 1,
        unit_price: Number(item.price),
        currency_id: 'BRL',
      })),
      payer: {
        name: payer.name,
      },
      metadata: {
        payer_name: payer.name,
        payer_phone: payer.phone,
        gift_ids: items.map((i) => String(i.id)).join(','),
      },
      ...backUrls,
    }

    const result = await preference.create({ body })

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
  res.sendStatus(200) // responde imediatamente ao MP

  const { type, data } = req.body
  if (type !== 'payment' || !data?.id) return

  try {
    const payment = await new Payment(mp).get({ id: data.id })
    if (payment.status !== 'approved') return

    const pref = await new Preference(mp).get({ preferenceId: payment.preference_id })
    const meta = pref.metadata || {}

    const giftIds = meta.gift_ids
      ? meta.gift_ids.split(',').map(Number).filter(Boolean)
      : []

    const payload = {
      payment_id: payment.id,
      status: payment.status,
      amount: payment.transaction_amount,
      date: new Date().toISOString(),
      payer: {
        name: meta.payer_name || '',
        phone: meta.payer_phone || '',
      },
      gift_ids: giftIds,
      preference_id: payment.preference_id,
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
