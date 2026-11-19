const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Ensure WebSocket is defined for all Node.js environments (< 22)
if (typeof globalThis.WebSocket === 'undefined') {
    try {
        globalThis.WebSocket = require('ws');
    } catch (e) {
        // Lightweight mock for headless / CI environments where realtime is unused
        globalThis.WebSocket = class MockWebSocket {
            constructor(url) { this.url = url; }
            addEventListener() {}
            removeEventListener() {}
            send() {}
            close() {}
        };
    }
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase environment variables missing in .env file!');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

module.exports = supabase;
