const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
);

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // Enable RLS
    await supabase.rpc('enable_rls_on_tables');
    
    // Create storage bucket for files
    const { error: bucketError } = await supabase.storage.createBucket('meeting-files', {
      public: true
    });
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();