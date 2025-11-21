# Email Service Setup Guide

This guide will help you set up Resend email service for Vendetta Roasting.

## Overview

The website now uses **Resend** for sending transactional emails:
- ✅ Order confirmation emails to customers
- ✅ Contact form submissions to admin
- ✅ Contact form auto-replies to customers
- ✅ Wholesale application notifications to admin
- ✅ Wholesale application confirmations to applicants

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to Resend dashboard
2. Go to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Vendetta Roasting Production")
5. Copy the API key (you'll only see it once!)

## Step 3: Verify Your Domain (Recommended for Production)

For production, you should verify your domain:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `vendettaroasting.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)

**Note:** For testing, you can use Resend's default domain (`onboarding@resend.dev`), but emails may go to spam.

## Step 4: Set Up Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@vendettaroasting.com
ADMIN_EMAIL=admin@vendettaroasting.com
```

### Environment Variables Explained

- **`RESEND_API_KEY`**: Your Resend API key (required)
- **`RESEND_FROM_EMAIL`**: The email address emails will be sent from
  - For testing: Use `onboarding@resend.dev` (Resend's default)
  - For production: Use your verified domain (e.g., `noreply@vendettaroasting.com`)
- **`ADMIN_EMAIL`**: Where contact form and wholesale applications will be sent
  - This should be your business email address

## Step 5: Update Vercel Environment Variables

If you're deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all three variables:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `ADMIN_EMAIL`
4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

## Step 6: Test Email Functionality

### Test Order Confirmation Email

1. Make a test purchase through your checkout
2. Check the customer's email inbox
3. You should receive an order confirmation email

### Test Contact Form

1. Go to `/contact` page
2. Fill out and submit the contact form
3. Check:
   - Your admin email inbox (should receive the submission)
   - The customer's email inbox (should receive auto-reply)

### Test Wholesale Application

1. Go to `/wholesale` page
2. Fill out and submit the wholesale application
3. Check:
   - Your admin email inbox (should receive the application)
   - The applicant's email inbox (should receive confirmation)

## Troubleshooting

### Emails Not Sending

**Check 1: API Key**
- Verify `RESEND_API_KEY` is set correctly
- Make sure there are no extra spaces or quotes
- Check that the API key is active in Resend dashboard

**Check 2: From Email**
- If using `onboarding@resend.dev`, emails may go to spam
- For production, verify your domain in Resend
- Make sure `RESEND_FROM_EMAIL` matches a verified domain

**Check 3: Console Logs**
- Check your server logs for email errors
- Look for Resend API error messages
- Check that emails aren't being rate-limited

### Emails Going to Spam

**Solutions:**
1. Verify your domain in Resend (recommended)
2. Set up SPF and DKIM records (Resend provides these)
3. Use a professional "from" email address
4. Avoid spam trigger words in subject lines

### Rate Limiting

Resend free tier limits:
- 3,000 emails/month
- 100 emails/day

If you hit limits:
- Upgrade to a paid plan
- Or use a different email service (SendGrid, Mailgun, etc.)

## Fallback Behavior

If `RESEND_API_KEY` is not set:
- The app will log emails to console (for development)
- The app won't crash - it will gracefully handle missing API key
- Forms will still show success messages (but emails won't actually send)

## Email Templates

All email templates are in `src/lib/email.ts`:
- `createOrderConfirmationEmail()` - Order confirmations
- `createContactFormEmail()` - Contact form to admin
- `createContactFormAutoReply()` - Auto-reply to customer
- `createWholesaleApplicationEmail()` - Wholesale app to admin
- `createWholesaleApplicationConfirmation()` - Confirmation to applicant

You can customize these templates to match your brand.

## Next Steps

1. ✅ Set up Resend account
2. ✅ Add environment variables
3. ✅ Test email functionality
4. ✅ Verify domain (for production)
5. ✅ Monitor email delivery in Resend dashboard

## Support

- **Resend Documentation**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: support@resend.com
- **Resend Status**: [status.resend.com](https://status.resend.com)

---

**Important:** Never commit your `RESEND_API_KEY` to version control. Always use environment variables!

