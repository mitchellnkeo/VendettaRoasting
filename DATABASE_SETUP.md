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

---

## Option 2: Neon (Recommended - Serverless PostgreSQL)

Neon is a serverless PostgreSQL platform with a free tier.

### Steps:

1. **Create a Neon Account:**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project

2. **Get Your Database URL:**
   - In your Neon dashboard, you'll see your connection string automatically
   - It will look like: `postgresql://[user]:[password]@[hostname]/[database]?sslmode=require`
   - Copy this connection string

3. **Add to `.env.local`:**
   ```bash
   DATABASE_URL=postgresql://user:password@hostname/database?sslmode=require
   ```

4. **Run the Schema:**
   - In Neon dashboard, go to **SQL Editor**
   - Copy and paste the entire contents of `database-schema.sql`
   - Click **Run**
   - Verify tables were created successfully

---

## Option 3: Local PostgreSQL

If you have PostgreSQL installed locally:

### Steps:

1. **Install PostgreSQL** (if not already installed):
   - **macOS:** `brew install postgresql@14` or download from [postgresql.org](https://www.postgresql.org/download/)
   - **Windows:** Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **Linux:** `sudo apt-get install postgresql` (Ubuntu/Debian)

2. **Create a Database:**
   ```bash
   # Start PostgreSQL service
   # macOS: brew services start postgresql@14
   # Linux: sudo systemctl start postgresql
   
   # Create database
   createdb vendetta_roasting
   
   # Or using psql:
   psql postgres
   CREATE DATABASE vendetta_roasting;
   \q
   ```

3. **Get Your Database URL:**
   ```bash
   DATABASE_URL=postgresql://postgres:your-password@localhost:5432/vendetta_roasting
   ```
   - Replace `your-password` with your PostgreSQL password
   - Default user is usually `postgres`

4. **Add to `.env.local`:**
   ```bash
   DATABASE_URL=postgresql://postgres:your-password@localhost:5432/vendetta_roasting
   ```

5. **Run the Schema:**
   ```bash
   psql -d vendetta_roasting -f database-schema.sql
   ```
   Or using psql interactively:
   ```bash
   psql -d vendetta_roasting
   \i database-schema.sql
   \q
   ```

---

## Quick Setup Script

I can create a helper script to run the schema. Here's a simple Node.js script you can use:

```bash
# Save this as setup-database.js in your project root
```

Or use this command if you have `psql` installed:

```bash
# For Supabase/Neon (using connection string)
psql "your-database-url-here" -f database-schema.sql

# For local PostgreSQL
psql -d vendetta_roasting -f database-schema.sql
```

---

## Verify Your Setup

After setting up your database, test the connection:

1. **Check your `.env.local` file:**
   ```bash
   cat .env.local | grep DATABASE_URL
   ```

2. **Test the connection:**
   - Restart your dev server: `npm run dev`
   - Try accessing `/admin/orders` - you should no longer see the database error
   - Check the terminal for any connection errors

3. **Verify tables were created:**
   - In Supabase: Go to **Table Editor** - you should see tables like `users`, `orders`, `products`, etc.
   - In Neon: Go to **Tables** section - you should see all the tables
   - Local: `psql -d vendetta_roasting -c "\dt"` to list all tables

---

## Troubleshooting

### Error: "getaddrinfo ENOTFOUND base"
- Your `DATABASE_URL` is malformed
- Check that it starts with `postgresql://` not `postgres://base`
- Make sure there are no extra spaces or line breaks

### Error: "password authentication failed"
- Double-check your password in the connection string
- For Supabase: Reset your database password in Settings → Database
- For Neon: Check your connection string in the dashboard

### Error: "database does not exist"
- Make sure you created the database first
- Check the database name in your connection string matches

### Tables not showing up
- Make sure you ran the entire `database-schema.sql` file
- Check for any error messages when running the schema
- Some SQL editors require you to run statements one at a time

---

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

