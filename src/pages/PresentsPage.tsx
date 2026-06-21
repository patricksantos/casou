import { useEffect, useState } from 'react'
import { CartProvider } from '../context/CartContext'
import { useCart } from '../context/CartContext'
import Cart from '../components/Cart'
import Footer from '../components/Footer'
import { gifts } from '../data/gifts'
import './PresentsPage.css'

const heroPhoto = new URL('../img/horizontal/DSC_1256.jpeg', import.meta.url).href

function GiftGrid() {
  const { items, addItem, removeItem } = useCart()

  const toggle = (id: number) => {
    if (items.includes(id)) removeItem(id)
    else addItem(id)
  }

  return (
    <div className="pp-grid">
      {gifts.map((gift, index) => {
        const inCart = items.includes(gift.id)
        return (
          <div
            key={gift.id}
            className={`pp-card ${inCart ? 'pp-card-active' : ''}`}
            style={{ '--i': index } as React.CSSProperties}
          >
            <div className="pp-card-top">
              <span className="pp-card-num">{String(gift.id).padStart(2, '0')}</span>
              <span className="pp-card-price">
                R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <span className="pp-card-emoji">{gift.icon}</span>

            <h3 className="pp-card-title">{gift.title}</h3>
            <p className="pp-card-desc">{gift.description}</p>

            <button
              className={`pp-card-btn ${inCart ? 'pp-card-btn-active' : ''}`}
              onClick={() => toggle(gift.id)}
            >
              {inCart ? '✓ Adicionado' : '+ Adicionar'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

function CheckoutBar() {
  const { count, total, openCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (count > 0) {
      setMounted(true)
    } else {
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [count])

  if (!mounted) return null

  return (
    <div className={`pp-checkout-bar ${count > 0 ? 'pp-checkout-bar-open' : ''}`}>
      <div className="pp-checkout-bar-inner">
        <div className="pp-checkout-info">
          <span className="pp-checkout-count">
            {count} {count === 1 ? 'presente selecionado' : 'presentes selecionados'}
          </span>
          <span className="pp-checkout-total">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button className="pp-checkout-btn" onClick={openCart}>
          Finalizar pedido →
        </button>
      </div>
    </div>
  )
}

export default function PresentsPage() {
  return (
    <CartProvider>
      <div className="presents-page">

        <div className="pp-sticky-top">
          <header className="pp-header">
            <a href="/" className="pp-logo">P · S</a>
            <a href="/" className="pp-back">← Voltar ao site</a>
          </header>
          <CheckoutBar />
        </div>

        <section className="pp-hero" style={{ backgroundImage: `url(${heroPhoto})` }}>
          <p className="pp-eyebrow">Patrick & Sabrina · 01 · 08 · 2026</p>
          <h1 className="pp-title">
            Lista de<br />Presentes
          </h1>
        </section>

        <div className="pp-divider" />

        <main className="pp-main">
          <GiftGrid />
        </main>

        <Footer />
        <Cart />
      </div>
    </CartProvider>
  )
}
