# Database Setup Guide

This guide will help you set up a PostgreSQL database for Vendetta Roasting.

## Option 1: Supabase (Recommended - Free Tier Available)

Supabase is a great option with a generous free tier and easy setup.

### Steps:

1. **Create a Supabase Account:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Database URL:**
   - In your Supabase project dashboard, go to **Settings** → **Database**
   - Scroll down to **Connection string** section
   - Copy the **URI** connection string
   - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password (set during project creation)

3. **Add to `.env.local`:**
   ```bash
   DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres
   ```

4. **Run the Schema:**
   - In Supabase dashboard, go to **SQL Editor**
   - Click **New Query**
   - Copy and paste the entire contents of `database-schema.sql`
   - Click **Run** (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned" messages

## Recommended: Supabase

I recommend **Supabase** because:
- ✅ Free tier with 500MB database
- ✅ Easy web-based SQL editor
- ✅ Built-in table editor for viewing data
- ✅ Automatic backups
- ✅ Great documentation
- ✅ Easy to scale later

---

## Next Steps

Once your database is set up:
1. ✅ Add `DATABASE_URL` to `.env.local`
2. ✅ Run `database-schema.sql` to create tables
3. ✅ Restart your dev server: `npm run dev`
4. ✅ Test by creating an order through checkout
5. ✅ Verify order appears in `/admin/orders`

