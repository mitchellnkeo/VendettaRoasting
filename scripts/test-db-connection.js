#!/usr/bin/env node

/**
 * Quick database connection test
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (fs.existsSync(envPath)) {
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
        
        process.env[key] = value;
      }
    }
  }
}

async function testConnection() {
  loadEnvFile();
  
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env.local');
    return;
  }

  console.log('🔍 Testing database connection...\n');
  console.log('📋 Connection details:');
  
  // Parse and display connection info (without showing password)
  try {
    const url = new URL(databaseUrl);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port || '5432'}`);
    console.log(`   Database: ${url.pathname.slice(1)}`);
    console.log(`   User: ${url.username}`);
    console.log(`   Password: ${url.password ? '***' + url.password.slice(-3) : 'not set'}`);
    
    // Check for multiple @ symbols
    const atCount = (databaseUrl.match(/@/g) || []).length;
    if (atCount > 1) {
      console.log('\n⚠️  WARNING: Multiple @ symbols detected!');
      console.log('   Your password likely contains an @ that needs to be URL-encoded.');
      console.log('   Change @ to %40 in your password.\n');
    }
  } catch (e) {
    console.log('   (Could not parse URL)');
  }

  console.log('\n🔌 Attempting connection...\n');

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Connection successful!');
    console.log(`   Current time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}\n`);
    
    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`📊 Tables in database: ${tablesResult.rows[0].count}`);
    
    if (parseInt(tablesResult.rows[0].count) === 0) {
      console.log('   ⚠️  No tables found. Run "npm run db:setup" to create them.\n');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:\n');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check if your Supabase project is active');
      console.error('   2. Verify the hostname in your Supabase dashboard');
      console.error('   3. Make sure your internet connection is working');
      console.error('   4. Try accessing your Supabase project in the browser\n');
    } else if (error.code === '28P01') {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check your password is correct');
      console.error('   2. Make sure @ symbols in password are encoded as %40');
      console.error('   3. Reset your database password in Supabase if needed\n');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection().catch(console.error);

