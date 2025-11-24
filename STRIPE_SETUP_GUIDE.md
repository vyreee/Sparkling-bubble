# 🎉 Stripe Integration Setup Guide

## Overview
This guide will walk you through integrating Stripe payment processing into your laundry service website step by step. You've never worked with Stripe before, so I'll explain everything clearly!

---

## 📋 What We've Built

I've integrated Stripe Checkout (hosted payment page) with your application using:
- **Frontend**: React components that collect customer info and redirect to Stripe
- **Backend**: Netlify serverless functions to securely create checkout sessions
- **Payment Flow**: Customer fills form → Redirects to Stripe → Payment → Success/Cancel pages

---

## 🚀 Step-by-Step Setup Instructions

### **Step 1: Install Dependencies**

Open your terminal in the project directory and run:

```bash
npm install
```

This will install the Stripe packages I added to your `package.json`:
- `@stripe/stripe-js` - For frontend Stripe integration
- `stripe` - For backend API calls

---

### **Step 2: Get Your Stripe API Keys**

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Sign in** to your Stripe account (or create one if you haven't)
3. **Switch to Test Mode** (toggle in the top right - it should show "Test mode")
4. **Get your API keys**:
   - Click **Developers** in the left sidebar
   - Click **API keys**
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_...`) - Safe to use in frontend
     - **Secret key** (starts with `sk_test_...`) - NEVER expose this!

5. **Copy both keys** - you'll need them in the next step

---

### **Step 3: Create Environment Variables File**

Create a file called `.env` in your project root (same folder as `package.json`):

```bash
# Copy .env.example to .env
cp .env.example .env
```

Then edit `.env` and add your actual keys:

```env
# Supabase Configuration (you already have these)
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE

# Your website URL
VITE_APP_URL=http://localhost:5173
```

⚠️ **IMPORTANT**: Never commit your `.env` file to GitHub! It's already in `.gitignore`.

---

### **Step 4: Connect Your Stripe Products** ⭐ IMPORTANT

Great news! I can see you already have all your products set up in Stripe. Now you just need to connect them to your website.

**You need to get 4 Price IDs from your Stripe products:**

1. **Small Bag Up to ≈15 lb** ($25) → Get its Price ID
2. **Medium Bag Up to ≈20 lb** ($35) → Get its Price ID
3. **Large Bag Up to ≈30 lb** ($45) → Get its Price ID
4. **Weekly Subscription** (if you have one) → Get its Price ID

**How to get Price IDs:**
1. Go to https://dashboard.stripe.com/test/products
2. Click on a product
3. Click on the price (e.g., $25.00 USD)
4. Copy the **Price ID** (starts with `price_...`)
5. Add it to your `.env` file

📖 **See detailed instructions in**: `HOW_TO_GET_PRICE_IDS.md`

Your `.env` should have these variables:
```env
STRIPE_PRICE_SMALL_BAG=price_1ABC123...
STRIPE_PRICE_MEDIUM_BAG=price_1DEF456...
STRIPE_PRICE_LARGE_BAG=price_1GHI789...
STRIPE_PRICE_SUBSCRIPTION=price_1JKL012...
```

**Why this is better:**
- ✅ Change prices in Stripe Dashboard without touching code
- ✅ See analytics for each product
- ✅ Add product images that show in checkout
- ✅ Easy to test different pricing

---

### **Step 5: Update Supabase Table Schema**

Your `payments` table needs these columns to work with Stripe:

```sql
-- Run this in your Supabase SQL editor
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_status TEXT;
```

This allows the webhook to save Stripe payment details.

---

### **Step 6: Test Locally**

Start your development server:

```bash
npm run dev
```

**To test the payment flow:**

1. Visit `http://localhost:5173/pay`
2. Fill out the form
3. Click "Request Payment Link"
4. You'll be redirected to Stripe Checkout
5. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Declined**: `4000 0000 0000 0002`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC
   - Any ZIP code

6. Complete payment and you'll be redirected to the success page!

---

### **Step 7: Deploy to Netlify (Production)**

#### 7a. Connect to Netlify

1. Push your code to GitHub
2. Go to https://app.netlify.com/
3. Click **Add new site** → **Import an existing project**
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### 7b. Add Environment Variables in Netlify

1. In Netlify, go to **Site settings** → **Environment variables**
2. Add all variables from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `VITE_APP_URL` (update to your Netlify URL, e.g., `https://your-site.netlify.app`)
   - `STRIPE_WEBHOOK_SECRET` (we'll get this in the next step)

3. Click **Deploy site**

#### 7c. Set Up Stripe Webhooks (Important!)

Webhooks tell your app when payments succeed or fail.

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
4. **Events to listen for**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Add it to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`
8. Redeploy your site

---

### **Step 8: Switch to Live Mode (When Ready)**

When you're ready for real payments:

1. In Stripe Dashboard, **disable Test mode** (toggle top right)
2. Go to **Developers** → **API keys**
3. Get your **LIVE** keys (start with `pk_live_...` and `sk_live_...`)
4. Update your production environment variables in Netlify
5. Create a new webhook endpoint for production
6. Update `STRIPE_WEBHOOK_SECRET` with the live webhook secret

---

## 📁 Files Created/Modified

### New Files:
- `netlify.toml` - Netlify configuration
- `netlify/functions/create-checkout-session.mjs` - Creates Stripe checkout sessions
- `netlify/functions/stripe-webhook.mjs` - Handles payment confirmations
- `src/pages/PaymentSuccessPage.tsx` - Success page after payment
- `src/pages/PaymentCancelPage.tsx` - Shown if user cancels payment
- `.env.example` - Template for environment variables

### Modified Files:
- `package.json` - Added Stripe dependencies
- `src/pages/PaymentPage.tsx` - Updated to use Stripe Checkout
- `src/App.tsx` - Added routes for success/cancel pages

---

## 🧪 Testing Checklist

- [ ] Local development server runs without errors
- [ ] Payment form loads at `/pay`
- [ ] Can submit form and redirect to Stripe Checkout
- [ ] Test card `4242 4242 4242 4242` completes successfully
- [ ] Redirected to success page after payment
- [ ] Declined card shows error
- [ ] Cancel button redirects to cancel page
- [ ] Payment info saved to Supabase
- [ ] Webhooks receiving events (check Netlify functions logs)

---

## 🆘 Troubleshooting

### "Cannot find module 'stripe'" error
→ Run `npm install`

### "Invalid API key" error
→ Check your `.env` file has the correct Stripe keys

### Webhook not working
→ Make sure `STRIPE_WEBHOOK_SECRET` is set in Netlify environment variables

### Payment succeeds but not saved to database
→ Check Netlify function logs for errors
→ Verify Supabase table has the required columns

### Different URL in development vs production
→ Make sure `VITE_APP_URL` is set correctly in each environment

---

## 📚 Additional Resources

- **Stripe Testing Cards**: https://stripe.com/docs/testing
- **Stripe Checkout Docs**: https://stripe.com/docs/checkout
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Stripe Webhooks Guide**: https://stripe.com/docs/webhooks

---

## 🎯 Next Steps (Optional Enhancements)

1. **Add subscription billing** for weekly customers
2. **Email receipts** using Stripe's built-in receipts
3. **Customer portal** for managing subscriptions
4. **Discount codes** using Stripe Coupons
5. **Multiple payment methods** (Apple Pay, Google Pay)

---

## 💡 Understanding the Payment Flow

```
User fills form → 
Frontend calls /.netlify/functions/create-checkout-session →
Netlify function creates Stripe session →
User redirected to Stripe Checkout →
User completes payment →
Stripe calls your webhook →
Webhook saves payment to Supabase →
User redirected to success page
```

---

## ✅ You're All Set!

If you follow these steps, you'll have a fully functional Stripe payment integration! 

**Need help?** Check the Troubleshooting section or feel free to ask me any questions!

Good luck with your laundry service! 🧺✨
