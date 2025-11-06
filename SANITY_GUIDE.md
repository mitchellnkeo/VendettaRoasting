# Sanity CMS Setup & Usage Guide

## 🎯 Overview

This guide explains how to manage Sanity content both **locally** (for development) and how your **client** can edit content.

## 📋 For Developers: Local Development

### Running Sanity Studio Locally

You can run and develop Sanity Studio locally using the CLI:

```bash
# Start Sanity Studio on localhost (usually http://localhost:3333)
npm run studio
```

This will:
- ✅ Start a local development server
- ✅ Connect to your Sanity project (`pyoyob4y`)
- ✅ Allow you to edit schemas and content locally
- ✅ Changes are synced to your Sanity cloud project

### Deploying Studio Updates

After making changes to your Studio configuration:

```bash
# Deploy Studio configuration to Sanity cloud
npm run studio:deploy
```

This updates the hosted Studio at: `https://pyoyob4y.sanity.studio/`

### Project Structure

- **`sanity.config.js`** - Main Studio configuration
- **`src/lib/sanitySchemas.ts`** - Content type schemas (Announcements, Events, FAQs, etc.)
- **`src/lib/sanity.ts`** - Sanity client for fetching content in your Next.js app

## 👤 For Clients: Content Editing

Your client can edit content through Sanity Studio's web interface - **no technical knowledge required!**

### Access URL

Once Studio is deployed:
```
https://pyoyob4y.sanity.studio/
```

### What They Can Do

1. **Edit Announcements**
   - Create/edit/delete announcements
   - Set priority levels
   - Schedule publish/expiry dates

2. **Manage Events**
   - Add coffee cupping events
   - Set dates, locations, pricing
   - Upload event images

3. **Manage FAQs**
   - Add/edit frequently asked questions
   - Organize by category
   - Set display order

4. **Blog Posts** (if enabled)
   - Write blog articles
   - Add images
   - Set featured posts

5. **Homepage Content**
   - Edit hero text and images
   - Update featured sections

### User-Friendly Features

- ✅ **Visual Interface** - Similar to WordPress or Medium
- ✅ **Rich Text Editor** - Formatting tools built-in
- ✅ **Image Upload** - Drag-and-drop image management
- ✅ **Live Preview** - See changes before publishing
- ✅ **Version History** - Revert to previous versions
- ✅ **Real-time Collaboration** - Multiple editors can work simultaneously

## 🔧 Environment Variables

Make sure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=pyoyob4y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here  # For write access
```

## 📚 Available Content Types

### 1. Announcements
- **Title** - Announcement headline
- **Content** - Full announcement text
- **Priority** - Low/Medium/High/Urgent
- **Published At** - Publication date
- **Expires At** - Optional expiration

### 2. Events
- **Title** - Event name
- **Description** - Event details
- **Date** - Event date/time
- **Location** - Event location
- **Address** - Full address
- **Price** - Ticket/entry price
- **Max Attendees** - Capacity limit
- **Image** - Event poster/image

### 3. FAQs
- **Question** - FAQ question
- **Answer** - FAQ answer
- **Category** - General/Shipping/Subscriptions/Products/Returns/Account
- **Order** - Display order (lower = first)
- **Active** - Show/hide toggle

### 4. Blog Posts (Optional)
- **Title** - Post title
- **Excerpt** - Short summary
- **Content** - Full blog post (rich text)
- **Featured Image** - Post image
- **Author** - Author name
- **Published At** - Publication date
- **Tags** - Categorization tags

### 5. Homepage Content
- **Hero Title** - Main headline
- **Hero Subtitle** - Supporting text
- **Hero Image** - Background image
- **Featured Products Title** - Section heading
- **About Section** - About content
- **Subscription Section** - Subscription promo

### 6. About Content
- **Page Title** - About page title
- **Hero Image** - Header image
- **Hero Text** - Introduction
- **Our Story** - Full story (rich text)
- **Mission Statement** - Mission text
- **Our Values** - Company values list
- **Team Members** - Team bios and photos

## 🚀 Quick Start

1. **Start local Studio:**
   ```bash
   npm run studio
   ```

2. **Open browser:** `http://localhost:3333`

3. **Edit content** - Changes sync automatically

4. **Deploy updates:**
   ```bash
   npm run studio:deploy
   ```

## ❓ Troubleshooting

### Studio won't start
- Check Node.js version: `node -v` (should be 20.19+ or 22.12+)
- Make sure `sanity` package is installed: `npm install`
- Verify `sanity.config.js` exists in project root

### Can't see content types
- Ensure schemas are exported in `src/lib/sanitySchemas.ts`
- Check that `sanity.config.js` imports schemas correctly
- Restart Studio after schema changes

### Client can't access Studio
- Verify Studio is deployed: `npm run studio:deploy`
- Check project ID matches: `pyoyob4y`
- Confirm user has access in Sanity dashboard

## 📖 Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Studio Guide](https://www.sanity.io/docs/studio)
- [Content Modeling](https://www.sanity.io/docs/content-modeling)

