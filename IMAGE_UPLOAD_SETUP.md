# Image Upload Setup - Required Before Using Add Product

## Problem Fixed

The product add feature was failing because **base64 encoded images exceed Supabase's payload limits**. Images are now uploaded to Supabase Storage instead.

## Required Setup: Create Storage Bucket

You MUST create a storage bucket before the product add feature will work.

### Option 1: Quick Setup via Supabase Dashboard ⚡ (RECOMMENDED)

1. Go to: https://app.supabase.com/project/luxoncvjroafxvsylhjh/storage/buckets
2. Click the **"New bucket"** button
3. Enter bucket name: `product-images`
4. **Toggle "Public bucket" ON** (this is important!)
5. Click **"Create"**

That's it! Your bucket is ready.

### Option 2: Automated Setup via SQL

If you have SQL Editor access:

1. Go to: https://app.supabase.com/project/luxoncvjroafxvsylhjh/sql/new
2. Copy and paste this SQL:

```sql
-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
```

3. Click **Run**

## How It Works Now

1. **Admin uploads image** → Image is compressed to max 2000px and 70% quality
2. **Image uploaded to Storage** → Saved in `product-images` bucket
3. **Public URL stored in DB** → Only the URL is saved, not the raw image data
4. **Product created** → With the image URL reference

## Benefits

✅ **Faster uploads** - Smaller payloads (2MB max vs 5-20MB base64)
✅ **Better performance** - CDN-served images at edge locations  
✅ **Automatic compression** - Images optimized automatically
✅ **Storage managed** - No database bloat from huge image files

## Troubleshooting

**Error: "Failed to upload image"**
- Check if the `product-images` bucket exists
- Verify it's set to PUBLIC
- Check browser console for details

**Error: "Image too large"**
- Images are compressed automatically but there's a 2MB limit after compression
- Use smaller/simpler images

**"Supabase not configured"**
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
