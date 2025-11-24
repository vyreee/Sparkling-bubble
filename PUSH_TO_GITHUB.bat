@echo off
echo.
echo 🚀 Preparing to push to GitHub...
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Step 1: Activate complete payment page
echo 📝 Step 1: Activating complete payment page...
if exist "src\pages\PaymentPage.tsx" (
    move /y "src\pages\PaymentPage.tsx" "src\pages\PaymentPage.backup.tsx" >nul
    echo    ✅ Backed up existing PaymentPage.tsx
)

if exist "src\pages\PaymentPageComplete.tsx" (
    move /y "src\pages\PaymentPageComplete.tsx" "src\pages\PaymentPage.tsx" >nul
    echo    ✅ Activated PaymentPageComplete.tsx
) else (
    echo    ⚠️  PaymentPageComplete.tsx not found
)

REM Step 2: Initialize git if needed
echo.
echo 📦 Step 2: Setting up Git...
if not exist ".git" (
    git init
    echo    ✅ Initialized git repository
) else (
    echo    ℹ️  Git already initialized
)

REM Step 3: Add remote
echo.
echo 🔗 Step 3: Adding GitHub remote...
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo    ℹ️  Remote 'origin' already exists
    git remote set-url origin https://github.com/vyreee/fresh-n-clean-laundry.git
    echo    ✅ Updated remote URL
) else (
    git remote add origin https://github.com/vyreee/fresh-n-clean-laundry.git
    echo    ✅ Added remote 'origin'
)

REM Step 4: Add and commit
echo.
echo 💾 Step 4: Committing changes...
git add .
git commit -m "Initial commit: Complete Stripe integration with 21 services"
echo    ✅ Changes committed

REM Step 5: Push to GitHub
echo.
echo 🚀 Step 5: Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ SUCCESS! Your code is now on GitHub!
echo.
echo 🌐 Next steps:
echo 1. Go to https://vercel.com
echo 2. Import your repository: vyreee/fresh-n-clean-laundry
echo 3. Add environment variables from .env.vercel
echo 4. Deploy!
echo.
echo 📖 Full instructions: See DEPLOY_TO_VERCEL.md
echo.
pause
