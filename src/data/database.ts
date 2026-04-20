// Khalex Hub - Product Database
// Real products with actual market data

export type Category = 'phones' | 'accounts' | 'cp';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

// PHONES - Empty by default, add through admin panel
export const phones: Product[] = [];

// CALL OF DUTY ACCOUNTS - Empty by default, add through admin panel
export const codAccounts: Product[] = [];

// CALL OF DUTY POINTS (CP) - Empty by default, add through admin panel
export const codPoints: Product[] = [];

// All products combined
export const allProducts: Product[] = [...phones, ...codAccounts, ...codPoints];

// Get products by category
export const getProductsByCategory = (category: Category): Product[] => {
  return allProducts.filter(product => product.category === category);
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return allProducts.filter(product => product.isBestseller || product.isNew).slice(0, 6);
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return allProducts.find(product => product.id === id);
};

// Search products
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
};
