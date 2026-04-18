import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

export async function POST(request: Request) {
    try {
        console.log("Initializing PayPal Client...");

        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in environment variables.");
            return NextResponse.json(
                { error: 'PayPal is not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env.local.' },
                { status: 503 }
            );
        }

        if (!paypal.core) {
            throw new Error("PayPal SDK core not found. Check import.");
        }

        const Environment = process.env.NODE_ENV === 'production'
            ? paypal.core.LiveEnvironment
            : paypal.core.SandboxEnvironment;

        const client = new paypal.core.PayPalHttpClient(
            new Environment(clientId, clientSecret)
        );

        const body = await request.json(); // Safe check for body
        const { currency = 'EUR' } = body;

        const requestBody = new paypal.orders.OrdersCreateRequest();
        requestBody.prefer("return=representation");
        requestBody.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: '5.00' // Fixed price
                }
            }]
        });

        console.log("Executing PayPal Order...");
        const order = await client.execute(requestBody);
        console.log("PayPal Order Created:", order.result.id);

        return NextResponse.json({ id: order.result.id });
    } catch (err: any) {
        console.error("PayPal API Route Error:", err);
        // Return JSON even on error
        return NextResponse.json(
            { error: 'Error creating PayPal order', details: err.message },
            { status: 500 }
        );
    }
}
