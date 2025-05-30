import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';
import { Pool } from 'pg'; // ✅ standard pg client
import { drizzle } from 'drizzle-orm/node-postgres'; // ✅ correct adapter for pg
import * as schema from '@shared/schema';

// Load environment variables
dotenv.config();

// Debug: log DATABASE_URL from process.env
console.log('[DEBUG] Raw DATABASE_URL from .env:', JSON.stringify(process.env.DATABASE_URL));

// Optional: log entire .env content (remove if no longer needed)
try {
  const rawEnv = readFileSync(new URL('../.env', import.meta.url), 'utf-8');
  console.log('Raw env:', rawEnv);
} catch (err) {
  console.warn('Could not read .env file directly:', err);
}

// Validate env var
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

// ✅ Create pg connection pool with SSL enabled for Supabase
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required by Supabase
  },
});

// Optional: log pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

// ✅ Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// ✅ Function to test DB connection
export async function testDatabaseConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  } finally {
    if (client) client.release();
  }
}
