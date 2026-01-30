import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSamples } from '../context/SamplesContext';
import { MaterialType, Sample, FileAttachment } from '../types';

interface SampleFormProps {
  onSuccess?: () => void;
}

export function SampleForm({ onSuccess }: SampleFormProps) {
  const { t, isRTL } = useLanguage();
  const { addSample } = useSamples();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [materialType, setMaterialType] = useState<MaterialType | ''>('');
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Common fields
  const [contractorName, setContractorName] = useState('');
  const [technicianName, setTechnicianName] = useState('');

  // Concrete fields
  const [pouringDate, setPouringDate] = useState('');
  const [pouringType, setPouringType] = useState('');
  const [requiredStrength, setRequiredStrength] = useState('');

  // Asphalt fields
  const [mixType, setMixType] = useState<'B' | 'C'>('B');
  const [asphaltPlant, setAsphaltPlant] = useState('');

  // Soil fields
  const [siteLocation, setSiteLocation] = useState('');
  const [requiredTests, setRequiredTests] = useState('');

  // Steel fields
  const [steelGrade, setSteelGrade] = useState('');
  const [diameter, setDiameter] = useState('');
  const [supplier, setSupplier] = useState('');

  // Calculate crush dates for concrete
  const calculateCrushDates = (date: string) => {
    const pouringDateObj = new Date(date);
    const crushDate7 = new Date(pouringDateObj);
    crushDate7.setDate(crushDate7.getDate() + 7);
    const crushDate28 = new Date(pouringDateObj);
    crushDate28.setDate(crushDate28.getDate() + 28);
    return {
      crushDate7Days: crushDate7.toISOString().split('T')[0],
      crushDate28Days: crushDate28.toISOString().split('T')[0],
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: FileAttachment = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          dataUrl: event.target?.result as string,
        };
        setFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const resetForm = () => {
    setMaterialType('');
    setContractorName('');
    setTechnicianName('');
    setPouringDate('');
    setPouringType('');
    setRequiredStrength('');
    setMixType('B');
    setAsphaltPlant('');
    setSiteLocation('');
    setRequiredTests('');
    setSteelGrade('');
    setDiameter('');
    setSupplier('');
    setFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialType) return;

    const baseSample = {
      id: crypto.randomUUID(),
      materialType,
      contractorName,
      technicianName,
      createdAt: new Date().toISOString(),
      files,
    };

    let sample: Sample;

    switch (materialType) {
      case 'concrete':
        const crushDates = calculateCrushDates(pouringDate);
        sample = {
          ...baseSample,
          materialType: 'concrete',
          pouringDate,
          pouringType,
          requiredStrength,
          crushDate7Days: crushDates.crushDate7Days,
          crushDate28Days: crushDates.crushDate28Days,
        };
        break;
      case 'asphalt':
        sample = {
          ...baseSample,
          materialType: 'asphalt',
          mixType,
          asphaltPlant,
        };
        break;
      case 'soil':
        sample = {
          ...baseSample,
          materialType: 'soil',
          siteLocation,
          requiredTests,
        };
        break;
      case 'steel':
        sample = {
          ...baseSample,
          materialType: 'steel',
          steelGrade,
          diameter,
          supplier,
        };
        break;
    }

    addSample(sample);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    resetForm();
    onSuccess?.();
  };

  const crushDatesPreview = pouringDate ? calculateCrushDates(pouringDate) : null;

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
        {t('nav.addSample')}
      </h2>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('common.sampleAdded')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Material Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('material.type')} *
          </label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value as MaterialType)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            required
          >
            <option value="">{t('material.select')}</option>
            <option value="concrete">{t('material.concrete')}</option>
            <option value="asphalt">{t('material.asphalt')}</option>
            <option value="soil">{t('material.soil')}</option>
            <option value="steel">{t('material.steel')}</option>
          </select>
        </div>

        {/* Concrete Fields */}
        {materialType === 'concrete' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              {t('material.concrete')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('concrete.pouringDate')} *
                </label>
                <input
                  type="date"
                  value={pouringDate}
                  onChange={(e) => setPouringDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('concrete.pouringType')} *
                </label>
                <input
                  type="text"
                  value={pouringType}
                  onChange={(e) => setPouringType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('concrete.requiredStrength')} *
                </label>
                <input
                  type="text"
                  value={requiredStrength}
                  onChange={(e) => setRequiredStrength(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 30 MPa"
                  required
                />
              </div>
            </div>
            {crushDatesPreview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📅</span>
                  <div>
                    <p className="text-xs text-gray-500">{t('concrete.crushDate7')}</p>
                    <p className="font-semibold text-gray-800">{crushDatesPreview.crushDate7Days}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📅</span>
                  <div>
                    <p className="text-xs text-gray-500">{t('concrete.crushDate28')}</p>
                    <p className="font-semibold text-gray-800">{crushDatesPreview.crushDate28Days}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Asphalt Fields */}
        {materialType === 'asphalt' && (
          <div className="space-y-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              {t('material.asphalt')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('asphalt.mixType')} *
                </label>
                <select
                  value={mixType}
                  onChange={(e) => setMixType(e.target.value as 'B' | 'C')}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                  required
                >
                  <option value="B">{t('asphalt.typeB')}</option>
                  <option value="C">{t('asphalt.typeC')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('asphalt.plant')} *
                </label>
                <input
                  type="text"
                  value={asphaltPlant}
                  onChange={(e) => setAsphaltPlant(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Soil Fields */}
        {materialType === 'soil' && (
          <div className="space-y-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
              {t('material.soil')}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('soil.location')} *
              </label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('soil.tests')} *
              </label>
              <textarea
                value={requiredTests}
                onChange={(e) => setRequiredTests(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 min-h-[100px]"
                placeholder={t('soil.testsPlaceholder')}
                required
              />
            </div>
          </div>
        )}

        {/* Steel Fields */}
        {materialType === 'steel' && (
          <div className="space-y-4 p-4 bg-slate-100 rounded-xl border border-slate-300">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
              {t('material.steel')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('steel.grade')} *
                </label>
                <input
                  type="text"
                  value={steelGrade}
                  onChange={(e) => setSteelGrade(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g., B500B"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('steel.diameter')} *
                </label>
                <input
                  type="text"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g., 16mm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('steel.supplier')} *
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Common Fields - Show only when material type is selected */}
        {materialType && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.contractor')} *
                </label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.technician')} *
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('common.files')}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 w-full"
                >
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-500">{t('common.filesHint')}</span>
                </button>
              </div>
              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map(file => (
                    <div key={file.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {t('common.submit')}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
