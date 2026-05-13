import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface DigitalTallyProps {
  target: string
}

function DigitalTally({ target }: DigitalTallyProps) {
  const displayRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    if (!displayRef.current) return

    function animate() {
      const finalString = target
      let iteration = 0

      function shuffle() {
        if (!displayRef.current) return
        const newStr = finalString.split('').map((letter, index) => {
          if (index < iteration) return finalString[index]
          if (letter === '.') return '.'
          if (letter === '%') return '%'
          if (letter === '+') return '+'
          return '0123456789'[Math.floor(Math.random() * 10)]
        }).join('')

        displayRef.current.innerText = newStr

        if (iteration <= finalString.length) {
          iteration += 0.5
        }

        if (iteration <= finalString.length) {
          frameRef.current = requestAnimationFrame(shuffle)
        }
      }

      shuffle()
    }

    const trigger = ScrollTrigger.create({
      trigger: displayRef.current,
      start: 'top 85%',
      onEnter: () => {
        if (!hasAnimatedRef.current) {
          hasAnimatedRef.current = true
          animate()
        }
      },
    })

    return () => {
      cancelAnimationFrame(frameRef.current)
      trigger.kill()
    }
  }, [target])

  return (
    <div
      ref={displayRef}
      className="font-mono text-5xl md:text-7xl text-white"
      style={{ fontWeight: 300 }}
    >
      0
    </div>
  )
}

const metrics = [
  { value: '99.9%', label: 'PLATFORM UPTIME', active: true },
  { value: '50+', label: 'TENANTS SERVED', active: true },
  { value: '100MB+', label: 'DOCUMENT PROCESSING', active: false },
  { value: '5+', label: 'YEARS EXPERIENCE', active: true },
]

export default function Metrics() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.metric-item', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-[15vh]"
      style={{ background: '#050505' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="mono-label mb-6" style={{ color: '#ff3d3d' }}>IMPACT</p>
        <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-light tracking-[-0.01em] uppercase mb-16">
          Metrics
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, i) => (
            <div key={i} className="metric-item">
              <div className="flex items-center justify-center gap-2 mb-4">
                {metric.active && <span className="metric-dot" />}
                <DigitalTally target={metric.value} />
              </div>
              <span className="mono-label" style={{ fontSize: '0.6rem', color: '#777' }}>
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
