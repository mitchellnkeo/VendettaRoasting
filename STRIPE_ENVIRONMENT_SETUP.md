# Stripe Environment Variables Setup

## Best Practice: Separate Test and Live Keys

You should **NOT** have both test and live keys active at the same time. Here's the recommended approach:

---

## Option 1: Comment Out (Recommended for Local Development)

In your `.env.local` file, keep one set active and comment out the other:

```bash
# ============================================
# STRIPE CONFIGURATION - TEST MODE (Development)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
STRIPE_SECRET_KEY=sk_test_your_test_key_here

# ============================================
# STRIPE CONFIGURATION - LIVE MODE (Production)
# ============================================
# Uncomment these ONLY when testing live mode locally
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
# STRIPE_SECRET_KEY=sk_live_your_live_key_here
```

**When to switch:**
- **Development:** Use test keys (uncommented)
- **Production testing:** Comment test keys, uncomment live keys (be careful!)
- **Production:** Use Vercel environment variables (see Option 2)

---

## Option 2: Use Environment-Specific Files (Advanced)

Create separate files for different environments:

### `.env.local` (Development - Test Mode)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### `.env.production.local` (Production - Live Mode)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

**Note:** Next.js automatically loads `.env.local` in development and `.env.production.local` in production builds.

---

## Option 3: Use Vercel Environment Variables (Recommended for Production)

**For Production (Vercel):**

1. **Never put live keys in `.env.local`** (they might get committed)
2. **Use Vercel Dashboard** to set production environment variables:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
     - `STRIPE_SECRET_KEY` = `sk_live_...`
   - Set to **Production** environment only

3. **Keep test keys in `.env.local`** for local development

This way:
- ✅ Local development uses test keys
- ✅ Production uses live keys (from Vercel)
- ✅ Live keys never in your code repository
- ✅ No risk of accidentally using live keys locally

---

## Recommended Setup

### For Local Development (`.env.local`):
```bash
# Stripe - TEST MODE (for local development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...

# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```

### For Production (Vercel Environment Variables):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_SECRET_KEY=sk_live_51...
```

---

## Important Security Notes

### ⚠️ NEVER:
- ❌ Commit live Stripe keys to Git
- ❌ Share live keys in screenshots or messages
- ❌ Use live keys in development
- ❌ Have both test and live keys active simultaneously

### ✅ ALWAYS:
- ✅ Use test keys for local development
- ✅ Use Vercel environment variables for production
- ✅ Add `.env.local` to `.gitignore` (should already be there)
- ✅ Verify you're in test mode when testing locally
- ✅ Double-check which keys are active before testing

---

## How to Verify Which Keys Are Active

### Check in Terminal:
```bash
# See which Stripe keys are set (without showing values)
grep STRIPE .env.local | sed 's/=.*/=***/'
```

### Check in Code:
Add a temporary log in `src/lib/stripe.ts`:
```typescript
console.log('Stripe Key Type:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST' : 'LIVE');
```

### Check in Browser:
Look at the Stripe payment form - if it's test mode, Stripe will show "TEST MODE" in the UI.

---

## Switching Between Test and Live (If Needed)

If you need to test with live keys locally (not recommended, but sometimes necessary):

1. **Backup your current `.env.local`**
2. **Comment out test keys:**
   ```bash
   # NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   # STRIPE_SECRET_KEY=sk_test_...
   ```
3. **Uncomment live keys:**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```
4. **Restart dev server:** `npm run dev`
5. **Test carefully** - you're using real money!
6. **Switch back immediately** after testing

---

## Quick Reference

| Environment | Keys Location | Key Type | When to Use |
|------------|---------------|----------|-------------|
| **Local Dev** | `.env.local` | `pk_test_` / `sk_test_` | Always for development |
| **Production** | Vercel Dashboard | `pk_live_` / `sk_live_` | Deployed production site |
| **Staging** | Vercel (Preview) | `pk_test_` / `sk_test_` | Preview deployments |

---

## Summary

**Best Practice:**
1. ✅ Keep **test keys** in `.env.local` for local development
2. ✅ Set **live keys** in **Vercel environment variables** for production
3. ✅ Comment out unused keys if you need both in one file
4. ✅ Never commit live keys to Git
5. ✅ Always verify which mode you're in before testing

This keeps your development safe and your production secure! 🔒

