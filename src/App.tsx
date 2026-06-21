import { useState } from 'react'
import HeroBanner from './components/HeroBanner'
import WelcomeSection from './components/WelcomeSection'
import CountdownSection from './components/CountdownSection'
import CerimonySection from './components/CerimonySection'
import RSVPSection from './components/RSVPSection'
import GiftRegistry from './components/GiftRegistry'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import Cart from './components/Cart'
import { CartProvider } from './context/CartContext'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <CartProvider>
      <div className="app">
        {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <main>
          <section id="pre-wedding" className="hero-section">
            <HeroBanner />
          </section>
          <section id="countdown" className="section">
            <CountdownSection />
          </section>
          <section id="welcome" className="section">
            <WelcomeSection />
          </section>
          <section id="gifts" className="section">
            <GiftRegistry />
          </section>
          <section id="rsvp" className="section">
            <RSVPSection />
          </section>
          <section id="ceremony" className="section">
            <CerimonySection />
          </section>
        </main>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  )
}

export default App
