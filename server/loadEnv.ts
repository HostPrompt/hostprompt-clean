import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('[DEBUG] Loading env from:', path.resolve(__dirname, '../.env'));
console.log('[DEBUG] DATABASE_URL:', process.env.DATABASE_URL);