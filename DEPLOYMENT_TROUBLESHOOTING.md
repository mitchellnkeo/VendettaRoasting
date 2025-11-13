# Sanity Studio Deployment Troubleshooting

## Current Issue
- Deployment reports "Success" but URL returns 404
- Malformed URL in output: `https://https://pyoyob4y.sanity.studio/.sanity.studio/`
- Actual URL `https://pyoyob4y.sanity.studio/` returns: `{"statusCode":404,"error":"Not Found","message":"Studio not found"}`

## Steps to Resolve

### Step 1: Check Sanity Dashboard
1. Go to: https://www.sanity.io/manage/project/pyoyob4y
2. Look for "Studio" or "Deployments" section
3. Check if there's a deployed Studio listed
4. Verify the correct URL from the dashboard

### Step 2: Verify Deployment Status
```bash
# Check if there are any deployment issues
npx sanity projects list

# Check deployment history (if available)
npx sanity deploy --help
```

### Step 3: Try Creating a New Hostname
The deployment might need a fresh hostname. When prompted:
- Select "Create new studio hostname"
- Choose a unique name (e.g., `vendetta-roasting-studio`)

### Step 4: Check for Deployment Delays
- Sanity deployments can take 1-5 minutes to propagate
- Wait a few minutes and try again
- Clear browser cache and try again

### Step 5: Verify Configuration Files
Make sure both files are correct:

**sanity.config.ts** - Should have:
```typescript
projectId: 'pyoyob4y',
dataset: 'production',
```

**sanity.cli.js** - Should have:
```javascript
api: {
  projectId: 'pyoyob4y',
  dataset: 'production'
},
deployment: {
  appId: 'jyketwws1citsx9n9h88iuc7',
}
```

### Step 6: Check CORS Settings
1. Go to Sanity Dashboard → Project Settings → API → CORS origins
2. Make sure `https://pyoyob4y.sanity.studio` is listed
3. Add it if it's missing

### Step 7: Alternative - Check Actual Deployed URL
The malformed URL in the output might be a display bug. Try:
- Check the Sanity dashboard for the actual Studio URL
- The URL format should be: `https://[project-id].sanity.studio/`
- Or: `https://[custom-hostname].sanity.studio/`

## Next Steps

1. **Check Sanity Dashboard First** - This will show the actual deployment status
2. **Wait 2-5 minutes** - Deployments can take time to propagate
3. **Try accessing from the dashboard** - The dashboard will show the correct URL
4. **Contact Sanity Support** - If the issue persists, there might be a platform issue

## Quick Test
```bash
# Try deploying again with verbose output
npx sanity deploy --verbose

# Check what URL it actually deploys to
# The output might show the correct URL despite the malformed one
```

