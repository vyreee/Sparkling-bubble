-- =====================================================
-- Initial Database Setup for Laundry Service
-- Migration: 001_initial_setup
-- Created: 2024
-- =====================================================

-- =====================================================
-- 1. CREATE PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payments (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Customer Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Service Details
  service_type TEXT NOT NULL CHECK (service_type IN ('small', 'medium', 'large', 'subscription')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  
  -- Payment Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_status TEXT,
  
  -- Stripe Integration
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  stripe_customer_id TEXT,
  
  -- Additional Information
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Soft Delete
  deleted_at TIMESTAMPTZ
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON public.payments(stripe_session_id) WHERE stripe_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent ON public.payments(stripe_payment_intent) WHERE stripe_payment_intent IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_service_type ON public.payments(service_type);
CREATE INDEX IF NOT EXISTS idx_payments_deleted_at ON public.payments(deleted_at) WHERE deleted_at IS NULL;

-- =====================================================
-- 3. CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. ATTACH TRIGGER TO PAYMENTS TABLE
-- =====================================================
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES
-- =====================================================

-- Policy: Allow anonymous users to INSERT payment records
-- (When customer fills out payment form)
CREATE POLICY "Allow anonymous inserts"
  ON public.payments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow service role to SELECT all records
-- (For webhooks and admin operations)
CREATE POLICY "Allow service role full access"
  ON public.payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to view their own payments
-- (Optional: if you add authentication later)
CREATE POLICY "Allow users to view own payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- =====================================================
-- 7. CREATE BOOKINGS TABLE (Optional)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Customer Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  
  -- Booking Details
  service_type TEXT NOT NULL,
  pickup_date DATE,
  pickup_time TEXT,
  special_instructions TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  
  -- Link to payment (optional)
  payment_id BIGINT REFERENCES public.payments(id),
  
  -- Additional
  metadata JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ
);

-- =====================================================
-- 8. CREATE INDEXES FOR BOOKINGS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date ON public.bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON public.bookings(payment_id);

-- =====================================================
-- 9. ATTACH TRIGGER TO BOOKINGS TABLE
-- =====================================================
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 10. ENABLE RLS ON BOOKINGS
-- =====================================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 11. CREATE RLS POLICIES FOR BOOKINGS
-- =====================================================

-- Policy: Allow anonymous users to INSERT bookings
CREATE POLICY "Allow anonymous booking inserts"
  ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow service role full access
CREATE POLICY "Allow service role full booking access"
  ON public.bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to view their own bookings
CREATE POLICY "Allow users to view own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- =====================================================
-- 12. CREATE FUNCTION TO GET PAYMENT STATISTICS
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_payment_stats(
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  total_payments BIGINT,
  total_revenue NUMERIC,
  avg_order_value NUMERIC,
  completed_payments BIGINT,
  pending_payments BIGINT,
  failed_payments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_payments,
    COALESCE(SUM(amount), 0) as total_revenue,
    COALESCE(AVG(amount), 0) as avg_order_value,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_payments,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_payments,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failed_payments
  FROM public.payments
  WHERE created_at BETWEEN start_date AND end_date
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 13. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant permissions on tables
GRANT SELECT, INSERT ON public.payments TO anon;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.payments TO authenticated;

GRANT SELECT, INSERT ON public.bookings TO anon;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.bookings TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- =====================================================
-- 14. ADD HELPFUL COMMENTS
-- =====================================================
COMMENT ON TABLE public.payments IS 'Stores payment transactions from Stripe checkout';
COMMENT ON TABLE public.bookings IS 'Stores laundry service booking requests';
COMMENT ON COLUMN public.payments.stripe_session_id IS 'Stripe checkout session ID';
COMMENT ON COLUMN public.payments.stripe_payment_intent IS 'Stripe payment intent ID for tracking';
COMMENT ON COLUMN public.payments.metadata IS 'Additional flexible data stored as JSON';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
