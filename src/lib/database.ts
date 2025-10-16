import { Pool } from 'pg';

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a connection pool
let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    pool = new Pool(dbConfig);
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  
  return pool;
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Close the pool (useful for testing or graceful shutdown)
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Helper function to execute queries
export const query = async (text: string, params?: any[]): Promise<any> => {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Helper function to get a client from the pool
export const getClient = async () => {
  const pool = getPool();
  return await pool.connect();
};

// Database health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
  try {
    const result = await query('SELECT NOW() as timestamp');
    return {
      status: 'healthy',
      timestamp: result.rows[0].timestamp,
      uptime: process.uptime()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
};