"use client"
import { useEffect } from 'react';
import { createPaymentIntent } from '../lib/actions/create-payment-intent';

export default function useCheckout() {
  useEffect(() => {
    async function fetch() {
      await createPaymentIntent();
    }
    fetch();
  }, []);
}

