# Fixing QUIC Protocol Errors in Sanity Studio

## The Error

You're seeing:
```
ERR_QUIC_PROTOCOL_ERROR.QUIC_TOO_MANY_RTOS
TypeError: network error
```

**What it means:**
- QUIC is a modern transport protocol (alternative to HTTP/2)
- Your browser is trying to use QUIC to connect to Sanity's API
- The connection is failing repeatedly (too many retransmissions)
- This is a **network-level issue**, not a code issue

## Root Causes

1. **Firewall/Network blocking QUIC** (most common)
2. **Browser QUIC implementation issues**
3. **Network instability**
4. **Corporate VPN/proxy blocking QUIC**

## Solutions (Try in Order)

### Solution 1: Disable QUIC in Chrome (Recommended)

Chrome uses QUIC by default. Disable it:

1. **Open Chrome**
2. **Go to:** `chrome://flags/`
3. **Search for:** `Experimental QUIC protocol`
4. **Set to:** `Disabled`
5. **Restart Chrome**
6. **Try Sanity Studio again**

**Alternative:** Search for `quic` in flags and disable all QUIC-related flags.

### Solution 2: Try Different Browser

QUIC support varies by browser:
- **Chrome/Edge:** Uses QUIC by default
- **Firefox:** Uses QUIC but less aggressively
- **Safari:** Limited QUIC support

**Try Firefox or Safari** - they may work better.

### Solution 3: Disable VPN/Firewall

If you're using:
- **Corporate VPN** → Try disconnecting
- **Firewall software** → Temporarily disable
- **Network proxy** → Bypass it

QUIC is often blocked by corporate networks.

### Solution 4: Check Network Connection

1. **Test your internet:**
   ```bash
   ping google.com
   ```

2. **Check packet loss:**
   - High packet loss can cause QUIC failures
   - Try a different network (mobile hotspot)

3. **Test Sanity API directly:**
   ```bash
   curl https://pyoyob4y.api.sanity.io/v2025-02-19/data/query/production
   ```

### Solution 5: Clear Browser Cache & Restart

1. **Hard refresh:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Clear cache:** Chrome Settings → Privacy → Clear browsing data
3. **Restart browser completely**
4. **Restart Sanity Studio:**
   ```bash
   # Stop the studio (Ctrl+C)
   npm run studio
   ```

### Solution 6: Use Sanity's Deployed Studio

Instead of running locally, use the deployed version:

1. **Deploy Studio:**
   ```bash
   npm run studio:deploy
   ```

2. **Access at:** `https://vendetta-roasting.sanity.studio`

The deployed version may have better network routing.

### Solution 7: Wait and Retry

Sometimes Sanity's CDN has temporary issues:
- Wait 10-15 minutes
- Try again
- Check [Sanity Status](https://status.sanity.io/)

## About the React Warning

The warning:
```
Warning: Function components cannot be given refs...
```

**This is harmless** - it's a warning from Sanity's internal components. It doesn't affect functionality. You can ignore it.

## Quick Test

To verify if it's a QUIC issue:

1. **Open Chrome DevTools** (F12)
2. **Go to Network tab**
3. **Look for requests to `api.sanity.io`**
4. **Check the Protocol column:**
   - If you see `h3` or `QUIC` → That's the problem
   - If you see `h2` or `http/1.1` → QUIC is disabled (good!)

## Most Likely Fix

**90% of the time, this is fixed by:**
1. ✅ Disabling QUIC in Chrome flags (`chrome://flags/`)
2. ✅ Trying Firefox instead
3. ✅ Disabling VPN/firewall

## If Nothing Works

### Check Sanity Project Status

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Check if project is active
3. Check API usage/limits
4. Verify project ID: `pyoyob4y`

### Contact Sanity Support

If it persists:
1. Go to [sanity.io/contact](https://www.sanity.io/contact)
2. Provide:
   - Project ID: `pyoyob4y`
   - Error: `ERR_QUIC_PROTOCOL_ERROR.QUIC_TOO_MANY_RTOS`
   - Browser and OS
   - Network setup (VPN, firewall, etc.)

## Expected Behavior After Fix

Once QUIC is disabled:
- ✅ No more `ERR_QUIC_PROTOCOL_ERROR` errors
- ✅ Network requests use HTTP/2 or HTTP/1.1
- ✅ Sanity Studio loads normally
- ✅ Image uploads work (if CDN issues are also resolved)

---

**TL;DR:** Go to `chrome://flags/`, search "QUIC", disable it, restart Chrome. That usually fixes it!

