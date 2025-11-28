# Performance Optimization Guide

This guide covers the performance optimizations implemented in your Vendetta Roasting website and how to monitor and improve performance.

## ✅ Performance Optimizations Implemented

1. **Image Optimization**
   - Next.js Image component with automatic optimization
   - AVIF and WebP format support
   - Responsive image sizes
   - Lazy loading for non-critical images
   - Proper `sizes` attribute for responsive images

2. **Caching Strategies**
   - API route caching with `Cache-Control` headers
   - Static asset caching
   - Stale-while-revalidate for better UX

3. **Next.js Configuration**
   - SWC minification enabled
   - CSS optimization
   - Compression enabled
   - Image optimization configured

4. **Resource Hints**
   - DNS prefetch for external domains
   - Preconnect to critical resources
   - Preload for critical fonts

5. **Performance Monitoring**
   - Sentry performance tracking
   - Google Analytics web vitals
   - Performance measurement utilities

---

## 📊 Performance Metrics to Monitor

### Core Web Vitals

These are the key metrics Google uses for ranking:

1. **LCP (Largest Contentful Paint)**
   - Target: < 2.5 seconds
   - Measures: Time to render the largest content element

2. **FID (First Input Delay)**
   - Target: < 100 milliseconds
   - Measures: Time from first user interaction to browser response

3. **CLS (Cumulative Layout Shift)**
   - Target: < 0.1
   - Measures: Visual stability of the page

### Other Important Metrics

- **TTFB (Time to First Byte)**: < 600ms
- **FCP (First Contentful Paint)**: < 1.8s
- **Total Load Time**: < 3s

---

## 🔧 Current Optimizations

### Image Optimization

**Product Images:**
- Using Next.js `Image` component
- Automatic format conversion (AVIF, WebP)
- Responsive sizes: `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw`
- Quality set to 85% (good balance)
- Lazy loading for non-critical images

**Hero Images:**
- Priority loading for above-the-fold images
- Optimized dimensions (1920x1080 max)

### API Caching

**Cached Endpoints:**
- `/api/content/homepage` - 60s cache, 300s stale-while-revalidate
- `/api/products` - 60s cache, 300s stale-while-revalidate
- `/api/products/[slug]` - 60s cache, 300s stale-while-revalidate

**Cache Strategy:**
- `s-maxage=60`: Cache for 60 seconds at CDN level
- `stale-while-revalidate=300`: Serve stale content while revalidating for up to 300 seconds

### Next.js Configuration

```javascript
{
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true, // Gzip compression
  experimental: {
    optimizeCss: true, // CSS optimization
  },
}
```

---

## 🧪 Testing Performance

### Google PageSpeed Insights

1. Go to [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter your website URL
3. Run the test for both mobile and desktop
4. Review the recommendations

**Target Scores:**
- Mobile: 90+
- Desktop: 95+

### Lighthouse (Chrome DevTools)

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **Performance**
4. Click **Generate report**
5. Review scores and recommendations

### Web Vitals Extension

Install the [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma) to see real-time metrics.

---

## 🚀 Additional Optimizations You Can Make

### 1. Code Splitting

Next.js automatically code-splits, but you can optimize further:

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // If component doesn't need SSR
});
```

### 2. Font Optimization

Already using Inter font from Google Fonts. Consider:
- Self-hosting fonts for better performance
- Using `font-display: swap` for faster text rendering

### 3. Reduce JavaScript Bundle Size

- Use dynamic imports for large libraries
- Remove unused dependencies
- Use tree-shaking (already enabled)

### 4. Optimize Third-Party Scripts

- Load analytics scripts asynchronously (already done)
- Defer non-critical scripts
- Use `rel="preconnect"` for external domains (already done)

### 5. Database Query Optimization

- Add indexes to frequently queried columns
- Use connection pooling (already configured)
- Cache frequently accessed data

### 6. CDN Configuration

Vercel automatically provides:
- Global CDN
- Automatic HTTPS
- Edge caching

---

## 📈 Monitoring Performance

### Sentry Performance

1. Go to Sentry → Performance
2. View transaction traces
3. Identify slow API routes
4. Optimize based on data

### Google Analytics

1. Go to GA4 → Reports → Engagement → Web Vitals
2. View Core Web Vitals data
3. Track improvements over time

### Vercel Analytics

If you enable Vercel Analytics:
1. Go to Vercel Dashboard → Analytics
2. View real-time performance data
3. See Core Web Vitals metrics

---

## 🔍 Performance Checklist

Before going live, verify:

- [ ] PageSpeed Insights score: 90+ (mobile and desktop)
- [ ] LCP < 2.5 seconds
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] All images using Next.js Image component
- [ ] Images have proper `sizes` attribute
- [ ] Critical images have `priority` prop
- [ ] API routes have cache headers
- [ ] Fonts are optimized
- [ ] JavaScript bundle size is reasonable
- [ ] Third-party scripts are async/deferred
- [ ] No console errors affecting performance

---

## 🐛 Troubleshooting Performance Issues

### Slow Page Loads

**Problem:** Pages taking too long to load

**Solutions:**
1. Check image sizes - optimize large images
2. Review API response times - add caching
3. Check bundle size - remove unused code
4. Enable compression (already enabled)
5. Use CDN (Vercel provides this automatically)

### Large Bundle Size

**Problem:** JavaScript bundle too large

**Solutions:**
1. Use dynamic imports for large components
2. Remove unused dependencies
3. Check bundle analyzer: `npm run build` and review output
4. Split vendor chunks if needed

### Slow API Routes

**Problem:** API routes responding slowly

**Solutions:**
1. Add database indexes
2. Implement caching (already done for some routes)
3. Optimize database queries
4. Use connection pooling (already configured)
5. Consider edge functions for simple routes

### Image Loading Issues

**Problem:** Images loading slowly

**Solutions:**
1. Ensure using Next.js Image component
2. Set proper `sizes` attribute
3. Use `priority` for above-the-fold images
4. Optimize image dimensions before upload
5. Use WebP/AVIF formats (automatic with Next.js)

---

## 📚 Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Vitals](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Vercel Performance](https://vercel.com/docs/concepts/analytics)

---

## ✅ Quick Wins

These are easy optimizations you can do right now:

1. **Add `priority` to hero images** - Already done
2. **Optimize image dimensions** - Upload appropriately sized images
3. **Enable compression** - Already enabled
4. **Add cache headers** - Already done for key routes
5. **Use resource hints** - Already implemented

---

Your website is now optimized for performance! 🚀

Monitor your performance regularly and make adjustments based on real user data.

