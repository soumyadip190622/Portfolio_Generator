import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePortfolio,
  sanitizeCustomCss,
  getContrastRatio,
  getContrastRating,
  applyTemplateToPortfolio,
  reorderSections,
  encodeSharePayload,
  decodeSharePayload,
} from './portfolioLogic';
import { Portfolio } from '../types/portfolio';

const mockPortfolio: Portfolio = {
  id: 'test-portfolio-1',
  name: 'Alex Portfolio',
  profession: 'Developer',
  status: 'draft',
  updatedAt: '2026-10-24T00:00:00.000Z',
  profile: {
    name: 'Alex Rivera',
    headline: 'Staff Systems Engineer',
    typingRoles: ['Systems Engineer', 'AI Architect'],
    location: 'San Francisco, CA',
    email: 'alex@example.com',
    phone: '+1 555-0192',
    avatarUrl: '',
    avatarAlt: 'Alex Rivera portrait',
    resumeUrl: 'https://example.com/resume.pdf',
    availableForWork: true,
    availabilityText: 'Available for select advisory roles',
  },
  theme: {
    mode: 'dark',
    paletteId: 'obsidian-cobalt',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    background: '#090D16',
    surface: '#111827',
    text: '#F8FAFC',
    mutedText: '#94A3B8',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    headingScale: 'lg',
    bodyScale: 'md',
    letterSpacing: 'tight',
    fontWeight: 'bold',
    borderRadius: 'lg',
    shadowIntensity: 'medium',
    buttonStyle: 'solid',
    animationsEnabled: true,
    animationIntensity: 'medium',
    customCss: '',
  },
  layout: {
    templateId: 'minimal-clean',
    navbarStyle: 'sticky',
    footerStyle: 'minimal',
    containerWidth: 'standard',
    heroStyle: {
      showAvatar: true,
      avatarShape: 'circle',
      backgroundType: 'mesh-gradient',
      typingAnimation: true,
      primaryCtaText: 'View Projects',
      primaryCtaTarget: '#projects',
      secondaryCtaText: 'Contact Me',
      secondaryCtaTarget: '#contact',
    },
  },
  sections: [
    {
      id: 'sec-hero',
      type: 'hero',
      title: 'Hero',
      visible: true,
      order: 0,
      data: { greeting: 'Hello, I am' },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'sec-projects',
      type: 'projects',
      title: 'Selected Projects',
      visible: true,
      order: 1,
      data: {
        items: [
          {
            id: 'p1',
            title: 'Hyperion Distributed Runtime',
            description: 'Zero-downtime compute orchestrator.',
            tags: ['Rust', 'TypeScript'],
            coverImage: '',
            coverAlt: 'Hyperion',
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com',
            featured: true,
            category: 'Systems',
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
  ],
  seo: {
    title: 'Alex Rivera — Staff Systems Engineer',
    description: 'Portfolio of Alex Rivera, Staff Systems Engineer.',
    keywords: ['Systems', 'TypeScript', 'Rust'],
    ogImage: '',
    faviconEmoji: '⚡',
    language: 'en',
  },
  settings: {
    showMadeWithFolio: true,
    formEndpoint: '',
    enableContactForm: true,
    customSlug: 'alex-rivera',
    analyticsEnabled: false,
  },
};

test('validatePortfolio accepts a valid portfolio and catches missing fields', () => {
  const validResult = validatePortfolio(mockPortfolio);
  assert.equal(validResult.valid, true);
  assert.equal(validResult.errors.length, 0);

  const invalidResult = validatePortfolio({ id: '', profile: { name: '' } });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.length > 0);
});

test('applyTemplateToPortfolio switches template without losing any section or profile data', () => {
  const switched = applyTemplateToPortfolio(mockPortfolio, 'developer-terminal', {
    primary: '#10B981',
  });
  assert.equal(switched.layout.templateId, 'developer-terminal');
  assert.equal(switched.theme.primary, '#10B981');
  assert.equal(switched.profile.name, 'Alex Rivera');
  assert.equal(switched.sections.length, 2);
  assert.equal(switched.sections[1].data.items[0].title, 'Hyperion Distributed Runtime');
});

test('getContrastRatio and getContrastRating calculate WCAG 2.1 contrast accurately', () => {
  const ratioHigh = getContrastRatio('#FFFFFF', '#000000');
  assert.equal(ratioHigh, 21);
  assert.equal(getContrastRating(ratioHigh).passesAA, true);

  const ratioLow = getContrastRatio('#94A3B8', '#CBD5E1');
  assert.ok(ratioLow < 3.0);
  assert.equal(getContrastRating(ratioLow).passesAA, false);
});

test('sanitizeCustomCss removes script tags, @import, and javascript: expressions', () => {
  const dirty = `@import url("https://evil.com"); .card { background: url(javascript:alert(1)); color: #fff; } <script>alert(1)</script>`;
  const clean = sanitizeCustomCss(dirty);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('javascript:'), false);
  assert.equal(clean.includes('color: #fff;'), true);
});

test('reorderSections moves section and re-indexes order sequentially', () => {
  const reordered = reorderSections(mockPortfolio.sections, 0, 1);
  assert.equal(reordered[0].id, 'sec-projects');
  assert.equal(reordered[0].order, 0);
  assert.equal(reordered[1].id, 'sec-hero');
  assert.equal(reordered[1].order, 1);
});

test('encodeSharePayload and decodeSharePayload roundtrip portfolio state', () => {
  const encoded = encodeSharePayload(mockPortfolio);
  assert.ok(encoded.length > 10);
  const decoded = decodeSharePayload(encoded);
  assert.ok(decoded !== null);
  assert.equal(decoded?.profile.name, 'Alex Rivera');
  assert.equal(decoded?.sections.length, 2);
});
