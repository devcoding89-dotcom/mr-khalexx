-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL CHECK (category IN ('phones', 'accounts', 'cp')),
  image TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  badge TEXT,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  tracking_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  whatsapp_number TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracking updates table
CREATE TABLE IF NOT EXISTS tracking_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for tracking updates
ALTER TABLE tracking_updates
ADD CONSTRAINT fk_tracking_order
FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read tracking" ON tracking_updates FOR SELECT USING (true);

-- Create policies for admin write access (you can modify these based on your auth setup)
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tracking" ON tracking_updates FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample products (optional - remove if you want to start fresh)
INSERT INTO products (name, description, price, category, image, stock, rating, reviews, features, is_new, is_bestseller) VALUES
('iPhone 15 Pro Max', 'Latest iPhone with titanium design and A17 Pro chip', 1599.99, 'phones', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80', 10, 4.8, 245, ARRAY['A17 Pro Chip', 'Titanium Design', 'Pro Camera System', 'Action Button'], true, true),
('Samsung Galaxy S24 Ultra', 'Premium Android flagship with S Pen', 1299.99, 'phones', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80', 8, 4.7, 189, ARRAY['S Pen', '200MP Camera', 'Snapdragon 8 Gen 3', '120Hz Display'], true, false),
('iPhone 14 Pro', 'Powerful iPhone with Dynamic Island', 1099.99, 'phones', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80', 15, 4.6, 312, ARRAY['A16 Bionic', '48MP Camera', 'Dynamic Island', 'Always-On Display'], false, true),
('Call of Duty Mobile Account', 'High-level COD Mobile account with rare skins', 49.99, 'accounts', 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=500&q=80', 25, 4.5, 89, ARRAY['Level 50+', 'Rare Skins', 'CP Points', 'Elite Pass'], false, false),
('Free Fire Max Account', 'Premium Free Fire account with diamonds', 29.99, 'accounts', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80', 30, 4.3, 156, ARRAY['Diamonds', 'Elite Pass', 'Rare Bundles', 'High Level'], false, false),
('CP Points Bundle', '1000 CP Points for Call of Duty Mobile', 9.99, 'cp', 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=500&q=80', 50, 4.4, 78, ARRAY['Instant Delivery', 'Official Points', 'No Expiry'], false, false)
ON CONFLICT (id) DO NOTHING;