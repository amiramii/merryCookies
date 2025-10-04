import * as React from 'react'
import { Html, Head, Body, Container, Heading, Text, Section } from '@react-email/components'
import type Stripe from 'stripe'

interface ReceiptTemplateProps {
  session: Stripe.Checkout.Session
  lineItems: Array<{ description: string; quantity: number; price: number }>
  shippingInfo: Record<string, unknown>
}

export default function ReceiptTemplate({ session, lineItems, shippingInfo }: ReceiptTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9f9f9', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px' }}>
          <Section style={{ textAlign: 'center' }}>
            <Heading style={{ color: '#e39fac' }}>Your Merry Cookies Receipt</Heading>
            <Text style={{ fontSize: '14px', color: '#555555' }}>Order ID: {session.id}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Order Summary</Text>
            {lineItems.map((item, idx) => (
              <Text key={idx} style={{ fontSize: '14px', margin: '4px 0' }}>
                {item.quantity} x {item.description} &mdash; &euro;{item.price.toFixed(2)}
              </Text>
            ))}
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '12px' }}>
              Total: &euro;{((session.amount_total ?? 0) / 100).toFixed(2)}
            </Text>
          </Section>

          <Section>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Shipping Address</Text>
            {Object.entries(shippingInfo).map(([key, val]) => (
              <Text key={key} style={{ fontSize: '14px', margin: '2px 0' }}>
                {key.replace('_', ' ')}: {String(val)}
              </Text>
            ))}
          </Section>

          <Section style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text style={{ fontSize: '14px', color: '#999999' }}>
              Thank you for choosing Merry Cookies! If you have any questions, reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
