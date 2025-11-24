/*
  # Add Subscription Tracking to Payments Table
  
  This migration adds columns to track subscription/weekly services
  so we can identify recurring customers and their weekly pickup days.
  
  New Columns:
  - service_category: Tracks the type (regular, weekly, senior, senior_weekly)
  - is_subscription: Boolean flag for quick subscription identification
  - service_items: JSON array of all cart items purchased
  - weekly_pickup_day: The day of week for recurring pickups (e.g., "Monday")
*/

-- Add subscription tracking columns
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS service_category TEXT,
ADD COLUMN IF NOT EXISTS is_subscription BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS service_items JSONB,
ADD COLUMN IF NOT EXISTS weekly_pickup_day TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_is_subscription 
ON payments(is_subscription) 
WHERE is_subscription = true;

CREATE INDEX IF NOT EXISTS idx_payments_service_category 
ON payments(service_category);

CREATE INDEX IF NOT EXISTS idx_payments_weekly_pickup_day 
ON payments(weekly_pickup_day)
WHERE weekly_pickup_day IS NOT NULL;

-- Add comments explaining the columns
COMMENT ON COLUMN payments.service_category IS 'Service category: regular, weekly, senior, senior_weekly, bundle';
COMMENT ON COLUMN payments.is_subscription IS 'True if this is a recurring/weekly subscription service';
COMMENT ON COLUMN payments.service_items IS 'JSON array of all cart items purchased with full details';
COMMENT ON COLUMN payments.weekly_pickup_day IS 'Day of week for recurring pickups (Monday, Tuesday, etc.)';

-- Add weekly_pickup_day to bookings table as well
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS weekly_pickup_day TEXT;

COMMENT ON COLUMN bookings.weekly_pickup_day IS 'Day of week extracted from pickup_date for subscription services';
