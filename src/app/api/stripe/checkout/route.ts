import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  console.log('Stripe checkout route called');

  try {
    const headers: Record<string, string> = {};
    for (const [k, v] of req.headers.entries()) headers[k] = String(v);
    console.log('Request headers:', headers);
  } catch (err) {
    console.warn('Could not log headers', err);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    console.error('Could not parse JSON body', err);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  console.log('Request body:', body);

  const parsed = (body && typeof body === 'object') ? (body as Record<string, unknown>) : null;
  const cart = Array.isArray(parsed?.cart) ? parsed!.cart as unknown[] : undefined;

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

    const it = item as Record<string, unknown>;
    const product = (typeof it.product === 'string') ? it.product : (typeof it.name === 'string' ? it.name : null);
    const price = (typeof it.price === 'number') ? it.price : (typeof it.price === 'string' ? Number(it.price) : NaN);
    const quantity = (typeof it.quantity === 'number') ? it.quantity : (typeof it.quantity === 'string' ? Number(it.quantity) : NaN);

    if (!product || typeof product !== 'string') {
      console.error('Invalid or missing product at index', i, item);
      return NextResponse.json({ error: `Invalid product at index ${i}: ${JSON.stringify(item)}` }, { status: 400 });
    }
    if (isNaN(price) || price <= 0) {
      console.error('Invalid or missing price at index', i, item);
      return NextResponse.json({ error: `Invalid price at index ${i}: ${JSON.stringify(item)}` }, { status: 400 });
    }
    if (isNaN(quantity) || quantity <= 0) {
      console.error('Invalid or missing quantity at index', i, item);
      return NextResponse.json({ error: `Invalid quantity at index ${i}: ${JSON.stringify(item)}` }, { status: 400 });
    }
  }

  try {
    const line_items = cart.map((item) => {
      const it = item as Record<string, unknown>;
      const productName = (typeof it.product === 'string') ? it.product : (typeof it.name === 'string' ? it.name : '');
      const priceNum = Number(it.price);
      const qtyNum = Number(it.quantity) || 1;
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: productName,
            images: ['https://merry-cookies.com/public/image.png'],
          },
          unit_amount: Math.round(priceNum * 100),
        },
        quantity: qtyNum,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?canceled=true`,
    });

    console.log('Created Stripe session', { id: session.id, url: session.url });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'GET method not allowed' }, { status: 405 });
}
