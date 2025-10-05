import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })
const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function POST(req: Request) {
  try {
    const body = await req.json() as { payment_intent: string; email: string }
    const { payment_intent, email } = body
    if (!payment_intent || !email) return NextResponse.json({ error: 'Missing payment_intent or email' }, { status: 400 })

    // Retrieve PaymentIntent with expanded line items
    const intent = await stripe.paymentIntents.retrieve(payment_intent, { expand: ['charges'] }) as Stripe.PaymentIntent
    // Flatten shipping info for email template
    const customer = intent.shipping
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

    // For PaymentIntent, fetch latest charge for description/amount
    let receiptItems: { description: string; quantity: number; price: number }[] = [];
    let chargeObj: Stripe.Charge | null = null;
    if (intent.latest_charge) {
      chargeObj = await stripe.charges.retrieve(intent.latest_charge as string);
      receiptItems.push({
        description: chargeObj.description || 'Milkshake Order',
        quantity: 1,
        price: (chargeObj.amount || intent.amount || 0) / 100,
      });
    }

    // Construct HTML email manually
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #e39fac;">Thank you for your order</h2>
        <p>Payment Intent ID: ${intent.id}</p>
        <h3>Order Summary</h3>
        <ul style="list-style: none; padding: 0;">${receiptItems.map(item =>
            `<li style="margin-bottom: 8px;">${item.quantity} x ${item.description} — &euro;${item.price.toFixed(2)}</li>`
          ).join('')}</ul>
        <p><strong>Total: &euro;${((intent.amount ?? 0) / 100).toFixed(2)}</strong></p>
        <h3>Shipping Details</h3>
        <p>${shippingInfo.recipient}</p>
        <p>${shippingInfo.line1}${shippingInfo.line2 ? ', ' + shippingInfo.line2 : ''}</p>
        <p>${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.postal_code}, ${shippingInfo.country}</p>
        <footer style="margin-top: 20px; font-size: 12px; color: #999;">Thank you for choosing Merry Cookies!</footer>
      </div>
    `

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `Your Merry Cookies receipt - ${intent.id}`,
      html,
    })
    if (!emailResponse || emailResponse.error) {
      return NextResponse.json({ error: emailResponse?.error?.message || 'Failed to send email' }, { status: 500 })
    }
    console.log('Resend email response:', emailResponse)
    return NextResponse.json({ ok: true, emailResponse })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
