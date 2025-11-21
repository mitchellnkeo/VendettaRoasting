# Page Content Management Guide

All four main pages (About, Contact, Wholesale, and Subscriptions) can now be edited through Sanity Studio!

## What's Editable

### 1. About Page (`/about`)
- **Hero Section:** Title, subtitle, optional hero image
- **How We Started:** Section title, multiple paragraphs, optional image
- **Our Mission:** Section title, multiple paragraphs
- **Values:** Up to 6 value cards with title, description, and optional icon image
- **Visit Us:** Section title, address, hours, contact info (falls back to Site Settings if not provided)

### 2. Contact Page (`/contact`)
- **Hero Section:** Title, subtitle
- **Get in Touch Section:** Title, location address, hours, contact info (falls back to Site Settings)
- **Map:** Optional map image or embed URL (Google Maps)
- **Contact Form:** Form title, success message

### 3. Wholesale Page (`/wholesale`)
- **Hero Section:** Title, subtitle
- **Why Partner Section:** Title
- **Benefits:** Up to 10 benefit cards with title, description, and icon name
- **Additional Content:** Optional sections with title, paragraphs, and images

### 4. Subscriptions Page (`/subscriptions`)
- **Hero Section:** Title, subtitle
- **How It Works Section:** Title
- **Steps:** Up to 6 steps with step number, title, and description
- **Additional Content:** Optional sections with title, paragraphs, and images

## How to Edit

1. **Open Sanity Studio:**
   - Local: `http://localhost:3333` (run `npm run studio`)
   - Deployed: `https://vendetta-roasting.sanity.studio`

2. **Find the Page:**
   - Look for "About Page", "Contact Page", "Wholesale Page", or "Subscriptions Page" in the sidebar
   - Click on the page you want to edit

3. **Edit the Content:**
   - Update text fields, add images, modify sections
   - For arrays (paragraphs, benefits, steps), use the "+" button to add new items
   - Use the drag handles to reorder items

4. **Publish:**
   - Click the **"Publish"** button (not just "Save")
   - Changes will appear on the website within 1-2 minutes

## Important Notes

- **Only one document per page type** should exist. If you see multiple, delete the extras.
- **Always click "Publish"** - drafts won't appear on the website
- **Images:** Upload images directly in Sanity Studio. They'll be automatically optimized and served from Sanity's CDN.
- **Fallback Values:** If no content exists in Sanity, the pages will show default content to ensure the site always works.

## Icon Names for Wholesale Benefits

When editing wholesale benefits, you can use these icon names:
- `checkmark` - Checkmark icon
- `clock` - Clock icon
- `users` - Users/people icon
- `cart` - Shopping cart icon

If no icon name is provided, a default checkmark icon will be used.

## Default Content

Each page has default content that displays if no Sanity content exists yet. This ensures the site always works, even before content is added to Sanity.

## Troubleshooting

**Page not updating?**
- Make sure you clicked "Publish" (not just "Save")
- Wait 1-2 minutes for CDN cache to update
- Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)

**Can't find the page in Sanity Studio?**
- Make sure you've restarted Sanity Studio after the schemas were added
- Run `npm run studio` again
- Check that the schemas are properly deployed

**Images not showing?**
- Make sure images are uploaded and published in Sanity
- Check that image URLs are valid
- Wait a few minutes for CDN propagation

## Next Steps

1. Open Sanity Studio
2. Create content for each page
3. Publish the content
4. Verify it appears on the website

All pages are now fully editable through Sanity Studio!

