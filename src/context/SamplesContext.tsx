import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

// السطرين دول هما السر، لو ملقاش المفاتيح في فيرسيل هيطلع لك تنبيه
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase keys are missing! Check Vercel Environment Variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SamplesContext = createContext<any>(undefined);

export function SamplesProvider({ children }: { children: ReactNode }) {
  const [samples, setSamples] = useState<any[]>([]);

  // تحميل البيانات من السيرفر أول ما الموقع يفتح
  useEffect(() => {
    const fetchSamples = async () => {
      const { data, error } = await supabase.from('samples').select('*').order('created_at', { ascending: false });
      if (!error && data) setSamples(data);
    };
    fetchSamples();
  }, []);

  const addSample = async (sample: any) => {
    const { data, error } = await supabase.from('samples').insert([sample]).select();
    if (!error && data) {
      setSamples(prev => [data[0], ...prev]);
    } else {
      console.error('Error adding sample to Supabase:', error);
    }
  };

  return (
    <SamplesContext.Provider value={{ samples, addSample }}>
      {children}
    </SamplesContext.Provider>
  );
}

export const useSamples = () => useContext(SamplesContext);
