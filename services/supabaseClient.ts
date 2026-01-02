import { createClient } from '@supabase/supabase-js';

// We access these via the 'define' in vite.config.ts or standard import.meta.env
// We cast to any to avoid TypeScript complaining about 'process' if types aren't set up
const getEnvVar = (key: string, viteKey: string) => {
    // Check standard Vite env first
    if (import.meta.env && import.meta.env[viteKey]) {
        return import.meta.env[viteKey];
    }
    // Check injected process.env (from vite.config.ts define)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        // @ts-ignore
        return process.env[key];
    }
    return '';
};

const SUPABASE_URL = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_KEY', 'VITE_SUPABASE_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Missing Supabase Variables. Make sure SUPABASE_URL and SUPABASE_KEY are set in Netlify.");
}

// Fallback to prevent crash during initialization
const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(url, key);