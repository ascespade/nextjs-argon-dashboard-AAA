#!/bin/bash

# Fix Install Script for NextJS Argon Dashboard Editable Website
# This script helps set up the project when package installs are blocked

echo "🚀 Setting up NextJS Argon Dashboard Editable Website..."

# Check if pnpm is available, fallback to npm
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
else
    PACKAGE_MANAGER="npm"
fi

echo "📦 Using package manager: $PACKAGE_MANAGER"

# Install dependencies
echo "📥 Installing dependencies..."
$PACKAGE_MANAGER install

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials"
    echo "   See docs/ENVIRONMENT.md for detailed instructions"
fi

# Create docs directory if it doesn't exist
mkdir -p docs

# Create data directory for fallback storage
mkdir -p data

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run the database initialization:"
echo "   - Copy supabase/init.sql to your Supabase SQL editor"
echo "   - Execute the SQL"
echo "3. Seed the database:"
echo "   node scripts/seed-supabase.js"
echo "4. Start development server:"
echo "   $PACKAGE_MANAGER run dev"
echo ""
echo "📚 Documentation:"
echo "   - README-EDITOR.md: Complete guide"
echo "   - docs/DEPLOYMENT.md: Deployment instructions"
echo "   - docs/ENVIRONMENT.md: Environment setup"
echo "   - docs/QA_CHECKLIST.md: Testing checklist"
echo ""
echo "🎉 Happy coding!"