# Testing Sanity CMS Workflow

## Quick Test Steps

### Step 1: Create Test Content in Sanity Studio

1. **Go to Sanity Studio**: https://pyoyob4y.sanity.studio/
2. **Log in** with your Sanity account
3. **Click "Announcement"** in the left sidebar
4. **Click "Create new"** button (top right)
5. **Fill in the form**:
   - **Title**: "Test Announcement - Please Ignore"
   - **Content**: "This is a test to verify Sanity is working correctly."
   - **Active**: ✅ (checked)
   - **Priority**: Medium
   - **Published At**: Today's date (auto-filled)
6. **Click "Publish"** (top right)

### Step 2: Verify Content in API

Wait 10-30 seconds, then test the API:

```bash
# Test announcements API
curl https://vendetta-roasting.vercel.app/api/content/announcements
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Test Announcement - Please Ignore",
      "content": "This is a test to verify Sanity is working correctly.",
      "priority": "medium",
      "isActive": true,
      ...
    }
  ]
}
```

### Step 3: Test Locally (Optional)

If you want to test locally first:

```bash
# Start dev server
npm run dev

# In another terminal, test local API
curl http://localhost:3000/api/content/announcements
```

### Step 4: Verify on Website

1. **Go to your website**: https://vendetta-roasting.vercel.app/
2. **Hard refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. **Check if announcement appears** (if frontend is integrated)

## Testing Different Content Types

### Test Event

1. In Sanity Studio, click **"Event"**
2. Click **"Create new"**
3. Fill in:
   - **Title**: "Test Coffee Tasting Event"
   - **Description**: "This is a test event"
   - **Date**: A future date/time
   - **Location**: "Test Location"
   - **Active**: ✅
4. Click **"Publish"**

Test API:
```bash
curl https://vendetta-roasting.vercel.app/api/content/events
```

### Test FAQ

1. In Sanity Studio, click **"FAQ"**
2. Click **"Create new"**
3. Fill in:
   - **Question**: "Is this a test?"
   - **Answer**: "Yes, this is a test FAQ"
   - **Category**: General
   - **Active**: ✅
4. Click **"Publish"**

Test API:
```bash
curl https://vendetta-roasting.vercel.app/api/content/faqs
```

## Troubleshooting

### Content not in API?

1. **Check if published**: Content must be published, not saved as draft
2. **Check "Active" field**: For announcements, make sure "Active" is checked
3. **Wait 30 seconds**: Sometimes there's a slight delay
4. **Check date**: For events, date must be in the future

### API returns empty array?

- Content might not be published
- "Active" field might be unchecked
- For events, date might be in the past

### Content not on website?

- Frontend might not be integrated yet (API is working, but pages need to call it)
- Browser cache - try hard refresh
- Wait 1-2 minutes for CDN cache

## Quick Test Commands

```bash
# Test all APIs
curl https://vendetta-roasting.vercel.app/api/content/announcements
curl https://vendetta-roasting.vercel.app/api/content/events
curl https://vendetta-roasting.vercel.app/api/content/faqs

# Pretty print JSON (if you have jq)
curl -s https://vendetta-roasting.vercel.app/api/content/announcements | jq
```

## Success Criteria

✅ Content created in Sanity Studio  
✅ Content published  
✅ Content appears in API within 30 seconds  
✅ Content appears on website (if frontend integrated)

