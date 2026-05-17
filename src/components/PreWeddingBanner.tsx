import './PreWeddingBanner.css'

export default function PreWeddingBanner() {
  const photos = [
    { id: 1, title: 'Momento 1', color: '#e8d5c4' },
    { id: 2, title: 'Momento 2', color: '#d4a574' },
    { id: 3, title: 'Momento 3', color: '#c9956b' },
    { id: 4, title: 'Momento 4', color: '#e8d5c4' },
  ]

  return (
    <div className="pre-wedding-container">
      <h2 className="section-title">Fotos do Pré-Wedding</h2>
      <p className="section-subtitle">Nossos momentos especiais antes do grande dia</p>
      <div className="banner-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="banner-card" style={{ backgroundColor: photo.color }}>
            <div className="photo-placeholder">
              <span className="photo-number">{photo.id}</span>
            </div>
            <p className="photo-title">{photo.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
