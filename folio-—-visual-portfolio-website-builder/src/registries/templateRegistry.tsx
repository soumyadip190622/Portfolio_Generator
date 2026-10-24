import React from 'react';
import {
  Portfolio,
  PortfolioSection,
  PortfolioTheme,
  TemplateId,
} from '../types/portfolio';
import { SECTION_REGISTRY, ResilientImage } from './sectionRegistry';
import { sanitizeCustomCss } from '../utils/portfolioLogic';

export interface TemplateRendererProps {
  portfolio: Portfolio;
  isEditable?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onInlineUpdateSection?: (sectionId: string, patch: Partial<PortfolioSection>) => void;
  onInlineUpdateProfile?: (patch: Partial<Portfolio['profile']>) => void;
}

export interface TemplateRegistryEntry {
  id: TemplateId;
  name: string;
  tagline: string;
  category: string;
  recommendedFor: string[];
  defaultThemePatch: Partial<PortfolioTheme>;
  Renderer: React.FC<TemplateRendererProps>;
}

function getVisibleSortedSections(portfolio: Portfolio): PortfolioSection[] {
  return [...(portfolio.sections || [])]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
}

const PortfolioNavHeader: React.FC<{
  portfolio: Portfolio;
  sections: PortfolioSection[];
}> = ({ portfolio, sections }) => {
  const { profile, theme, layout } = portfolio;
  const navSections = sections.filter((s) => s.type !== 'hero').slice(0, 5);

  if (layout.navbarStyle === 'floating-pill') {
    return (
      <div className="sticky top-4 z-30 px-4 flex justify-center pointer-events-none">
        <header
          style={{
            backgroundColor: `${theme.surface}E6`,
            borderColor: `${theme.mutedText}30`,
          }}
          className="pointer-events-auto backdrop-blur-md border rounded-full px-5 py-2.5 flex items-center gap-6 shadow-lg"
        >
          <a
            href="#hero"
            style={{ color: theme.text, fontFamily: theme.headingFont }}
            className="text-sm font-bold tracking-tight whitespace-nowrap shrink-0"
          >
            {profile.name}
          </a>
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium" style={{ color: theme.mutedText }}>
            {navSections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.type}`}
                className="hover:opacity-100 opacity-80 transition-opacity whitespace-nowrap shrink-0"
              >
                {sec.title}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
            className="px-3.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap shrink-0"
          >
            Contact
          </a>
        </header>
      </div>
    );
  }

  return (
    <header
      style={{
        backgroundColor: `${theme.background}E6`,
        borderColor: `${theme.mutedText}20`,
      }}
      className={`${
        layout.navbarStyle === 'sticky' ? 'sticky top-0 z-30 backdrop-blur-md' : ''
      } border-b px-6 py-4 flex items-center justify-between gap-8`}
    >
      <a
        href="#hero"
        style={{ color: theme.text, fontFamily: theme.headingFont }}
        className="text-base font-bold tracking-tight whitespace-nowrap shrink-0"
      >
        {profile.name}
      </a>
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium" style={{ color: theme.mutedText }}>
        {navSections.map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.type}`}
            className="hover:underline whitespace-nowrap shrink-0"
          >
            {sec.title}
          </a>
        ))}
      </nav>
      <a
        href="#contact"
        style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
        className="px-4 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0"
      >
        Contact
      </a>
    </header>
  );
};

const PortfolioFooter: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  const { profile, theme, settings } = portfolio;
  return (
    <footer
      style={{ borderColor: `${theme.mutedText}20`, color: theme.mutedText }}
      className="border-t px-6 py-8 text-xs"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>
        {settings.showMadeWithFolio && (
          <div className="font-mono text-[11px] opacity-75">
            Built with FOLIO Visual Architecture
          </div>
        )}
      </div>
    </footer>
  );
};

