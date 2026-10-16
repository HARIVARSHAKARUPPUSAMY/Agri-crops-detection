import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SupportTicket } from '../types';
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileText, 
  Camera, 
  ShieldAlert, 
  Clock, 
  ChevronRight,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

interface HelpPageProps {
  onBackToDashboard?: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onBackToDashboard }) => {
  const { user, token } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const fetchTickets = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/support/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in both Subject and Message fields.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/support/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit support request.');
      }

      setStatusMessage({
        type: 'success',
        text: 'Support ticket submitted successfully. An agricultural specialist has logged your request.'
      });
      setSubject('');
      setMessage('');
      fetchTickets();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error sending request.' });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Help and Support Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Operational instructions, grading standards reference, troubleshooting, and direct support desk.
        </p>
      </div>

      <div className="space-y-8">
        {/* Getting Started */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Getting Started
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            To use the system, create an account by selecting your account type (<strong className="text-slate-800 dark:text-slate-200">Organisation</strong> or <strong className="text-slate-800 dark:text-slate-200">Individual Person</strong>) on the authentication page, enter your username, email ID, and password, and click Sign Up. Once logged in, your personalized dashboard restores all previous scans, model settings, and historical certificates.
          </p>
        </section>

        {/* How to Perform Grading (Section 6. How to Perform Grading) */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            2. How to Perform Grading
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {[
              'Click New Grading on the main dashboard console.',
              'Upload an image or video file, or select a pre-calibrated sample.',
              'Check that the produce is clearly visible with clean, non-occluded lighting.',
              'Start the scan using the Start Scan action button.',
              'Wait for the AI analysis to finish (YOLO segmentation, tensor preprocessing, and EfficientNet-B0 inference).',
              'Review the assigned grade, detected visible defects, confidence scores, and reason breakdown.',
              'Download the official quality report PDF if required for audit or logistics records.'
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Inputs */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            3. Supported Inputs & Practical Limits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Still Photography</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Formats: JPEG (.jpg, .jpeg), PNG, WebP</li>
                <li>• Max file size: 12 MB</li>
                <li>• Recommended resolution: 1080p or higher</li>
                <li>• Presentation: Single item or grouped tray</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Conveyor Video Streams</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Formats: MP4, WebM (H.264 / VP9 codec)</li>
                <li>• Max file size: 25 MB</li>
                <li>• Duration limit: 45 seconds maximum</li>
                <li>• Video logic: Automated keyframe extraction</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Understanding Grades */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            4. Understanding Quality Grades
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Grades are evaluated by the deterministic Crop-Specific Rules Engine according to application-defined tolerances unless statutory regional standards are uploaded:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">Grade A — Premium</span>
              <p className="text-emerald-900 dark:text-emerald-400">
                Minimal superficial blemishes (≤ 2.0% - 2.5% area), uniform shape, zero active fungal mycelium or deep cuts. Premium export standard.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20">
              <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Grade B — Standard Commercial</span>
              <p className="text-blue-900 dark:text-blue-400">
                Minor cosmetic blemishes (2% - 7% area), superficial scabs, healed scars, sound pericarp, zero soft rot. Standard domestic retail standard.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Grade C — Low Quality / Processing</span>
              <p className="text-amber-900 dark:text-amber-400">
                Significant cosmetic defects (7% - 15% area), shape curvature or limb rub. Retains culinary soundness for processing/juicing.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/40 dark:bg-red-950/20">
              <span className="font-bold text-red-800 dark:text-red-300 block mb-0.5">Rejected — Non-Commercial</span>
              <p className="text-red-900 dark:text-red-400">
                Presence of active fungal rot, gray mold, bacterial decay, deep puncture lesions, or cumulative defect area exceeding 15%. Unfit for distribution.
              </p>
            </div>
          </div>
        </section>

        {/* Accuracy and Limitations */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            5. Accuracy and Limitations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            AI model inference relies heavily on optical lighting, absence of heavy shadows, clean conveyor staging, and calibrated training datasets. The system is designed <strong className="text-slate-900 dark:text-white">never to force a confident grade</strong> if visual certainty is below 70% or if an uncalibrated crop variety is encountered; in such events, a prominent <span className="text-amber-600 dark:text-amber-400 font-semibold">Human Review Required</span> badge is issued.
          </p>
        </section>

        {/* History and Reports */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            6. History and Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            All grading activities are automatically indexed with the uploaded image thumbnail, identified crop, defect percentages, and timestamps. You can filter by Grade (Grade A, B, C, Rejected) or search by crop name. Clicking any history entry opens the full visual defect segmentation and generates downloadable PDF certificates.
          </p>
        </section>

        {/* Troubleshooting Guide */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            7. Troubleshooting Common Issues
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <strong className="text-slate-900 dark:text-white block mb-0.5">• Image Upload Failures:</strong>
              <span className="text-slate-600 dark:text-slate-400">Ensure the file is a standard JPEG, PNG, or WebP under 12 MB. Verify the file is not corrupted.</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <strong className="text-slate-900 dark:text-white block mb-0.5">• Blurry, Glared, or Dark Images:</strong>
              <span className="text-slate-600 dark:text-slate-400">Glare or severe underexposure may mask fungal lesions. Staging produce on a neutral white or stainless plate with diffuse lighting produces optimal segmentation.</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <strong className="text-slate-900 dark:text-white block mb-0.5">• Low Confidence Predictions:</strong>
              <span className="text-slate-600 dark:text-slate-400">If the produce is partly occluded by foliage, stems, or packing netting, clear the occlusion and re-scan.</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <strong className="text-slate-900 dark:text-white block mb-0.5">• Failed Report Downloads:</strong>
              <span className="text-slate-600 dark:text-slate-400">Ensure your browser allows automatic PDF file downloads without pop-up blocking.</span>
            </div>
          </div>
        </section>

        {/* Contact Support Form */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Contact Technical Support Desk
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Have questions regarding calibration, custom crop thresholds, or API integrations? Submit an inquiry directly to the engineering team.
          </p>

          {statusMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g., Threshold Calibration Inquiry for Honeycrisp Apples"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Message & Technical Details
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Please describe your question, produce variety, batch inspection conditions, or error details..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Support Request'}</span>
            </button>
          </form>

          {/* User's Previous Support Inquiries */}
          {tickets.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Your Submitted Support Requests ({tickets.length})
              </h3>
              <div className="space-y-2">
                {tickets.map(t => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">{t.subject}</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-md">{t.message}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {t.status}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
