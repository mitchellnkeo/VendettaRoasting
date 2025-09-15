# Vendetta Roasting Website

A modern coffee roasting website built with **React + TypeScript + Next.js**, featuring e-commerce, subscriptions, reviews, events, and wholesale ordering. This project is the rebuild of [vendettaroasting.com](https://vendettaroasting.com/) from scratch.

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
