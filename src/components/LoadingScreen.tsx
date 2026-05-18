import { useEffect, useState } from 'react'
import './LoadingScreen.css'

interface LoadingScreenProps {
  onLoadComplete: () => void
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Simula tempo de carregamento: primeiro aguarda, depois inicia fade e só então completa
    const waitMs = 2500
    const fadeMs = 600

    const startFade = setTimeout(() => setIsFading(true), waitMs)
    const finish = setTimeout(() => {
      setIsVisible(false)
      onLoadComplete()
    }, waitMs + fadeMs)

    return () => {
      clearTimeout(startFade)
      clearTimeout(finish)
    }
  }, [onLoadComplete])

  if (!isVisible) return null

  return (
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-initials-frame">
          <div className="loading-frame-corner top-left"></div>
          <div className="loading-frame-corner top-right"></div>
          <div className="loading-frame-corner bottom-left"></div>
          <div className="loading-frame-corner bottom-right"></div>
          <span className="loading-initials">P•S</span>
        </div>
        <h1 className="loading-names">Patrick & Sabrina</h1>
        <p className="loading-date">01 | 08 | 2026</p>
      </div>
    </div>
  )
}
