import React, { useEffect, useState } from 'react'
import { Experiences, Hero, Projects } from '../components'
import { motion } from 'framer-motion'
import { pageAnimation } from '../animation/animation'

export default function Home() {
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
  return (
    <motion.div
      exit='exit'
      variants={pageAnimation}
      initial='hidden'
      animate='show'
    >
      {' '}
      <motion.div
        className='fixed top-0 left-0 w-full h-full pointer-events-none z-50 rounded-full'
        variants={cursorVariants}
        animate={cursorVariant}
      />
      <Hero showHero={true} />
      <Experiences />
      <Projects showLink={true} />
    </motion.div>
  )
}
