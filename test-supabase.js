
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing env variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function insertTestProduct() {
  const testProduct = {
    name: 'Test iPhone 15',
    description: 'A test product to verify Supabase connection',
    price: 999.99,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc',
    stock: 10,
    is_new: true
  };

  console.log('Inserting test product...');
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select();

    if (error) {
      console.error('Error inserting product:', error);
    } else {
      console.log('✅ Product inserted successfully:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

insertTestProduct();
