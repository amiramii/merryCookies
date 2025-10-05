"use client"
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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