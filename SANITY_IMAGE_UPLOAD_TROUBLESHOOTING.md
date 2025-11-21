# Sanity Image Upload Troubleshooting Guide

## Common Issues and Solutions

### Issue: Image Upload Error in Sanity Studio

If you're getting an error when uploading images (especially JPEG files), try these solutions:

## Solution 1: Check File Size

**Sanity Default Limits:**
- Free tier: 10MB per file
- Paid tiers: Higher limits (up to 50MB+)

**Your image:** 758x506 JPEG should be well under 10MB, so this is likely not the issue.

**To check file size:**
- Right-click the image file → Get Info (Mac) or Properties (Windows)
- If it's over 10MB, compress it using an image editor

## Solution 2: Re-save the Image

Sometimes images have metadata that causes issues:

1. **Using an image editor:**
   - Open the image in Preview (Mac), Paint (Windows), or any image editor
   - Save it as a new JPEG file
   - This strips problematic metadata

2. **Using online tools:**
   - Upload to [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
   - Download the optimized version
   - Try uploading that version

## Solution 3: Check Browser Console

1. Open Sanity Studio
2. Press `F12` (or right-click → Inspect) to open Developer Tools
3. Go to the "Console" tab
4. Try uploading the image again
5. Look for any error messages
6. Share the error message with your developer

## Solution 4: Try Different Browser

Sometimes browser-specific issues occur:
- Try Chrome, Firefox, or Safari
- Clear browser cache
- Try incognito/private mode

## Solution 5: Check Sanity Project Settings

Your developer may need to check:
1. Sanity project settings at [sanity.io/manage](https://sanity.io/manage)
2. Asset upload permissions
3. Project API tokens

## Solution 6: File Format Issues

**Supported formats:**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ GIF (.gif)

**If your file has a different extension:**
- Rename it to `.jpg` or `.jpeg`
- Or convert it using an image editor

## Solution 7: Network Issues

If uploads fail partway through:
- Check your internet connection
- Try uploading from a different network
- Wait a few minutes and try again

## What Error Message Are You Seeing?

The specific error message will help diagnose the issue:

- **"File too large"** → File size issue (compress the image)
- **"Invalid file type"** → Format issue (convert to JPEG/PNG)
- **"Upload failed"** → Network or permission issue
- **"Asset creation failed"** → Sanity project configuration issue

## Quick Fixes to Try

1. ✅ **Re-save the image** as a new JPEG file
2. ✅ **Try a different browser**
3. ✅ **Check file size** (should be under 10MB)
4. ✅ **Clear browser cache** and try again
5. ✅ **Check browser console** for specific error messages

## Still Having Issues?

If none of these work, please provide:
1. The exact error message you see
2. The file size of your image
3. The browser you're using
4. Any error messages from the browser console (F12 → Console tab)

Your developer can then check the Sanity project configuration and fix any code-level issues.

