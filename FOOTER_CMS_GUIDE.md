# Footer Content Management Guide

The footer content (address and social media links) can now be edited through Sanity Studio!

## What's Editable

### 1. Footer Address
- Street address
- City
- State (2-letter abbreviation)
- ZIP code
- Email address
- Phone number

### 2. Social Media Links
- Instagram URL
- Facebook URL
- Twitter/X URL
- YouTube URL
- TikTok URL

**Note:** Only social media links that are filled in will appear in the footer. Leave fields empty to hide those social icons.

## How to Edit

1. **Open Sanity Studio:**
   - Local: `http://localhost:3333` (run `npm run studio`)
   - Deployed: `https://vendetta-roasting.sanity.studio`

2. **Find "Site Settings":**
   - Look for "Site Settings" in the sidebar
   - Click on it

3. **Edit the Content:**
   - Update the **Footer Address** section with your current address, email, and phone
   - Add your **Social Media Links** (full URLs, e.g., `https://instagram.com/vendettaroasting`)
   - Leave social media fields empty if you don't want them to appear

4. **Publish:**
   - Click the **"Publish"** button (not just "Save")
   - Changes will appear on the website within 1-2 minutes

## Important Notes

- **Only one Site Settings document** should exist. If you see multiple, delete the extras.
- **Always click "Publish"** - drafts won't appear on the website
- **Use full URLs** for social media (e.g., `https://instagram.com/username`, not just `@username`)
- **State should be 2 letters** (e.g., "WA" not "Washington")

## Default Values

If no Site Settings document exists in Sanity, the footer will show:
- Address: 123 Coffee Street, Seattle, WA 98101
- Email: info@vendettaroasting.com
- Phone: (206) 555-1234
- Instagram: https://instagram.com

These defaults ensure the site always displays something, even before content is added to Sanity.

## Troubleshooting

**Footer not updating?**
- Make sure you clicked "Publish" (not just "Save")
- Wait 1-2 minutes for CDN cache to update
- Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)

**Social media icons not showing?**
- Make sure you entered full URLs (starting with `https://`)
- Check that the URL is correct and accessible
- Only filled-in social media fields will show icons

**Can't find "Site Settings" in Sanity Studio?**
- Make sure you've restarted Sanity Studio after the schema was added
- Run `npm run studio` again
- Check that the schema is properly deployed

