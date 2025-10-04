"use client"
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

export default function SuccessPage() {
  const params = useSearchParams()
  const sessionId = params?.get('session_id')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState('')

  // receipt UI state
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sentMessage, setSentMessage] = useState('')

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) {
        setLoading(false)
        setError('No session id provided')
        return
      }

      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`)
        if (!res.ok) throw new Error('Failed to fetch session')
        const data: Session = await res.json()
        setSession(data)
        // prefill email if available
        const customerEmail = data?.customer_details?.email || ''
        setEmail(customerEmail)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error fetching session')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

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
        body: JSON.stringify({ session_id: sessionId, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to send receipt')
      setSentMessage('Receipt sent — check your email.')
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
      <p className="mb-4">We received your order. Below is a summary &mdash; you can request a receipt emailed to you.</p>

      <div className="text-left bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-2">Order summary</h2>        {session?.line_items?.data?.map((item, index) => (
          <div key={`line-item-${index}`} className="flex justify-between py-1">
            <div>{item.description || item.price?.product?.name || 'Unknown item'}</div>
            <div>
              {item.quantity || 0} x &euro;{((item.price?.unit_amount ?? item.amount_total) || 0) / 100}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-4 font-bold">
          <div>Total</div>
          <div>&euro;{((session?.amount_total || session?.total_details?.amount || 0) / 100).toFixed(2)}</div>
        </div>

        <h3 className="mt-4 font-semibold">Shipping / Delivery</h3>
        <pre className="text-sm bg-gray-50 p-2 rounded">
          {JSON.stringify(session?.shipping, null, 2)}
        </pre>
      </div>

      <div className="mt-6 bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-2">Send receipt</h3>
        <p className="text-sm mb-3">
          Enter an email to receive your receipt (or we&apos;ll send it automatically if you prefer).
        </p>
        <div className="flex gap-2 justify-center">
          <input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="p-2 border rounded w-64" 
            placeholder="you@example.com" 
          />
          <button 
            onClick={sendReceipt} 
            disabled={sending} 
            className="py-2 px-4 bg-[#ffdeda] rounded font-semibold"
          >
            {sending ? 'Sending...' : 'Send Receipt'}
          </button>
        </div>
        {sentMessage && <p className="mt-3">{sentMessage}</p>}
      </div>
    </div>
  )
}
