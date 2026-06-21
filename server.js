import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { MercadoPagoConfig, Preference } from 'mercadopago'

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

const mp = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// ── Criar preferência de pagamento ──────────────────────────
app.post('/api/criar-pagamento', async (req, res) => {
  try {
    const { items, payer, origin } = req.body

    // auto_return exige HTTPS — só ativar em produção
    // back_urls funcionam em localhost (MP mostra botão "Voltar à loja")
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
      ...backUrls,
    }

    console.log('📦 Enviando preference:', JSON.stringify(body, null, 2))

    const result = await preference.create({ body })

    // TEST- → sandbox (pagamentos simulados)
    // APP_USR- → checkout real
    res.json({
      id: result.id,
      checkout_url: isTestToken ? result.sandbox_init_point : result.init_point,
    })
  } catch (error) {
    // Loga o erro completo do MP para facilitar diagnóstico
    const detail = error?.cause ?? error?.message ?? error
    console.error('❌ Erro MP:', JSON.stringify(detail, null, 2))

    const message = !isProduction
      ? `Erro MP: ${JSON.stringify(detail)}`
      : 'Erro ao criar preferência de pagamento.'

    res.status(500).json({ error: message })
  }
})

// ── SPA fallback ─────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
