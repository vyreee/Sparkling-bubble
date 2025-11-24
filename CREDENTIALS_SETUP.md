# 🔑 Credentials Setup Guide

## ✅ What You've Provided

- ✅ Supabase URL
- ✅ Supabase Anon Key
- ✅ Stripe **LIVE** Publishable Key
- ⏳ Waiting for Stripe **LIVE** Secret Key

---

## ⚠️ IMPORTANT: You're Using LIVE Mode!

You provided a **LIVE mode** Stripe key (`pk_live_...`). This means:
- Real money will be charged
- Real credit cards processed
- Transactions will actually happen

---

## 🎯 Recommended Path: Test First!

### Option 1: Test Mode First (Recommended)

**Before using live keys, test everything safely:**

1. **Get TEST mode keys from Stripe:**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Toggle to **Test Mode** (top right)
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (starts with `sk_test_`)

2. **Use the test .env:**
   ```bash
   # Copy test template
   cp .env.test .env
   
   # Edit .env and add your TEST keys
   ```

3. **Test everything:**
   ```bash
   npm install && npm run dev
   ```
   - Use test card: `4242 4242 4242 4242`
   - Test all services
   - Verify payments work
   - Check Supabase records

4. **Once everything works**, switch to live mode

---

### Option 2: Go Live Immediately

**Only do this if you're confident everything is set up correctly!**

1. **Get your LIVE secret key:**
   - Go to: https://dashboard.stripe.com/apikeys
   - Make sure you're in **Live Mode**
   - Click "Reveal live key token" under Secret key
   - Copy it (starts with `sk_live_`)

2. **Export LIVE mode prices:**
   - Go to: https://dashboard.stripe.com/products
   - Toggle to **Live Mode**
   - Export products and prices
   - Update all Price IDs in `.env.production`

3. **Use production .env:**
   ```bash
   # Copy production template
   cp .env.production .env
   
   # Edit .env and add your LIVE secret key
   # Update all Price IDs with LIVE mode ones
   ```

4. **Deploy to production** (don't test live mode locally!)

---

## 📝 Files I Created

### `.env.test` 
- For safe testing
- Uses TEST mode Stripe keys
- Price IDs from your test export
- **Use this first!**

### `.env.production`
- For going live
- Has your Supabase credentials
- Has your LIVE Stripe publishable key
- Needs LIVE secret key
- Needs LIVE Price IDs

---

## 🚀 Quick Start - Test Mode (Safest)

### Step 1: Get Test Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Toggle **Test Mode** on (top right)
3. Copy both keys

### Step 2: Setup .env

```bash
cd project
cp .env.test .env
```

Edit `.env` and add your test keys:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
STRIPE_SECRET_KEY=sk_test_your_test_secret_here
```

### Step 3: Activate Files

```bash
mv src/pages/PaymentPageComplete.tsx src/pages/PaymentPage.tsx
mv netlify/functions/create-checkout-session-complete.mjs netlify/functions/create-checkout-session.mjs
```

### Step 4: Run

```bash
npm install && npm run dev
```

Visit: http://localhost:5173/pay

Test with card: **4242 4242 4242 4242**

---

## 🔴 If Using Live Mode

### You Need:

1. **LIVE Secret Key** - Get from: https://dashboard.stripe.com/apikeys
   ```
   sk_live_...
   ```

2. **LIVE Price IDs** - Export from Stripe in Live Mode:
   - Toggle to Live Mode
   - Go to Products
   - Export prices
   - Update all `price_...` values in `.env.production`

3. **Webhook Secret** (for production):
   - Deploy to Netlify first
   - Then set up webhook in Stripe
   - Get webhook secret

### Steps:

```bash
cd project

# Copy production template
cp .env.production .env

# Edit .env:
# - Add LIVE secret key
# - Update all Price IDs with LIVE mode ones

# Activate files
mv src/pages/PaymentPageComplete.tsx src/pages/PaymentPage.tsx
mv netlify/functions/create-checkout-session-complete.mjs netlify/functions/create-checkout-session.mjs

# Deploy to Netlify (don't test live mode locally!)
npm install
npm run build
```

Then follow Netlify deployment steps in STRIPE_SETUP_GUIDE.md

---

## ⚡ Current Status

### What's Ready ✅
- [x] Database setup complete
- [x] Supabase credentials provided
- [x] Payment page built
- [x] Serverless functions ready
- [x] All 21 Price IDs mapped (TEST mode)
- [x] Live publishable key provided

### What's Needed ⏳
- [ ] Stripe Secret Key (test or live)
- [ ] If live: LIVE mode Price IDs
- [ ] Choose test or live path
- [ ] Run setup

---

## 🎯 My Recommendation

**Start with TEST mode:**

1. It's 100% safe
2. You can test everything thoroughly
3. No risk of real charges
4. Easy to debug issues
5. Once working, copy to live

**Then go to LIVE mode:**

1. Get live secret key
2. Export live prices
3. Update .env
4. Deploy to production
5. Set up webhook
6. Go live! 🚀

---

## 📞 Next Steps

**Tell me which path you want:**

1. **"Let's test first"** → I'll help you get test keys and run locally
2. **"I want to go live now"** → I'll help you get live secret key and deploy

**Or just paste your Stripe secret key** and I'll set everything up!

---

## ⚠️ Security Reminder

Never commit `.env` files to Git! They're already in `.gitignore` ✅
