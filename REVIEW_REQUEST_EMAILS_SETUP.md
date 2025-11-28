# Review Request Emails Setup Guide

## Overview

The review request email system allows you to automatically encourage customers to leave reviews after their orders have been delivered. This helps build social proof and improve your product ratings.

## Features

### ✅ Review Request Email
- **Triggered:** Manually by admin from order detail page
- **When:** Only for orders with status "delivered"
- **Includes:**
  - Personalized greeting with customer name
  - Order number and delivery date
  - List of products from the order
  - Direct links to each product's review page
  - Professional, branded email design
  - Links to view order and shop again

## How It Works

### Admin Workflow

1. **Navigate to Delivered Order:**
   - Go to `/admin/orders`
   - Find an order with status "delivered"
   - Click "View" to open order details

2. **Send Review Request:**
   - Scroll to the "Review Request" section (appears only for delivered orders)
   - Click "Send Review Request Email" button
   - Confirm the action
   - Email is sent to the customer

3. **Customer Receives Email:**
   - Customer gets a beautifully designed email
   - Each product has a "Leave a Review" button
   - Clicking takes them directly to the product page where they can leave a review

### Technical Flow

1. Admin clicks "Send Review Request Email" button
2. API endpoint (`/api/admin/orders/send-review-request`) receives request
3. System validates:
   - Order exists
   - Order status is "delivered"
   - Customer email exists
4. Fetches order items and product information
5. Looks up product slugs from Sanity CMS
6. Creates personalized email with product review links
7. Sends email via Resend
8. Returns success confirmation

## Email Template

### Review Request Email
- **Subject:** `⭐ We'd Love Your Feedback on Order #[ORDER_NUMBER]`
- **Design:** Professional, branded email with coffee theme
- **Content:**
  - Thank you message
  - Order number and delivery date
  - List of products with individual review links
  - Call-to-action buttons
  - Links to view order and shop again

### Product Links

Each product in the email includes:
- Product name
- Quantity purchased
- Direct link to product page (where review form is located)
- Link format: `https://yoursite.com/shop/[product-slug]`

## Product Slug Resolution

The system automatically resolves product slugs using this priority:

1. **By SKU (Most Reliable):** Looks up product in Sanity by SKU
2. **By Product Name:** Falls back to searching by product name if SKU not found
3. **Generated Slug:** Creates a URL-friendly slug from product name as last resort

This ensures customers always get working links to product pages.

## Configuration

No additional configuration needed! The system uses existing email settings:

- `RESEND_API_KEY` - For sending emails
- `RESEND_FROM_EMAIL` - Sender email address
- `NEXTAUTH_URL` or `NEXT_PUBLIC_SITE_URL` - For generating product links
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - For fetching product information
- `SANITY_API_TOKEN` - For accessing Sanity data

## Testing

### Test Review Request Email

1. **Create or find a delivered order:**
   - Go to `/admin/orders`
   - Find an order with status "delivered"
   - Or update an order status to "delivered"

2. **Send review request:**
   - Open the order detail page
   - Scroll to "Review Request" section
   - Click "Send Review Request Email"
   - Confirm the action

3. **Check customer email:**
   - Verify email was received
   - Check that all product links work
   - Test clicking "Leave a Review" buttons
   - Verify links go to correct product pages

4. **Test product slug resolution:**
   - Try with products that have SKUs
   - Try with products that don't have SKUs
   - Verify fallback slug generation works

## Best Practices

1. **Timing:** Send review requests 2-3 days after delivery (not immediately)
2. **Frequency:** Only send one review request per order
3. **Personalization:** Use customer's name in the email
4. **Product Links:** Ensure all product links are working before sending
5. **Follow-up:** Consider sending a follow-up if customer doesn't review after a week

## Future Enhancements

Potential improvements:
- **Automatic Sending:** Automatically send review requests 2-3 days after delivery
- **Scheduled Emails:** Use a cron job or queue system for delayed sending
- **Review Tracking:** Track which orders have had review requests sent
- **A/B Testing:** Test different email templates and timing
- **Reminder Emails:** Send a gentle reminder if no review after 1 week
- **Incentives:** Offer discounts or rewards for leaving reviews

## Troubleshooting

### Email Not Sending

- ✅ Check `RESEND_API_KEY` is set in environment variables
- ✅ Verify `RESEND_FROM_EMAIL` is configured
- ✅ Check server logs for error messages
- ✅ Ensure customer email address is valid
- ✅ Verify Resend account is active

### Product Links Not Working

- ✅ Check that products exist in Sanity
- ✅ Verify product SKUs are correct in order items
- ✅ Test product slug resolution manually
- ✅ Check that product pages are accessible
- ✅ Verify `NEXTAUTH_URL` or `NEXT_PUBLIC_SITE_URL` is set correctly

### Product Slugs Not Found

- ✅ Ensure products have SKUs set in Sanity
- ✅ Check that product names match between order and Sanity
- ✅ Verify Sanity API token has read permissions
- ✅ Check server logs for Sanity fetch errors

## Email Content Customization

Email template is in `src/lib/email.ts`:
- `createReviewRequestEmail()` - Review request email template

You can customize:
- Email styling (colors, fonts, layout)
- Email content (messages, CTAs)
- Branding elements
- Product link formatting

---

## Quick Start

1. **Find a delivered order** in `/admin/orders`
2. **Click "View"** to open order details
3. **Click "Send Review Request Email"** button
4. **Confirm** and email is sent!

That's it! The customer will receive a beautiful email with direct links to review each product.

