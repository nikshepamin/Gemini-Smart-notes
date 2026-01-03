import { createClient } from '@supabase/supabase-js';

// 1. Try to get keys from Vite Environment Variables (Production)
// 2. Fallback to process.env replacement (from vite.config.ts)
// 3. Fallback to hardcoded strings (for local dev without env setup)

const getUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) {
    // @ts-ignore
    return process.env.SUPABASE_URL;
  }
  return 'https://kvuqivoenfprfvlrkchx.supabase.co';
};

const getKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_KEY) {
    return import.meta.env.VITE_SUPABASE_KEY;
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.SUPABASE_KEY) {
    // @ts-ignore
    return process.env.SUPABASE_KEY;
  }
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dXFpdm9lbmZwcmZ2bHJrY2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjE2NTUsImV4cCI6MjA4MjkzNzY1NX0.njGR_m0_FrVG98o-ctNmFICSq92b3fqby6exrllbiXk';
};

const supabaseUrl = getUrl();
const supabaseKey = getKey();

export const isConfigured = !!supabaseUrl && !!supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);