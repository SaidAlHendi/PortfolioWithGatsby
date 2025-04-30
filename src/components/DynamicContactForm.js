import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Sparkles, Send } from 'lucide-react'
import { ValidationError } from '@formspree/react'
import { Link } from 'gatsby'

export default function DynamicContactForm({ handleSubmit, state }) {
  const formContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const borderRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })

  // Handle form input changes
  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  // Initialize GSAP animations and canvas
  useEffect(() => {
    if (!formContainerRef.current || !canvasRef.current || !borderRef.current)
      return

    // Animate border
    gsap.to(borderRef.current, {
      backgroundPosition: '200% 0',
      duration: 15,
      ease: 'none',
      repeat: -1,
    })

    // Set up canvas
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = formContainerRef.current.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }
    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)

    // Create particles
    const createParticles = () => {
      particlesRef.current = []
      const particleCount = 80

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          color: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6',
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          originalX: Math.random() * canvas.width,
          originalY: Math.random() * canvas.height,
        })
      }
    }
    createParticles()

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    formContainerRef.current.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Move particles away from mouse
        if (distance < 80) {
          const angle = Math.atan2(dy, dx)
          const pushX = Math.cos(angle) * (80 - distance) * 0.03
          const pushY = Math.sin(angle) * (80 - distance) * 0.03

          particle.x -= pushX
          particle.y -= pushY
        } else {
          // Gradually return to original position
          particle.x += (particle.originalX - particle.x) * 0.01
          particle.y += (particle.originalY - particle.y) * 0.01
        }

        // Normal movement
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Draw connections between nearby particles
      particlesRef.current.forEach((particleA, i) => {
        particlesRef.current.slice(i + 1).forEach((particleB) => {
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 70) {
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              0.1 * (1 - distance / 70)
            })`
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Form element animations
    gsap.from('.form-element', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    })

    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions)
      formContainerRef.current?.removeEventListener(
        'mousemove',
        handleMouseMove
      )
    }
  }, [])

  // Form field focus animations
  const handleFocus = (e) => {
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleBlur = (e) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }
  {
    if (state.succeeded) {
      return (
        <div className='flex h-full flex-col items-center justify-center py-12 text-center '>
          <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-purple-500'>
            <Sparkles className='h-8 w-8 text-white' />
          </div>
          <h3 className='mb-4 text-2xl font-bold'>Message Sent!</h3>
          <p className='text-white/70'>
            Thanks for taking the time to reach out
          </p>
          <Link to='/' className=''>
            back home
          </Link>
        </div>
      )
    }
  }
  return (
    <div ref={formContainerRef} className='relative rounded-xl p-1'>
      {/* Animated flowing border gradient */}
      <div
        ref={borderRef}
        className='absolute inset-0 rounded-xl opacity-80 blur-sm'
        style={{
          background:
            'linear-gradient(90deg, #37dfa2, #2b2b2b, #37dfa2, #3c3c3c, #37dfa2)',
          backgroundSize: '400% 100%',
        }}
      ></div>

      {/* Form container */}
      <div className='relative z-10 rounded-lg bg-black/80 p-8 backdrop-blur-xl'>
        <form onSubmit={handleSubmit}>
          <div className='mb-8 flex items-center justify-between'>
            <h3 className='form-element text-2xl font-bold'>Get in Touch </h3>
            <div className='form-element flex space-x-3'>
              <span className='flex h-2 w-2 rounded-full bg-emerald-400'></span>
              <span className='flex h-2 w-2 rounded-full bg-purple-500'></span>
              <span className='flex h-2 w-2 rounded-full bg-blue-500'></span>
            </div>
          </div>

          <div className='form-element mb-6 space-y-2'>
            <label
              htmlFor='name'
              className='text-sm font-medium text-white/80 block'
            >
              Your Name
            </label>
            <div className='relative'>
              <input
                id='name'
                name='name'
                value={formState.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder='Said Al-Hendi'
                required
                type='text'
                className='w-full rounded-md border border-white/10 bg-white/5 py-6 pl-4 pr-10 text-white backdrop-blur-sm placeholder:text-white/40 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 '
              />
            </div>
          </div>

          <div className='form-element mb-6 space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-white/80 block'
            >
              Email Address
            </label>
            <div className='relative'>
              <input
                id='email'
                name='email'
                type='email'
                value={formState.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder='said@example.com'
                required
                className='w-full rounded-md border border-white/10 bg-white/5 py-6 pl-4 pr-10 text-white backdrop-blur-sm placeholder:text-white/40 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
              />
            </div>
          </div>

          <div className='form-element mb-8 space-y-2'>
            <label
              htmlFor='message'
              className='text-sm font-medium text-white/80 block'
            >
              Your Message
            </label>
            <textarea
              id='message'
              name='message'
              value={formState.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder='Your Message...'
              required
              className='min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 pl-4 pr-10 pt-4 text-white backdrop-blur-sm placeholder:text-white/40 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
            />
            <ValidationError
              prefix='Message'
              field='message'
              errors={state.errors}
            />
          </div>

          <button
            type='submit'
            disabled={state.submitting}
            className='form-element group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-black p-px font-medium text-white'
          >
            <span className='relative flex h-12 w-full items-center justify-center rounded-lg bg-black/50 px-6 transition-all duration-300 ease-out'>
              {state.submitting ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <span>Send Message</span>
                  <Send className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                </div>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
