export type SectionType =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'certificates'
  | 'achievements'
  | 'services'
  | 'gallery'
  | 'testimonials'
  | 'blog'
  | 'contact'
  | 'resume'
  | 'socialLinks'
  | 'customText';

export type TemplateId =
  | 'minimal-clean'
  | 'dark-futuristic'
  | 'bento-grid'
  | 'developer-terminal'
  | 'designer-showcase'
  | 'photographer-gallery'
  | 'one-page-resume'
  | 'glassmorphism';

export type ProfessionType =
  | 'Developer'
  | 'Designer'
  | 'Photographer'
  | 'Student'
  | 'Freelancer'
  | 'Writer'
  | 'Other';

export type UILanguage = 'en' | 'bn' | 'hi';

export interface SocialLinkItem {
  id: string;
  platform:
    | 'github'
    | 'linkedin'
    | 'twitter'
    | 'instagram'
    | 'youtube'
    | 'behance'
    | 'dribbble'
    | 'whatsapp'
    | 'website'
    | 'custom';
  label: string;
  url: string;
}

export interface PortfolioProfile {
  name: string;
  headline: string;
  typingRoles: string[];
  location: string;
  email: string;
  phone: string;
  avatarUrl: string;
  avatarAlt: string;
  resumeUrl: string;
  availableForWork: boolean;
  availabilityText: string;
}

export interface PortfolioTheme {
  mode: 'dark' | 'light' | 'auto';
  paletteId: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  gradient: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  headingScale: 'sm' | 'md' | 'lg' | 'xl';
  bodyScale: 'sm' | 'md' | 'lg';
  letterSpacing: 'tight' | 'normal' | 'wide';
  fontWeight: 'normal' | 'medium' | 'bold';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  buttonStyle: 'solid' | 'outline' | 'pill' | 'sharp';
  animationsEnabled: boolean;
  animationIntensity: 'subtle' | 'medium' | 'dynamic';
  customCss: string;
}

export interface PortfolioLayout {
  templateId: TemplateId;
  navbarStyle: 'sticky' | 'floating-pill' | 'sidebar' | 'minimal';
  footerStyle: 'minimal' | 'detailed' | 'editorial';
  containerWidth: 'narrow' | 'standard' | 'wide' | 'full';
  heroStyle: {
    showAvatar: boolean;
    avatarShape: 'circle' | 'rounded' | 'square';
    backgroundType: 'solid' | 'mesh-gradient' | 'grid' | 'spotlight';
    typingAnimation: boolean;
    primaryCtaText: string;
    primaryCtaTarget: string;
    secondaryCtaText: string;
    secondaryCtaTarget: string;
  };
}

export interface SectionStyle {
  alignment: 'left' | 'center';
  width: 'narrow' | 'standard' | 'wide' | 'full';
  spacing: 'compact' | 'normal' | 'spacious';
  background: 'default' | 'surface' | 'gradient' | 'pattern';
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  extraImages?: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  category: string;
  metrics?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institute: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade: string;
  description?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  image?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  metric?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
  deliverables?: string[];
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  alt: string;
  category?: string;
  exif?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  coverImage?: string;
  url?: string;
}

export interface QuickFactItem {
  id: string;
  label: string;
  value: string;
}

export interface PortfolioSection<T = Record<string, any>> {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  visible: boolean;
  order: number;
  data: T;
  style: SectionStyle;
}

export interface PortfolioSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  faviconEmoji: string;
  language: string;
  canonicalUrl?: string;
}

export interface PortfolioSettings {
  showMadeWithFolio: boolean;
  formEndpoint: string;
  enableContactForm: boolean;
  customSlug: string;
  analyticsEnabled: boolean;
}

export interface VersionSnapshot {
  id: string;
  label: string;
  timestamp: string;
  portfolioData: Omit<Portfolio, 'versions'>;
}

export interface Portfolio {
  id: string;
  name: string;
  profession: ProfessionType;
  status: 'draft' | 'published';
  updatedAt: string;
  profile: PortfolioProfile;
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  sections: PortfolioSection[];
  seo: PortfolioSEO;
  settings: PortfolioSettings;
  versions?: VersionSnapshot[];
}
