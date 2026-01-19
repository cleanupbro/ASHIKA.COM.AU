#!/bin/bash
# ASHIKA Development Setup Script
# Run this to initialize the Next.js project

set -e

echo "🚀 ASHIKA Development Setup"
echo "==========================="

# Check if package.json exists (Next.js already initialized)
if [ -f "package.json" ]; then
    echo "📦 package.json exists. Skipping Next.js initialization."
else
    echo "📦 Initializing Next.js 14 project..."
    npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
fi

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install @supabase/supabase-js @stripe/stripe-js stripe date-fns zod react-hook-form @hookform/resolvers lucide-react clsx tailwind-merge

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp env/.env.example .env.local
    echo "⚠️  Please update .env.local with your API keys"
else
    echo "✅ .env.local already exists"
fi

# Create src directories if they don't exist
echo "📁 Creating source directories..."
mkdir -p src/components/ui
mkdir -p src/components/product
mkdir -p src/components/booking
mkdir -p src/lib/supabase
mkdir -p src/lib/stripe
mkdir -p src/lib/utils
mkdir -p src/hooks
mkdir -p src/types

# Verify setup
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Run 'npm run dev' to start development"
echo "3. Open http://localhost:3000"
echo ""
