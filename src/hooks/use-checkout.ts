"use client"
import { useState, useEffect } from 'react';
import { PaymentIntent } from '@stripe/stripe-js';
import { createPaymentIntent } from '../lib/actions/create-payment-intent';
export default function useCheckout() {
  const [loading, setLoading] = useState(true);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  async function fetch(){
    const intent=await createPaymentIntent();
    setPaymentIntent(intent);
    setLoading(false);
  }
  useEffect(() => {

  fetch();
}, []);
}

