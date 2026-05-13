import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Metrics from './sections/Metrics'
import Skills from './sections/Skills'
import Footer from './sections/Footer'

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="bg-void text-white min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Metrics />
      <Skills />
      <Footer />
    </div>
  )
}
