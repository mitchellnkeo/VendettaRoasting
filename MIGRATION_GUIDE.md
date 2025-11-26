# How to Run Database Migrations

This guide shows you how to run the anonymous reviews migration for your database.

---

## 🚀 Quick Start (Recommended)

### Option 1: Using the Migration Script (Easiest)

1. **Make sure your `.env.local` file has `DATABASE_URL` set:**
   ```bash
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Run the migration:**
   ```bash
   npm run db:migrate migrations/add-anonymous-reviews.sql
   ```

   Or directly:
   ```bash
   node scripts/run-migration.js migrations/add-anonymous-reviews.sql
   ```

3. **Verify it worked:**
   - You should see "✅ Migration executed successfully!"
   - The script will show you the updated columns and indexes

---

## 📋 Method 2: Manual Execution (Supabase/Neon Dashboard)

If the script doesn't work, you can run the migration manually:

### For Supabase:

1. **Go to your Supabase Dashboard:**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor:**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Copy and paste the migration:**
   - Open `migrations/add-anonymous-reviews.sql` in your project
   - Copy all the SQL code
   - Paste it into the SQL Editor

4. **Run the migration:**
   - Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - You should see "Success. No rows returned"

5. **Verify:**
   - Go to **"Table Editor"** → **"reviews"** table
   - Check that these columns exist:
     - `reviewer_name`
     - `reviewer_email`
     - `sanity_product_id`
   - Check that `user_id` is nullable (can be empty)

### For Neon (or other PostgreSQL):

1. **Go to your database dashboard**
2. **Open SQL Editor / Query Tool**
3. **Copy the SQL from `migrations/add-anonymous-reviews.sql`**
4. **Paste and execute**
5. **Verify the changes**

---

## 🔍 Method 3: Using psql Command Line

If you have `psql` installed:

1. **Connect to your database:**
   ```bash
   psql "your-database-url-here"
   ```

2. **Run the migration:**
   ```bash
   \i migrations/add-anonymous-reviews.sql
   ```

   Or copy-paste the SQL directly into psql.

---

## ✅ Verification

After running the migration, verify it worked:

### Check 1: Columns Exist

Run this SQL query in your database:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reviews'
AND column_name IN ('reviewer_name', 'reviewer_email', 'sanity_product_id', 'user_id')
ORDER BY column_name;
```

**Expected results:**
- `reviewer_name` - VARCHAR - YES (nullable)
- `reviewer_email` - VARCHAR - YES (nullable)
- `sanity_product_id` - VARCHAR - YES (nullable)
- `user_id` - UUID - YES (nullable) ← Should be nullable now

### Check 2: Indexes Created

Run this SQL query:

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'reviews'
AND indexname LIKE 'idx_reviews%'
ORDER BY indexname;
```

**Expected indexes:**
- `idx_reviews_product_approved`
- `idx_reviews_sanity_product`
- `idx_reviews_sanity_product_approved`

### Check 3: Constraint Removed

The unique constraint on `(product_id, user_id)` should be removed. You can verify:

```sql
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'reviews'
AND constraint_name LIKE '%product_id%user_id%';
```

Should return no rows (constraint removed).

---

## 🐛 Troubleshooting

### Error: "relation 'reviews' does not exist"

**Problem:** The reviews table doesn't exist yet.

**Solution:**
1. Run the main database setup first:
   ```bash
   npm run db:setup
   ```
2. This creates all tables including the `reviews` table
3. Then run the migration

### Error: "column already exists"

**Problem:** Some columns already exist.

**Solution:**
- This is okay! The migration uses `IF NOT EXISTS`, so it's safe to run again
- The migration will skip columns that already exist
- You can safely run the migration multiple times

### Error: "permission denied"

**Problem:** Your database user doesn't have ALTER TABLE permissions.

**Solution:**
- Check your database user permissions
- You may need to use an admin/owner account
- For Supabase: Make sure you're using the correct database role

### Error: "syntax error" or "unexpected token"

**Problem:** The SQL might have issues with your PostgreSQL version.

**Solution:**
- Check your PostgreSQL version (should be 12+)
- Try running the statements one at a time
- Check the error message for the specific line

### Migration Script Fails

**Problem:** The `npm run db:migrate` command doesn't work.

**Solutions:**
1. **Check DATABASE_URL:**
   ```bash
   # Verify it's set
   echo $DATABASE_URL
   
   # Or check .env.local
   cat .env.local | grep DATABASE_URL
   ```

2. **Run manually:**
   - Use Method 2 (Supabase/Neon Dashboard) instead
   - Or use Method 3 (psql command line)

3. **Check connection:**
   ```bash
   npm run db:test
   ```
   - This tests your database connection
   - Fix any connection issues first

---

## 📝 What the Migration Does

The migration makes these changes:

1. **Removes unique constraint** - Allows multiple anonymous reviews per product
2. **Makes user_id optional** - Reviews can be anonymous
3. **Adds reviewer_name** - For anonymous reviewer names
4. **Adds reviewer_email** - For anonymous reviewer emails
5. **Adds sanity_product_id** - Supports Sanity product IDs (text format)
6. **Creates indexes** - Improves query performance
7. **Updates table comment** - Documents the changes

---

## 🔄 Running Migrations Multiple Times

The migration is **idempotent** (safe to run multiple times):
- Uses `IF NOT EXISTS` for columns
- Uses `IF EXISTS` for dropping constraints
- Won't break if run again

If you're unsure if it ran, just run it again - it's safe!

---

## 📞 Need Help?

If you're stuck:

1. **Check the error message** - It usually tells you what's wrong
2. **Verify your DATABASE_URL** - Make sure it's correct
3. **Test your connection** - Run `npm run db:test`
4. **Try manual method** - Use Supabase/Neon dashboard instead
5. **Check database logs** - Your database provider may have error logs

---

## ✅ Success Checklist

After running the migration, you should be able to:

- [ ] See "Migration executed successfully" message
- [ ] Verify columns exist (reviewer_name, reviewer_email, sanity_product_id)
- [ ] Verify user_id is nullable
- [ ] See indexes created
- [ ] Submit a test review on a product page
- [ ] See the review in `/admin/reviews` as "Pending"
- [ ] Approve the review and see it on the product page

---

**Once the migration is complete, your review system is ready to use!** 🎉

