import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// We check import.meta.env first (standard Vite)
// Then we check process.env which is injected by our vite.config.ts define for Netlify support.

// Helper to safely get env vars without crashing if objects are undefined
const getEnv = (key: string) => {
  let val = '';
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      val = import.meta.env[key];
    }
  } catch (e) {}

  if (!val) {
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env) {
        // @ts-ignore
        val = process.env[key];
      }
    } catch (e) {}
  }
  return val;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_KEY') || getEnv('SUPABASE_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase Variables missing. The app will load but database calls will fail.");
    console.warn("Please ensure SUPABASE_URL and SUPABASE_KEY are set in your Netlify Site Settings.");
}

// Fallback to prevent crash during initialization
// We use a valid-looking URL structure to ensure createClient doesn't throw immediately
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseKey || 'placeholder';

export const supabase = createClient(url, key);