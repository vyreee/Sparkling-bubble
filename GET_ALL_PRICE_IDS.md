# 🎯 Get ALL Your Stripe Price IDs

Complete guide to mapping all your products from Stripe to your payment page.

---

## 📦 Products You Need (Total: ~27 Price IDs)

### ✅ Checklist

Copy this checklist and mark off each one as you get it:

#### Basic Services (3)
- [ ] Small Bag ($25) - `STRIPE_PRICE_SMALL_BAG`
- [ ] Medium Bag ($35) - `STRIPE_PRICE_MEDIUM_BAG`
- [ ] Large Bag ($45) - `STRIPE_PRICE_LARGE_BAG`

#### Weekly Subscriptions (3)
- [ ] Small Bag Weekly ($20) - `STRIPE_PRICE_SMALL_SUBSCRIPTION`
- [ ] Medium Bag Weekly ($30) - `STRIPE_PRICE_MEDIUM_SUBSCRIPTION`
- [ ] Large Bag Weekly ($40) - `STRIPE_PRICE_LARGE_SUBSCRIPTION`

#### Senior/Military Discounts (3)
- [ ] Small Bag Senior/Military ($15) - `STRIPE_PRICE_SMALL_SENIOR`
- [ ] Medium Bag Senior/Military ($25) - `STRIPE_PRICE_MEDIUM_SENIOR`
- [ ] Large Bag Senior/Military ($35) - `STRIPE_PRICE_LARGE_SENIOR`

#### Senior/Military Weekly (3)
- [ ] Small Bag Senior/Military Weekly ($12) - `STRIPE_PRICE_SMALL_SENIOR_WEEKLY`
- [ ] Medium Bag Senior/Military Weekly ($20) - `STRIPE_PRICE_MEDIUM_SENIOR_WEEKLY`
- [ ] Large Bag Senior/Military Weekly ($30) - `STRIPE_PRICE_LARGE_SENIOR_WEEKLY`

#### Bundles (9)
- [ ] Household Essentials ($45) - `STRIPE_PRICE_BUNDLE_HOUSEHOLD`
- [ ] Family of Two ($52) - `STRIPE_PRICE_BUNDLE_FAMILY_TWO`
- [ ] Busy Family ($60) - `STRIPE_PRICE_BUNDLE_BUSY_FAMILY`
- [ ] Large Family ($72) - `STRIPE_PRICE_BUNDLE_LARGE_FAMILY`
- [ ] The Big Wash ($110) - `STRIPE_PRICE_BUNDLE_BIG_WASH`
- [ ] Student/Roommate ($52) - `STRIPE_PRICE_BUNDLE_STUDENT`
- [ ] Mom's Day Off ($85) - `STRIPE_PRICE_BUNDLE_MOMS_DAY`
- [ ] All Linens Included ($75) - `STRIPE_PRICE_BUNDLE_LINENS`
- [ ] Ultimate Family Unlimited ($135) - `STRIPE_PRICE_BUNDLE_ULTIMATE`

#### Add-ons (3)
- [ ] Hang-Dry Service ($5) - `STRIPE_PRICE_ADDON_HANGDRY`
- [ ] Eco Detergent Upgrade ($3) - `STRIPE_PRICE_ADDON_ECO`
- [ ] Rush Service ($10) - `STRIPE_PRICE_ADDON_RUSH`

---

## 🔍 How to Find Each Price ID

### Step-by-Step Process:

1. **Go to Stripe Products**
   - Visit: https://dashboard.stripe.com/test/products
   - Make sure you're in **Test Mode** (toggle top-right)

2. **Find the product** (e.g., "Small Bag Up to ≈15 lb")

3. **Click on the product name**

4. **In the product details**, look for the **Pricing** section

5. **Click on the price amount** (e.g., $25.00 USD)

6. **Copy the Price ID**
   - It looks like: `price_1OAbcDef123Xyz...`
   - Click the copy icon next to it

7. **Paste it into your `.env` file**

---

## 📝 Your `.env` File Structure

Create a file called `.env` and add all these:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...

# ===== BASIC SERVICES =====
STRIPE_PRICE_SMALL_BAG=price_
STRIPE_PRICE_MEDIUM_BAG=price_
STRIPE_PRICE_LARGE_BAG=price_

# ===== WEEKLY SUBSCRIPTIONS =====
STRIPE_PRICE_SMALL_SUBSCRIPTION=price_
STRIPE_PRICE_MEDIUM_SUBSCRIPTION=price_
STRIPE_PRICE_LARGE_SUBSCRIPTION=price_

# ===== SENIOR/MILITARY =====
STRIPE_PRICE_SMALL_SENIOR=price_
STRIPE_PRICE_MEDIUM_SENIOR=price_
STRIPE_PRICE_LARGE_SENIOR=price_

# ===== SENIOR/MILITARY WEEKLY =====
STRIPE_PRICE_SMALL_SENIOR_WEEKLY=price_
STRIPE_PRICE_MEDIUM_SENIOR_WEEKLY=price_
STRIPE_PRICE_LARGE_SENIOR_WEEKLY=price_

