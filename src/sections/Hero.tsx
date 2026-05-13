import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const VERTEX_SHADER = `
attribute vec4 aVertexPosition;
void main() {
  gl_Position = aVertexPosition;
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float hue;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

mat2 rotate2D(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat2(c, -s, s, c);
}

vec3 hueShift(vec3 color, float hue) {
  float angle = hue * 6.28318530718;
  vec3 k = vec3(0.57735);
  return color * cos(angle) + cross(k, color) * sin(angle) + k * dot(k, color) * (1.0 - cos(angle));
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec2 mo = mouse;
  float dist = length(p);
  float angle = atan(p.y, p.x);
  float spiral = sin(dist * 6.0 - time * 1.5 + angle);
  float swirl = snoise(vec2(dist * 2.0 - time * 0.5, angle + time));
  vec2 distortedP = p + vec2(cos(angle + spiral + swirl), sin(angle + spiral + swirl)) * 0.3 * mo;
  float newDist = length(distortedP);
  float newAngle = atan(distortedP.y, distortedP.x) + time * 0.2 + dist * swirl * 0.5;
  float hueVar = hue + sin(newAngle * 2.0 + time * 0.3) * 0.1 + swirl * 0.1;
  vec3 c1 = vec3(0.04, 0.04, 0.05);
  vec3 c2 = vec3(0.10, 0.10, 0.12);
  vec3 c3 = vec3(0.25, 0.25, 0.30);
  vec3 c4 = vec3(0.05, 0.05, 0.06);
  vec3 c5 = vec3(0.15, 0.15, 0.18);
  float t = swirl * 0.5 + 0.5;
  float blend1 = smoothstep(0.0, 0.3, t);
  float blend2 = smoothstep(0.3, 0.6, t);
  float blend3 = smoothstep(0.6, 1.0, t);
  vec3 color = mix(mix(mix(mix(c1, c2, blend1), c3, blend2), c4, blend3), c5, smoothstep(0.4, 0.8, sin(newDist * 4.0 - time + swirl) * 0.5 + 0.5));
  color *= 0.8 + 0.2 * sin(newAngle * 5.0 + time);
  color = hueShift(color, hueVar);
  gl_FragColor = vec4(color, 1.0);
}
`

const CARD_CONFIGS = [
  { z: -100, rotateY: 15, opacity: 0.5, brightness: 1 },
  { z: -50, rotateY: 10, opacity: 0.6, brightness: 1 },
  { z: 0, rotateY: 5, opacity: 0.7, brightness: 1 },
  { z: 50, rotateY: -5, opacity: 0.8, brightness: 1 },
  { z: 100, rotateY: -10, opacity: 0.9, brightness: 1 },
  { z: 150, rotateY: -15, opacity: 1, brightness: 1.2 },
]

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardConstructorRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [time, setTime] = useState('')
  const frameRef = useRef<number>(0)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({})

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext
    if (!gl) return
    glRef.current = gl

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!canvas || !gl) return
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // Compile shaders
    function compileShader(src: string, type: number) {
      const shader = gl!.createShader(type)!
      gl!.shaderSource(shader, src)
      gl!.compileShader(shader)
      return shader
    }

    const vs = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER)
    const fs = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER)

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Create fullscreen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(program, 'aVertexPosition')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    uniformsRef.current = {
      time: gl.getUniformLocation(program, 'time'),
      resolution: gl.getUniformLocation(program, 'resolution'),
      mouse: gl.getUniformLocation(program, 'mouse'),
      hue: gl.getUniformLocation(program, 'hue'),
    }

    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2

      document.documentElement.style.setProperty('--mx', String(mouseX))
      document.documentElement.style.setProperty('--my', String(mouseY))

      if (cardConstructorRef.current) {
        cardConstructorRef.current.style.transform = `rotateY(${e.clientX * 0.02}deg) rotateX(${e.clientY * -0.02}deg)`
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    function render(timeMs: number) {
      if (!gl || !canvas) return
      const t = timeMs * 0.001

      gl.uniform2f(uniformsRef.current.resolution, canvas.width, canvas.height)
      gl.uniform2f(uniformsRef.current.mouse, mouseX * 0.5, mouseY * 0.5)
      gl.uniform1f(uniformsRef.current.time, t)
      gl.uniform1f(uniformsRef.current.hue, (Date.now() % 10000) / 10000 * 0.05)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frameRef.current = requestAnimationFrame(render)
    }
    frameRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Cascading text animation
  useEffect(() => {
    if (!titleRef.current) return
    const words = titleRef.current.querySelectorAll('.char-inner')
    gsap.to(words, {
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.08,
      delay: 0.5,
    })
  }, [])

  const titleText = 'Building mission-critical web applications, RESTful APIs, and enterprise platforms with precision engineering.'
  const titleWords = titleText.split(' ')

  return (
    <section id="hero" className="relative w-full" style={{ height: '100vh' }}>
      {/* WebGL Canvas Background */}
      <canvas
        ref={canvasRef}
        className="manifestation-overlay"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      />

      {/* 3D Card Stack */}
      <div className="manifestation-stage" style={{ zIndex: 0 }}>
        <div className="card-constructor" ref={cardConstructorRef}>
          {CARD_CONFIGS.map((cfg, i) => (
            <div
              key={i}
              className="manifestation-card"
              style={{
                transform: `translateZ(${cfg.z}px) rotateY(${cfg.rotateY}deg)`,
                opacity: cfg.opacity,
                filter: cfg.brightness !== 1 ? `brightness(${cfg.brightness})` : undefined,
              }}
            >
              <img src="/assets/blueprint-texture.jpg" alt="Technical Blueprint" />
            </div>
          ))}
        </div>
      </div>

      {/* Foreground Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ zIndex: 20 }}
      >
        <div className="text-center max-w-4xl">
          <p className="mono-label mb-6" style={{ color: '#777' }}>
            FULL-STACK SOFTWARE ENGINEER — LAGOS, NG
          </p>

          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.1] tracking-[-0.02em] mb-8"
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {titleWords.map((word, i) => (
              <span key={i} className="word-container">
                <span className="char-inner">{word}</span>
              </span>
            ))}
          </h1>

          <div className="flex items-center justify-center gap-6 mt-12">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="mono-label">ACTIVE</span>
            </div>
            <span className="text-text-secondary">|</span>
            <span className="mono-label">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
            <span className="text-text-secondary">|</span>
            <span className="mono-label">{time}</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 20 }}
      >
        <span className="mono-label" style={{ fontSize: '0.55rem' }}>SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}
