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

async function setupDatabase() {
  // Get DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable is not set.');
    console.log('\nPlease set it in your .env.local file:');
    console.log('DATABASE_URL=postgresql://user:password@host:port/database\n');
    process.exit(1);
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

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        await pool.query(statement);
        successCount++;
        // Show progress for CREATE TABLE statements
        const match = statement.match(/CREATE TABLE\s+(\w+)/i);
        if (match) {
          console.log(`  ✅ Created table: ${match[1]}`);
        }
      } catch (error) {
        // Ignore "already exists" errors
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️  Table already exists (skipping)`);
        } else {
          console.error(`  ❌ Error: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n✨ Setup complete!`);
    console.log(`   ✅ Successful: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   ❌ Errors: ${errorCount}`);
    }

    // Verify tables were created
    console.log('\n📊 Verifying tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log(`\n✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found. Please check the schema file.');
    }

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