# ===== BUNDLES =====
STRIPE_PRICE_BUNDLE_HOUSEHOLD=price_
STRIPE_PRICE_BUNDLE_FAMILY_TWO=price_
STRIPE_PRICE_BUNDLE_BUSY_FAMILY=price_
STRIPE_PRICE_BUNDLE_LARGE_FAMILY=price_
STRIPE_PRICE_BUNDLE_BIG_WASH=price_
STRIPE_PRICE_BUNDLE_STUDENT=price_
STRIPE_PRICE_BUNDLE_MOMS_DAY=price_
STRIPE_PRICE_BUNDLE_LINENS=price_
STRIPE_PRICE_BUNDLE_ULTIMATE=price_

# ===== ADD-ONS =====
STRIPE_PRICE_ADDON_HANGDRY=price_
STRIPE_PRICE_ADDON_ECO=price_
STRIPE_PRICE_ADDON_RUSH=price_

# Webhook & URLs
STRIPE_WEBHOOK_SECRET=whsec_
VITE_APP_URL=http://localhost:5173
```

---

## 🎯 Quick Reference - Product Names in Stripe

Match these names from your Stripe dashboard:

| Your Landing Page | Stripe Dashboard Product Name |
|-------------------|-------------------------------|
| Small Bag $25 | "Small Bag Up to ≈15 lb" → $25.00 price |
| Medium Bag $35 | "Medium Bag Up to ≈20 lb" → $35.00 price |
| Large Bag $45 | "Large Bag Up to ≈30 lb" → $45.00 price |
| Small Weekly $20 | "Small Bag Up to ≈15 lb" → $20.00 price (weekly) |
| Medium Weekly $30 | "Medium Bag Up to ≈20 lb" → $30.00 price (weekly) |
| Large Weekly $40 | "Large Bag Up to ≈30 lb" → $40.00 price (weekly) |
| Small Senior $15 | "Medium Bag Up to ≈20 lb Senior / Military" → $15.00 price |
| Medium Senior $25 | "Medium Bag Up to ≈20 lb Senior / Military" → $25.00 price |
| Large Senior $35 | "Large Bag Up to ≈30 lb Senior / Military" → $35.00 price |
| Household Essentials $45 | "Household Essentials" Bundle |
| Family of Two $52 | "Family of Two / Light Laundry" Bundle |
| Busy Family $60 | "Busy Family" Bundle |
| Large Family $72 | "Large Family" Bundle |
| The Big Wash $110 | "The Big Wash" Bundle |
| Student/Roommate $52 | "Student / Roommate Bundle" |
| Mom's Day Off $85 | "Mom's Day Off" (if exists, or create it) |
| All Linens $75 | "All Linens Included" Bundle |
| Ultimate Unlimited $135 | "Ultimate Family Unlimited" (Your Premium Plan) |
| Hang-Dry $5 | "Add-On Service - Hang Dry Service" |
| Eco Detergent $3 | "Add-On Service Eco Detergent Upgrade" |
| Rush Service $10 | "Add-On Rush Service (24-Hour)" |

---

## ⚡ Quick Start Strategy

### Phase 1: Get the Essentials First (Test Fast)
Start with just these 3 to test quickly:
1. Small Bag ($25)
2. Medium Bag ($35)
3. Large Bag ($45)

Then test your payment flow before adding the rest.

### Phase 2: Add Subscriptions & Discounts
Add the weekly and senior/military options.

### Phase 3: Add Bundles
Add all 9 bundle options.

### Phase 4: Add Add-ons
Finally, add the 3 add-on services.

---

## 🔧 If Products Don't Exist in Stripe

### For Add-ons:
If you don't have separate products for add-ons, you need to create them:

1. Go to **Products** → **Add Product**
2. Name: "Hang-Dry Service Add-on"
3. Description: "Add-on service for delicate items"
4. Price: $5.00 USD, One-time
5. Click **Save**
6. Copy the Price ID

Repeat for Eco Detergent ($3) and Rush Service ($10).

### For Bundles That Don't Exist:
Create any missing bundles as new products in Stripe.

---

## 🎨 Organizing in Stripe (Optional)

To keep things organized, you can add **metadata** to each product:

- **category**: "basic", "subscription", "senior", "bundle", "addon"
- **tier**: "small", "medium", "large"

This helps with reporting and filtering later!

---

## ✅ Verification

After adding all Price IDs to your `.env`:

1. Check no lines are blank (except optional ones you haven't created yet)
2. All Price IDs start with `price_`
3. No duplicate Price IDs
4. File is named exactly `.env` (not `.env.txt`)

---

## 🚀 Next Steps

Once you have all Price IDs:

1. ✅ Save your `.env` file
2. ✅ Replace `PaymentPage.tsx` with `PaymentPageComplete.tsx`
3. ✅ Replace the serverless function with the complete version
4. ✅ Run `npm install` and `npm run dev`
5. ✅ Test the payment flow!

---

## 💡 Pro Tips

- **Start small**: Get 3-5 products working first, then add the rest
- **Use Test Mode**: Always test with `pk_test_` and `sk_test_` keys first
- **Organize by category**: Keep similar products grouped in Stripe
- **Document your mapping**: Keep a spreadsheet of Product Name → Price ID
- **Backup your .env**: Keep it safe (but never commit to Git!)

---

Need help mapping a specific product? Just ask! 🎉
