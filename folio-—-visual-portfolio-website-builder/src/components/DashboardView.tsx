import React, { useState } from 'react';
import {
  Portfolio,
  UILanguage,
} from '../types/portfolio';
import { TRANSLATIONS } from '../i18n/translations';
import { TEMPLATE_REGISTRY, PortfolioMasterRenderer } from '../registries/templateRegistry';
import { downloadPortfolioJson } from '../utils/exporter';
import { validatePortfolio } from '../utils/portfolioLogic';
import { StorageUsageInfo } from '../utils/storage';
import {
  DEVELOPER_SAMPLE_PORTFOLIO,
  DESIGNER_SAMPLE_PORTFOLIO,
  PHOTOGRAPHER_SAMPLE_PORTFOLIO,
} from '../data/samplePortfolios';
import {
  Plus,
  Copy,
  Trash2,
  Edit3,
  Upload,
  Download,
  HardDrive,
  Sparkles,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';

interface DashboardViewProps {
  portfolios: Portfolio[];
  lang: UILanguage;
  storageUsage: StorageUsageInfo;
  onSelectPortfolio: (id: string) => void;
  onCreateNewWizard: () => void;
  onDuplicatePortfolio: (id: string) => void;
  onRenamePortfolio: (id: string, newName: string) => void;
  onDeletePortfolio: (id: string) => void;
  onImportPortfolio: (portfolio: Portfolio) => void;
  onBackToLanding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  portfolios,
  lang,
  storageUsage,
  onSelectPortfolio,
  onCreateNewWizard,
  onDuplicatePortfolio,
  onRenamePortfolio,
  onDeletePortfolio,
  onImportPortfolio,
  onBackToLanding,
}) => {
  const t = TRANSLATIONS[lang];
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result || ''));
        const check = validatePortfolio(parsed);
        if (!check.valid) {
          setImportError(`Invalid portfolio JSON: ${check.errors.join(' ')}`);
          return;
        }
        const imported: Portfolio = {
          ...parsed,
          id: `folio-import-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        };
        onImportPortfolio(imported);
      } catch {
        setImportError('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sample: Portfolio) => {
    const cloned = structuredClone(sample);
    cloned.id = `folio-sample-${Date.now()}`;
    cloned.updatedAt = new Date().toISOString();
    onImportPortfolio(cloned);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar following clean 3-zone structure */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={onBackToLanding}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>FOLIO</span>
        </button>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <span>{t.guestMode}</span>
          <span>·</span>
          <span className="font-mono tabular-nums flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            Storage: {storageUsage.usedKB} KB ({storageUsage.percent}%)
          </span>
        </div>

        <button
          type="button"
          onClick={onCreateNewWizard}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newPortfolio}</span>
        </button>
      </header>

      <main className="max-w-7xl w-full mx-auto px-6 py-10 space-y-8 flex-1">
        {/* Heading + Quick Actions Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t.dashboardTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">{t.dashboardSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.importJson}</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => handleLoadSample(DEVELOPER_SAMPLE_PORTFOLIO)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Developer Sample</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample(DESIGNER_SAMPLE_PORTFOLIO)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>+ Designer Sample</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample(PHOTOGRAPHER_SAMPLE_PORTFOLIO)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Photographer Sample</span>
            </button>
          </div>
        </div>

        {importError && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center justify-between">
            <span>{importError}</span>
            <button type="button" onClick={() => setImportError(null)} className="text-red-300">
              Dismiss
            </button>
          </div>
        )}

        {/* Portfolios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((item) => {
            const tpl = TEMPLATE_REGISTRY[item.layout.templateId] || TEMPLATE_REGISTRY['minimal-clean'];
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  {/* Live Scaled Portfolio Preview Card Thumbnail */}
                  <div
                    onClick={() => onSelectPortfolio(item.id)}
                    className="h-48 w-full overflow-hidden relative bg-slate-950 border-b border-slate-800 cursor-pointer group"
                  >
                    <div
                      style={{
                        width: '280%',
                        height: '280%',
                        transform: 'scale(0.357)',
                        transformOrigin: 'top left',
                      }}
                      className="pointer-events-none select-none"
                    >
                      <PortfolioMasterRenderer portfolio={item} isEditable={false} />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-lg">
                        Open in Visual Editor →
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{item.profession}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tpl.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className={item.status === 'published' ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {renamingId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={renameText}
                          onChange={(e) => setRenameText(e.target.value)}
                          className="flex-1 bg-slate-950 border border-blue-500 rounded px-2.5 py-1 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (renameText.trim()) {
                              onRenamePortfolio(item.id, renameText.trim());
                            }
                            setRenamingId(null);
                          }}
                          aria-label="Save new portfolio name"
                          className="p-1.5 bg-blue-600 text-white rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenamingId(null)}
                          aria-label="Cancel rename"
                          className="p-1.5 text-slate-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h2 className="text-base font-bold text-white truncate">{item.name}</h2>
                    )}

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.profile.name} — {item.profile.headline}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPortfolio(item.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                  >
                    Edit Portfolio
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingId(item.id);
                        setRenameText(item.name);
                      }}
                      aria-label={`Rename ${item.name}`}
                      title="Rename"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicatePortfolio(item.id)}
                      aria-label={`Duplicate ${item.name}`}
                      title="Duplicate"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadPortfolioJson(item)}
                      aria-label={`Export JSON for ${item.name}`}
                      title="Export JSON"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      aria-label={`Delete ${item.name}`}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {confirmDeleteId === item.id && (
                  <div className="px-5 py-3 bg-red-950/80 border-t border-red-800 flex items-center justify-between text-xs">
                    <span className="text-red-200">Delete this portfolio?</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onDeletePortfolio(item.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2.5 py-1 bg-red-600 text-white rounded font-semibold"
                      >
                        Confirm Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
