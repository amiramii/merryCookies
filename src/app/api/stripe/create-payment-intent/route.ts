import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })

interface CartItem {
  product: string
  price: number
  quantity: number
}

export async function POST(req: Request) {
  try {
    const { cart } = await req.json() as { cart: CartItem[] }
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    // calculate total
    const amount = cart.reduce((sum, item) => sum + item.price * item.quantity * 100, 0)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    })
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error creating PaymentIntent'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
