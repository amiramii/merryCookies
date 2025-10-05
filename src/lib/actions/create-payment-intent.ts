"use client"
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-09-30.clover',
});

export async function createPaymentIntent() {
    const intent=await stripe.paymentIntents.create({
        metadata: {
            "test":""
        },
        amount: 5000,
        currency: 'eur',
        description:"payment intent",

});
    return intent;
}