# 🗄️ Database Migration Guide

Complete guide to setting up your Supabase database from scratch.

---

## 📋 What This Migration Creates

### Tables:
1. **`payments`** - Stores all payment transactions
2. **`bookings`** - Stores laundry service booking requests (optional)

### Features:
- ✅ Automatic `updated_at` timestamps
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes
- ✅ Data validation constraints
- ✅ Payment statistics function
- ✅ Soft delete support
- ✅ Stripe integration fields

---

## 🚀 Method 1: Run Via Supabase Dashboard (Easiest)

### Step 1: Open SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Run Migration

1. Open the file: `supabase/migrations/001_initial_setup.sql`
2. **Copy the entire contents** of the file
3. **Paste** it into the SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)

### Step 3: Verify Success

You should see:
```
Success. No rows returned
```

Check that tables were created:
```sql
-- Run this to verify
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `payments`
- `bookings`

---

## 🔧 Method 2: Run Via Supabase CLI (Advanced)

### Step 1: Install Supabase CLI

```bash
# Windows (with Chocolatey)
choco install supabase

# Or download from: https://github.com/supabase/cli/releases
```

### Step 2: Link to Your Project

```bash
cd project
supabase login
supabase link --project-ref your-project-ref
```

**To get your project ref:**
- Go to Project Settings → General
- Copy the "Reference ID"

### Step 3: Run Migration

```bash
supabase db push
```

---

## 📊 What Each Table Contains

### `payments` Table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| created_at | TIMESTAMP | When payment was created |
| updated_at | TIMESTAMP | Last update time |
| name | TEXT | Customer name |
| email | TEXT | Customer email |
| phone | TEXT | Customer phone |
| service_type | TEXT | small, medium, large, subscription |
| quantity | INTEGER | Number of bags |
| amount | DECIMAL | Total amount in dollars |
| status | TEXT | pending, completed, failed, etc. |
| payment_status | TEXT | Stripe payment status |
| stripe_session_id | TEXT | Unique Stripe checkout session ID |
| stripe_payment_intent | TEXT | Stripe payment intent ID |
| stripe_customer_id | TEXT | Stripe customer ID |
| notes | TEXT | Optional notes |
| metadata | JSONB | Additional flexible data |
| deleted_at | TIMESTAMP | For soft deletes |

### `bookings` Table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| created_at | TIMESTAMP | When booking was created |
| updated_at | TIMESTAMP | Last update time |
| name | TEXT | Customer name |
| email | TEXT | Customer email |
| phone | TEXT | Customer phone |
| address | TEXT | Pickup address |
| service_type | TEXT | Service requested |
| pickup_date | DATE | Requested pickup date |
| pickup_time | TEXT | Requested pickup time |
| special_instructions | TEXT | Customer notes |
| status | TEXT | pending, confirmed, completed, etc. |
| payment_id | BIGINT | Link to payment record |
| metadata | JSONB | Additional flexible data |
| deleted_at | TIMESTAMP | For soft deletes |

---

## 🔒 Security Policies (RLS)

### For `payments` table:

1. **Anonymous users** (anon):
   - ✅ Can INSERT (create payment records)
   - ❌ Cannot SELECT (read)
   - ❌ Cannot UPDATE
   - ❌ Cannot DELETE

2. **Service role** (your backend):
   - ✅ Full access (for webhooks)

3. **Authenticated users**:
   - ✅ Can view their own payments (matched by email)

### For `bookings` table:

Same structure as payments - anonymous can insert, authenticated can view their own.

---

## 🧪 Test Your Database

After running the migration, test it works:

```sql
-- Test 1: Insert a test payment
INSERT INTO public.payments (name, email, service_type, quantity, amount, status)
VALUES ('Test Customer', 'test@example.com', 'small', 1, 25.00, 'pending');

-- Test 2: Query payments
SELECT * FROM public.payments ORDER BY created_at DESC LIMIT 5;

-- Test 3: Get payment statistics
SELECT * FROM public.get_payment_stats();

-- Test 4: Clean up test data
DELETE FROM public.payments WHERE email = 'test@example.com';
```

---

## 📈 Useful Database Functions

### Get Payment Statistics

```sql
-- Get stats for last 30 days (default)
SELECT * FROM public.get_payment_stats();

-- Get stats for custom date range
SELECT * FROM public.get_payment_stats(
  '2024-01-01'::timestamptz,
  '2024-12-31'::timestamptz
);
```

Returns:
- `total_payments` - Count of all payments
- `total_revenue` - Sum of all amounts
- `avg_order_value` - Average payment amount
- `completed_payments` - Count of successful payments
- `pending_payments` - Count of pending payments
- `failed_payments` - Count of failed payments

---

## 🔍 Helpful Queries

### View Recent Payments
```sql
SELECT 
  id,
  name,
  email,
  service_type,
  amount,
  status,
  created_at
FROM public.payments
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;
```

### Find Payments by Email
```sql
SELECT * FROM public.payments
WHERE email = 'customer@example.com'
AND deleted_at IS NULL
ORDER BY created_at DESC;
```

### Get Completed Payments
```sql
SELECT 
  COUNT(*) as count,
  SUM(amount) as total_revenue
FROM public.payments
WHERE status = 'completed'
AND deleted_at IS NULL;
```

### View Stripe Session Details
```sql
SELECT 
  id,
  name,
  email,
  stripe_session_id,
  stripe_payment_intent,
  amount,
  status
FROM public.payments
WHERE stripe_session_id IS NOT NULL
ORDER BY created_at DESC;
```

---

## 🔄 Future Migrations

If you need to make changes later, create new migration files:

```
supabase/migrations/
├── 001_initial_setup.sql          ← Just ran this
├── 002_add_discount_codes.sql     ← Future
├── 003_add_subscriptions.sql      ← Future
└── ...
```

Always number them sequentially and never modify old migrations.

---

## 🆘 Troubleshooting

### Error: "permission denied for schema public"
→ You don't have permissions. Check you're logged in as owner.

### Error: "relation already exists"
→ Table already exists. Either:
- Drop it first: `DROP TABLE payments CASCADE;`
- Or skip that part of the migration

### Error: "out of shared memory"
→ Too many indexes. This shouldn't happen with our migration, but you can run parts separately.

### Error: "function update_updated_at_column already exists"
→ Function exists. You can:
- Use `CREATE OR REPLACE FUNCTION` (already in migration)
- Or drop it: `DROP FUNCTION update_updated_at_column CASCADE;`

### Need to start completely fresh?
```sql
-- ⚠️ WARNING: This deletes EVERYTHING!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Then run the migration again.

---

## ✅ Migration Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Copied entire contents of `001_initial_setup.sql`
- [ ] Ran migration successfully
- [ ] Verified tables exist (`payments`, `bookings`)
- [ ] Tested with a sample INSERT
- [ ] Confirmed Row Level Security is enabled
- [ ] Ready to connect Stripe!

---

## 🎯 Next Steps

After running this migration:

1. ✅ Database is ready!
2. 📝 Update your `.env` file with Supabase credentials
3. 🔑 Get your Stripe Price IDs
4. 🚀 Test the payment flow
5. 🌐 Deploy to production

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

Need help? Just ask! 🚀
