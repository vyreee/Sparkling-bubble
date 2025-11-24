# 🎯 Simple Stripe Metadata Update - At Booking Time

## Overview
This simpler approach updates Stripe metadata AFTER the customer books their pickup, storing all subscription information in one place.

---

## 📊 What Gets Stored in Stripe

### **1. Payment Intent Metadata** (The actual payment)
```javascript
{
  weekly_pickup_day: "Wednesday",
  pickup_date: "2024-12-11",
  pickup_time: "morning",
  pickup_address: "123 Main St, City, State",
  booking_completed: "true",
  booking_timestamp: "2024-11-24T15:30:00Z"
}
```

### **2. Customer Metadata** (The customer profile)
```javascript
{
  weekly_pickup_day: "Wednesday",
  pickup_time: "morning",
  pickup_address: "123 Main St, City, State",
  subscription_active: "true",
  last_booking_date: "2024-11-24T15:30:00Z"
}
```

### **3. Session Metadata** (The checkout session)
```javascript
{
  // Original metadata from checkout:
  customer_name: "John Doe",
  customer_email: "john@example.com",
  is_subscription: "true",
  service_category: "weekly",
  service_items: "[...]",
  
  // Added after booking:
  weekly_pickup_day: "Wednesday",
  pickup_date: "2024-12-11",
  pickup_time: "morning",
  booking_completed: "true"
}
```

---

## 🔄 Complete Flow

### **Step 1: Customer Checks Out**
```javascript
// In /api/create-checkout-session
const session = await stripe.checkout.sessions.create({
  // ... line items, etc.
  metadata: {
    customer_name: customerName,
    customer_email: customerEmail,
    is_subscription: isSubscription.toString(),
    service_category: serviceCategory,
    service_items: JSON.stringify(items),
  }
});
```

### **Step 2: Payment Completes**
- Customer redirected to success page
- Session ID in URL: `?session_id=cs_test_abc123`

### **Step 3: Customer Books Pickup**
- Fills out booking form
- Selects pickup date (e.g., Wednesday, Dec 11)
- Submits form

### **Step 4: Booking Saves to Database**
```javascript
// Saves to bookings table
{
  pickup_date: "2024-12-11",
  pickup_time: "morning",
  weekly_pickup_day: "Wednesday",
  address: "123 Main St",
  // ... other fields
}
```

### **Step 5: Stripe Gets Updated** ⭐
```javascript
// Calls /api/update-stripe-booking
// Updates Payment Intent, Customer, and Session
```

---

## 🔧 Implementation Files

### **1. API Endpoint** ✅ (Already Created)
**File**: `api/update-stripe-booking.js`

**What it does:**
- Receives booking information
- Updates Payment Intent metadata
- Updates Customer metadata
- Updates Session metadata
- Returns success/failure

### **2. BookingPage** ✅ (Already Updated)
**File**: `src/pages/BookingPage.tsx`

**What it does:**
- Saves booking to database
- Calls Stripe update API
- Handles errors gracefully
- Shows success message

---

## 📍 Where to Find Data in Stripe

### **View Payment Intent:**
1. Go to: Stripe Dashboard → Payments
2. Click on a payment
3. Scroll to "Metadata" section
4. See: `weekly_pickup_day`, `pickup_date`, etc.

### **View Customer:**
1. Go to: Stripe Dashboard → Customers
2. Click on a customer
3. Scroll to "Metadata" section
4. See: `weekly_pickup_day`, `subscription_active`, etc.

### **View Session:**
1. Go to: Stripe Dashboard → Payments
2. Click on a payment
3. Click "View checkout session"
4. Scroll to "Metadata" section
5. See: All checkout + booking metadata

---

## 🎯 Benefits of This Approach

### ✅ **Simpler**
- One API call after booking
- No complex timing logic
- Easy to understand

### ✅ **Complete Data**
- All booking info in Stripe
- Customer profile updated
- Payment record complete

### ✅ **Redundant**
- Data in Payment Intent
- Data in Customer record
- Data in Session
- Data in your database

