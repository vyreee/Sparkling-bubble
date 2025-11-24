# 🚀 Deploy to Vercel Guide

## ✅ Everything is Ready!

Your project is configured for Vercel deployment with:
- ✅ All 21 services mapped
- ✅ Test Stripe keys configured
- ✅ Supabase connected
- ✅ Vercel-compatible API functions
- ✅ Complete payment system

---

## 📋 Pre-Deployment Checklist

Before pushing to GitHub:

1. **Activate the complete payment page:**
   ```bash
   cd project
   
   # Backup current page (if it exists)
   mv src/pages/PaymentPage.tsx src/pages/PaymentPage.backup.tsx 2>/dev/null || true
   
   # Use complete version
   mv src/pages/PaymentPageComplete.tsx src/pages/PaymentPage.tsx
   ```

2. **Create local .env for testing:**
   ```bash
   # Copy the Vercel env template
   cp .env.vercel .env
   
   # The file already has all your credentials!
   # Just update VITE_APP_URL to http://localhost:5173
   ```

3. **Test locally:**
   ```bash
   npm install
   npm run dev
   ```
   
   Visit: http://localhost:5173/pay
   Test with card: `4242 4242 4242 4242`

---

## 🔧 Step 1: Push to GitHub

```bash
cd project

# Initialize git (if not already)
git init

# Add your remote
git remote add origin https://github.com/vyreee/Sparkling-bubble.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete Stripe integration with 21 services"

# Push to GitHub
git push -u origin main
```

**Note:** If you get an error about the branch name, try:
```bash
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your repository: `vyreee/Sparkling-bubble`
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: **project** (if needed)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add ALL variables from `.env.vercel`:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

   **And all the Price IDs** (see `.env.vercel` for complete list)
   
   **💡 Get your actual keys from `.env.vercel` file locally**

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live! 🎉

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? sparkling-bubble
# - Directory? ./project
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
# ... add all Price IDs

# Deploy to production
vercel --prod
```

---

## 🔗 Step 3: Update Environment Variables

After deployment, you'll get a URL like: `https://sparkling-bubble.vercel.app`

1. **Update VITE_APP_URL:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Change `VITE_APP_URL` to your Vercel URL
   - Redeploy

2. **Set up Stripe Webhook:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-vercel-url.vercel.app/api/stripe-webhook`
   - Events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Click "Add endpoint"
   - Copy the **Signing secret** (starts with `whsec_`)
   - Add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`
   - Redeploy

---

## 🧪 Step 4: Test Your Live Site

1. **Visit your Vercel URL**
   - Navigate to `/pay`

2. **Test a payment:**
   - Fill out form
   - Select "Small Bag - $25"
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

3. **Verify everything:**
   - ✅ Payment redirects to Stripe
   - ✅ Payment completes
   - ✅ Redirects to success page
   - ✅ Check Supabase for payment record
   - ✅ Check Vercel logs for webhook

---

## 📁 File Structure for Vercel

Your project structure:
```
project/
├── api/                          # Vercel serverless functions
│   ├── create-checkout-session.mjs
│   └── stripe-webhook.mjs
├── src/
│   ├── pages/
│   │   ├── PaymentPage.tsx      # Main payment page
│   │   ├── PaymentSuccessPage.tsx
│   │   └── PaymentCancelPage.tsx
│   └── ...
├── vercel.json                   # Vercel configuration
├── .env.vercel                   # Environment variables template
└── package.json
```

---

## 🔄 Continuous Deployment

After initial setup:

1. **Make changes locally**
2. **Test:** `npm run dev`
3. **Commit:** `git add . && git commit -m "Update"`
4. **Push:** `git push`
5. **Vercel auto-deploys!** 🚀

---

## ⚠️ Important Notes

### Vercel vs Netlify Differences

- ✅ API routes: `/api/*` instead of `/.netlify/functions/*`
- ✅ Already updated in PaymentPageComplete.tsx
- ✅ Vercel-specific serverless functions created
- ✅ No build step needed for functions

### Environment Variables

- All variables must be added in Vercel Dashboard
- Don't commit `.env` files to GitHub
- Use `.env.vercel` as reference

### Testing vs Production

Current setup uses **TEST mode**:
- Test cards only
- No real charges
- Safe to test

For production:
- Switch to LIVE Stripe keys
- Update Price IDs to LIVE mode
- Test thoroughly first!

---

## 🆘 Troubleshooting

### API routes not working?
→ Make sure `vercel.json` is in the project root
→ Check environment variables are set in Vercel

### Payment fails?
→ Verify all Price IDs are set
→ Check Stripe keys are correct
→ Look at Vercel function logs

### Webhook not triggering?
→ Ensure webhook URL matches your Vercel domain
→ Verify `STRIPE_WEBHOOK_SECRET` is set
→ Check webhook signing secret in Stripe

### Build fails?
→ Make sure `package.json` has all dependencies
→ Check Node version (use 18.x)
→ Verify build command: `npm run build`

---

## ✅ Deployment Checklist

- [ ] PaymentPageComplete.tsx renamed to PaymentPage.tsx
- [ ] Tested locally with `npm run dev`
- [ ] Pushed to GitHub
- [ ] Imported to Vercel
- [ ] All environment variables added
- [ ] First deployment successful
- [ ] Updated VITE_APP_URL
- [ ] Set up Stripe webhook
- [ ] Added STRIPE_WEBHOOK_SECRET
- [ ] Redeployed
- [ ] Tested payment on live site
- [ ] Verified Supabase records payment
- [ ] Ready for customers! 🎉

---

## 🎉 You're Live!

Your complete payment system with 21 services is now deployed and ready!

**Your Vercel URL:** https://sparkling-bubble.vercel.app (or similar)

**Test it:** Visit `/pay` and complete a test payment!

**Next:** When ready, switch to LIVE mode for real payments.

---

Need help? Check Vercel logs or ask me! 🚀
