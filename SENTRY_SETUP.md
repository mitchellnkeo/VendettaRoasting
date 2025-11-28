# Sentry Error Monitoring Setup Guide

This guide explains how to set up Sentry for error monitoring and performance tracking on your Vendetta Roasting website.

## ✅ Sentry Features Implemented

1. **Error Tracking** - Automatic capture of JavaScript errors
2. **Performance Monitoring** - Track page load times and API performance
3. **Session Replay** - Record user sessions when errors occur
4. **Error Boundaries** - React error boundaries with Sentry integration
5. **API Error Tracking** - Automatic error tracking in API routes
6. **Source Maps** - Upload source maps for better error debugging

---

## 🔧 Setup Instructions

### Step 1: Create a Sentry Account

1. Go to [Sentry.io](https://sentry.io/signup/)
2. Sign up for a free account (or sign in if you already have one)
3. The free tier includes:
   - 5,000 errors/month
   - 10,000 performance units/month
   - Session replay
   - Source maps

### Step 2: Create a New Project

1. In Sentry, click **"Create Project"**
2. Select **"Next.js"** as your platform
3. Give your project a name: **"Vendetta Roasting"**
4. Click **"Create Project"**

### Step 3: Get Your DSN

1. After creating the project, you'll see a **DSN (Data Source Name)**
2. It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
3. Copy this DSN - you'll need it in the next step

### Step 4: Add Environment Variables

Add the Sentry DSN to your `.env.local` file:

```bash
# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token  # Optional, for source map uploads
```

**Note:** 
- `NEXT_PUBLIC_SENTRY_DSN` is required for client-side error tracking
- `SENTRY_ORG` and `SENTRY_PROJECT` are required for source map uploads during build
- `SENTRY_AUTH_TOKEN` is optional but recommended for source maps (get it from Sentry → Settings → Auth Tokens)

### Step 5: Add to Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add all the Sentry environment variables:
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN` (optional)
3. Make sure to add them for **Production**, **Preview**, and **Development** environments

### Step 6: Test the Setup

1. Restart your development server
2. Visit your website
3. In Sentry, go to **Issues** → You should see a test event (or wait a few minutes)
4. To test error tracking, you can temporarily add this to any page:
   ```javascript
   throw new Error('Test error for Sentry');
   ```

---

## 📊 What's Being Tracked

### Automatic Error Tracking

- **Client-side errors:** JavaScript errors in the browser
- **Server-side errors:** Errors in API routes and server components
- **React errors:** Errors caught by Error Boundaries
- **Unhandled promise rejections:** Async errors

### Performance Monitoring

- **Page load times:** Automatic tracking of page performance
- **API route performance:** Response times for API endpoints
- **Transaction tracing:** Detailed performance data

### Session Replay

- **Error sessions:** Automatically records user sessions when errors occur
- **Privacy:** Text and media are masked by default for privacy

---

## 🧪 Testing Error Tracking

### Test Client-Side Error

Add this to any page component:

```typescript
useEffect(() => {
  // Test error tracking
  if (process.env.NODE_ENV === 'development') {
    throw new Error('Test error for Sentry');
  }
}, []);
```

### Test API Error

Add this to any API route:

```typescript
export default async function handler(req, res) {
  try {
    // Your code here
    throw new Error('Test API error');
  } catch (error) {
    // Sentry will automatically capture this
    throw error;
  }
}
```

### Test Error Boundary

The Error Boundary component will catch React errors. You can test it by:

1. Creating a component that throws an error
2. Rendering it in your app
3. The Error Boundary will catch it and display a friendly message

---

## 🔍 Viewing Your Data

### Issues Dashboard

- **Location:** Sentry → Issues
- **Shows:** All errors and exceptions
- **Use:** See what errors are happening in production

### Performance Dashboard

- **Location:** Sentry → Performance
- **Shows:** Page load times, API performance, transactions
- **Use:** Identify slow pages and optimize

### Session Replay

- **Location:** Sentry → Issues → [Select Issue] → Replay
- **Shows:** Video replay of user session when error occurred
- **Use:** Understand what the user was doing when the error happened

### Releases

- **Location:** Sentry → Releases
- **Shows:** Deployments and their associated errors
- **Use:** Track which version introduced errors

---

## 🎯 Configuration Options

### Adjust Error Sampling

In `sentry.client.config.ts` and `sentry.server.config.ts`, you can adjust:

```typescript
tracesSampleRate: 1.0, // 100% of transactions (change to 0.1 for 10%)
```

For production, consider:
- **Client:** `0.1` (10% of page loads)
- **Server:** `0.1` (10% of API requests)

### Adjust Session Replay Sampling

In `sentry.client.config.ts`:

```typescript
replaysOnErrorSampleRate: 1.0, // 100% of error sessions
replaysSessionSampleRate: 0.1, // 10% of all sessions
```

### Filter Errors

The configuration already filters out:
- Development errors (unless `NEXT_PUBLIC_SENTRY_DEBUG` is set)
- Browser extension errors
- Common non-critical errors (ResizeObserver, etc.)

You can customize the `beforeSend` function in the config files to filter more errors.

---

## 🔍 Troubleshooting

### Errors Not Appearing in Sentry

**Problem:** Errors not showing up in Sentry dashboard

**Solutions:**
1. Check that `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify the DSN is correct (check Sentry project settings)
3. Check browser console for Sentry initialization errors
4. Ensure you're not blocking Sentry with an ad blocker
5. Wait a few minutes - there can be a delay

### Source Maps Not Working

**Problem:** Stack traces show minified code

**Solutions:**
1. Ensure `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` are set
2. Check that source maps are being generated (check `.next` folder)
3. Verify auth token has correct permissions
4. Check Sentry → Settings → Projects → [Your Project] → Source Maps

### Too Many Errors in Development

**Problem:** Getting spammed with development errors

**Solutions:**
1. The config already filters development errors
2. Set `NEXT_PUBLIC_SENTRY_DEBUG=false` to disable all dev errors
3. Or adjust the `beforeSend` function to filter more aggressively

---

## 📚 Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)
- [Sentry Source Maps](https://docs.sentry.io/platforms/javascript/sourcemaps/)

---

## ✅ Setup Checklist

Before going live, verify:

- [ ] Sentry account created
- [ ] Project created in Sentry
- [ ] DSN obtained
- [ ] `NEXT_PUBLIC_SENTRY_DSN` set in `.env.local`
- [ ] `NEXT_PUBLIC_SENTRY_DSN` set in Vercel
- [ ] `SENTRY_ORG` and `SENTRY_PROJECT` set (for source maps)
- [ ] `SENTRY_AUTH_TOKEN` set (optional, for source maps)
- [ ] Test error sent to Sentry successfully
- [ ] Error Boundary working
- [ ] Performance monitoring active
- [ ] Session replay enabled

---

## 🎯 Next Steps

After setting up Sentry:

1. **Set up Alerts:**
   - Go to Sentry → Alerts
   - Create alerts for critical errors
   - Set up email/Slack notifications

2. **Configure Release Tracking:**
   - Add release tags to track deployments
   - See which version introduced errors

3. **Set up Teams:**
   - Invite team members
   - Assign errors to team members
   - Set up workflows

4. **Review Performance:**
   - Check Performance dashboard regularly
   - Identify slow pages
   - Optimize based on data

Your error monitoring is now set up! 🎉

