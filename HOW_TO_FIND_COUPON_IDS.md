# 🔍 How to Find Your Stripe Coupon IDs

## Quick Steps

1. Go to your [Stripe Coupons page](https://dashboard.stripe.com/coupons)
2. Click on one of your coupons (e.g., "Prepay 4 Weeks Bundle")
3. Look for the **Coupon ID** in the details

## Where to Find the ID

### Option 1: In the URL
When you click on a coupon, the URL will look like:
```
https://dashboard.stripe.com/coupons/COUPON_ID_HERE
```

### Option 2: In the Coupon Details
The coupon ID is shown at the top of the coupon details page, usually labeled as:
- **ID:** `your_coupon_id`
- or **Coupon ID:** `your_coupon_id`

## Common Formats

Stripe coupon IDs can be:
- Auto-generated: `promo_1A2B3C4D5E6F`
- Custom: `PREPAY_4WEEKS` or `4-WEEK-PREPAY`
- Names with spaces: `Prepay 4 Weeks Bundle`

## What You Need

Please find the **exact Coupon ID** for both coupons:

1. **4 Weeks Prepay Coupon**
   - Name shown: "Prepay 4 Weeks Bundle"
   - Coupon ID: `?` ← We need this

2. **12 Weeks Prepay Coupon**
   - Name shown: "Prepay 12 weeks Bundle"
   - Coupon ID: `?` ← We need this

## Update the Code

Once you have the IDs, I'll update this line in `Bundles.tsx`:

```typescript
const prepayBundles = {
  fourWeeks: { 
    couponCode: 'YOUR_4_WEEK_COUPON_ID_HERE',
    // ...
  },
  twelveWeeks: { 
    couponCode: 'YOUR_12_WEEK_COUPON_ID_HERE',
    // ...
  },
};
```

## Test It

After updating:
1. Add a bundle to cart
2. Click "Add to Cart" on a prepay coupon
3. Go to checkout
4. The discount should be applied automatically

---

**Please share the exact Coupon IDs and I'll update the code for you!** 🎯
