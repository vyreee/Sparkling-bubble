-- Add subscription and customer tracking columns to payments table
-- Run this in Supabase SQL Editor

-- Add subscription ID column
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add customer ID column
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_payments_stripe_subscription_id 
ON payments(stripe_subscription_id) 
WHERE stripe_subscription_id IS NOT NULL;

-- Add index for customer lookups
CREATE INDEX IF NOT EXISTS idx_payments_stripe_customer_id 
ON payments(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

-- Add comments
COMMENT ON COLUMN payments.stripe_subscription_id IS 'Stripe subscription ID for recurring payments';
COMMENT ON COLUMN payments.stripe_customer_id IS 'Stripe customer ID for tracking customer history';
