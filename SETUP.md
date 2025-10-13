# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# Database Configuration (to be added in next step)
# DATABASE_URL=your-database-url-here

# Stripe Configuration (to be added later)
# STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
# STRIPE_SECRET_KEY=your-stripe-secret-key
# STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Sanity CMS Configuration (to be added later)
# SANITY_PROJECT_ID=your-sanity-project-id
# SANITY_DATASET=production
# SANITY_API_TOKEN=your-sanity-api-token
```

## Setup Instructions

1. Copy the environment variables above into a new `.env.local` file
2. Generate a secure secret for `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32`)
3. Run `npm run dev` to start the development server

## Next Steps

- [ ] Set up database connection
- [ ] Configure Stripe for payments
- [ ] Integrate Sanity CMS
