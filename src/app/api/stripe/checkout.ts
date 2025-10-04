// Legacy placeholder to avoid conflicting API route during build/deploy
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Use /api/stripe/checkout route (checkout/route.ts)' }, { status: 404 })
}

export async function POST() {
  return NextResponse.json({ error: 'Use /api/stripe/checkout route (checkout/route.ts)' }, { status: 404 })
}
