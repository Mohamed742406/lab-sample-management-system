import { createClient } from '@supabase/supabase-js';

// الـ URL الصحيح الكامل
const supabaseUrl = 'https://oijokeakpcfjnorukimw.supabase.co';
const supabaseAnonKey = 'sb_publishable_7hEQY5ayJRxpb1kbuJeagQ_faet17k6';

console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Using anon key:', supabaseAnonKey ? '✅ Key loaded' : '❌ Key missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
