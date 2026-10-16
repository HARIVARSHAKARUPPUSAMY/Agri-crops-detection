import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { GradingResult } from '../types';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Search, 
  BarChart2, 
  ArrowLeft
} from 'lucide-react';

interface NewGradingPageProps {
  onGradingComplete: (result: GradingResult) => void;
  onCancel: () => void;
}

export const NewGradingPage: React.FC<NewGradingPageProps> = ({ onGradingComplete, onCancel }) => {
  const { token } = useAuth();
  const { settings } = useSettings();

  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    type: 'image' | 'video';
    name: string;
    sizeBytes: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Preset sample testing options
  const samplePresets = [
    {
      title: 'Gala Apple (Class 1)',
      url: '/src/assets/images/sample_apple_inspection_1792161962295.jpg',
      type: 'image' as const,
      crop: 'Apple'
    },
    {
      title: 'Roma Tomatoes (Vine)',
      url: '/src/assets/images/sample_tomato_inspection_1792161962258.jpg',
      type: 'image' as const,
      crop: 'Tomato'
    },
    {
      title: 'Sweet Bell Peppers',
      url: '/src/assets/images/sample_bell_pepper_1792161962669.jpg',
      type: 'image' as const,
      crop: 'Bell Pepper'
    }
  ];

  const validateAndSetFile = (file: File) => {
    setError(null);

    // Validate size (max 25MB for video, 12MB for image)
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isImage && !isVideo) {
      setError('Unsupported file type. Please upload a standard image (JPEG, PNG, WebP) or video (MP4, WebM).');
      return;
    }

    const maxSize = isVideo ? 25 * 1024 * 1024 : 12 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size exceeds limit (${isVideo ? '25 MB for video' : '12 MB for image'}).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        url: reader.result as string,
        type: isVideo ? 'video' : 'image',
        name: file.name,
        sizeBytes: file.size
      });
    };
    reader.onerror = () => {
      setError('Could not read the selected file. Please verify file integrity.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (preset: typeof samplePresets[0]) => {
    setError(null);
    setSelectedFile({
      url: preset.url,
      type: preset.type,
      name: `${preset.crop}_Inspection_Sample.jpg`,
      sizeBytes: 1024 * 480
    });
  };

  const startScan = async () => {
    if (!selectedFile) {
      setError('Please upload or select an image or video before starting scan.');
      return;
    }

    setIsScanning(true);
    setCurrentStep(0);
    setError(null);

    // Pipeline steps visual progression
    const steps = [
      'Input Validation & Video Frame Extraction',
      'Kornia + Torchvision Preprocessing',
      'YOLO Segmentation – Produce & Defect Localization',
      'EfficientNet-B0 – Quality Classification',
      'Crop-Specific Grading Rules Engine Evaluation',
      'Final Grade Prediction & Confidence Assessment'
    ];

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const res = await fetch('/api/grading/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mediaUrl: selectedFile.url,
          mediaType: selectedFile.type
        })
      });

      clearInterval(stepInterval);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete AI grading.');
      }

      setCurrentStep(steps.length);
      setTimeout(() => {
        setIsScanning(false);
        onGradingComplete(data.result);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      setError(err.message || 'Scanning pipeline interrupted. Please check produce visibility and retry.');
    }
  };

  const pipelineSteps = [
    { title: 'Input Validation', desc: 'Frame clarity & integrity' },
    { title: 'Tensor Preprocessing', desc: 'Kornia & Torchvision normalization' },
    { title: 'YOLO Segmentation', desc: 'Fruit detection & defect bounding' },
    { title: 'EfficientNet-B0', desc: 'Quality category classification' },
    { title: 'Crop Rules Engine', desc: 'Threshold criteria evaluation' },
    { title: 'Quality Assessment', desc: 'Grade & certificate generation' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            New Grading
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Enter Your Image or Video
          </p>
        </div>

        <div className="text-right hidden sm:block text-xs text-slate-500 dark:text-slate-400">
          <span>Active Config: </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{settings.model} Model</span>
          <span> · </span>
          <span className="capitalize">{settings.speed} Mode</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload Box */}
      {!selectedFile ? (
        <div className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 sm:p-12 text-center bg-white dark:bg-slate-900/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              Drag & Drop Image or Video Here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Upload fruit or vegetable photos (JPEG, PNG, WebP up to 12MB) or conveyor inspection video (MP4 up to 25MB).
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  videoInputRef.current?.click();
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Upload Video</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={e => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
            />
          </div>

          {/* Quick-Test Laboratory Samples */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Or select a calibrated inspection sample
              </span>
              <span className="text-xs text-slate-400">Instant 1-click test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {samplePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className="group relative rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 hover:border-emerald-500 cursor-pointer transition-all shadow-sm flex flex-col"
                >
                  <div className="h-32 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        {preset.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{preset.crop} inspection tray</span>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Preview & Scan State */
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                  {selectedFile.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  · {(selectedFile.sizeBytes / 1024).toFixed(0)} KB
                </span>
              </div>

              {!isScanning && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove / Replace file</span>
                </button>
              )}
            </div>

            {/* Media Preview Box */}
            <div className="bg-slate-950 flex items-center justify-center min-h-[340px] max-h-[460px] p-2">
              {selectedFile.type === 'video' ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="max-h-[440px] max-w-full rounded"
                />
              ) : (
                <img
                  src={selectedFile.url}
                  alt="Upload preview"
                  className="max-h-[440px] max-w-full object-contain rounded"
                />
              )}
            </div>
          </div>

          {/* Scanning Progress Pipeline */}
          {isScanning && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    AI Quality Grading Pipeline Running
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Step {Math.min(currentStep + 1, pipelineSteps.length)} of {pipelineSteps.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / pipelineSteps.length) * 100}%` }}
                ></div>
              </div>

              {/* Step checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {pipelineSteps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border transition-colors flex items-center gap-3 ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-medium'
                          : isDone
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                          : 'border-slate-100 dark:border-slate-800/40 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] shrink-0 font-mono">
                          {idx + 1}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-[11px] opacity-80">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Row */}
          {!isScanning && (
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel & Choose Different File
              </button>

              <button
                type="button"
                onClick={startScan}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-900/10 flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Scan</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
