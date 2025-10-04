"use client"

import React from 'react'
import { motion } from 'framer-motion'

type Props = { className?: string }

export default function AnimatedLine({ className }: Props) {
  return (
    <motion.div
      className={`w-full h-0.5 bg-gradient-to-r from-transparent via-[#983040] to-transparent ${className ?? ''}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      style={{ transformOrigin: '0 50%' }}
    />
  )
}
