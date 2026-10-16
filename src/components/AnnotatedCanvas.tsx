import React, { useState } from 'react';
import { GradingResult, DetectedDefect } from '../types';
import { Eye, Layers, ZoomIn } from 'lucide-react';

interface AnnotatedCanvasProps {
  result: GradingResult;
}

export const AnnotatedCanvas: React.FC<AnnotatedCanvasProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'annotated' | 'original'>('annotated');
  const [hoveredDefect, setHoveredDefect] = useState<DetectedDefect | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Severe':
        return { border: 'border-red-500', bg: 'bg-red-500/20', text: 'text-red-400', fill: 'rgba(239, 68, 68, 0.25)' };
      case 'Moderate':
        return { border: 'border-amber-500', bg: 'bg-amber-500/20', text: 'text-amber-400', fill: 'rgba(245, 158, 11, 0.25)' };
      default:
        return { border: 'border-emerald-500', bg: 'bg-emerald-500/20', text: 'text-emerald-400', fill: 'rgba(16, 185, 129, 0.25)' };
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('annotated')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'annotated'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Annotated Inspection View</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'original'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Original Image</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm border border-emerald-500 bg-emerald-500/20 inline-block"></span>
            <span>Produce Region</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm border border-amber-500 bg-amber-500/20 inline-block"></span>
            <span>Minor / Scab</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm border border-red-500 bg-red-500/20 inline-block"></span>
            <span>Severe / Rot</span>
          </span>
        </div>
      </div>

      {/* Canvas / Image Box */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[360px] max-h-[520px]">
        {/* Underlay Image */}
        <img
          src={result.mediaUrl}
          alt={result.produceName}
          className="w-full h-full object-contain max-h-[520px] select-none"
          referrerPolicy="no-referrer"
        />

        {/* AI Overlays layer */}
        {viewMode === 'annotated' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Detected Produce Item Bounding Boxes */}
            {result.detectedItems.map(item => (
              <div
                key={item.id}
                className="absolute border-2 border-emerald-500/80 rounded pointer-events-auto transition-opacity"
                style={{
                  left: `${item.boundingBox.x}%`,
                  top: `${item.boundingBox.y}%`,
                  width: `${item.boundingBox.width}%`,
                  height: `${item.boundingBox.height}%`
                }}
              >
                <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-mono rounded shadow">
                  {item.label} · {(item.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}

            {/* Detected Defect Overlays */}
            {result.defects.map(defect => {
              const colors = getSeverityColor(defect.severity);
              const isHovered = hoveredDefect?.id === defect.id;

              return (
                <div
                  key={defect.id}
                  onMouseEnter={() => setHoveredDefect(defect)}
                  onMouseLeave={() => setHoveredDefect(null)}
                  className={`absolute border-2 ${colors.border} ${colors.bg} rounded cursor-pointer pointer-events-auto transition-all ${
                    isHovered ? 'scale-105 ring-2 ring-white z-20' : 'opacity-90'
                  }`}
                  style={{
                    left: `${defect.boundingBox.x}%`,
                    top: `${defect.boundingBox.y}%`,
                    width: `${defect.boundingBox.width}%`,
                    height: `${defect.boundingBox.height}%`
                  }}
                >
                  <span className="absolute -top-5 left-0 px-1.5 py-0.2 bg-slate-900/90 text-white text-[10px] font-mono rounded whitespace-nowrap shadow">
                    {defect.type} ({defect.affectedAreaPercent.toFixed(1)}%)
                  </span>

                  {/* Polygon indicator if present */}
                  {defect.polygon && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polygon
                        points={defect.polygon.map(p => `${p.x},${p.y}`).join(' ')}
                        fill={colors.fill}
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Hovered Tooltip Card */}
        {hoveredDefect && viewMode === 'annotated' && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-lg p-3 text-white text-xs z-30 shadow-2xl flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-emerald-400">{hoveredDefect.type}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">Severity: {hoveredDefect.severity}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">Area: {hoveredDefect.affectedAreaPercent.toFixed(1)}%</span>
              </div>
              <p className="text-slate-300 text-[11px]">{hoveredDefect.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase text-slate-400 block">Confidence</span>
              <span className="font-mono font-semibold text-emerald-400 text-sm">
                {(hoveredDefect.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        {viewMode === 'annotated' ? (
          <span>Hover over defect bounding regions to view segmentation details and pathology notes.</span>
        ) : (
          <span>Viewing unannotated original sensor feed.</span>
        )}
      </div>
    </div>
  );
};
