# Vendetta Roasting Website

A modern coffee roasting website built with **React + TypeScript + Next.js**, featuring e-commerce, subscriptions, reviews, events, and wholesale ordering. This project is the rebuild of [vendettaroasting.com](https://vendettaroasting.com/) from scratch.

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in the [Vercel Dashboard](https://vercel.com/new)
3. Vercel will automatically detect it as a Next.js project
4. Deploy and enjoy your live site!

Alternatively, you can deploy from the command line:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

## Getting Started

To run this project locally:

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file in the root directory with the following:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-key-change-in-production

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Admin Access

The admin dashboard is available at [http://localhost:3000/admin](http://localhost:3000/admin)

Default admin credentials:
- Email: admin@vendettaroasting.com
- Password: admin123

**Note:** In production, you should change these credentials and use a secure database for user management.

## Project Status

- ✅ Basic website structure and UI
- ✅ Homepage, shop, subscriptions, and wholesale pages
- ✅ Responsive design with Tailwind CSS
- ✅ Deployed to Vercel

---

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (React + TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL (via [Supabase](https://supabase.com/) or [Neon](https://neon.tech/))
- **CMS (Content Management)**: [Sanity](https://www.sanity.io/) – for Announcements, Events, FAQs
- **Payments & Subscriptions**: [Stripe](https://stripe.com/) (Stripe Billing for recurring subscriptions)
- **E-Commerce / Storefront**: 
  - Option A: [Shopify Headless](https://shopify.dev/custom-storefronts) via Storefront API
  - Option B: [Medusa.js](https://medusajs.com/) (open source e-commerce backend)
- **Authentication & Accounts**: NextAuth.js
- **Reviews**: Custom reviews system stored in Postgres (optionally integrate Judge.me/Yotpo if using Shopify)
- **Deployment**: [Vercel](https://vercel.com/) (frontend), [Render](https://render.com/) or [Fly.io](https://fly.io/) (backend if using Medusa)

---

## Core Features

### 1. Customer-Facing Website
- Product browsing (coffee beans, brewing gear, etc.)
- Shopping cart & checkout
- Subscription service (recurring coffee shipments)
- Customer reviews on products
- Announcements page
- Events calendar
- Frequently Asked Questions
- Social media links / embedded feed

### 2. Wholesale Portal
- Wholesale account login
- Wholesale-only pricing and bulk order options
- No shipping option (pickup only)
- Restrict wholesale shipping to **Seattle area only**

### 3. Admin Interface
- Manage products, inventory, and wholesale accounts
- Publish announcements, FAQs, and events
- Moderate and approve customer reviews
- Manage subscriptions and orders

---

## Key Business Rules

- **Subscriptions**: Powered by Stripe Billing, supports recurring coffee deliveries.
- **Wholesale Accounts**:
  - Require account approval by admin.
  - Orders can be pickup or limited shipping **within Seattle only**.
- **Reviews**:
  - Customers can leave product reviews.
  - Admin must approve reviews before publishing.
- **Announcements & Events**:
  - Editable via Sanity CMS.
  - Display upcoming coffee events, collaborations, or special roasts.

---

## Development Roadmap

### Authentication & User Management
- [ ] Set up NextAuth.js for authentication
  - [ ] Configure OAuth providers (Google, Facebook)
  - [ ] Implement email/password authentication
  - [ ] Create protected routes for user accounts

### Content Management
- [ ] Integrate Sanity CMS
  - [ ] Set up Sanity Studio for content editing
  - [ ] Create schemas for announcements, events, and FAQs
  - [ ] Build API endpoints to fetch CMS content

### Database & Backend
- [ ] Set up database connection
  - [ ] Configure PostgreSQL with Supabase or Neon
  - [ ] Create database schema for products, users, orders
  - [ ] Implement API routes for data access

### E-Commerce Features
- [ ] Implement shopping cart functionality
  - [ ] Build cart context/state management
  - [ ] Create add/remove/update cart item functions
  - [ ] Add persistent cart storage

- [ ] Create product detail pages
  - [ ] Build dynamic routing for product pages
  - [ ] Add product image galleries
  - [ ] Implement reviews section

- [ ] Build checkout flow
  - [ ] Integrate Stripe for payments
  - [ ] Create order summary page
  - [ ] Implement shipping options
  - [ ] Add order confirmation emails

### User Features
- [ ] Develop user account dashboard
  - [ ] Order history
  - [ ] Saved addresses
  - [ ] Account settings

- [ ] Implement subscription management
  - [ ] Stripe Billing integration
  - [ ] Subscription modification UI
  - [ ] Delivery schedule management

### Wholesale Portal
- [ ] Complete wholesale features
  - [ ] Wholesale-only pricing
  - [ ] Bulk ordering options
  - [ ] Account approval workflow
  - [ ] Seattle-area shipping restrictions

### Admin Interface
- [ ] Build admin dashboard
  - [ ] Order management
  - [ ] Inventory control
  - [ ] User management
  - [ ] Review moderation
