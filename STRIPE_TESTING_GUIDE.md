# Stripe Payment Testing Guide

This guide will help you test the complete order flow from checkout to database storage to admin dashboard.

## Prerequisites

✅ Database is set up and connected (Supabase)  
✅ Stripe account created  
✅ Stripe API keys configured in `.env.local`

---

## Step 1: Configure Stripe Test Mode

### 1.1 Get Your Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top right)
3. Go to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### 1.2 Add to `.env.local`

Add these to your `.env.local` file:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### 1.3 Verify Stripe Configuration

Check that `src/lib/stripe.ts` is configured correctly. It should look like:

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})
```

---

## Step 2: Test Stripe Payment Cards

Stripe provides test cards that work in test mode. Use these:

### Successful Payments

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Visa - Always succeeds |
| `5555 5555 5555 4444` | Mastercard - Always succeeds |
| `4000 0566 5566 5556` | Visa (debit) - Always succeeds |

**Test Card Details:**
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

### Declined Payments (for testing errors)

| Card Number | Description |
|------------|-------------|
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |

---

## Step 3: Complete Test Order Flow

### 3.1 Add Items to Cart

1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Go to **Shop** page
4. Add items to cart (click "Add to Cart")
5. Click cart icon to view cart

### 3.2 Proceed to Checkout

1. Click **Checkout** button
2. Fill in shipping information:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Phone: `555-1234`
   - Address: `123 Test St`
   - City: `Seattle`
   - State: `WA`
   - ZIP: `98101`
   - Country: `US`
3. Select shipping method
4. Click **Continue to Payment**

### 3.3 Enter Test Card

1. In the Stripe payment form, enter:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiry:** `12/34`
   - **CVC:** `123`
   - **ZIP:** `12345`
2. Click **Pay** or **Complete Order**

### 3.4 Verify Success

You should see:
- ✅ Success message
- ✅ Order confirmation page
- ✅ Order number displayed

---

## Step 4: Verify Order in Supabase

### 4.1 Check Orders Table

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Table Editor** in left sidebar
4. Click on **orders** table
5. You should see your test order with:
   - Order number (e.g., `ORD-1234567890-ABC123`)
   - Status: `pending`
   - Payment status: `paid`
   - Customer email
   - Total amount

### 4.2 Check Order Items

1. In Supabase, click on **order_items** table
2. You should see items from your order:
   - Product names
   - Quantities
   - Prices

### 4.3 Check User Created

1. Click on **users** table
2. You should see a user with email `test@example.com`
3. If the user didn't exist, it was created automatically

---

## Step 5: Verify Order in Admin Dashboard

### 5.1 Access Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@vendettaroasting.com`
   - Password: `admin123`

### 5.2 View Orders

1. Click **Orders** in the sidebar
2. You should see your test order in the list with:
   - Order number
   - Customer name/email
   - Date
   - Status: `pending`
   - Payment status: `paid`
   - Total amount

### 5.3 View Order Details

1. Click **View** next to your order
2. You should see:
   - Full order information
   - Order items with quantities and prices
   - Customer information
   - Shipping address
   - Order totals (subtotal, tax, shipping, total)

### 5.4 Test Status Update

1. On the order detail page, update:
   - **Order Status:** Change to `processing` or `shipped`
   - **Payment Status:** Should be `paid`
   - **Notes:** Add a test note
2. Click **Update Order**
3. Verify the update was saved

---

## Step 6: Verify Complete Flow

### Checklist

- [X] ✅ Test card payment succeeded
- [X] ✅ Order confirmation page displayed
- [X] ✅ Order saved to Supabase `orders` table
- [X] ✅ Order items saved to Supabase `order_items` table
- [X] ✅ User created/found in Supabase `users` table
- [X] ✅ Order appears in admin dashboard orders list
- [ ] ✅ Order details viewable in admin dashboard
- [ ] ✅ Order status can be updated in admin dashboard

---

## Troubleshooting

### Issue: Payment fails

**Check:**
- ✅ Are you using test mode keys? (must start with `pk_test_` and `sk_test_`)
- ✅ Is Stripe test mode enabled in dashboard?
- ✅ Are you using a test card number?
- ✅ Check browser console for errors
- ✅ Check terminal/server logs for errors

### Issue: Order not saved to database

**Check:**
- ✅ Is `DATABASE_URL` set correctly in `.env.local`?
- ✅ Can you connect to database? Run `npm run db:test`
- ✅ Check terminal for database errors
- ✅ Verify tables exist in Supabase

