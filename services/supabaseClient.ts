import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// We check import.meta.env first (standard Vite)
// Then we check process.env which is injected by our vite.config.ts define for Netlify support.

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase Variables missing. The app will load but database calls will fail.");
    console.warn("Please ensure SUPABASE_URL and SUPABASE_KEY are set in your Netlify Site Settings.");
}

// Fallback to prevent crash during initialization
// We use a valid-looking URL structure to ensure createClient doesn't throw immediately
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseKey || 'placeholder';

export const supabase = createClient(url, key);