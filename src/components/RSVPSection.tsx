import { useState } from 'react'
import './RSVPSection.css'

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeuP1oUeo5SEPTGynaC4fsZ1evHz4BQgg6fkBnWX6-Kp-diqQ/viewform'

export default function RSVPSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const goToGifts = () => {
    document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToCeremony = () => {
    document.getElementById('ceremony')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`rsvp-section ${isSubmitted ? 'rsvp-section--submitted' : ''}`}>
      <div className="rsvp-container">
        <h2 className="rsvp-title">{isSubmitted ? 'Presença Confirmada' : 'Confirme sua Presença'}</h2>

        {isSubmitted ? (
          <p className="rsvp-text">
            Presença confirmada com sucesso! Muito obrigado 💛
            <br />
            <button className="rsvp-gifts-link" onClick={goToGifts}>
              Ver lista de presentes
            </button>
            <br />
            <button className="rsvp-gifts-link" onClick={goToCeremony}>
              Ver local da cerimônia
            </button>
          </p>
        ) : (
          <>
            <p className="rsvp-text">
              Contamos com a sua presença! Por favor, preencha o formulário até a data indicada no convite.
            </p>

            <div className="rsvp-card">
              <div className="rsvp-card-monogram">
                <span className="rsvp-monogram-initials">P•S</span>
                <span className="rsvp-monogram-names">Patrick & Sabrina</span>
                <span className="rsvp-monogram-date">01 | 08 | 2026</span>
              </div>
              <p className="rsvp-card-text">
                Clique no botão abaixo para abrir o formulário de confirmação de presença.
              </p>
              <a
                className="rsvp-button rsvp-button--primary"
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Confirmar presença
              </a>
              <button
                className="rsvp-button rsvp-button--secondary"
                onClick={() => setIsSubmitted(true)}
              >
                Já confirmei ✓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
