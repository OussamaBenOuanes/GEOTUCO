import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { client, project, payment } = body;

        const { data, error } = await resend.emails.send({
            from: 'GEOTUCO Consultation <onboarding@resend.dev>',
            to: [process.env.OWNER_EMAIL || 'delivered@resend.dev'],
            subject: `New GEODATA Consultation Request - ${client.raisonSociale}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h1 style="color: #003365; border-bottom: 2px solid #003365; padding-bottom: 10px;">New Consultation Request</h1>
                    
                    <h2 style="color: #0057AC; margin-top: 20px;">1. Client Information</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company/Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.raisonSociale}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Activity:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.activite}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nationality:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.nationalite}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Address:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.adresse}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.email}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.telephone}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Fax:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.fax}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.commune}, ${client.delegation}, ${client.codePostal}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Client Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${client.qualiteClient.join(', ')}</td></tr>
                    </table>

                    <h2 style="color: #0057AC; margin-top: 20px;">2. Project Information</h2>
                    <p><strong>Residential Buildings:</strong><br/> ${project.batimentsHabitation.join('<br/> ') || 'None'}</p>
                    <p><strong>Functional Buildings:</strong><br/> ${project.batimentsFonctionnels.join('<br/> ') || 'None'}</p>

                    <h2 style="color: #0057AC; margin-top: 20px;">3. Payment Details</h2>
                    <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
                    <p><strong>Reference:</strong> ${payment.reference}</p>
                    <p><strong>Provider:</strong> ${payment.provider}</p>
                    
                    <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
                        Sent from GEOTUCO Website
                    </div>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
