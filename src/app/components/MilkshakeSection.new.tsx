"use client"

import React, { useState, useEffect } from 'react'
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
  const [quantities, setQuantities] = useState<number[]>(() => MILKSHAKES.map(() => 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'canceled' | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Get URL parameters - ensure this runs on client side
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success') === 'true'
    const canceled = params.get('canceled') === 'true'
    const session = params.get('session_id')

    // Clear URL parameters without affecting the hash
    const currentPath = window.location.pathname
    const currentHash = window.location.hash
    if (success || canceled) {
      window.history.replaceState({}, '', currentPath + currentHash)
    }

    if (success && session) {
      setPaymentStatus('success')
      setSessionId(session)
    } else if (canceled) {
      setPaymentStatus('canceled')
    }

    // Scroll to milkshake section if needed
    const scrollToSection = () => {
      const element = document.getElementById('milkshake')
      if (element && (success || canceled)) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

    // Delay scroll to ensure component is fully mounted
    const timeoutId = setTimeout(scrollToSection, 100)

    // Cleanup function to reset status and clear timeout
    return () => {
      clearTimeout(timeoutId)
      setPaymentStatus(null)
      setSessionId(null)
    }
  }, [])

  // Calculate total from quantities and prices
  const total = quantities.reduce((sum, qty, index) => {
    return sum + (MILKSHAKES[index]?.price || 0) * (qty || 0)
  }, 0)

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

    const rawCart = MILKSHAKES.map((m, i) => ({
      product: m.name,
      price: Number(m.price),
      quantity: Number(quantities[i] || 0),
    }))

    const cart = rawCart.filter(item => item.quantity > 0)

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

    // Start Stripe Elements flow by storing cart and redirecting to custom checkout
    sessionStorage.setItem('cart', JSON.stringify(cart))
    window.location.href = '/checkout'
    setLoading(false)
    return
  }

  return (
    <section className="w-full p-8 xl:px-20 flex flex-col items-center" id="milkshake">
      {/* DaisyUI Alerts for receipt errors and success */}
      {errorMessage && <div className="alert alert-error mb-4">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success mb-4">{successMessage}</div>}

      {/* Payment Status Messages */}
      {paymentStatus === 'canceled' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl mb-10 p-6 bg-red-50 border-2 border-red-200 rounded-xl text-center shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="font-bold text-red-600 text-xl">Payment Canceled</div>
            <p className="text-gray-700">Your order was canceled. If this was a mistake, you can try again.</p>
            <button 
              onClick={() => setPaymentStatus(null)} 
              className="mt-2 py-2 px-6 bg-red-100 text-red-600 font-bold rounded-xl border-2 border-red-200 hover:bg-red-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
      
      {paymentStatus === 'success' && sessionId && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl mb-10 p-6 bg-[#ffecc09d] border-2 border-[#e39fac] rounded-xl text-center shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <Image 
              src="/image.png" 
              alt="Success" 
              width={180} 
              height={180} 
              className="mx-auto rounded-2xl shadow-md"
              priority 
            />
            <div className="font-bold text-[#47302e] text-2xl">Thank you for your order!</div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="border-b-4 border-[#47302e] p-1 h-4 mb-2"
            />
            <div className="mb-6 text-lg text-[#47302e] font-medium">Your milkshakes will be ready soon.</div>
            <h3 className="text-[#e39fac] text-xl font-bold mb-3">Still have questions?</h3>
            <div className="mt-1 flex flex-col md:flex-row justify-center gap-3 w-full max-w-md">
              <input 
                placeholder="Enter your email for receipt" 
                defaultValue={''} 
                id="receiptEmail" 
                className="p-3 border-2 border-[#e39fac] rounded-xl w-full md:w-64 text-[#47302e] placeholder:text-[#47302e]/60 focus:outline-none focus:border-[#47302e]" 
              />
              <button 
                onClick={async () => {
                  const email = (document.getElementById('receiptEmail') as HTMLInputElement).value || ''
                  setErrorMessage(null)
                  setSuccessMessage(null)
                  if (!email) { setErrorMessage('Please enter your email address'); return }
                  try {
                    const res = await fetch('/api/stripe/send-receipt', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ session_id: sessionId, email }) })
                    const data = await res.json()
                    if (!res.ok) {
                      setErrorMessage(data?.error || 'Failed to send receipt')
                    } else {
                      setSuccessMessage('Receipt has been sent to your email')
                    }
                  } catch {
                    setErrorMessage('Failed to send receipt')
                  }
                }} 
                className="py-2 px-6 bg-[#ffdeda] text-[#47302e] font-bold rounded-xl border-2 border-[#47302e] hover:bg-[#e39fac] transition-colors"
              >
                Send Receipt
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="flex flex-col md:flex-row items-center w-full"
        >
          <Image 
            src="/milkshakes.png" 
            alt="Milkshakes" 
            width={340} 
            height={340} 
            className="rounded-2xl shadow-lg mb-6 md:mb-0 md:mr-8 object-cover" 
          />
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-[#e39fac] text-3xl md:text-4xl font-bold mb-3 flex flex-col items-center md:items-start gap-2">
              Our Milkshakes
              <AnimatedLine className="p-1 h-4 w-full" />
            </h2>
            <p className="text-base md:text-lg text-[#47302e] font-medium mb-2 text-center md:text-left">
              Merry Cookies offers a delightful range of milkshakes made with care, perfect with cookies or on their own.
            </p>
            <p className="text-sm text-[#47302e] opacity-90">
              Cookies, specialty coffee, matcha and handcrafted milkshakes.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.15 }} 
        className="w-full flex flex-col items-center mt-8 px-6 md:px-0"
      >
        <div className="w-full max-w-xl">
          <Carousel className="w-full">
            <CarouselContent>
              {MILKSHAKES.map((m, i) => (
                <CarouselItem key={m.name} className="flex justify-center">
                  <div className="bg-[#ffecc09d] shadow-xl rounded-2xl w-full flex flex-col items-center p-6">
                    <div className="flex flex-col items-center justify-center w-full">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        transition={{ duration: 0.45 }} 
                        className="w-full flex justify-center"
                      >
                        <div className="relative w-56 md:w-64 h-[400px]">
                          <Image src={m.image} alt={m.name} fill className="rounded-xl object-cover" />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold text-[#47302e] mt-4 mb-2 text-center">
                        {m.name}
                      </h3>
                      <p className="text-md text-[#47302e] mb-2 font-medium text-center px-4">
                        {m.description}
                      </p>
                      <p className="text-lg font-bold text-[#e39fac] mb-3 text-center">
                        €{m.price.toFixed(2)}
                      </p>

                      <div className="flex flex-col gap-2 items-center w-full">
                        <label className="font-semibold text-lg">Quantity</label>
                        <input 
                          type="number" 
                          min={0} 
                          max={20} 
                          value={quantities[i]} 
                          onChange={event => setQuantity(i, Number(event.target.value))} 
                          className="p-2 rounded border border-[#e39fac] w-24 text-center" 
                        />
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

        <button 
          onClick={handleBuy} 
          disabled={loading} 
          className="mt-6 py-2 px-6 bg-[#ffdeda] text-[#47302e] font-bold rounded-xl border-2 border-[#47302e] hover:bg-[#e39fac] transition-colors text-xl"
        >
          {loading ? 'Redirecting...' : 'Buy Selected Milkshakes'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        <p className="text-xl text-[#47302e] font-bold mt-6">Total: €{total.toFixed(2)}</p>
      </motion.div>
    </section>
  )
}