// 1. MINIMAL CLEAN TEMPLATE
const MinimalCleanTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const sections = getVisibleSortedSections(portfolio);

  return (
    <div
      style={{
        backgroundColor: portfolio.theme.background,
        color: portfolio.theme.text,
        fontFamily: portfolio.theme.bodyFont,
      }}
      className="min-h-full flex flex-col justify-between"
    >
      <div>
        <PortfolioNavHeader portfolio={portfolio} sections={sections} />
        <div className="divide-y" style={{ borderColor: `${portfolio.theme.mutedText}15` }}>
          {sections.map((sec) => {
            const entry = SECTION_REGISTRY[sec.type];
            if (!entry) return null;
            const Comp = entry.Renderer;
            return (
              <Comp
                key={sec.id}
                section={sec}
                portfolio={portfolio}
                isEditable={props.isEditable}
                isSelected={props.selectedSectionId === sec.id}
                onSelectSection={props.onSelectSection}
                onInlineUpdateSection={props.onInlineUpdateSection}
                onInlineUpdateProfile={props.onInlineUpdateProfile}
              />
            );
          })}
        </div>
      </div>
      <PortfolioFooter portfolio={portfolio} />
    </div>
  );
};

// 2. DARK FUTURISTIC TEMPLATE
const DarkFuturisticTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const sections = getVisibleSortedSections(portfolio);

  return (
    <div
      style={{
        backgroundColor: portfolio.theme.background,
        color: portfolio.theme.text,
        fontFamily: portfolio.theme.bodyFont,
        backgroundImage: `radial-gradient(${portfolio.theme.primary}22 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
      className="min-h-full relative"
    >
      <div
        style={{
          background: `radial-gradient(circle at 50% 0%, ${portfolio.theme.primary}28, transparent 60%)`,
        }}
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
      />
      <div className="relative z-10">
        <PortfolioNavHeader portfolio={portfolio} sections={sections} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {sections.map((sec, idx) => {
            const entry = SECTION_REGISTRY[sec.type];
            if (!entry) return null;
            const Comp = entry.Renderer;
            return (
              <div
                key={sec.id}
                style={{
                  backgroundColor: `${portfolio.theme.surface}D9`,
                  borderColor: `${portfolio.theme.primary}35`,
                }}
                className="rounded-2xl border backdrop-blur-md overflow-hidden shadow-xl"
              >
                <div
                  style={{
                    borderColor: `${portfolio.theme.primary}25`,
                    color: portfolio.theme.primary,
                    fontFamily: portfolio.theme.monoFont,
                  }}
                  className="px-6 py-2 border-b text-[11px] flex items-center justify-between"
                >
                  <span>0{idx + 1}. {sec.title.toUpperCase()}</span>
                  <span style={{ color: portfolio.theme.mutedText }}>{sec.type}</span>
                </div>
                <Comp
                  section={sec}
                  portfolio={portfolio}
                  isEditable={props.isEditable}
                  isSelected={props.selectedSectionId === sec.id}
                  onSelectSection={props.onSelectSection}
                  onInlineUpdateSection={props.onInlineUpdateSection}
                  onInlineUpdateProfile={props.onInlineUpdateProfile}
                />
              </div>
            );
          })}
        </div>
        <PortfolioFooter portfolio={portfolio} />
      </div>
    </div>
  );
};

// 3. BENTO GRID TEMPLATE
const BentoGridTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const sections = getVisibleSortedSections(portfolio);
  const heroSec = sections.find((s) => s.type === 'hero');
  const otherSections = sections.filter((s) => s.type !== 'hero');

  return (
    <div
      style={{
        backgroundColor: portfolio.theme.background,
        color: portfolio.theme.text,
        fontFamily: portfolio.theme.bodyFont,
      }}
      className="min-h-full"
    >
      <PortfolioNavHeader portfolio={portfolio} sections={sections} />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {heroSec && (
          <div
            style={{
              backgroundColor: portfolio.theme.surface,
              borderColor: `${portfolio.theme.mutedText}25`,
            }}
            className="rounded-3xl border overflow-hidden shadow-sm"
          >
            {React.createElement(SECTION_REGISTRY.hero.Renderer, {
              section: heroSec,
              portfolio,
              isEditable: props.isEditable,
              isSelected: props.selectedSectionId === heroSec.id,
              onSelectSection: props.onSelectSection,
              onInlineUpdateSection: props.onInlineUpdateSection,
              onInlineUpdateProfile: props.onInlineUpdateProfile,
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {otherSections.map((sec) => {
            const entry = SECTION_REGISTRY[sec.type];
            if (!entry) return null;
            const Comp = entry.Renderer;
            const isWide =
              sec.type === 'projects' ||
              sec.type === 'gallery' ||
              sec.type === 'experience' ||
              sec.type === 'contact';
            return (
              <div
                key={sec.id}
                style={{
                  backgroundColor: portfolio.theme.surface,
                  borderColor: `${portfolio.theme.mutedText}22`,
                }}
                className={`${
                  isWide ? 'lg:col-span-8' : 'lg:col-span-4'
                } rounded-3xl border overflow-hidden flex flex-col justify-between`}
              >
                <Comp
                  section={{
                    ...sec,
                    style: { ...sec.style, spacing: 'compact', width: 'full' },
                  }}
                  portfolio={portfolio}
                  isEditable={props.isEditable}
                  isSelected={props.selectedSectionId === sec.id}
                  onSelectSection={props.onSelectSection}
                  onInlineUpdateSection={props.onInlineUpdateSection}
                  onInlineUpdateProfile={props.onInlineUpdateProfile}
                />
              </div>
            );
          })}
        </div>
      </div>
      <PortfolioFooter portfolio={portfolio} />
    </div>
  );
};

// 4. DEVELOPER TERMINAL TEMPLATE
const DeveloperTerminalTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const sections = getVisibleSortedSections(portfolio);

  return (
    <div
      style={{
        backgroundColor: portfolio.theme.background,
        color: portfolio.theme.text,
        fontFamily: portfolio.theme.monoFont || 'JetBrains Mono',
      }}
      className="min-h-full p-3 sm:p-6"
    >
      <div
        style={{
          backgroundColor: portfolio.theme.surface,
          borderColor: `${portfolio.theme.primary}45`,
        }}
        className="max-w-5xl mx-auto rounded-xl border shadow-2xl overflow-hidden"
      >
        {/* Terminal Title Bar */}
        <div
          style={{
            backgroundColor: portfolio.theme.background,
            borderColor: `${portfolio.theme.mutedText}25`,
          }}
          className="px-4 py-3 border-b flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 font-mono opacity-80">
              {portfolio.settings.customSlug || 'developer'}@folio-workstation: ~
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]" style={{ color: portfolio.theme.mutedText }}>
            {sections.slice(0, 5).map((s) => (
              <a key={s.id} href={`#${s.type}`} className="hover:underline">
                ./{s.type}.sh
              </a>
            ))}
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: `${portfolio.theme.mutedText}20` }}>
          {sections.map((sec) => {
            const entry = SECTION_REGISTRY[sec.type];
            if (!entry) return null;
            const Comp = entry.Renderer;
            return (
              <div key={sec.id} className="p-2">
                <div className="px-6 pt-4 text-xs font-mono flex items-center gap-2" style={{ color: portfolio.theme.primary }}>
                  <span>$</span>
                  <span>cat ./sections/{sec.type}.md</span>
                </div>
                <Comp
                  section={{ ...sec, style: { ...sec.style, spacing: 'compact' } }}
                  portfolio={portfolio}
                  isEditable={props.isEditable}
                  isSelected={props.selectedSectionId === sec.id}
                  onSelectSection={props.onSelectSection}
                  onInlineUpdateSection={props.onInlineUpdateSection}
                  onInlineUpdateProfile={props.onInlineUpdateProfile}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            backgroundColor: portfolio.theme.background,
            borderColor: `${portfolio.theme.mutedText}25`,
            color: portfolio.theme.mutedText,
          }}
          className="px-6 py-3 border-t text-[11px] flex items-center justify-between"
        >
          <span>NORMAL MODE · UTF-8 · {sections.length} ACTIVE MODULES</span>
          <span>{portfolio.profile.name}</span>
        </div>
      </div>
    </div>
  );
};

