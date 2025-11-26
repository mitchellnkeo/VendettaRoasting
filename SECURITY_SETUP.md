# Security Setup Guide

This guide explains how to set up the security features that have been implemented in your Vendetta Roasting website.

## ✅ Security Features Implemented

1. **Rate Limiting** - Prevents spam and abuse on forms
2. **Google reCAPTCHA v3** - Invisible bot protection
3. **Input Sanitization** - Prevents XSS attacks
4. **Security Headers** - Protects against common web vulnerabilities

---

## 🔧 Setup Instructions

### 1. Google reCAPTCHA v3 Setup

reCAPTCHA v3 is **invisible** and runs in the background. It doesn't show a checkbox to users.

#### Step 1: Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Click **"Create"** or **"+"** to create a new site
3. Fill in the form:
   - **Label:** Vendetta Roasting Website
   - **reCAPTCHA type:** Select **"reCAPTCHA v3"**
   - **Domains:** Add your domains:
     - `localhost` (for development)
     - `yourdomain.com` (your production domain)
     - `*.vercel.app` (if using Vercel preview deployments)
   - Accept the reCAPTCHA Terms of Service
   - Click **"Submit"**

4. You'll receive two keys:
   - **Site Key** (public) - Used in frontend
   - **Secret Key** (private) - Used in backend

#### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
RECAPTCHA_SCORE_THRESHOLD=0.5
```

**Note:** `RECAPTCHA_SCORE_THRESHOLD` is optional (defaults to 0.5). Lower scores (closer to 0) indicate bot-like behavior. You can adjust this based on your needs.

#### Step 3: Add to Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the same three variables:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
   - `RECAPTCHA_SCORE_THRESHOLD` (optional)

#### Step 4: Test

1. Restart your development server
2. Try submitting a form (contact, wholesale, or review)
3. Check the browser console - you should see reCAPTCHA loading
4. Check the server logs - reCAPTCHA verification should happen

**Note:** If reCAPTCHA is not configured, the forms will still work (fail-open behavior). This is intentional so the site works even if you haven't set up reCAPTCHA yet.

---

### 2. Rate Limiting

Rate limiting is **already configured** and works automatically. No setup needed!

**Current Limits:**
- **Contact Form:** 5 submissions per hour per IP
- **Wholesale Form:** 3 submissions per hour per IP
- **Review Form:** 3 reviews per hour per IP
- **General API:** 100 requests per 15 minutes per IP

**How it works:**
- Uses in-memory storage (clears on server restart)
- Tracks requests by IP address
- Returns HTTP 429 (Too Many Requests) when limit exceeded
- Includes `retryAfter` header with seconds until reset

**For Production:**
If you expect high traffic, consider using Redis for rate limiting instead of in-memory storage. The current implementation is fine for most small-to-medium businesses.

---

### 3. Input Sanitization

Input sanitization is **already implemented** on all forms. No setup needed!

**What it does:**
- Removes HTML tags from user input
- Escapes special characters to prevent XSS
- Validates email formats
- Sanitizes phone numbers
- Trims whitespace

**Protected Forms:**
- Contact form
- Wholesale application form
- Review form

---

### 4. Security Headers

Security headers are **already configured** in `next.config.js`. No setup needed!

**Headers Added:**
- `Strict-Transport-Security` - Forces HTTPS
- `X-Frame-Options` - Prevents clickjacking
- `X-Content-Type-Options` - Prevents MIME sniffing
- `X-XSS-Protection` - XSS protection
- `Referrer-Policy` - Controls referrer information
- `Permissions-Policy` - Restricts browser features

These headers are automatically applied to all routes.

---

## 🧪 Testing Security Features

### Test Rate Limiting

1. Submit a form multiple times quickly (contact, wholesale, or review)
2. After the limit (5 for contact, 3 for wholesale/reviews), you should get:
   ```json
   {
     "success": false,
     "message": "Too many requests. Please try again later.",
     "retryAfter": 3600
   }
   ```

### Test reCAPTCHA

1. Open browser DevTools → Network tab
2. Submit a form
3. Look for a request to `/api/contact/submit` (or similar)
4. Check the request payload - it should include `recaptchaToken`
5. Check server logs - reCAPTCHA verification should happen

### Test Input Sanitization

1. Try submitting a form with HTML in the message:
   ```html
   <script>alert('XSS')</script>
   ```
2. The HTML should be stripped/escaped before being saved or sent

---

## 🔍 Monitoring

### Check Rate Limit Status

Rate limit status is returned in API responses when limit is exceeded:
- `retryAfter`: Seconds until the limit resets
- Check browser DevTools → Network tab for 429 responses

### Check reCAPTCHA Scores

reCAPTCHA scores are logged on the server. Check your server logs for:
- `reCAPTCHA verification error:` - If verification fails
- Scores are between 0.0 (bot) and 1.0 (human)

---

## 🚨 Troubleshooting

### reCAPTCHA Not Working

**Problem:** Forms submit but reCAPTCHA doesn't verify

**Solutions:**
1. Check environment variables are set correctly
2. Verify domain is added to reCAPTCHA console
3. Check browser console for errors
4. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` starts with `6L` (v3 keys start with this)

### Rate Limiting Too Strict

**Problem:** Legitimate users are being rate limited

**Solutions:**
1. Adjust limits in `src/lib/rateLimit.ts`:
   ```typescript
   export const RATE_LIMITS = {
     CONTACT: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // Increase from 5 to 10
     // ...
   };
   ```
2. Consider using Redis for more sophisticated rate limiting

### Security Headers Not Applied

**Problem:** Headers not showing in response

**Solutions:**
1. Verify `next.config.js` has the headers configuration
2. Restart your development server
3. Check in browser DevTools → Network → Response Headers
4. Note: Some headers may not show in development mode

---

## 📚 Additional Resources

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

## ✅ Security Checklist

Before going live, verify:

- [ ] reCAPTCHA Site Key and Secret Key are set
- [ ] reCAPTCHA domains include your production domain
- [ ] Environment variables are set in Vercel
- [ ] Rate limiting is working (test by submitting forms multiple times)
- [ ] Security headers are present (check in browser DevTools)
- [ ] Input sanitization is working (test with HTML in forms)
- [ ] All forms require reCAPTCHA token (check Network tab)

---

## 🎯 Next Steps

After setting up security:

1. **Test thoroughly** - Submit forms, check rate limits, verify reCAPTCHA
2. **Monitor** - Watch server logs for security-related errors
3. **Adjust** - Fine-tune rate limits and reCAPTCHA thresholds based on your traffic

Your website is now protected against common attacks and spam! 🛡️

