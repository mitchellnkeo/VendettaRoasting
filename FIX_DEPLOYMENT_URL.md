# Fixing the Malformed URL Issue

## Problem
The deployment was showing a malformed URL:
```
https://https://pyoyob4y.sanity.studio/.sanity.studio/
```

This should be:
```
https://pyoyob4y.sanity.studio/
```

## Root Cause
The `appId` in `sanity.cli.js` was pointing to a corrupted deployment configuration that had the URL incorrectly formatted.

## Solution Applied
I've removed the `appId` from `sanity.cli.js` to force a fresh deployment with the correct URL.

## Next Steps

### Option 1: Undeploy and Redeploy (Recommended)
```bash
# 1. Undeploy the corrupted deployment
npx sanity undeploy --yes

# 2. Deploy fresh
npm run studio:deploy
```

When prompted, select "Create new studio hostname" and use: `pyoyob4y` (or just press Enter to use the default)

### Option 2: Use Existing Hostname
If you select the existing hostname when prompted, it should now work correctly since we removed the corrupted appId.

## What to Look For

After deployment, the success message should show:
```
Success! Studio deployed to https://pyoyob4y.sanity.studio/
```

**NOT** the malformed `https://https://pyoyob4y.sanity.studio/.sanity.studio/`

## Verification

After deployment:
1. Check the URL in the success message - it should be correct
2. Visit `https://pyoyob4y.sanity.studio/` - it should load the Studio
3. If it works, the `appId` will be shown again - you can add it back to `sanity.cli.js` to avoid prompts next time

## If It Still Doesn't Work

1. **Check Sanity Dashboard**: https://www.sanity.io/manage/project/pyoyob4y
   - Look at the "Studios" tab
   - See what URL it shows there

2. **Try a Different Hostname**:
   - When prompted, select "Create new studio hostname"
   - Use something like: `vendetta-studio` or `vendetta-roasting`

3. **Contact Sanity Support**: If the issue persists, there might be a platform issue

