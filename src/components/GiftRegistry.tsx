import { gifts } from '../data/gifts'
import './GiftRegistry.css'

export default function GiftRegistry() {
  return (
    <div className="gift-registry-container">
      <h2 className="section-title">Lista de Presentes</h2>
      <p className="section-subtitle">
        Preparamos uma lista especial com opções para todos os gostos. Escolha um presente e faça parte da nossa história!
      </p>

      <div className="gift-registry-preview">
        {gifts.slice(0, 4).map((gift) => (
          <div key={gift.id} className="gift-preview-item">
            <span className="gift-preview-icon">{gift.icon}</span>
          </div>
        ))}
        <div className="gift-preview-more">+{gifts.length - 4}</div>
      </div>

      <a href="/presentes" className="gift-registry-btn">
        Ver lista de presentes
      </a>
    </div>
  )
}
