import { useEffect, useRef } from 'react'

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const textEl = textRef.current
    if (!container || !textEl) return

    // Split text into characters
    const text = "LET'S BUILD THE FUTURE."
    textEl.innerHTML = ''
    text.split('').forEach((char) => {
      const span = document.createElement('span')
      span.className = 'orbital-char'
      span.textContent = char === ' ' ? '\u00A0' : char
      textEl.appendChild(span)
    })

    const handleMouseMove = (e: MouseEvent) => {
      if (!container || !textEl) return
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const maxDist = Math.max(rect.width, rect.height)
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const chars = textEl.querySelectorAll('.orbital-char')
      chars.forEach((char) => {
        const charRect = char.getBoundingClientRect()
        const charCenterX = charRect.left + charRect.width / 2 - centerX
        const charCenterY = charRect.top + charRect.height / 2 - centerY
        const dist = Math.sqrt(charCenterX ** 2 + charCenterY ** 2)
        const force = Math.max(0, (maxDist - dist) / maxDist)
        const angle = Math.atan2(charCenterY - mouseY, charCenterX - mouseX)
        const pullX = Math.cos(angle) * force * 40
        const pullY = Math.sin(angle) * force * 40
        ;(char as HTMLElement).style.transform = `translate(${-pullX}px, ${-pullY}px)`
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <footer
      id="contact"
      ref={containerRef}
      className="footer-section"
    >
      <h2 ref={textRef} className="orbital-text">
        LET'S BUILD THE FUTURE.
      </h2>

      <a
        href="mailto:biodunrahman1@gmail.com"
        className="footer-cta"
      >
        START PROJECT
      </a>

      {/* Footer info */}
      <div
        className="absolute bottom-8 left-0 w-full px-6 lg:px-10"
        style={{ zIndex: 5 }}
      >
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold tracking-widest">I.A.</span>
            <span className="text-text-secondary text-xs">|</span>
            <span className="mono-label" style={{ fontSize: '0.6rem' }}>
              LAGOS, NIGERIA
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="mailto:biodunrahman1@gmail.com" className="mono-label hover:text-white transition-colors" style={{ fontSize: '0.6rem' }}>
              EMAIL
            </a>
            <a href="https://github.com/seonudoiba" target="_blank" rel="noopener noreferrer" className="mono-label hover:text-white transition-colors" style={{ fontSize: '0.6rem' }}>
              GITHUB
            </a>
            <span className="mono-label" style={{ fontSize: '0.6rem', color: '#777' }}>
              +234-811-680-9425
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
