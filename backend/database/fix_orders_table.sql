-- ============================================================
-- NutriRoute: ORDERS TABLE FIX (UUID user_id version)
-- Run this ENTIRE script in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Drop existing orders table if it exists
DROP TABLE IF EXISTS public.orders CASCADE;

-- Step 3: Check what type users.id actually is (for reference)
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'users' AND column_name = 'id';

-- Step 4: Create orders table with UUID user_id (matches Supabase users.id = UUID)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(6, 2) NOT NULL DEFAULT 40.00,
    total_calories INT DEFAULT 0,
    delivery_address TEXT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    delivery_notes TEXT,
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    order_status VARCHAR(50) DEFAULT 'Preparing',
    rider_name VARCHAR(100) DEFAULT 'Suresh Kumar',
    rider_phone VARCHAR(20) DEFAULT '+91 98450 12345',
    rider_lat NUMERIC(9, 6) DEFAULT 12.9716,
    rider_lng NUMERIC(9, 6) DEFAULT 77.5946,
    estimated_delivery_minutes INT DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- Step 6: Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User Manage Own Orders" ON public.orders;
CREATE POLICY "User Manage Own Orders" ON public.orders
    FOR ALL USING (true) WITH CHECK (true);

-- Step 7: Grant permissions
GRANT ALL ON public.orders TO anon;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- Step 8: Verify - this should show all columns of orders table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'orders'
ORDER BY ordinal_position;
