import { GetServerSideProps } from 'next';
import { sanityClient } from '../lib/sanity';

// This generates a dynamic sitemap.xml
export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vendettaroasting.com';
  
  // Static pages
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/shop', changefreq: 'daily', priority: '0.9' },
    { url: '/subscriptions', changefreq: 'weekly', priority: '0.8' },
    { url: '/about', changefreq: 'monthly', priority: '0.7' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
    { url: '/wholesale', changefreq: 'monthly', priority: '0.7' },
    { url: '/faq', changefreq: 'monthly', priority: '0.6' },
    { url: '/events', changefreq: 'weekly', priority: '0.6' },
  ];

  // Fetch products from Sanity
  let products: any[] = [];
  try {
    const productsQuery = `*[_type == "product" && isActive == true] {
      "slug": slug.current,
      _updatedAt
    }`;
    products = await sanityClient.fetch(productsQuery);
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${products
  .map(
    (product) => `  <url>
    <loc>${siteUrl}/shop/${product.slug}</loc>
    <lastmod>${new Date(product._updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

