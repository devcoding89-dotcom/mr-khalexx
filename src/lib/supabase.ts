import { createClient } from '@supabase/supabase-js';
import { localProducts, getLocalProductsByCategory, getLocalProductById } from '@/data/localDatabase';
import type { Product, Order, TrackingUpdate } from '@/types/database';

// Supabase configuration - UPDATE THESE WITH YOUR ACTUAL CREDENTIALS
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = !SUPABASE_URL.includes('your-project') && !SUPABASE_ANON_KEY.includes('your-anon');

export const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Log configuration status
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Configuration:');
  console.log('✅ Configured:', isSupabaseConfigured);
  console.log('📍 URL:', SUPABASE_URL.substring(0, 30) + '...');
  console.log('🔑 Key length:', SUPABASE_ANON_KEY.length + ' chars');
}

// Admin credentials (in production, use proper auth)
const ADMIN_EMAIL = 'admin@khalexhub.com';
const ADMIN_PASSWORD = 'admin123';

// Local storage keys
const PRODUCTS_KEY = 'khalex_products';
const ORDERS_KEY = 'khalex_orders';
const TRACKING_KEY = 'khalex_tracking';

// ==================== LOCAL STORAGE HELPERS ====================

const getLocalProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default products
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(localProducts));
  return localProducts;
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

const getLocalOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

const getLocalTracking = (): TrackingUpdate[] => {
  const stored = localStorage.getItem(TRACKING_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalTracking = (tracking: TrackingUpdate[]) => {
  localStorage.setItem(TRACKING_KEY, JSON.stringify(tracking));
};

// ==================== PRODUCTS ====================

export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching products from Supabase:', error);
        console.log('⚠️ Falling back to localStorage');
        return getLocalProducts();
      }

      console.log(`✅ Fetched ${data?.length || 0} products from Supabase`);
      return data || getLocalProducts();
    } catch (err) {
      console.error('❌ Exception fetching products:', err);
      return getLocalProducts();
    }
  }

  console.log('⚠️ Supabase not configured, using localStorage');
  return getLocalProducts();
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      return getLocalProductsByCategory(category);
    }

    return data || getLocalProductsByCategory(category);
  }

  return getLocalProductsByCategory(category);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return getLocalProductById(id) || null;
    }

    return data;
  }

  return getLocalProductById(id) || null;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
  // Generate a simple UUID-like ID (or let Supabase generate it)
  const newProduct: Omit<Product, 'created_at'> = {
    ...product,
    id: crypto.randomUUID ? crypto.randomUUID() : 'prod-' + Date.now().toString(36),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (error) {
        console.error('Error creating product in Supabase:', error);
        console.error('Product data:', newProduct);
        // Fall through to local storage
      } else if (data) {
        return data;
      }
    } catch (err) {
      console.error('Exception creating product in Supabase:', err);
    }
  }

  // Local storage fallback
  const products = getLocalProducts();
  products.unshift({
    ...newProduct,
    created_at: new Date().toISOString(),
  });
  saveLocalProducts(products);
  return {
    ...newProduct,
    created_at: new Date().toISOString(),
  };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product in Supabase:', error);
    } else {
      return data;
    }
  }

  // Local storage fallback
  const products = getLocalProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveLocalProducts(products);
    return products[index];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product from Supabase:', error);
    } else {
      return true;
    }
  }

  // Local storage fallback
  const products = getLocalProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length !== products.length) {
    saveLocalProducts(filtered);
    return true;
  }
  return false;
}

// ==================== ORDERS ====================

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
  const newOrder: Order = {
    ...order,
    id: 'order-' + Date.now().toString(36),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error('Error creating order in Supabase:', error);
    } else {
      return data;
    }
  }

  // Local storage fallback
  const orders = getLocalOrders();
  orders.unshift(newOrder);
  saveLocalOrders(orders);
  return newOrder;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order from Supabase:', error);
    } else {
      return data;
    }
  }

  // Local storage fallback
  const orders = getLocalOrders();
  return orders.find(o => o.order_id === orderId) || null;
}

export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders from Supabase:', error);
    } else {
      return data || [];
    }
  }

  return getLocalOrders();
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating order status in Supabase:', error);
    } else {
      return true;
    }
  }

  // Local storage fallback
  const orders = getLocalOrders();
  const order = orders.find(o => o.order_id === orderId);
  if (order) {
    order.status = status;
    saveLocalOrders(orders);
    return true;
  }
  return false;
}

// ==================== TRACKING ====================

export async function addTrackingUpdate(update: Omit<TrackingUpdate, 'id' | 'created_at'>): Promise<TrackingUpdate | null> {
  const newUpdate: TrackingUpdate = {
    ...update,
    id: 'track-' + Date.now().toString(36),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tracking_updates')
      .insert([newUpdate])
      .select()
      .single();

    if (error) {
      console.error('Error adding tracking update in Supabase:', error);
    } else {
      return data;
    }
  }

  // Local storage fallback
  const tracking = getLocalTracking();
  tracking.push(newUpdate);
  saveLocalTracking(tracking);
  return newUpdate;
}

export async function getTrackingUpdates(orderId: string): Promise<TrackingUpdate[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tracking_updates')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tracking updates from Supabase:', error);
    } else {
      return data || [];
    }
  }

  // Local storage fallback
  const tracking = getLocalTracking();
  return tracking.filter(t => t.order_id === orderId);
}

// ==================== ADMIN AUTH ====================

export async function adminLogin(email: string, password: string): Promise<boolean> {
  // Simple admin check (in production, use Supabase Auth)
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

// ==================== UTILITY ====================

export function generateOrderId(): string {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

export function generateTrackingId(): string {
  return 'TRK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// ==================== FEATURED PRODUCTS ====================

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(product => product.is_bestseller || product.is_new).slice(0, 6);
}

// ==================== DIAGNOSTICS ====================

export async function testSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('❌ Supabase is not configured');
    return false;
  }

  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test 1: Try to select from products table
    const { data, error } = await supabase
      .from('products')
      .select('count', { count: 'exact' });

    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Products in database:', data?.length || 0);
    return true;
  } catch (err) {
    console.error('❌ Exception testing Supabase:', err);
    return false;
  }
}

// Run diagnostics on page load
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testSupabaseConnection;
  (window as any).showSupabaseConfig = () => {
    console.log('Supabase Config:', {
      url: SUPABASE_URL,
      keyLength: SUPABASE_ANON_KEY.length,
      isConfigured: isSupabaseConfigured,
    });
  };
}
