# Order History Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Orders Don't Show in User History

**Possible Causes:**

1. **Email Mismatch**
   - Orders are created with the email from checkout
   - If you're logged in with a different email, orders won't appear
   - **Solution:** Log in with the same email used during checkout

2. **Guest Checkout**
   - If you placed an order without logging in, a user account was created with the checkout email
   - You need to log in with that exact email to see orders
   - **Solution:** Use the same email you entered during checkout

3. **User Not Found**
   - The logged-in email doesn't exist in the database
   - **Solution:** Place an order first (this creates the user account)

### Issue 2: Admin Dashboard Shows "Database Not Configured"

**Possible Causes:**

1. **No Orders Yet**
   - The message appears when there are no orders in the database
   - This is normal if no orders have been placed
   - **Solution:** Place a test order through checkout

2. **Database Connection Issue**
   - Check that `DATABASE_URL` is set in `.env.local`
   - Verify connection: `npm run db:test`
   - **Solution:** Ensure database is connected and schema is created

## How to Verify Orders Were Created

### Check in Supabase:

1. Go to Supabase Dashboard → Table Editor
2. Check `orders` table - should see your test orders
3. Check `order_items` table - should see items for each order
4. Check `users` table - should see user created from checkout

### Check in Terminal:

```bash
# Test database connection
npm run db:test

# Check terminal logs when placing order
# Look for: "✅ Order saved to database: ORD-..."
```

## Testing the Complete Flow

### Step 1: Place a Test Order

1. Go to checkout (don't log in - use guest checkout)
2. Enter email: `test@example.com`
3. Complete payment with test card: `4242 4242 4242 4242`
4. Check terminal for: `✅ Order saved to database`

### Step 2: Verify in Database

1. Check Supabase `orders` table
2. Should see order with email `test@example.com`
3. Check `users` table - should see user with that email

### Step 3: View in Admin Dashboard

1. Go to `/admin/orders`
2. Should see the test order
3. Click "View" to see details

### Step 4: View in User History

**Important:** You need to log in with the SAME email used during checkout!

1. If you used `test@example.com` during checkout:
   - You need to log in with `test@example.com`
   - But NextAuth might not have that user...
   - **Solution:** The user was created during checkout, but NextAuth doesn't know about it

**The Issue:** NextAuth and the database users are separate systems!

## The Real Problem: NextAuth vs Database Users

**Current Setup:**
- NextAuth uses hardcoded admin user
- Database creates users during checkout
- These are **not linked**!

**Solutions:**

### Option A: Log in with Checkout Email (If NextAuth supports it)
- Currently NextAuth only has admin user
- Database has users from checkout
- They don't match

### Option B: Link Orders to Session (Recommended)
- When user is logged in via NextAuth, link orders to that user
- When guest checkout, create user and link orders
- Match by email when possible

### Option C: Use Same Email System
- Make NextAuth use database users
- Or make checkout use NextAuth users
- Currently they're separate

## Quick Fix for Testing

To see orders in user history:

1. **Place an order** with email: `test@example.com`
2. **Check Supabase** - verify order exists
3. **For now, orders won't show in user history** because:
   - NextAuth doesn't have `test@example.com` as a user
   - The database has the user, but NextAuth session doesn't match

**Workaround:** View orders in admin dashboard instead (admin can see all orders)

## Next Steps

To properly fix user order history, we need to:

1. **Link NextAuth to database users** - OR
2. **Allow users to view orders by email** (even if not logged in via NextAuth) - OR  
3. **Create NextAuth users from database users** during login

For now, the admin dashboard should work to view all orders!