### Issue: Order not appearing in admin dashboard

**Check:**
- ✅ Is order in Supabase `orders` table?
- ✅ Refresh the admin orders page
- ✅ Check browser console for API errors
- ✅ Verify admin authentication is working

### Issue: Stripe payment form not loading

**Check:**
- ✅ Is `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set?
- ✅ Is the key correct? (starts with `pk_test_`)
- ✅ Check browser console for Stripe errors
- ✅ Verify Stripe script is loading

---

## Testing Different Scenarios

### Test 1: Successful Order
- Use card: `4242 4242 4242 4242`
- Verify order saved and appears in admin

### Test 2: Declined Payment
- Use card: `4000 0000 0000 0002`
- Verify error message shown
- Verify no order created

### Test 3: Guest Checkout
- Don't log in
- Complete order as guest
- Verify user is created in database with email

### Test 4: Existing User Order
- Create order with same email twice
- Verify user is reused (not duplicated)

### Test 5: Order Status Updates
- Create order
- Update status in admin dashboard
- Verify status persists

---

## Quick Test Script

Run this to verify everything is configured:

```bash
# Test database connection
npm run db:test

# Check environment variables (don't show values)
grep -E "STRIPE|DATABASE" .env.local | sed 's/=.*/=***/'
```

---

## Expected Database State After Test Order

### `orders` table:
- 1 row with your test order
- `order_number`: `ORD-...`
- `status`: `pending`
- `payment_status`: `paid`
- `total_amount`: Your order total

### `order_items` table:
- Multiple rows (one per item in cart)
- `order_id`: References the order
- `product_name`: Name of product
- `quantity`: Quantity ordered
- `unit_price`: Price per item
- `total_price`: Quantity × unit_price

### `users` table:
- 1 row with email `test@example.com`
- `first_name`: `Test`
- `last_name`: `User`
- `role`: `customer`

---

## Next Steps

Once testing is complete:

1. ✅ Verify all orders appear correctly
2. ✅ Test order status updates
3. ✅ Test filtering and search in admin dashboard
4. ✅ Test with multiple orders
5. ✅ Verify order numbers are unique

---

## Production Checklist

Before going live:

- [ ] Switch to Stripe **Live mode** keys
- [ ] Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to live key
- [ ] Update `STRIPE_SECRET_KEY` to live key
- [ ] Test with real card (small amount)
- [ ] Set up Stripe webhooks for production
- [ ] Configure email notifications
- [ ] Set up order confirmation emails

---

## Support

If you encounter issues:

1. Check terminal logs for errors
2. Check browser console for client-side errors
3. Check Supabase logs (Dashboard → Logs)
4. Check Stripe dashboard for payment events
5. Verify all environment variables are set correctly

---

## Summary

The complete flow should be:

1. **Customer** → Adds items to cart → Goes to checkout
2. **Stripe** → Processes payment → Returns success
3. **Backend** → Creates order in database → Saves order items
4. **Database** → Stores order, items, and user
5. **Admin** → Views order in dashboard → Updates status

All steps should work seamlessly! 🎉

---

## Quick Reference Checklist

### Before Testing
- [ ] Stripe test mode enabled
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set (starts with `pk_test_`)
- [ ] `STRIPE_SECRET_KEY` set (starts with `sk_test_`)
- [ ] `DATABASE_URL` configured and working
- [ ] Database tables created (`npm run db:setup`)
- [ ] Dev server running (`npm run dev`)

### During Test
- [ ] Add items to cart
- [ ] Fill checkout form
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Payment succeeds
- [ ] Order confirmation shown

### After Test - Verify
- [ ] Order in Supabase `orders` table
- [ ] Order items in Supabase `order_items` table
- [ ] User in Supabase `users` table
- [ ] Order visible in admin dashboard
- [ ] Order details viewable
- [ ] Status can be updated

---

## Environment Variables Needed

Make sure your `.env.local` has:

```bash
# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://postgres.xxxxx:password%40@aws-0-us-west-2.pooler.supabase.com:6543/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

---

## Common Test Cards Reference

| Card Number | Result | Use Case |
|------------|--------|----------|
| `4242 4242 4242 4242` | ✅ Success | Normal successful payment |
| `5555 5555 5555 4444` | ✅ Success | Mastercard success |
| `4000 0000 0000 0002` | ❌ Declined | Test declined card |
| `4000 0000 0000 9995` | ❌ Insufficient funds | Test insufficient funds |
| `4000 0000 0000 0069` | ❌ Expired | Test expired card |

**All test cards use:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

