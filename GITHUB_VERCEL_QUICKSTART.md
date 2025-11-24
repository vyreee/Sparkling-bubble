# 🚀 GitHub + Vercel Quick Start

## ✅ Everything is Ready!

Your test credentials are configured:
- ✅ Supabase connected
- ✅ Stripe TEST keys configured
- ✅ All 21 Price IDs mapped
- ✅ Vercel-compatible API functions
- ✅ Complete payment system

---

## ⚡ Super Quick Deploy (3 Steps!)

### Step 1: Push to GitHub (2 minutes)

**Option A: Use the script (easiest)**
```bash
cd project
.\PUSH_TO_GITHUB.bat
```

**Option B: Manual commands**
```bash
cd project

# Activate complete payment page
move src\pages\PaymentPage.tsx src\pages\PaymentPage.backup.tsx
move src\pages\PaymentPageComplete.tsx src\pages\PaymentPage.tsx

# Push to GitHub
git init
git remote add origin https://github.com/vyreee/fresh-n-clean-laundry.git
git add .
git commit -m "Initial commit: Complete Stripe integration"
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy to Vercel (3 minutes)

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click:** "Add New..." → "Project"
4. **Select:** `vyreee/fresh-n-clean-laundry`
5. **Click:** "Import"

---

### Step 3: Add Environment Variables (5 minutes)

In Vercel project settings → Environment Variables, add these:

**Copy ALL from your local `.env.vercel` file!** 

💡 **Important:** Use your actual credentials from the `.env.vercel` file on your computer. Don't use the placeholders below:

```env
# Supabase (2 vars)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Keys (2 vars)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Basic Services (3 vars)
STRIPE_PRICE_SMALL_BAG=price_1SWks7Ry1GncCobYIYHF3iAo
STRIPE_PRICE_MEDIUM_BAG=price_1SWktIRy1GncCobYIrNfPLlY
STRIPE_PRICE_LARGE_BAG=price_1SWku9Ry1GncCobYXQfMydRE

# Weekly Subscriptions (3 vars)
STRIPE_PRICE_SMALL_SUBSCRIPTION=price_1SWjCnRy1GncCobYSrovQ43o
STRIPE_PRICE_MEDIUM_SUBSCRIPTION=price_1SWjUjRy1GncCobY4T9eapvq
STRIPE_PRICE_LARGE_SUBSCRIPTION=price_1SWjW4Ry1GncCobYauz2PtX5

# Senior/Military (3 vars)
STRIPE_PRICE_SMALL_SENIOR_WEEKLY=price_1SWjFYRy1GncCobYzHVFtE7s
STRIPE_PRICE_MEDIUM_SENIOR_WEEKLY=price_1SWja5Ry1GncCobY5LMcC6YB
STRIPE_PRICE_LARGE_SENIOR_WEEKLY=price_1SWjYbRy1GncCobY7gWu285S

# Bundles (9 vars)
STRIPE_PRICE_BUNDLE_HOUSEHOLD=price_1SWjmVRy1GncCobYXqPad5Qd
STRIPE_PRICE_BUNDLE_FAMILY_TWO=price_1SWjnrRy1GncCobY251SgGXR
STRIPE_PRICE_BUNDLE_BUSY_FAMILY=price_1SWjp0Ry1GncCobYJmkkqWkw
STRIPE_PRICE_BUNDLE_LARGE_FAMILY=price_1SWjrRRy1GncCobYWgVN0SAx
STRIPE_PRICE_BUNDLE_BIG_WASH=price_1SWjsjRy1GncCobYHsJPmpxX
STRIPE_PRICE_BUNDLE_STUDENT=price_1SWjthRy1GncCobYR9ehRJM0
STRIPE_PRICE_BUNDLE_MOMS_DAY=price_1SWjuhRy1GncCobY0YXwssnC
STRIPE_PRICE_BUNDLE_LINENS=price_1SWjwERy1GncCobYOBjY8vlk
STRIPE_PRICE_BUNDLE_ULTIMATE=price_1SWjyWRy1GncCobYW7pRtT8O

# Add-ons (3 vars)
STRIPE_PRICE_ADDON_HANGDRY=price_1SWkD9Ry1GncCobYNCLEaSOt
STRIPE_PRICE_ADDON_ECO=price_1SWkEYRy1GncCobY01wtQY0g
STRIPE_PRICE_ADDON_RUSH=price_1SWkGXRy1GncCobYZtVFNASC

# URLs (1 var - update after deployment!)
VITE_APP_URL=https://your-vercel-url.vercel.app
```

**Total: 25 environment variables**

**💡 Tip:** In Vercel, you can paste multiple at once - just copy from `.env.vercel`

---

### Step 4: Deploy & Update URL

1. **Click "Deploy"** - wait 2-3 minutes
2. **Copy your Vercel URL** (e.g., `https://fresh-n-clean-laundry.vercel.app`)
3. **Update `VITE_APP_URL`** in environment variables with your URL
4. **Redeploy** (Vercel → Deployments → click "..." → Redeploy)

---

### Step 5: Set Up Webhook (Optional but recommended)

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-vercel-url.vercel.app/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (`whsec_...`)
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`
7. Redeploy

---

## 🧪 Test Your Live Site

1. Visit: `https://your-vercel-url.vercel.app/pay`
2. Fill out form
3. Select "Small Bag - $25"
4. Use test card: **4242 4242 4242 4242**
5. Complete payment! 🎉

Check:
- ✅ Payment completes
- ✅ Redirects to success page
- ✅ Payment saved in Supabase

---

## 📁 What Changed for Vercel

### API Routes
- Netlify: `/.netlify/functions/create-checkout-session`
- Vercel: `/api/create-checkout-session` ✅ Updated!

### Files Added
- `api/create-checkout-session.mjs` - Vercel serverless function
- `api/stripe-webhook.mjs` - Webhook handler
- `vercel.json` - Vercel configuration
- `.env.vercel` - Environment variables template

---

## 🔄 Future Updates

Make changes and push:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel auto-deploys! 🚀

---

## ✅ Deployment Checklist

- [ ] Run `PUSH_TO_GITHUB.bat`
- [ ] Import to Vercel
- [ ] Add all 25 environment variables
- [ ] Deploy
- [ ] Update VITE_APP_URL
- [ ] Redeploy
- [ ] (Optional) Set up webhook
- [ ] Test payment
- [ ] You're live! 🎉

---

## 🆘 Quick Troubleshooting

### Can't push to GitHub?
```bash
# If main branch issue:
git branch -M main
git push -u origin main --force
```

### API routes not working?
- Check all environment variables are added in Vercel
- Verify `vercel.json` exists in root

### Payment fails?
- Check Price IDs in environment variables
- Verify Stripe keys are correct
- Check Vercel function logs

---

## 📖 Full Documentation

- **Deployment details:** `DEPLOY_TO_VERCEL.md`
- **Complete setup:** `FINAL_SETUP_STEPS.md`
- **Stripe setup:** `STRIPE_SETUP_GUIDE.md`

---

## 🎉 You're Done!

Your payment system is ready to deploy! Just follow the 5 steps above.

**Estimated time:** 10-15 minutes total

**Questions?** Check the detailed guides or ask me! 🚀
