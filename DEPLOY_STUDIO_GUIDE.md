# Deploy Sanity Studio - Step by Step Guide

## Problem
Getting 404 error at `https://pyoyob4y.sanity.studio/` means the Studio hasn't been deployed yet.

## Solution: Deploy the Studio

### Step 1: Login to Sanity
```bash
cd ~/Projects/VendettaRoasting
npx sanity login
```

This will:
- Open your browser
- Ask you to log in to Sanity (or create an account)
- Authenticate the CLI

### Step 2: Verify Project Access
```bash
npx sanity projects list
```

This should show your project `pyoyob4y`. If not, you may need to:
- Check you're logged into the correct Sanity account
- Verify the project ID `pyoyob4y` is correct

### Step 3: Deploy the Studio
```bash
npm run studio:deploy
```

This will:
- Build your Studio configuration
- Deploy it to Sanity's hosting
- Make it available at `https://pyoyob4y.sanity.studio/`

### Step 4: Verify Deployment
After deployment completes, visit:
```
https://pyoyob4y.sanity.studio/
```

You should see the Sanity Studio login/content interface.

## Troubleshooting

### Issue: "You must login first"
**Solution**: Run `npx sanity login` first

### Issue: "Project not found"
**Solution**: 
1. Check project ID in `sanity.config.ts` matches your Sanity project
2. Verify you have access to the project at https://sanity.io/manage
3. The project ID should be `pyoyob4y`

### Issue: "Permission denied"
**Solution**: 
1. Make sure you're the owner or have admin access to the project
2. Check your Sanity account permissions

### Issue: Deployment fails
**Solution**:
1. Check `sanity.config.ts` is correct
2. Verify all schemas are properly exported
3. Check for TypeScript errors: `npx tsc --noEmit sanity.config.ts`

## After Deployment

Once deployed, your client can:
1. Visit `https://pyoyob4y.sanity.studio/`
2. Log in with their Sanity account
3. Edit content (announcements, events, FAQs, etc.)

## Re-deploying After Changes

If you make changes to:
- `sanity.config.ts`
- `src/lib/sanitySchemas.ts`

You need to re-deploy:
```bash
npm run studio:deploy
```

## Quick Command Reference

```bash
# Login to Sanity
npx sanity login

# List your projects
npx sanity projects list

# Deploy Studio
npm run studio:deploy

# Run Studio locally (for development)
npm run studio
```

