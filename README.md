# Khalex Hub - E-commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, Vite, and Supabase. Features include product management, order processing, payment integration, and an admin dashboard.

## 🚀 Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Admin Dashboard**: Complete product and order management
- **Payment Integration**: Stripe payment processing
- **WhatsApp Integration**: Customer communication
- **Order Tracking**: Real-time order status updates
- **Supabase Database**: Real-time data synchronization
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Modern glassmorphism design

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for database)
- Stripe account (for payments)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd khalex-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   ```bash
   # Run the automated setup script
   ./setup-supabase.sh

   # Or set up manually:
   # 1. Create a .env file with your Supabase credentials
   # 2. Run the SQL migrations in supabase/migrations/
   ```

4. **Configure environment variables**
   ```env
   # .env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Supabase Setup

### Automated Setup
```bash
./setup-supabase.sh
```

### Manual Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Get Credentials**
   - Go to Project Settings → API
   - Copy URL and anon public key

3. **Update Environment**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run Database Migrations**
   - Execute the SQL in `supabase/migrations/20240101000000_initial_schema.sql`
   - Or use Supabase CLI: `supabase db push`

## 💳 Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create an account

2. **Get Publishable Key**
   - Go to Developers → API keys
   - Copy the publishable key

3. **Update Environment**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
   ```

## 🎯 Usage

### Admin Panel
- **URL**: `http://localhost:5173/admin`
- **Login**: admin@khalexhub.com / admin123
- **Features**:
  - Dashboard with analytics
  - Product management (CRUD)
  - Order management
  - Sales analytics

### Customer Features
- Browse products by category
- Add to cart and checkout
- Stripe payment integration
- WhatsApp order confirmation
- Order tracking with timeline

## 📁 Project Structure

```
src/
├── admin/           # Admin panel components
├── components/      # Reusable UI components
├── data/           # Local data and database helpers
├── hooks/          # Custom React hooks
├── lib/            # Utilities and external services
├── sections/       # Page sections
├── store/          # State management (Zustand)
├── types/          # TypeScript type definitions
└── ui/             # UI component library
```

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to your hosting platform
# (Vercel, Netlify, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
