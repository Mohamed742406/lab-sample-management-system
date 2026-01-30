import { createClient } from '@supabase/supabase-js';

// القيم الثابتة مؤقتاً حتى تعمل المتغيرات
const supabaseUrl = 'https://oijokeakpcfjno.supabase.co';
const supabaseAnonKey = 'sb_publishable_7hEQY5ayJRxpb1kbuJeagQ_faet17k6';

// تحذير للتطوير
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Using anon key:', supabaseAnonKey ? '✅ Key loaded' : '❌ Key missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
