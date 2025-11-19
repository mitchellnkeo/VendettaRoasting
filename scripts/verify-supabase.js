#!/usr/bin/env node

/**
 * Verify Supabase Connection String
 * 
 * This script helps you verify your Supabase connection details
 */

console.log('🔍 Supabase Connection Verification\n');
console.log('Please follow these steps:\n');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Click Settings (gear icon) → Database');
console.log('4. Scroll to "Connection string" section\n');
console.log('5. Check the following:\n');
console.log('   ✅ Is your project status "Active"? (not "Paused")');
console.log('   ✅ What is the exact hostname shown?');
console.log('   ✅ Is it the same as: db.bzcfnegunamcfhfqpgwn.supabase.co?\n');
console.log('6. Copy the connection string from the "URI" tab');
console.log('7. Make sure to URL-encode special characters in password:\n');
console.log('   - @ → %40');
console.log('   - # → %23');
console.log('   - % → %25');
console.log('   - & → %26\n');
console.log('8. Alternative: Try Connection Pooling');
console.log('   - In the same Database settings page');
console.log('   - Look for "Connection pooling" section');
console.log('   - Try the "Transaction" mode connection string');
console.log('   - It uses port 6543 instead of 5432\n');
console.log('Common Issues:\n');
console.log('❌ Project is paused → Resume it in dashboard');
console.log('❌ Wrong hostname → Copy it fresh from Supabase');
console.log('❌ Password not encoded → Encode @ as %40');
console.log('❌ Using wrong connection string → Use URI, not Session mode\n');

