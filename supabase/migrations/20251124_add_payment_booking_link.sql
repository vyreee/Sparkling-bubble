/*
  # Link Payments and Bookings

  This migration adds columns to link payments with bookings:
  - Add stripe_session_id to payments table
  - Add payment_id and stripe_session_id to bookings table
  - Create indexes for better query performance
*/

-- Add stripe_session_id to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- Add payment linking columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES payments(id),
ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON bookings(payment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);

-- Add comment explaining the relationship
COMMENT ON COLUMN bookings.payment_id IS 'Links to the payment record for this booking';
COMMENT ON COLUMN bookings.stripe_session_id IS 'Stripe checkout session ID for linking payment to booking';
COMMENT ON COLUMN payments.stripe_session_id IS 'Stripe checkout session ID for tracking payments';
