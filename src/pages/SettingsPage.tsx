import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Sun, Moon, Laptop, Zap, Gauge, Search, Sparkles, Cpu, Check, Save, ArrowLeft } from 'lucide-react';

interface SettingsPageProps {
  onBackToDashboard?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBackToDashboard }) => {
  const { settings, updateSettings } = useSettings();
  const [savedNotification, setSavedNotification] = useState(false);

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    await updateSettings({ theme });
    triggerSaveAlert();
  };

  const handleSpeedChange = async (speed: 'fast' | 'balanced' | 'detailed') => {
    await updateSettings({ speed });
    triggerSaveAlert();
  };

  const handleModelChange = async (model: 'premium' | 'general') => {
    await updateSettings({ model });
    triggerSaveAlert();
  };

  const triggerSaveAlert = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to dashboard */}
      {onBackToDashboard && (
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      )}

      {/* Title */}
      <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure visual presentation, inference latency, and AI model grading parameters.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Persisted</span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* A. Theme (Section 4.A) */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                A.
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Theme
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your visual preference. Applied throughout dashboard, grading workflow, and history.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Light Theme */}
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.theme === 'light'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Sun className={`w-5 h-5 ${settings.theme === 'light' ? 'text-emerald-600' : 'text-slate-400'}`} />
                {settings.theme === 'light' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <div>
                <span className="text-sm font-bold block">Light theme</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Crisp neutral white canvas with high contrast.
                </span>
              </div>
            </button>

            {/* Dark Theme */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.theme === 'dark'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Moon className={`w-5 h-5 ${settings.theme === 'dark' ? 'text-emerald-600' : 'text-slate-400'}`} />
                {settings.theme === 'dark' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <div>
                <span className="text-sm font-bold block">Dark theme</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Deep slate background comfortable for low-light inspection.
                </span>
              </div>
            </button>

            {/* System Default Theme */}
            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.theme === 'system'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Laptop className={`w-5 h-5 ${settings.theme === 'system' ? 'text-emerald-600' : 'text-slate-400'}`} />
                {settings.theme === 'system' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <div>
                <span className="text-sm font-bold block">System default</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Automatically syncs with OS light/dark schedule.
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* B. Speed (Section 4.B) */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                B.
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Grading Speed Mode
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select the speed configuration for produce grading. Frame sampling density and preprocessing steps adapt accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Fast */}
            <button
              type="button"
              onClick={() => handleSpeedChange('fast')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.speed === 'fast'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Zap className={`w-5 h-5 ${settings.speed === 'fast' ? 'text-emerald-600' : 'text-slate-400'}`} />
                {settings.speed === 'fast' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <div>
                <span className="text-sm font-bold block">Fast</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Lightweight inference configuration. Recommended for rapid high-throughput screening conveyors.
                </span>
              </div>
            </button>

            {/* Balanced */}
            <button
              type="button"
              onClick={() => handleSpeedChange('balanced')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.speed === 'balanced'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Gauge className={`w-5 h-5 ${settings.speed === 'balanced' ? 'text-emerald-600' : 'text-slate-400'}`} />
                {settings.speed === 'balanced' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <div>
                <span className="text-sm font-bold block">Balanced (Recommended)</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Harmonized balance between processing time and thorough multi-pass feature extraction.
                </span>
              </div>
            </button>

            {/* Detailed */}
            <button
              type="button"
              onClick={() => handleSpeedChange('detailed')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.speed === 'detailed'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Search className={`w-5 h-5 ${settings.speed === 'detailed' ? 'text-emerald-600' : 'text-slate-400'}`} />
                {settings.speed === 'detailed' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <div>
                <span className="text-sm font-bold block">Detailed</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Deep multi-frame selection, high-resolution defect contour boundary tracing, and full diagnostic logs.
                </span>
              </div>
            </button>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400">
            <strong>Validation Note:</strong> Changing speed mode adjusts frame extraction granularity and sampling density. It does not alter underlying agricultural grading rules or baseline species thresholds.
          </div>
        </section>

        {/* C. Model (Section 4.C) */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                C.
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Model Architecture Configuration
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose between Premium and General AI model pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Premium */}
            <button
              type="button"
              onClick={() => handleModelChange('premium')}
              className={`p-5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.model === 'premium'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Premium Model</span>
                  </div>
                  {settings.model === 'premium' && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-600 text-white">Active</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Designed for high-accuracy export compliance. Activates high-resolution YOLO segmentation masks, EfficientNet-B0 fine-grained defect classification, surface area calculation, and comprehensive certificates.
                </p>
                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div>✓ Sub-millimeter defect polygon contouring</div>
                  <div>✓ Calibrated confidence distributions</div>
                  <div>✓ Full audit certificate generation</div>
                </div>
              </div>
            </button>

            {/* General */}
            <button
              type="button"
              onClick={() => handleModelChange('general')}
              className={`p-5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.model === 'general'
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">General Model</span>
                  </div>
                  {settings.model === 'general' && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-600 text-white">Active</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Designed for standard quality grading tasks. Standard YOLO bounding box produce detection, visible defect identification, grade prediction, and baseline reports.
                </p>
                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div>✓ Crop identification & item counts</div>
                  <div>✓ Visible defect presence check</div>
                  <div>✓ Standard commercial quality reports</div>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* D. Settings Persistence Note (Section 4.D) */}
        <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Save className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>D. Settings Persistence:</strong> All theme, speed, and model settings are automatically synchronized to your database profile and restored on every login.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
