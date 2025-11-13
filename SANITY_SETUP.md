# Sanity CMS Setup

## Quick Reference

**Sanity Studio**: https://pyoyob4y.sanity.studio/  
**Project ID**: `pyoyob4y`  
**Dataset**: `production`

## Environment Variables

### Local Development (`.env.local`)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=pyoyob4y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

### Vercel Production
Set these in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `pyoyob4y`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `SANITY_API_TOKEN` = (your token)

## API Endpoints

- `/api/content/announcements` - Get all active announcements
- `/api/content/events` - Get all upcoming events
- `/api/content/faqs` - Get all FAQs

## Commands

```bash
# Run Studio locally
npm run studio

# Deploy Studio
npm run studio:deploy
```

## Content Types

Located in `schemas/`:
- `announcement.ts` - Site announcements
- `event.ts` - Coffee events
- `faq.ts` - Frequently asked questions

## Client Guide

See `CLIENT_SANITY_GUIDE.md` for instructions on how clients can edit content.

