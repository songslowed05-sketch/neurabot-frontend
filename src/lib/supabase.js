import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Apne Supabase Dashboard se lein
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Apne Supabase Dashboard se lein

export const supabase = createClient(supabaseUrl, supabaseAnonKey);