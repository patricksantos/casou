import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { gifts } from '../data/gifts'
import './Cart.css'

export default function Cart() {
  const { items, removeItem, clearCart, total, count, cartOpen, openCart, closeCart } = useCart()

  const [showCheckout, setShowCheckout] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const cartGifts = items.map((id) => gifts.find((g) => g.id === id)!).filter(Boolean)

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (name.trim().length < 2)
      newErrors.name = 'Informe seu nome completo.'
    if (phone.replace(/\D/g, '').length < 10)
      newErrors.phone = 'Informe um telefone válido com DDD.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartGifts.map((g) => ({ id: g.id, title: g.title, price: g.price })),
          payer: { name, phone },
          origin: window.location.origin,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao processar pagamento.')
      }

      const data = await res.json()
      localStorage.setItem(
        'wedding_last_order',
        JSON.stringify({ giftIds: cartGifts.map((g) => g.id), name })
      )
      clearCart()
      window.location.href = data.checkout_url
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao processar pagamento. Tente novamente.')
      setSubmitting(false)
    }
  }

  const resetCheckout = () => {
    setShowCheckout(false)
    setName('')
    setPhone('')
    setErrors({})
    setSubmitError('')
  }

  return (
    <>
      {count > 0 && (
        <button className="cart-fab" onClick={openCart} aria-label="Abrir carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="cart-badge">{count}</span>
        </button>
      )}

      {cartOpen && <div className="cart-backdrop" onClick={() => closeCart()} />}

      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Meu Carrinho</h3>
          <button className="cart-drawer-close" onClick={() => closeCart()}>✕</button>
        </div>

        {cartGifts.length === 0 ? (
          <div className="cart-empty">
            <span>🛒</span>
            <p>Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartGifts.map((gift) => (
                <div key={gift.id} className="cart-item">
                  <span className="cart-item-emoji">🎁</span>
                  <div className="cart-item-info">
                    <p className="cart-item-title">{gift.title}</p>
                    <p className="cart-item-price">
                      R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(gift.id)} aria-label="Remover">✕</button>
                </div>
              ))}
            </div>

            <div className="cart-total-row">
              <span>Total</span>
              <span className="cart-total-value">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="cart-footer">
              <button className="cart-checkout-btn" onClick={() => setShowCheckout(true)}>
                Finalizar pedido
              </button>
            </div>
          </>
        )}
      </div>

      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <div className="checkout-modal-header">
              <h3>Finalizar pedido</h3>
              <button className="checkout-close" onClick={resetCheckout}>✕</button>
            </div>

            <div className="checkout-summary">
              <span>{count} {count === 1 ? 'presente' : 'presentes'}</span>
              <strong>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="checkout-field">
                <label>Seu nome</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
                  }}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="checkout-field">
                <label>Telefone (WhatsApp)</label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => {
                    setPhone(maskPhone(e.target.value))
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
                  }}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>

{submitError && <p className="submit-error">{submitError}</p>}

              <button type="submit" className="checkout-submit-btn" disabled={submitting}>
                {submitting ? 'Aguarde...' : 'Ir para o pagamento →'}
              </button>

              <p className="checkout-hint">
                Você será redirecionado ao Mercado Pago para concluir o pagamento com segurança 🔒
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
