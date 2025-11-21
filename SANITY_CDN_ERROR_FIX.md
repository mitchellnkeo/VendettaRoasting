# Fixing ERR_CONNECTION_RESET for Sanity Image Uploads

## The Error

You're seeing `ERR_CONNECTION_RESET` when trying to upload images. The error shows:
```
GET https://cdn.sanity.io/images/pyoyob4y/production/... net::ERR_CONNECTION_RESET
```

This means:
- ✅ The image **is uploading** successfully
- ❌ But **fetching from CDN fails** when Sanity tries to display it

## Root Causes

This is typically caused by:

1. **Network/Firewall blocking CDN requests**
2. **Image processing timeout** (image too large or corrupted)
3. **Sanity CDN temporary issue**
4. **Browser/network proxy issues**

## Solutions to Try

### Solution 1: Check Sanity Project Settings (Most Important)

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project (`pyoyob4y`)
3. Go to **API** → **CORS origins**
4. Make sure these are allowed:
   - `http://localhost:3333` (for local Studio)
   - `https://vendetta-roasting.sanity.studio` (for deployed Studio)
   - Your website domain (if fetching images from frontend)

### Solution 2: Try Different Network

- **Switch networks** (try mobile hotspot, different WiFi)
- **Disable VPN** if you're using one
- **Check firewall** settings (corporate firewalls often block CDN)

### Solution 3: Optimize the Image First

The image might be processing too slowly:

1. **Compress the image:**
   - Use [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
   - Reduce file size to under 2MB
   - Try uploading the compressed version

2. **Resize the image:**
   - 758x506 is fine, but if file size is large, resize it
   - Try 1000px max width/height

### Solution 4: Check Browser/Network

1. **Try different browser:**
   - Chrome, Firefox, Safari
   - Try incognito/private mode

2. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

3. **Check browser console:**
   - F12 → Console tab
   - Look for more detailed error messages
   - Share any additional errors you see

### Solution 5: Wait and Retry

Sometimes Sanity's CDN has temporary issues:
- Wait 5-10 minutes
- Try uploading again
- The image might actually be there, just CDN is slow

### Solution 6: Check if Image Actually Uploaded

Even with the error, the image might be uploaded:

1. **Refresh the Sanity Studio page**
2. **Check if the image appears** in the product
3. **Try publishing the product** - it might work despite the error

## Verify Image Upload

To check if images are actually uploading:

1. In Sanity Studio, go to **Media** (or **Assets**) in the sidebar
2. Check if your uploaded images appear there
3. If they do, the upload worked - it's just a display/CDN issue

## If Nothing Works

### Check Sanity Project Status

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Check project status - is it "Active"?
3. Check if you're on free tier (might have limits)
4. Check billing/usage limits

### Contact Sanity Support

If it's a persistent issue:
1. Go to [sanity.io/contact](https://www.sanity.io/contact)
2. Provide:
   - Project ID: `pyoyob4y`
   - Error: `ERR_CONNECTION_RESET` on CDN
   - Image size: 758x506 JPEG
   - Browser and OS info

## Quick Test

Try this to isolate the issue:

1. **Upload a very small test image** (like 200x200, under 100KB)
2. If small images work → it's a file size/processing issue
3. If small images also fail → it's a network/CDN configuration issue

## Most Likely Fix

**90% of the time, this is fixed by:**
1. ✅ Checking CORS settings in Sanity project
2. ✅ Trying a different network (disable VPN/firewall)
3. ✅ Compressing the image first

The image is probably uploading fine - it's just the CDN connection that's failing. Try refreshing the page after upload to see if the image actually appears!

