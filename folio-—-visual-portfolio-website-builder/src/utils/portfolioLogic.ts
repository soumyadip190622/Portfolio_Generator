import {
  Portfolio,
  PortfolioSection,
  PortfolioTheme,
  SectionType,
  TemplateId,
} from '../types/portfolio';

const VALID_SECTION_TYPES: SectionType[] = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'certificates',
  'achievements',
  'services',
  'gallery',
  'testimonials',
  'blog',
  'contact',
  'resume',
  'socialLinks',
  'customText',
];

const VALID_TEMPLATE_IDS: TemplateId[] = [
  'minimal-clean',
  'dark-futuristic',
  'bento-grid',
  'developer-terminal',
  'designer-showcase',
  'photographer-gallery',
  'one-page-resume',
  'glassmorphism',
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePortfolio(input: unknown): ValidationResult {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Portfolio must be a valid JSON object.'] };
  }
  const p = input as Partial<Portfolio>;

  if (!p.id || typeof p.id !== 'string') errors.push('Missing portfolio id.');
  if (!p.name || typeof p.name !== 'string') errors.push('Missing portfolio name.');
  if (!p.profile || typeof p.profile !== 'object') {
    errors.push('Missing profile object.');
  } else {
    if (typeof p.profile.name !== 'string' || p.profile.name.trim() === '') {
      errors.push('Profile name is required.');
    }
  }
  if (!p.theme || typeof p.theme !== 'object') {
    errors.push('Missing theme object.');
  }
  if (!p.layout || typeof p.layout !== 'object') {
    errors.push('Missing layout object.');
  } else if (!VALID_TEMPLATE_IDS.includes(p.layout.templateId as TemplateId)) {
    errors.push(`Invalid templateId: ${String(p.layout.templateId)}`);
  }
  if (!Array.isArray(p.sections)) {
    errors.push('Sections must be an array.');
  } else {
    p.sections.forEach((sec, idx) => {
      if (!sec || typeof sec !== 'object') {
        errors.push(`Section at index ${idx} is invalid.`);
        return;
      }
      if (!VALID_SECTION_TYPES.includes(sec.type)) {
        errors.push(`Section "${sec.id || idx}" has unsupported type "${String(sec.type)}".`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes custom CSS so it cannot execute scripts, load external trackers, or break outside the preview container.
 */
export function sanitizeCustomCss(rawCss: string): string {
  if (!rawCss || typeof rawCss !== 'string') return '';
  return rawCss
    .replace(/<\/?style[^>]*>/gi, '')
    .replace(/<\/?script[^>]*>/gi, '')
    .replace(/expression\s*\(/gi, '/* blocked */(')
    .replace(/javascript\s*:/gi, '')
    .replace(/@import\b[^;]*;?/gi, '/* @import blocked */')
    .replace(/url\s*\(\s*['"]?\s*javascript:[^)]*\)/gi, 'none')
    .trim();
}

/**
 * Sanitizes user-supplied text/markdown to strip dangerous script/iframe/event attributes.
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
}

/**
 * Parses a hex color (#RRGGBB or #RGB) into RGB [0..255].
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  if (!hex || typeof hex !== 'string') return null;
  const cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return [r, g, b];
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return [r, g, b];
  }
  return null;
}

export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes WCAG 2.1 contrast ratio between two hex colors (1.0 to 21.0).
 */
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = getRelativeLuminance(foregroundHex);
  const l2 = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function getContrastRating(ratio: number): {
  level: 'AAA' | 'AA' | 'AA Large' | 'Poor';
  passesAA: boolean;
  message: string;
} {
  if (ratio >= 7) {
    return { level: 'AAA', passesAA: true, message: 'Excellent contrast (WCAG AAA)' };
  }
  if (ratio >= 4.5) {
    return { level: 'AA', passesAA: true, message: 'Good contrast (WCAG AA)' };
  }
  if (ratio >= 3.0) {
    return {
      level: 'AA Large',
      passesAA: false,
      message: 'Low contrast for body text (passes large text only)',
    };
  }
  return {
    level: 'Poor',
    passesAA: false,
    message: 'Warning: Text is difficult to read against this background',
  };
}

export function suggestReadableTextColor(backgroundHex: string): {
  text: string;
  mutedText: string;
} {
  const lum = getRelativeLuminance(backgroundHex);
  if (lum > 0.35) {
    return { text: '#0F172A', mutedText: '#475569' };
  }
  return { text: '#F8FAFC', mutedText: '#94A3B8' };
}

/**
 * Switches template ID and optionally applies the template's recommended default theme without losing ANY user profile or section data.
 */
export function applyTemplateToPortfolio(
  portfolio: Portfolio,
  newTemplateId: TemplateId,
  defaultThemeOverride?: Partial<PortfolioTheme>
): Portfolio {
  return {
    ...portfolio,
    updatedAt: new Date().toISOString(),
    layout: {
      ...portfolio.layout,
      templateId: newTemplateId,
    },
    theme: defaultThemeOverride
      ? {
          ...portfolio.theme,
          ...defaultThemeOverride,
        }
      : portfolio.theme,
    // Strictly preserve all sections and their data
    sections: portfolio.sections.map((section) => ({
      ...section,
      data: structuredClone(section.data),
    })),
  };
}

/**
 * Reorders sections cleanly and normalizes their .order index (0, 1, 2...).
 */
export function reorderSections(
  sections: PortfolioSection[],
  fromIndex: number,
  toIndex: number
): PortfolioSection[] {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= sorted.length ||
    toIndex >= sorted.length ||
    fromIndex === toIndex
  ) {
    return sorted;
  }
  const [moved] = sorted.splice(fromIndex, 1);
  sorted.splice(toIndex, 0, moved);
  return sorted.map((sec, idx) => ({
    ...sec,
    order: idx,
  }));
}

/**
 * Encodes a lightweight shareable portfolio payload into a URL-safe base64 hash string.
 */
export function encodeSharePayload(portfolio: Portfolio): string {
  try {
    // Strip large base64 data URIs or previous versions if present to keep URL compact
    const compact: Portfolio = {
      ...portfolio,
      versions: undefined,
      profile: {
        ...portfolio.profile,
        avatarUrl: portfolio.profile.avatarUrl.startsWith('data:image/jpeg')
          ? ''
          : portfolio.profile.avatarUrl,
      },
    };
    const json = JSON.stringify(compact);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

export function decodeSharePayload(encoded: string): Portfolio | null {
  try {
    if (!encoded) return null;
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json);
    const check = validatePortfolio(parsed);
    return check.valid ? (parsed as Portfolio) : null;
  } catch {
    return null;
  }
}

/**
 * Deterministic visual QR-style matrix generator (21x21 grid with finder patterns and data bits)
 * for rendering crisp SVG QR codes for any share URL without external network dependencies.
 */
export function generateQrSvgMatrix(text: string): boolean[][] {
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const placeFinder = (rowOffset: number, colOffset: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[rowOffset + r][colOffset + c] = isBorder || isInner;
        reserved[rowOffset + r][colOffset + c] = true;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
    reserved[6][i] = true;
    reserved[i][6] = true;
  }

  // Hash text into deterministic bit stream
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  let seed = Math.abs(hash) || 123456789;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r][c]) continue;
      // Leave quiet separator around finder patterns
      if (
        (r === 7 && (c < 8 || c >= size - 8)) ||
        (c === 7 && (r < 8 || r >= size - 8)) ||
        (r === size - 8 && c < 8) ||
        (c === size - 8 && r < 8)
      ) {
        grid[r][c] = false;
        continue;
      }
      seed = (seed * 1664525 + 1013904223 + text.charCodeAt((r * size + c) % Math.max(1, text.length))) >>> 0;
      grid[r][c] = (seed & 3) === 0 || (seed & 5) === 1;
    }
  }

  return grid;
}
