# Sanity Products Setup Guide

## Overview

Products are now managed through **Sanity Studio** instead of the custom admin interface. This provides a much better experience for non-technical users.

## What Changed

### ✅ Products Now in Sanity
- All product data (name, description, images, pricing, inventory) is stored in Sanity CMS
- Products are edited through Sanity Studio (user-friendly interface)
- Products automatically sync to the database for order processing

### ✅ New Sanity Schemas Created
1. **Product Schema** (`sanity/schemas/product.ts`)
   - Complete product information
   - Image management with primary image support
   - Pricing, inventory, and product details
   - SEO fields

2. **Category Schema** (`sanity/schemas/category.ts`)
   - Product categories
   - Can be managed in Sanity Studio

### ✅ Updated API Endpoints
- `/api/products` - Now fetches from Sanity
- `/api/products/[slug]` - Now fetches from Sanity
- Products API automatically transforms Sanity data to match existing Product interface

### ✅ Admin Products Page
- Now shows read-only view of products from Sanity
- "Edit in Sanity Studio" button links directly to product editing
- Removed custom create/edit forms (no longer needed)

## Setup Steps

### 1. Deploy Sanity Studio

If you haven't already deployed Sanity Studio:

```bash
npm run studio:deploy
```

This will deploy to `https://vendetta-roasting.sanity.studio` (or your custom hostname).

### 2. Add Environment Variable

Add to `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SANITY_STUDIO_URL=https://vendetta-roasting.sanity.studio
```

### 3. Create Categories in Sanity

1. Go to Sanity Studio
2. Click "Category" in the sidebar
3. Create categories (e.g., "Coffee", "Equipment", "Merchandise")
4. These will be available when creating products

### 4. Create Products in Sanity

1. Go to Sanity Studio
2. Click "Product" → "Create new"
3. Fill in all product information
4. Upload images
5. Click "Publish"

## How It Works

### Data Flow

1. **Content Management (Sanity)**
   - Non-technical user edits products in Sanity Studio
   - All product data stored in Sanity
   - Images automatically optimized by Sanity CDN

2. **Website Display**
   - Frontend fetches products from `/api/products`
   - API queries Sanity and transforms data
   - Products display on shop pages

3. **Order Processing (Database)**
   - When orders are placed, product data is copied to database
   - This ensures order history has snapshot of product at time of purchase
   - Inventory can be managed in Sanity (or synced to database)

## Benefits for Non-Technical Users

✅ **Intuitive Interface** - Sanity Studio is designed for content editors
✅ **Rich Text Editing** - Better description editing experience
✅ **Image Management** - Built-in image upload and optimization
✅ **No Code Required** - Everything is point-and-click
✅ **Draft/Publish** - Can save drafts before publishing
✅ **Version History** - See what changed and when

## Migration Notes

### Existing Products

If you have products in the database:
1. They will continue to work until you migrate them
2. To migrate: Create them in Sanity Studio with the same data
3. Old database products will be replaced by Sanity products

### Categories

Categories can now be managed in Sanity Studio:
1. Create categories in Sanity
2. They'll be available when creating products
3. Categories API (`/api/categories`) still works (can be updated to use Sanity later)

## Next Steps

1. **Test the Setup:**
   - Create a test product in Sanity Studio
   - Verify it appears on the shop page
   - Check that images load correctly

2. **Train the User:**
   - Share the `PRODUCT_MANAGEMENT_GUIDE.md` document
   - Walk them through creating their first product
   - Show them how to upload images

3. **Optional: Database Sync**
   - If you need real-time inventory tracking, consider adding a webhook
   - Sanity can trigger a webhook when products are updated
   - Webhook can sync inventory to database for order processing

## Troubleshooting

### Products Not Showing
- Check that products are published in Sanity (not just saved as drafts)
- Verify `isActive` is set to `true`
- Check browser console for errors

### Images Not Loading
- Verify images are uploaded in Sanity
- Check that at least one image has `isPrimary` set to `true`
- Verify Sanity API token is set in environment variables

### Categories Not Showing
- Create categories in Sanity Studio first
- Make sure categories are published and `isActive` is `true`

