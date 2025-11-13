# Creating a New Studio Hostname - Step by Step

## The Problem
The existing hostname `https://pyoyob4y.sanity.studio/` appears to be corrupted in Sanity's system, causing the malformed URL output.

## Solution: Create a Fresh Hostname

When you run `npm run studio:deploy`, you'll be prompted:

```
? Select existing studio hostname
❯ https://pyoyob4y.sanity.studio/ 
  ──────────────
  Create new studio hostname
```

### Steps:
1. **Use arrow keys** to select "Create new studio hostname" (the second option)
2. **Press Enter**
3. **When asked for hostname**, type: `pyoyob4y` (or just press Enter to use the default)
4. **Wait for deployment** to complete

## Expected Result

After deployment, you should see:
```
Success! Studio deployed to https://pyoyob4y.sanity.studio/
```

**NOT** the malformed `https://https://pyoyob4y.sanity.studio/.sanity.studio/`

## Alternative: Use a Different Hostname

If `pyoyob4y` is still causing issues, try a different hostname:
- `vendetta-roasting`
- `vendetta-studio`
- `vendetta-cms`

The URL will be: `https://[your-hostname].sanity.studio/`

## After Successful Deployment

Once you get the correct URL:
1. The Studio should be accessible at that URL
2. You'll get a new `appId` - you can add it to `sanity.cli.js` to avoid prompts
3. Update your documentation with the correct URL

## Quick Command

```bash
npm run studio:deploy
# Then select "Create new studio hostname" when prompted
```

