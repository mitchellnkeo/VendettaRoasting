# Domain Setup Guide: Connecting Porkbun Domain to Vercel

This guide will walk you through connecting your existing domain from Porkbun to your Vercel deployment.

## Prerequisites

- ✅ Domain registered with Porkbun
- ✅ Vercel account with your project deployed
- ✅ Access to Porkbun DNS management
- ✅ Access to Vercel project settings

---

## Step 1: Add Domain to Vercel

1. **Go to your Vercel Dashboard**
   - Navigate to [vercel.com](https://vercel.com)
   - Select your **Vendetta Roasting** project

2. **Open Project Settings**
   - Click on **Settings** tab
   - Click on **Domains** in the left sidebar

3. **Add Your Domain**
   - Click **Add Domain** button
   - Enter your domain (e.g., `vendettaroasting.com`)
   - Click **Add**

4. **Vercel will show you DNS records to add**
   - You'll see something like:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - **Keep this page open** - you'll need these values in the next step

---

## Step 2: Configure DNS Records in Porkbun

1. **Log into Porkbun**
   - Go to [porkbun.com](https://porkbun.com)
   - Log into your account

2. **Access DNS Management**
   - Click on **Domain List** or find your domain
   - Click on your domain name
   - Click on **DNS** or **DNS Records** tab

3. **Add/Update DNS Records**

   You have two options:

   ### Option A: Root Domain (vendettaroasting.com) + WWW

   **For Root Domain:**
   - **Type:** `A` (or `ANAME` if Porkbun supports it)
   - **Host:** `@` (or leave blank, or `vendettaroasting.com`)
   - **Answer:** `76.76.21.21` (use the IP address Vercel provided)
   - **TTL:** `600` (or default)

   **For WWW Subdomain:**
   - **Type:** `CNAME`
   - **Host:** `www`
   - **Answer:** `cname.vercel-dns.com` (use the CNAME value Vercel provided)
   - **TTL:** `600` (or default)

   ### Option B: CNAME Only (if Porkbun supports CNAME for root)

   Some registrars support CNAME for root domains. If Porkbun supports this:
   - **Type:** `CNAME`
   - **Host:** `@` (or root domain)
   - **Answer:** `cname.vercel-dns.com`
   - **TTL:** `600`

   **Note:** If you're unsure, use Option A (A record for root, CNAME for www).

4. **Remove Conflicting Records**
   - Delete any existing A or CNAME records that might conflict
   - Remove any old hosting records

5. **Save Changes**
   - Click **Save** or **Update** in Porkbun

---

## Step 3: Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate, though typically it's 1-4 hours.

**Check DNS Propagation:**
- Use [whatsmydns.net](https://www.whatsmydns.net) to check if your DNS records have propagated
- Enter your domain and check for A and CNAME records

**Verify in Vercel:**
- Go back to Vercel → Settings → Domains
- Vercel will show the status:
  - ⏳ **Pending** - DNS is still propagating
  - ✅ **Valid** - Domain is connected and working
  - ❌ **Invalid** - Check your DNS records

---

## Step 4: Update Environment Variables

Once your domain is connected, update the `NEXT_PUBLIC_SITE_URL` environment variable:

1. **In Vercel:**
   - Go to **Settings** → **Environment Variables**
   - Find or add `NEXT_PUBLIC_SITE_URL`
   - Set value to: `https://yourdomain.com` (replace with your actual domain)
   - Make sure it's set for **Production**, **Preview**, and **Development**
   - Click **Save**

2. **Redeploy Your Application**
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a redeploy

---

## Step 5: Verify Everything Works

1. **Test Your Domain**
   - Visit `https://yourdomain.com` in a browser
   - Should load your Vercel deployment

2. **Test WWW Subdomain**
   - Visit `https://www.yourdomain.com`
   - Should also work (Vercel handles this automatically)

3. **Check SSL Certificate**
   - Vercel automatically provisions SSL certificates via Let's Encrypt
   - Your site should have HTTPS enabled automatically
   - This usually happens within a few minutes of DNS propagation

4. **Verify SEO Settings**
   - Check that your sitemap works: `https://yourdomain.com/sitemap.xml`
   - Verify robots.txt: `https://yourdomain.com/robots.txt`
   - Check that meta tags use the correct domain

---

## Troubleshooting

### Domain Not Resolving

**Problem:** Domain shows "Invalid" in Vercel or doesn't load

**Solutions:**
1. Double-check DNS records in Porkbun match exactly what Vercel provided
2. Wait longer for DNS propagation (can take up to 48 hours)
3. Clear your DNS cache:
   - Windows: `ipconfig /flushdns`
   - Mac/Linux: `sudo dscacheutil -flushcache` or `sudo systemd-resolve --flush-caches`
4. Try accessing from a different network or use a VPN

### SSL Certificate Not Issued

**Problem:** Site loads but shows "Not Secure" or SSL error

**Solutions:**
1. Wait a few minutes - Vercel automatically provisions SSL after DNS propagates
2. Check Vercel dashboard → Domains → should show "Valid" status
3. If still not working after 24 hours, contact Vercel support

### WWW Subdomain Not Working

**Problem:** Root domain works but www doesn't

**Solutions:**
1. Verify CNAME record for `www` is set correctly in Porkbun
2. Make sure the CNAME points to `cname.vercel-dns.com`
3. Wait for DNS propagation

### Mixed Content Warnings

**Problem:** Browser shows mixed content warnings

**Solutions:**
1. Make sure all images and assets use HTTPS URLs
2. Check that `NEXT_PUBLIC_SITE_URL` uses `https://` not `http://`
3. Update any hardcoded URLs in your code to use HTTPS

---

## Important Notes

### DNS Record Types

- **A Record:** Points domain to an IP address (for root domain)
- **CNAME Record:** Points domain to another domain name (for subdomains like www)
- **ANAME/ALIAS:** Some registrars support this for root domains (like CNAME but for root)

### Porkbun-Specific Tips

- Porkbun's interface may use different terminology:
  - "Host" might be called "Name" or "Subdomain"
  - "Answer" might be called "Value" or "Target"
  - `@` symbol represents the root domain

### Vercel Automatic Features

- ✅ **Automatic HTTPS:** SSL certificates are provisioned automatically
- ✅ **WWW Redirect:** Vercel automatically redirects www to root (or vice versa) based on your preference
- ✅ **Domain Verification:** Vercel verifies domain ownership automatically

---

## Quick Reference: DNS Records

Here's what your DNS records should look like in Porkbun:

```
Type: A
Host: @
Answer: 76.76.21.21
TTL: 600

Type: CNAME
Host: www
Answer: cname.vercel-dns.com
TTL: 600
```

**Note:** The IP address and CNAME value will be provided by Vercel when you add the domain. Use the exact values Vercel shows you.

---

## Next Steps After Domain Setup

1. ✅ Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables
2. ✅ Test all pages load correctly
3. ✅ Verify sitemap and robots.txt work
4. ✅ Check that social sharing previews work (Open Graph tags)
5. ✅ Submit sitemap to Google Search Console
6. ✅ Set up Google Analytics (if not already done)

---

## Need Help?

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Porkbun Support:** [porkbun.com/support](https://porkbun.com/support)
- **DNS Propagation Checker:** [whatsmydns.net](https://www.whatsmydns.net)

---

## Summary Checklist

- [ ] Added domain to Vercel project
- [ ] Copied DNS records from Vercel
- [ ] Added A record for root domain in Porkbun
- [ ] Added CNAME record for www in Porkbun
- [ ] Waited for DNS propagation (checked with whatsmydns.net)
- [ ] Verified domain shows "Valid" in Vercel
- [ ] Updated `NEXT_PUBLIC_SITE_URL` environment variable in Vercel
- [ ] Redeployed application
- [ ] Tested domain loads correctly
- [ ] Verified HTTPS/SSL is working
- [ ] Tested www subdomain
- [ ] Verified sitemap and robots.txt work

Once all these are checked, your domain should be fully connected and working! 🎉

