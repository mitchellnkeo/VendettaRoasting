# Environment Variables Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://vendetta-roasting.vercel.app/
NEXTAUTH_SECRET=a3iadBRIrXHNpNd1Am2oOvMVgaWbpjn4vwj6sADBeYs=

# Database Configuration
DATABASE_URL=your_postgres_url

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=pyoyob4y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# Vercel Blob Configuration (NEW)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## How to Get Vercel Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Add `BLOB_READ_WRITE_TOKEN` with your blob token
5. Or use the Vercel CLI: `vercel env add BLOB_READ_WRITE_TOKEN`

## For Development

For local development, you can use a test token or set up a development blob store.
