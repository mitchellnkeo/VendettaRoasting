#!/usr/bin/env node

/**
 * Check and validate connection string format
 */

const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    return null;
  }
  
  const envFile = fs.readFileSync(envPath, 'utf8');
  const lines = envFile.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (key === 'DATABASE_URL') {
        return value;
      }
    }
  }
  return null;
}

const dbUrl = loadEnvFile();

if (!dbUrl) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('🔍 Analyzing your DATABASE_URL...\n');

// Parse the URL
try {
  const url = new URL(dbUrl);
  
  console.log('✅ URL format is valid\n');
  console.log('📋 Parsed components:');
  console.log(`   Protocol: ${url.protocol}`);
  console.log(`   Username: ${url.username}`);
  console.log(`   Password: ${url.password ? '***' + url.password.slice(-4) : 'not set'}`);
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432 (default)'}`);
  console.log(`   Database: ${url.pathname.slice(1) || 'postgres (default)'}\n`);
  
  // Check for common issues
  console.log('🔍 Checking for issues...\n');
  
  let issues = [];
  
  // Check for multiple @ symbols
  const atCount = (dbUrl.match(/@/g) || []).length;
  if (atCount > 1) {
    issues.push('⚠️  Multiple @ symbols detected - password may contain unencoded @');
  }
  
  // Check if password contains @ that should be encoded
  if (url.password && url.password.includes('@')) {
    issues.push('⚠️  Password contains @ - should be encoded as %40');
  }
  
  // Check hostname format
  if (!url.hostname.includes('supabase.co')) {
    issues.push('⚠️  Hostname does not contain "supabase.co" - verify it\'s correct');
  }
  
  // Check for common Supabase hostname patterns
  const supabasePattern = /^db\.[a-z0-9]+\.supabase\.co$/;
  if (!supabasePattern.test(url.hostname)) {
    issues.push('⚠️  Hostname format doesn\'t match typical Supabase pattern (db.xxxxx.supabase.co)');
  }
  
  if (issues.length === 0) {
    console.log('✅ No obvious issues found with the connection string format\n');
  } else {
    issues.forEach(issue => console.log(`   ${issue}`));
    console.log('');
  }
  
  console.log('💡 Next steps:');
  console.log('   1. Double-check the hostname in Supabase dashboard');
  console.log('   2. Make sure you copied the "URI" connection string (not Session mode)');
  console.log('   3. Try the Connection Pooling URL (port 6543) as an alternative');
  console.log('   4. Verify the project is in the correct region\n');
  
  console.log('📝 Your current hostname:');
  console.log(`   ${url.hostname}\n`);
  console.log('🔗 Expected format:');
  console.log('   db.xxxxx.supabase.co\n');
  
} catch (error) {
  console.error('❌ Invalid URL format:');
  console.error(`   ${error.message}\n`);
  console.log('💡 Your DATABASE_URL should look like:');
  console.log('   postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres\n');
}

