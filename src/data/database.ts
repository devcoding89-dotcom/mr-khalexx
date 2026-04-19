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

// PHONES - Latest flagship and budget phones
export const phones: Product[] = [
  {
    id: 'phone-001',
    name: 'iPhone 15 Pro Max',
    description: '256GB - Natural Titanium. A17 Pro chip, 48MP camera system, titanium design.',
    price: 1199,
    originalPrice: 1299,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80',
    stock: 15,
    rating: 4.9,
    reviews: 2847,
    features: ['A17 Pro Chip', '256GB Storage', '48MP Camera', 'Titanium Design'],
    badge: 'Hot',
    isBestseller: true
  },
  {
    id: 'phone-002',
    name: 'iPhone 15 Pro',
    description: '128GB - Blue Titanium. Pro camera system, Action button, USB-C.',
    price: 999,
    originalPrice: 1099,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=500&q=80',
    stock: 23,
    rating: 4.8,
    reviews: 1923,
    features: ['A17 Pro Chip', '128GB Storage', 'Pro Camera', 'Action Button'],
    isNew: true
  },
  {
    id: 'phone-003',
    name: 'Samsung Galaxy S24 Ultra',
    description: '512GB - Titanium Gray. AI-powered, S Pen, 200MP camera, 5G.',
    price: 1299,
    originalPrice: 1399,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1610945265078-3858a0828671?w=500&q=80',
    stock: 18,
    rating: 4.8,
    reviews: 2156,
    features: ['Galaxy AI', '512GB Storage', '200MP Camera', 'S Pen Included'],
    badge: 'Trending'
  },
  {
    id: 'phone-004',
    name: 'Samsung Galaxy S24+',
    description: '256GB - Cobalt Violet. AI features, 50MP camera, all-day battery.',
    price: 999,
    originalPrice: 1099,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80',
    stock: 31,
    rating: 4.7,
    reviews: 1543,
    features: ['Galaxy AI', '256GB Storage', '50MP Camera', '45W Charging'],
    isNew: true
  },
  {
    id: 'phone-005',
    name: 'Google Pixel 8 Pro',
    description: '128GB - Obsidian. Best AI camera, 7 years updates, Magic Editor.',
    price: 899,
    originalPrice: 999,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
    stock: 27,
    rating: 4.7,
    reviews: 1876,
    features: ['Tensor G3', '128GB Storage', 'AI Camera', '7yr Updates'],
    badge: 'Value Pick'
  },
  {
    id: 'phone-006',
    name: 'OnePlus 12',
    description: '256GB - Flowy Emerald. Snapdragon 8 Gen 3, 100W charging, Hasselblad.',
    price: 799,
    originalPrice: 899,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500&q=80',
    stock: 42,
    rating: 4.6,
    reviews: 1234,
    features: ['Snapdragon 8 Gen 3', '256GB Storage', '100W Charging', 'Hasselblad Cam'],
    isNew: true
  },
  {
    id: 'phone-007',
    name: 'iPhone 14',
    description: '128GB - Midnight. A15 Bionic, advanced dual-camera, Ceramic Shield.',
    price: 699,
    originalPrice: 799,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&q=80',
    stock: 56,
    rating: 4.7,
    reviews: 3421,
    features: ['A15 Bionic', '128GB Storage', 'Dual Camera', 'Face ID'],
    badge: 'Best Seller'
  },
  {
    id: 'phone-008',
    name: 'Xiaomi 14 Ultra',
    description: '512GB - Black. Leica optics, Snapdragon 8 Gen 3, 90W charging.',
    price: 1099,
    originalPrice: 1199,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
    stock: 19,
    rating: 4.5,
    reviews: 876,
    features: ['Leica Camera', '512GB Storage', '90W Charging', 'Snapdragon 8 Gen 3'],
    isNew: true
  }
];

