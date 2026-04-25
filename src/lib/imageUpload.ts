import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB max
const QUALITY = 0.7; // 70% quality for compression

/**
 * Compress an image and return as blob
 */
async function compressImage(base64String: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions if image is too large
      const maxDim = 2000;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        QUALITY
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64String;
  });
}

/**
 * Upload image to Supabase Storage and return public URL
 */
export async function uploadProductImage(base64String: string, productName: string): Promise<string | null> {
  if (!supabase) {
    console.error('❌ Supabase not configured');
    return null;
  }

  try {
    console.log('📸 Compressing image...');
    const compressedBlob = await compressImage(base64String);

    if (compressedBlob.size > MAX_FILE_SIZE) {
      throw new Error(
        `Image too large: ${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB (max 2MB)`
      );
    }

    console.log(`✅ Compressed image: ${(compressedBlob.size / 1024).toFixed(2)}KB`);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = productName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${sanitizedName}-${timestamp}.jpg`;

    console.log(`📤 Uploading to Supabase Storage: ${filename}`);

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, compressedBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    if (!publicData?.publicUrl) {
      throw new Error('Failed to get public URL for image');
    }

    console.log(`✅ Image uploaded successfully: ${publicData.publicUrl}`);
    return publicData.publicUrl;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    return null;
  }
}

/**
 * Delete an image from storage
 */
export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  if (!supabase || !imageUrl) {
    return false;
  }

  try {
    // Extract filename from URL
    const url = new URL(imageUrl);
    const filename = url.pathname.split('/').pop();

    if (!filename) {
      return false;
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filename]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}
