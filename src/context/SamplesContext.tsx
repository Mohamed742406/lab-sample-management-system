import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

// تعريف شكل العينة جوه الكود عشان ميعتمدش على ملفات خارجية
interface Sample {
  id?: string;
  type: string;
  contractor: string;
  technician: string;
  date: string;
  created_at?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SamplesContextType {
  samples: Sample[];
  addSample: (sample: Sample) => Promise<void>;
  deleteSample: (id: string) => Promise<void>;
}

const SamplesContext = createContext<SamplesContextType | undefined>(undefined);

export function SamplesProvider({ children }: { children: ReactNode }) {
  const [samples, setSamples] = useState<Sample[]>([]);

  useEffect(() => {
    const fetchSamples = async () => {
      const { data, error } = await supabase
        .from('samples')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setSamples(data as Sample[]);
      }
    };
    fetchSamples();
  }, []);

  const addSample = async (sample: Sample) => {
    // بنشيل الـ id والوقت لو موجودين عشان السيرفر هو اللي يعملهم
    const { id, created_at, ...sampleData } = sample;
    
    const { data, error } = await supabase
      .from('samples')
      .insert([sampleData])
      .select();

    if (!error && data) {
      setSamples(prev => [data[0] as Sample, ...prev]);
    } else if (error) {
      console.error('Error adding sample:', error.message);
    }
  };

  const deleteSample = async (id: string) => {
    const { error } = await supabase
      .from('samples')
      .delete()
      .eq('id', id);

    if (!error) {
      setSamples(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <SamplesContext.Provider value={{ samples, addSample, deleteSample }}>
      {children}
    </SamplesContext.Provider>
  );
}

export function useSamples() {
  const context = useContext(SamplesContext);
  if (!context) {
    throw new Error('useSamples must be used within a SamplesProvider');
  }
  return context;
}
