import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })
const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function POST(req: Request) {
  try {
    const body = await req.json() as { session_id: string; email: string }
    const { session_id, email } = body
    if (!session_id || !email) return NextResponse.json({ error: 'Missing session_id or email' }, { status: 400 })

    // Retrieve session with expanded line items
    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] })
    // Extract shipping info from customer details as shipping_details is deprecated
    const shippingInfo = session.customer_details
      ? { name: session.customer_details.name, address: session.customer_details.address }
      : {}

    // Format line items with correct types
    const lineItems = session.line_items?.data.map((item: Stripe.LineItem) => {
      const desc = item.description || (item.price?.product as Stripe.Product)?.name || ''
      const qty = item.quantity
      const rawAmount = (item.price?.unit_amount ?? item.amount_total)
      const amount = (rawAmount ?? 0) / 100
      return `${qty} x ${desc} - €${amount}`
    }).join('\n') ?? ''

    const html = `
      <h2>Thank you for your order</h2>
      <p>Order ID: ${session.id}</p>
      <pre>${lineItems}</pre>
      <p>Total: €${((session.amount_total) ?? 0) / 100}</p>
      <p>Shipping: ${JSON.stringify(shippingInfo)}</p>
    `

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `Your Merry Cookies receipt - ${session.id}`,
      html,
    })
    console.log('Resend email response:', emailResponse)
    return NextResponse.json({ ok: true, emailResponse })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
