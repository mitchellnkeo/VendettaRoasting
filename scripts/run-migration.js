#!/usr/bin/env node

/**
 * Database Migration Runner
 * 
 * This script runs database migrations from the migrations/ directory.
 * 
 * Usage:
 *   node scripts/run-migration.js migrations/add-anonymous-reviews.sql
 *   npm run db:migrate migrations/add-anonymous-reviews.sql
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

async function runMigration() {
  // Load .env.local if it exists
  loadEnvFile();
  
  // Get migration file from command line argument
  const migrationFile = process.argv[2];
  
  if (!migrationFile) {
    console.error('❌ Error: Migration file path is required.');
    console.log('\nUsage:');
    console.log('  node scripts/run-migration.js migrations/add-anonymous-reviews.sql');
    console.log('  npm run db:migrate migrations/add-anonymous-reviews.sql\n');
    process.exit(1);
  }
  
  // Get DATABASE_URL from environment
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable is not set.');
    console.log('\nPlease set it in your .env.local file:');
    console.log('DATABASE_URL=postgresql://user:password@host:port/database\n');
    process.exit(1);
  }

  // Resolve migration file path
  const migrationPath = path.isAbsolute(migrationFile)
    ? migrationFile
    : path.join(__dirname, '..', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Error: Migration file not found at ${migrationPath}`);
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

    // Read migration file
    console.log(`📄 Reading migration file: ${migrationFile}`);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    if (!migrationSQL.trim()) {
      console.error('❌ Error: Migration file is empty.');
      process.exit(1);
    }

    console.log('🚀 Running migration...\n');

    // Execute the migration
    try {
      await pool.query(migrationSQL);
      console.log('✅ Migration executed successfully!\n');
      
      // Verify the changes
      console.log('🔍 Verifying migration...');
      
      // Check if reviewer_name column exists
      const checkColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'reviews'
        AND column_name IN ('reviewer_name', 'reviewer_email', 'sanity_product_id', 'user_id')
        ORDER BY column_name
      `);
      
      if (checkColumns.rows.length > 0) {
        console.log('\n📊 Review table columns:');
        checkColumns.rows.forEach(row => {
          const nullable = row.is_nullable === 'YES' ? '(nullable)' : '(required)';
          console.log(`   ✅ ${row.column_name} - ${row.data_type} ${nullable}`);
        });
      }
      
      // Check indexes
      const checkIndexes = await pool.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'reviews'
        AND indexname LIKE 'idx_reviews%'
        ORDER BY indexname
      `);
      
      if (checkIndexes.rows.length > 0) {
        console.log('\n📊 Review table indexes:');
        checkIndexes.rows.forEach(row => {
          console.log(`   ✅ ${row.indexname}`);
        });
      }
      
      console.log('\n✨ Migration complete!');
      console.log('\n💡 Next steps:');
      console.log('   1. Test the review system on a product page');
      console.log('   2. Submit a test review');
      console.log('   3. Check /admin/reviews to approve it\n');

    } catch (error) {
      console.error(`❌ Error executing migration: ${error.message}\n`);
      
      // Provide helpful error messages
      if (error.message.includes('already exists')) {
        console.log('⚠️  Some columns/indexes already exist. This is okay - migration may have already run.');
        console.log('   The migration uses IF NOT EXISTS, so it should be safe to run again.\n');
      } else if (error.message.includes('does not exist')) {
        console.log('💡 Tip: Make sure the reviews table exists first.');
        console.log('   Run: npm run db:setup\n');
      } else {
        console.log('💡 Tip: You can also run this migration manually:');
        console.log('   1. Go to your database dashboard (Supabase/Neon/etc.)');
        console.log('   2. Open SQL Editor');
        console.log('   3. Copy the SQL from migrations/add-anonymous-reviews.sql');
        console.log('   4. Paste and run it\n');
      }
      
      throw error;
    }

  } catch (error) {
    console.error('\n❌ Migration failed:');
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

// Run the migration
runMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

