-- =====================================================
-- VERIFY MIGRATION SUCCESS
-- Run this after your migration to check everything
-- =====================================================

-- 1. Check tables exist
SELECT 
  '✓ Tables' as check_name,
  CASE 
    WHEN COUNT(*) >= 2 THEN 'PASS - Found ' || COUNT(*) || ' tables'
    ELSE 'FAIL - Only found ' || COUNT(*) || ' tables'
  END as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- 2. Check columns in payments table
SELECT 
  '✓ Payment Columns' as check_name,
  CASE 
    WHEN COUNT(*) >= 15 THEN 'PASS - Found ' || COUNT(*) || ' columns'
    ELSE 'FAIL - Only found ' || COUNT(*) || ' columns'
  END as result
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'payments';

-- 3. Check indexes exist
SELECT 
  '✓ Indexes' as check_name,
  CASE 
    WHEN COUNT(*) >= 7 THEN 'PASS - Found ' || COUNT(*) || ' indexes'
    ELSE 'FAIL - Only found ' || COUNT(*) || ' indexes'
  END as result
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('payments', 'bookings');

-- 4. Check RLS is enabled
SELECT 
  '✓ Row Level Security' as check_name,
  CASE 
    WHEN COUNT(*) >= 2 THEN 'PASS - RLS enabled on ' || COUNT(*) || ' tables'
    ELSE 'FAIL - RLS not enabled properly'
  END as result
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true;

-- 5. Check policies exist
SELECT 
  '✓ Security Policies' as check_name,
  CASE 
    WHEN COUNT(*) >= 6 THEN 'PASS - Found ' || COUNT(*) || ' policies'
    ELSE 'FAIL - Only found ' || COUNT(*) || ' policies'
  END as result
FROM pg_policies 
WHERE schemaname = 'public';

-- 6. Check function exists
SELECT 
  '✓ Functions' as check_name,
  CASE 
    WHEN COUNT(*) >= 2 THEN 'PASS - Found ' || COUNT(*) || ' functions'
    ELSE 'FAIL - Only found ' || COUNT(*) || ' functions'
  END as result
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('update_updated_at_column', 'get_payment_stats');

-- =====================================================
-- DETAILED TABLE STRUCTURE
-- =====================================================

-- Show payments table structure
SELECT 
  'payments' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'payments'
ORDER BY ordinal_position;

-- Show bookings table structure
SELECT 
  'bookings' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'bookings'
ORDER BY ordinal_position;

-- =====================================================
-- LIST ALL POLICIES
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- SUMMARY
-- =====================================================
SELECT 
  '🎉 Migration Verification Complete!' as message,
  'Check the results above. All checks should show PASS.' as note;
