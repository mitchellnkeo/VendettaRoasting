import { NextApiRequest, NextApiResponse } from 'next';
import { createContactFormEmail, createContactFormAutoReply, sendEmail } from '../../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Send email to admin
    const adminEmail = createContactFormEmail({ name, email, subject, message });
    const adminEmailSent = await sendEmail(adminEmail);

    // Send auto-reply to customer
    const customerEmail = createContactFormAutoReply({ name, email, subject, message });
    const customerEmailSent = await sendEmail(customerEmail);

    if (adminEmailSent && customerEmailSent) {
      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. We\'ll get back to you soon!'
      });
    } else if (adminEmailSent) {
      // Admin email sent but auto-reply failed - still success
      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. We\'ll get back to you soon!',
        warning: 'Confirmation email may not have been sent'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again or contact us directly.'
      });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

