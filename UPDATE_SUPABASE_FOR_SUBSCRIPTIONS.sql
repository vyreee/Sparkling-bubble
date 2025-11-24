-- Add subscription tracking column to payments table
-- Run this in Supabase SQL Editor

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_payments_stripe_subscription_id 
ON payments(stripe_subscription_id) 
WHERE stripe_subscription_id IS NOT NULL;

-- Add comment
COMMENT ON COLUMN payments.stripe_subscription_id IS 'Stripe subscription ID for recurring payments';
