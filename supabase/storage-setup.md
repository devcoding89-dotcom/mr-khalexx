# Supabase Storage Setup Script

This script sets up the required storage buckets for the Khalex Hub application.

## Manual Setup (via Supabase Dashboard)

1. Go to https://app.supabase.com/project/luxoncvjroafxvsylhjh/storage/buckets
2. Click "Create a new bucket"
3. Name it: `product-images`
4. Make it PUBLIC (toggle "Public bucket" to ON)
5. Click "Create bucket"

## Bucket Policies

Once created, add the following policies:

### Policy 1: Allow public read
- SELECT allowed for authenticated users and anon
- Target roles: authenticated, anon
- Using expression: `true`

### Policy 2: Allow authenticated insert
- INSERT allowed for authenticated users
- Target roles: authenticated
- With check expression: `true`

### Policy 3: Allow authenticated delete
- DELETE allowed for authenticated users
- Target roles: authenticated
- Using expression: `true`

## Automated Setup (using SQL)

If you have access to the SQL Editor in Supabase:

```sql
-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated upload
CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated delete
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```
