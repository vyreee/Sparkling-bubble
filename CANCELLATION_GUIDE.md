# 📧 Subscription Cancellation Guide

## Important Policy

**Individual Pickups:** Cannot be cancelled once scheduled  
**Weekly Subscriptions:** Can be cancelled anytime via email

---

## Customer Cancellation Process

Customers can cancel their **weekly subscription** by emailing: **info@freshncleanlaundry.com**

They should include:
- Name
- Email used for subscription
- Subscription type (Small/Medium/Large Weekly)
- Reason for cancellation (optional)

---

## How to Cancel Subscriptions

### **Step 1: Find the Subscription in Stripe**

1. Go to: https://dashboard.stripe.com/subscriptions
2. Search for customer by:
   - Email
   - Name
   - Subscription ID

### **Step 2: Cancel the Subscription**

1. Click on the subscription
2. Click **"Cancel subscription"** button
3. Choose cancellation timing:
   - **Immediately** - Stops now, no more charges
   - **At period end** - Completes current billing cycle
4. Add cancellation reason (optional)
5. Click **"Cancel subscription"**

### **Step 3: Update Database (Optional)**

If you're tracking subscriptions in Supabase:
1. Go to `payments` table
2. Find the subscription payment
3. Update `status` to `cancelled`

### **Step 4: No Refund Needed**

Subscriptions are **not refunded** when cancelled. They simply stop future billing.

- If cancelled **immediately**: No more charges
- If cancelled **at period end**: One final charge, then stops

### **Step 5: Notify Customer**

Send email confirmation:
```
Subject: Subscription Cancelled - Fresh N Clean Laundry

Hi [Name],

Your weekly laundry subscription has been cancelled as requested.

[If immediate]
Your subscription has been cancelled immediately. You will not be charged again.

[If at period end]
Your subscription will remain active until [End Date], then automatically cancel. 
You will not be charged after this date.

We're sorry to see you go! If you'd like to resume service in the future, 
simply visit our website and start a new subscription.

Thank you for choosing Fresh N Clean Laundry!

Fresh N Clean Laundry Team
info@freshncleanlaundry.com
```

---

## Quick SQL Queries

### **Find Subscription Payments:**
```sql
SELECT * FROM payments 
WHERE email = 'customer@example.com' 
AND service_type LIKE '%subscription%'
ORDER BY created_at DESC;
```

### **Mark Subscription as Cancelled:**
```sql
UPDATE payments 
SET status = 'cancelled', updated_at = now()
WHERE email = 'customer@example.com'
AND service_type LIKE '%subscription%';
```

---

## Cancellation Policy

**Individual Pickups:**
- ❌ No cancellations once scheduled
- ❌ No refunds for scheduled pickups
- ✅ Customer must ensure date/time works before booking

**Weekly Subscriptions:**
- ✅ Can cancel anytime via email
- ✅ Cancel immediately or at period end
- ❌ No refunds for past charges
- ✅ Simply stops future billing

---

## Tips

✅ **Respond quickly** - Process cancellations within 24 hours  
✅ **Be flexible** - Happy customers return  
✅ **Track reasons** - Note why they cancelled (helps improve service)  
✅ **Offer reschedule** - Suggest rebooking instead of cancelling  

---

## Need Help?

- **Stripe Refunds:** https://stripe.com/docs/refunds
- **Supabase Docs:** https://supabase.com/docs
- **Your Dashboard:** https://dashboard.stripe.com

---

**Remember:** Always update both the `bookings` status AND process the Stripe refund if payment was made!
