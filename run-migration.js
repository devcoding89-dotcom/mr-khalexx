const { Client } = require('pg');
const fs = require('fs');

async function runMigration() {
  // You'll need to replace [YOUR-PASSWORD] with your actual database password
  const connectionString = 'postgresql://postgres:[YOUR-PASSWORD]@db.luxoncvjroafxvsylhjh.supabase.co:5432/postgres';

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