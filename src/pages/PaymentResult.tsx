import { gifts } from '../data/gifts'
import './PaymentResult.css'

type Status = 'sucesso' | 'pendente' | 'falha'

const config: Record<Status, { icon: string; title: string; message: string; color: string }> = {
  sucesso: {
    icon: '🎉',
    title: 'Pagamento confirmado!',
    message: 'Seu presente foi registrado com sucesso. Patrick & Sabrina agradecem de coração pelo carinho! 💕',
    color: '#4caf50',
  },
  pendente: {
    icon: '⏳',
    title: 'Pagamento em análise',
    message: 'Seu pagamento está sendo processado. Assim que confirmado, seu presente estará garantido!',
    color: '#f59e0b',
  },
  falha: {
    icon: '😕',
    title: 'Pagamento não concluído',
    message: 'Houve um problema com o pagamento. Você pode tentar novamente ou escolher outra forma de pagamento.',
    color: '#e74c3c',
  },
}

function getLastOrder(): { giftIds: number[]; name: string } | null {
  try {
    const raw = localStorage.getItem('wedding_last_order')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function buildCardUrl(giftIds: number[], name: string) {
  const ids = giftIds.join(',')
  const param = giftIds.length === 1 ? `presente=${ids}` : `presentes=${ids}`
  const base = `/cartao?${param}`
  return name.trim() ? `${base}&nome=${encodeURIComponent(name.trim())}` : base
}

export default function PaymentResult() {
  const pathname = window.location.pathname
  const status: Status = pathname.includes('sucesso')
    ? 'sucesso'
    : pathname.includes('pendente')
    ? 'pendente'
    : 'falha'

  const params = new URLSearchParams(window.location.search)
  const paymentId = params.get('payment_id')

  const { icon, title, message, color } = config[status]

  const order = status === 'sucesso' ? getLastOrder() : null
  const purchasedGifts = order
    ? order.giftIds.map((id) => gifts.find((g) => g.id === id)).filter(Boolean)
    : []

  return (
    <div className="pr-page">
      <div className="pr-card">
        <div className="pr-icon" style={{ color }}>{icon}</div>

        <div className="pr-logo">Patrick & Sabrina</div>
        <div className="pr-date">01 · 08 · 2026</div>

        <div className="pr-divider" />

        <h1 className="pr-title" style={{ color }}>{title}</h1>
        <p className="pr-message">{message}</p>

        {paymentId && (
          <p className="pr-id">ID do pagamento: <strong>{paymentId}</strong></p>
        )}

        <div className="pr-actions">
          {status === 'sucesso' && order && purchasedGifts.length > 0 && (
            <a
              href={buildCardUrl(order.giftIds, order.name)}
              className="pr-btn pr-btn-primary"
            >
              🎁 Ver meu cartão de presente{purchasedGifts.length > 1 ? 's' : ''}
            </a>
          )}

          {status === 'falha' && (
            <a href="/presentes" className="pr-btn pr-btn-primary">
              Tentar novamente
            </a>
          )}

          <a href="/" className="pr-btn pr-btn-secondary">
            Voltar ao site
          </a>
        </div>
      </div>
    </div>
  )
}
