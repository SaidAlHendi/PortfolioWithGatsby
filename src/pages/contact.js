import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useForm } from '@formspree/react'
import DynamicContactForm from '../components/DynamicContactForm'
import { motion } from 'framer-motion'
import { pageAnimation } from '../animation/animation'

export default function Home() {
  const headingRef = useRef()
  const transformRef = useRef()
  const subheadingRef = useRef()
  const featureRefs = useRef([])
  const [state, handleSubmit] = useForm('mayzdkpl')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: {
        type: 'spring',
        mass: 0.3,
      },
    },
    button: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      mixBlendMode: 'difference',
      transition: {
        type: 'spring',
        mass: 0.3,
      },
    },
    text: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: {
        type: 'spring',
        mass: 0.3,
      },
    },
  }
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Initialize animations
  useEffect(() => {
    if (!headingRef.current || !transformRef.current || !subheadingRef.current)
      return

    // Set up GSAP animations
    const transformChars = transformRef.current.querySelectorAll('.char')
    const digitalPresence =
      headingRef.current.querySelector('.digital-presence')

    // Initial animation for the heading
    gsap.from(transformChars, {
      opacity: 0,
      y: 20,
      duration: 1.2,
      stagger: 0.05,
      ease: 'power3.out',
    })

    // Enhanced 3D setup for transform text
    transformChars.forEach((char) => {
      // Add 3D properties to each character
      gsap.set(char, {
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      })

      // Add hover effect for each character
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          z: 50,
          scale: 1.2,
          textShadow: '0 10px 20px rgba(0,0,0,0.5)',
          color: '#10b981',
          duration: 0.3,
          ease: 'power2.out',
        })
      })

      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          z: 0,
          scale: 1,
          textShadow: 'none',
          color: 'inherit',
          duration: 0.3,
          ease: 'power2.in',
        })
      })
    })

    if (digitalPresence) {
      gsap.from(digitalPresence, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out',
      })

      // Elegant gradient animation for "digital presence"
      gsap.to(digitalPresence, {
        backgroundImage:
          'linear-gradient(90deg, #ffffff, #10b981, #8b5cf6, #ffffff)',
        backgroundSize: '200% auto',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        backgroundPosition: '0% center',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      })
    }

    // Animate subheading with a smooth reveal
    const subheadingWords = subheadingRef.current.querySelectorAll('.word')
    gsap.from(subheadingWords, {
      opacity: 0,
      y: 15,
      duration: 1,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.8,
    })

    // Highlight key words with a subtle pulse and glow effect
    const keyWords = subheadingRef.current.querySelectorAll('.key-word')
    keyWords.forEach((word) => {
      gsap.to(word, {
        color: '#10b981',
        textShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      })
    })

    // Animate feature items with a smooth slide-in and highlight effect
    featureRefs.current.forEach((feature, index) => {
      if (!feature) return

      const featureIcon = feature.querySelector('.feature-icon')
      const featureText = feature.querySelector('.feature-text')

      // Initial animation
      gsap.from(feature, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        delay: 1 + index * 0.2,
        ease: 'power2.out',
      })

      // Subtle highlight animation for feature text
      gsap.to(featureText, {
        color: [
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 0.8)',
        ],
        duration: 3,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2 + index * 0.5,
      })

      // Animate the feature icon
      if (featureIcon) {
        gsap.to(featureIcon, {
          rotate: 360,
          duration: 20,
          repeat: -1,
          ease: 'none',
        })
      }
    })

    // Create an enhanced 3D hover effect for the Transform text container
    const transformContainer = transformRef.current

    // Set initial perspective
    gsap.set(transformContainer, {
      transformPerspective: 1000,
      transformStyle: 'preserve-3d',
    })

    // Create lighting effect elements
    const lightingEffect = document.createElement('div')
    lightingEffect.className = 'absolute inset-0 pointer-events-none opacity-0'

    transformContainer.style.position = 'relative'
    transformContainer.appendChild(lightingEffect)

    // Advanced 3D effect with lighting
    transformContainer.addEventListener('mousemove', (e) => {
      const rect = transformContainer.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Calculate percentages for rotation
      const xPercent = (x / rect.width - 0.5) * 20
      const yPercent = (y / rect.height - 0.5) * 20

      // Position the lighting effect
      gsap.to(lightingEffect, {
        opacity: 0.8,
        left: `${x - 100}px`,
        top: `${y - 100}px`,
        duration: 0.5,
      })

      // Apply 3D rotation with enhanced depth
      gsap.to(transformContainer, {
        rotationY: xPercent,
        rotationX: -yPercent,
        z: 50,
        duration: 0.5,
        ease: 'power1.out',
      })

      // Move each character for parallax effect
      transformChars.forEach((char, index) => {
        const depth = ((index % 3) + 1) * 5
        gsap.to(char, {
          x: xPercent * (depth * 0.1),
          y: yPercent * (depth * 0.1),
          duration: 0.5,
        })
      })
    })

    transformContainer.addEventListener('mouseleave', () => {
      // Reset the container
      gsap.to(transformContainer, {
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Reset the lighting effect
      gsap.to(lightingEffect, {
        opacity: 0,
        duration: 0.5,
      })

      // Reset each character
      transformChars.forEach((char) => {
        gsap.to(char, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
      })
    })

    // Add click interaction for a bounce effect
    transformContainer.addEventListener('click', () => {
      // Bounce animation
      gsap
        .timeline()
        .to(transformContainer, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power1.in',
        })
        .to(transformContainer, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power1.out',
        })
        .to(transformContainer, {
          scale: 1,
          duration: 0.2,
          ease: 'power1.inOut',
        })

      // Ripple effect on characters
      transformChars.forEach((char, index) => {
        gsap
          .timeline()
          .to(char, {
            y: -20,
            duration: 0.2,
            delay: index * 0.03,
            ease: 'power2.out',
          })
          .to(char, {
            y: 0,
            duration: 0.3,
            ease: 'bounce.out',
          })
      })
    })
  }, [])

  // Split text into characters for animation
  const SplitText = ({ text, className, splitBy = 'chars' }) => {
    if (splitBy === 'words') {
      return (
        <span className={className}>
          {text.split(' ').map((word, index) => (
            <span key={index} className='word inline-block mr-[0.25em]'>
              {word}
            </span>
          ))}
        </span>
      )
    }

    return (
      <span className={className}>
        {text.split('').map((char, index) => (
          <span
            key={index}
            className='char inline-block cursor-pointer'
            data-depth={(index % 3) + 1}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'color 0.3s ease',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    )
  }

  return (
    <motion.section
      exit='exit'
      variants={pageAnimation}
      initial='hidden'
      animate='show'
    >
      <motion.div
        className='fixed top-0 left-0 w-full h-full pointer-events-none z-50 rounded-full'
        variants={cursorVariants}
        animate={cursorVariant}
      />
      <main className='relative min-h-screen overflow-hidden '>
        <div className='absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-[#1b1b1b] to-[#1b1b1b1]'></div>

        {/* Main content */}
        <div className='container relative z-10 mx-auto px-4 py-12'>
          <div
            className={` gap-12 md:grid-cols-2 ${
              state.succeeded ? '' : 'grid'
            }`}
          >
            <div
              className={`flex flex-col justify-center ${
                state.succeeded ? 'hidden' : ''
              }`}
            >
              <h1
                ref={headingRef}
                className='mb-6 text-5xl font-bold leading-tight md:text-6xl'
              >
                <span
                  ref={transformRef}
                  className='block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-500 relative'
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    cursor: 'pointer',
                    textShadow: '0 5px 15px rgba(0,0,0,0.3)',
                  }}
                >
                  <SplitText text=' Get in Touch' />
                </span>
              </h1>
              <p ref={subheadingRef} className='digital-presence block text-xl'>
                Feel free to contact me by submitting the form below and I will
                get back to you as soon as possible.
              </p>
            </div>
            <DynamicContactForm handleSubmit={handleSubmit} state={state} />
          </div>
        </div>
      </main>
    </motion.section>
  )
}
