import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSamples } from '../context/SamplesContext';
import { Sample, ConcreteSample } from '../types';
import { SampleDetails } from './SampleDetails';

export function Dashboard() {
  const { t, isRTL } = useLanguage();
  const { samples, deleteSample } = useSamples();

  const [searchTerm, setSearchTerm] = useState('');
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [contractorFilter, setContractorFilter] = useState<string>('all');
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);

  // Get unique contractors
  const contractors = useMemo(() => {
    const unique = new Set(samples.map(s => s.contractorName));
    return Array.from(unique);
  }, [samples]);

  // Filter samples
  const filteredSamples = useMemo(() => {
    return samples.filter(sample => {
      const matchesSearch = 
        sample.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.technicianName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMaterial = materialFilter === 'all' || sample.materialType === materialFilter;
      const matchesContractor = contractorFilter === 'all' || sample.contractorName === contractorFilter;
      return matchesSearch && matchesMaterial && matchesContractor;
    });
  }, [samples, searchTerm, materialFilter, contractorFilter]);

  // Get upcoming crush dates (concrete samples only)
  const upcomingCrushDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const concreteSamples = samples.filter(s => s.materialType === 'concrete') as ConcreteSample[];
    const alerts: { sample: ConcreteSample; type: '7' | '28'; date: Date; daysLeft: number }[] = [];

    concreteSamples.forEach(sample => {
      const crush7 = new Date(sample.crushDate7Days);
      const crush28 = new Date(sample.crushDate28Days);
      
      const daysTo7 = Math.ceil((crush7.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysTo28 = Math.ceil((crush28.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysTo7 >= -3 && daysTo7 <= 7) {
        alerts.push({ sample, type: '7', date: crush7, daysLeft: daysTo7 });
      }
      if (daysTo28 >= -3 && daysTo28 <= 7) {
        alerts.push({ sample, type: '28', date: crush28, daysLeft: daysTo28 });
      }
    });

    return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [samples]);

  // Statistics
  const stats = useMemo(() => ({
    total: samples.length,
    concrete: samples.filter(s => s.materialType === 'concrete').length,
    asphalt: samples.filter(s => s.materialType === 'asphalt').length,
    soil: samples.filter(s => s.materialType === 'soil').length,
    steel: samples.filter(s => s.materialType === 'steel').length,
  }), [samples]);

  const getMaterialLabel = (type: string) => {
    switch (type) {
      case 'concrete': return t('material.concrete');
      case 'asphalt': return t('material.asphalt');
      case 'soil': return t('material.soil');
      case 'steel': return t('material.steel');
      default: return type;
    }
  };

  const getMaterialColor = (type: string) => {
    switch (type) {
      case 'concrete': return 'bg-blue-100 text-blue-800';
      case 'asphalt': return 'bg-gray-800 text-white';
      case 'soil': return 'bg-amber-100 text-amber-800';
      case 'steel': return 'bg-slate-200 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysLeftLabel = (daysLeft: number) => {
    if (daysLeft < 0) return { text: t('dashboard.overdue'), color: 'text-red-600 bg-red-100' };
    if (daysLeft === 0) return { text: t('dashboard.today'), color: 'text-orange-600 bg-orange-100' };
    if (daysLeft === 1) return { text: t('dashboard.tomorrow'), color: 'text-yellow-600 bg-yellow-100' };
    return { text: `${daysLeft} ${t('dashboard.daysLeft')}`, color: 'text-green-600 bg-green-100' };
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border-b-4 border-indigo-500">
          <p className="text-sm text-gray-500">{t('dashboard.totalSamples')}</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border-b-4 border-blue-500">
          <p className="text-sm text-gray-500">{t('material.concrete')}</p>
          <p className="text-3xl font-bold text-blue-600">{stats.concrete}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border-b-4 border-gray-700">
          <p className="text-sm text-gray-500">{t('material.asphalt')}</p>
          <p className="text-3xl font-bold text-gray-700">{stats.asphalt}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border-b-4 border-amber-500">
          <p className="text-sm text-gray-500">{t('material.soil')}</p>
          <p className="text-3xl font-bold text-amber-600">{stats.soil}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border-b-4 border-slate-500">
          <p className="text-sm text-gray-500">{t('material.steel')}</p>
          <p className="text-3xl font-bold text-slate-600">{stats.steel}</p>
        </div>
      </div>

      {/* Alerts Section */}
      {upcomingCrushDates.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {t('dashboard.alerts')} ({upcomingCrushDates.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingCrushDates.map((alert, index) => {
              const daysInfo = getDaysLeftLabel(alert.daysLeft);
              return (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${daysInfo.color}`}>
                      {daysInfo.text}
                    </span>
                    <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                      {alert.type === '7' ? t('dashboard.crushAlert7') : t('dashboard.crushAlert28')}
                    </span>
                  </div>
                  <p className="font-semibold">{alert.sample.contractorName}</p>
                  <p className="text-sm opacity-80">{alert.date.toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('dashboard.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 ps-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('dashboard.filterByMaterial')}: {t('dashboard.all')}</option>
            <option value="concrete">{t('material.concrete')}</option>
            <option value="asphalt">{t('material.asphalt')}</option>
            <option value="soil">{t('material.soil')}</option>
            <option value="steel">{t('material.steel')}</option>
          </select>
          <select
            value={contractorFilter}
            onChange={(e) => setContractorFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('dashboard.filterByContractor')}: {t('dashboard.all')}</option>
            {contractors.map(contractor => (
              <option key={contractor} value={contractor}>{contractor}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
              <tr>
                <th className="px-4 py-3 text-start">#</th>
                <th className="px-4 py-3 text-start">{t('material.type')}</th>
                <th className="px-4 py-3 text-start">{t('common.contractor')}</th>
                <th className="px-4 py-3 text-start">{t('common.technician')}</th>
                <th className="px-4 py-3 text-start">{t('common.date')}</th>
                <th className="px-4 py-3 text-start">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {t('common.noData')}
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample, index) => (
                  <tr key={sample.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMaterialColor(sample.materialType)}`}>
                        {getMaterialLabel(sample.materialType)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{sample.contractorName}</td>
                    <td className="px-4 py-3">{sample.technicianName}</td>
                    <td className="px-4 py-3">{new Date(sample.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSample(sample)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title={t('common.view')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteSample(sample.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title={t('common.delete')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Details Modal */}
      {selectedSample && (
        <SampleDetails
          sample={selectedSample}
          onClose={() => setSelectedSample(null)}
        />
      )}
    </div>
  );
}
