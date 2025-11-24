# 🔗 Stripe Integration Guide - Subscription Tracking

## Overview
This guide shows you how to store subscription information in both Stripe and your database for redundancy.

---

## 📊 Database Schema (Already Created)

Run this migration in Supabase SQL Editor:
```sql
-- File: supabase/migrations/20241124_add_subscription_tracking.sql
-- This adds subscription tracking columns to your payments table
```

### New Columns in `payments` table:
- `service_category` (TEXT) - regular, weekly, senior, senior_weekly, bundle
- `is_subscription` (BOOLEAN) - Quick flag for subscriptions
- `service_items` (JSONB) - Full cart items array
- `weekly_pickup_day` (TEXT) - Day of week (Monday, Tuesday, etc.)

### New Column in `bookings` table:
- `weekly_pickup_day` (TEXT) - Day of week for recurring pickups

---

## 🔧 Stripe API Implementation

### Update Your `/api/create-checkout-session` Endpoint

```javascript
// api/create-checkout-session.js (or .ts)
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customerEmail, customerName, customerPhone } = req.body;

    // Detect if this is a subscription
    const isSubscription = items.some(item => 
      item.category?.includes('weekly') || 
      item.type === 'bundle' ||
      item.name.toLowerCase().includes('weekly') ||
      item.name.toLowerCase().includes('subscription')
    );

    // Get primary service category
    const serviceCategory = items[0]?.category || 'regular';

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
          metadata: {
            type: item.type,
            category: item.category || 'regular',
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment-cancel`,
      customer_email: customerEmail,
      
      // ⭐ IMPORTANT: Store subscription info in Stripe metadata
      metadata: {
        customer_name: customerName,
        customer_phone: customerPhone || '',
        customer_email: customerEmail,
        is_subscription: isSubscription.toString(),
        service_category: serviceCategory,
        service_items: JSON.stringify(items), // Full cart details
        item_count: items.length.toString(),
        // Add individual item details for easy access
        primary_service: items[0]?.name || '',
        primary_price: items[0]?.price.toString() || '',
      },
      
      // Optional: Add customer details
      billing_address_collection: 'auto',
    });

    // ⭐ Save to Supabase Database (Redundancy)
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        stripe_session_id: session.id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone || '',
        service_type: items[0]?.name || 'Unknown',
        service_category: serviceCategory,
        is_subscription: isSubscription,
        service_items: items, // Store full cart as JSON
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        amount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - Stripe has the data
    }

    // Return session URL
    return res.status(200).json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session' 
    });
  }
}
```

---

## 🎯 What Gets Stored Where

### **Stripe Checkout Session Metadata:**
```javascript
{
  customer_name: "John Doe",
  customer_phone: "555-1234",
  customer_email: "john@example.com",
  is_subscription: "true",
  service_category: "weekly",
  service_items: '[{"name":"Medium Bag - Weekly","price":30,"quantity":1}]',
  item_count: "1",
  primary_service: "Medium Bag - Weekly",
  primary_price: "30"
}
```

### **Supabase `payments` Table:**
```javascript
{
  id: "uuid",
  stripe_session_id: "cs_test_...",
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
  service_type: "Medium Bag - Weekly",
  service_category: "weekly",          // ← NEW
  is_subscription: true,                // ← NEW
  service_items: [...],                 // ← NEW (full cart JSON)
  weekly_pickup_day: null,              // ← NEW (set later from booking)
  quantity: 1,
  amount: 30,
  status: "pending",
  stripe_customer_id: "cus_...",
  stripe_subscription_id: null,
  created_at: "2024-11-24T..."
}
```

---

## 🔄 Webhook Handler (Optional but Recommended)

Update your Stripe webhook to sync data:

```javascript
// api/webhooks/stripe.js
export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Update payment status in database
      await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          stripe_customer_id: session.customer,
        })
        .eq('stripe_session_id', session.id);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
```

---

## 📅 Booking Page Integration

Update BookingPage to save weekly pickup day:

```typescript
// In handleSubmit function of BookingPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Calculate day of week from pickup date
    const pickupDate = new Date(formData.pickupDate);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyPickupDay = daysOfWeek[pickupDate.getDay()];

    // Save booking with weekly day
    const { error } = await supabase
      .from('bookings')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        service_type: formData.serviceType,
        pickup_date: formData.pickupDate,
        pickup_time: formData.pickupTime,
        notes: formData.notes,
        weekly_pickup_day: hasSubscription ? weeklyPickupDay : null, // ← NEW
        status: 'pending',
        payment_id: paymentInfo?.id || null,
        stripe_session_id: sessionId || null,
      }]);

    // Also update the payment record with weekly day
    if (paymentInfo?.id && hasSubscription) {
      await supabase
        .from('payments')
        .update({ weekly_pickup_day: weeklyPickupDay })
        .eq('id', paymentInfo.id);
    }

    if (error) throw error;
    setMessage('Booking submitted successfully!');
  } catch (error) {
    setMessage('Error submitting booking.');
    console.error('Error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🔍 Retrieving Subscription Info

### From Stripe Dashboard:
1. Go to Payments → Find the payment
2. Click on payment → View "Metadata" section
3. See all subscription details

### From Stripe API:
```javascript
const session = await stripe.checkout.sessions.retrieve(
  'cs_test_...',
  { expand: ['line_items'] }
);

console.log(session.metadata.is_subscription); // "true"
console.log(session.metadata.service_category); // "weekly"
console.log(JSON.parse(session.metadata.service_items)); // Full cart
```

### From Supabase:
```sql
-- Get all subscription customers
SELECT * FROM payments 
WHERE is_subscription = true;

-- Get customers with specific weekly day
SELECT * FROM bookings 
WHERE weekly_pickup_day = 'Monday';

-- Get full customer subscription details
SELECT 
  p.email,
  p.service_category,
  p.service_items,
  b.weekly_pickup_day,
  b.pickup_time
FROM payments p
JOIN bookings b ON b.payment_id = p.id
WHERE p.is_subscription = true;
```

---

## ✅ Redundancy Benefits

### If Database Fails:
- ✅ All data is in Stripe metadata
- ✅ Can recover from Stripe dashboard
- ✅ Can rebuild database from Stripe webhooks

### If Stripe Fails:
- ✅ All data is in Supabase
- ✅ Can continue operations
- ✅ Can sync back to Stripe later

### Both Working:
- ✅ Cross-reference for data integrity
- ✅ Audit trail in both systems
- ✅ Easy reporting and analytics

---

## 🚀 Implementation Checklist

- [ ] Run database migration SQL
- [ ] Update `/api/create-checkout-session` endpoint
- [ ] Add metadata to Stripe session creation
- [ ] Save to Supabase with new columns
- [ ] Update BookingPage to save `weekly_pickup_day`
- [ ] Test complete flow end-to-end
- [ ] Verify data in both Stripe and Supabase
- [ ] Set up Stripe webhook (optional)

---

## 📝 Environment Variables Needed

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (for webhooks)

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ... (for server-side operations)

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

---

**You now have complete redundancy with subscription data stored in both Stripe and your database!** 🎉
