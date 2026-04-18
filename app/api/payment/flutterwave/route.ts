import { NextResponse } from 'next/server';
// import Flutterwave from 'flutterwave-node-v3'; // Uncomment when installed in prod

export async function POST(request: Request) {
    try {
        const { currency = 'EUR', email, name, phone } = await request.json();

        // Flutterwave implementation
        // const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);
        // ... logic to create payment link or transaction

        // For now, return a mock link or error
        return NextResponse.json({ link: "https://flutterwave.com/pay/mock_link" });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating Flutterwave payment' }, { status: 500 });
    }
}
