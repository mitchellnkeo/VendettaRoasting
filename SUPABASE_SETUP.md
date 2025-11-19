# Supabase Connection String Setup

## How to Get the Correct Connection String

1. **Go to your Supabase Dashboard:**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Get the Connection String:**
   - Go to **Settings** (gear icon in sidebar)
   - Click **Database**
   - Scroll down to **Connection string** section
   - Select **URI** tab (not "Session mode" or "Transaction")
   - Copy the connection string

3. **Important - Password Encoding:**
   - If your password contains special characters, they MUST be URL-encoded:
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `=` → `%3D`
     - `/` → `%2F`
     - `?` → `%3F`
     - ` ` (space) → `%20`

4. **Your Password:**
   - Original: `Vendetta1qazxsw2!QAZXSW@`
   - Encoded: `Vendetta1qazxsw2!QAZXSW%40`
   - (The `@` becomes `%40`)

5. **Final Connection String Format:**
   ```
   postgresql://postgres:Vendetta1qazxsw2!QAZXSW%40@db.xxxxx.supabase.co:5432/postgres
   ```

## Troubleshooting

### If hostname doesn't resolve (ENOTFOUND):

1. **Check if project is active:**
   - Go to your Supabase dashboard
   - Make sure the project status shows "Active" (not "Paused")
   - If paused, click "Resume" or "Restore"

2. **Verify the hostname:**
   - In Supabase dashboard → Settings → Database
   - Check the "Host" field
   - It should be something like: `db.xxxxx.supabase.co`
   - Make sure you copied it correctly (no typos)

3. **Check project region:**
   - Some regions might have different hostname formats
   - Verify you're using the correct connection string for your region

4. **Try the Connection Pooling URL:**
   - In Supabase → Settings → Database
   - Look for "Connection pooling" section
   - Try using the "Transaction" mode connection string instead
   - It uses port `6543` instead of `5432`

## Quick Test

After updating your `.env.local` with the correctly encoded password, run:

```bash
npm run db:test
```

This will test your connection and show you what's wrong if it fails.

