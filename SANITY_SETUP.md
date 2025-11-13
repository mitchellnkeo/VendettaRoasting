# Sanity CMS Setup Guide

This guide will help you set up and deploy Sanity Studio for Vendetta Roasting.

## Prerequisites

- Node.js installed
- Sanity account (you already have one)
- Sanity project ID: `pyoyob4y`
- Dataset: `production`

## Environment Variables

Make sure your `.env.local` file includes:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=pyoyob4y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token_here
```

To get your `SANITY_API_TOKEN`:
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to API → Tokens
4. Create a new token with "Editor" permissions

## Running Sanity Studio Locally

1. **Start the Studio:**
   ```bash
   npm run studio
   ```

2. **Access the Studio:**
   Open [http://localhost:3333](http://localhost:3333) in your browser

3. **Log in:**
   Use your Sanity account credentials

## Deploying Sanity Studio (Standalone)

To deploy the Studio as a standalone application:

1. **Deploy to Sanity's hosting:**
   ```bash
   npm run studio:deploy
   ```

2. **Follow the prompts:**
   - Choose a hostname (e.g., `vendetta-roasting`)
   - The Studio will be available at: `https://vendetta-roasting.sanity.studio`

3. **Share the URL with your client:**
   They can access it at the deployed URL and log in with their Sanity account.

## Content Types

The Studio includes three content types:

### 1. Announcement
- **Use for:** Site-wide announcements, promotions, important notices
- **Fields:** Title, Content, Active status, Featured status, Published date, Expiration date
- **Display:** Shows at the top of the homepage

### 2. Event
- **Use for:** Coffee tastings, workshops, community events
- **Fields:** Title, Description, Date & Time, Location, Address, Price, Max attendees
- **Display:** Shows on `/events` page

### 3. FAQ
- **Use for:** Frequently asked questions
- **Fields:** Question, Answer, Category, Sort order, Active status
- **Display:** Shows on `/faq` page

## How Content Updates Work

1. **Edit content in Sanity Studio**
2. **Click "Publish"** (not just "Save")
3. **Content appears on website** within 1-2 minutes (due to CDN caching)

## Troubleshooting

### Studio won't start
- Make sure port 3333 is available
- Check that environment variables are set correctly
- Try deleting `.sanity` folder and running `npm run studio` again

### Content not appearing on website
- Make sure content is **published** (not just saved as draft)
- Check that "Active" checkbox is checked
- Wait 1-2 minutes for CDN cache to update
- Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)

### API errors
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are correct
- Check that `SANITY_API_TOKEN` has proper permissions

## Next Steps

1. Deploy the Studio: `npm run studio:deploy`
2. Create some test content in the Studio
3. Verify it appears on your website
4. Share the Studio URL with your client

