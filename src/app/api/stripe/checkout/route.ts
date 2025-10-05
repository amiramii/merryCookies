// This endpoint is deprecated in favor of the internal /checkout flow
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Deprecated endpoint' }, { status: 404 })
}

export async function GET() {
  return NextResponse.json({ error: 'Deprecated endpoint' }, { status: 404 })
}
