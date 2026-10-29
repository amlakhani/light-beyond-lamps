import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('Connect Neon and set DATABASE_URL before running db:migrate.');
const sql = neon(process.env.DATABASE_URL);
try {
  await sql.query(await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8'));
  console.log('Sankalp schema is ready. Existing records were preserved.');
} catch {
  console.error('Schema setup failed. Check the database connection and permissions.');
  process.exitCode = 1;
}
