/*
  # Create Bookings and Payments Tables

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `name` (text) - Customer full name
      - `email` (text) - Customer email address
      - `phone` (text) - Customer phone number
      - `address` (text) - Pickup/delivery address
      - `service_type` (text) - Type of service (small, medium, large, subscription)
      - `pickup_date` (date) - Requested pickup date
      - `pickup_time` (text) - Preferred time slot
      - `notes` (text, nullable) - Special instructions
      - `status` (text) - Booking status (pending, confirmed, completed, cancelled)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `payments`
      - `id` (uuid, primary key)
      - `name` (text) - Customer full name
      - `email` (text) - Customer email address
      - `phone` (text) - Customer phone number
      - `service_type` (text) - Type of service paid for
      - `quantity` (integer) - Number of bags/services
      - `amount` (numeric) - Total payment amount
      - `status` (text) - Payment status (pending, completed, failed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admin users to manage records
    - Allow public insert for customer submissions
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  service_type text NOT NULL,
  pickup_date date NOT NULL,
  pickup_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies for bookings table
CREATE POLICY "Allow public to insert bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for payments table
CREATE POLICY "Allow public to insert payments"
  ON payments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
