# Pre-Launch Checklist for Vendetta Roasting

This checklist covers everything you should review and implement before launching your website to customers.

---

## ✅ **Already Completed**

### Core Features
- ✅ E-commerce functionality (products, cart, checkout)
- ✅ Stripe payment processing
- ✅ User authentication & accounts
- ✅ Admin dashboard (orders, customers, subscriptions, products, reviews, analytics)
- ✅ Content management (Sanity CMS - all major pages editable)
- ✅ Email service (Resend - order confirmations, status updates, contact forms, wholesale applications, review requests)
- ✅ Inventory management (automatic tracking, low stock alerts)
- ✅ SEO optimization (meta tags, structured data, sitemap, robots.txt)
- ✅ Review system (anonymous reviews with moderation)
- ✅ Modern, responsive design
- ✅ Domain setup guide

### Security & Compliance
- ✅ Rate limiting on forms and APIs
- ✅ Google reCAPTCHA v3 on public forms
- ✅ Input sanitization (XSS prevention)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Privacy Policy page
- ✅ Terms of Service page
- ✅ Shipping Policy page
- ✅ Return/Refund Policy page

### Error Handling & Monitoring
- ✅ Custom 404 page
- ✅ Custom 500 page
- ✅ React Error Boundary component
- ✅ Sentry error monitoring and performance tracking
- ✅ Session replay for debugging

### Analytics & Performance
- ✅ Google Analytics 4 integration
- ✅ E-commerce conversion tracking (purchases, subscriptions, add to cart)
- ✅ Admin Analytics Dashboard (revenue trends, top products, customer metrics)
- ✅ Image optimization (Next.js Image, AVIF/WebP)
- ✅ Caching strategies (API routes, static assets)
- ✅ Resource hints (preconnect, dns-prefetch)

### Email Features
- ✅ Order confirmation emails
- ✅ Order shipped emails (with tracking)
- ✅ Order delivered emails
- ✅ Review request emails (manual trigger)
- ✅ Contact form notifications (admin + auto-reply)
- ✅ Wholesale application notifications (admin + confirmation)

---

## 🚨 **Critical Before Launch** (Must Have)

### 1. **Security Enhancements** 🔒 ✅ **COMPLETED**

**Why:** Protect against spam, abuse, and attacks

**What's implemented:**
- ✅ **Rate limiting** on forms (contact, wholesale, reviews)
  - IP-based rate limiting (5 submissions per hour per IP)
  - Per-endpoint rate limits
- ✅ **CAPTCHA** on public forms (contact, wholesale, reviews)
  - Google reCAPTCHA v3 (invisible)
  - Prevents bot submissions
- ✅ **Input sanitization** improvements
  - All user inputs sanitized
  - XSS prevention
  - Email and phone validation
- ✅ **Security headers** (Next.js config)
  - Strict-Transport-Security
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy

**Testing Required:**
- [ ] Test rate limiting (submit form 6 times quickly, should block)
- [ ] Test reCAPTCHA (verify it appears and works)
- [ ] Test input sanitization (try XSS payloads, should be sanitized)
- [ ] Verify security headers in browser DevTools

---

### 2. **Legal Pages** ⚖️ ✅ **COMPLETED**

**Why:** Legal compliance and customer trust

**What's created:**
- ✅ **Privacy Policy** (`/privacy-policy`)
  - Data collection practices
  - Cookie usage
  - Third-party services (Stripe, Sanity, etc.)
  - User rights
- ✅ **Terms of Service** (`/terms-of-service`)
  - Purchase terms
  - Return/refund policy
  - User responsibilities
  - Limitation of liability
- ✅ **Shipping Policy** (`/shipping-policy`)
  - Shipping methods and costs
  - Delivery times
  - Shipping information
- ✅ **Return/Refund Policy** (`/return-policy`)
  - Return eligibility
  - Refund process
  - Timeframes

**Testing Required:**
- [ ] Verify all legal pages are accessible
- [ ] Check that pages are linked in footer
- [ ] Review content for accuracy (update business-specific details)
- [ ] Test mobile responsiveness of legal pages

---

### 3. **Error Pages** 🚫 ✅ **COMPLETED**

**Why:** Better user experience when things go wrong

**What's created:**
- ✅ **404 Page** (`pages/404.tsx`)
  - Friendly "Page Not Found" message
  - Link back to homepage
  - Contact support link
