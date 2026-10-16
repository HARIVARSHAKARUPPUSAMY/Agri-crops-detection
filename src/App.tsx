import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewGradingPage } from './pages/NewGradingPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { GradingResult } from './types';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [activeResult, setActiveResult] = useState<GradingResult | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      </div>
    );
  }

  // First Page: Authentication (Login & Sign-Up)
  if (!user) {
    return <AuthPage />;
  }

  const handleGradingComplete = (result: GradingResult) => {
    setActiveResult(result);
    setActivePage('results');
  };

  const handleSelectHistoryResult = (result: GradingResult) => {
    setActiveResult(result);
    setActivePage('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar with the required top-right Dashboard menu */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activePage === 'dashboard' && (
          <DashboardPage
            onNewGradingClick={() => setActivePage('new-grading')}
            onSelectResult={handleSelectHistoryResult}
          />
        )}

        {activePage === 'new-grading' && (
          <NewGradingPage
            onGradingComplete={handleGradingComplete}
            onCancel={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'results' && activeResult && (
          <ResultsPage
            result={activeResult}
            onBackToDashboard={() => setActivePage('dashboard')}
            onNewGrading={() => setActivePage('new-grading')}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage onBackToDashboard={() => setActivePage('dashboard')} />
        )}

        {activePage === 'settings' && (
          <SettingsPage onBackToDashboard={() => setActivePage('dashboard')} />
        )}

        {activePage === 'about' && (
          <AboutPage onBackToDashboard={() => setActivePage('dashboard')} />
        )}

        {activePage === 'help' && (
          <HelpPage onBackToDashboard={() => setActivePage('dashboard')} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            AI-Based Universal Fruit and Vegetable Quality Grading System · Computer Vision & Optical Inspection
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActivePage('about')} className="hover:text-slate-900 dark:hover:text-white">
              About
            </button>
            <button onClick={() => setActivePage('help')} className="hover:text-slate-900 dark:hover:text-white">
              Help & Support
            </button>
            <button onClick={() => setActivePage('settings')} className="hover:text-slate-900 dark:hover:text-white">
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}
