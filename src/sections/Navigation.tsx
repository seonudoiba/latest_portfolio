import { useEffect, useRef, useState } from 'react'

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-widest text-white">I.A.</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('about')} className="nav-link">About</button>
          <button onClick={() => scrollTo('projects')} className="nav-link">Projects</button>
          <button onClick={() => scrollTo('skills')} className="nav-link">Skills</button>
          <button onClick={() => scrollTo('contact')} className="nav-link">Contact</button>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <span className="mono-label">01-ABOUT</span>
          <span className="text-text-secondary">|</span>
          <span className="mono-label">02-PORTFOLIO</span>
        </div>
      </div>
    </nav>
  )
}
