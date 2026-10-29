import { neon } from '@neondatabase/serverless';
import { createStore } from './store';
export function getStore() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  const sql = neon(url);
  return createStore(async (text, params) => await sql.query(text, params) as Record<string, unknown>[]);
}
