# 📊 Subscription Data Storage - Complete Reference

## ✅ What's Been Implemented

### 1. **Database Migration Created**
**File**: `supabase/migrations/20241124_add_subscription_tracking.sql`

**New Columns Added:**

#### `payments` table:
- `service_category` (TEXT) - Type: regular, weekly, senior, senior_weekly, bundle
- `is_subscription` (BOOLEAN) - Quick flag: true/false
- `service_items` (JSONB) - Full cart array with all details
- `weekly_pickup_day` (TEXT) - Day name: Monday, Tuesday, etc.

#### `bookings` table:
- `weekly_pickup_day` (TEXT) - Day name extracted from pickup_date

### 2. **BookingPage Updated**
**File**: `src/pages/BookingPage.tsx`

**New Features:**
- ✅ Detects subscription services from cart
- ✅ Shows notification with selected weekly day
- ✅ Saves `weekly_pickup_day` to bookings table
- ✅ Updates payment record with weekly day
- ✅ Custom success message for subscriptions

---

## 🔄 Complete Data Flow

### Step 1: Customer Adds to Cart
```javascript
Cart Item: {
  name: "Medium Bag - Weekly",
  price: 30,
  quantity: 1,
  type: "service",
  category: "weekly",  // ← Key identifier
  description: "Up to ≈20 lb"
}
```

### Step 2: Checkout (Your Stripe API)
```javascript
// Send to /api/create-checkout-session
POST Body: {
  items: [...cart items...],
  customerEmail: "john@example.com",
  customerName: "John Doe",
  customerPhone: "555-1234"
}

// Your API should:
1. Detect subscription: items.some(i => i.category?.includes('weekly'))
2. Create Stripe session with metadata
3. Save to Supabase payments table
```

### Step 3: Stripe Session Metadata
```javascript
metadata: {
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "555-1234",
  is_subscription: "true",
  service_category: "weekly",
  service_items: '[{...full cart...}]',
  primary_service: "Medium Bag - Weekly",
  primary_price: "30"
}
```

### Step 4: Database Record (payments)
```javascript
{
  stripe_session_id: "cs_test_abc123",
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
  service_type: "Medium Bag - Weekly",
  service_category: "weekly",        // ← NEW
  is_subscription: true,              // ← NEW
  service_items: [{...}],             // ← NEW
  weekly_pickup_day: null,            // ← Set later
  amount: 30,
  status: "completed"
}
```

### Step 5: Customer Books Pickup
- Selects date: December 11, 2024 (Wednesday)
- Sees notification: "Your weekly pickup day: **Wednesday**"
- Submits booking

### Step 6: Database Record (bookings)
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  pickup_date: "2024-12-11",
  pickup_time: "morning",
  weekly_pickup_day: "Wednesday",     // ← SAVED
  payment_id: "uuid-of-payment",
  stripe_session_id: "cs_test_abc123"
}
```

### Step 7: Payment Record Updated
```javascript
// payments table updated with:
{
  weekly_pickup_day: "Wednesday"      // ← UPDATED
}
```

---

## 📍 Where to Find Subscription Data

### **Stripe Dashboard:**
1. Go to: Payments → [Select Payment]
2. Scroll to: "Metadata" section
3. See:
   - `is_subscription: "true"`
   - `service_category: "weekly"`
   - `service_items: "[...]"`
   - `weekly_pickup_day: "Wednesday"` (after booking)

### **Supabase Database:**

#### Get all subscription customers:
```sql
SELECT 
  email,
  name,
  service_category,
  weekly_pickup_day,
  created_at
FROM payments
WHERE is_subscription = true
ORDER BY created_at DESC;
```

#### Get customers by weekly day:
```sql
SELECT 
  p.name,
  p.email,
  p.phone,
  b.address,
  b.pickup_time,
  b.weekly_pickup_day
FROM payments p
JOIN bookings b ON b.payment_id = p.id
WHERE b.weekly_pickup_day = 'Monday'
AND p.is_subscription = true;
```

#### Get full subscription details:
```sql
SELECT 
  p.email,
  p.service_category,
  p.service_items,
  p.weekly_pickup_day,
  p.amount,
  b.address,
  b.pickup_time,
  b.notes
FROM payments p
LEFT JOIN bookings b ON b.payment_id = p.id
WHERE p.is_subscription = true;
```

---

## 🎯 What You Can Do With This Data

### **Schedule Weekly Pickups:**
```sql
-- Get all Monday pickups
SELECT * FROM bookings 
WHERE weekly_pickup_day = 'Monday'
AND status != 'cancelled';
```

### **Send Reminders:**
```sql
-- Get customers for tomorrow's pickups
SELECT 
  email,
  name,
  phone,
  address,
  pickup_time
FROM bookings
WHERE weekly_pickup_day = 'Tuesday'  -- If tomorrow is Tuesday
AND status = 'confirmed';
```

### **Revenue Reports:**
```sql
-- Total subscription revenue
SELECT 
  COUNT(*) as subscription_count,
  SUM(amount) as total_revenue
FROM payments
WHERE is_subscription = true;
```

### **Customer Segmentation:**
```sql
-- Group by service category
SELECT 
  service_category,
  COUNT(*) as customer_count,
  AVG(amount) as avg_order_value
FROM payments
WHERE is_subscription = true
GROUP BY service_category;
```

---

## 🔧 Implementation Steps

### ✅ Step 1: Run Database Migration
```bash
# In Supabase SQL Editor, run:
supabase/migrations/20241124_add_subscription_tracking.sql
```

### ✅ Step 2: Update Stripe API
See: `STRIPE_INTEGRATION_GUIDE.md` for complete code

Key changes:
1. Add metadata to Stripe session
2. Save to Supabase with new columns
3. Handle subscription detection

### ✅ Step 3: Already Done!
- BookingPage detects subscriptions ✅
- Shows notification to customer ✅
- Saves weekly_pickup_day ✅
- Updates payment record ✅

---

## 🛡️ Redundancy Strategy

### If Database Fails:
1. All data is in Stripe metadata
2. Can recover from Stripe dashboard
3. Export Stripe data and reimport

### If Stripe Fails:
1. All data is in Supabase
2. Operations continue normally
3. Can sync back to Stripe later

### Both Working (Normal):
1. Cross-reference for accuracy
2. Audit trail in both systems
3. Easy reporting from either source

---

## 📋 Quick Checklist

- [ ] Run database migration SQL
- [ ] Update `/api/create-checkout-session` endpoint
- [ ] Add Stripe metadata (see guide)
- [ ] Save to Supabase with new columns
- [ ] Test subscription purchase
- [ ] Verify data in Stripe dashboard
- [ ] Verify data in Supabase
- [ ] Test booking with subscription
- [ ] Confirm weekly_pickup_day is saved
- [ ] Test SQL queries for reporting

---

## 🎉 You're All Set!

Your system now stores subscription information in **both Stripe and your database** with complete redundancy!

**Files Created:**
1. `supabase/migrations/20241124_add_subscription_tracking.sql` - Database schema
2. `STRIPE_INTEGRATION_GUIDE.md` - Complete API implementation
3. `SUBSCRIPTION_DATA_STORAGE.md` - This reference guide

**Files Updated:**
1. `src/pages/BookingPage.tsx` - Saves weekly pickup day

**Next:** Update your Stripe API endpoint following the integration guide!
