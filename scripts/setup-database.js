#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script helps you set up your database by running the schema.
 * 
 * Usage:
 *   node scripts/setup-database.js
 * 
 * Or with a custom DATABASE_URL:
 *   DATABASE_URL=your-url node scripts/setup-database.js
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
      // Skip comments and empty lines
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;
      
      const match = trimmedLine.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        process.env[key] = value;
      }
    }
  }
}

async function setupDatabase() {
  // Load .env.local if it exists
  loadEnvFile();
  
  // Get DATABASE_URL from environment
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable is not set.');
    console.log('\nPlease set it in your .env.local file:');
    console.log('DATABASE_URL=postgresql://user:password@host:port/database\n');
    process.exit(1);
  }

  // Fix common URL encoding issues
  // If password contains @, it needs to be URL encoded as %40
  // Check if there are multiple @ symbols (indicates unencoded @ in password)
  const atCount = (databaseUrl.match(/@/g) || []).length;
  if (atCount > 1) {
    console.log('⚠️  Warning: Your DATABASE_URL contains multiple @ symbols.');
    console.log('   This usually means your password contains an @ that needs to be URL-encoded.');
    console.log('   Please encode @ as %40 in your password.\n');
    console.log('   Example: If password is "mypass@123", use "mypass%40123"\n');
  }

  console.log('📦 Connecting to database...');
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') || databaseUrl.includes('neon') 
      ? { rejectUnauthorized: false } 
      : false,
  });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database successfully!\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Error: Schema file not found at ${schemaPath}`);
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Reading database schema...');
    console.log('🚀 Running schema...\n');

    // Execute the entire schema as one transaction
    // This is more reliable than splitting by semicolons
    console.log('🚀 Executing schema...\n');

    try {
      // Execute the entire schema file
      await pool.query(schema);
      console.log('✅ Schema executed successfully!\n');
      
      // List created tables
      const tablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      
      if (tablesResult.rows.length > 0) {
        console.log(`📊 Created ${tablesResult.rows.length} tables:`);
        tablesResult.rows.forEach(row => {
          console.log(`   ✅ ${row.table_name}`);
        });
      }
    } catch (error) {
      // If it's a "relation already exists" error, that's okay
      if (error.message.includes('already exists')) {
        console.log('⚠️  Some tables already exist. Continuing...\n');
        
        // Still list what tables exist
        const tablesResult = await pool.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `);
        
        if (tablesResult.rows.length > 0) {
          console.log(`📊 Found ${tablesResult.rows.length} tables:`);
          tablesResult.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
          });
        }
      } else {
        console.error(`❌ Error executing schema: ${error.message}\n`);
        console.log('💡 Tip: Try running the schema through Supabase SQL Editor instead.');
        console.log('   Go to: Dashboard → SQL Editor → New Query → Paste schema → Run\n');
        throw error;
      }
    }

    console.log(`\n✨ Setup complete!`);

  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Tip: Check your DATABASE_URL - the hostname might be incorrect.');
    } else if (error.code === '28P01') {
      console.error('\n💡 Tip: Check your database password in the DATABASE_URL.');
    } else if (error.code === '3D000') {
      console.error('\n💡 Tip: The database does not exist. Create it first.');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

