import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// For WebSocket support in serverless environments
neonConfig.webSocketConstructor = ws;

// Enhanced error handling for database connection
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with better error handling
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of clients the pool should contain
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait before timing out when connecting a new client
});

// Log connection events for monitoring
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1); // Recommended by pg docs to handle critical connection errors
});

// Initialize Drizzle ORM with the pool
export const db = drizzle({ client: pool, schema });

// Function to test database connection
export async function testDatabaseConnection() {
  let client;
  try {
    // Acquire a client from the pool
    client = await pool.connect();
    
    // Test with a simple query
    const result = await client.query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  } finally {
    // Release client back to the pool
    if (client) client.release();
  }
}