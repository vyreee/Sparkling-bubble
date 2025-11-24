# ✅ Coupon System - Setup Complete

## What Was Done

Your prepay bundle coupon buttons are now fully functional! 🎉

---

## Changes Made

### 1. **Updated Cart Item Type** (`src/types/cart.ts`)
Added `metadata` field to support coupon codes:
```typescript
metadata?: {
  couponCode?: string;
  weeks?: number;
  savings?: number;
}
```

### 2. **Updated Bundles Component** (`src/components/Bundles.tsx`)
- ✅ Added coupon data to prepay bundles
- ✅ Changed "Use Coupon" to "Add to Cart"
- ✅ Buttons now add prepay items to cart with coupon codes
- ✅ Fixed TypeScript error (weeklyPrice type)

**Coupon Codes:**
- `PREPAY_4WEEKS` - Save $10
- `PREPAY_12WEEKS` - Save $50

### 3. **Updated API Endpoints**
Both `/api/create-checkout-session.mjs` and `/netlify/functions/create-checkout-session.mjs`:
- ✅ Detect coupon codes from cart items
- ✅ Filter out prepay items from line items
- ✅ Apply coupon discount to Stripe session
- ✅ Store coupon code in metadata

---

## How It Works

### User Flow:
1. Customer adds a bundle to cart (e.g., "Busy Family - $60/week")
2. Customer clicks "Add to Cart" on "4 Weeks Prepaid" coupon
3. Cart shows both items
4. At checkout, the $10 discount is automatically applied
5. Stripe shows: `$60 - $10 discount = $50`

### Technical Flow:
```javascript
// Cart contains:
[
  { name: "Busy Family", price: 60, type: "bundle" },
  { 
    name: "4 Weeks Prepaid - Save $10", 
    price: 0, 
    type: "prepay",
    metadata: { couponCode: "PREPAY_4WEEKS" }
  }
]

// API processes:
1. Finds coupon code: "PREPAY_4WEEKS"
2. Filters out prepay item (price: 0)
3. Creates line items: [{ Busy Family: $60 }]
4. Applies discount: { coupon: "PREPAY_4WEEKS" }
5. Stripe calculates: $60 - $10 = $50
```

---

## Next Step: Create Coupons in Stripe

You need to create the actual coupons in your Stripe account.

### Option 1: Run the Script (Easiest)

```bash
node scripts/create-stripe-coupons.mjs
```

This will automatically create both coupons in your Stripe account.

### Option 2: Manual Creation

1. Go to [Stripe Dashboard → Coupons](https://dashboard.stripe.com/coupons)
2. Click **"New"**

**For 4-Week Coupon:**
- Coupon ID: `PREPAY_4WEEKS`
- Name: `4 Weeks Prepaid`
- Type: `Amount off`
- Amount: `$10.00`
- Currency: `USD`
- Duration: `Once`

**For 12-Week Coupon:**
- Coupon ID: `PREPAY_12WEEKS`
- Name: `12 Weeks Prepaid`
- Type: `Amount off`
- Amount: `$50.00`
- Currency: `USD`
- Duration: `Once`

---

## Testing

1. **Add a bundle to cart**
   - Go to homepage
   - Click "Add to Cart" on any bundle

2. **Add a coupon**
   - Scroll to "Prepay Bundles"
   - Click "Add to Cart" on 4-week or 12-week prepay

3. **Check cart**
   - Open cart modal
   - Should see both items

4. **Go to checkout**
   - Fill in details
   - Click "Proceed to Payment"

5. **Verify in Stripe**
   - Stripe checkout should show the discount applied
   - Total should be reduced by $10 or $50

---

## Files Modified

- ✅ `src/types/cart.ts` - Added metadata field
- ✅ `src/components/Bundles.tsx` - Made coupon buttons functional
- ✅ `api/create-checkout-session.mjs` - Added coupon handling
- ✅ `netlify/functions/create-checkout-session.mjs` - Added coupon handling

## Files Created

- ✅ `scripts/create-stripe-coupons.mjs` - Script to create coupons
- ✅ `COUPON_IMPLEMENTATION_GUIDE.md` - Detailed guide
- ✅ `COUPON_SETUP_COMPLETE.md` - This file

---

## Important Notes

⚠️ **Coupon codes must exist in Stripe** before they can be applied. Run the script or create them manually.

⚠️ **Prepay items have price: 0** - They're just coupon holders. The actual discount is applied by Stripe.

⚠️ **Coupons are "once" duration** - They apply to a single payment, not recurring subscriptions.

---

## What Happens at Checkout

**Without Coupon:**
```
Busy Family Bundle: $60.00
Total: $60.00
```

**With 4-Week Coupon:**
```
Busy Family Bundle: $60.00
Discount (PREPAY_4WEEKS): -$10.00
Total: $50.00
```

**With 12-Week Coupon:**
```
Busy Family Bundle: $60.00
Discount (PREPAY_12WEEKS): -$50.00
Total: $10.00
```

---

## Ready to Use! 🚀

Your coupon system is now fully integrated and ready to use. Just create the coupons in Stripe and you're all set!
