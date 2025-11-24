# ⚡ Quick Start - Stripe Integration

## Immediate Next Steps (Do This First!)

### 1. Install Dependencies
```bash
cd project
npm install
```

### 2. Create `.env` File
Copy the example and add your keys:
```bash
cp .env.example .env
```

Edit `.env` and add:
- Your Supabase credentials (you already have these)
- Your Stripe API keys from https://dashboard.stripe.com/test/apikeys

### 3. Get Your Stripe Keys & Price IDs

**3a. Get API Keys:**
1. Go to https://dashboard.stripe.com/
2. Make sure you're in **Test Mode** (toggle top-right)
3. Click **Developers** → **API keys**
4. Copy both:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)
5. Paste them into your `.env` file

**3b. Get Product Price IDs:**
1. Go to https://dashboard.stripe.com/test/products
2. Click on "Small Bag Up to ≈15 lb"
3. Click on the $25.00 price
4. Copy the **Price ID** (starts with `price_...`)
5. Add to `.env` as `STRIPE_PRICE_SMALL_BAG=price_...`
6. Repeat for Medium ($35), Large ($45), and Subscription

📖 **Detailed instructions**: See `HOW_TO_GET_PRICE_IDS.md`

### 4. Set Up Supabase Database

**Option A: Quick Setup (Recommended)**
1. Open Supabase Dashboard → SQL Editor
2. Open the file: `supabase/migrations/001_initial_setup.sql`
3. Copy the **entire contents**
4. Paste into SQL Editor and click **Run**

**Option B: Detailed Guide**
📖 See `supabase/MIGRATION_GUIDE.md` for complete instructions

**Verify it worked:**
1. Open the file: `supabase/migrations/verify_migration.sql`
2. Copy and run it in SQL Editor
3. All checks should show "PASS"

### 5. Start Development Server
```bash
npm run dev
```

### 6. Test Payment Flow

1. Visit http://localhost:5173/pay
2. Fill out the form
3. Use test card: `4242 4242 4242 4242`
4. Any future date, any CVC, any ZIP
5. Complete payment!

---

## 📖 Full Documentation

See **STRIPE_SETUP_GUIDE.md** for:
- Detailed explanations
- Production deployment
- Webhook setup
- Troubleshooting
- Advanced features

---

## 🎯 What Was Built

### Backend (Netlify Functions)
- ✅ `create-checkout-session.mjs` - Creates Stripe payment sessions
- ✅ `stripe-webhook.mjs` - Handles payment confirmations

### Frontend (React Pages)
- ✅ Updated `PaymentPage.tsx` - Integrates with Stripe
- ✅ New `PaymentSuccessPage.tsx` - Success confirmation
- ✅ New `PaymentCancelPage.tsx` - Cancellation handling

### Configuration
- ✅ `netlify.toml` - Deployment configuration
- ✅ `.env.example` - Environment template
- ✅ Updated `package.json` - Added Stripe packages

---

## 🧪 Stripe Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ⏱️ Insufficient funds |

**Expiry**: Any future date  
**CVC**: Any 3 digits  
**ZIP**: Any 5 digits

---

## ⚠️ Important Notes

- **Never commit `.env` file** - It's in `.gitignore`
- **Test mode first** - Don't use live keys until ready
- **Stripe uses cents** - $25 = 2500 cents in the code
- **Webhooks needed** - For production, set up webhooks in Stripe

---

## 💡 Quick Links

- 📘 [Full Setup Guide](./STRIPE_SETUP_GUIDE.md)
- 🔗 [Stripe Dashboard](https://dashboard.stripe.com/)
- 🧪 [Test Cards](https://stripe.com/docs/testing)
- 📚 [Stripe Docs](https://stripe.com/docs)

---

## Need Help?

Check the [Full Setup Guide](./STRIPE_SETUP_GUIDE.md) or ask me any questions!
