import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { gifts } from '../data/gifts'
import './GiftCardPage.css'

const couplePhoto = new URL('../img/vertical/DSC_1330.jpeg', import.meta.url).href

export default function GiftCardPage() {
  const params = new URLSearchParams(window.location.search)
  const giftId = parseInt(params.get('presente') || '0', 10)
  const guestName = params.get('nome') || ''
  const gift = gifts.find((g) => g.id === giftId)

  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sharing, setSharing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  if (!gift) {
    return (
      <div className="gift-card-page">
        <div className="card-not-found">
          <p>Presente não encontrado.</p>
          <a href="/" className="btn-back-site">Voltar ao site</a>
        </div>
      </div>
    )
  }

  const shareUrl = window.location.href

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const saveCard = async () => {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const canvas = await captureCard()
      const link = document.createElement('a')
      link.download = `presente-patrick-sabrina-${gift.id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setSaving(false)
    }
  }

  const buildHighResPhotoUrl = async (): Promise<string> => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
      img.src = couplePhoto
    })

    const headerEl = cardRef.current!.querySelector('.card-photo-header') as HTMLElement
    const { width, height } = headerEl.getBoundingClientRect()
    const SCALE = 4

    const pc = document.createElement('canvas')
    pc.width = Math.round(width * SCALE)
    pc.height = Math.round(height * SCALE)
    const ctx = pc.getContext('2d')!

    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = pc.width / pc.height

    let dw: number, dh: number, dx: number, dy: number
    if (imgAspect > canvasAspect) {
      dh = pc.height
      dw = dh * imgAspect
      dx = -(dw - pc.width) / 2
      dy = 0
    } else {
      dw = pc.width
      dh = dw / imgAspect
      dx = 0
      const excess = dh - pc.height
      dy = -(excess * 0.15)
    }
    ctx.drawImage(img, dx, dy, dw, dh)

    return pc.toDataURL('image/jpeg', 0.95)
  }

  const captureCard = async () => {
    const photoDataUrl = await buildHighResPhotoUrl()

    const canvas = await html2canvas(cardRef.current!, {
      useCORS: true,
      scale: 3,
      onclone: (_doc, el) => {
        const header = el.querySelector('.card-photo-header') as HTMLElement | null
        const img = el.querySelector('.card-photo-header img') as HTMLImageElement | null
        if (header && img) {
          header.style.backgroundImage = `url(${photoDataUrl})`
          header.style.backgroundSize = '100% 100%'
          img.style.display = 'none'
        }
      },
    })
    return canvas
  }

  const shareWhatsApp = async () => {
    if (!cardRef.current) return
    setSharing(true)
    try {
      const greeting = guestName ? `${guestName}, obrigado` : 'Obrigado'
      const text = `🎉 ${greeting} por fazer parte do nosso grande dia e tornar nossa história ainda mais especial! 💕\n\nPatrick & Sabrina · 01/08/2026`

      const canvas = await captureCard()
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      )
      const file = new File([blob], `presente-patrick-sabrina-${gift.id}.png`, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text })
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="gift-card-page">
      <div className="shareable-card" ref={cardRef}>

        <div className="card-photo-header">
          <img src={couplePhoto} alt="Patrick & Sabrina" />
          <div className="card-photo-gradient" />
          <div className="card-photo-text">
            <div className="card-initials">P · S</div>
            <div className="card-couple-names">Patrick & Sabrina</div>
            <div className="card-wedding-date">01 · 08 · 2026</div>
          </div>
        </div>

        <div className="card-gift-section">
          <p className="card-gift-label">presente especial</p>
          <span className="card-gift-emoji">🎁</span>
          <h2 className="card-gift-name">{gift.title}</h2>
          <p className="card-gift-description">{gift.description}</p>
          <div className="card-ornament">✦</div>
        </div>

        <div className="card-message-section">
          {guestName ? (
            <p className="card-message">
              {guestName}, obrigado por fazer parte do nosso grande dia e tornar nossa história ainda mais especial! 💕
            </p>
          ) : (
            <p className="card-message">
              Obrigado por fazer parte do nosso grande dia e tornar nossa história ainda mais especial! 💕
            </p>
          )}
        </div>

        <div className="card-footer-strip">
          Patrick & Sabrina · 01/08/2026
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-copy" onClick={copyLink}>
          {copied ? '✓ Link copiado!' : '🔗 Copiar link'}
        </button>
        <button className="btn-whatsapp" onClick={shareWhatsApp} disabled={sharing}>
          {sharing ? 'Preparando...' : 'WhatsApp'}
        </button>
      </div>

      <button className="btn-save" onClick={saveCard} disabled={saving}>
        {saving ? 'Salvando...' : '⬇ Salvar Arquivo'}
      </button>

      <a href="/" className="btn-back-site">← Voltar ao site</a>
    </div>
  )
}
