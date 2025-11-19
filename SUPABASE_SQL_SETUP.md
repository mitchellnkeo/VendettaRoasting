# Setting Up Database Tables in Supabase

Since the connection pooling works, the easiest way to set up your tables is through Supabase's SQL Editor.

## Steps:

1. **Go to Supabase Dashboard:**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor:**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Schema:**
   - Open the file `database-schema.sql` from your project
   - Copy the **entire contents** of the file
   - Paste it into the SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

4. **Verify Tables Were Created:**
   - Click **Table Editor** in the left sidebar
   - You should see tables like:
     - `users`
     - `products`
     - `orders`
     - `order_items`
     - `categories`
     - etc.

## Alternative: Use the Fixed Script

If you prefer using the command line, I can fix the setup script to handle the SQL properly. But the SQL Editor method is the most reliable.

