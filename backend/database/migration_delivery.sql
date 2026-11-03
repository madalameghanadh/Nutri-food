-- ==========================================================
-- NutriRoute Delivery System Migration
-- ==========================================================

-- 1. Add price column to foods table
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS price NUMERIC(6, 2) DEFAULT 150.00;

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- 3. Orders Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 4. Orders Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User Manage Own Orders" ON public.orders;
CREATE POLICY "User Manage Own Orders" ON public.orders FOR ALL USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR auth.uid() IS NULL
) WITH CHECK (true);