// 5. DESIGNER SHOWCASE TEMPLATE
const DesignerShowcaseTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const sections = getVisibleSortedSections(portfolio);

  return (
    <div
      style={{
        backgroundColor: portfolio.theme.background,
        color: portfolio.theme.text,
        fontFamily: portfolio.theme.bodyFont,
      }}
      className="min-h-full"
    >
      <PortfolioNavHeader portfolio={portfolio} sections={sections} />

      {/* Editorial Marquee Ribbon */}
      <div
        style={{
          borderColor: `${portfolio.theme.mutedText}25`,
          color: portfolio.theme.mutedText,
        }}
        className="border-b py-2.5 px-6 text-xs tracking-widest uppercase overflow-hidden whitespace-nowrap"
      >
        <span>
          Selected Works & Monograph · {portfolio.profile.name} · {portfolio.profile.location} · Creative Direction & Systems
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: `${portfolio.theme.mutedText}22` }}>
        {sections.map((sec, idx) => {
          const entry = SECTION_REGISTRY[sec.type];
          if (!entry) return null;
          const Comp = entry.Renderer;
          return (
            <div key={sec.id} className="relative">
              {sec.type !== 'hero' && (
                <div className="max-w-6xl mx-auto px-6 pt-8 text-xs font-mono" style={{ color: portfolio.theme.primary }}>
                  Chapter 0{idx} — {sec.title}
                </div>
              )}
              <Comp
                section={sec}
                portfolio={portfolio}
                isEditable={props.isEditable}
                isSelected={props.selectedSectionId === sec.id}
                onSelectSection={props.onSelectSection}
                onInlineUpdateSection={props.onInlineUpdateSection}
                onInlineUpdateProfile={props.onInlineUpdateProfile}
              />
            </div>
          );
        })}
      </div>

      <PortfolioFooter portfolio={portfolio} />
    </div>
  );
};

