import React, { useState } from 'react';
import {
  FileText,
  Wand2,
  Check,
  RefreshCw,
  X,
  Upload,
  Loader2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Portfolio } from '../types/portfolio';

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyExtracted: (extracted: any) => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  isOpen,
  onClose,
  onApplyExtracted,
}) => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      setResumeText(content.slice(0, 15000));
    };
    reader.readAsText(file);
  };

  const handleExtract = async () => {
    if (resumeText.trim().length < 15) {
      setError('Please paste at least a few lines of resume text or upload a text/markdown resume file.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Could not parse resume.');
      }
      setExtractedData(json.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse resume with AI.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleResumeText = () => {
    setResumeText(
      `Maya Chen\nSenior Full-Stack Product Engineer\nSan Francisco, CA | maya.chen@example.com | +1 (415) 891-2230\n\nSummary:\nProduct-minded engineer with 7+ years building collaborative web software, design systems, and AI workflows using TypeScript, React, Node.js, and PostgreSQL.\n\nExperience:\nLead Product Engineer at Nimbus Studio (2023 - Present)\n- Architected real-time document collaboration engine for 85,000+ monthly active teams.\n- Cut initial page load time by 48% through selective hydration and edge caching.\n\nEducation:\nB.S. in Computer Science, Cornell University (2015 - 2019)`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-label="AI Resume Import"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">AI Resume Import (Gemini)</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Resume Import Modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {!extractedData ? (
            <>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste your resume text below or upload a text/markdown file. Gemini AI will extract your profile, bio, skills, work history, and education into structured portfolio sections for you to review before applying.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Resume (.txt, .md)</span>
                  <input
                    type="file"
                    accept=".txt,.md,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={loadSampleResumeText}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Paste sample resume to test
                </button>
              </div>

              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your full resume or CV text here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleExtract}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Extract Structured Data</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200">
                Review the extracted fields below. Clicking <strong>Accept & Pre-fill Portfolio</strong> will update your Profile, About, Skills, Experience, and Education sections.
              </div>

              <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Name & Headline:</span>
                  <p className="font-semibold text-white mt-0.5">
                    {extractedData.profile?.name} — {extractedData.profile?.headline}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Bio Summary:</span>
                  <p className="text-slate-200 mt-0.5">{extractedData.about?.bio}</p>
                </div>
                {Array.isArray(extractedData.skills) && extractedData.skills.length > 0 && (
                  <div>
                    <span className="text-slate-400">Extracted Skills ({extractedData.skills.length}):</span>
                    <p className="text-slate-200 mt-0.5">
                      {extractedData.skills.map((s: any) => s.name).join(' · ')}
                    </p>
                  </div>
                )}
                {Array.isArray(extractedData.experience) && extractedData.experience.length > 0 && (
                  <div>
                    <span className="text-slate-400">Experience Roles ({extractedData.experience.length}):</span>
                    <ul className="list-disc list-inside text-slate-200 mt-0.5">
                      {extractedData.experience.map((e: any, idx: number) => (
                        <li key={idx}>
                          {e.role} at {e.company} ({e.startDate || '2022'} – {e.endDate || 'Present'})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onApplyExtracted(extractedData);
                    setExtractedData(null);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Pre-fill Portfolio</span>
                </button>
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExtractedData(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Discard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PortfolioReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio;
}

export const PortfolioReviewModal: React.FC<PortfolioReviewModalProps> = ({
  isOpen,
  onClose,
  portfolio,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<{
    score: number;
    summary: string;
    tips: Array<{ category: string; title: string; detail: string }>;
  } | null>(null);

  const runReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/review-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Could not complete AI portfolio review.');
      }
      setReview(data);
    } catch (err: any) {
      setError(err?.message || 'Error running portfolio audit.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !review && !loading) {
      runReview();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-label="AI Portfolio Review"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">AI Portfolio Audit & Recommendations</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI Review Modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-300">
              <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
              <p className="text-sm">Evaluating content depth, visual hierarchy, and SEO readiness...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={runReview}
                className="px-3 py-1 bg-red-800 text-white rounded"
              >
                Retry
              </button>
            </div>
          )}

          {review && !loading && (
            <>
              <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-16 h-16 rounded-xl bg-blue-600/20 border border-blue-500/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-blue-400 tabular-nums">{review.score}</span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Executive Audit Summary</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{review.summary}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-300">
                  5 Actionable Improvement Tips
                </h4>
                {review.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-blue-400 font-semibold">0{idx + 1}.</span>
                      <span className="text-slate-400">{tip.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="font-semibold text-slate-100">{tip.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-6">{tip.detail}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={runReview}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Audit</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
