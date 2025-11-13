# Sanity CMS Verification Checklist

## ✅ Configuration Files Status

### 1. Sanity Config (`sanity.config.ts`)
- ✅ **Status**: Present and properly configured
- **Project ID**: `pyoyob4y`
- **Dataset**: `production`
- **Schemas**: All 6 schemas exported correctly
  - announcementSchema
  - eventSchema
  - faqSchema
  - blogPostSchema
  - aboutContentSchema
  - homepageContentSchema

### 2. Sanity Client (`src/lib/sanity.ts`)
- ✅ **Status**: Properly configured
- **Client**: Created with correct project ID and dataset
- **Image URL Builder**: Configured for image optimization
- **Helper Functions**: All content fetching functions present
  - getAnnouncements()
  - getEvents()
  - getUpcomingEvents()
  - getFAQs()
  - getBlogPosts()
  - getAboutContent()
  - getHomepageContent()

### 3. API Endpoints
- ✅ `/api/content/announcements` - Fetches announcements
- ✅ `/api/content/events` - Fetches events (with optional `upcoming=true` query)
- ✅ `/api/content/faqs` - Fetches FAQs

## 🔧 Required Environment Variables

You need to create a `.env.local` file with:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=pyoyob4y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token_here
```

**To get your SANITY_API_TOKEN:**
1. Go to https://sanity.io/manage
2. Select your project (`pyoyob4y`)
3. Go to API → Tokens
4. Create a new token with "Editor" permissions
5. Copy the token (starts with `sk`)

## 🧪 Testing Steps

### Test 1: Sanity Studio (Local)
```bash
npm run studio
```
**Expected**: Studio should start on http://localhost:3333
**What to check**:
- Studio loads without errors
- All 6 content types are visible in the sidebar
- You can create/edit content

### Test 2: Sanity Studio (Deployed)
```bash
npm run studio:deploy
```
**Expected**: Studio deploys to https://pyoyob4y.sanity.studio/
**What to check**:
- Studio is accessible via the URL
- Client can log in and edit content

### Test 3: API Endpoints (with dev server running)
```bash
# Test announcements
curl http://localhost:3000/api/content/announcements

# Test events
curl http://localhost:3000/api/content/events

# Test FAQs
curl http://localhost:3000/api/content/faqs
```
**Expected**: JSON responses with `success: true` and `data` array

### Test 4: Sanity Client Connection
The client will automatically connect when:
- Environment variables are set
- API endpoints are called
- Content is fetched in pages

## 📋 Content Types Available

### 1. Announcements
- **Purpose**: Site-wide announcements and notifications
- **Fields**: Title, Content, Priority, Published At, Expires At
- **API**: `/api/content/announcements`

### 2. Events
- **Purpose**: Coffee cupping events, workshops, community events
- **Fields**: Title, Description, Date, Location, Address, Price, Max Attendees, Image
- **API**: `/api/content/events` or `/api/content/events?upcoming=true`

### 3. FAQs
- **Purpose**: Frequently asked questions
- **Fields**: Question, Answer, Category, Order, Active
- **API**: `/api/content/faqs`

### 4. Blog Posts
- **Purpose**: Coffee knowledge, brewing guides, company updates
- **Fields**: Title, Excerpt, Content (rich text), Featured Image, Author, Published At, Tags
- **API**: Use `getBlogPosts()` from `src/lib/sanity.ts`

### 5. About Content
- **Purpose**: Company story, mission, values, team
- **Fields**: Title, Hero Image, Hero Text, Story, Mission, Values, Team Members
- **API**: Use `getAboutContent()` from `src/lib/sanity.ts`

### 6. Homepage Content
- **Purpose**: Hero sections and featured content
- **Fields**: Hero Title, Hero Subtitle, Hero Image, Featured Products Title, About Section, Subscription Section
- **API**: Use `getHomepageContent()` from `src/lib/sanity.ts`

## ⚠️ Common Issues & Solutions

### Issue: Studio won't start
**Solution**: 
- Check Node.js version: `node -v` (should be 20.19+ or 22.12+)
- Verify `sanity` package is installed: `npm install`
- Check `sanity.config.ts` exists and is correct

### Issue: API returns empty arrays
**Solution**:
- Verify environment variables are set in `.env.local`
- Check Sanity project ID matches (`pyoyob4y`)
- Ensure content exists in Sanity Studio
- Check browser console for errors

### Issue: Client can't access Studio
**Solution**:
- Deploy Studio: `npm run studio:deploy`
- Verify project ID matches
- Check user has access in Sanity dashboard

### Issue: TypeScript errors
**Note**: The TypeScript errors shown are from dependency type definitions, not your code. They don't affect runtime functionality.

## 🎯 Next Steps

1. **Create `.env.local`** with Sanity credentials (see `.env.local.example` for template)
2. **Set Vercel Environment Variables** (for production):
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`
   - Ensure they're set for Production, Preview, and Development environments
3. **Test Sanity Studio**: Run `npm run studio`
4. **Create some test content** in Studio
5. **Test API endpoints** with your dev server running
6. **Deploy Studio** for client access: `npm run studio:deploy`
7. **Verify production API endpoints** on your Vercel deployment

## 🌐 Vercel Production Setup

Since your site is hosted on Vercel, you need to set environment variables there:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: Vendetta Roasting
3. **Navigate to**: Settings → Environment Variables
4. **Add these variables** for Production, Preview, and Development:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `pyoyob4y`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `SANITY_API_TOKEN` = `your_token_here` (starts with `sk`)
5. **Redeploy** after adding variables (or push a commit to trigger auto-deploy)

**Test Production API:**
```bash
# Replace with your actual Vercel URL
curl https://vendetta-roasting.vercel.app/api/content/announcements
```

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Studio Guide](https://www.sanity.io/docs/studio)
- [Content Modeling](https://www.sanity.io/docs/content-modeling)
- Project Studio: https://pyoyob4y.sanity.studio/

