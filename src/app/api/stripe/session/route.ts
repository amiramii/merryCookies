import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const paymentIntentId = url.searchParams.get('payment_intent')
    if (!paymentIntentId) return NextResponse.json({ error: 'Missing payment_intent' }, { status: 400 })

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return NextResponse.json(intent)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
