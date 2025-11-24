#!/bin/bash

# Quick GitHub Push Script
# Run this from the project directory

echo "🚀 Preparing to push to GitHub..."

# Navigate to project directory if not already there
cd "$(dirname "$0")"

# Step 1: Activate complete payment page
echo "📝 Step 1: Activating complete payment page..."
if [ -f "src/pages/PaymentPage.tsx" ]; then
    mv src/pages/PaymentPage.tsx src/pages/PaymentPage.backup.tsx
    echo "   ✅ Backed up existing PaymentPage.tsx"
fi

if [ -f "src/pages/PaymentPageComplete.tsx" ]; then
    mv src/pages/PaymentPageComplete.tsx src/pages/PaymentPage.tsx
    echo "   ✅ Activated PaymentPageComplete.tsx"
else
    echo "   ⚠️  PaymentPageComplete.tsx not found"
fi

# Step 2: Initialize git if needed
echo ""
echo "📦 Step 2: Setting up Git..."
if [ ! -d ".git" ]; then
    git init
    echo "   ✅ Initialized git repository"
else
    echo "   ℹ️  Git already initialized"
fi

# Step 3: Add remote
echo ""
echo "🔗 Step 3: Adding GitHub remote..."
if git remote get-url origin > /dev/null 2>&1; then
    echo "   ℹ️  Remote 'origin' already exists"
    git remote set-url origin https://github.com/vyreee/fresh-n-clean-laundry.git
    echo "   ✅ Updated remote URL"
else
    git remote add origin https://github.com/vyreee/fresh-n-clean-laundry.git
    echo "   ✅ Added remote 'origin'"
fi

# Step 4: Add and commit
echo ""
echo "💾 Step 4: Committing changes..."
git add .
git commit -m "Initial commit: Complete Stripe integration with 21 services

Features:
- 21 service options (basic, subscriptions, bundles)
- 3 add-ons (hang-dry, eco, rush)
- Supabase database integration
- Stripe payment processing
- Vercel-compatible API functions
- Complete documentation"

echo "   ✅ Changes committed"

# Step 5: Push to GitHub
echo ""
echo "🚀 Step 5: Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ SUCCESS! Your code is now on GitHub!"
echo ""
echo "🌐 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your repository: vyreee/fresh-n-clean-laundry"
echo "3. Add environment variables from .env.vercel"
echo "4. Deploy!"
echo ""
echo "📖 Full instructions: See DEPLOY_TO_VERCEL.md"
