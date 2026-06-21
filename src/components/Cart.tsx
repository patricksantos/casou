import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { gifts } from '../data/gifts'
import './Cart.css'

// ⚠️ Substitua pelo seu número de WhatsApp (código do país + DDD + número, sem espaços ou símbolos)
// Exemplo: '5511987654321'
const WHATSAPP_NUMBER = '5511999999999'

type PaymentMethod = 'pix' | 'link'

export default function Cart() {
  const { items, removeItem, clearCart, total, count, cartOpen, openCart, closeCart } = useCart()

  const [showCheckout, setShowCheckout] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('pix')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const cartGifts = items.map((id) => gifts.find((g) => g.id === id)!).filter(Boolean)

  const closeDrawer = () => {
    closeCart()
  }

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (name.trim().length < 2)
      newErrors.name = 'Informe seu nome completo.'
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10)
      newErrors.phone = 'Informe um telefone válido com DDD.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const paymentLabel = payment === 'pix' ? 'PIX' : 'Link de pagamento'
    const giftsList = cartGifts
      .map((g) => `• ${g.title} — R$ ${g.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .join('\n')

    const msg = [
      '🎁 *Novo pedido de presente!*',
      '',
      `*Nome:* ${name}`,
      `*Telefone:* ${phone}`,
      `*Pagamento preferido:* ${paymentLabel}`,
      '',
      '*Presentes escolhidos:*',
      giftsList,
      '',
      `*Total:* R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    ].join('\n')

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setConfirmed(true)
    clearCart()
  }

  const resetAll = () => {
    closeCart()
    setShowCheckout(false)
    setConfirmed(false)
    setName('')
    setPhone('')
    setPayment('pix')
    setErrors({})
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

      {cartOpen && <div className="cart-backdrop" onClick={closeDrawer} />}

      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Meu Carrinho</h3>
          <button className="cart-drawer-close" onClick={closeDrawer}>✕</button>
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
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(gift.id)}
                    aria-label="Remover presente"
                  >
                    ✕
                  </button>
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
            {confirmed ? (
              <div className="checkout-confirmed">
                <div className="checkout-confirmed-icon">✓</div>
                <h3>Pedido enviado!</h3>
                <p>
                  Em breve você receberá o{' '}
                  {payment === 'pix' ? 'código PIX' : 'link de pagamento'} no número informado.
                </p>
                <p className="checkout-thanks">Obrigado, {name}! 💕</p>
                <button className="checkout-submit-btn" onClick={resetAll}>Fechar</button>
              </div>
            ) : (
              <>
                <div className="checkout-modal-header">
                  <h3>Finalizar pedido</h3>
                  <button className="checkout-close" onClick={() => setShowCheckout(false)}>✕</button>
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
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
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
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                      }}
                      className={errors.phone ? 'input-error' : ''}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="checkout-field">
                    <label>Como prefere pagar?</label>
                    <div className="payment-options">
                      <label className={`payment-option ${payment === 'pix' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="pix"
                          checked={payment === 'pix'}
                          onChange={() => setPayment('pix')}
                        />
                        <span className="payment-icon">🔑</span>
                        <span>PIX</span>
                      </label>
                      <label className={`payment-option ${payment === 'link' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="link"
                          checked={payment === 'link'}
                          onChange={() => setPayment('link')}
                        />
                        <span className="payment-icon">🔗</span>
                        <span>Link de pagamento</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="checkout-submit-btn">
                    Enviar pedido
                  </button>

                  <p className="checkout-hint">
                    Você será redirecionado ao WhatsApp para confirmar. Enviaremos o pagamento em seguida 💕
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
