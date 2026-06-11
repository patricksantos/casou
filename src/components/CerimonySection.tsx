import './CerimonySection.css'

export default function CerimonySection() {
  return (
    <div className="ceremony-section">
      <div className="ceremony-container">
        <h2 className="ceremony-title">Cerimônia</h2>
        
        <div className="ceremony-content">
          <p className="ceremony-text">
            Aguardamos vocês às 18h! Por favor, não se atrasem.
          </p>
          <p className="ceremony-text">
            Após a cerimônia guiaremos todos os local da festa, iremos festejar até o amanhecer.
          </p>

          <div className="ceremony-map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4871.276985884678!2d-38.875127975983865!3d-12.24046475235735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x714390037e4682d%3A0xaa8bae5956eba3c!2sVillage%20Damha%20I!5e0!3m2!1spt-BR!2sbr!4v1779056432926!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
