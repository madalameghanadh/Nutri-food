/**
 * Direct Supabase orders table creator
 * Uses Supabase Management API + fallback approaches
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

async function checkOrdersTable() {
    console.log('🔍 Checking if orders table exists...');
    const { data, error } = await supabase.from('orders').select('id').limit(1);
    if (error && error.message && error.message.includes('schema cache')) {
        console.log('❌ orders table does NOT exist in schema cache');
        return false;
    }
    if (error) {
        console.log('⚠️ Query error:', error.message);
        return false;
    }
    console.log('✅ orders table EXISTS and is accessible!');
    return true;
}

async function createTableViaManagementAPI() {
    console.log('\n🔧 Attempting via Supabase Management API...');

    const sql = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        DROP TABLE IF EXISTS public.orders CASCADE;
        
        CREATE TABLE public.orders (
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
        
        CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
        
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "User Manage Own Orders" ON public.orders;
        CREATE POLICY "User Manage Own Orders" ON public.orders
            FOR ALL USING (true) WITH CHECK (true);
        
        GRANT ALL ON public.orders TO anon;
        GRANT ALL ON public.orders TO authenticated;
        GRANT ALL ON public.orders TO service_role;
    `;

    try {
        // Method 1: Supabase Management API (needs PAT)
        const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ query: sql })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Management API success:', result);
            return true;
        } else {
            const err = await response.text();
            console.log('⚠️ Management API failed:', response.status, err.substring(0, 200));
            return false;
        }
    } catch (e) {
        console.log('⚠️ Management API error:', e.message);
        return false;
    }
}

async function createTableViaPostgRESTRPC() {
    console.log('\n🔧 Attempting via PostgREST SQL endpoint...');
    try {
        const sql = `SELECT 'create_orders' as action`;

        // Try the pg_query approach via REST
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ sql: sql })
        });

        if (response.ok) {
            console.log('✅ exec_sql RPC available!');
            return true;
        } else {
            console.log('⚠️ exec_sql RPC not available');
            return false;
        }
    } catch (e) {
        console.log('⚠️ PostgREST RPC error:', e.message);
        return false;
    }
}

async function tryDirectSQLEndpoint() {
    console.log('\n🔧 Attempting via Supabase SQL REST endpoint...');
    try {
        const sql = `
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            DROP TABLE IF EXISTS public.orders CASCADE;
            CREATE TABLE public.orders (
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
            ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS "User Manage Own Orders" ON public.orders;
            CREATE POLICY "User Manage Own Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
            GRANT ALL ON public.orders TO anon, authenticated, service_role;
        `;

        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/sql',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: sql
        });

        console.log('SQL endpoint status:', response.status);
        const text = await response.text();
        console.log('Response:', text.substring(0, 300));
        return response.ok;
    } catch (e) {
        console.log('⚠️ Direct SQL error:', e.message);
        return false;
    }
}

async function main() {
    console.log('====================================================');
    console.log('🍃 NutriRoute — Orders Table Fix Script');
    console.log(`📡 Project: ${projectRef}`);
    console.log('====================================================\n');

    // Step 1: Check if already exists
    const exists = await checkOrdersTable();
    if (exists) {
        console.log('\n🎉 orders table is working! No fix needed.');
        console.log('💡 Try refreshing the website and placing order again.');
        return;
    }

    // Step 2: Try Management API
    const method1 = await createTableViaManagementAPI();
    if (method1) {
        const verify = await checkOrdersTable();
        if (verify) {
            console.log('\n✅ SUCCESS! orders table created via Management API!');
            return;
        }
    }

    // Step 3: Try PostgREST RPC
    await createTableViaPostgRESTRPC();

    // Step 4: Try direct SQL endpoint
    await tryDirectSQLEndpoint();

    // Final check
    console.log('\n🔍 Final verification...');
    const finalCheck = await checkOrdersTable();
    if (finalCheck) {
        console.log('✅ SUCCESS! orders table is now accessible!');
    } else {
        console.log('\n❌ Automated creation failed — Supabase requires a Personal Access Token (PAT).');
        console.log('\n📋 MANUAL STEPS (30 seconds):');
        console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
        console.log('2. Copy the SQL from: backend/database/fix_orders_table.sql');
        console.log('3. Paste and click Run ▶');
        console.log('\nOR get your PAT from: https://supabase.com/dashboard/account/tokens');
        console.log('Add it to .env as: SUPABASE_PAT=your_token_here');
        console.log('Then re-run this script.');
    }
}

main().catch(console.error);
