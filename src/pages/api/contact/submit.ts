import { NextApiRequest, NextApiResponse } from 'next';
import { createContactFormEmail, createContactFormAutoReply, sendEmail } from '../../../lib/email';
import { createRateLimit, RATE_LIMITS } from '../../../lib/rateLimit';
import { validateRecaptcha } from '../../../lib/recaptcha';
import { sanitizeString, sanitizeEmail, sanitizeText } from '../../../lib/sanitize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Rate limiting
  const rateLimit = createRateLimit(RATE_LIMITS.CONTACT);
  const rateLimitResult = rateLimit(req);

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
    });
  }

  try {
    const { name, email, subject, message, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaValid = await validateRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA verification failed. Please try again.',
        });
      }
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedSubject = sanitizeString(subject);
    const sanitizedMessage = sanitizeText(message);

    // Validate required fields
    if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedMessage) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Send email to admin
    const adminEmail = createContactFormEmail({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      subject: sanitizedSubject, 
      message: sanitizedMessage 
    });
    const adminEmailSent = await sendEmail(adminEmail);

    // Send auto-reply to customer
    const customerEmail = createContactFormAutoReply({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      subject: sanitizedSubject, 
      message: sanitizedMessage 
    });
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

