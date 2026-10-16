import React, { useState } from 'react';
import { GradingResult } from '../types';
import { AnnotatedCanvas } from '../components/AnnotatedCanvas';
import { generateGradingPDF } from '../services/pdfReportGenerator';
import { 
  Download, 
  FileText, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  X,
  ExternalLink
} from 'lucide-react';

interface ResultsPageProps {
  result: GradingResult;
  onBackToDashboard: () => void;
  onNewGrading: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  onBackToDashboard,
  onNewGrading
}) => {
  const [showFullReportModal, setShowFullReportModal] = useState(false);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'Grade A':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/50',
          border: 'border-emerald-500',
          text: 'text-emerald-700 dark:text-emerald-300',
          label: 'Grade A — Premium'
        };
      case 'Grade B':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/50',
          border: 'border-blue-500',
          text: 'text-blue-700 dark:text-blue-300',
          label: 'Grade B — Standard'
        };
      case 'Grade C':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/50',
          border: 'border-amber-500',
          text: 'text-amber-700 dark:text-amber-300',
          label: 'Grade C — Low Quality'
        };
      default:
        return {
          bg: 'bg-red-50 dark:bg-red-950/50',
          border: 'border-red-500',
          text: 'text-red-700 dark:text-red-300',
          label: 'Rejected — Non-Commercial'
        };
    }
  };

  const badge = getGradeBadge(result.finalGrade);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Action Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Inspection Results: {result.produceName}
            </h1>
            <span className="text-xs font-mono text-slate-400">
              #{result.id}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => generateGradingPDF(result)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={() => setShowFullReportModal(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Full Report</span>
          </button>

          <button
            onClick={onNewGrading}
            className="px-3.5 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start New Grading</span>
          </button>
        </div>
      </div>

      {/* Human Review Banner if triggered */}
      {result.humanReviewRequired && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-900 dark:text-amber-200">
              Human Review Recommended
            </h4>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5">
              {result.reviewReasons?.join(' ') ||
                'Visual ambiguity or confidence threshold criteria suggests manual review by a certified agronomist.'}
            </p>
          </div>
        </div>
      )}

      {/* Two-Column Grid: Left Visual Evidence, Right Quality Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Evidence (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Visual Evidence & Segmentation
              </h2>
              <span className="text-xs text-slate-400">
                Processed {new Date(result.processingDate).toLocaleTimeString()}
              </span>
            </div>
            <AnnotatedCanvas result={result} />
          </div>

          {/* Quick Produce Info Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Crop Species</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {result.produceName}
              </span>
              <span className="text-[11px] text-slate-500 block">Category: {result.cropCategory}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Detected Units</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                {result.detectedItemCount} item(s)
              </span>
              <span className="text-[11px] text-slate-500 block">YOLO produce model</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Pipeline Status</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{result.status}</span>
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">
                {result.modelModeUsed} · {result.speedModeUsed}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Quality Assessment & Metrics (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Assigned Grade Hero Card */}
          <div className={`p-6 rounded-2xl border ${badge.border} ${badge.bg} shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                Assigned Quality Grade
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {(result.confidences.overall * 100).toFixed(1)}% Certainty
              </span>
            </div>

            <h3 className={`text-3xl font-extrabold ${badge.text} mb-1`}>
              {result.finalGrade}
            </h3>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {result.qualityClass}
            </p>

            {/* Reasons List */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                Grade Determination Reasons:
              </span>
              {result.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Confidences Breakdown */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Computer Vision & Inference Confidence
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>Produce Recognition (YOLO)</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {(result.confidences.produceId * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${result.confidences.produceId * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>Visible Defect Localization</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {(result.confidences.defectDetection * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${result.confidences.defectDetection * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>EfficientNet-B0 Classification</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {(result.confidences.qualityClassification * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${result.confidences.qualityClassification * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Visible Defects Summary Table */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Visible Defects ({result.defects.length})
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                Total Area: {result.overallDefectAreaPercent.toFixed(1)}%
              </span>
            </div>

            {result.defects.length === 0 ? (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero visible bruises, cuts, or mold blemishes detected.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {result.defects.map(d => (
                  <div key={d.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{d.type}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            d.severity === 'Severe'
                              ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                              : d.severity === 'Moderate'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {d.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {d.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold block">
                        {d.affectedAreaPercent.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {(d.confidence * 100).toFixed(0)}% conf.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Report Modal */}
      {showFullReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Grading Audit Report
                </h3>
                <p className="text-xs text-slate-500 font-mono">Certificate #{result.id}</p>
              </div>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <span className="text-[11px] text-slate-400 block">ACCOUNT / HOLDER</span>
                  <span className="font-semibold">{result.userEmail} ({result.accountType})</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">TIMESTAMP</span>
                  <span className="font-mono">{new Date(result.processingDate).toUTCString()}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Crop-Specific Standards Criteria Applied
                </h4>
                <p className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 leading-relaxed">
                  {result.gradingRulesApplied}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Automated Grade Justification
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {result.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>Responsible-Use Statement:</strong> The system assesses visible surface characteristics from images/videos using YOLO segmentation and EfficientNet-B0. It does not certify internal flesh safety, pesticide residues, microbial contamination, or nutritional parameters.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowFullReportModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  generateGradingPDF(result);
                  setShowFullReportModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
