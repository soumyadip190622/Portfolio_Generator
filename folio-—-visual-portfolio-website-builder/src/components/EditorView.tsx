import React, { useState, useEffect } from 'react';
import {
  Portfolio,
  PortfolioSection,
  SectionType,
  TemplateId,
  UILanguage,
  VersionSnapshot,
} from '../types/portfolio';
import { TRANSLATIONS } from '../i18n/translations';
import { SECTION_REGISTRY } from '../registries/sectionRegistry';
import { TEMPLATE_REGISTRY, PortfolioMasterRenderer } from '../registries/templateRegistry';
import { COLOR_PALETTES, GOOGLE_FONTS_LIST, FONT_PAIRINGS } from '../data/presets';
import {
  getContrastRatio,
  getContrastRating,
  suggestReadableTextColor,
  reorderSections,
} from '../utils/portfolioLogic';
import {
  StorageUsageInfo,
  isEditorTourCompleted,
  markEditorTourCompleted,
} from '../utils/storage';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  LayoutTemplate,
  Sparkles,
  FileText,
  Download,
  HelpCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  History,
  Check,
  AlertTriangle,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface EditorViewProps {
  portfolio: Portfolio;
  lang: UILanguage;
  storageUsage: StorageUsageInfo;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onUpdatePortfolio: (updater: (prev: Portfolio) => Portfolio, recordHistory?: boolean) => void;
  onOpenTemplateGallery: () => void;
  onOpenExportModal: () => void;
  onOpenResumeImport: () => void;
  onOpenAiReview: () => void;
  onBackToDashboard: () => void;
}

