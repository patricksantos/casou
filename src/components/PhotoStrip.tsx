import { useEffect, useRef } from 'react'
import './PhotoStrip.css'

const photo = new URL('../img/horizontal/6.jpg', import.meta.url).href

export default function PhotoStrip() {
  const bgRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!bgRef.current || !wrapRef.current) return
      const top = wrapRef.current.getBoundingClientRect().top
      bgRef.current.style.transform = `translateY(${top * 0.08}px) scale(1.12)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="photo-strip" ref={wrapRef}>
      <div
        className="photo-strip-bg"
        ref={bgRef}
        style={{ backgroundImage: `url(${photo})` }}
      />
      <div className="photo-strip-overlay" />
      <div className="photo-strip-content">
        <div className="photo-strip-ornament">✦</div>
        <p className="photo-strip-quote">
          "O amor não se vê com os olhos, mas com a alma."
        </p>
        <div className="photo-strip-names">Patrick & Sabrina</div>
        <div className="photo-strip-date">01 · 08 · 2026</div>
      </div>
    </div>
  )
}
