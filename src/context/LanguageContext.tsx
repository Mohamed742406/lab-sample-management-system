import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  // General
  'app.title': { ar: 'نظام إدارة عينات المعمل', en: 'Lab Sample Management' },
  'app.subtitle': { ar: 'للمشاريع الإنشائية', en: 'For Construction Projects' },
  
  // Navigation
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.addSample': { ar: 'إضافة عينة جديدة', en: 'Add New Sample' },
  
  // Material Types
  'material.type': { ar: 'نوع المادة', en: 'Material Type' },
  'material.select': { ar: 'اختر نوع المادة', en: 'Select Material Type' },
  'material.concrete': { ar: 'خرسانة', en: 'Concrete' },
  'material.asphalt': { ar: 'أسفلت', en: 'Asphalt' },
  'material.soil': { ar: 'تربة', en: 'Soil' },
  'material.steel': { ar: 'حديد', en: 'Steel' },
  
  // Concrete Fields
  'concrete.pouringDate': { ar: 'تاريخ الصب', en: 'Pouring Date' },
  'concrete.pouringType': { ar: 'نوع الصب', en: 'Pouring Type' },
  'concrete.requiredStrength': { ar: 'الإجهاد المطلوب', en: 'Required Strength' },
  'concrete.crushDate7': { ar: 'تاريخ تكسير 7 أيام', en: '7 Days Crush Date' },
  'concrete.crushDate28': { ar: 'تاريخ تكسير 28 يوم', en: '28 Days Crush Date' },
  
  // Asphalt Fields
  'asphalt.mixType': { ar: 'نوع الخلطة', en: 'Mix Type' },
  'asphalt.typeB': { ar: 'النوع B', en: 'Type B' },
  'asphalt.typeC': { ar: 'النوع C', en: 'Type C' },
  'asphalt.plant': { ar: 'مصنع الأسفلت', en: 'Asphalt Plant' },
  
  // Soil Fields
  'soil.location': { ar: 'موقع العينة', en: 'Site Location' },
  'soil.tests': { ar: 'الاختبارات المطلوبة', en: 'Required Tests' },
  'soil.testsPlaceholder': { ar: 'مثال: بروكتور، تدرج حبيبي، CBR...', en: 'e.g., Proctor, Gradation, CBR...' },
  
  // Steel Fields
  'steel.grade': { ar: 'رتبة الحديد', en: 'Steel Grade' },
  'steel.diameter': { ar: 'القطر', en: 'Diameter' },
  'steel.supplier': { ar: 'المورد', en: 'Supplier' },
  
  // Common Fields
  'common.contractor': { ar: 'اسم الشركة المقاولة', en: 'Contractor Name' },
  'common.technician': { ar: 'اسم الفني القائم بالسحب', en: 'Technician Name' },
  'common.files': { ar: 'رفع الملفات', en: 'Upload Files' },
  'common.filesHint': { ar: 'صور بون التوريد أو صور العينة', en: 'Delivery voucher or sample photos' },
  'common.submit': { ar: 'حفظ العينة', en: 'Save Sample' },
  'common.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'common.delete': { ar: 'حذف', en: 'Delete' },
  'common.view': { ar: 'عرض', en: 'View' },
  'common.edit': { ar: 'تعديل', en: 'Edit' },
  'common.close': { ar: 'إغلاق', en: 'Close' },
  'common.date': { ar: 'التاريخ', en: 'Date' },
  'common.actions': { ar: 'الإجراءات', en: 'Actions' },
  'common.noData': { ar: 'لا توجد بيانات', en: 'No data available' },
  'common.success': { ar: 'تم بنجاح', en: 'Success' },
  'common.sampleAdded': { ar: 'تمت إضافة العينة بنجاح', en: 'Sample added successfully' },
  
  // Dashboard
  'dashboard.title': { ar: 'لوحة المتابعة', en: 'Dashboard' },
  'dashboard.totalSamples': { ar: 'إجمالي العينات', en: 'Total Samples' },
  'dashboard.concreteSamples': { ar: 'عينات الخرسانة', en: 'Concrete Samples' },
  'dashboard.upcomingCrush': { ar: 'مواعيد التكسير القادمة', en: 'Upcoming Crush Dates' },
  'dashboard.search': { ar: 'بحث...', en: 'Search...' },
  'dashboard.filterByMaterial': { ar: 'تصفية حسب المادة', en: 'Filter by Material' },
  'dashboard.filterByContractor': { ar: 'تصفية حسب المقاول', en: 'Filter by Contractor' },
  'dashboard.all': { ar: 'الكل', en: 'All' },
  'dashboard.alerts': { ar: 'التنبيهات', en: 'Alerts' },
  'dashboard.crushAlert7': { ar: 'موعد تكسير 7 أيام', en: '7 Days Crush Due' },
  'dashboard.crushAlert28': { ar: 'موعد تكسير 28 يوم', en: '28 Days Crush Due' },
  'dashboard.today': { ar: 'اليوم', en: 'Today' },
  'dashboard.tomorrow': { ar: 'غداً', en: 'Tomorrow' },
  'dashboard.daysLeft': { ar: 'يوم متبقي', en: 'days left' },
  'dashboard.overdue': { ar: 'متأخر', en: 'Overdue' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
