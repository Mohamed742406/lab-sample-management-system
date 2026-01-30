import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Sample } from '../types';

interface SamplesContextType {
  samples: Sample[];
  addSample: (sample: Sample) => void;
  deleteSample: (id: string) => void;
  updateSample: (id: string, sample: Sample) => void;
  loading: boolean;
}

const SamplesContext = createContext<SamplesContextType | undefined>(undefined);

export function SamplesProvider({ children }: { children: ReactNode }) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات من Supabase عند التحميل
  useEffect(() => {
    fetchSamples();
    
    // الاشتراك في التحديثات الفورية (اختياري)
    const channel = supabase
      .channel('samples-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'samples' },
        () => fetchSamples()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('samples')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSamples(data || []);
    } catch (error) {
      console.error('Error fetching samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSample = async (sample: Sample) => {
    try {
      const { data, error } = await supabase
        .from('samples')
        .insert([sample])
        .select()
        .single();

      if (error) throw error;
      setSamples(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding sample:', error);
      alert('فشل إضافة العينة');
    }
  };

  const deleteSample = async (id: string) => {
    try {
      const { error } = await supabase
        .from('samples')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSamples(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting sample:', error);
      alert('فشل حذف العينة');
    }
  };

  const updateSample = async (id: string, sample: Sample) => {
    try {
      const { error } = await supabase
        .from('samples')
        .update(sample)
        .eq('id', id);

      if (error) throw error;
      setSamples(prev => prev.map(s => (s.id === id ? sample : s)));
    } catch (error) {
      console.error('Error updating sample:', error);
      alert('فشل تحديث العينة');
    }
  };

  return (
    <SamplesContext.Provider value={{ samples, addSample, deleteSample, updateSample, loading }}>
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
