import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  console.log('Stripe checkout API called');
  let body: any;
  try {
    body = await req.json();
  } catch (e: any) {
    console.error('Could not parse JSON body', e);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const cart = body?.cart;
  console.log('Received cart:', cart);

  if (!Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: 'Cart is empty or invalid' }, { status: 400 });
  }

  // Validate each cart item with detailed errors
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (!item || typeof item !== 'object') {
      console.error('Invalid cart item (not an object) at index', i, item);
      return NextResponse.json({ error: `Invalid cart item at index ${i}: ${JSON.stringify(item)}` }, { status: 400 });
    }
    if (!item.product || typeof item.product !== 'string') {
      console.error('Invalid or missing product at index', i, item);
      return NextResponse.json({ error: `Invalid product at index ${i}: ${JSON.stringify(item)}` }, { status: 400 });
    }
    if (typeof item.price !== 'number' || isNaN(item.price)) {
      console.error('Invalid or missing price at index', i, item);
      return NextResponse.json({ error: `Invalid price at index ${i}: ${JSON.stringify(item)}` }, { status: 400 });
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      console.error('Invalid or missing quantity at index', i, item);
      return NextResponse.json({ error: `Invalid quantity at index ${i}: ${JSON.stringify(item)}` }, { status: 400 });
    }
  }

  try {
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product,
          images: ['https://merry-cookies.com/public/image.png'],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe session creation failed', error);
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "GET method not allowed" }, { status: 405 });
}
