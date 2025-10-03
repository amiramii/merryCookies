// app/api/send/route.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    console.log('Received form data:', { firstName, lastName, email, phone, subject });

    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      console.log('Missing required fields:', { firstName, lastName, email, phone, subject, message });
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY is not configured - simulating successful email send');
      // Simulate successful email send for testing
      return Response.json({ 
        id: 'test-email-id',
        message: 'Email would be sent (Resend API key not configured)',
        formData: { firstName, lastName, email, phone, subject, message }
      });
    }

    console.log('Sending email...');
    
    // Create a simple HTML email instead of using React Email for now
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #47302e; border-bottom: 2px solid #e39fac; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="margin-top: 20px;">
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          
          <div style="margin: 15px 0;">
            <strong>Message:</strong>
            <div style="
              margin-top: 5px; 
              padding: 15px; 
              background-color: #f9f9f9; 
              border: 1px solid #ddd;
              border-radius: 5px;
              white-space: pre-wrap;
            ">
              ${message}
            </div>
          </div>
        </div>
        
        <div style="
          margin-top: 30px; 
          padding: 15px; 
          background-color: #ffdeda; 
          border-radius: 5px;
          border: 1px solid #e39fac;
        ">
          <p style="margin: 0; color: #47302e; font-size: 14px;">
            This message was sent from the Merry Cookies contact form.
          </p>
        </div>
      </div>
    `;
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'test@resend.dev',
      to: process.env.TO_EMAIL || 'ma.bouabdelli76@gmail.com',
      subject: `New Merry Cookies Contact Form Submission: ${subject}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return Response.json(data);
  } catch (error) {
    console.error('Email send error:', error);
    return Response.json({ error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
