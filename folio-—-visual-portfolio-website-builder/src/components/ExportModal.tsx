import React, { useState } from 'react';
import {
  Download,
  FileCode,
  FileArchive,
  Printer,
  Share2,
  Copy,
  Check,
  X,
  Globe,
  FileJson,
} from 'lucide-react';
import { Portfolio } from '../types/portfolio';
import {
  downloadStaticSiteZip,
  downloadSingleHtml,
  downloadPortfolioJson,
} from '../utils/exporter';
import { encodeSharePayload, generateQrSvgMatrix } from '../utils/portfolioLogic';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio;
  onUpdateSettings: (patch: Partial<Portfolio['settings']>) => void;
  onPublishStatusChange: (status: 'draft' | 'published') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  onUpdateSettings,
  onPublishStatusChange,
}) => {
  const [zipLoading, setZipLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const shareHash = encodeSharePayload(portfolio);
  const shareUrl = `${window.location.origin}${window.location.pathname}#share=${shareHash}`;
  const qrMatrix = generateQrSvgMatrix(shareUrl);

  const handleCopyShareUrl = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadZip = async () => {
    setZipLoading(true);
    try {
      await downloadStaticSiteZip(portfolio);
      onPublishStatusChange('published');
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-label="Publish and Export Portfolio"
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">
              Publish & Export Portfolio — {portfolio.profile.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Export Modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Primary Export Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <FileArchive className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Static Website (.ZIP)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete bundle with index.html, styles.css, script.js, JSON-LD SEO, and README. Works offline.
                </p>
              </div>
              <button
                type="button"
                disabled={zipLoading}
                onClick={handleDownloadZip}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{zipLoading ? 'Bundling ZIP...' : 'Download .ZIP'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Single HTML File</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Self-contained standalone index.html with embedded styles and assets. Double-click to open anywhere.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  downloadSingleHtml(portfolio);
                  onPublishStatusChange('published');
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .HTML</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <Printer className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Resume / CV PDF</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Triggers print-friendly formatting so you can save a clean PDF directly via your browser print dialog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => window.print(), 200);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <FileJson className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Portfolio JSON</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full lossless backup of your sections, theme, and SEO settings to re-import on any device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadPortfolioJson(portfolio)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .JSON</span>
              </button>
            </div>
          </div>

          {/* Shareable Instant Preview Link & QR Code */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>Shareable Zero-Hosting Preview Link & QR Code</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your portfolio configuration is encoded into the URL hash below so recruiters or clients can preview your live site without waiting for DNS or web hosting.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  aria-label="Shareable Portfolio URL"
                  value={shareUrl}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyShareUrl}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg whitespace-nowrap shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-slate-300 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={portfolio.settings.showMadeWithFolio}
                  onChange={(e) => onUpdateSettings({ showMadeWithFolio: e.target.checked })}
                />
                <span>Display removable &ldquo;Built with FOLIO&rdquo; credit in footer</span>
              </label>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-xl shadow">
                <svg
                  viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                  className="w-28 h-28"
                  aria-label="Portfolio Share QR Code"
                >
                  {qrMatrix.map((row, rIdx) =>
                    row.map((cell, cIdx) =>
                      cell ? (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx}
                          y={rIdx}
                          width={1}
                          height={1}
                          fill="#090D16"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5">Scan for Mobile Preview</span>
            </div>
          </div>

          {/* Hosting Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300">
              Free Step-by-Step Hosting Guides (No Coding Required)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">01. Netlify Drop (30 Seconds)</div>
                <ol className="list-decimal list-inside text-slate-400 space-y-1">
                  <li>Download the Static Website (.ZIP) above and unzip it.</li>
                  <li>Open app.netlify.com/drop in your browser.</li>
                  <li>Drag the unzipped folder onto the page for an instant HTTPS URL.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">02. GitHub Pages</div>
                <ol className="list-decimal list-inside text-slate-400 space-y-1">
                  <li>Create a new public repository named username.github.io.</li>
                  <li>Upload index.html, styles.css, and script.js from the ZIP.</li>
                  <li>Enable GitHub Pages under Settings → Pages → Deploy from main.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">03. Vercel Instant Deploy</div>
                <ol className="list-decimal list-inside text-slate-400 space-y-1">
                  <li>Sign in to vercel.com and click Add New Project.</li>
                  <li>Import your GitHub repository or drag the static folder.</li>
                  <li>Click Deploy—your custom domain SSL is provisioned automatically.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
