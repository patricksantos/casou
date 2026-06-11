import { useRef, useState } from 'react'
import './RSVPSection.css'

// Cole aqui o link do campo "src" da aba Incorporar (<>) do seu Google Form
const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeuP1oUeo5SEPTGynaC4fsZ1evHz4BQgg6fkBnWX6-Kp-diqQ/viewform?embedded=true'

export default function RSVPSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const loadCount = useRef(0)

  const handleLoad = () => {
    loadCount.current += 1
    // O primeiro "load" é o carregamento inicial do form.
    // Os seguintes acontecem quando o Forms navega para a página de confirmação após o envio.
    if (loadCount.current > 1) {
      setIsSubmitted(true)
    }
  }

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
              Contamos com a sua presença! Por favor, preencha o formulário abaixo até a data indicada no convite.
            </p>

            <iframe
              className="rsvp-form"
              src={GOOGLE_FORM_EMBED_URL}
              title="Formulário de confirmação de presença"
              loading="lazy"
              onLoad={handleLoad}
            >
              Carregando…
            </iframe>
          </>
        )}
      </div>
    </div>
  )
}
