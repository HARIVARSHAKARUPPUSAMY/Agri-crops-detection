import React from 'react';
import { Sprout, CheckCircle2, ShieldCheck, Layers, Cpu, Database, Smartphone, Globe, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onBackToDashboard?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToDashboard }) => {
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

      {/* Header */}
      <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
          <Sprout className="w-3.5 h-3.5" />
          <span>System Architecture & Specifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About the Application
        </h1>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
          AI-Based Universal Fruit and Vegetable Quality Grading System
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Purpose */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Purpose
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The application uses computer vision and artificial intelligence to assess the visible quality of fruits and vegetables, detect visible defects, classify quality, and generate structured grading reports. It bridges high-throughput optical conveyor inspection with standardized commercial grading rules (Grade A, Grade B, Grade C, and Rejected).
          </p>
        </section>

        {/* Core Features */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Core Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Image and video input with format validation',
              'Automated produce detection and counting',
              'Visible-defect localization (bruises, cuts, rot, mold, scabs)',
              'AI-based quality classification via EfficientNet-B0',
              'Crop-specific grading rules engine (Apple, Tomato, Pepper, Banana, Citrus, etc.)',
              'Confidence and defect severity assessment with surface area %',
              'Persistent grading history with search and filters',
              'Downloadable quality audit reports in structured PDF format',
              'Cross-platform access: Web browser and Flutter mobile applications'
            ].map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs">{feat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Overview */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Technology Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Web Frontend</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                React and TypeScript with modern Tailwind CSS, responsive single-elevation dashboards, interactive canvas defect mask rendering, and PDF generator.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Mobile Frontend</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Flutter and Dart cross-platform client with camera gallery picker and mobile audit reports for iOS and Android devices.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Backend Services</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                FastAPI and Python REST backend services alongside Express/Node.js fullstack endpoints with token-based session isolation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>AI & Computer Vision</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Kornia and Torchvision for tensor normalization; YOLO segmentation for produce and visible-defect localization; EfficientNet-B0 for quality classification.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 sm:col-span-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Database & Persistent Storage</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                PostgreSQL schema for user accounts, credentials, settings, support requests, and historical inspection certificates with isolated tenant queries.
              </p>
            </div>
          </div>
        </section>

        {/* Responsible-Use Statement */}
        <section className="bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-300 dark:border-amber-900/60 p-6">
          <div className="flex items-center gap-2 mb-2 text-amber-900 dark:text-amber-200 font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="text-base font-bold">
              Responsible-Use Statement
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-300 leading-relaxed">
            The system assesses visible characteristics from images or videos. It does not independently certify food safety, pesticide residues, chemical residues, microbial presence, or internal flesh quality. Results should be reviewed by a qualified person when necessary.
          </p>
        </section>
      </div>
    </div>
  );
};
