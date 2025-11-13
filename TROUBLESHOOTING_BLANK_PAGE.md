# Troubleshooting Blank Page in Sanity Studio

## Current Issue
Blank page when trying to create new documents in Sanity Studio.

## Console Error
```
Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
```

## Possible Causes

### 1. Browser Extensions
This error is often caused by browser extensions interfering with Sanity Studio.

**Solution:**
- Try in **Incognito/Private mode** (disables extensions)
- Or disable extensions one by one to find the culprit
- Common culprits: Ad blockers, password managers, privacy extensions

### 2. Test Locally First
Test the Studio locally to rule out deployment issues:

```bash
npm run studio
```

Then visit: http://localhost:3333

If it works locally but not deployed, it's a deployment issue.
If it doesn't work locally either, it's a schema/configuration issue.

### 3. Clear Browser Cache
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache completely

### 4. Try Different Browser
- Test in Chrome, Firefox, Safari, or Edge
- See if the issue is browser-specific

### 5. Check Network Tab
- Open DevTools → Network tab
- Look for failed requests (red)
- Check if any requests are blocked

## Current Schema (Minimal Test)

The schema is now at the absolute minimum:
- Just one field: `title` (string)
- No validation
- No `defineField` wrapper

If this still shows a blank page, it's likely not a schema issue.

## Next Steps

1. **Test in Incognito mode** - This will tell us if it's a browser extension
2. **Test locally** - Run `npm run studio` and test at localhost:3333
3. **Check Network tab** - See if requests are failing
4. **Try different browser** - Rule out browser-specific issues

