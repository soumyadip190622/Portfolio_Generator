import { ProfessionType, SectionType, TemplateId } from '../types/portfolio';

export interface ColorPalettePreset {
  id: string;
  name: string;
  mode: 'dark' | 'light';
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  gradient: string;
}

export const COLOR_PALETTES: ColorPalettePreset[] = [
  {
    id: 'obsidian-cobalt',
    name: 'Obsidian Cobalt',
    mode: 'dark',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    background: '#090D16',
    surface: '#111827',
    text: '#F8FAFC',
    mutedText: '#94A3B8',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
  },
  {
    id: 'swiss-paper',
    name: 'Swiss Monograph',
    mode: 'light',
    primary: '#18181B',
    secondary: '#2563EB',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#09090B',
    mutedText: '#52525B',
    gradient: 'linear-gradient(135deg, #18181B 0%, #3F3F46 100%)',
  },
  {
    id: 'emerald-terminal',
    name: 'Emerald Matrix',
    mode: 'dark',
    primary: '#10B981',
    secondary: '#34D399',
    background: '#050B09',
    surface: '#0C1713',
    text: '#ECFDF5',
    mutedText: '#6EE7B7',
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  },
  {
    id: 'editorial-ochre',
    name: 'Warm Editorial',
    mode: 'light',
    primary: '#D97706',
    secondary: '#B45309',
    background: '#FAF8F5',
    surface: '#F3EFEA',
    text: '#1C1917',
    mutedText: '#57534E',
    gradient: 'linear-gradient(135deg, #D97706 0%, #EA580C 100%)',
  },
  {
    id: 'cyber-indigo',
    name: 'Deep Horizon',
    mode: 'dark',
    primary: '#6366F1',
    secondary: '#38BDF8',
    background: '#070913',
    surface: '#111528',
    text: '#F1F5F9',
    mutedText: '#94A3B8',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
  },
  {
    id: 'cinnabar-noir',
    name: 'Cinnabar Noir',
    mode: 'dark',
    primary: '#E11D48',
    secondary: '#FB7185',
    background: '#09090B',
    surface: '#18181B',
    text: '#FAFAFA',
    mutedText: '#A1A1AA',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #F97316 100%)',
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    mode: 'light',
    primary: '#0284C7',
    secondary: '#0369A1',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    mutedText: '#475569',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
  },
  {
    id: 'amber-studio',
    name: 'Amber Darkroom',
    mode: 'dark',
    primary: '#F59E0B',
    secondary: '#FBBF24',
    background: '#0C0A09',
    surface: '#1C1917',
    text: '#FAFAF9',
    mutedText: '#A8A29E',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  },
  {
    id: 'sage-botanical',
    name: 'Sage Studio',
    mode: 'light',
    primary: '#0D9488',
    secondary: '#14B8A6',
    background: '#F4F7F6',
    surface: '#FFFFFF',
    text: '#132A26',
    mutedText: '#4B635E',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
  },
  {
    id: 'titanium-slate',
    name: 'Titanium Slate',
    mode: 'dark',
    primary: '#38BDF8',
    secondary: '#818CF8',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    mutedText: '#94A3B8',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #4F46E5 100%)',
  },
  {
    id: 'alabaster-cobalt',
    name: 'Alabaster Cobalt',
    mode: 'light',
    primary: '#2563EB',
    secondary: '#1D4ED8',
    background: '#FFFFFF',
    surface: '#F4F4F5',
    text: '#18181B',
    mutedText: '#52525B',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
  },
  {
    id: 'aurora-glass',
    name: 'Aurora Glass',
    mode: 'dark',
    primary: '#2DD4BF',
    secondary: '#38BDF8',
    background: '#060D1A',
    surface: '#0F1B2D',
    text: '#F0FDFA',
    mutedText: '#94A3B8',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
  },
];

export const GOOGLE_FONTS_LIST: string[] = [
  'Plus Jakarta Sans',
  'Outfit',
  'Bricolage Grotesque',
  'Manrope',
  'DM Sans',
  'Public Sans',
  'Urbanist',
  'Archivo',
  'Syne',
  'Work Sans',
  'Rubik',
  'Karla',
  'Oswald',
  'Playfair Display',
  'Fraunces',
  'Cormorant Garamond',
  'Source Serif 4',
  'Lora',
  'Libre Baskerville',
  'Merriweather',
  'Bodoni Moda',
  'Cinzel',
  'JetBrains Mono',
  'IBM Plex Mono',
  'Space Mono',
  'Fira Code',
];

