import { Client } from 'pg';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  // Database connection string with URL-encoded password
  // The @ symbol in password needs to be encoded as %40
  const connectionString = 'postgresql://postgres:CYBER%20AK890@db.luxoncvjroafxvsylhjh.supabase.co:5432/postgres';

  const client = new Client({ connectionString });

  try {
    console.log('Connecting to Supabase database...');
    await client.connect();

    console.log('Reading migration file...');
    const migrationSQL = fs.readFileSync('./supabase/migrations/20240101000000_initial_schema.sql', 'utf8');

    console.log('Running migration...');
    await client.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('Your Khalex Hub database is now set up with:');
    console.log('- Products table');
    console.log('- Orders table');
    console.log('- Tracking updates table');
    console.log('- Sample data inserted');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\nMake sure to:');
    console.log('1. Replace [YOUR-PASSWORD] with your actual Supabase database password');
    console.log('2. Check your database password in Supabase Dashboard > Settings > Database');
  } finally {
    await client.end();
  }
}

runMigration();