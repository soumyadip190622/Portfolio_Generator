import React, { useState } from 'react';
import {
  Portfolio,
  TemplateId,
  UILanguage,
} from '../types/portfolio';
import { TRANSLATIONS } from '../i18n/translations';
import { TEMPLATE_REGISTRY, PortfolioMasterRenderer } from '../registries/templateRegistry';
import {
  DEVELOPER_SAMPLE_PORTFOLIO,
  DESIGNER_SAMPLE_PORTFOLIO,
  PHOTOGRAPHER_SAMPLE_PORTFOLIO,
} from '../data/samplePortfolios';
import { applyTemplateToPortfolio } from '../utils/portfolioLogic';
import {
  ArrowRight,
  Sparkles,
  LayoutTemplate,
  Wand2,
  Download,
  Sliders,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';

interface LandingViewProps {
  lang: UILanguage;
  onChangeLang: (lang: UILanguage) => void;
  appTheme: 'dark' | 'light';
  onToggleAppTheme: () => void;
  onStartWizard: () => void;
  onOpenDashboard: () => void;
  onQuickStartSample: (sample: Portfolio) => void;
  onTryTemplateWithSample: (templateId: TemplateId) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  lang,
  onChangeLang,
  appTheme,
  onToggleAppTheme,
  onStartWizard,
  onOpenDashboard,
  onQuickStartSample,
  onTryTemplateWithSample,
}) => {
  const t = TRANSLATIONS[lang];
  const [demoTemplateId, setDemoTemplateId] = useState<TemplateId>('minimal-clean');
  const [demoProfileType, setDemoProfileType] = useState<'dev' | 'design' | 'photo'>('dev');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const baseSample =
    demoProfileType === 'design'
      ? DESIGNER_SAMPLE_PORTFOLIO
      : demoProfileType === 'photo'
      ? PHOTOGRAPHER_SAMPLE_PORTFOLIO
      : DEVELOPER_SAMPLE_PORTFOLIO;

  const liveMockupPortfolio = applyTemplateToPortfolio(
    baseSample,
    demoTemplateId,
    TEMPLATE_REGISTRY[demoTemplateId].defaultThemePatch
  );

  const isLight = appTheme === 'light';

  const faqs = [
    {
      q: 'Does switching templates erase my personal data or custom sections?',
      a: 'Never. FOLIO decouples your content schema from visual rendering. All 16 section types are stored in a single structured JSON state, so you can switch across all 8 templates instantaneously with zero data loss.',
    },
    {
      q: 'How does the static website export work?',
      a: 'Clicking "Publish & Export" bundles a clean, self-contained static website (.ZIP or single HTML file) complete with semantic HTML5, responsive CSS, Open Graph tags, and Person JSON-LD structured data—ready to drop onto GitHub Pages, Netlify, or Vercel.',
    },
    {
      q: 'Do I need an account or cloud database to build my portfolio?',
      a: 'No. FOLIO works immediately in Guest Mode with real-time localStorage autosave, full undo/redo history, version snapshots, and JSON backup/restore.',
    },
    {
      q: 'What does the Gemini AI assistant help with?',
      a: 'Gemini AI can draft your professional biography from a few keywords, elevate project descriptions, suggest role-specific skills, import and structure a raw text resume, and run a 100-point portfolio audit across Content, Design, and SEO.',
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#070A12] text-slate-100'
      }`}
    >
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header
        className={`flex items-center justify-between gap-8 px-6 py-4 border-b sticky top-0 z-40 backdrop-blur-md ${
          isLight
            ? 'bg-white/90 border-slate-200'
            : 'bg-[#070A12]/90 border-slate-800/80'
        }`}
      >
        {/* Zone 1: Single text element Brand wordmark */}
        <a
          href="#top"
          style={{ fontFamily: 'Outfit, sans-serif' }}
          className="text-xl font-bold tracking-tight whitespace-nowrap shrink-0"
        >
          FOLIO
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium opacity-85">
          <a href="#features" className="hover:underline whitespace-nowrap shrink-0">
            {t.navFeatures}
          </a>
          <a href="#workflow" className="hover:underline whitespace-nowrap shrink-0">
            {t.navHowItWorks}
          </a>
          <a href="#templates" className="hover:underline whitespace-nowrap shrink-0">
            {t.navTemplates}
          </a>
          <button
            type="button"
            onClick={onOpenDashboard}
            className="hover:underline whitespace-nowrap shrink-0"
          >
            {t.navDashboard}
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartWizard}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {t.ctaCreate}
          </button>
        </div>
      </header>

      {/* Workspace Utility Strip below fold / top of hero */}
      <div className="max-w-7xl mx-auto px-6 pt-5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="text-slate-400 font-medium">{t.heroKicker}</div>
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 text-slate-200">
            {(['en', 'bn', 'hi'] as UILanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChangeLang(code)}
                style={{
                  fontFamily:
                    code === 'bn'
                      ? "'Noto Sans Bengali', sans-serif"
                      : code === 'hi'
                      ? "'Noto Sans Devanagari', sans-serif"
                      : undefined,
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  lang === code ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {code === 'en' ? 'EN · English' : code === 'bn' ? 'BN · বাংলা' : 'HI · हिन्दी'}
              </button>
            ))}
          </div>

          {/* Dark / Light UI Toggle */}
          <button
            type="button"
            onClick={onToggleAppTheme}
            aria-label="Toggle Builder Color Mode"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-700 text-xs whitespace-nowrap shrink-0"
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{isLight ? 'Dark UI' : 'Light UI'}</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION: 2-Column Split + Full-Width Proof Row Below */}
      <section id="top" className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <h1
              style={{ fontFamily: 'Outfit, sans-serif', textWrap: 'balance' } as React.CSSProperties}
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08]"
            >
              {t.heroTitle}
            </h1>

            <p className="text-base leading-relaxed opacity-80">{t.heroSubtitle}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartWizard}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-transform active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>{t.ctaCreate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onQuickStartSample(DEVELOPER_SAMPLE_PORTFOLIO)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
                  isLight
                    ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-900'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{t.ctaQuickDemo}</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs opacity-75">
              <span>Instant demo profiles:</span>
              <button
                type="button"
                onClick={() => onQuickStartSample(DEVELOPER_SAMPLE_PORTFOLIO)}
                className="underline hover:text-blue-400"
              >
                Developer
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onQuickStartSample(DESIGNER_SAMPLE_PORTFOLIO)}
                className="underline hover:text-blue-400"
              >
                Product Designer
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onQuickStartSample(PHOTOGRAPHER_SAMPLE_PORTFOLIO)}
                className="underline hover:text-blue-400"
              >
                Photographer
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Live-Demo Mockup of a Portfolio Being Built */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden flex-1 flex flex-col">
              {/* Interactive Demo Switcher Bar */}
              <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950">
                <div className="flex items-center gap-1.5">
                  {(['dev', 'design', 'photo'] as const).map((profKey) => (
                    <button
                      key={profKey}
                      type="button"
                      onClick={() => setDemoProfileType(profKey)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        demoProfileType === profKey
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      {profKey === 'dev'
                        ? 'Developer Data'
                        : profKey === 'design'
                        ? 'Designer Data'
                        : 'Photographer Data'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  {(
                    [
                      'minimal-clean',
                      'developer-terminal',
                      'bento-grid',
                      'designer-showcase',
                    ] as TemplateId[]
                  ).map((tplId) => (
                    <button
                      key={tplId}
                      type="button"
                      onClick={() => setDemoTemplateId(tplId)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        demoTemplateId === tplId
                          ? 'bg-slate-800 text-blue-400 border border-blue-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {TEMPLATE_REGISTRY[tplId].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Rendered Portfolio Viewport */}
              <div className="h-[390px] overflow-y-auto bg-slate-950 relative">
                <div
                  style={{
                    width: '142.8%',
                    transform: 'scale(0.7)',
                    transformOrigin: 'top left',
                  }}
                >
                  <PortfolioMasterRenderer portfolio={liveMockupPortfolio} isEditable={false} />
                </div>
              </div>

              <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Live interactive preview — switch personas or templates above</span>
                <button
                  type="button"
                  onClick={() => onQuickStartSample(liveMockupPortfolio)}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Open this exact configuration in Editor →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Quantitative Proof Strip Below Hero Split */}
        <div
          className={`mt-12 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6 ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-blue-500">
              8 Templates
            </div>
            <div className="text-xs opacity-75 mt-1">
              Distinct architectural layouts, zero data loss on switch
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-blue-500">
              16 Modules
            </div>
            <div className="text-xs opacity-75 mt-1">
              Projects, experience, skills, lightbox gallery, blog & CV
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-blue-500">
              26 Fonts
            </div>
            <div className="text-xs opacity-75 mt-1">
              Curated Google Fonts pairings & WCAG 2.1 contrast checker
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-blue-500">
              100% Static
            </div>
            <div className="text-xs opacity-75 mt-1">
              Export standalone ZIP, single HTML, PDF resume, or JSON
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS IN 3 STEPS */}
      <section
        id="workflow"
        className={`py-16 border-t ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-950/60'}`}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2
              style={{ fontFamily: 'Outfit, sans-serif' }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              From raw notes to a published domain in three steps
            </h2>
            <p className="text-sm opacity-75">
              Designed like a modern creative studio—structured forms on the left, real-time responsive canvas on the right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="text-xs font-mono text-blue-400 font-semibold">01. Add Your Data</div>
              <h3 className="text-lg font-bold">Enter content or import your resume</h3>
              <p className="text-xs leading-relaxed opacity-80">
                Fill out guided forms for Projects, Experience, Skills, and Gallery—or paste your CV and let Gemini AI extract structured sections automatically.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="text-xs font-mono text-blue-400 font-semibold">02. Customise Visually</div>
              <h3 className="text-lg font-bold">Switch templates, palettes & typography</h3>
              <p className="text-xs leading-relaxed opacity-80">
                Test 8 distinct templates, 12 color palettes with live WCAG contrast verification, 26 Google Fonts, and drag-and-drop section ordering.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="text-xs font-mono text-blue-400 font-semibold">03. Publish Anywhere</div>
              <h3 className="text-lg font-bold">Export static ZIP, HTML, PDF or Share Link</h3>
              <p className="text-xs leading-relaxed opacity-80">
                Download a ready-to-host static website ZIP for Netlify, GitHub Pages, or Vercel, print an executive PDF resume, or share a compressed preview URL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <div className="max-w-2xl space-y-2">
          <h2
            style={{ fontFamily: 'Outfit, sans-serif' }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Engineered for complete creative control
          </h2>
          <p className="text-sm opacity-75">
            Every tool you need to craft, audit, and maintain your personal site across your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2.5">
            <LayoutTemplate className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Non-Destructive Templates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Swap between Minimal Clean, Developer Terminal, Bento Grid, Designer Showcase, Photographer Lightbox, and One-Page Resume anytime.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2.5">
            <Wand2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Gemini AI Writing & Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate bios, rewrite project impact bullets, extract resume text, and get a 5-point portfolio review across Content, Design, and SEO.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2.5">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Live Contrast & Typography</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in WCAG 2.1 AA/AAA luminance contrast checker with 1-click auto-fix, plus 26 Google Fonts and scoped custom CSS.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2.5">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Zero-Lock-In Static Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export a multi-file static website ZIP, a single portable HTML file, a print-ready PDF CV, or a lossless JSON backup.
            </p>
          </div>
        </div>
      </section>

      {/* 8 TEMPLATES SHOWCASE */}
      <section
        id="templates"
        className={`py-16 border-t ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-950/60'}`}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2
                style={{ fontFamily: 'Outfit, sans-serif' }}
                className="text-2xl sm:text-3xl font-bold tracking-tight"
              >
                8 Visually Distinct Portfolio Templates
              </h2>
              <p className="text-sm opacity-75">
                Click any template below to launch the editor pre-configured with that layout.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartWizard}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Launch Custom Onboarding Wizard →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.values(TEMPLATE_REGISTRY).map((tpl) => {
              const previewPort = applyTemplateToPortfolio(
                DEVELOPER_SAMPLE_PORTFOLIO,
                tpl.id,
                tpl.defaultThemePatch
              );
              return (
                <div
                  key={tpl.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col justify-between hover:border-blue-500/60 transition-all"
                >
                  <div>
                    <div
                      onClick={() => onTryTemplateWithSample(tpl.id)}
                      className="h-40 w-full overflow-hidden bg-slate-950 border-b border-slate-800 cursor-pointer relative group"
                    >
                      <div
                        style={{
                          width: '260%',
                          height: '260%',
                          transform: 'scale(0.38)',
                          transformOrigin: 'top left',
                        }}
                        className="pointer-events-none select-none"
                      >
                        <PortfolioMasterRenderer portfolio={previewPort} isEditable={false} />
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="text-[11px] font-mono text-blue-400">{tpl.category}</div>
                      <h3 className="text-sm font-bold text-white">{tpl.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{tpl.tagline}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => onTryTemplateWithSample(tpl.id)}
                      className="w-full py-2 text-xs font-semibold bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Try {tpl.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <h2
          style={{ fontFamily: 'Outfit, sans-serif' }}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-center"
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA & FOOTER */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-lg font-bold tracking-tight">FOLIO</div>
            <p className="text-xs text-slate-400">
              Visual Portfolio Website Builder · Export Static HTML, ZIP, PDF & JSON
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenDashboard}
              className="px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg"
            >
              {t.navDashboard}
            </button>
            <button
              type="button"
              onClick={onStartWizard}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              {t.ctaCreate}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
