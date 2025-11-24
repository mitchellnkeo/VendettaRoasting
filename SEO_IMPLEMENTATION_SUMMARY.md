# SEO Implementation Summary

## ✅ What's Been Implemented

### 1. **Reusable SEO Component** (`src/components/SEO.tsx`)
- Comprehensive meta tags (title, description)
- Open Graph tags for Facebook, LinkedIn sharing
- Twitter Card tags for Twitter sharing
- Canonical URLs
- Structured data (JSON-LD) support
- Noindex/nofollow support for admin pages

### 2. **Structured Data (JSON-LD)** (`src/lib/structuredData.ts`)
- **Organization Schema** - Company information, address, contact, social media
- **Product Schema** - Product details, pricing, availability, images, brand
- **Breadcrumb Schema** - Navigation breadcrumbs for better UX
- **Website Schema** - Site-wide search functionality

### 3. **XML Sitemap** (`src/pages/sitemap.xml.ts`)
- Dynamic sitemap generation
- Includes all static pages
- Includes all active products from Sanity
- Proper lastmod dates
- Priority and changefreq settings
- Accessible at `/sitemap.xml`

### 4. **Robots.txt** (`public/robots.txt`)
- Allows all public pages
- Blocks admin, API, account, checkout, cart, orders pages
- Points to sitemap location
- Ready for production

### 5. **Updated Pages with SEO**
All major pages now use the SEO component:
- ✅ Homepage (`/`) - Organization + Website schema
- ✅ Shop (`/shop`) - Product listing page
- ✅ Product Detail (`/shop/[slug]`) - Product schema + Breadcrumbs
- ✅ About (`/about`)
- ✅ Contact (`/contact`)
- ✅ Subscriptions (`/subscriptions`)
- ✅ Wholesale (`/wholesale`)
- ✅ FAQ (`/faq`)

## Features

### Meta Tags
- **Title Tags** - Unique, descriptive titles for each page
- **Meta Descriptions** - Compelling descriptions (150-160 characters)
- **Open Graph** - Rich previews on Facebook, LinkedIn
- **Twitter Cards** - Enhanced Twitter sharing
- **Canonical URLs** - Prevents duplicate content issues

### Structured Data Benefits
- **Rich Snippets** - Products can show price, rating, availability in search
- **Organization Info** - Business details in search results
- **Breadcrumbs** - Navigation path shown in search results
- **Better Indexing** - Search engines understand your content better

### Sitemap Features
- Auto-updates when products are added/updated
- Includes all public pages
- Proper priority and frequency settings
- Helps search engines discover all content

## Configuration

### Environment Variables

Add to `.env.local` and Vercel:
```bash
NEXT_PUBLIC_SITE_URL=https://vendettaroasting.com
```

**Important:** Update this to your actual domain in production!

### Site Settings (Sanity)

The SEO system uses data from Sanity's `siteSettings` document:
- Company name
- Address (for Organization schema)
- Contact info (email, phone)
- Social media links (for sameAs in Organization schema)

Make sure these are filled in Sanity Studio for best results.

## Testing

### Test Meta Tags
1. Visit any page
2. View page source (right-click → View Page Source)
3. Check `<head>` section for:
   - `<title>` tag
   - `<meta name="description">`
   - `<meta property="og:*">` tags
   - `<meta name="twitter:*">` tags
   - `<script type="application/ld+json">` for structured data

### Test Sitemap
1. Visit `https://yourdomain.com/sitemap.xml`
2. Should see XML with all pages and products
3. Verify products are included

### Test Robots.txt
1. Visit `https://yourdomain.com/robots.txt`
2. Should see robots.txt content
3. Verify sitemap URL is correct

### Test Structured Data
1. Use [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your product page URL
3. Should show Product schema validation
4. Use [Schema.org Validator](https://validator.schema.org/) for detailed validation

### Test Social Sharing
1. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your homepage URL
3. Should show Open Graph preview
4. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator) for Twitter cards

## Next Steps

### Recommended Enhancements

1. **Add Product Reviews Schema**
   - When review system is implemented
   - Add `aggregateRating` to product schema

2. **Add FAQ Schema**
   - Structured data for FAQ page
   - Can show FAQs in search results

3. **Add Event Schema**
   - For events page
   - Shows event details in search

4. **Add Breadcrumbs to All Pages**
   - Currently only on product pages
   - Add to shop, category pages

5. **Image Optimization**
   - Ensure OG images are optimized
   - Recommended: 1200x630px for social sharing

6. **Add hreflang Tags**
   - If you expand to multiple languages/regions

## Files Created/Modified

**New Files:**
- `src/components/SEO.tsx` - Reusable SEO component
- `src/lib/structuredData.ts` - Structured data generators
- `src/pages/sitemap.xml.ts` - Dynamic sitemap
- `public/robots.txt` - Robots configuration

**Modified Files:**
- `src/pages/index.tsx` - Homepage SEO
- `src/pages/shop/index.tsx` - Shop page SEO
- `src/pages/shop/[slug].tsx` - Product page SEO + structured data
- `src/pages/about.tsx` - About page SEO
- `src/pages/contact.tsx` - Contact page SEO
- `src/pages/subscriptions/index.tsx` - Subscriptions page SEO
- `src/pages/wholesale/index.tsx` - Wholesale page SEO
- `src/pages/faq.tsx` - FAQ page SEO

## Verification Checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` in environment variables
- [ ] Verify sitemap.xml is accessible
- [ ] Verify robots.txt is accessible
- [ ] Test meta tags on all pages
- [ ] Test structured data with Google Rich Results Test
- [ ] Test social sharing previews
- [ ] Verify product pages have product schema
- [ ] Verify homepage has organization schema
- [ ] Check that admin pages are blocked in robots.txt

## Troubleshooting

### Sitemap Not Working
- Check that Sanity connection is working
- Verify products are marked as `isActive: true`
- Check server logs for errors

### Structured Data Not Validating
- Verify JSON-LD is properly formatted
- Check that required fields are present
- Use Schema.org validator for detailed errors

### Social Sharing Not Working
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly
- Check that OG image URLs are absolute (not relative)
- Use Facebook/Twitter debuggers to clear cache

### Meta Tags Not Showing
- Verify SEO component is imported and used
- Check that page is not using old `<Head>` component
- Verify props are being passed correctly