// CALL OF DUTY ACCOUNTS - Pre-leveled accounts with skins and camos
export const codAccounts: Product[] = [
  {
    id: 'cod-001',
    name: 'MW3 Prestige Master Account',
    description: 'Prestige 25, Level 1000. All weapons max level, Orion camo unlocked. 150+ skins.',
    price: 299,
    originalPrice: 399,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
    stock: 5,
    rating: 4.9,
    reviews: 127,
    features: ['Prestige 25', 'Orion Camo', '150+ Skins', 'All Weapons Max'],
    badge: 'Premium',
    isBestseller: true
  },
  {
    id: 'cod-002',
    name: 'Warzone 2.0 Meta Account',
    description: 'Prestige 15, All meta weapons unlocked. 50+ Blueprints, 10000+ Kills.',
    price: 179,
    originalPrice: 249,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80',
    stock: 8,
    rating: 4.8,
    reviews: 89,
    features: ['Prestige 15', 'Meta Loadouts', '50+ Blueprints', '10K+ Kills'],
    badge: 'Popular'
  },
  {
    id: 'cod-003',
    name: 'MW3 Starter Pack Account',
    description: 'Prestige 5, Level 200. 20+ Operator skins, Battle Pass completed.',
    price: 89,
    originalPrice: 129,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0a?w=500&q=80',
    stock: 12,
    rating: 4.6,
    reviews: 234,
    features: ['Prestige 5', 'Level 200', '20+ Skins', 'BP Completed'],
    isNew: true
  },
  {
    id: 'cod-004',
    name: 'Black Ops 6 Ready Account',
    description: 'Prestige 20 MW3, 50000 CP saved, All previous titles linked, Rare skins.',
    price: 449,
    originalPrice: 599,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=500&q=80',
    stock: 3,
    rating: 5.0,
    reviews: 45,
    features: ['Prestige 20', '50000 CP', 'Rare Skins', 'BO6 Ready'],
    badge: 'Limited',
    isNew: true
  },
  {
    id: 'cod-005',
    name: 'CDL Pro Account',
    description: 'All CDL skins, Championship skins, Pro player blueprints, 20000+ Kills.',
    price: 199,
    originalPrice: 279,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80',
    stock: 6,
    rating: 4.7,
    reviews: 67,
    features: ['All CDL Skins', 'Championship', 'Pro Blueprints', '20K+ Kills'],
    badge: 'Esports'
  },
  {
    id: 'cod-006',
    name: 'Zombies Master Account',
    description: 'All Easter eggs completed, Dark Aether camo, Wonder weapons unlocked.',
    price: 149,
    originalPrice: 199,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80',
    stock: 9,
    rating: 4.8,
    reviews: 156,
    features: ['All Easter Eggs', 'Dark Aether', 'Wonder Weapons', 'Max Level'],
    isNew: true
  },
  {
    id: 'cod-007',
    name: 'DMZ Extractor Account',
    description: 'All faction missions complete, Contraband stash full, 100M+ cash.',
    price: 119,
    originalPrice: 159,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
    stock: 7,
    rating: 4.5,
    reviews: 98,
    features: ['All Missions', 'Full Stash', '100M+ Cash', 'All Keys'],
    badge: 'DMZ'
  },
  {
    id: 'cod-008',
    name: 'Ultimate Veteran Account',
    description: 'MW2019 to MW3 progress, All battle passes, 500+ skins, 1000000+ Kills.',
    price: 599,
    originalPrice: 799,
    category: 'accounts',
    image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500&q=80',
    stock: 2,
    rating: 5.0,
    reviews: 23,
    features: ['All COD Games', 'All BPs', '500+ Skins', '1M+ Kills'],
    badge: 'Ultimate'
  }
];

// CALL OF DUTY POINTS (CP) - Direct top-up packages
export const codPoints: Product[] = [
  {
    id: 'cp-001',
    name: '1100 CP',
    description: '1100 Call of Duty Points. Instant delivery to your account. Global region.',
    price: 9.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    stock: 999,
    rating: 4.9,
    reviews: 3421,
    features: ['1100 CP', 'Instant Delivery', 'Global Region', '24/7 Support'],
    isNew: true
  },
  {
    id: 'cp-002',
    name: '2400 CP',
    description: '2400 Call of Duty Points. Best for Battle Pass + Tier skips.',
    price: 19.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500&q=80',
    stock: 999,
    rating: 4.9,
    reviews: 2856,
    features: ['2400 CP', 'Instant Delivery', 'Global Region', 'Best Value'],
    badge: 'Popular'
  },
  {
    id: 'cp-003',
    name: '5000 CP',
    description: '5000 Call of Duty Points. Perfect for bundles and operator packs.',
    price: 39.99,
    originalPrice: 44.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1612287230217-969b698cb8d1?w=500&q=80',
    stock: 999,
    rating: 4.8,
    reviews: 2134,
    features: ['5000 CP', 'Instant Delivery', 'Global Region', 'Bundle Ready'],
    isBestseller: true
  },
  {
    id: 'cp-004',
    name: '9500 CP',
    description: '9500 Call of Duty Points. Great for multiple bundles and seasons.',
    price: 74.99,
    originalPrice: 84.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
    stock: 999,
    rating: 4.8,
    reviews: 1567,
    features: ['9500 CP', 'Instant Delivery', 'Global Region', 'Multi-Season'],
    badge: 'Best Value'
  },
  {
    id: 'cp-005',
    name: '13000 CP',
    description: '13000 Call of Duty Points. The ultimate package for serious players.',
    price: 99.99,
    originalPrice: 119.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80',
    stock: 999,
    rating: 4.9,
    reviews: 987,
    features: ['13000 CP', 'Instant Delivery', 'Global Region', 'Ultimate Pack'],
    badge: 'Mega Deal'
  },
  {
    id: 'cp-006',
    name: '20000 CP',
    description: '20000 Call of Duty Points. Maximum value for collectors.',
    price: 149.99,
    originalPrice: 179.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=500&q=80',
    stock: 999,
    rating: 5.0,
    reviews: 543,
    features: ['20000 CP', 'Instant Delivery', 'Global Region', 'Collector Pack'],
    badge: 'Maximum'
  },
  {
    id: 'cp-007',
    name: 'Battle Pass + 20 Tiers',
    description: 'Full Battle Pass unlock + 20 Tier Skips. Instant activation.',
    price: 29.99,
    originalPrice: 34.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=500&q=80',
    stock: 999,
    rating: 4.7,
    reviews: 1876,
    features: ['Full BP', '20 Tiers', 'Instant Unlock', 'All Rewards'],
    isNew: true
  },
  {
    id: 'cp-008',
    name: 'Pro Pack Bundle',
    description: '5000 CP + Exclusive Pro Pack skin + Weapon Blueprint. Limited offer.',
    price: 49.99,
    originalPrice: 64.99,
    category: 'cp',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&q=80',
    stock: 150,
    rating: 4.9,
    reviews: 765,
    features: ['5000 CP', 'Pro Skin', 'Blueprint', 'Limited Edition'],
    badge: 'Limited'
  }
];

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
