import { NextApiRequest, NextApiResponse } from 'next';
import { createWholesaleApplicationEmail, createWholesaleApplicationConfirmation, sendEmail } from '../../../lib/email';
import { query } from '../../../lib/database';
import { createRateLimit, RATE_LIMITS } from '../../../lib/rateLimit';
import { validateRecaptcha } from '../../../lib/recaptcha';
import { sanitizeString, sanitizeEmail, sanitizeText, sanitizePhone } from '../../../lib/sanitize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Rate limiting
  const rateLimit = createRateLimit(RATE_LIMITS.WHOLESALE);
  const rateLimitResult = rateLimit(req);

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
    });
  }

  try {
    const { 
      businessName, 
      contactName, 
      email, 
      phone, 
      businessAddress, 
      businessType, 
      message,
      recaptchaToken
    } = req.body;

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
    const sanitizedBusinessName = sanitizeString(businessName);
    const sanitizedContactName = sanitizeString(contactName);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPhone = sanitizePhone(phone);
    const sanitizedBusinessAddress = sanitizeText(businessAddress);
    const sanitizedBusinessType = sanitizeString(businessType);
    const sanitizedMessage = sanitizeText(message);

    // Validate required fields
    if (!sanitizedBusinessName || !sanitizedContactName || !sanitizedEmail || !sanitizedPhone || !sanitizedBusinessAddress || !sanitizedBusinessType) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled in'
      });
    }

    // Save to database (optional - for admin to review later)
    try {
      await query(
        `INSERT INTO wholesale_applications (
          business_name, 
          contact_name, 
          email, 
          phone, 
          business_address, 
          business_type, 
          message, 
          status, 
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          sanitizedBusinessName,
          sanitizedContactName,
          sanitizedEmail,
          sanitizedPhone,
          sanitizedBusinessAddress,
          sanitizedBusinessType,
          sanitizedMessage || null,
          'pending'
        ]
      );
    } catch (dbError: any) {
      // If table doesn't exist, log but don't fail
      if (dbError.message?.includes('does not exist')) {
        console.log('Wholesale applications table not found. Skipping database save.');
      } else {
        console.error('Database error saving wholesale application:', dbError);
        // Continue anyway - email is more important
      }
    }

    // Send email to admin
    const adminEmail = createWholesaleApplicationEmail({
      businessName: sanitizedBusinessName,
      contactName: sanitizedContactName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      businessAddress: sanitizedBusinessAddress,
      businessType: sanitizedBusinessType,
      message: sanitizedMessage || ''
    });
    const adminEmailSent = await sendEmail(adminEmail);

    // Send confirmation to applicant
    const confirmationEmail = createWholesaleApplicationConfirmation({
      businessName: sanitizedBusinessName,
      contactName: sanitizedContactName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      businessAddress: sanitizedBusinessAddress,
      businessType: sanitizedBusinessType,
      message: sanitizedMessage || ''
    });
    const confirmationEmailSent = await sendEmail(confirmationEmail);

    if (adminEmailSent && confirmationEmailSent) {
      res.status(200).json({
        success: true,
        message: 'Thank you for your interest! We\'ll review your application and get back to you within 2-3 business days.'
      });
    } else if (adminEmailSent) {
      // Admin email sent but confirmation failed - still success
      res.status(200).json({
        success: true,
        message: 'Thank you for your interest! We\'ll review your application and get back to you within 2-3 business days.',
        warning: 'Confirmation email may not have been sent'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit application. Please try again or contact us directly.'
      });
    }

  } catch (error) {
    console.error('Error processing wholesale application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

