/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Portfolio,
  TemplateId,
  UILanguage,
} from './types/portfolio';
import { ALL_SAMPLE_PORTFOLIOS, DEVELOPER_SAMPLE_PORTFOLIO } from './data/samplePortfolios';
import { storageAdapter, StorageUsageInfo } from './utils/storage';
import {
  applyTemplateToPortfolio,
  decodeSharePayload,
} from './utils/portfolioLogic';
import { TEMPLATE_REGISTRY, PortfolioMasterRenderer } from './registries/templateRegistry';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { EditorView } from './components/EditorView';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { ExportModal } from './components/ExportModal';
import { ResumeImportModal, PortfolioReviewModal } from './components/AIModals';

type AppScreen = 'landing' | 'dashboard' | 'wizard' | 'editor' | 'shared-preview';

export default function App() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const loaded = storageAdapter.loadPortfolios();
    if (loaded.length > 0) return loaded;
    storageAdapter.savePortfolios(ALL_SAMPLE_PORTFOLIOS);
    return ALL_SAMPLE_PORTFOLIOS;
  });

  const [activeId, setActiveId] = useState<string>(() => {
    const savedId = storageAdapter.getActivePortfolioId();
    if (savedId) return savedId;
    return ALL_SAMPLE_PORTFOLIOS[0].id;
  });

  const [screen, setScreen] = useState<AppScreen>(() => {
    if (window.location.hash.startsWith('#share=')) {
      return 'shared-preview';
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return 'editor';
    }
    return 'landing';
  });

  const [sharedPortfolio, setSharedPortfolio] = useState<Portfolio | null>(() => {
    if (window.location.hash.startsWith('#share=')) {
      const encoded = window.location.hash.replace('#share=', '');
      return decodeSharePayload(encoded);
    }
    return null;
  });

  const [lang, setLang] = useState<UILanguage>('en');
  const [appTheme, setAppTheme] = useState<'dark' | 'light'>('dark');
  const [isSaving, setIsSaving] = useState(false);
  const [storageUsage, setStorageUsage] = useState<StorageUsageInfo>(() =>
    storageAdapter.getStorageUsage()
  );

  // Undo / Redo History stacks for active portfolio
  const [historyPast, setHistoryPast] = useState<Portfolio[]>([]);
  const [historyFuture, setHistoryFuture] = useState<Portfolio[]>([]);

  // Modals state
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResumeImportOpen, setIsResumeImportOpen] = useState(false);
  const [isAiReviewOpen, setIsAiReviewOpen] = useState(false);

  const activePortfolio =
    portfolios.find((p) => p.id === activeId) || portfolios[0] || DEVELOPER_SAMPLE_PORTFOLIO;

  // Persist portfolios to localStorage automatically
  useEffect(() => {
    setIsSaving(true);
    storageAdapter.savePortfolios(portfolios);
    storageAdapter.setActivePortfolioId(activeId);
    setStorageUsage(storageAdapter.getStorageUsage());
    const timer = setTimeout(() => setIsSaving(false), 300);
    return () => clearTimeout(timer);
  }, [portfolios, activeId]);

  // Listen for URL hash #share=...
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#share=')) {
        const encoded = window.location.hash.replace('#share=', '');
        const decoded = decodeSharePayload(encoded);
        if (decoded) {
          setSharedPortfolio(decoded);
          setScreen('shared-preview');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleUpdateActivePortfolio = useCallback(
    (updater: (prev: Portfolio) => Portfolio, recordHistory = true) => {
      setPortfolios((prevList) => {
        const current =
          prevList.find((p) => p.id === activeId) || prevList[0];
        if (!current) return prevList;
        if (recordHistory) {
          setHistoryPast((past) => [...past.slice(-24), structuredClone(current)]);
          setHistoryFuture([]);
        }
        const updated = {
          ...updater(structuredClone(current)),
          updatedAt: new Date().toISOString(),
        };
        return prevList.map((item) => (item.id === current.id ? updated : item));
      });
    },
    [activeId]
  );

  const handleUndo = useCallback(() => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast((past) => past.slice(0, -1));
    setHistoryFuture((future) => [structuredClone(activePortfolio), ...future.slice(0, 24)]);
    setPortfolios((prevList) =>
      prevList.map((p) => (p.id === activePortfolio.id ? previous : p))
    );
  }, [historyPast, activePortfolio]);

  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryFuture((future) => future.slice(1));
    setHistoryPast((past) => [...past.slice(-24), structuredClone(activePortfolio)]);
    setPortfolios((prevList) =>
      prevList.map((p) => (p.id === activePortfolio.id ? next : p))
    );
  }, [historyFuture, activePortfolio]);

  const handleOpenPortfolioInEditor = (id: string) => {
    setActiveId(id);
    setHistoryPast([]);
    setHistoryFuture([]);
    setScreen('editor');
  };

  const handleApplyExtractedResume = (extracted: any) => {
    handleUpdateActivePortfolio((prev) => {
      const next = structuredClone(prev);
      if (extracted.profile) {
        next.profile = {
          ...next.profile,
          name: extracted.profile.name || next.profile.name,
          headline: extracted.profile.headline || next.profile.headline,
          location: extracted.profile.location || next.profile.location,
          email: extracted.profile.email || next.profile.email,
          phone: extracted.profile.phone || next.profile.phone,
        };
      }
      if (extracted.about?.bio) {
        next.sections = next.sections.map((s) =>
          s.type === 'about'
            ? { ...s, data: { ...s.data, bio: extracted.about.bio } }
            : s
        );
      }
      if (Array.isArray(extracted.skills) && extracted.skills.length > 0) {
        const mappedSkills = extracted.skills.map((sk: any, i: number) => ({
          id: `sk-imp-${i}`,
          name: sk.name || 'Skill',
          category: sk.category || 'Extracted',
          level: Number(sk.level || 88),
        }));
        next.sections = next.sections.map((s) =>
          s.type === 'skills' ? { ...s, data: { ...s.data, items: mappedSkills } } : s
        );
      }
      if (Array.isArray(extracted.experience) && extracted.experience.length > 0) {
        const mappedExp = extracted.experience.map((ex: any, i: number) => ({
          id: `exp-imp-${i}`,
          role: ex.role || 'Role',
          company: ex.company || 'Company',
          startDate: ex.startDate || '2022',
          endDate: ex.endDate || 'Present',
          current: Boolean(ex.current),
          location: ex.location || '',
          bullets: Array.isArray(ex.bullets) ? ex.bullets : [],
        }));
        next.sections = next.sections.map((s) =>
          s.type === 'experience' ? { ...s, data: { ...s.data, items: mappedExp } } : s
        );
      }
      return next;
    });
  };

  if (screen === 'shared-preview' && sharedPortfolio) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Viewing Shared Portfolio: <strong>{sharedPortfolio.profile.name}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const cloned = structuredClone(sharedPortfolio);
                cloned.id = `folio-shared-${Date.now()}`;
                setPortfolios((prev) => [cloned, ...prev]);
                setActiveId(cloned.id);
                window.location.hash = '';
                setScreen('editor');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              Clone & Customize in FOLIO
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                setScreen('landing');
              }}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Exit Preview
            </button>
          </div>
        </div>
        <div className="flex-1">
          <PortfolioMasterRenderer portfolio={sharedPortfolio} isEditable={false} />
        </div>
      </div>
    );
  }

  return (
    <>
      {screen === 'landing' && (
        <LandingView
          lang={lang}
          onChangeLang={setLang}
          appTheme={appTheme}
          onToggleAppTheme={() =>
            setAppTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
          }
          onStartWizard={() => setScreen('wizard')}
          onOpenDashboard={() => setScreen('dashboard')}
          onQuickStartSample={(sample) => {
            const cloned = structuredClone(sample);
            cloned.id = `folio-demo-${Date.now()}`;
            setPortfolios((prev) => [cloned, ...prev]);
            handleOpenPortfolioInEditor(cloned.id);
          }}
          onTryTemplateWithSample={(templateId: TemplateId) => {
            const customized = applyTemplateToPortfolio(
              structuredClone(DEVELOPER_SAMPLE_PORTFOLIO),
              templateId,
              TEMPLATE_REGISTRY[templateId].defaultThemePatch
            );
            customized.id = `folio-tpl-${Date.now()}`;
            customized.name = `${TEMPLATE_REGISTRY[templateId].name} Portfolio`;
            setPortfolios((prev) => [customized, ...prev]);
            handleOpenPortfolioInEditor(customized.id);
          }}
        />
      )}

      {screen === 'wizard' && (
        <OnboardingWizard
          onCancel={() => setScreen('dashboard')}
          onComplete={(createdPortfolio) => {
            setPortfolios((prev) => [createdPortfolio, ...prev]);
            handleOpenPortfolioInEditor(createdPortfolio.id);
          }}
        />
      )}

      {screen === 'dashboard' && (
        <DashboardView
          portfolios={portfolios}
          lang={lang}
          storageUsage={storageUsage}
          onSelectPortfolio={handleOpenPortfolioInEditor}
          onCreateNewWizard={() => setScreen('wizard')}
          onDuplicatePortfolio={(id) => {
            const source = portfolios.find((p) => p.id === id);
            if (!source) return;
            const copy = structuredClone(source);
            copy.id = `folio-copy-${Date.now()}`;
            copy.name = `${source.name} (Copy)`;
            copy.updatedAt = new Date().toISOString();
            setPortfolios((prev) => [copy, ...prev]);
          }}
          onRenamePortfolio={(id, newName) => {
            setPortfolios((prev) =>
              prev.map((p) =>
                p.id === id ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
              )
            );
          }}
          onDeletePortfolio={(id) => {
            setPortfolios((prev) => {
              const filtered = prev.filter((p) => p.id !== id);
              return filtered.length > 0 ? filtered : [DEVELOPER_SAMPLE_PORTFOLIO];
            });
          }}
          onImportPortfolio={(imported) => {
            setPortfolios((prev) => [imported, ...prev]);
            handleOpenPortfolioInEditor(imported.id);
          }}
          onBackToLanding={() => setScreen('landing')}
        />
      )}

      {screen === 'editor' && (
        <EditorView
          portfolio={activePortfolio}
          lang={lang}
          storageUsage={storageUsage}
          canUndo={historyPast.length > 0}
          canRedo={historyFuture.length > 0}
          isSaving={isSaving}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onUpdatePortfolio={handleUpdateActivePortfolio}
          onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenResumeImport={() => setIsResumeImportOpen(true)}
          onOpenAiReview={() => setIsAiReviewOpen(true)}
          onBackToDashboard={() => setScreen('dashboard')}
        />
      )}

      {/* Global Editor Modals */}
      <TemplateGalleryModal
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        portfolio={activePortfolio}
        onApplyTemplate={(templateId, applyColors) => {
          handleUpdateActivePortfolio((prev) =>
            applyTemplateToPortfolio(
              prev,
              templateId,
              applyColors ? TEMPLATE_REGISTRY[templateId].defaultThemePatch : undefined
            )
          );
        }}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        portfolio={activePortfolio}
        onUpdateSettings={(patch) =>
          handleUpdateActivePortfolio((prev) => ({
            ...prev,
            settings: { ...prev.settings, ...patch },
          }))
        }
        onPublishStatusChange={(status) =>
          handleUpdateActivePortfolio((prev) => ({ ...prev, status }))
        }
      />

      <ResumeImportModal
        isOpen={isResumeImportOpen}
        onClose={() => setIsResumeImportOpen(false)}
        onApplyExtracted={handleApplyExtractedResume}
      />

      <PortfolioReviewModal
        isOpen={isAiReviewOpen}
        onClose={() => setIsAiReviewOpen(false)}
        portfolio={activePortfolio}
      />
    </>
  );
}
