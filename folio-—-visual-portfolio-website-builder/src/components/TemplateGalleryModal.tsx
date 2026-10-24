import React, { useState } from 'react';
import { LayoutTemplate, Check, X, Eye, Sparkles } from 'lucide-react';
import { Portfolio, TemplateId } from '../types/portfolio';
import { TEMPLATE_REGISTRY, PortfolioMasterRenderer } from '../registries/templateRegistry';
import { applyTemplateToPortfolio } from '../utils/portfolioLogic';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio;
  onApplyTemplate: (templateId: TemplateId, applyDefaultColors: boolean) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  onApplyTemplate,
}) => {
  const [previewTemplateId, setPreviewTemplateId] = useState<TemplateId | null>(null);
  const [applyThemeColors, setApplyThemeColors] = useState(true);

  if (!isOpen) return null;

  const templates = Object.values(TEMPLATE_REGISTRY);
  const currentId = portfolio.layout.templateId;

  const previewPortfolio = previewTemplateId
    ? applyTemplateToPortfolio(
        portfolio,
        previewTemplateId,
        applyThemeColors ? TEMPLATE_REGISTRY[previewTemplateId].defaultThemePatch : undefined
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-label="Template Gallery"
        className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <LayoutTemplate className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-semibold text-white">
                8 Architectural Templates — Live Data Preview
              </h2>
              <p className="text-xs text-slate-400">
                Switching templates never erases your profile or section content.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={applyThemeColors}
                onChange={(e) => setApplyThemeColors(e.target.checked)}
              />
              <span>Also apply template&apos;s signature typography & palette</span>
            </label>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Template Gallery"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {previewPortfolio && previewTemplateId ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Before / After Comparison: <strong>{TEMPLATE_REGISTRY[currentId].name}</strong> →{' '}
                <strong className="text-blue-400">{TEMPLATE_REGISTRY[previewTemplateId].name}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplateId(null)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Back to All Templates
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyTemplate(previewTemplateId, applyThemeColors);
                    setPreviewTemplateId(null);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply {TEMPLATE_REGISTRY[previewTemplateId].name}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden">
              <div className="overflow-y-auto h-[65vh] relative">
                <div className="sticky top-2 left-2 z-30 inline-block m-3 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-[11px] font-mono text-slate-300">
                  BEFORE: {TEMPLATE_REGISTRY[currentId].name}
                </div>
                <div className="origin-top scale-90">
                  <PortfolioMasterRenderer portfolio={portfolio} isEditable={false} />
                </div>
              </div>
              <div className="overflow-y-auto h-[65vh] relative">
                <div className="sticky top-2 left-2 z-30 inline-block m-3 px-2.5 py-1 rounded bg-blue-600 text-[11px] font-mono text-white">
                  AFTER: {TEMPLATE_REGISTRY[previewTemplateId].name}
                </div>
                <div className="origin-top scale-90">
                  <PortfolioMasterRenderer portfolio={previewPortfolio} isEditable={false} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((tpl) => {
              const isCurrent = tpl.id === currentId;
              const thumbPortfolio = applyTemplateToPortfolio(
                portfolio,
                tpl.id,
                tpl.defaultThemePatch
              );

              return (
                <div
                  key={tpl.id}
                  className={`rounded-xl border overflow-hidden flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-blue-500 bg-slate-950 ring-1 ring-blue-500/40'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Scaled Live Mini-Render Thumbnail */}
                    <div
                      onClick={() => setPreviewTemplateId(tpl.id)}
                      className="h-44 w-full overflow-hidden relative bg-slate-900 border-b border-slate-800 cursor-pointer group"
                    >
                      <div
                        style={{ width: '250%', height: '250%', transform: 'scale(0.4)', transformOrigin: 'top left' }}
                        className="pointer-events-none select-none"
                      >
                        <PortfolioMasterRenderer portfolio={thumbPortfolio} isEditable={false} />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/95 text-white text-xs font-medium border border-slate-700">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Before / After Preview</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{tpl.category}</span>
                        {isCurrent && (
                          <span className="text-blue-400 font-semibold">Active Template</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white">{tpl.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{tpl.tagline}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyTemplate(tpl.id, applyThemeColors);
                        onClose();
                      }}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Re-apply Theme</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Use Template</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplateId(tpl.id)}
                      aria-label={`Compare ${tpl.name}`}
                      className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
