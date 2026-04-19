#!/bin/bash

# Khalex Hub - Supabase Setup Script
echo "🚀 Setting up Khalex Hub with Supabase..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it with your Supabase credentials."
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check if Supabase credentials are set
if [[ "$VITE_SUPABASE_URL" == *"your-project"* ]] || [[ "$VITE_SUPABASE_ANON_KEY" == *"your-anon"* ]]; then
    echo "❌ Please update your .env file with actual Supabase credentials!"
    echo "   VITE_SUPABASE_URL=your-actual-supabase-url"
    echo "   VITE_SUPABASE_ANON_KEY=your-actual-anon-key"
    exit 1
fi

echo "✅ Environment variables loaded successfully"

# Install Supabase CLI if not installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Login to Supabase (this will open browser)
echo "🔐 Please login to Supabase in your browser..."
supabase login

# Link to project
echo "🔗 Linking to your Supabase project..."
supabase link --project-ref $(echo $VITE_SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')

# Apply migrations
echo "🗄️ Setting up database tables..."
supabase db push

echo "✅ Supabase setup complete!"
echo "🎉 Your Khalex Hub is now connected to Supabase!"
echo ""
echo "Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Visit http://localhost:5173/admin to access the admin panel"
echo "3. Add some products and test the functionality"