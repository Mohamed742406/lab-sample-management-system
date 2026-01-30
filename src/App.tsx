import { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SamplesProvider } from './context/SamplesContext';
import { SampleForm } from './components/SampleForm';
import { Dashboard } from './components/Dashboard';

type View = 'dashboard' | 'addSample';

function AppContent() {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">{t('app.title')}</h1>
                <p className="text-blue-200 text-sm">{t('app.subtitle')}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2 md:gap-4 flex-wrap">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t('nav.dashboard')}
                </span>
              </button>
              <button
                onClick={() => setCurrentView('addSample')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  currentView === 'addSample'
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t('nav.addSample')}
                </span>
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {language === 'ar' ? 'EN' : 'عربي'}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'addSample' && (
          <div className="max-w-3xl mx-auto">
            <SampleForm onSuccess={() => setCurrentView('dashboard')} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} {t('app.title')} - {t('app.subtitle')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <SamplesProvider>
        <AppContent />
      </SamplesProvider>
    </LanguageProvider>
  );
}
