import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import ReceiptTemplate from '../../../components/ReceiptTemplate'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })
const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function POST(req: Request) {
  try {
    const body = await req.json() as { session_id: string; email: string }
    const { session_id, email } = body
    if (!session_id || !email) return NextResponse.json({ error: 'Missing session_id or email' }, { status: 400 })

    // Retrieve session with expanded line items
    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] })
    // Flatten shipping info for email template
    const customer = session.customer_details
    const addr = customer?.address
    const shippingInfo = customer
      ? {
          recipient: customer.name || '',
          line1: addr?.line1 || '',
          line2: addr?.line2 || '',
          city: addr?.city || '',
          state: addr?.state || '',
          postal_code: addr?.postal_code || '',
          country: addr?.country || '',
        }
      : {}

    // Prepare line items array for template
    const receiptItems = session.line_items?.data.map((item: Stripe.LineItem) => ({
      description: item.description || (item.price?.product as Stripe.Product)?.name || '',
      quantity: item.quantity || 0,
      price: ((item.price?.unit_amount ?? item.amount_total) ?? 0) / 100,
    })) || []

    // Render React Email template to HTML
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReceiptTemplate, { session, lineItems: receiptItems, shippingInfo })
    )

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
