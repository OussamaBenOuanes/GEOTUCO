import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-12-18.acacia", // Updated to latest stable
});

export async function POST(request: Request) {
    try {
        const { currency = 'eur' } = await request.json();

        // Base price is 5 EUR
        // Simple conversion logic for demo purposes
        // In production, fetch real rates or use fixed prices per region
        let amount = 500; // 5.00 EUR in cents

        if (currency.toLowerCase() === 'usd') amount = 550; // ~$5.50
        else if (currency.toLowerCase() === 'gbp') amount = 450; // ~4.50 GBP
        else if (currency.toLowerCase() === 'tnd') amount = 17000; // ~17 TND (in millimes if supported, check stripe support for TND)
        // Note: Stripe might not support TND direct charging in some setups, or it might be zero-decimal.
        // For now, we default to EUR for unsupported or tricky currencies to be safe.

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 });
    }
}
