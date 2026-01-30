import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sample } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SamplesContextType {
  samples: Sample[];
  addSample: (sample: Sample) => Promise<void>;
  deleteSample: (id: string) => Promise<void>;
  updateSample: (id: string, sample: Sample) => Promise<void>;
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
    const { data, error } = await supabase
      .from('samples')
      .insert([sample])
      .select();

    if (!error && data) {
      setSamples(prev => [data[0] as Sample, ...prev]);
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

  const updateSample = async (id: string, sample: Sample) => {
    const { data, error } = await supabase
      .from('samples')
      .update(sample)
      .eq('id', id)
      .select();

    if (!error && data) {
      setSamples(prev => prev.map(s => s.id === id ? data[0] as Sample : s));
    }
  };

  return (
    <SamplesContext.Provider value={{ samples, addSample, deleteSample, updateSample }}>
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
