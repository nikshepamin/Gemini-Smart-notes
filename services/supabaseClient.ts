import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = 'https://kvuqivoenfprfvlrkchx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dXFpdm9lbmZwcmZ2bHJrY2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjE2NTUsImV4cCI6MjA4MjkzNzY1NX0.njGR_m0_FrVG98o-ctNmFICSq92b3fqby6exrllbiXk';

export const isConfigured = true;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);