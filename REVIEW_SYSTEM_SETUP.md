# Review System Setup Guide

This guide explains how to set up and use the new anonymous review system for products.

---

## ✅ What's Been Implemented

### Features
- ✅ **Anonymous Reviews** - Anyone can leave reviews without creating an account
- ✅ **Review Form** - User-friendly form with star ratings
- ✅ **Review Display** - Shows approved reviews with ratings and comments
- ✅ **Admin Moderation** - Admin can approve, reject, feature, and delete reviews
- ✅ **Average Rating** - Automatically calculates and displays average rating
- ✅ **Featured Reviews** - Admin can feature specific reviews
- ✅ **Sanity Product Support** - Works with products managed in Sanity CMS

---

## 📋 Setup Instructions

### Step 1: Run Database Migration

The review system requires a database migration to support anonymous reviews and Sanity product IDs.

1. **Connect to your database** (Supabase, PostgreSQL, etc.)

2. **Run the migration:**
   ```sql
   -- Copy and run the contents of migrations/add-anonymous-reviews.sql
   ```
   
   Or use the migration file:
   ```bash
   # If you have a migration runner, run:
   # Otherwise, copy the SQL from migrations/add-anonymous-reviews.sql
   # and execute it in your database console
   ```

3. **Verify the migration:**
   - Check that `reviews` table has:
     - `user_id` is nullable (optional)
     - `reviewer_name` column exists
     - `reviewer_email` column exists
     - `sanity_product_id` column exists (for Sanity products)

### Step 2: Test the Review System

1. **Visit a product page:**
   - Go to any product detail page (e.g., `/shop/[product-slug]`)
   - Scroll down to see the "Customer Reviews" section

2. **Submit a test review:**
   - Fill out the review form
   - Select a star rating (1-5)
   - Enter your name and email
   - Write a review comment
   - Click "Submit Review"

3. **Check admin dashboard:**
   - Go to `/admin/reviews`
   - You should see the review with "Pending" status
   - Click "Approve" to make it visible on the product page

---

## 🎯 How It Works

### For Customers

1. **Viewing Reviews:**
   - Reviews appear on product detail pages
   - Shows average rating and total number of reviews
   - Featured reviews appear first
   - All approved reviews are displayed

2. **Submitting Reviews:**
   - No account required
   - Fill out name, email, rating, and comment
   - Reviews require admin approval before appearing
   - Customer receives confirmation message

### For Admins

1. **Review Management:**
   - Access via `/admin/reviews`
   - Filter by status (All, Pending, Approved)
   - Search by name, email, or comment
   - View all review details

2. **Review Actions:**
   - **Approve** - Makes review visible on product page
   - **Reject** - Hides review from product page
   - **Feature** - Highlights review (appears first)
   - **Delete** - Permanently removes review

---

## 📁 Files Created

### API Endpoints
- `src/pages/api/reviews/index.ts` - Submit new reviews
- `src/pages/api/reviews/[productId].ts` - Fetch reviews for a product
- `src/pages/api/admin/reviews.ts` - Admin: List all reviews
- `src/pages/api/admin/reviews/[reviewId].ts` - Admin: Update/delete reviews

### Components
- `src/components/ReviewForm.tsx` - Review submission form
- `src/components/ReviewsList.tsx` - Display approved reviews

### Pages
- `src/pages/admin/reviews/index.tsx` - Admin review management page

### Database
- `migrations/add-anonymous-reviews.sql` - Database migration

---

## 🔧 Configuration

### Product ID Format

The system supports both:
- **Database Product IDs** (UUID format)
- **Sanity Product IDs** (text format, e.g., Sanity document IDs)

The API automatically detects which format is used and queries the appropriate column.

### Review Approval

- **Default:** All reviews require admin approval (`is_approved = false`)
- **To change:** Modify the API endpoint to auto-approve (not recommended for production)

### Review Limits

- **Per Product:** No limit (but API limits to 50 most recent)
- **Per Reviewer:** No limit for anonymous reviews
- **For Logged-in Users:** One review per product (enforced by database constraint)

---

## 🎨 Customization

### Styling

The review components use your existing Tailwind CSS classes:
- `coffee` and `cream` color palette
- `shadow-soft` and `shadow-warm` shadows
- `rounded-2xl` border radius

### Review Form Fields

To add/remove fields, edit:
- `src/components/ReviewForm.tsx` - Form fields
- `src/pages/api/reviews/index.ts` - Validation and storage

### Display Options

To customize review display, edit:
- `src/components/ReviewsList.tsx` - Review card layout
- `src/pages/shop/[slug].tsx` - Section layout

---

## 🐛 Troubleshooting

### Reviews Not Appearing

**Problem:** Reviews submitted but not showing on product page

**Solutions:**
1. Check admin dashboard - reviews need approval
2. Verify `is_approved = true` in database
3. Check product ID matches (Sanity vs Database)
4. Clear browser cache

### Migration Errors

**Problem:** Migration fails when running

**Solutions:**
1. Check database connection
2. Verify you have ALTER TABLE permissions
3. Run migration statements one at a time
4. Check if columns already exist (use `IF NOT EXISTS`)

### Product ID Mismatch

**Problem:** Reviews not linking to correct product

**Solutions:**
1. Verify product ID format (UUID vs Sanity ID)
2. Check `sanity_product_id` column is populated for Sanity products
3. Check `product_id` column is populated for database products

---

## 📊 Database Schema

### Reviews Table Structure

```sql
reviews
├── id (UUID, Primary Key)
├── product_id (UUID, nullable) - For database products
├── sanity_product_id (VARCHAR, nullable) - For Sanity products
├── user_id (UUID, nullable) - For logged-in users
├── reviewer_name (VARCHAR) - For anonymous reviews
├── reviewer_email (VARCHAR) - For anonymous reviews
├── rating (INTEGER, 1-5)
├── title (VARCHAR, nullable)
├── comment (TEXT)
├── is_approved (BOOLEAN, default: false)
├── is_featured (BOOLEAN, default: false)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🚀 Next Steps

### Recommended Enhancements

1. **Email Notifications**
   - Notify admin when new review is submitted
   - Notify customer when review is approved

2. **Review Request Emails**
   - Automatically email customers after order delivery
   - Include link to review product

3. **Review Helpfulness**
   - Allow customers to mark reviews as helpful
   - Sort by most helpful

4. **Review Images**
   - Allow customers to upload photos with reviews
   - Display review images in review cards

5. **Review Replies**
   - Allow admin/owner to reply to reviews
   - Display replies below reviews

---

## 📝 Notes

- Reviews are stored in PostgreSQL database
- Product references support both database UUIDs and Sanity document IDs
- All reviews require admin approval by default
- Featured reviews appear first in the list
- Average rating is calculated from approved reviews only

---

## ✅ Testing Checklist

- [ ] Database migration completed successfully
- [ ] Can submit anonymous review on product page
- [ ] Review appears in admin dashboard as "Pending"
- [ ] Can approve review in admin dashboard
- [ ] Approved review appears on product page
- [ ] Average rating calculates correctly
- [ ] Featured reviews appear first
- [ ] Can search/filter reviews in admin
- [ ] Can delete reviews in admin
- [ ] Can feature/unfeature reviews

---

**The review system is now ready to use!** 🎉