- ✅ **500 Page** (`pages/500.tsx`)
  - "Something went wrong" message
  - Contact information
  - Link back to homepage
- ✅ **Error Boundary** component
  - Catch React errors gracefully
  - Show friendly error message
  - Log errors to Sentry

**Testing Required:**
- [ ] Visit a non-existent page (e.g., `/test-page-404`) - should show 404
- [ ] Test 404 page links work (homepage, contact)
- [ ] Verify 500 page displays correctly (if possible to trigger)
- [ ] Test Error Boundary (should catch React errors gracefully)

---

### 4. **Analytics & Tracking** 📊 ✅ **COMPLETED**

**Why:** Understand customer behavior and optimize

**What's implemented:**
- ✅ **Google Analytics 4** integration
  - Page view tracking
  - E-commerce conversion tracking (purchases, add to cart, begin checkout)
  - Subscription signup tracking
  - Customer behavior analytics
- ✅ **Admin Analytics Dashboard**
  - Revenue trends (daily, weekly, monthly)
  - Top products by revenue
  - Customer metrics (new vs. repeat)
  - Order status breakdown
  - Average order value

**Testing Required:**
- [ ] Verify GA4 is tracking page views (check GA4 dashboard)
- [ ] Complete a test purchase and verify conversion event fires
- [ ] Test "Add to Cart" event tracking
- [ ] Test subscription signup tracking
- [ ] Verify admin analytics dashboard loads and displays data
- [ ] Test date range filters in admin analytics

---

### 5. **Comprehensive Testing & Quality Assurance** ✅ **CRITICAL**

**See detailed testing checklist below for complete test procedures.**

---

### 6. **Environment Variables Check** 🔐 **CRITICAL**

