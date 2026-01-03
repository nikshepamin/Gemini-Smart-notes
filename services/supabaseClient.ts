import { createClient } from '@supabase/supabase-js';

// Helper to check for environment variables (supports Vite's import.meta.env and Polyfilled process.env)
const getEnv = (viteKey: string, processKey: string, fallback: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    return import.meta.env[viteKey];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[processKey]) {
    // @ts-ignore
    return process.env[processKey];
  }
  return fallback;
};

// 1. Try to get keys from Environment Variables (Netlify/Vite)
// 2. Fallback to the provided hardcoded keys if Env vars are missing
const supabaseUrl = getEnv(
  'VITE_SUPABASE_URL', 
  'SUPABASE_URL', 
  'https://kvuqivoenfprfvlrkchx.supabase.co'
);

const supabaseKey = getEnv(
  'VITE_SUPABASE_KEY', 
  'SUPABASE_KEY', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dXFpdm9lbmZwcmZ2bHJrY2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjE2NTUsImV4cCI6MjA4MjkzNzY1NX0.njGR_m0_FrVG98o-ctNmFICSq92b3fqby6exrllbiXk'
);

export const isConfigured = !!supabaseUrl && !!supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);