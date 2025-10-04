"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import AnimatedLine from './AnimatedLine'

const MILKSHAKES = [
  {
    name: 'Merry Fit',
    price: 5.0,
    image: '/merryFit.png',
    description: 'Protein milkshake: milk, vanilla or chocolate whey, peanut butter, banana. The perfect snack before or after workout!',
  },
  {
    name: 'Milkshake Cookies',
    price: 5.5,
    image: '/VanillaMilkshake.png',
    description: 'Cookie milkshake: milk, vanilla ice cream, whipped cream, cookie of your choice. Pure indulgence!',
  },
  {
    name: 'Matcha Latte',
    price: 5.5,
    image: '/MatchaLatte.png',
    description: 'Ceremonial grade matcha, plant or regular milk. Smooth energy in every sip.',
  },
]

export default function MilkshakeSection() {
  const [quantities, setQuantities] = useState<number[]>(() => MILKSHAKES.map(() => 1))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const total = MILKSHAKES.reduce((sum, m, i) => sum + m.price * (quantities[i] || 0), 0)

  function setQuantity(index: number, value: number) {
    setQuantities(prev => {
      const copy = [...prev]
      copy[index] = Math.max(0, Math.min(20, Number(value) || 0))
      return copy
    })
  }

  async function handleBuy() {
    setLoading(true)
    setError('')
    setSuccess('')

    const rawCart = MILKSHAKES.map((m, i) => ({
      product: m.name,
      price: Number(m.price),
      quantity: Number(quantities[i] || 0),
    }))

    const cart = rawCart.filter(item => item.quantity > 0)

    console.log('Raw cart:', rawCart)
    console.log('Sending cart:', cart)

    if (cart.length === 0) {
      setError('Please select at least one milkshake.')
      setLoading(false)
      return
    }

    // client validation
    for (let i = 0; i < cart.length; i++) {
      const it = cart[i]
      if (!it.product || typeof it.product !== 'string') {
        setError(`Invalid product at index ${i}: ${JSON.stringify(it)}`)
        setLoading(false)
        return
      }
      if (typeof it.price !== 'number' || Number.isNaN(it.price) || it.price <= 0) {
        setError(`Invalid price for product ${it.product} at index ${i}`)
        setLoading(false)
        return
      }
      if (typeof it.quantity !== 'number' || Number.isNaN(it.quantity) || it.quantity <= 0) {
        setError(`Invalid quantity for product ${it.product} at index ${i}`)
        setLoading(false)
        return
      }
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      })

      // handle non-json safely
      const text = await res.text()
      let data: unknown
      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error('Non-JSON response from checkout API', { status: res.status, text })
        setError(`Server error: non-JSON response (status ${res.status}). Check server logs.`)
        setLoading(false)
        return
      }

      const parsed = (data && typeof data === 'object') ? (data as Record<string, unknown>) : null

      if (parsed?.url && typeof parsed.url === 'string') {
        window.location.href = parsed.url
        return
      }

      if (parsed?.error && typeof parsed.error === 'string') {
        setError(`Could not start payment: ${parsed.error}`)
      } else {
        setError('Could not start payment. Try again.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(`Payment error: ${msg}`)
    }

    setLoading(false)
  }

  return (
    <section className="w-full p-8 xl:px-20 flex flex-col items-center" id="milkshake">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row items-center w-full">
          <Image src="/milkshakes.png" alt="Milkshakes" width={340} height={340} className="rounded-2xl shadow-lg mb-6 md:mb-0 md:mr-8 object-cover" />
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-[#e39fac] text-3xl md:text-4xl font-bold mb-3 flex flex-col items-center md:items-start gap-2">
              Our Milkshakes
              <AnimatedLine className="p-1 h-4 w-full" />
            </h2>
            <p className="text-base md:text-lg text-[#47302e] font-medium mb-2 text-center md:text-left">
              Merry Cookies offers a delightful range of milkshakes made with care — perfect with cookies or on their own.
            </p>
            <p className="text-sm text-[#47302e] opacity-90">Cookies, specialty coffee, matcha and handcrafted milkshakes.</p>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="w-full flex flex-col items-center mt-8">
        <div className="w-full max-w-xl">
          <Carousel className="w-full">
            <CarouselContent>
              {MILKSHAKES.map((m, i) => (
                <CarouselItem key={m.name} className="flex justify-center">
                  <div className="bg-[#ffecc09d] shadow-xl rounded-2xl w-full flex flex-col items-center p-6">
                    <div className="flex flex-col items-center justify-center w-full">
                      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }} className="w-full flex justify-center">
                        <div className="relative w-56 h-72 md:w-64 md:h-80">
                          <Image src={m.image} alt={m.name} fill className="rounded-xl object-cover" />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold text-[#47302e] mt-4 mb-2 text-center">{m.name}</h3>
                      <p className="text-md text-[#47302e] mb-2 font-medium text-center px-4">{m.description}</p>
                      <p className="text-lg font-bold text-[#e39fac] mb-3 text-center">€{m.price.toFixed(2)}</p>

                      <div className="flex flex-col gap-2 items-center w-full">
                        <label className="font-semibold text-lg">Quantity</label>
                        <input type="number" min={0} max={20} value={quantities[i]} onChange={e => setQuantity(i, Number(e.target.value))} className="p-2 rounded border border-[#e39fac] w-24 text-center" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-between items-center mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        <button onClick={handleBuy} disabled={loading} className="mt-6 py-2 px-6 bg-[#ffdeda] text-[#47302e] font-bold rounded-xl border-2 border-[#47302e] hover:bg-[#e39fac] transition-colors text-xl">
          {loading ? 'Redirecting...' : 'Buy Selected Milkshakes'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        <p className="text-xl text-[#47302e] font-bold mt-6">Total: €{total.toFixed(2)}</p>
      </motion.div>
    </section>
  )
}