### ✅ **Recoverable**
- If database fails, Stripe has everything
- If Stripe fails, database has everything
- Can sync between them anytime

---

## 🔍 Querying Stripe Data

### **Get Customer's Weekly Day:**
```javascript
const customer = await stripe.customers.retrieve('cus_xxx');
console.log(customer.metadata.weekly_pickup_day); // "Wednesday"
console.log(customer.metadata.subscription_active); // "true"
```

### **Get Payment Details:**
```javascript
const paymentIntent = await stripe.paymentIntents.retrieve('pi_xxx');
console.log(paymentIntent.metadata.weekly_pickup_day); // "Wednesday"
console.log(paymentIntent.metadata.pickup_time); // "morning"
```

### **List All Subscription Customers:**
```javascript
const customers = await stripe.customers.list({
  limit: 100,
});

const subscriptionCustomers = customers.data.filter(
  c => c.metadata.subscription_active === 'true'
);
```

---

## 🛡️ Error Handling

The implementation includes graceful error handling:

```javascript
try {
  await fetch('/api/update-stripe-booking', { ... });
} catch (stripeError) {
  console.error('Failed to update Stripe metadata:', stripeError);
  // Booking still succeeds even if Stripe update fails
  // Database has the data, can sync to Stripe later
}
```

**Why this matters:**
- Booking never fails due to Stripe issues
- Customer experience not affected
- Can manually sync Stripe later if needed
- Database is source of truth

---

## 📋 Testing Checklist

### **Test Subscription Flow:**
- [ ] Add weekly service to cart
- [ ] Complete Stripe checkout
- [ ] Verify session metadata has initial data
- [ ] Book pickup with date selection
- [ ] Verify booking saves to database
- [ ] Check Stripe Payment Intent metadata
- [ ] Check Stripe Customer metadata
- [ ] Check Stripe Session metadata
- [ ] Verify all three have `weekly_pickup_day`

### **Test Regular (Non-Subscription) Flow:**
- [ ] Add one-time service to cart
- [ ] Complete checkout
- [ ] Book pickup
- [ ] Verify `weekly_pickup_day` is null/empty
- [ ] Verify `subscription_active` is false

### **Test Error Scenarios:**
- [ ] Simulate Stripe API failure
- [ ] Verify booking still completes
- [ ] Check database has correct data
- [ ] Verify error is logged but not shown to user

---

## 🚀 Deployment Notes

### **Environment Variables Required:**
```env
STRIPE_SECRET_KEY=sk_live_...  # Use live key in production
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### **API Endpoint Location:**
- Vercel: Place in `/api/` folder
- Netlify: Place in `/netlify/functions/` folder
- Other: Configure according to your hosting

### **CORS Configuration:**
If API is on different domain, add CORS headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
res.setHeader('Access-Control-Allow-Methods', 'POST');
```

---

## 📊 Database + Stripe = Complete Picture

### **For Weekly Pickups:**
```sql
-- Query your database
SELECT 
  b.email,
  b.weekly_pickup_day,
  b.pickup_time,
  b.address,
  p.stripe_session_id
FROM bookings b
JOIN payments p ON p.id = b.payment_id
WHERE b.weekly_pickup_day = 'Monday';
```

Then cross-reference with Stripe:
```javascript
// Get customer details from Stripe
const customer = await stripe.customers.retrieve(customerId);
console.log(customer.metadata.weekly_pickup_day); // Verify it matches
```

---

## ✅ Summary

**What You Have Now:**
1. ✅ API endpoint to update Stripe after booking
2. ✅ BookingPage calls API automatically
3. ✅ Data stored in 3 places in Stripe
4. ✅ Data stored in database
5. ✅ Graceful error handling
6. ✅ Complete redundancy

**What You Need to Do:**
1. Deploy the API endpoint
2. Test the complete flow
3. Verify data in Stripe dashboard
4. Verify data in Supabase

**That's it!** Simple, reliable, and fully redundant. 🎉