// 6. PHOTOGRAPHER GALLERY TEMPLATE
const PhotographerGalleryTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const sections = getVisibleSortedSections(portfolio);

  return (
    <div
      style={{
        backgroundColor: portfolio.theme.background,
        color: portfolio.theme.text,
        fontFamily: portfolio.theme.bodyFont,
      }}
      className="min-h-full"
    >
      <header
        style={{ borderColor: `${portfolio.theme.mutedText}20` }}
        className="px-8 py-6 border-b flex items-center justify-between"
      >
        <div
          style={{ fontFamily: portfolio.theme.headingFont }}
          className="text-xl font-bold tracking-tight"
        >
          {portfolio.profile.name}
        </div>
        <div className="text-xs font-mono" style={{ color: portfolio.theme.mutedText }}>
          {portfolio.profile.location}
        </div>
      </header>

      <div>
        {sections.map((sec) => {
          const entry = SECTION_REGISTRY[sec.type];
          if (!entry) return null;
          const Comp = entry.Renderer;
          return (
            <Comp
              key={sec.id}
              section={sec}
              portfolio={portfolio}
              isEditable={props.isEditable}
              isSelected={props.selectedSectionId === sec.id}
              onSelectSection={props.onSelectSection}
              onInlineUpdateSection={props.onInlineUpdateSection}
              onInlineUpdateProfile={props.onInlineUpdateProfile}
            />
          );
        })}
      </div>
      <PortfolioFooter portfolio={portfolio} />
    </div>
  );
};

