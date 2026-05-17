import { useState, useEffect } from 'react'
import './HeroBanner.css'

export default function HeroBanner() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const photos = [
    new URL('../img/horizontal/DSC_0980.jpeg', import.meta.url).href,
    new URL('../img/horizontal/DSC_1256.jpeg', import.meta.url).href,
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index)
  }

  return (
    <div className="hero-banner">
      <div className="hero-images-container">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Foto ${index + 1}`}
            className={`hero-image ${index === currentPhotoIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-logo">
          <div className="initials-frame">
            <div className="frame-corner top-left"></div>
            <div className="frame-corner top-right"></div>
            <div className="frame-corner bottom-left"></div>
            <div className="frame-corner bottom-right"></div>
            <span className="initials">P•S</span>
          </div>
        </div>

        <h1 className="hero-names">Patrick & Sabrina</h1>
        <p className="hero-date">01 | 08 | 2026</p>
      </div>

      <button
        className="scroll-down-button"
        onClick={() => {
          const countdownSection = document.getElementById('countdown')
          if (countdownSection) {
            countdownSection.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        aria-label="Ir para próxima seção"
      >
        <svg className="arrow-down" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="white">
          <path d="M7 10L12 15L17 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
