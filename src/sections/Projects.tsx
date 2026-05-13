import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'Marineng Platform',
    description: 'Subscription-based maritime equipment marketplace with WebSocket real-time messaging, newsletter automation, and multi-role RBAC.',
    tech: ['Laravel', 'React.js', 'React Native', 'PostGIS'],
    image: '/project-marineng.png',
    year: '2024',
  },
  {
    title: 'ClientFocus SaaS',
    description: 'Multi-tenant SaaS with AI-powered session summarization, Stripe Connect payments, and 100+ user data isolation.',
    tech: ['Next.js 15', 'TypeScript', 'Firestore', 'Stripe'],
    image: '/projects-clientfocus.png',
    year: '2024',
  },
]

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const cards = gsap.utils.toArray<HTMLElement>('.project-card')

    gsap.set(cards, { '--x': '200px' } as Record<string, string>)

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          const skewAmount = Math.min(Math.max(velocity / 300, -15), 15)
          const scaleYAmount = 1 + Math.min(Math.abs(velocity) / 5000, 0.2)

          gsap.to(track, {
            skewX: skewAmount,
            scaleY: scaleYAmount,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          })

          cards.forEach((card, i) => {
            const direction = i % 2 === 0 ? 1 : -1
            const dist = Math.abs(velocity) * 0.002
            const yMove = Math.min(dist, 100) * direction
            const rotate = Math.min(dist, 30) * direction * 0.1

            gsap.to(card, {
              y: yMove,
              rotation: rotate,
              duration: 0.4,
              ease: 'back.out(1.2)',
              overwrite: 'auto',
            })
          })
        },
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section id="projects" className="relative" style={{ background: '#050505' }}>
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-[15vh] pb-16">
        <p className="mono-label mb-6" style={{ color: '#ff3d3d' }}>SELECTED WORK</p>
        <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-light tracking-[-0.01em] uppercase">
          Projects
        </h2>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div ref={containerRef} className="work-container" style={{ height: '300vh' }}>
        <div className="work-sticky">
          <div ref={trackRef} className="work-track">
            {projects.map((project, i) => (
              <div key={i} className="project-card">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-overlay">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="mono-label" style={{ fontSize: '0.6rem', color: '#ff3d3d' }}>
                      {project.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                  <p className="text-xs mb-4" style={{ color: '#777', lineHeight: 1.5 }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, j) => (
                      <span
                        key={j}
                        className="mono-label"
                        style={{
                          fontSize: '0.55rem',
                          padding: '0.3rem 0.6rem',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.03)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