// 7. ONE-PAGE RESUME (Print Friendly Executive Two-Column CV)
const OnePageResumeTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const { profile, theme } = portfolio;
  const sections = getVisibleSortedSections(portfolio);

  const sidebarTypes = new Set(['skills', 'education', 'certificates', 'contact', 'socialLinks']);
  const sidebarSections = sections.filter((s) => sidebarTypes.has(s.type));
  const mainSections = sections.filter((s) => !sidebarTypes.has(s.type) && s.type !== 'hero');

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.bodyFont,
      }}
      className="min-h-full py-6 sm:py-10 px-4 sm:px-8"
    >
      <div
        style={{
          backgroundColor: theme.surface,
          borderColor: `${theme.mutedText}30`,
        }}
        className="max-w-5xl mx-auto rounded-xl border shadow-xl overflow-hidden"
      >
        {/* Executive CV Header */}
        <div
          style={{ borderColor: `${theme.mutedText}25` }}
          className="p-6 sm:p-8 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-1.5">
            <h1
              style={{ fontFamily: theme.headingFont, color: theme.text }}
              className="text-3xl font-bold tracking-tight"
            >
              {profile.name}
            </h1>
            <p style={{ color: theme.primary }} className="text-sm font-medium">
              {profile.headline}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1" style={{ color: theme.mutedText }}>
              {profile.location && <span>{profile.location}</span>}
              {profile.email && (
                <>
                  <span>·</span>
                  <span>{profile.email}</span>
                </>
              )}
              {profile.phone && (
                <>
                  <span>·</span>
                  <span>{profile.phone}</span>
                </>
              )}
            </div>
          </div>
          {profile.avatarUrl && (
            <ResilientImage
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-xl object-cover border shrink-0"
            />
          )}
        </div>

        {/* Two-column CV body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: `${theme.mutedText}20` }}>
          <div className="lg:col-span-8 divide-y" style={{ borderColor: `${theme.mutedText}15` }}>
            {mainSections.map((sec) => {
              const entry = SECTION_REGISTRY[sec.type];
              if (!entry) return null;
              const Comp = entry.Renderer;
              return (
                <Comp
                  key={sec.id}
                  section={{ ...sec, style: { ...sec.style, spacing: 'compact', width: 'full' } }}
                  portfolio={portfolio}
                  isEditable={props.isEditable}
                  isSelected={props.selectedSectionId === sec.id}
                  onSelectSection={props.onSelectSection}
                  onInlineUpdateSection={props.onInlineUpdateSection}
                  onInlineUpdateProfile={props.onInlineUpdateProfile}
                />
              );
            })}
          </div>
          <div className="lg:col-span-4 divide-y" style={{ borderColor: `${theme.mutedText}15` }}>
            {sidebarSections.map((sec) => {
              const entry = SECTION_REGISTRY[sec.type];
              if (!entry) return null;
              const Comp = entry.Renderer;
              return (
                <Comp
                  key={sec.id}
                  section={{ ...sec, style: { ...sec.style, spacing: 'compact', width: 'full' } }}
                  portfolio={portfolio}
                  isEditable={props.isEditable}
                  isSelected={props.selectedSectionId === sec.id}
                  onSelectSection={props.onSelectSection}
                  onInlineUpdateSection={props.onInlineUpdateSection}
                  onInlineUpdateProfile={props.onInlineUpdateProfile}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. GLASSMORPHISM TEMPLATE
const GlassmorphismTemplate: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const sections = getVisibleSortedSections(portfolio);

  return (
    <div
      style={{
        backgroundColor: portfolio.theme.background,
        color: portfolio.theme.text,
        fontFamily: portfolio.theme.bodyFont,
      }}
      className="min-h-full relative overflow-hidden"
    >
      {/* Ambient Background Gradient Blobs */}
      <div
        style={{ background: portfolio.theme.gradient }}
        className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 rounded-full opacity-25 blur-3xl"
      />
      <div
        style={{ backgroundColor: portfolio.theme.secondary }}
        className="pointer-events-none absolute top-1/3 -right-28 w-96 h-96 rounded-full opacity-20 blur-3xl"
      />

      <div className="relative z-10">
        <PortfolioNavHeader portfolio={portfolio} sections={sections} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {sections.map((sec) => {
            const entry = SECTION_REGISTRY[sec.type];
            if (!entry) return null;
            const Comp = entry.Renderer;
            return (
              <div
                key={sec.id}
                style={{
                  backgroundColor: `${portfolio.theme.surface}B3`,
                  borderColor: `${portfolio.theme.text}18`,
                }}
                className="rounded-3xl border backdrop-blur-xl shadow-2xl overflow-hidden"
              >
                <Comp
                  section={sec}
                  portfolio={portfolio}
                  isEditable={props.isEditable}
                  isSelected={props.selectedSectionId === sec.id}
                  onSelectSection={props.onSelectSection}
                  onInlineUpdateSection={props.onInlineUpdateSection}
                  onInlineUpdateProfile={props.onInlineUpdateProfile}
                />
              </div>
            );
          })}
        </div>
        <PortfolioFooter portfolio={portfolio} />
      </div>
    </div>
  );
};

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateRegistryEntry> = {
  'minimal-clean': {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    tagline: 'Swiss editorial clarity with generous whitespace and hairline dividers.',
    category: 'Editorial',
    recommendedFor: ['Developer', 'Writer', 'Designer', 'Other'],
    defaultThemePatch: {
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
    },
    Renderer: MinimalCleanTemplate,
  },
  'dark-futuristic': {
    id: 'dark-futuristic',
    name: 'Dark Futuristic',
    tagline: 'Precision coordinate grid backdrop with glowing technical framing.',
    category: 'Technical',
    recommendedFor: ['Developer', 'Student'],
    defaultThemePatch: {
      mode: 'dark',
      primary: '#38BDF8',
      secondary: '#6366F1',
      background: '#060913',
      surface: '#0F172A',
      text: '#F8FAFC',
      mutedText: '#94A3B8',
      headingFont: 'Space Mono',
      bodyFont: 'Plus Jakarta Sans',
    },
    Renderer: DarkFuturisticTemplate,
  },
  'bento-grid': {
    id: 'bento-grid',
    name: 'Bento Grid',
    tagline: 'Modular multi-column Bento cell architecture for scannable proof.',
    category: 'Modern SaaS',
    recommendedFor: ['Student', 'Developer', 'Designer', 'Freelancer'],
    defaultThemePatch: {
      headingFont: 'Bricolage Grotesque',
      bodyFont: 'Plus Jakarta Sans',
      borderRadius: 'xl',
    },
    Renderer: BentoGridTemplate,
  },
  'developer-terminal': {
    id: 'developer-terminal',
    name: 'Developer Terminal',
    tagline: 'UNIX command-line workstation shell with syntax-styled modules.',
    category: 'Engineering',
    recommendedFor: ['Developer', 'Student'],
    defaultThemePatch: {
      mode: 'dark',
      primary: '#10B981',
      secondary: '#34D399',
      background: '#050B09',
      surface: '#0C1713',
      text: '#ECFDF5',
      mutedText: '#6EE7B7',
      headingFont: 'JetBrains Mono',
      bodyFont: 'IBM Plex Mono',
      monoFont: 'JetBrains Mono',
    },
    Renderer: DeveloperTerminalTemplate,
  },
  'designer-showcase': {
    id: 'designer-showcase',
    name: 'Designer Showcase',
    tagline: 'Oversized monograph typography, chapter numbering, and case-study splits.',
    category: 'Creative',
    recommendedFor: ['Designer', 'Writer'],
    defaultThemePatch: {
      headingFont: 'Playfair Display',
      bodyFont: 'Plus Jakarta Sans',
      headingScale: 'xl',
    },
    Renderer: DesignerShowcaseTemplate,
  },
  'photographer-gallery': {
    id: 'photographer-gallery',
    name: 'Photographer Gallery',
    tagline: 'Exhibition darkroom aesthetic with interactive fullscreen lightbox plates.',
    category: 'Visual Arts',
    recommendedFor: ['Photographer', 'Designer'],
    defaultThemePatch: {
      mode: 'dark',
      primary: '#F59E0B',
      secondary: '#FBBF24',
      background: '#0C0A09',
      surface: '#1C1917',
      text: '#FAFAF9',
      mutedText: '#A8A29E',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'DM Sans',
    },
    Renderer: PhotographerGalleryTemplate,
  },
  'one-page-resume': {
    id: 'one-page-resume',
    name: 'One-Page Resume',
    tagline: 'Executive two-column CV sheet engineered for instant PDF printing.',
    category: 'Executive CV',
    recommendedFor: ['Student', 'Developer', 'Other'],
    defaultThemePatch: {
      headingFont: 'Public Sans',
      bodyFont: 'Public Sans',
    },
    Renderer: OnePageResumeTemplate,
  },
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    tagline: 'Frosted acrylic cards floating over ambient mesh gradient light fields.',
    category: 'Futuristic',
    recommendedFor: ['Freelancer', 'Designer', 'Developer'],
    defaultThemePatch: {
      mode: 'dark',
      primary: '#2DD4BF',
      secondary: '#38BDF8',
      background: '#060D1A',
      surface: '#0F1B2D',
      text: '#F0FDFA',
      mutedText: '#94A3B8',
      headingFont: 'Urbanist',
      bodyFont: 'Plus Jakarta Sans',
    },
    Renderer: GlassmorphismTemplate,
  },
};

export const PortfolioMasterRenderer: React.FC<TemplateRendererProps> = (props) => {
  const { portfolio } = props;
  const templateId = portfolio.layout?.templateId || 'minimal-clean';
  const entry = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['minimal-clean'];
  const TemplateComponent = entry.Renderer;
  const safeCss = sanitizeCustomCss(portfolio.theme?.customCss || '');

  return (
    <div id="folio-preview-root" className="w-full min-h-full relative">
      {safeCss && <style dangerouslySetInnerHTML={{ __html: `#folio-preview-root { ${safeCss} }` }} />}
      <TemplateComponent {...props} />
    </div>
  );
};
