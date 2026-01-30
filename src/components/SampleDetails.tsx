import { useLanguage } from '../context/LanguageContext';
import { Sample, ConcreteSample, AsphaltSample, SoilSample, SteelSample } from '../types';

interface SampleDetailsProps {
  sample: Sample;
  onClose: () => void;
}

export function SampleDetails({ sample, onClose }: SampleDetailsProps) {
  const { t, isRTL } = useLanguage();

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
      case 'concrete': return 'from-blue-500 to-blue-600';
      case 'asphalt': return 'from-gray-700 to-gray-800';
      case 'soil': return 'from-amber-500 to-amber-600';
      case 'steel': return 'from-slate-500 to-slate-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const renderConcreteDetails = (sample: ConcreteSample) => (
    <div className="space-y-3 bg-blue-50 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">{t('concrete.pouringDate')}</p>
          <p className="font-semibold">{sample.pouringDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('concrete.pouringType')}</p>
          <p className="font-semibold">{sample.pouringType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('concrete.requiredStrength')}</p>
          <p className="font-semibold">{sample.requiredStrength}</p>
        </div>
      </div>
      <div className="border-t border-blue-200 pt-3 mt-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">{t('concrete.crushDate7')}</p>
            <p className="font-bold text-lg">{sample.crushDate7Days}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">{t('concrete.crushDate28')}</p>
            <p className="font-bold text-lg">{sample.crushDate28Days}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAsphaltDetails = (sample: AsphaltSample) => (
    <div className="space-y-3 bg-gray-100 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">{t('asphalt.mixType')}</p>
          <p className="font-semibold">{sample.mixType === 'B' ? t('asphalt.typeB') : t('asphalt.typeC')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('asphalt.plant')}</p>
          <p className="font-semibold">{sample.asphaltPlant}</p>
        </div>
      </div>
    </div>
  );

  const renderSoilDetails = (sample: SoilSample) => (
    <div className="space-y-3 bg-amber-50 rounded-lg p-4">
      <div>
        <p className="text-xs text-gray-500">{t('soil.location')}</p>
        <p className="font-semibold">{sample.siteLocation}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">{t('soil.tests')}</p>
        <p className="font-semibold whitespace-pre-wrap">{sample.requiredTests}</p>
      </div>
    </div>
  );

  const renderSteelDetails = (sample: SteelSample) => (
    <div className="space-y-3 bg-slate-100 rounded-lg p-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">{t('steel.grade')}</p>
          <p className="font-semibold">{sample.steelGrade}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('steel.diameter')}</p>
          <p className="font-semibold">{sample.diameter}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('steel.supplier')}</p>
          <p className="font-semibold">{sample.supplier}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getMaterialColor(sample.materialType)} text-white p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm opacity-80">{t('common.view')}</span>
              <h2 className="text-2xl font-bold">{getMaterialLabel(sample.materialType)}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Common Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">{t('common.contractor')}</p>
              <p className="font-semibold text-lg">{sample.contractorName}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">{t('common.technician')}</p>
              <p className="font-semibold text-lg">{sample.technicianName}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">{t('common.date')}</p>
            <p className="font-semibold">{new Date(sample.createdAt).toLocaleString()}</p>
          </div>

          {/* Material-specific details */}
          {sample.materialType === 'concrete' && renderConcreteDetails(sample as ConcreteSample)}
          {sample.materialType === 'asphalt' && renderAsphaltDetails(sample as AsphaltSample)}
          {sample.materialType === 'soil' && renderSoilDetails(sample as SoilSample)}
          {sample.materialType === 'steel' && renderSteelDetails(sample as SteelSample)}

          {/* Attached Files */}
          {sample.files && sample.files.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">{t('common.files')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sample.files.map(file => (
                  <div key={file.id} className="border rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img src={file.dataUrl} alt={file.name} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    <p className="p-2 text-xs truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
