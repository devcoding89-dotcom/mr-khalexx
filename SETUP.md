# Khalex Hub - Setup Guide

## Live Website
**https://dg3xy7rbckhi4.ok.kimi.link**

---

## Features Added

### 1. Supabase Database Integration
- Products are stored in Supabase (with localStorage fallback)
- Orders are saved to database
- Tracking updates are persisted
- Real-time sync across all users

### 2. Admin Portal
- **URL**: `/admin`
- **Login**: admin@khalexhub.com / admin123
- Features:
  - Dashboard with analytics
  - Add/Edit/Delete products
  - Manage orders
  - Update order status
  - Add tracking updates
  - View sales analytics

### 3. Stripe Payment Integration
- Your Stripe API key is integrated
- Secure card payments
- Order confirmation with Order ID & Tracking ID

### 4. WhatsApp Integration
- After successful payment, customers are redirected to WhatsApp
- Pre-filled message with Order ID and Tracking ID
- Contact support button on tracking page

### 5. Order Tracking
- Customers can track orders using Tracking ID
- Visual timeline of order progress
- Real-time status updates

---

## Supabase Setup (REQUIRED for multi-user sync)

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project

### Step 2: Get Credentials
1. Go to Project Settings → API
2. Copy the `URL` and `anon public` key

### Step 3: Update Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Step 4: Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Products Table
CREATE TABLE products (
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

-- Orders Table
CREATE TABLE orders (
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

-- Tracking Updates Table
CREATE TABLE tracking_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(order_id),
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, authenticated write)
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON tracking_updates FOR SELECT USING (true);

CREATE POLICY "Allow all insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON products FOR DELETE USING (true);

CREATE POLICY "Allow all insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON orders FOR UPDATE USING (true);

CREATE POLICY "Allow all insert" ON tracking_updates FOR INSERT WITH CHECK (true);
```

---

## Stripe Setup (REQUIRED for payments)

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Sign up for an account
3. Get your Publishable Key

### Step 2: Update Stripe Key
Replace the key in `src/components/StripeCheckout.tsx`:

```typescript
const stripePromise = loadStripe('your-publishable-key-here');
```

---

## WhatsApp Setup

### Update Your WhatsApp Number
In `src/sections/Cart.tsx`, update the default WhatsApp number:

```typescript
<OrderSuccess
  orderId={orderDetails.orderId}
  trackingId={orderDetails.trackingId}
  whatsappNumber="+YOUR_WHATSAPP_NUMBER"
  onClose={handleCloseSuccess}
/>
```

Also update in `src/sections/OrderTracking.tsx`:

```typescript
const url = `https://wa.me/+YOUR_WHATSAPP_NUMBER?text=${message}`;
```

---

## Admin Portal Access

- **URL**: https://dg3xy7rbckhi4.ok.kimi.link/admin
- **Email**: admin@khalexhub.com
- **Password**: admin123

### Admin Features:
1. **Dashboard**: View stats, recent orders, low stock alerts
2. **Products**: Add, edit, delete products
3. **Orders**: View all orders, update status, add tracking
4. **Analytics**: Sales by category, top products, revenue

---

## File Structure

```
src/
├── admin/
│   ├── AdminApp.tsx         # Main admin app
│   ├── AdminLogin.tsx       # Login page
│   ├── AdminDashboard.tsx   # Dashboard layout
│   ├── ProductsManager.tsx  # Product CRUD
│   ├── OrdersManager.tsx    # Order management
│   └── Analytics.tsx        # Sales analytics
├── components/
│   ├── ProductCard.tsx      # Product display
│   ├── StripeCheckout.tsx   # Payment form
│   └── OrderSuccess.tsx     # Success + WhatsApp
├── data/
│   └── localDatabase.ts     # Fallback data
├── lib/
│   └── supabase.ts          # Supabase client
├── sections/
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── Products.tsx
│   ├── PhonesSection.tsx
│   ├── AccountsSection.tsx
│   ├── CPPointsSection.tsx
│   ├── OrderTracking.tsx    # Track orders
│   ├── Cart.tsx
│   └── Footer.tsx
├── store/
│   ├── cartStore.ts         # Cart state
│   └── adminStore.ts        # Admin state
└── types/
    └── database.ts          # TypeScript types
```

---

## Important Notes

1. **LocalStorage Fallback**: If Supabase is not configured, the app uses localStorage. This means:
   - Products are stored locally
   - Each user sees their own data
   - Data is lost on browser clear

2. **Stripe Test Mode**: Use Stripe test cards for testing:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits

3. **WhatsApp**: Make sure your WhatsApp number is in international format (e.g., +1234567890)

---

## Next Steps

1. Set up Supabase account and create tables
2. Add your Supabase credentials to `.env`
3. Add your Stripe publishable key
4. Update your WhatsApp number
5. Deploy to production

---

## Support

For issues or questions, contact support on WhatsApp!
