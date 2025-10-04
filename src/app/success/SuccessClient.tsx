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

      <div className="text-left bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-semibold mb-2 text-xl">Order Summary</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-2 border-b">Item</th>
              <th className="pb-2 border-b">Qty</th>
              <th className="pb-2 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            {session?.line_items?.data?.map((item, i) => (
              <tr key={i} className="py-1">
                <td className="pt-2">{item.description || item.price?.product?.name}</td>
                <td className="pt-2">{item.quantity}</td>
                <td className="pt-2">&euro;{(((item.price?.unit_amount ?? item.amount_total) ?? 0) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-4 font-bold">
          <div>Total</div>
          <div>&euro;{((session?.amount_total || session?.total_details?.amount || 0) / 100).toFixed(2)}</div>
        </div>

        <h3 className="mt-6 font-semibold">Shipping / Delivery</h3>
        <div className="bg-gray-50 p-4 rounded">
          {typeof session?.shipping === 'object' ? (
            Object.entries(session.shipping as Record<string, unknown>).map(([key, val]) => (
              <p key={key} className="text-sm"><span className="font-medium capitalize mr-1">{key.replace('_', ' ')}:</span> {String(val)}</p>
            ))
          ) : (
            <p className="text-sm">N/A</p>
          )}
        </div>
      </div>

      {/* Receipt request form */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">Receive your receipt</h3>
        <p className="text-sm text-gray-600 mb-4">Enter your email address below to have a copy of your receipt emailed to you.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label htmlFor="receiptEmail" className="sr-only">Email address</label>
          <input
            id="receiptEmail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full sm:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fac]"
          />
          <button
            onClick={sendReceipt}
            disabled={sending}
            className="mt-2 sm:mt-0 px-5 py-2 bg-[#e39fac] text-white font-semibold rounded-md hover:bg-[#cf7b9f] transition-colors"
          >
            {sending ? 'Sending...' : 'Send Receipt'}
          </button>
        </div>
        {sentMessage && <p className="mt-3 text-green-600">{sentMessage}</p>}
      </div>
    </div>
  )
}
