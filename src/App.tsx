import { useState } from 'react'
import HeroBanner from './components/HeroBanner'
import WelcomeSection from './components/WelcomeSection'
import CountdownSection from './components/CountdownSection'
import CerimonySection from './components/CerimonySection'
import GiftRegistry from './components/GiftRegistry'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  return (
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
        <section id="ceremony" className="section">
          <CerimonySection />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