**Verify all are set in `.env.local` and Vercel:**
- [ ] `DATABASE_URL` - Database connection
- [ ] `NEXTAUTH_URL` - Auth callback URL
- [ ] `NEXTAUTH_SECRET` - Auth secret
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `RESEND_API_KEY` - Email service
- [ ] `RESEND_FROM_EMAIL` - Email sender
- [ ] `ADMIN_EMAIL` - Admin notification email
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project
- [ ] `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset
- [ ] `SANITY_API_TOKEN` - Sanity API token
- [ ] `NEXT_PUBLIC_SITE_URL` - Your domain URL

**Impact:** Missing variables = broken features.

---

### 7. **Database Migration** 💾 **REQUIRED**

**What to do:**
- [ ] Run review system migration
  ```bash
  npm run db:migrate migrations/add-anonymous-reviews.sql
  ```
- [ ] Verify migration succeeded
- [ ] Test review submission works

**Impact:** Review system won't work without this.

---

## 📊 **Important (Should Have Soon)**

### 8. **Error Monitoring** 🐛 ✅ **COMPLETED**

**What's implemented:**
- ✅ **Sentry** error tracking
  - Production error alerts
  - Error logging
  - Performance monitoring
  - Session replay (on errors)

**Testing Required:**
- [ ] Verify Sentry is initialized (check browser console)
- [ ] Trigger a test error and verify it appears in Sentry dashboard
- [ ] Check that error boundary logs to Sentry
- [ ] Verify performance monitoring is active

---

### 9. **Performance Optimization** ⚡ ✅ **COMPLETED**

**What's implemented:**
- ✅ **Image optimization**
  - Next.js Image component with AVIF/WebP support
  - Responsive image sizes
  - Priority loading for above-fold images
- ✅ **Caching strategies**
  - API route caching (60s s-maxage, 300s stale-while-revalidate)
  - Static asset caching
- ✅ **Resource hints**
  - Preconnect to external domains
  - DNS prefetch for CDNs
- ✅ **Next.js optimizations**
  - Compression enabled
  - SWC minification

**Testing Required:**
- [ ] Run Google PageSpeed Insights (target: 90+ on mobile/desktop)
- [ ] Verify images are using Next.js Image component
- [ ] Check that images load in modern formats (AVIF/WebP)
- [ ] Test page load times (should be < 3 seconds)
- [ ] Verify caching headers are present

---

### 10. **Content Review** 📝

**What to check:**
- [ ] **All pages have content** in Sanity
  - Homepage
  - About page
  - Contact page
  - Wholesale page
  - Subscriptions page
- [ ] **Products are set up**
  - At least a few products added
  - Images uploaded
  - Prices set
  - Inventory quantities set
- [ ] **Site settings configured**
  - Footer address
  - Social media links
  - Company information
- [ ] **Featured products** selected on homepage

**Impact:** Empty pages look unprofessional.

---

## 🔧 **Nice-to-Have (Can Add Later)**

### 11. **Email Marketing** 📧
- Newsletter signup functionality
- Email list management
- Automated campaigns

### 12. **Advanced Analytics** 📈
- Admin analytics dashboard
- Sales reports
- Customer lifetime value
- Product performance metrics

### 13. **Additional Features** ✨
- ✅ Review request emails (after delivery) - **COMPLETED**
- [ ] Abandoned cart emails
- [ ] Customer loyalty program
- [ ] Gift cards

---

## 📋 **Launch Day Checklist**

### Before Going Live:
- [ ] All critical items above are complete
- [ ] Domain is connected and working
- [ ] SSL certificate is active (Vercel handles this)
- [ ] All environment variables set in Vercel
- [ ] Database migration completed
- [ ] Test purchase completed successfully
- [ ] Test review submitted and approved
- [ ] Contact form tested
- [ ] Admin dashboard tested
- [ ] Mobile site tested
- [ ] Legal pages published
- [ ] Privacy policy and terms linked in footer

### After Launch:
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Review customer feedback
- [ ] Monitor order flow
- [ ] Check email delivery

---

## 🎯 **Recommended Priority Order**

1. **Security** (rate limiting, CAPTCHA) - **Do this first!**
2. **Legal pages** (privacy, terms) - **Required for compliance**
3. **Error pages** (404, 500) - **Quick win, better UX**
4. **Testing** - **Verify everything works**
5. **Analytics** - **Start tracking from day 1**
6. **Error monitoring** - **Catch issues early**

---

## 💡 **Quick Wins (Can Do in 1-2 Hours)**

These are fast to implement and have immediate impact:

1. **Error pages** (404, 500) - 30 minutes
2. **Security headers** - 15 minutes
3. **Google Analytics** - 30 minutes
4. **Basic rate limiting** - 1 hour
5. **Privacy Policy template** - 30 minutes

---

## 🚀 **Ready to Launch?**

Your site is **very close** to launch-ready! Most critical features are complete.

### **✅ Completed Critical Items:**
1. ✅ **Security** - Rate limiting, CAPTCHA, input sanitization, security headers
2. ✅ **Legal pages** - Privacy policy, terms, shipping, return policies
3. ✅ **Error pages** - 404, 500, Error Boundary
4. ✅ **Analytics** - Google Analytics 4 with e-commerce tracking
5. ✅ **Error monitoring** - Sentry integration
6. ✅ **Performance** - Image optimization, caching, resource hints
7. ✅ **Email system** - All transactional emails working
8. ✅ **Admin features** - Complete dashboard with analytics

### **📋 Remaining Tasks:**
1. **Comprehensive Testing** - Use the detailed checklist below
2. **Environment Variables** - Verify all are set in Vercel
3. **Database Migration** - Run review system migration (if not done)
4. **Content Setup** - Populate Sanity with real content
5. **Domain Configuration** - Connect custom domain (if not done)

### **🎯 Next Steps:**
1. **Run through the comprehensive testing checklist below**
2. **Verify all environment variables are set**
3. **Populate content in Sanity Studio**
4. **Do a final end-to-end test purchase**
5. **Launch! 🚀**

The site is functionally complete - now it's time to test thoroughly and add your content!

---

## 🧪 **COMPREHENSIVE TESTING CHECKLIST**

### **Phase 1: Customer-Facing Features**

#### **1.1 Homepage & Navigation**
- [ ] Homepage loads correctly
- [ ] Hero section displays with background image
- [ ] Featured products section displays products from Sanity
- [ ] Announcements display (if any exist in Sanity)
- [ ] Navigation menu works (desktop and mobile)
- [ ] Footer displays correct address and social links from Sanity
- [ ] All footer links work (Privacy, Terms, Shipping, Return policies)
- [ ] Search functionality works (if implemented)
- [ ] Cart icon shows correct item count
- [ ] User icon shows login status

#### **1.2 Product Pages**
- [ ] Product listing page (`/shop`) displays all products
- [ ] Products load from Sanity CMS
- [ ] Product images display correctly
- [ ] Product filtering works (if implemented)
- [ ] Product search works (if implemented)
- [ ] Individual product pages (`/shop/[slug]`) load correctly
- [ ] Product details display (name, price, description, images)
- [ ] Stock status displays correctly (in stock, low stock, out of stock)
- [ ] Add to cart button works
- [ ] Quantity selector works
- [ ] Reviews section displays on product page
- [ ] Review form is accessible
- [ ] Reviews list shows approved reviews
- [ ] Average rating displays correctly

#### **1.3 Shopping Cart**
- [ ] Add product to cart from product page
- [ ] Cart icon updates with item count
- [ ] Cart sidebar/dropdown opens correctly
- [ ] Cart displays all items with correct quantities
- [ ] Update quantity in cart
- [ ] Remove item from cart
- [ ] Cart persists after page refresh (localStorage)
- [ ] Cart total calculates correctly
- [ ] Proceed to checkout button works
- [ ] Empty cart message displays when cart is empty

#### **1.4 Checkout Process**
- [ ] Checkout page loads with cart items
- [ ] Order summary displays correctly
- [ ] Shipping address form works
- [ ] Form validation works (required fields, email format)
- [ ] Billing address form works (if separate)
- [ ] Stripe payment form loads
- [ ] Test payment with Stripe test card succeeds
- [ ] Order confirmation page displays after payment
- [ ] Order number is generated and displayed
- [ ] Order confirmation email is sent
- [ ] Redirect to order history works

#### **1.5 User Account**
- [ ] User registration form works
- [ ] User login form works
- [ ] Password reset works (if implemented)
- [ ] User dashboard (`/account/dashboard`) displays
- [ ] Order history (`/account/orders`) displays user's orders
- [ ] Order details page shows order information
- [ ] Account settings page works (if implemented)
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated

#### **1.6 Content Pages**
- [ ] About page (`/about`) loads and displays Sanity content
- [ ] Contact page (`/contact`) loads and displays Sanity content
- [ ] Contact form submits successfully
- [ ] Contact form shows success message
- [ ] Admin receives contact form email
- [ ] Customer receives auto-reply email
- [ ] Wholesale page (`/wholesale`) loads and displays Sanity content
- [ ] Wholesale application form submits successfully
- [ ] Wholesale application saves to database
- [ ] Admin receives wholesale application email
- [ ] Customer receives wholesale confirmation email
- [ ] Subscriptions page (`/subscriptions`) loads and displays Sanity content
- [ ] Events page (`/events`) displays events from Sanity
- [ ] FAQ page (`/faq`) displays FAQs from Sanity

#### **1.7 Review System**
- [ ] Anonymous user can submit review (no login required)
- [ ] Review form validates required fields (rating, comment, name, email)
- [ ] Review form includes reCAPTCHA
- [ ] Review submission shows success message
- [ ] Review appears in admin dashboard (pending approval)
- [ ] Admin can approve review
- [ ] Admin can reject review
- [ ] Admin can feature review
- [ ] Admin can delete review
- [ ] Approved review appears on product page
- [ ] Average rating updates when review is approved
- [ ] Featured reviews display prominently

#### **1.8 Error Pages**
- [ ] 404 page displays for non-existent pages
- [ ] 404 page links work (homepage, contact)
- [ ] 500 page displays for server errors (if testable)
- [ ] Error Boundary catches React errors gracefully

---

### **Phase 2: Admin Dashboard**

#### **2.1 Admin Authentication**
- [ ] Admin login works
- [ ] Admin routes are protected
- [ ] Non-admin users cannot access admin routes
- [ ] Admin logout works

#### **2.2 Admin Dashboard Home**
- [ ] Dashboard loads with overview statistics
- [ ] Recent orders display
- [ ] Quick stats display correctly
- [ ] Navigation sidebar works

#### **2.3 Order Management**
- [ ] Orders list page (`/admin/orders`) displays all orders
- [ ] Order search/filter works
- [ ] Order detail page (`/admin/orders/[orderId]`) loads
- [ ] Order information displays correctly
- [ ] Order items display correctly
- [ ] Customer information displays correctly
- [ ] Shipping address displays correctly
- [ ] Update order status works
- [ ] Update payment status works
- [ ] Add tracking number works
- [ ] Add tracking URL works
- [ ] Add notes works
- [ ] Order shipped email sends when status changes to "shipped"
- [ ] Order delivered email sends when status changes to "delivered"
- [ ] Review request email button appears for delivered orders
- [ ] Send review request email works
- [ ] Order export (CSV) works
- [ ] Date range filter works for export

#### **2.4 Product Management**
- [ ] Products list page (`/admin/products`) displays
- [ ] Products are managed in Sanity Studio (not admin dashboard)
- [ ] Verify products can be created in Sanity
- [ ] Verify products can be edited in Sanity
- [ ] Verify products can be deleted in Sanity
- [ ] Verify product images upload in Sanity
- [ ] Verify inventory quantities update in Sanity
- [ ] Verify low stock threshold works

#### **2.5 Customer Management**
- [ ] Customers list page (`/admin/customers`) displays
- [ ] Customer search works
- [ ] Customer detail view works
- [ ] Customer order history displays
- [ ] Customer information is accurate

#### **2.6 Subscription Management**
- [ ] Subscriptions list page (`/admin/subscriptions`) displays
- [ ] Subscription details display correctly
- [ ] Subscription status updates work
- [ ] Subscription cancellation works (if implemented)

#### **2.7 Review Management**
- [ ] Reviews list page (`/admin/reviews`) displays
- [ ] Pending reviews show correctly
- [ ] Approve review works
- [ ] Reject review works
- [ ] Feature review works
- [ ] Delete review works
- [ ] Review search/filter works

#### **2.8 Analytics Dashboard**
- [ ] Analytics page (`/admin/analytics`) loads
- [ ] Revenue trends chart displays (daily, weekly, monthly)
- [ ] Top products chart displays
- [ ] Customer metrics display (new vs. repeat)
- [ ] Order status breakdown displays
- [ ] Average order value displays
- [ ] Date range filter works
- [ ] Charts are interactive and readable

---

### **Phase 3: Email System**

#### **3.1 Order Emails**
- [ ] Order confirmation email sends after purchase
- [ ] Order confirmation email contains correct order details
- [ ] Order confirmation email contains product list
- [ ] Order confirmation email contains shipping address
- [ ] Order shipped email sends when admin updates status
- [ ] Order shipped email contains tracking information
- [ ] Order delivered email sends when admin updates status
- [ ] Order delivered email contains delivery date
- [ ] All emails are properly formatted (HTML and text)
- [ ] All emails use correct branding

#### **3.2 Review Request Emails**
- [ ] Review request email sends when admin clicks button
- [ ] Review request email contains order number
- [ ] Review request email contains product list
- [ ] Review request email contains links to product pages
- [ ] Product links in email work correctly
- [ ] Email is only sent for delivered orders

#### **3.3 Contact & Wholesale Emails**
- [ ] Contact form email sends to admin
- [ ] Contact form auto-reply sends to customer
- [ ] Wholesale application email sends to admin
- [ ] Wholesale confirmation email sends to customer
- [ ] All emails contain correct information

---

### **Phase 4: Security & Performance**

#### **4.1 Security Testing**
- [ ] Rate limiting works (try submitting form 6 times quickly)
- [ ] reCAPTCHA appears and works on forms
- [ ] XSS attempts are sanitized (test with `<script>alert('xss')</script>`)
- [ ] SQL injection attempts are prevented
- [ ] Security headers are present (check in browser DevTools)
- [ ] HTTPS is enforced (if on production)
- [ ] Admin routes require authentication
- [ ] User data is not exposed in API responses

#### **4.2 Performance Testing**
- [ ] Homepage loads in < 3 seconds
- [ ] Product pages load in < 2 seconds
- [ ] Images are optimized (check Network tab)
- [ ] No console errors (check browser console)
- [ ] No 404 errors for resources (check Network tab)
- [ ] Mobile performance is acceptable
- [ ] PageSpeed Insights score is 90+ (mobile and desktop)

---

### **Phase 5: Content Management (Sanity)**

#### **5.1 Sanity Studio**
- [ ] Sanity Studio is accessible
- [ ] Can create/edit products
- [ ] Can upload product images
- [ ] Can set product prices
- [ ] Can set inventory quantities
- [ ] Can set low stock thresholds
- [ ] Can edit homepage content
- [ ] Can edit About page content
- [ ] Can edit Contact page content
- [ ] Can edit Wholesale page content
- [ ] Can edit Subscriptions page content
- [ ] Can edit footer address
- [ ] Can edit social media links
- [ ] Can create/edit events
- [ ] Can create/edit FAQs
- [ ] Can create/edit announcements
- [ ] Changes reflect on website immediately

#### **5.2 Content Verification**
- [ ] All pages have content (not empty)
- [ ] All products have images
- [ ] All products have prices
- [ ] All products have descriptions
- [ ] Featured products are selected on homepage
- [ ] Footer information is complete
- [ ] Social media links work

---

### **Phase 6: Mobile & Cross-Browser**

#### **6.1 Mobile Responsiveness**
- [ ] Homepage is usable on mobile
- [ ] Product pages are usable on mobile
- [ ] Cart is usable on mobile
- [ ] Checkout form is usable on mobile
- [ ] Admin dashboard is usable on mobile (if needed)
- [ ] Navigation menu works on mobile
- [ ] Forms are easy to fill on mobile
- [ ] Buttons are appropriately sized for touch
- [ ] Text is readable without zooming

#### **6.2 Cross-Browser Testing**
- [ ] Chrome - All features work
- [ ] Safari - All features work
- [ ] Firefox - All features work
- [ ] Edge - All features work
- [ ] Mobile Safari (iOS) - All features work
- [ ] Chrome Mobile (Android) - All features work

---

### **Phase 7: Integration Testing**

#### **7.1 Stripe Integration**
- [ ] Test payment succeeds with test card
- [ ] Payment failure is handled gracefully
- [ ] Webhook receives payment events
- [ ] Order is created after successful payment
- [ ] Payment status updates correctly

#### **7.2 Database Integration**
- [ ] Orders are saved to database
- [ ] Order items are saved correctly
- [ ] User accounts are saved correctly
- [ ] Reviews are saved correctly
- [ ] Wholesale applications are saved correctly
- [ ] Inventory decreases when order is placed
- [ ] Low stock alerts trigger correctly

#### **7.3 Sanity Integration**
- [ ] Products load from Sanity
- [ ] Page content loads from Sanity
- [ ] Images load from Sanity CDN
- [ ] Inventory updates sync to Sanity

#### **7.4 Email Integration (Resend)**
- [ ] All emails send successfully
- [ ] Emails are delivered (check spam folder)
- [ ] Email formatting is correct
- [ ] Email links work

#### **7.5 Analytics Integration**
- [ ] Google Analytics tracks page views
- [ ] E-commerce events fire correctly
- [ ] Conversion tracking works

#### **7.6 Error Monitoring (Sentry)**
- [ ] Errors are logged to Sentry
- [ ] Performance data is tracked
- [ ] Error alerts are configured (if set up)

---

### **Phase 8: Edge Cases & Error Handling**

#### **8.1 Edge Cases**
- [ ] Empty cart checkout (should be prevented)
- [ ] Out of stock product added to cart (should show error)
- [ ] Invalid email format (should show validation error)
- [ ] Missing required fields (should show validation error)
- [ ] Network error during checkout (should handle gracefully)
- [ ] Payment timeout (should handle gracefully)
- [ ] Large order quantities (should validate)
- [ ] Special characters in forms (should sanitize)

#### **8.2 Error Handling**
- [ ] API errors show user-friendly messages
- [ ] Database errors are logged but don't crash site
- [ ] Email failures don't prevent order completion
- [ ] Sanity fetch errors are handled gracefully
- [ ] Stripe errors show appropriate messages

---

## 📝 **Testing Notes**

**How to Use This Checklist:**
1. Go through each section systematically
2. Check off items as you test them
3. Note any issues found
4. Re-test after fixes
5. Keep a log of test results

**Test Environment:**
- Test in both development and production (Vercel)
- Use Stripe test mode for payments
- Use test email addresses
- Test with real devices, not just browser DevTools

**Priority Testing:**
- Focus on Phase 1 (Customer-Facing) first
- Then Phase 2 (Admin Dashboard)
- Then Phase 3 (Email System)
- Security and Performance can be done in parallel

**Common Issues to Watch For:**
- Missing environment variables
- Database connection issues
- Email delivery problems
- Image loading issues
- Mobile layout problems
- Form validation issues

