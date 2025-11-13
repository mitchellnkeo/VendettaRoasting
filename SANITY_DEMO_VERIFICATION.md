# Sanity CMS Demo Verification Guide

This guide will help you verify that Sanity is properly set up and ready for your client demo.

## ✅ Pre-Demo Checklist

### 1. Environment Variables Verification

**Required variables in `.env.local` (for local development):**

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=pyoyob4y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token_here
```

**Important Notes:**
- `NEXT_PUBLIC_` prefix is required for client-side access in Next.js
- `SANITY_API_TOKEN` does NOT have `NEXT_PUBLIC_` prefix (server-side only)
- Run `./verify-sanity-setup.sh` to check your local setup

**Required variables in Vercel (for production):**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Vendetta Roasting project
3. Navigate to **Settings → Environment Variables**
4. Ensure these are set for **Production**, **Preview**, and **Development**:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `pyoyob4y`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `SANITY_API_TOKEN` = `your_token_here` (starts with `sk`)

### 2. Sanity Studio Verification

#### Test Local Studio
```bash
npm run studio
```
**Expected:** Studio opens at http://localhost:3333
**Check:**
- ✅ Studio loads without errors
- ✅ All 6 content types visible in sidebar:
  - Announcement
  - Event
  - FAQ
  - Blog Post
  - About Content
  - Homepage Content
- ✅ You can create new content

#### Test Deployed Studio
**URL:** https://pyoyob4y.sanity.studio/

**Check:**
- ✅ Studio is accessible
- ✅ Client can log in with their Sanity account
- ✅ All content types are visible
- ✅ Client can create/edit content

**To deploy/update Studio:**
```bash
npm run studio:deploy
```

### 3. API Endpoints Verification

Start your dev server:
```bash
npm run dev
```

Test each endpoint:

```bash
# Test Announcements
curl http://localhost:3000/api/content/announcements

# Test Events
curl http://localhost:3000/api/content/events

# Test Upcoming Events
curl http://localhost:3000/api/content/events?upcoming=true

# Test FAQs
curl http://localhost:3000/api/content/faqs
```

**Expected Response Format:**
```json
{
  "success": true,
  "data": [...]
}
```

### 4. Content Creation for Demo

Before the demo, create sample content in Sanity Studio:

1. **Announcement:**
   - Title: "Holiday Sale - 20% Off All Coffee!"
   - Content: "Get 20% off all coffee beans this holiday season."
   - Priority: High
   - Active: ✅

2. **Event:**
   - Title: "Winter Coffee Cupping Event"
   - Description: "Join us for a guided tasting..."
   - Date: Future date
   - Location: "Vendetta Roasting Cafe"
   - Price: $25

3. **FAQ:**
   - Question: "How long does shipping take?"
   - Answer: "Standard shipping takes 3-5 business days..."
   - Category: Shipping
   - Active: ✅

**See `SAMPLE_CONTENT_EXAMPLES.md` for detailed examples.**

### 5. Vercel Production Verification

Since your site is hosted on Vercel, verify:

1. **Environment Variables are Set:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Verify all Sanity variables are present
   - Ensure they're set for Production environment

2. **Test Production API Endpoints:**
   ```bash
   # Replace with your actual Vercel URL
   curl https://vendetta-roasting.vercel.app/api/content/announcements
   curl https://vendetta-roasting.vercel.app/api/content/events
   curl https://vendetta-roasting.vercel.app/api/content/faqs
   ```

3. **Rebuild if Needed:**
   - After setting environment variables, trigger a new deployment
   - Or push a commit to trigger automatic deployment

## 🎬 Demo Flow

### Step 1: Show Sanity Studio
1. Open https://pyoyob4y.sanity.studio/
2. Log in with client's Sanity account
3. Show all 6 content types in sidebar
4. Explain what each content type is for

### Step 2: Create Content
1. Create a new Announcement
2. Fill in the form fields
3. Click "Publish"
4. Show how it appears on the website

### Step 3: Edit Existing Content
1. Open an existing FAQ
2. Edit the answer
3. Publish changes
4. Show the update on the website

### Step 4: Show API Integration
1. Open browser DevTools → Network tab
2. Navigate to a page that uses Sanity content
3. Show the API calls fetching content
4. Explain how content updates appear automatically

## 🔧 Troubleshooting

### Issue: Studio won't start locally
**Solution:**
- Check Node.js version: `node -v` (should be 20.19+ or 22.12+)
- Verify `sanity` package is installed: `npm install`
- Check `sanity.config.ts` exists and is correct

### Issue: API returns empty arrays
**Solution:**
- Verify environment variables are set correctly
- Check Sanity project ID matches (`pyoyob4y`)
- Ensure content exists in Sanity Studio
- Check browser console for errors
- Verify `SANITY_API_TOKEN` is valid

### Issue: Client can't access Studio
**Solution:**
- Verify Studio is deployed: `npm run studio:deploy`
- Check project ID matches: `pyoyob4y`
- Confirm user has access in Sanity dashboard
- Go to https://sanity.io/manage → Project → Members → Add user

### Issue: Content not appearing on Vercel
**Solution:**
- Verify environment variables are set in Vercel
- Check variables are set for Production environment
- Trigger a new deployment after setting variables
- Check Vercel build logs for errors

### Issue: Environment variables not working
**Solution:**
- **Local:** Ensure `.env.local` is in project root (not in `src/`)
- **Vercel:** Variables must be set in Vercel Dashboard
- **Client-side:** Must use `NEXT_PUBLIC_` prefix
- **Server-side:** No prefix needed (e.g., `SANITY_API_TOKEN`)
- Restart dev server after changing `.env.local`

## 📋 Quick Reference

### Sanity Project Details
- **Project ID:** `pyoyob4y`
- **Dataset:** `production`
- **Studio URL:** https://pyoyob4y.sanity.studio/
- **API Version:** `2023-05-03`

### Content Types
1. **Announcement** - Site-wide announcements
2. **Event** - Coffee events and workshops
3. **FAQ** - Frequently asked questions
4. **Blog Post** - Blog articles
5. **About Content** - Company information
6. **Homepage Content** - Homepage sections

### API Endpoints
- `/api/content/announcements` - Get all active announcements
- `/api/content/events` - Get all upcoming events
- `/api/content/events?upcoming=true` - Get next 3 events
- `/api/content/faqs` - Get all FAQs

### Helper Functions (in `src/lib/sanity.ts`)
- `getAnnouncements()` - Fetch announcements
- `getEvents()` - Fetch all events
- `getUpcomingEvents()` - Fetch next 3 events
- `getFAQs()` - Fetch FAQs
- `getBlogPosts()` - Fetch blog posts
- `getAboutContent()` - Fetch about page content
- `getHomepageContent()` - Fetch homepage content

## ✅ Final Verification Steps

Before the demo, complete this checklist:

- [ ] Environment variables verified locally (`./verify-sanity-setup.sh`)
- [ ] Environment variables set in Vercel
- [ ] Local Studio tested and working
- [ ] Deployed Studio accessible and working
- [ ] Client has Sanity account and access
- [ ] Sample content created in Studio
- [ ] API endpoints tested locally
- [ ] API endpoints tested on Vercel
- [ ] Content appears correctly on website
- [ ] Demo script prepared

## 🚀 Ready for Demo!

Once all items are checked, you're ready to demonstrate Sanity CMS to your client!

