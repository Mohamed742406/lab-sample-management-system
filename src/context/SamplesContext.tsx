import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const SamplesContext = createContext<any>(undefined);

export function SamplesProvider({ children }: { children: ReactNode }) {
  const [samples, setSamples] = useState<any[]>(() => {
    // أول ما الموقع يفتح، بيشوف هل فيه بيانات متسجلة على الجهاز ده ولا لا
    const saved = localStorage.getItem('lab_samples');
    return saved ? JSON.parse(saved) : [];
  });

  // كل ما عينة تزيد أو تنقص، بيحدث النسخة اللي متسيفة على الجهاز
  useEffect(() => {
    localStorage.setItem('lab_samples', JSON.stringify(samples));
  }, [samples]);

  const addSample = (sample: any) => {
    const newSample = { ...sample, id: Date.now().toString() };
    setSamples(prev => [newSample, ...prev]);
  };

  const deleteSample = (id: string) => {
    setSamples(prev => prev.filter(s => s.id !== id));
  };

  return (
    <SamplesContext.Provider value={{ samples, addSample, deleteSample }}>
      {children}
    </SamplesContext.Provider>
  );
}

export const useSamples = () => useContext(SamplesContext);
