# Inventory Management Setup Guide

## ✅ Good News: Schema Fields Are Already Configured!

The `inventoryQuantity` and `lowStockThreshold` fields are **already defined** in your Sanity product schema. You don't need to modify any code - they're ready to use!

## Step 1: Set Up SANITY_API_TOKEN

The `SANITY_API_TOKEN` is required for the system to automatically decrease inventory when orders are placed. Here's how to set it up:

### Get Your Sanity API Token

1. **Go to Sanity Management Console:**
   - Visit [https://sanity.io/manage](https://sanity.io/manage)
   - Log in with your Sanity account

2. **Select Your Project:**
   - Find and select your project (ID: `pyoyob4y`)

3. **Navigate to API Settings:**
   - Click on **"API"** in the left sidebar
   - Go to **"Tokens"** tab

4. **Create a New Token:**
   - Click **"Add API token"** or **"Create token"**
   - Give it a name (e.g., "Inventory Management Token")
   - **Important:** Select **"Editor"** permissions (this allows reading and writing)
   - Click **"Save"**

5. **Copy the Token:**
   - The token will be displayed once (it looks like: `sk...`)
   - **Copy it immediately** - you won't be able to see it again!

### Add Token to Environment Variables

1. **Local Development (.env.local):**
   ```bash
   # Add this line to your .env.local file
   SANITY_API_TOKEN=your_token_here
   ```
   Replace `your_token_here` with the token you just copied.

2. **Vercel Production:**
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add a new variable:
     - **Name:** `SANITY_API_TOKEN`
     - **Value:** (paste your token)
     - **Environment:** Select all (Production, Preview, Development)
   - Click **"Save"**
   - **Important:** Redeploy your application for the change to take effect

### Verify Token is Working

After setting up the token, you can verify it's working by:

1. **Place a test order** through your website
2. **Check the server logs** - you should see:
   ```
   ✅ Inventory updated for product [product-id]: [old-quantity] → [new-quantity]
   ```
3. **Check Sanity Studio** - the product's `inventoryQuantity` should have decreased

If you see a warning like:
```
⚠️ SANITY_API_TOKEN not set. Inventory will not be updated.
```
Then the token isn't configured correctly.

## Step 2: Set Inventory for Existing Products

Since the schema fields are already defined, you just need to add values to your existing products:

### For Each Product in Sanity Studio:

1. **Open Sanity Studio:**
   - Run `npm run studio` locally, or
   - Visit your deployed Studio URL

2. **Edit Each Product:**
   - Go to **"Product"** in the left sidebar
   - Click on a product to edit it
   - Scroll down to find:
     - **"Inventory Quantity"** field
     - **"Low Stock Threshold"** field

3. **Set Values:**
   - **Inventory Quantity:** Enter your current stock (e.g., `50`, `100`, `0`)
   - **Low Stock Threshold:** Enter when you want alerts (default: `10`)
   - Click **"Publish"**

4. **Repeat for All Products:**
   - Go through each product and set these values
   - Products without inventory set will default to `0` (out of stock)

### Quick Bulk Update (Optional)

If you have many products, you can:
1. Export products from Sanity
2. Update the JSON with inventory values
3. Import back (or use Sanity's API)

Or manually update them in Sanity Studio as you go.

## Step 3: Verify Everything Works

### Test Inventory Decrease:

1. **Set a product's inventory to 10** in Sanity Studio
2. **Place a test order** for quantity 2
3. **Check Sanity Studio** - inventory should now be 8
4. **Check server logs** - should show successful update

### Test Low Stock Alert:

1. **Set a product's inventory to 5** (below threshold of 10)
2. **Go to `/admin`** dashboard
3. **Verify** the product appears in the yellow "Low Stock Alert" box
4. **Click "Send Email Alert"** to test email functionality

### Test Out of Stock Prevention:

1. **Set a product's inventory to 0** in Sanity Studio
2. **Visit the shop page**
3. **Verify** the product shows "Out of Stock"
4. **Try to add to cart** - should be disabled with error message

## Troubleshooting

### Inventory Not Updating

**Problem:** Orders complete but inventory doesn't decrease

**Solutions:**
- ✅ Check `SANITY_API_TOKEN` is set in `.env.local` (local) or Vercel (production)
- ✅ Verify token has "Editor" permissions in Sanity
- ✅ Check server logs for error messages
- ✅ Ensure token is not expired (create a new one if needed)
- ✅ Restart your development server after adding token to `.env.local`

### Low Stock Widget Not Showing

**Problem:** No products appear in low stock widget

**Solutions:**
- ✅ Verify products have `inventoryQuantity` set (not empty/null)
- ✅ Check that `lowStockThreshold` is set (default: 10)
- ✅ Ensure products are marked as `isActive: true`
- ✅ Check browser console for API errors

### Products Show "Out of Stock" When They Shouldn't

**Problem:** Products with inventory show as out of stock

**Solutions:**
- ✅ Check `inventoryQuantity` is set in Sanity (not 0 or null)
- ✅ Verify product is marked as `isActive: true`
- ✅ Clear browser cache and refresh
- ✅ Check API response in browser DevTools Network tab

## Environment Variables Summary

Make sure these are set in both `.env.local` (local) and Vercel (production):

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=pyoyob4y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...your-token-here...

# Email Configuration (for low stock alerts)
ADMIN_EMAIL=your-admin-email@example.com
RESEND_API_KEY=re...your-resend-key...
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Next Steps

Once everything is set up:

1. ✅ Set inventory quantities for all products in Sanity
2. ✅ Configure low stock thresholds (default: 10, or customize per product)
3. ✅ Test with a real order to verify inventory decreases
4. ✅ Monitor the admin dashboard for low stock alerts
5. ✅ Set up regular inventory updates in Sanity as stock changes

## Need Help?

- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure Sanity token has proper permissions
- Test with a single product first before bulk updates

