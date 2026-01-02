import { createClient } from '@supabase/supabase-js';

// Access environment variables safely by casting import.meta to avoid TS errors
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Missing Supabase Environment Variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your Netlify Site Settings.");
}

// Fallback to prevent app crash if keys are missing (White Screen of Death fix)
// The calls will still fail, but the UI will render.
const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(url, key);