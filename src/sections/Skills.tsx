import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    title: 'BACKEND',
    skills: ['Laravel 10/11', 'PHP 8+', 'Node.js', 'Express.js', 'Java Spring Boot', 'Eloquent ORM', 'Sanctum', 'PHPUnit'],
    bgColor: '#08080a',
  },
  {
    title: 'FRONTEND',
    skills: ['React.js', 'Next.js 15', 'Vue.js 3', 'React Native', 'TypeScript', 'Tailwind CSS', 'Vite', 'Livewire'],
    bgColor: '#0a0808',
  },
  {
    title: 'DATABASE',
    skills: ['MySQL', 'PostgreSQL', 'PostGIS', 'Firestore', 'Redis', 'Schema Design', 'Query Optimization', 'Indexing'],
    bgColor: '#080a08',
  },
  {
    title: 'CLOUD',
    skills: ['AWS EC2', 'Docker', 'Nginx', 'Apache', 'GitHub Actions', 'CI/CD', 'Linux Admin', 'SSL'],
    bgColor: '#08080a',
  },
  {
    title: 'INTEGRATIONS',
    skills: ['Stripe', 'Paystack', 'Stripe Connect', 'Amadeus API', 'Claude AI', 'WebSocket', 'REST API', 'GraphQL'],
    bgColor: '#0a0808',
  },
]

const bgTechs = ['REACT', 'PHP', 'LARAVEL', 'AWS', 'DOCKER']

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    if (!section || !title) return

    const panels = gsap.utils.toArray<HTMLElement>('.skill-panel')

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const index = Math.min(
          Math.floor(self.progress * (bgTechs.length - 1)),
          bgTechs.length - 1
        )
        title.innerText = bgTechs[index]
      },
    })

    panels.forEach((panel) => {
      gsap.fromTo(
        panel.querySelector('.skill-grid'),
        { scale: 0.8, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        }
      )
    })

    return () => {
      st.kill()
    }
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="skills-section relative"
    >
      {/* Background sticky text */}
      <div className="skills-overlay">
        <div ref={titleRef} className="skill-title">
          REACT
        </div>
      </div>

      {/* Section Header */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-[15vh] pb-16">
        <p className="mono-label mb-6" style={{ color: '#ff3d3d' }}>TECHNICAL TOOLKIT</p>
        <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-light tracking-[-0.01em] uppercase">
          Skills
        </h2>
      </div>

      {/* Skill Panels */}
      {skillCategories.map((category, i) => (
        <div key={i} className="skill-panel" style={{ background: category.bgColor }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <div className="mb-8">
              <span className="mono-label" style={{ color: '#ff3d3d', fontSize: '0.6rem' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-medium mt-2 uppercase tracking-wider">
                {category.title}
              </h3>
            </div>
            <div className="skill-grid">
              {category.skills.map((skill, j) => (
                <div key={j} className="skill-tag">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
