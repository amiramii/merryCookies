import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })
const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { session_id, email } = body
    if (!session_id || !email) return NextResponse.json({ error: 'Missing session_id or email' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items', 'shipping'] })

    // Cast to any so expanded properties like line_items and shipping can be accessed without TS errors
    const sessAny = session as unknown as Record<string, any>

    const lineItems = (sessAny.line_items?.data || []).map((it: any) => `${it.quantity} x ${it.description || it.price?.product?.name} - €${((it.price?.unit_amount ?? it.amount_total)||0)/100}` ).join('\n') || ''

    const html = `
      <h2>Thank you for your order</h2>
      <p>Order ID: ${sessAny.id}</p>
      <pre>${lineItems}</pre>
      <p>Total: €${(sessAny.amount_total||0)/100}</p>
      <p>Shipping: ${JSON.stringify(sessAny.shipping || {})}</p>
    `

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `Your Merry Cookies receipt - ${sessAny.id}`,
      html,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error? err.message: String(err) }, { status: 500 })
  }
}
