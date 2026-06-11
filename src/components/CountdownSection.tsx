import { useState, useEffect } from 'react'
import './CountdownSection.css'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownSection() {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateCountdown = () => {
      const weddingDate = new Date('2026-08-01T00:00:00').getTime()
      const now = new Date().getTime()
      const distance = weddingDate - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown-container">
      <h2 className="countdown-title">Contagem Regressiva</h2>
      
      <div className="countdown-grid">
        <div className="countdown-card">
          <div className="countdown-number">{countdown.days}</div>
          <p className="countdown-label">Dias</p>
        </div>
        <div className="countdown-card">
          <div className="countdown-number">{String(countdown.hours).padStart(2, '0')}</div>
          <p className="countdown-label">Horas</p>
        </div>
        <div className="countdown-card">
          <div className="countdown-number">{String(countdown.minutes).padStart(2, '0')}</div>
          <p className="countdown-label">Minutos</p>
        </div>
        <div className="countdown-card">
          <div className="countdown-number">{String(countdown.seconds).padStart(2, '0')}</div>
          <p className="countdown-label">Segundos</p>
        </div>
      </div>
    </div>
  )
}
