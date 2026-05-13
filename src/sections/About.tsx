import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const blurLayerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      gsap.from(bodyRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      gsap.from(imageRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Depth focus slider
  useEffect(() => {
    const slider = sliderRef.current
    const blurLayer = blurLayerRef.current
    if (!slider || !blurLayer) return

    const handleInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      blurLayer.style.backdropFilter = `blur(${val}px)`
    }

    slider.addEventListener('input', handleInput)
    return () => slider.removeEventListener('input', handleInput)
  }, [])

  // Mouse-tracking focal point
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!blurLayerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const gradient = `radial-gradient(circle at ${x}% ${y}%, transparent 20%, black 60%)`
    blurLayerRef.current.style.maskImage = gradient
    blurLayerRef.current.style.webkitMaskImage = gradient
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-[15vh]"
      style={{ background: '#050505' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column */}
          <div>
            <p className="mono-label mb-6" style={{ color: '#ff3d3d' }}>ABOUT</p>
            <h2
              ref={headingRef}
              className="text-2xl sm:text-3xl lg:text-[2.5rem] font-light tracking-[-0.01em] uppercase leading-tight mb-10"
            >
              Engineer.<br />
              Problem Solver.<br />
              Builder.
            </h2>

            <div ref={bodyRef} className="space-y-6">
              <p className="text-sm leading-relaxed" style={{ color: '#777' }}>
                Full-Stack Software Engineer with 5+ years of experience building production-grade
                web applications, RESTful APIs, and enterprise platforms. Core expertise in Laravel
                and PHP 8+ backend engineering, with strong proficiency in React.js, Next.js, Vue.js,
                and React Native for frontend and mobile development.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#777' }}>
                Delivered multi-tenant SaaS systems, IoT telemetry pipelines, real-time WebSocket
                communication, and payment integrations using Stripe and Paystack across oil and gas,
                finance, maritime, and hospitality sectors.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#777' }}>
                Currently architecting mission-critical platforms at Hypercom Network — powering
                Nigeria's first fully automated unmanned fuel stations and maritime marketplaces
                serving operators across West Africa.
              </p>

              <div className="flex flex-wrap gap-3 pt-6">
                <a href="mailto:biodunrahman1@gmail.com" className="btn-magnetic">Email</a>
                <a href="https://github.com/seonudoiba" target="_blank" rel="noopener noreferrer" className="btn-magnetic">GitHub</a>
                <a href="https://abiorepo.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-magnetic">Portfolio</a>
              </div>
            </div>
          </div>

          {/* Right Column - Profile with depth focus */}
          <div ref={imageRef} className="flex flex-col justify-center">
            <div
              className="depth-figure"
              onMouseMove={handleImageMouseMove}
            >
              <img
                src="/assets/profile.jpg"
                alt="Igbehinadun Abiodun"
                className="depth-img"
              />
              <div ref={blurLayerRef} className="depth-blur-layer" />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="mono-label" style={{ fontSize: '0.6rem' }}>
                ADJUST FOCUS
              </span>
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max="20"
                defaultValue="0"
                step="0.1"
                className="depth-slider"
                style={{ width: '60%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
