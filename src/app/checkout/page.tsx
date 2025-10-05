"use client"
import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

export default function CheckoutPage() {
  const [stripePromise] = useState(() => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''))
  // use undefined to satisfy Stripe Elements clientSecret type
  const [clientSecret, setClientSecret] = useState<string | undefined>()
  // Cart items loaded from sessionStorage on client
  const [cart, setCart] = useState<{ product: string; price: number; quantity: number; }[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.sessionStorage.getItem('cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCart(parsed)
      } catch {
        console.error('Failed to parse cart from sessionStorage')
      }
    }
  }, [])

  useEffect(() => {
    async function createIntent() {
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ cart })
      })
      const data = await res.json()
      setClientSecret(data.clientSecret)
    }
    createIntent()
  }, [cart])

  // Compute order total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-[#ffecc0] md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#47302e]">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Order Summary */}
        <div className="card bg-white shadow-xl border-2 border-[#e39fac]">
          <div className="card-body p-6">
            <h2 className="card-title mb-4 text-[#e39fac]">Order Summary</h2>
            {cart.length === 0 ? (
            <p className="text-gray-500">No items in your cart.</p>
            ) : (
            <ul className="space-y-2">
              {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span className="text-[#47302e]">{item.product} x {item.quantity}</span>
                <span className="text-[#e39fac] font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
              </li>
              ))}
            </ul>
            )}
            <div className="mt-4 border-t pt-3 flex justify-between font-bold">
              <span className="text-[#47302e]">Total</span>
              <span className="text-[#e39fac]">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping & Payment */}
        <div className="card bg-white shadow-xl border-2 border-[#e39fac] mt-8 md:mt-0">
          <div className="card-body p-6">
            {clientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret: clientSecret! }}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  // Shipping address state
  const [fullName, setFullName] = useState<string>('')
  const [addressLine1, setAddressLine1] = useState<string>('')
  const [addressLine2, setAddressLine2] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [state, setStateValue] = useState<string>('')
  const [postalCode, setPostalCode] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    // Validate address
    if (!fullName || !addressLine1 || !city || !postalCode || !country) {
      setMessage('Please fill in all required address fields')
      return
    }
    setIsLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will replace {{PAYMENT_INTENT_ID}} with the actual id
        return_url: window.location.origin + '/success?payment_intent={{PAYMENT_INTENT_ID}}',
        shipping: {
          name: fullName,
          address: {
            line1: addressLine1,
            line2: addressLine2 || undefined,
            city: city,
            state: state,
            postal_code: postalCode,
            country: country
          }
        }
      }
    })
    if (error) setMessage(error.message || 'Payment failed')
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Section */}
      <h3 className="text-lg font-semibold">Shipping Information</h3>
      <div className="grid grid-cols-1 gap-2">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="input input-bordered w-full bg-white"
          required
        />
        <input
          type="text"
          placeholder="Address Line 1"
          value={addressLine1}
          onChange={e => setAddressLine1(e.target.value)}
          className="input input-bordered w-full bg-white"
          required
        />
        <input
          type="text"
          placeholder="Address Line 2 (optional)"
          value={addressLine2}
          onChange={e => setAddressLine2(e.target.value)}
          className="input input-bordered w-full bg-white"
        />
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="input input-bordered flex-1 bg-white"
            required
          />
          <input
            type="text"
            placeholder="State/Province"
            value={state}
            onChange={e => setStateValue(e.target.value)}
            className="input input-bordered flex-1 bg-white"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            className="input input-bordered flex-1 bg-white"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="input input-bordered flex-1 bg-white"
            required
          />
        </div>
      </div>
      {/* Payment Section */}
      <div className="divider">Payment Information</div>
      <PaymentElement />
      <button disabled={isLoading || !stripe} type="submit" className="w-full py-2 bg-[#e39fac] text-white rounded">
        {isLoading ? 'Processing…' : 'Pay'}
      </button>
      {message && <div className="text-red-500 mt-2">{message}</div>}
    </form>
  )
}
