# Google Analytics 4 Setup Guide

This guide explains how to set up Google Analytics 4 (GA4) for your Vendetta Roasting website.

## ✅ Analytics Features Implemented

1. **Page View Tracking** - Automatic tracking on all page navigations
2. **E-commerce Conversion Tracking** - Purchase events with transaction details
3. **Product View Tracking** - Tracks when users view product pages
4. **Add to Cart Tracking** - Tracks when items are added to cart
5. **Begin Checkout Tracking** - Tracks when users start checkout
6. **Purchase Tracking** - Tracks completed purchases with full order details
7. **Event Tracking** - Custom events for user interactions

---

## 🔧 Setup Instructions

### Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Admin"** (gear icon) in the bottom left
4. In the **"Property"** column, click **"Create Property"**
5. Fill in the property details:
   - **Property name:** Vendetta Roasting
   - **Reporting time zone:** Your timezone
   - **Currency:** USD
   - Click **"Next"**
6. Fill in business information:
   - **Industry category:** Food & Beverage
   - **Business size:** Select appropriate size
   - Click **"Next"**
7. Select **"Web"** as your platform
8. Enter your website URL (e.g., `vendettaroasting.com`)
9. Click **"Create stream"**

### Step 2: Get Your Measurement ID

1. After creating the property, you'll see a **"Web stream"** card
2. Click on the stream to open its details
3. Find your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Copy this ID - you'll need it in the next step

### Step 3: Add Environment Variable

Add the Measurement ID to your `.env.local` file:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### Step 4: Add to Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Name:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** Your Measurement ID (e.g., `G-XXXXXXXXXX`)
   - **Environment:** Production, Preview, Development (select all)
4. Click **"Save"**

### Step 5: Enable E-commerce Tracking

1. In Google Analytics, go to **Admin** → **Data Streams**
2. Click on your web stream
3. Scroll down to **"Enhanced measurement"**
4. Make sure **"E-commerce"** is enabled
5. Click **"Save"**

### Step 6: Verify Setup

1. Restart your development server
2. Visit your website
3. Navigate to a few pages
4. Add a product to cart
5. In Google Analytics, go to **Reports** → **Realtime**
6. You should see your activity appear within a few seconds

---

## 📊 What's Being Tracked

### Automatic Tracking

- **Page Views:** Every page navigation is automatically tracked
- **Product Views:** When users view individual product pages
- **Add to Cart:** When items are added to the shopping cart
- **Begin Checkout:** When users start the checkout process
- **Purchases:** When orders are completed (includes transaction ID, value, items)

### Event Details

**Purchase Events Include:**
- Transaction ID
- Total value
- Currency (USD)
- List of items with:
  - Item ID
  - Item name
  - Price
  - Quantity

**Add to Cart Events Include:**
- Item ID
- Item name
- Item category (if available)
- Price
- Quantity

---

## 🧪 Testing Analytics

### Test Page Views

1. Open your website
2. Navigate to different pages
3. Check Google Analytics → **Realtime** → **Overview**
4. You should see page views appearing

### Test E-commerce Events

1. Add a product to cart
2. Go to checkout
3. Complete a test purchase
4. In Google Analytics, go to **Realtime** → **Events**
5. You should see:
   - `add_to_cart` event
   - `begin_checkout` event
   - `purchase` event

### Test in Debug Mode

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable it
3. Open browser DevTools → Console
4. You'll see detailed GA4 event logs

---

## 📈 Viewing Your Data

### Realtime Reports

- **Location:** Reports → Realtime
- **Shows:** Current active users, page views, events
- **Use:** Verify tracking is working

### E-commerce Reports

- **Location:** Reports → Monetization → E-commerce purchases
- **Shows:** Purchase data, revenue, conversion rates
- **Use:** Analyze sales performance

### Events Report

- **Location:** Reports → Engagement → Events
- **Shows:** All tracked events (add_to_cart, begin_checkout, purchase, etc.)
- **Use:** Understand user behavior

### Custom Reports

You can create custom reports in GA4 to track:
- Product performance
- Conversion funnels
- User journeys
- Revenue by product category

---

## 🔍 Troubleshooting

### Analytics Not Working

**Problem:** No data appearing in Google Analytics

**Solutions:**
1. Check that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Verify the Measurement ID format (should start with `G-`)
3. Check browser console for errors
4. Ensure you're not using an ad blocker (they block GA)
5. Wait a few minutes - data can take time to appear

### Events Not Showing

**Problem:** Page views work but events don't appear

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify `window.gtag` is defined (check in console)
3. Use Google Analytics Debugger extension
4. Check that events are being called (add console.log to track functions)

### Purchase Events Missing

**Problem:** Purchases not tracked

**Solutions:**
1. Verify purchase tracking is called after successful payment
2. Check that `orderId` is being generated correctly
3. Ensure checkout success page is reached
4. Check browser console for errors during checkout

---

## 🎯 Next Steps

After setting up GA4:

1. **Set up Goals/Conversions:**
   - Go to Admin → Events
   - Mark `purchase` as a conversion event
   - Mark `sign_up` (subscriptions) as a conversion event

2. **Create Custom Reports:**
   - Set up reports for product performance
   - Create conversion funnels
   - Track customer lifetime value

3. **Set up Audiences:**
   - Create audiences for remarketing
   - Segment customers by purchase behavior

4. **Link with Google Ads:**
   - Connect GA4 with Google Ads for better tracking
   - Import conversions to Google Ads

---

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 Debugging Guide](https://support.google.com/analytics/answer/7201382)

---

## ✅ Setup Checklist

Before going live, verify:

- [ ] Google Analytics 4 property created
- [ ] Measurement ID obtained
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in `.env.local`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel
- [ ] E-commerce tracking enabled in GA4
- [ ] Page views appearing in Realtime report
- [ ] Add to cart events working
- [ ] Purchase events working (test with a real purchase)
- [ ] No console errors related to analytics

Your analytics are now set up and tracking! 📊

