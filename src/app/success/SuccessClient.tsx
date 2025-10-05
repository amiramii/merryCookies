'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface LineItem {
  description?: string
  quantity?: number
  price?: {
    unit_amount?: number
    product?: {
      name?: string
    }
  }
  amount_total?: number
}

interface Session {
  line_items?: {
    data: LineItem[]
  }
  amount_total?: number
  total_details?: {
    amount: number
  }
  shipping?: unknown
  customer_details?: {
    email?: string
  }
}

export default function SuccessClient() {
  const params = useSearchParams()
  const paymentIntentId = params?.get('payment_intent')
  const [loading, setLoading] = useState(true)
  const [intent, setIntent] = useState<any | null>(null)
  const [error, setError] = useState('')

  // receipt UI state
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sentMessage, setSentMessage] = useState('')

  useEffect(() => {
    async function fetchSession() {
      if (!paymentIntentId) {
        setLoading(false)
        setError('No payment intent id provided')
        return
      }
      try {
        const res = await fetch(`/api/stripe/session?payment_intent=${paymentIntentId}`)
        if (!res.ok) throw new Error('Failed to fetch payment intent')
        const data = await res.json()
        setIntent(data)
        // prefill email if available
        const customerEmail = data?.receipt_email || ''
        setEmail(customerEmail)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error fetching payment intent')
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [paymentIntentId])

  async function sendReceipt() {
    setSentMessage('')
    if (!email) {
      setSentMessage('Please enter an email address')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/stripe/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_intent: paymentIntentId, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to send receipt')
      setSentMessage('Thank you! Receipt sent — you will be redirected to the homepage.')
      setTimeout(() => {
        window.location.href = '/'
      }, 2200)
    } catch (error) {
      setSentMessage(error instanceof Error ? error.message : 'Failed to send receipt')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="p-12 text-center">Loading...</div>
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="mb-4">We received your payment. Below is a summary &mdash; you can request a receipt emailed to you.</p>

      <div className="text-left bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-semibold mb-2 text-xl">Payment Summary</h2>
        <div className="mb-2">Amount: <span className="font-bold">€{intent?.amount ? (intent.amount / 100).toFixed(2) : '-'}</span></div>
        <div className="mb-2">Email: <span className="font-bold">{intent?.receipt_email || '-'}</span></div>
        <div className="mb-2">Status: <span className="font-bold">{intent?.status || '-'}</span></div>
      </div>

      {/* Receipt form and actions */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email for receipt"
          className="input input-bordered w-full max-w-xs mb-2 bg-white"
        />
        <div className="flex gap-4">
          <button
            onClick={sendReceipt}
            disabled={sending}
            className="btn bg-[#e39fac] text-white font-bold rounded-xl border-2 border-[#e39fac] hover:bg-[#ffdeda] transition-colors cursor-pointer"
          >
            {sending ? 'Sending…' : 'Send Receipt'}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn bg-gray-200 text-[#47302e] font-bold rounded-xl border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
        {sentMessage && <div className="mt-4 text-[#e39fac] font-semibold">{sentMessage}</div>}
      </div>
    </div>
  )
}
