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

  const detectBackground = (scrollY: number) => {
    const heroBanner = document.getElementById('pre-wedding')
    if (heroBanner) {
      // Está em fundo escuro se o scroll está dentro da altura do hero banner
      const isDark = scrollY < heroBanner.offsetHeight - 100
      setIsDarkBackground(isDark)
    }
  }

  useEffect(() => {
    // Detectar fundo ao carregar a página
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
    }
  }

  return (
    <nav className={`navbar ${isVisible ? 'visible' : 'hidden'} ${isDarkBackground ? 'dark-bg' : 'light-bg'}`}>
      <div className="navbar-container">
        <h1 className="navbar-title">P+S</h1>
        <ul className="navbar-menu">
          <li>
            <button 
              className={`navbar-link ${activeSection === 'pre-wedding' ? 'active' : ''}`}
              onClick={() => scrollToSection('pre-wedding')}
            >
              FOTOS
            </button>
          </li>
          <li>
            <button 
              className={`navbar-link ${activeSection === 'countdown' ? 'active' : ''}`}
              onClick={() => scrollToSection('countdown')}
            >
              CONTAGEM
            </button>
          </li>
          <li>
            <button 
              className={`navbar-link ${activeSection === 'welcome' ? 'active' : ''}`}
              onClick={() => scrollToSection('welcome')}
            >
              O CASAL
            </button>
          </li>
          <li>
            <button 
              className={`navbar-link ${activeSection === 'gifts' ? 'active' : ''}`}
              onClick={() => scrollToSection('gifts')}
            >
              PRESENTES
            </button>
          </li>
          <li>
            <button 
              className={`navbar-link ${activeSection === 'ceremony' ? 'active' : ''}`}
              onClick={() => scrollToSection('ceremony')}
            >
              CERIMÔNIA
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
