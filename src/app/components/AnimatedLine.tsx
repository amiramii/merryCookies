"use client"
import React from 'react'
import { motion } from 'framer-motion'

type Props = { className?: string }

export default function AnimatedLine({ className }: Props) {
  return (
    <motion.span 
        initial={{ width: 0 }}
        whileInView={{ width: "3.5rem" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className='border-b-4 border-[#47302e] p-1 h-4'
    ></motion.span>
  )
}
