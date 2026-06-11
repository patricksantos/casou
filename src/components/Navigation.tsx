import { useState, useEffect } from 'react'
import './Navigation.css'

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDarkBackground, setIsDarkBackground] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const detectBackground = (scrollY: number) => {
    const heroBanner = document.getElementById('pre-wedding')
    if (heroBanner) {
      const isDark = scrollY < heroBanner.offsetHeight - 100
      setIsDarkBackground(isDark)
    }
  }

  useEffect(() => {
    detectBackground(window.scrollY)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      detectBackground(currentScrollY)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
  }

  const menuItems = [
    { id: 'pre-wedding', label: 'FOTOS' },
    { id: 'countdown', label: 'CONTAGEM' },
    { id: 'welcome', label: 'O CASAL' },
    { id: 'gifts', label: 'PRESENTES' },
    { id: 'rsvp', label: 'CONFIRMAR PRESENÇA' },
    { id: 'ceremony', label: 'CERIMÔNIA' },
  ]

  return (
    <nav className={`navbar ${isVisible ? 'visible' : 'hidden'} ${isDarkBackground ? 'dark-bg' : 'light-bg'}`}>
      <div className="navbar-container">
        <h1 className="navbar-title">
          <span className="title-desktop">P+S</span>
          <span className="title-mobile">Patrick & Sabrina</span>
        </h1>
        
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          {menuItems.map(item => (
            <li key={item.id}>
              <button 
                className={`navbar-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