export interface FontPairingPreset {
  id: string;
  name: string;
  description: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
}

export const FONT_PAIRINGS: FontPairingPreset[] = [
  {
    id: 'modern-architect',
    name: 'Modern Architect',
    description: 'Outfit + Plus Jakarta Sans',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
  },
  {
    id: 'editorial-monograph',
    name: 'Editorial Monograph',
    description: 'Playfair Display + DM Sans',
    headingFont: 'Playfair Display',
    bodyFont: 'DM Sans',
    monoFont: 'IBM Plex Mono',
  },
  {
    id: 'creative-grotesque',
    name: 'Creative Grotesque',
    description: 'Bricolage Grotesque + Manrope',
    headingFont: 'Bricolage Grotesque',
    bodyFont: 'Manrope',
    monoFont: 'Space Mono',
  },
  {
    id: 'developer-precision',
    name: 'Developer Precision',
    description: 'JetBrains Mono + Public Sans',
    headingFont: 'JetBrains Mono',
    bodyFont: 'Public Sans',
    monoFont: 'JetBrains Mono',
  },
  {
    id: 'luxury-curator',
    name: 'Luxury Curator',
    description: 'Fraunces + Plus Jakarta Sans',
    headingFont: 'Fraunces',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'IBM Plex Mono',
  },
  {
    id: 'bold-industrial',
    name: 'Bold Industrial',
    description: 'Archivo + Work Sans',
    headingFont: 'Archivo',
    bodyFont: 'Work Sans',
    monoFont: 'Fira Code',
  },
  {
    id: 'literary-journal',
    name: 'Literary Journal',
    description: 'Cormorant Garamond + Source Serif 4',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Source Serif 4',
    monoFont: 'Space Mono',
  },
  {
    id: 'avant-garde',
    name: 'Avant-Garde Studio',
    description: 'Syne + Urbanist',
    headingFont: 'Syne',
    bodyFont: 'Urbanist',
    monoFont: 'JetBrains Mono',
  },
];

export const PROFESSION_PRESETS: Record<
  ProfessionType,
  {
    recommendedTemplate: TemplateId;
    recommendedPalette: string;
    defaultSections: SectionType[];
    taglineHint: string;
  }
> = {
  Developer: {
    recommendedTemplate: 'developer-terminal',
    recommendedPalette: 'obsidian-cobalt',
    defaultSections: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'certificates', 'blog', 'contact'],
    taglineHint: 'Full-Stack Engineer building resilient distributed systems & web products.',
  },
  Designer: {
    recommendedTemplate: 'designer-showcase',
    recommendedPalette: 'swiss-paper',
    defaultSections: ['hero', 'about', 'projects', 'services', 'skills', 'experience', 'testimonials', 'contact'],
    taglineHint: 'Principal Product Designer shaping clear, tactile interfaces and design systems.',
  },
  Photographer: {
    recommendedTemplate: 'photographer-gallery',
    recommendedPalette: 'amber-studio',
    defaultSections: ['hero', 'gallery', 'about', 'services', 'achievements', 'testimonials', 'contact'],
    taglineHint: 'Architectural & Editorial Photographer capturing light, form, and human stories.',
  },
  Student: {
    recommendedTemplate: 'bento-grid',
    recommendedPalette: 'cyber-indigo',
    defaultSections: ['hero', 'about', 'education', 'projects', 'skills', 'certificates', 'achievements', 'resume', 'contact'],
    taglineHint: 'Computer Science Undergraduate exploring AI systems, web engineering, and open source.',
  },
  Freelancer: {
    recommendedTemplate: 'glassmorphism',
    recommendedPalette: 'aurora-glass',
    defaultSections: ['hero', 'services', 'projects', 'about', 'testimonials', 'skills', 'contact'],
    taglineHint: 'Independent Digital Consultant & Creator helping brands launch high-converting products.',
  },
  Writer: {
    recommendedTemplate: 'minimal-clean',
    recommendedPalette: 'editorial-ochre',
    defaultSections: ['hero', 'about', 'blog', 'projects', 'experience', 'testimonials', 'contact'],
    taglineHint: 'Technical Author & Editorial Strategist distilling complex technology into clear prose.',
  },
  Other: {
    recommendedTemplate: 'minimal-clean',
    recommendedPalette: 'obsidian-cobalt',
    defaultSections: ['hero', 'about', 'projects', 'experience', 'skills', 'education', 'contact'],
    taglineHint: 'Multidisciplinary Professional focused on strategy, execution, and measurable outcomes.',
  },
};
