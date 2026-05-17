import { useEffect, useState } from 'react'
import './LoadingScreen.css'

interface LoadingScreenProps {
  onLoadComplete: () => void
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simula tempo de carregamento
    const timer = setTimeout(() => {
      setIsVisible(false)
      onLoadComplete()
    }, 2500) // 2.5 segundos

    return () => clearTimeout(timer)
  }, [onLoadComplete])

  if (!isVisible) return null

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-frame">
          <p className="loading-initials">P•S</p>
        </div>
        <h1 className="loading-title">PATRICK & SABRINA</h1>
        <p className="loading-date">01 | 08 | 2026</p>
      </div>
    </div>
  )
}
