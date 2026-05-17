import { useState } from 'react'
import './GiftRegistry.css'

interface Gift {
  id: number
  title: string
  description: string
  price: number
  icon: string
  category: string
}

export default function GiftRegistry() {
  const [gifts] = useState<Gift[]>([
    {
      id: 1,
      title: 'Cartão Presente Rosa',
      description: 'Para presentear com flexibilidade',
      price: 171.68,
      icon: '🎀',
      category: 'Cartão',
    },
    {
      id: 2,
      title: 'Cartão Presente Bege',
      description: 'Para presentear com flexibilidade',
      price: 57.23,
      icon: '🎁',
      category: 'Cartão',
    },
    {
      id: 3,
      title: 'Cartão Presente Azul',
      description: 'Para presentear com flexibilidade',
      price: 114.45,
      icon: '💎',
      category: 'Cartão',
    },
    {
      id: 4,
      title: 'Adega 28 Garrafas Thermo',
      description: 'Para manter seus vinhos na temperatura ideal',
      price: 2500,
      icon: '🍷',
      category: 'Adega',
    },
    {
      id: 5,
      title: 'Adega 33 Garrafas Compressor',
      description: 'Sistema de resfriamento avançado para vinhos premium',
      price: 3800,
      icon: '🍾',
      category: 'Adega',
    },
    {
      id: 6,
      title: 'Aparelho de Jantar Polka Dots',
      description: 'Jogo completo com 20 peças em cerâmica',
      price: 450,
      icon: '🍽️',
      category: 'Louça',
    },
  ])

  return (
    <div className="gift-registry-container">
      <h2 className="section-title">Lista de Presentes</h2>
      <p className="section-subtitle">
        Compartilhe a nossa alegria! Escolha um presente especial para nós
      </p>

      <div className="gifts-grid">
        {gifts.map((gift) => (
          <div key={gift.id} className="gift-card">
            <div className="gift-image">
              <span className="gift-icon">{gift.icon}</span>
            </div>
            <h3 className="gift-title">{gift.title}</h3>
            <p className="gift-description">{gift.description}</p>
            <p className="gift-price">R$ {gift.price.toLocaleString('pt-BR')}</p>
            <button className="gift-button">Presentear</button>
          </div>
        ))}
      </div>
    </div>
  )
}
