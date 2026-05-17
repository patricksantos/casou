import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">Patrick & Sabrina</p>
        <p className="footer-date">01.08.2026</p>
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Todos os direitos reservados</p>
      </div>
    </footer>
  )
}
