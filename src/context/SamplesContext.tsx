import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sample } from '../types';

interface SamplesContextType {
  samples: Sample[];
  addSample: (sample: Sample) => void;
  deleteSample: (id: string) => void;
  updateSample: (id: string, sample: Sample) => void;
}

const SamplesContext = createContext<SamplesContextType | undefined>(undefined);

const STORAGE_KEY = 'lab_samples_data';

export function SamplesProvider({ children }: { children: ReactNode }) {
  const [samples, setSamples] = useState<Sample[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  }, [samples]);

  const addSample = (sample: Sample) => {
    setSamples(prev => [...prev, sample]);
  };

  const deleteSample = (id: string) => {
    setSamples(prev => prev.filter(s => s.id !== id));
  };

  const updateSample = (id: string, sample: Sample) => {
    setSamples(prev => prev.map(s => (s.id === id ? sample : s)));
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
