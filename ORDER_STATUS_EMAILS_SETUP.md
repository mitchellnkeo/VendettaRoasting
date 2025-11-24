# Order Status Update Emails

## Overview

The order status update email system automatically sends professional email notifications to customers when their order status changes to "Shipped" or "Delivered". This improves customer communication and reduces support inquiries.

## Features

### ✅ Order Shipped Email
- **Triggered:** When admin updates order status to "shipped"
- **Includes:**
  - Order number and shipping confirmation
  - Tracking number (if provided)
  - Tracking URL (if provided)
  - Estimated delivery date
  - List of items being shipped
  - Shipping address
  - Link to view order details

### ✅ Order Delivered Email
- **Triggered:** When admin updates order status to "delivered"
- **Includes:**
  - Order number and delivery confirmation
  - Delivery date
  - List of items delivered
  - Links to view order and shop again
  - Encouragement to leave a review

## How It Works

### Admin Workflow

1. **Navigate to Order Detail Page:**
   - Go to `/admin/orders`
   - Click "View" on any order

2. **Update Order Status:**
   - Select new status from dropdown (e.g., "Shipped" or "Delivered")
   - If status is "Shipped" or "Delivered", tracking fields appear:
     - **Tracking Number** (optional) - e.g., "1Z999AA10123456784"
     - **Tracking URL** (optional) - e.g., "https://tracking.carrier.com/..."
   - Add any internal notes
   - Click "Update Order"

3. **Email Sent Automatically:**
   - When status changes to "shipped" → Customer receives "Order Shipped" email
   - When status changes to "delivered" → Customer receives "Order Delivered" email
   - Success message confirms email was sent

### Technical Flow

1. Admin updates order status in admin dashboard
2. API endpoint (`/api/admin/orders/[orderId]`) receives update
3. System compares old status vs new status
4. If status changed to "shipped" or "delivered":
   - Fetches order details and items
   - Creates appropriate email template
   - Sends email via Resend
   - Logs success/failure (doesn't fail order update if email fails)

## Email Templates

### Order Shipped Email
- **Subject:** "Your Order #[ORDER_NUMBER] Has Shipped! 🚚"
- **Design:** Green tracking box with tracking information
- **CTA:** "View Order Details" button

### Order Delivered Email
- **Subject:** "Your Order #[ORDER_NUMBER] Has Been Delivered! ✅"
- **Design:** Green delivery confirmation box
- **CTAs:** "View Order Details" and "Shop Again" buttons

## Tracking Information

### Storing Tracking Data

Currently, tracking information is stored in the order's `notes` field in the format:
```
[existing notes]

Tracking Number: [tracking_number]
Tracking URL: [tracking_url]
```

This allows:
- Tracking info to be preserved
- Easy retrieval for email templates
- No database schema changes required

### Future Enhancement

Consider adding dedicated `tracking_number` and `tracking_url` columns to the `orders` table for better organization.

## Configuration

No additional configuration needed! The system uses existing email settings:

- `RESEND_API_KEY` - For sending emails
- `RESEND_FROM_EMAIL` - Sender email address
- `NEXTAUTH_URL` - For generating links in emails

## Testing

### Test Order Shipped Email

1. Create a test order (or use existing order)
2. Go to `/admin/orders/[orderId]`
3. Change status to "Shipped"
4. Optionally add tracking number and URL
5. Click "Update Order"
6. Check customer's email inbox
7. Verify email contains all order details and tracking info

### Test Order Delivered Email

1. Use an order with status "shipped"
2. Go to `/admin/orders/[orderId]`
3. Change status to "Delivered"
4. Click "Update Order"
5. Check customer's email inbox
6. Verify email contains delivery confirmation

## Error Handling

- **Email failures don't block order updates** - Order status is updated even if email fails
- **Errors are logged** to console for debugging
- **Admin sees success message** when email is sent successfully
- **Graceful degradation** - If email service is down, orders can still be updated

## Email Content Customization

Email templates are in `src/lib/email.ts`:
- `createOrderShippedEmail()` - Shipped email template
- `createOrderDeliveredEmail()` - Delivered email template

You can customize:
- Email styling (colors, fonts, layout)
- Email content (messages, CTAs)
- Branding elements

## Best Practices

1. **Always add tracking numbers** when marking orders as shipped
2. **Use tracking URLs** from carrier websites for better customer experience
3. **Update status promptly** to keep customers informed
4. **Check email delivery** in Resend dashboard if needed
5. **Test emails** before going live with real customers

## Troubleshooting

### Emails Not Sending

- ✅ Check `RESEND_API_KEY` is set in environment variables
- ✅ Verify `RESEND_FROM_EMAIL` is configured
- ✅ Check server logs for error messages
- ✅ Ensure customer email address is valid
- ✅ Verify Resend account is active

### Tracking Info Not Showing

- ✅ Make sure tracking fields are filled when status is "shipped"
- ✅ Check that tracking info is saved in order notes
- ✅ Verify email template is using tracking data correctly

### Status Updates Not Triggering Emails

- ✅ Ensure status actually changed (not just re-saving same status)
- ✅ Check that customer email exists on the order
- ✅ Verify email service is working (test with other emails)
- ✅ Check server logs for error messages

## Next Steps

Potential enhancements:
- Add scheduled email reminders (e.g., "Your order will arrive soon")
- Add review request emails after delivery
- Add order cancellation/refund email notifications
- Add tracking page integration (real-time tracking updates)
- Add email preferences (opt-in/opt-out for status updates)

