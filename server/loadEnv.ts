import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('[DEBUG] .env loaded locally');
  console.log('[DEBUG] DATABASE_URL:', process.env.DATABASE_URL);
} else {
  console.log('[DEBUG] Skipping dotenv load — production mode (Vercel)');
}