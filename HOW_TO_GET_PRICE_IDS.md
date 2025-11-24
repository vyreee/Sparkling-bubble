# 📝 How to Get Your Stripe Price IDs

Since you have all your products set up in Stripe, you just need to connect them to your website!

## 🎯 Step-by-Step Instructions

### Step 1: Open Your Stripe Dashboard

Go to: https://dashboard.stripe.com/test/products

(Make sure you're in **Test mode** - toggle in top right)

---

### Step 2: Get Price IDs for Your Main Products

You need the Price IDs for these 4 products:

#### 1. **Small Bag Up to ≈15 lb** ($25)
1. Click on "Small Bag Up to ≈15 lb" in your product list
2. You'll see a section called **Pricing**
3. Click on the price ($25.00 USD)
4. Look for **Price ID** (starts with `price_`)
5. Click the copy icon next to it
6. Paste it into your `.env` file as `STRIPE_PRICE_SMALL_BAG=price_...`

#### 2. **Medium Bag Up to ≈20 lb** ($35)
1. Click on "Medium Bag Up to ≈20 lb"
2. Click on the $35.00 USD price
3. Copy the **Price ID**
4. Paste it as `STRIPE_PRICE_MEDIUM_BAG=price_...`

#### 3. **Large Bag Up to ≈30 lb** ($45)
1. Click on "Large Bag Up to ≈30 lb"
2. Click on the $45.00 USD price
3. Copy the **Price ID**  
4. Paste it as `STRIPE_PRICE_LARGE_BAG=price_...`

#### 4. **Weekly Subscription** (if you have one)
- If you have a subscription product set up, get its Price ID too
- Paste it as `STRIPE_PRICE_SUBSCRIPTION=price_...`
- If you don't have one yet, you can leave this blank for now

---

### Step 3: Update Your .env File

Your `.env` file should look like this:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
STRIPE_SECRET_KEY=sk_test_51ABC...

# ✨ YOUR STRIPE PRICE IDs (from your products)
STRIPE_PRICE_SMALL_BAG=price_1ABC123...
STRIPE_PRICE_MEDIUM_BAG=price_1DEF456...
STRIPE_PRICE_LARGE_BAG=price_1GHI789...
STRIPE_PRICE_SUBSCRIPTION=price_1JKL012...

# Webhook Secret (get this later)
STRIPE_WEBHOOK_SECRET=whsec_...

# Website URL
VITE_APP_URL=http://localhost:5173
```

---

## 🎨 Visual Guide

When you click on a product in Stripe, you'll see something like:

```
Product Details
├── Name: Small Bag Up to ≈15 lb
├── Description: Preset Linen Services - Laundry only
└── Pricing
    ├── $25.00 USD  ← Click here
    │   └── Price ID: price_1ABC123xyz... ← Copy this!
    └── One time
```

---

## ✅ Verify Your Setup

After adding the Price IDs to your `.env` file:

1. Restart your dev server (`npm run dev`)
2. Go to http://localhost:5173/pay
3. Fill out the form
4. Click "Request Payment Link"
5. You should see your **actual product from Stripe** on the checkout page!

---

## 🎁 Bonus: Want to Add Bundles?

I see you have awesome bundles like:
- "Household Essentials" Bundle - $45
- "Busy Family" Bundle - $60
- "Large Family" Bundle - $72
- "The Big Wash" Bundle - $110

If you want these on your payment page, let me know and I can:
1. Add them to the payment form dropdown
2. Get their Price IDs
3. Connect them to the checkout

---

## 🆘 Troubleshooting

### "Cannot find Price ID" error
→ Make sure you copied the full `price_...` ID, not the product ID (`prod_...`)

### Price shows wrong amount
→ Double-check you copied the Price ID for the **correct price**. Some products have multiple prices (regular, senior, military, etc.)

### Need different prices for senior/military?
→ Those are separate products in your Stripe! Let me know if you want to add those options to the payment form.

---

## 🚀 Next: Deploy to Production

Once you have everything working locally with test Price IDs:

1. Switch to **Live mode** in Stripe Dashboard
2. Get the Live Price IDs (same process, but in Live mode)
3. Add them to Netlify environment variables
4. Deploy!

---

## ✨ Benefits of Using Stripe Products

- ✅ **Change prices in Stripe Dashboard** - no code changes needed
- ✅ **See product analytics** in Stripe
- ✅ **Add product images** that show in checkout
- ✅ **Easy A/B testing** of prices
- ✅ **Product catalog** for future features

---

Need help? Just ask! 🎉
