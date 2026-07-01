import './WelcomeSection.css'

export default function WelcomeSection() {
  const photos = [
    new URL('../img/vertical/22.jpg', import.meta.url).href,
    new URL('../img/vertical/3.jpg', import.meta.url).href,
    new URL('../img/vertical/9.jpg', import.meta.url).href,
    new URL('../img/vertical/6.jpg', import.meta.url).href,
    new URL('../img/vertical/18.jpg', import.meta.url).href,
    new URL('../img/vertical/1.jpg', import.meta.url).href,
  ]

  return (
    <div className="welcome-section">
      <div className="welcome-container">
        <div className="welcome-content">
          <h2 className="welcome-title">O Casal</h2>
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <div key={index} className="gallery-item">
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="gallery-image"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <p className="welcome-text">
            Criamos esse site para compartilhar com vocês os detalhes da organização do nosso casamento. Estamos muito felizes e contamos com a presença de todos no nosso grande dia! Aqui vocês encontrarão também dicas para hospedagem, salão de beleza, trajes, estacionamento, etc.
          </p>

          <p className="welcome-text">
            Ah, é importante também confirmar sua presença. Para isto contamos com sua ajuda clicando no menu "Confirme sua Presença" e preenchendo os dados necessários. Para nos presentear, escolha qualquer item da Lista de Casamento, seja um item de algum dos sites, lojas físicas, ou então vocês podem utilizar a opção de cotas. Fiquem à vontade!
          </p>

          <p className="welcome-text">
            Aguardamos vocês no nosso grande dia!
          </p>
        </div>
      </div>
    </div>
  )
}