type EditorTab = 'content' | 'design' | 'layout' | 'seo' | 'settings';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export const EditorView: React.FC<EditorViewProps> = ({
  portfolio,
  lang,
  storageUsage,
  canUndo,
  canRedo,
  isSaving,
  onUndo,
  onRedo,
  onUpdatePortfolio,
  onOpenTemplateGallery,
  onOpenExportModal,
  onOpenResumeImport,
  onOpenAiReview,
  onBackToDashboard,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<EditorTab>('content');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    portfolio.sections[0]?.id || ''
  );
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('edit');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showTour, setShowTour] = useState<boolean>(() => !isEditorTourCompleted());
  const [newSectionType, setNewSectionType] = useState<SectionType>('projects');
  const [versionLabel, setVersionLabel] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            onRedo();
          } else {
            onUndo();
          }
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        if (!isInput) {
          e.preventDefault();
          onRedo();
        }
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo]);

  const sortedSections = [...portfolio.sections].sort((a, b) => a.order - b.order);
  const activeSection =
    sortedSections.find((s) => s.id === selectedSectionId) || sortedSections[0];

  const contrastRatio = getContrastRatio(portfolio.theme.text, portfolio.theme.background);
  const contrastInfo = getContrastRating(contrastRatio);

  const handleUpdateSectionData = (sectionId: string, newData: any) => {
    onUpdatePortfolio((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, data: newData } : s
      ),
    }));
  };

  const handleUpdateSectionMeta = (sectionId: string, patch: Partial<PortfolioSection>) => {
    onUpdatePortfolio((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...patch } : s
      ),
    }));
  };

  const handleUpdateProfile = (patch: Partial<Portfolio['profile']>) => {
    onUpdatePortfolio((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  };

  const handleAddSection = () => {
    const reg = SECTION_REGISTRY[newSectionType];
    if (!reg) return;
    const newSec: PortfolioSection = {
      id: `sec-${newSectionType}-${Date.now()}`,
      type: newSectionType,
      title: reg.defaultTitle,
      visible: true,
      order: portfolio.sections.length,
      data: structuredClone(reg.defaultData),
      style: {
        alignment: 'left',
        width: 'standard',
        spacing: 'normal',
        background: 'default',
      },
    };
    onUpdatePortfolio((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));
    setSelectedSectionId(newSec.id);
  };

  const handleResetSectionToDefault = (sec: PortfolioSection) => {
    const reg = SECTION_REGISTRY[sec.type];
    if (!reg) return;
    onUpdatePortfolio((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sec.id
          ? {
              ...s,
              title: reg.defaultTitle,
              data: structuredClone(reg.defaultData),
            }
          : s
      ),
    }));
  };

  const handleDeleteSection = (sectionId: string) => {
    if (portfolio.sections.length <= 1) return;
    onUpdatePortfolio((prev) => {
      const remaining = prev.sections
        .filter((s) => s.id !== sectionId)
        .map((s, idx) => ({ ...s, order: idx }));
      return { ...prev, sections: remaining };
    });
  };

  const handleSaveVersionSnapshot = () => {
    const { versions = [], ...rest } = portfolio;
    const snap: VersionSnapshot = {
      id: `ver-${Date.now()}`,
      label: versionLabel.trim() || `Snapshot ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      portfolioData: structuredClone(rest),
    };
    onUpdatePortfolio(
      (prev) => ({
        ...prev,
        versions: [snap, ...(prev.versions || [])].slice(0, 12),
      }),
      false
    );
    setVersionLabel('');
  };

  const handleRestoreVersion = (snap: VersionSnapshot) => {
    onUpdatePortfolio((prev) => ({
      ...structuredClone(snap.portfolioData),
      versions: prev.versions,
      updatedAt: new Date().toISOString(),
    }));
  };

  if (isFullscreenPreview) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-medium text-slate-300">
            Fullscreen Live Preview — <strong>{portfolio.name}</strong> (
            {TEMPLATE_REGISTRY[portfolio.layout.templateId].name})
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenExportModal}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              {t.exportPublish}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreenPreview(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <PortfolioMasterRenderer portfolio={portfolio} isEditable={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* EDITOR TOP BAR */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/95 px-4 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Back + Portfolio Name + Autosave */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onBackToDashboard}
            aria-label="Back to Portfolios Dashboard"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <input
            type="text"
            aria-label="Portfolio Name"
            value={portfolio.name}
            onChange={(e) =>
              onUpdatePortfolio((prev) => ({ ...prev, name: e.target.value }))
            }
            className="bg-transparent border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1 text-xs sm:text-sm font-bold text-white truncate max-w-[145px] sm:max-w-[240px] focus:outline-none"
          />

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 rounded whitespace-nowrap shrink-0">
            <Check className="w-3 h-3" />
            <span>{isSaving ? t.saving : t.saved}</span>
          </span>
        </div>

        {/* Center: Undo / Redo + AI Tools + Template Gallery */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            aria-label={t.undo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-35 rounded-lg hover:bg-slate-800"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            aria-label={t.redo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-35 rounded-lg hover:bg-slate-800"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={onOpenTemplateGallery}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg whitespace-nowrap shrink-0"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.templatesBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenResumeImport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.resumeImportBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAiReview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.aiAssistBtn}</span>
          </button>
        </div>

        {/* Right: Shortcuts + Fullscreen + Publish/Export */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            aria-label="Keyboard Shortcuts"
            title="Keyboard Shortcuts (?)"
            className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreenPreview(true)}
            aria-label="Fullscreen Preview"
            title="Fullscreen Preview"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg whitespace-nowrap shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportPublish}</span>
          </button>
        </div>
      </header>

      {/* FIRST-VISIT INTERACTIVE ONBOARDING TOUR BANNER */}
      {showTour && (
        <div className="bg-blue-950/90 border-b border-blue-800 px-4 py-2 text-xs text-blue-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div>
            <strong>Welcome to the FOLIO Studio:</strong> Click any section or text directly in the right-hand Live Preview to jump to its editor or edit text inline. Switch between all 8 templates anytime without losing data.
          </div>
          <button
            type="button"
            onClick={() => {
              markEditorTourCompleted();
              setShowTour(false);
            }}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-[11px] shrink-0"
          >
            Got it, dismiss tour
          </button>
        </div>
      )}

      {/* STORAGE WARNING BANNER IF NEAR QUOTA */}
      {storageUsage.isNearLimit && (
        <div className="bg-amber-950/90 border-b border-amber-800 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between shrink-0">
          <span>
            Warning: Local browser storage is at {storageUsage.percent}% ({storageUsage.usedKB} KB). Consider exporting a JSON backup.
          </span>
        </div>
      )}

      {/* MAIN SPLIT SCREEN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: TABBED EDITOR (Content | Design | Layout | SEO | Settings) */}
        <aside
          className={`w-full lg:w-[460px] xl:w-[500px] border-r border-slate-800 bg-slate-900/70 flex flex-col shrink-0 ${
            mobileViewMode === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 5-Tab Bar */}
          <div
            role="tablist"
            aria-label="Portfolio Editor Tabs"
            className="grid grid-cols-5 border-b border-slate-800 bg-slate-950 px-2 pt-2 gap-1 shrink-0"
          >
            {(
              [
                { id: 'content', label: t.tabContent },
                { id: 'design', label: t.tabDesign },
                { id: 'layout', label: t.tabLayout },
                { id: 'seo', label: t.tabSeo },
                { id: 'settings', label: t.tabSettings },
              ] as { id: EditorTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap truncate ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Quick Action Strip (Templates + Resume Import + AI Review + Undo) */}
          <div className="flex lg:hidden items-center justify-between gap-2 px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenTemplateGallery}
                className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded whitespace-nowrap"
              >
                {t.templatesBtn}
              </button>
              <button
                type="button"
                onClick={onOpenResumeImport}
                className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded whitespace-nowrap"
              >
                {t.resumeImportBtn}
              </button>
              <button
                type="button"
                onClick={onOpenAiReview}
                className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded whitespace-nowrap"
              >
                {t.aiAssistBtn}
              </button>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={!canUndo}
                onClick={onUndo}
                aria-label="Mobile Undo"
                className="p-1 text-slate-300 disabled:opacity-40"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!canRedo}
                onClick={onRedo}
                aria-label="Mobile Redo"
                className="p-1 text-slate-300 disabled:opacity-40"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* =====================================
                TAB 1: CONTENT
               ===================================== */}
            {activeTab === 'content' && (
              <div className="space-y-5">
                {/* Section Selector Pills + Add Section */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Select Section to Edit ({sortedSections.length})
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sortedSections.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                          activeSection?.id === sec.id
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{sec.title}</span>
                        {!sec.visible && <EyeOff className="w-3 h-3 opacity-60" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Section Editor Box */}
                {activeSection && SECTION_REGISTRY[activeSection.type] && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex-1">
                        <input
                          type="text"
                          aria-label="Section Title"
                          value={activeSection.title}
                          onChange={(e) =>
                            handleUpdateSectionMeta(activeSection.id, {
                              title: e.target.value,
                            })
                          }
                          className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-sm font-bold text-white w-full"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateSectionMeta(activeSection.id, {
                              visible: !activeSection.visible,
                            })
                          }
                          title={activeSection.visible ? 'Hide section' : 'Show section'}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                        >
                          {activeSection.visible ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetSectionToDefault(activeSection)}
                          title="Reset section to default"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {activeSection.type !== 'hero' && (
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Section Subtitle (optional)
                        </label>
                        <input
                          type="text"
                          value={activeSection.subtitle || ''}
                          onChange={(e) =>
                            handleUpdateSectionMeta(activeSection.id, {
                              subtitle: e.target.value,
                            })
                          }
                          placeholder="Brief section lead-in..."
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                    )}

                    {/* Render Registered Form Component */}
                    {React.createElement(SECTION_REGISTRY[activeSection.type].Editor, {
                      section: activeSection,
                      portfolio,
                      onUpdateSectionData: (newData) =>
                        handleUpdateSectionData(activeSection.id, newData),
                      onUpdateSectionMeta: (patch) =>
                        handleUpdateSectionMeta(activeSection.id, patch),
                      onUpdateProfile: handleUpdateProfile,
                    })}
                  </div>
                )}

                {/* Add New Section Bar */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Add Another Section from Registry (16 Types)
                  </label>
                  <div className="flex gap-2">
                    <select
                      aria-label="New Section Type"
                      value={newSectionType}
                      onChange={(e) => setNewSectionType(e.target.value as SectionType)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    >
                      {Object.values(SECTION_REGISTRY).map((entry) => (
                        <option key={entry.type} value={entry.type}>
                          {entry.label} — {entry.description.slice(0, 42)}...
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================
                TAB 2: DESIGN (Colors, Contrast, Fonts, Hero, Animations, CSS)
               ===================================== */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                {/* Active Template Banner */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Active Template</div>
                    <div className="text-sm font-bold text-white">
                      {TEMPLATE_REGISTRY[portfolio.layout.templateId].name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenTemplateGallery}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                  >
                    Switch Template
                  </button>
                </div>

                {/* 12 Preset Color Palettes */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    12 Curated Color Palettes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COLOR_PALETTES.map((pal) => {
                      const active = portfolio.theme.paletteId === pal.id;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() =>
                            onUpdatePortfolio((prev) => ({
                              ...prev,
                              theme: {
                                ...prev.theme,
                                paletteId: pal.id,
                                mode: pal.mode,
                                primary: pal.primary,
                                secondary: pal.secondary,
                                background: pal.background,
                                surface: pal.surface,
                                text: pal.text,
                                mutedText: pal.mutedText,
                                gradient: pal.gradient,
                              },
                            }))
                          }
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            active
                              ? 'border-blue-500 bg-blue-950/30'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span
                              style={{ backgroundColor: pal.background }}
                              className="w-4 h-4 rounded-full border border-slate-600"
                            />
                            <span
                              style={{ backgroundColor: pal.primary }}
                              className="w-4 h-4 rounded-full"
                            />
                            <span
                              style={{ backgroundColor: pal.text }}
                              className="w-4 h-4 rounded-full border border-slate-600"
                            />
                          </div>
                          <div className="text-[11px] font-medium text-slate-200 truncate">
                            {pal.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Pickers + WCAG Contrast Checker */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-200">
                    Custom Colors & WCAG Contrast Checker
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {(
                      [
                        { key: 'primary', label: 'Primary' },
                        { key: 'secondary', label: 'Accent' },
                        { key: 'background', label: 'Canvas' },
                        { key: 'surface', label: 'Surface' },
                        { key: 'text', label: 'Text' },
                      ] as const
                    ).map((col) => (
                      <label key={col.key} className="space-y-1">
                        <span className="text-[11px] text-slate-400 block">{col.label}</span>
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded p-1">
                          <input
                            type="color"
                            value={portfolio.theme[col.key]}
                            onChange={(e) =>
                              onUpdatePortfolio((prev) => ({
                                ...prev,
                                theme: { ...prev.theme, [col.key]: e.target.value },
                              }))
                            }
                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="font-mono text-[10px] text-slate-300 uppercase">
                            {portfolio.theme[col.key]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Live Contrast Rating Banner */}
                  <div
                    className={`p-3 rounded-lg border flex items-center justify-between gap-2 text-xs ${
                      contrastInfo.passesAA
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                        : 'bg-amber-950/50 border-amber-700 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {contrastInfo.passesAA ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-mono font-bold tabular-nums">
                          {contrastRatio}:1 ({contrastInfo.level})
                        </span>{' '}
                        — {contrastInfo.message}
                      </div>
                    </div>

                    {!contrastInfo.passesAA && (
                      <button
                        type="button"
                        onClick={() => {
                          const suggested = suggestReadableTextColor(
                            portfolio.theme.background
                          );
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              text: suggested.text,
                              mutedText: suggested.mutedText,
                            },
                          }));
                        }}
                        className="px-2.5 py-1 bg-amber-500 text-slate-950 font-semibold rounded whitespace-nowrap shrink-0"
                      >
                        Auto-Fix Contrast
                      </button>
                    )}
                  </div>
                </div>

                {/* Typography & Font Pairing Presets */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-200">
                    Typography & 26 Google Fonts
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FONT_PAIRINGS.slice(0, 4).map((pair) => (
                      <button
                        key={pair.id}
                        type="button"
                        onClick={() =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              headingFont: pair.headingFont,
                              bodyFont: pair.bodyFont,
                              monoFont: pair.monoFont,
                            },
                          }))
                        }
                        className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left"
                      >
                        <div className="text-xs font-semibold text-white">{pair.name}</div>
                        <div className="text-[11px] text-slate-400">{pair.description}</div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Heading Font (26 Google Fonts)
                      </label>
                      <select
                        value={portfolio.theme.headingFont}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, headingFont: e.target.value },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        {GOOGLE_FONTS_LIST.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Body Prose Font
                      </label>
                      <select
                        value={portfolio.theme.bodyFont}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, bodyFont: e.target.value },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        {GOOGLE_FONTS_LIST.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Hero Options */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-200">Hero Presentation</div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={portfolio.layout.heroStyle.showAvatar}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            layout: {
                              ...prev.layout,
                              heroStyle: {
                                ...prev.layout.heroStyle,
                                showAvatar: e.target.checked,
                              },
                            },
                          }))
                        }
                      />
                      <span>Show Avatar Portrait</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={portfolio.layout.heroStyle.typingAnimation}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            layout: {
                              ...prev.layout,
                              heroStyle: {
                                ...prev.layout.heroStyle,
                                typingAnimation: e.target.checked,
                              },
                            },
                          }))
                        }
                      />
                      <span>Display Role Sub-Header</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={portfolio.layout.heroStyle.primaryCtaText}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          layout: {
                            ...prev.layout,
                            heroStyle: {
                              ...prev.layout.heroStyle,
                              primaryCtaText: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Primary CTA Text"
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={portfolio.layout.heroStyle.secondaryCtaText}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          layout: {
                            ...prev.layout,
                            heroStyle: {
                              ...prev.layout.heroStyle,
                              secondaryCtaText: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Secondary CTA Text"
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Scoped Custom CSS Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-200">
                    Custom CSS (Scoped & Sanitized to Portfolio Preview)
                  </label>
                  <textarea
                    rows={3}
                    value={portfolio.theme.customCss}
                    onChange={(e) =>
                      onUpdatePortfolio((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, customCss: e.target.value },
                      }))
                    }
                    placeholder="/* Example: h1 { letter-spacing: -0.04em; } */"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-300"
                  />
                </div>
              </div>
            )}

            {/* =====================================
                TAB 3: LAYOUT (Drag-and-Drop Reorder, Visibility, Navbar, Spacing)
               ===================================== */}
            {activeTab === 'layout' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-200">
                    Global Navigation & Container Width
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Navbar Style</label>
                      <select
                        value={portfolio.layout.navbarStyle}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            layout: {
                              ...prev.layout,
                              navbarStyle: e.target.value as any,
                            },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="sticky">Sticky Top Bar</option>
                        <option value="floating-pill">Floating Glass Pill</option>
                        <option value="minimal">Minimal Static</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Container Width
                      </label>
                      <select
                        value={portfolio.layout.containerWidth}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            layout: {
                              ...prev.layout,
                              containerWidth: e.target.value as any,
                            },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="narrow">Narrow Editorial</option>
                        <option value="standard">Standard (1024px)</option>
                        <option value="wide">Wide Studio (1152px)</option>
                        <option value="full">Full Bleed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Drag-and-Drop / Button Section Reorder List */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-200">
                    Drag or Click Arrows to Reorder Sections
                  </div>
                  {sortedSections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      draggable
                      onDragStart={() => setDraggedIdx(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedIdx !== null && draggedIdx !== idx) {
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            sections: reorderSections(prev.sections, draggedIdx, idx),
                          }));
                        }
                        setDraggedIdx(null);
                      }}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 cursor-move"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                          <span className="text-xs font-semibold text-white">{sec.title}</span>
                          <span className="text-[11px] text-slate-500">({sec.type})</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdatePortfolio((prev) => ({
                                ...prev,
                                sections: reorderSections(prev.sections, idx, idx - 1),
                              }))
                            }
                            disabled={idx === 0}
                            aria-label={`Move ${sec.title} up`}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdatePortfolio((prev) => ({
                                ...prev,
                                sections: reorderSections(prev.sections, idx, idx + 1),
                              }))
                            }
                            disabled={idx === sortedSections.length - 1}
                            aria-label={`Move ${sec.title} down`}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateSectionMeta(sec.id, { visible: !sec.visible })
                            }
                            aria-label={`Toggle visibility for ${sec.title}`}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            {sec.visible ? (
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSection(sec.id)}
                            aria-label={`Delete section ${sec.title}`}
                            className="p-1 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Per-section Spacing & Background */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-900 text-[11px]">
                        <select
                          aria-label={`${sec.title} alignment`}
                          value={sec.style?.alignment || 'left'}
                          onChange={(e) =>
                            handleUpdateSectionMeta(sec.id, {
                              style: { ...sec.style, alignment: e.target.value as any },
                            })
                          }
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300"
                        >
                          <option value="left">Align Left</option>
                          <option value="center">Align Center</option>
                        </select>
                        <select
                          aria-label={`${sec.title} spacing`}
                          value={sec.style?.spacing || 'normal'}
                          onChange={(e) =>
                            handleUpdateSectionMeta(sec.id, {
                              style: { ...sec.style, spacing: e.target.value as any },
                            })
                          }
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300"
                        >
                          <option value="compact">Compact</option>
                          <option value="normal">Normal Spacing</option>
                          <option value="spacious">Spacious</option>
                        </select>
                        <select
                          aria-label={`${sec.title} surface`}
                          value={sec.style?.background || 'default'}
                          onChange={(e) =>
                            handleUpdateSectionMeta(sec.id, {
                              style: { ...sec.style, background: e.target.value as any },
                            })
                          }
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300"
                        >
                          <option value="default">Default Canvas</option>
                          <option value="surface">Elevated Surface</option>
                          <option value="gradient">Accent Gradient</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =====================================
                TAB 4: SEO & AUDIT
               ===================================== */}
            {activeTab === 'seo' && (
              <div className="space-y-5">
                {/* Live Google Search Result Preview */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400">
                    LIVE GOOGLE SEARCH RESULT PREVIEW
                  </div>
                  <div className="p-3.5 rounded-lg bg-white text-slate-900 space-y-1">
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span>{portfolio.seo.faviconEmoji || '⚡'}</span>
                      <span>
                        https://{portfolio.settings.customSlug || 'portfolio'}.folio.site
                      </span>
                    </div>
                    <div className="text-base font-semibold text-[#1a0dab] hover:underline truncate">
                      {portfolio.seo.title || `${portfolio.profile.name} — Portfolio`}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {portfolio.seo.description || portfolio.profile.headline}
                    </div>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Meta Page Title
                    </label>
                    <input
                      type="text"
                      value={portfolio.seo.title}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, title: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <label className="font-medium text-slate-300">Meta Description</label>
                      <span className="text-slate-500 tabular-nums">
                        {portfolio.seo.description.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={portfolio.seo.description}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, description: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(portfolio.seo.keywords || []).join(', ')}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            keywords: e.target.value
                              .split(',')
                              .map((k) => k.trim())
                              .filter(Boolean),
                          },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Favicon Emoji
                      </label>
                      <input
                        type="text"
                        value={portfolio.seo.faviconEmoji}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            seo: { ...prev.seo, faviconEmoji: e.target.value },
                          }))
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        HTML Language Code
                      </label>
                      <select
                        value={portfolio.seo.language || 'en'}
                        onChange={(e) =>
                          onUpdatePortfolio((prev) => ({
                            ...prev,
                            seo: { ...prev.seo, language: e.target.value },
                          }))
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="en">English (en)</option>
                        <option value="bn">Bengali (bn)</option>
                        <option value="hi">Hindi (hi)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* AI Portfolio Audit Trigger */}
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/60 space-y-2">
                  <div className="text-xs font-semibold text-blue-200">
                    Gemini AI Portfolio Score & 5-Point Audit
                  </div>
                  <p className="text-xs text-slate-300">
                    Evaluate your portfolio&apos;s content impact, design hierarchy, and search metadata.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAiReview}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Portfolio Review</span>
                  </button>
                </div>
              </div>
            )}

            {/* =====================================
                TAB 5: SETTINGS & VERSION HISTORY
               ===================================== */}
            {activeTab === 'settings' && (
              <div className="space-y-5">
                {/* Version History Snapshot Manager */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <History className="w-4 h-4 text-blue-400" />
                    <span>Version History & Snapshots</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={versionLabel}
                      onChange={(e) => setVersionLabel(e.target.value)}
                      placeholder="Version label (e.g. Before layout change)"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleSaveVersionSnapshot}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg whitespace-nowrap shrink-0"
                    >
                      Save Version
                    </button>
                  </div>

                  {Array.isArray(portfolio.versions) && portfolio.versions.length > 0 ? (
                    <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto">
                      {portfolio.versions.map((ver) => (
                        <div
                          key={ver.id}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-medium text-slate-200">{ver.label}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {new Date(ver.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRestoreVersion(ver)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-white rounded text-[11px] font-medium"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No saved snapshots yet. Click &ldquo;Save Version&rdquo; above to create a checkpoint.
                    </p>
                  )}
                </div>

                {/* Contact Form Endpoint & Slug */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Portfolio Slug
                    </label>
                    <input
                      type="text"
                      value={portfolio.settings.customSlug}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          settings: { ...prev.settings, customSlug: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Formspree / Web3Forms Endpoint URL (Optional — falls back to mailto:)
                    </label>
                    <input
                      type="url"
                      value={portfolio.settings.formEndpoint}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          settings: { ...prev.settings, formEndpoint: e.target.value },
                        }))
                      }
                      placeholder="https://formspree.io/f/your-id"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={portfolio.settings.showMadeWithFolio}
                      onChange={(e) =>
                        onUpdatePortfolio((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            showMadeWithFolio: e.target.checked,
                          },
                        }))
                      }
                    />
                    <span>Show &ldquo;Built with FOLIO&rdquo; badge in exported footer</span>
                  </label>
                </div>

                {/* Local Storage Quota Meter */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Browser LocalStorage Usage</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {storageUsage.usedKB} KB / {storageUsage.maxKB} KB ({storageUsage.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(2, storageUsage.percent)}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL: LIVE RESPONSIVE PREVIEW */}
        <main
          className={`flex-1 bg-slate-950 flex flex-col overflow-hidden ${
            mobileViewMode === 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Device & Zoom Toolbar */}
          <div className="h-11 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                aria-label="Desktop Preview Frame"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                  device === 'desktop'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('tablet')}
                aria-label="Tablet Preview Frame"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                  device === 'tablet'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                aria-label="Mobile Preview Frame"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                  device === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 hidden xl:block">
              Click any section in preview to jump to its editor · Click headings/text to edit inline
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Zoom:</label>
              <select
                aria-label="Preview Zoom Level"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
              >
                <option value={75}>75%</option>
                <option value={90}>90%</option>
                <option value={100}>100%</option>
              </select>
            </div>
          </div>

          {/* Live Portfolio Canvas Container */}
          <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center bg-[#05070E]">
            <div
              style={{
                width:
                  device === 'mobile'
                    ? '390px'
                    : device === 'tablet'
                    ? '768px'
                    : '100%',
                transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                transformOrigin: 'top center',
              }}
              className="h-fit min-h-full rounded-xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-200"
            >
              <PortfolioMasterRenderer
                portfolio={portfolio}
                isEditable={true}
                selectedSectionId={selectedSectionId}
                onSelectSection={(secId) => {
                  setSelectedSectionId(secId);
                  setActiveTab('content');
                }}
                onInlineUpdateSection={(secId, patch) =>
                  handleUpdateSectionMeta(secId, patch)
                }
                onInlineUpdateProfile={handleUpdateProfile}
              />
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM TAB BAR TOGGLING BETWEEN EDIT AND LIVE PREVIEW */}
      <div className="lg:hidden h-12 border-t border-slate-800 bg-slate-900 grid grid-cols-2 shrink-0">
        <button
          type="button"
          onClick={() => setMobileViewMode('edit')}
          className={`text-xs font-semibold flex items-center justify-center gap-2 ${
            mobileViewMode === 'edit' ? 'text-blue-400 bg-slate-950' : 'text-slate-400'
          }`}
        >
          <span>{t.editMode}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileViewMode('preview')}
          className={`text-xs font-semibold flex items-center justify-center gap-2 ${
            mobileViewMode === 'preview' ? 'text-blue-400 bg-slate-950' : 'text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.previewMode}</span>
        </button>
      </div>

      {/* KEYBOARD SHORTCUTS MODAL (?) */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-label="Keyboard Shortcuts"
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                aria-label="Close Keyboard Shortcuts"
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Undo last change</span>
                <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-700 rounded font-mono">
                  Ctrl + Z
                </kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Redo change</span>
                <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-700 rounded font-mono">
                  Ctrl + Y
                </kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Toggle Shortcuts Panel</span>
                <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-700 rounded font-mono">
                  ?
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
