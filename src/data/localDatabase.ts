import type { Product } from '@/types/database';

// Local fallback data - Start with empty array, add products through admin panel
export const localProducts: Product[] = [
  // Empty array - products will be added through admin panel
];

// Get products by category
export const getLocalProductsByCategory = (category: string): Product[] => {
  return localProducts.filter(product => product.category === category);
};

// Get featured products
export const getLocalFeaturedProducts = (): Product[] => {
  return localProducts.filter(product => product.is_bestseller || product.is_new).slice(0, 6);
};

// Get product by ID
export const getLocalProductById = (id: string): Product | undefined => {
  return localProducts.find(product => product.id === id);
};
