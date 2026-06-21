import { gifts } from '../data/gifts'
import { useCart } from '../context/CartContext'
import './GiftRegistry.css'

export default function GiftRegistry() {
  const { items, addItem, removeItem } = useCart()

  const toggle = (id: number) => {
    if (items.includes(id)) removeItem(id)
    else addItem(id)
  }

  return (
    <div className="gift-registry-container">
      <h2 className="section-title">Lista de Presentes</h2>
      <p className="section-subtitle">
        Compartilhe a nossa alegria! Escolha um presente especial para nós
      </p>

      <div className="gifts-grid">
        {gifts.map((gift) => {
          const inCart = items.includes(gift.id)
          return (
            <div key={gift.id} className={`gift-card ${inCart ? 'in-cart' : ''}`}>
              <div className="gift-image">
                <span className="gift-icon">{gift.icon}</span>
              </div>
              <h3 className="gift-title">{gift.title}</h3>
              <p className="gift-description">{gift.description}</p>
              <p className="gift-price">
                R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <button
                className={`gift-button ${inCart ? 'gift-button-added' : ''}`}
                onClick={() => toggle(gift.id)}
                title={inCart ? 'Clique para remover' : 'Adicionar ao carrinho'}
              >
                {inCart ? '✓ Adicionado' : 'Adicionar ao carrinho'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
