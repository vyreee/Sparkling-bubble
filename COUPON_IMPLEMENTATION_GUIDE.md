# 🎟️ Stripe Coupon Implementation Guide

## Overview

Your prepay bundles have "Use Coupon" buttons that need to be connected to Stripe's coupon system.

---

## Step 1: Create Coupons in Stripe Dashboard

### Option A: Percentage Off
1. Go to [Stripe Dashboard → Products → Coupons](https://dashboard.stripe.com/coupons)
2. Click **"New"**
3. Create coupons:

**4-Week Prepay Coupon:**
- Name: `4 Weeks Prepaid`
- Coupon ID: `PREPAY_4WEEKS` (or auto-generate)
- Type: `Amount off`
- Amount: `$10.00`
- Duration: `Once`

**12-Week Prepay Coupon:**
- Name: `12 Weeks Prepaid`
- Coupon ID: `PREPAY_12WEEKS` (or auto-generate)
- Type: `Amount off`
- Amount: `$50.00`
- Duration: `Once`

### Option B: Create via API (Automated)

Add this to your API or run once:

```javascript
// Create coupons programmatically
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCoupons() {
  // 4-week coupon
  const fourWeekCoupon = await stripe.coupons.create({
    id: 'PREPAY_4WEEKS',
    name: '4 Weeks Prepaid',
    amount_off: 1000, // $10 in cents
    currency: 'usd',
    duration: 'once',
  });

  // 12-week coupon
  const twelveWeekCoupon = await stripe.coupons.create({
    id: 'PREPAY_12WEEKS',
    name: '12 Weeks Prepaid',
    amount_off: 5000, // $50 in cents
    currency: 'usd',
    duration: 'once',
  });

  console.log('Coupons created:', fourWeekCoupon.id, twelveWeekCoupon.id);
}
```

---

## Step 2: Update Bundles Component

Update the prepay bundle buttons to add items to cart with coupon codes:

```tsx
// In Bundles.tsx - Update the prepay bundles section

const prepayBundles = {
  fourWeeks: { 
    weeks: 4, 
    save: '$10',
    couponCode: 'PREPAY_4WEEKS',
    description: '4 weeks of service prepaid'
  },
  twelveWeeks: { 
    weeks: 12, 
    save: '$50',
    couponCode: 'PREPAY_12WEEKS',
    description: '12 weeks of service prepaid'
  },
};

// Update the buttons to add to cart
<button 
  onClick={() => addItem({ 
    name: `${prepayBundles.fourWeeks.weeks} Weeks Prepaid`,
    price: 0, // Price will be calculated based on selected bundle
    type: 'prepay',
    description: prepayBundles.fourWeeks.description,
    metadata: {
      couponCode: prepayBundles.fourWeeks.couponCode,
      weeks: prepayBundles.fourWeeks.weeks
    }
  })}
  className="w-full bg-gradient-to-r from-blue-600 to-purple-600..."
>
  <Ticket className="w-5 h-5" />
  Add to Cart
</button>
```

---

## Step 3: Update Cart Item Type

Add coupon support to your cart item type:

```typescript
// src/types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'service' | 'bundle' | 'addon' | 'prepay';
  category?: string;
  quantity: number;
  description?: string;
  metadata?: {
    couponCode?: string;
    weeks?: number;
  };
}
```

---

## Step 4: Update API to Apply Coupons

Update your checkout session API to handle coupons:

```javascript
// api/create-checkout-session.mjs

export default async function handler(req, res) {
  try {
    const { items, customerEmail, customerName, customerPhone, bookingInfo } = req.body;

    // Check if any item has a coupon code
    const couponItem = items.find(item => item.metadata?.couponCode);
    const couponCode = couponItem?.metadata?.couponCode;

    // Create line items
    const lineItems = items
      .filter(item => item.type !== 'prepay') // Exclude prepay items from line items
      .map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      }));

    // Create checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer: customer.id,
      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
        // ... other metadata
      },
      success_url: `${process.env.VITE_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/payment-cancel`,
    };

    // Add coupon if present
    if (couponCode) {
      sessionConfig.discounts = [{
        coupon: couponCode,
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

---

## Step 5: Alternative - Coupon Input Field

If you want customers to enter coupon codes manually:

```tsx
// In CheckoutPage.tsx or PaymentPage.tsx

const [couponCode, setCouponCode] = useState('');
const [couponApplied, setCouponApplied] = useState(false);

// Add this to your form
<div className="border-t pt-6">
  <h3 className="text-lg font-semibold mb-3">Have a coupon code?</h3>
  <div className="flex gap-3">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
      placeholder="Enter coupon code"
      className="flex-1 px-4 py-2 border rounded-lg"
    />
    <button
      type="button"
      onClick={() => {
        // Validate coupon (optional)
        setCouponApplied(true);
      }}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg"
    >
      Apply
    </button>
  </div>
  {couponApplied && (
    <p className="text-green-600 mt-2">✓ Coupon applied!</p>
  )}
</div>

// Include in checkout request
body: JSON.stringify({
  items: items,
  customerEmail: formData.email,
  customerName: formData.name,
  couponCode: couponApplied ? couponCode : null,
  // ... other fields
})
```

---

## Step 6: Update API for Manual Coupon Input

```javascript
// api/create-checkout-session.mjs

const { items, customerEmail, customerName, couponCode } = req.body;

// Validate coupon exists (optional but recommended)
if (couponCode) {
  try {
    const coupon = await stripe.coupons.retrieve(couponCode);
    if (!coupon.valid) {
      return res.status(400).json({ error: 'Invalid or expired coupon' });
    }
  } catch (error) {
    return res.status(400).json({ error: 'Coupon not found' });
  }
}

// Apply to session
const session = await stripe.checkout.sessions.create({
  // ... other config
  discounts: couponCode ? [{ coupon: couponCode }] : undefined,
});
```

---

## Recommended Approach

**For Prepay Bundles (Your Current Use Case):**

1. Create the two coupons in Stripe Dashboard
2. Update the "Use Coupon" buttons to add a prepay item to cart
3. Update the API to detect prepay items and apply the coupon automatically
4. Show the discount in the cart/checkout summary

**Implementation:**

```tsx
// Bundles.tsx - Update prepay buttons
<button 
  onClick={() => {
    addItem({ 
      name: `${prepayBundles.fourWeeks.weeks} Weeks Prepaid - Save ${prepayBundles.fourWeeks.save}`,
      price: 0,
      type: 'prepay',
      description: 'Prepay discount coupon',
      category: 'coupon',
      metadata: {
        couponCode: 'PREPAY_4WEEKS',
        weeks: 4,
        savings: 10
      }
    });
  }}
  className="w-full bg-gradient-to-r from-blue-600 to-purple-600..."
>
  <Ticket className="w-5 h-5" />
  Add to Cart
</button>
```

---

## Testing

1. Create coupons in Stripe Dashboard
2. Add a bundle to cart
3. Click "Use Coupon" for 4-week prepay
4. Go to checkout
5. Verify discount is applied in Stripe Checkout

---

## Environment Variables

No new variables needed! Just use your existing:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`

---

## Next Steps

Would you like me to:
1. ✅ Update `Bundles.tsx` to make the coupon buttons functional?
2. ✅ Update the API to handle coupon codes?
3. ✅ Add a manual coupon input field to checkout?
4. ✅ Create a script to generate the coupons in Stripe?

Let me know which approach you prefer!
