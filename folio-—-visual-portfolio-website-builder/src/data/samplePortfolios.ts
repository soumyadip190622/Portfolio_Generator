import { Portfolio, ProfessionType } from '../types/portfolio';
import { COLOR_PALETTES, PROFESSION_PRESETS } from './presets';

// High-craft inline SVG Data URI generators so sample avatars, projects, and photography never fail or depend on external hosts
function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const SAMPLE_ASSETS = {
  devAvatar: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#1E3A8A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <circle cx="200" cy="150" r="68" fill="#38BDF8" opacity="0.18"/>
      <circle cx="200" cy="148" r="56" fill="#E2E8F0"/>
      <path d="M95 360 C95 265, 305 265, 305 360 Z" fill="#3B82F6"/>
      <path d="M135 360 C135 290, 265 290, 265 360 Z" fill="#1D4ED8"/>
      <rect x="30" y="30" width="340" height="340" rx="24" fill="none" stroke="#38BDF8" stroke-opacity="0.25" stroke-width="2"/>
    </svg>
  `),
  designerAvatar: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#F5F3EF"/>
      <circle cx="260" cy="120" r="110" fill="#E11D48" opacity="0.12"/>
      <circle cx="200" cy="152" r="56" fill="#18181B"/>
      <path d="M95 365 C95 268, 305 268, 305 365 Z" fill="#27272A"/>
      <circle cx="150" cy="145" r="8" fill="#F5F3EF"/>
      <circle cx="250" cy="145" r="8" fill="#F5F3EF"/>
      <rect x="24" y="24" width="352" height="352" fill="none" stroke="#18181B" stroke-opacity="0.15" stroke-width="2"/>
    </svg>
  `),
  photographerAvatar: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#141210"/>
      <circle cx="200" cy="200" r="145" fill="none" stroke="#F59E0B" stroke-opacity="0.3" stroke-width="1.5"/>
      <circle cx="200" cy="148" r="54" fill="#D6D3D1"/>
      <path d="M100 360 C100 270, 300 270, 300 360 Z" fill="#44403C"/>
      <rect x="155" y="220" width="90" height="62" rx="10" fill="#1C1917" stroke="#F59E0B" stroke-width="3"/>
      <circle cx="200" cy="251" r="18" fill="none" stroke="#FBBF24" stroke-width="3"/>
    </svg>
  `),
  projectCloud: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#080D1A"/>
      <g stroke="#1E293B" stroke-width="1">
        <line x1="0" y1="100" x2="800" y2="100"/><line x1="0" y1="200" x2="800" y2="200"/><line x1="0" y1="300" x2="800" y2="300"/><line x1="0" y1="400" x2="800" y2="400"/>
        <line x1="160" y1="0" x2="160" y2="500"/><line x1="320" y1="0" x2="320" y2="500"/><line x1="480" y1="0" x2="480" y2="500"/><line x1="640" y1="0" x2="640" y2="500"/>
      </g>
      <rect x="70" y="65" width="660" height="370" rx="16" fill="#0F172A" stroke="#3B82F6" stroke-opacity="0.45" stroke-width="2"/>
      <rect x="105" y="110" width="260" height="125" rx="10" fill="#1E293B"/>
      <polyline points="125,205 170,165 215,180 275,135 340,150" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
      <rect x="395" y="110" width="300" height="125" rx="10" fill="#1E293B"/>
      <circle cx="465" cy="172" r="36" fill="none" stroke="#10B981" stroke-width="8"/>
      <rect x="530" y="148" width="130" height="14" rx="7" fill="#3B82F6"/>
      <rect x="530" y="176" width="95" height="12" rx="6" fill="#64748B"/>
      <rect x="105" y="260" width="590" height="135" rx="10" fill="#111827" stroke="#334155"/>
      <rect x="135" y="290" width="140" height="75" rx="8" fill="#1E3A8A"/>
      <rect x="305" y="290" width="140" height="75" rx="8" fill="#065F46"/>
      <rect x="475" y="290" width="190" height="75" rx="8" fill="#312E81"/>
    </svg>
  `),
  projectAiStudio: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#090D16"/>
      <circle cx="650" cy="120" r="180" fill="#2563EB" opacity="0.18"/>
      <circle cx="160" cy="390" r="160" fill="#10B981" opacity="0.14"/>
      <rect x="90" y="75" width="620" height="350" rx="18" fill="#111827" stroke="#38BDF8" stroke-opacity="0.35" stroke-width="2"/>
      <line x1="240" y1="250" x2="400" y2="155" stroke="#60A5FA" stroke-width="3"/>
      <line x1="240" y1="250" x2="400" y2="345" stroke="#60A5FA" stroke-width="3"/>
      <line x1="400" y1="155" x2="570" y2="250" stroke="#34D399" stroke-width="3"/>
      <line x1="400" y1="345" x2="570" y2="250" stroke="#34D399" stroke-width="3"/>
      <circle cx="240" cy="250" r="32" fill="#2563EB"/>
      <circle cx="400" cy="155" r="28" fill="#0EA5E9"/>
      <circle cx="400" cy="345" r="28" fill="#0EA5E9"/>
      <circle cx="570" cy="250" r="36" fill="#10B981"/>
    </svg>
  `),
  projectDesignSystem: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#F5F3EF"/>
      <rect x="60" y="55" width="320" height="390" fill="#18181B"/>
      <text x="95" y="165" fill="#FAFAFA" font-family="sans-serif" font-size="72" font-weight="bold">Aa</text>
      <rect x="95" y="210" width="180" height="8" fill="#E11D48"/>
      <rect x="95" y="240" width="220" height="6" fill="#71717A"/>
      <rect x="95" y="264" width="190" height="6" fill="#71717A"/>
      <rect x="415" y="55" width="325" height="185" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="2"/>
      <circle cx="495" cy="147" r="46" fill="#E11D48"/>
      <circle cx="575" cy="147" r="46" fill="#2563EB" opacity="0.85"/>
      <rect x="415" y="265" width="325" height="180" fill="#E4E4E7"/>
      <rect x="450" y="305" width="255" height="36" rx="18" fill="#18181B"/>
      <rect x="450" y="360" width="160" height="36" rx="18" fill="#FFFFFF"/>
    </svg>
  `),
  photoArchitecture1: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#181512"/>
      <polygon points="120,520 360,90 540,520" fill="#D6D3D1"/>
      <polygon points="360,90 540,520 690,520 510,90" fill="#78716C"/>
      <circle cx="610" cy="170" r="58" fill="#F59E0B" opacity="0.85"/>
      <rect x="0" y="490" width="800" height="110" fill="#0C0A09"/>
    </svg>
  `),
  photoArchitecture2: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#0C0A09"/>
      <rect x="140" y="70" width="520" height="460" fill="#292524"/>
      <path d="M 240 530 L 240 240 A 160 160 0 0 1 560 240 L 560 530 Z" fill="#F5F5F4"/>
      <path d="M 330 530 L 330 300 A 90 90 0 0 1 490 300 L 490 530 Z" fill="#1C1917"/>
      <line x1="140" y1="530" x2="660" y2="530" stroke="#F59E0B" stroke-width="4"/>
    </svg>
  `),
  photoArchitecture3: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#1C1917"/>
      <rect x="90" y="90" width="280" height="420" fill="#E7E5E4"/>
      <rect x="410" y="90" width="300" height="200" fill="#A8A29E"/>
      <rect x="410" y="310" width="300" height="200" fill="#F59E0B"/>
      <circle cx="230" cy="300" r="70" fill="#1C1917"/>
    </svg>
  `),
};

export const DEVELOPER_SAMPLE_PORTFOLIO: Portfolio = {
  id: 'sample-developer',
  name: 'Alex Rivera — Staff Engineer',
  profession: 'Developer',
  status: 'published',
  updatedAt: new Date().toISOString(),
  profile: {
    name: 'Alex Rivera',
    headline: 'Staff Systems & AI Infrastructure Engineer building low-latency cloud platforms.',
    typingRoles: ['Staff Systems Engineer', 'Distributed Cloud Architect', 'Open Source Maintainer'],
    location: 'San Francisco, CA',
    email: 'alex.rivera@folio.dev',
    phone: '+1 (415) 890-4321',
    avatarUrl: SAMPLE_ASSETS.devAvatar,
    avatarAlt: 'Alex Rivera portrait',
    resumeUrl: '#resume',
    availableForWork: true,
    availabilityText: 'Available for Staff/Principal roles & technical advisory',
  },
  theme: {
    mode: 'dark',
    paletteId: 'obsidian-cobalt',
    primary: '#3B82F6',
    secondary: '#38BDF8',
    background: '#090D16',
    surface: '#111827',
    text: '#F8FAFC',
    mutedText: '#94A3B8',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
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
    footerStyle: 'detailed',
    containerWidth: 'standard',
    heroStyle: {
      showAvatar: true,
      avatarShape: 'circle',
      backgroundType: 'mesh-gradient',
      typingAnimation: true,
      primaryCtaText: 'Explore Selected Work',
      primaryCtaTarget: '#projects',
      secondaryCtaText: 'Get in Touch',
      secondaryCtaTarget: '#contact',
    },
  },
  sections: [
    {
      id: 'sec-hero',
      type: 'hero',
      title: 'Introduction',
      visible: true,
      order: 0,
      data: {
        greeting: 'Staff Engineer · Distributed Systems',
        metrics: [
          { label: 'Production Traffic Handled', value: '1.4M req/s' },
          { label: 'Open Source Stars', value: '18.5k+' },
          { label: 'Years in Production Engineering', value: '9+ yrs' },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'sec-about',
      type: 'about',
      title: 'About & Philosophy',
      subtitle: 'Engineering systems where reliability meets developer velocity',
      visible: true,
      order: 1,
      data: {
        bio: 'Over the last 9 years, I have architected high-throughput compute engines, edge routing networks, and developer tooling at scale. My focus is eliminating accidental complexity—designing APIs and distributed runtimes that remain predictable under peak load while empowering product teams to ship with confidence.',
        quickFacts: [
          { id: 'qf-1', label: 'Core Focus', value: 'Distributed Systems, Rust, TypeScript, AI Runtimes' },
          { id: 'qf-2', label: 'Current Base', value: 'San Francisco, CA (UTC-8)' },
          { id: 'qf-3', label: 'Languages', value: 'English (Native), Spanish (Bilingual)' },
          { id: 'qf-4', label: 'Patents & Papers', value: '2 US Systems Patents · OSDI Contributor' },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'sec-projects',
      type: 'projects',
      title: 'Selected Engineering Work',
      subtitle: 'Production systems, open-source infrastructure, and developer tools',
      visible: true,
      order: 2,
      data: {
        items: [
          {
            id: 'proj-1',
            title: 'Hyperion Edge Mesh',
            description: 'Zero-cold-start WebAssembly compute engine deployed across 38 global edge PoPs, reducing p99 API tail latency by 64% for 40,000+ tenant deployments.',
            tags: ['Rust', 'WebAssembly', 'TypeScript', 'Anycast BGP'],
            coverImage: SAMPLE_ASSETS.projectCloud,
            coverAlt: 'Hyperion Edge Mesh telemetry architecture',
            liveUrl: 'https://example.com/hyperion',
            githubUrl: 'https://github.com/example/hyperion',
            featured: true,
            category: 'Infrastructure',
            metrics: '-64% p99 tail latency · 1.4M req/s',
          },
          {
            id: 'proj-2',
            title: 'VectorFlow Inference Router',
            description: 'Adaptive multi-model LLM gateway with semantic caching, token-budget rate limiting, and automatic failover across cloud providers.',
            tags: ['TypeScript', 'Go', 'Redis', 'OpenTelemetry'],
            coverImage: SAMPLE_ASSETS.projectAiStudio,
            coverAlt: 'VectorFlow router topology diagram',
            liveUrl: 'https://example.com/vectorflow',
            githubUrl: 'https://github.com/example/vectorflow',
            featured: true,
            category: 'AI Systems',
            metrics: '38% lower inference cost in 6 months',
          },
          {
            id: 'proj-3',
            title: 'Chronicle State Inspector',
            description: 'Time-travel debugging and deterministic state replay toolkit for collaborative real-time web applications.',
            tags: ['React 19', 'TypeScript', 'CRDTs', 'WebSockets'],
            coverImage: SAMPLE_ASSETS.projectDesignSystem,
            coverAlt: 'Chronicle State Inspector UI',
            liveUrl: 'https://example.com/chronicle',
            githubUrl: 'https://github.com/example/chronicle',
            featured: false,
            category: 'Developer Tools',
            metrics: '11.2k GitHub Stars',
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'sec-skills',
      type: 'skills',
      title: 'Technical Capabilities',
      subtitle: 'Languages, distributed runtimes, and modern frontend architecture',
      visible: true,
      order: 3,
      data: {
        items: [
          { id: 'sk-1', name: 'TypeScript & Node.js', category: 'Languages & Runtimes', level: 98 },
          { id: 'sk-2', name: 'Rust & WebAssembly', category: 'Languages & Runtimes', level: 92 },
          { id: 'sk-3', name: 'Go (Golang)', category: 'Languages & Runtimes', level: 90 },
          { id: 'sk-4', name: 'React 19 & Next.js', category: 'Frontend Engineering', level: 95 },
          { id: 'sk-5', name: 'Design Systems & WCAG AA', category: 'Frontend Engineering', level: 88 },
          { id: 'sk-6', name: 'Kubernetes & Terraform', category: 'Cloud & Infrastructure', level: 91 },
          { id: 'sk-7', name: 'PostgreSQL & ClickHouse', category: 'Data Systems', level: 89 },
          { id: 'sk-8', name: 'OpenTelemetry & eBPF', category: 'Cloud & Infrastructure', level: 86 },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'surface' },
    },
    {
      id: 'sec-experience',
      type: 'experience',
      title: 'Career History',
      subtitle: 'Leadership and technical contributions across high-growth engineering orgs',
      visible: true,
      order: 4,
      data: {
        items: [
          {
            id: 'exp-1',
            role: 'Staff Systems Engineer',
            company: 'Veloce Cloud',
            startDate: '2023',
            endDate: 'Present',
            current: true,
            location: 'San Francisco, CA',
            bullets: [
              'Architected the multi-region control plane serving 1.4M requests/second with 99.995% uptime SLA.',
              'Led a cross-functional group of 14 engineers to ship zero-downtime database schema migrations.',
              'Mentored 6 senior engineers to staff promotions and established RFC architecture review standards.',
            ],
          },
          {
            id: 'exp-2',
            role: 'Senior Full-Stack Infrastructure Engineer',
            company: 'Linearity Labs',
            startDate: '2020',
            endDate: '2023',
            current: false,
            location: 'New York, NY',
            bullets: [
              'Built real-time collaborative canvas sync engine using Rust CRDTs compiled to WebAssembly.',
              'Reduced client bundle memory footprint by 41% and improved 60fps pan/zoom responsiveness.',
            ],
          },
          {
            id: 'exp-3',
            role: 'Software Engineer',
            company: 'Stripe (Core Payments)',
            startDate: '2017',
            endDate: '2020',
            current: false,
            location: 'Seattle, WA',
            bullets: [
              'Engineered idempotent settlement pipelines processing $18B+ in annual merchant volume.',
              'Designed merchant webhook observability dashboard used by 120,000+ developers daily.',
            ],
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'sec-education',
      type: 'education',
      title: 'Education',
      visible: true,
      order: 5,
      data: {
        items: [
          {
            id: 'edu-1',
            institute: 'University of California, Berkeley',
            degree: 'M.S. in Computer Science (Distributed Systems)',
            startDate: '2015',
            endDate: '2017',
            grade: 'GPA 3.94 / 4.0',
          },
          {
            id: 'edu-2',
            institute: 'University of Washington',
            degree: 'B.S. in Computer Engineering',
            startDate: '2011',
            endDate: '2015',
            grade: 'Magna Cum Laude',
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'compact', background: 'default' },
    },
    {
      id: 'sec-testimonials',
      type: 'testimonials',
      title: 'Peer & Executive Endorsements',
      visible: true,
      order: 6,
      data: {
        items: [
          {
            id: 'test-1',
            name: 'Dr. Maya Lin',
            role: 'VP of Engineering',
            company: 'Veloce Cloud',
            quote: 'Alex has the rare ability to debug a kernel-level networking bottleneck in the morning and design an intuitive developer console in the afternoon. Our edge latency dropped by 64% within two quarters of Alex leading the architecture.',
          },
          {
            id: 'test-2',
            name: 'Marcus Thorne',
            role: 'Principal Product Designer',
            company: 'Linearity Labs',
            quote: 'Working with Alex transformed how our product team thought about performance as a design feature. Every interaction felt instantaneous.',
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'surface' },
    },
    {
      id: 'sec-blog',
      type: 'blog',
      title: 'Technical Writing & Notes',
      visible: true,
      order: 7,
      data: {
        items: [
          {
            id: 'blog-1',
            title: 'Designing Predictable Tail Latency in Multi-Tenant Edge Networks',
            date: 'September 2026',
            readTime: '8 min read',
            summary: 'How we replaced unbounded thread pools with cooperative work-stealing schedulers in Rust.',
            content: 'Tail latency defines user trust in distributed systems. In this deep dive, we examine how adaptive backpressure and zero-copy serialization eliminated p99 spikes.',
          },
          {
            id: 'blog-2',
            title: 'Local-First State Architecture for High-Frequency Web Apps',
            date: 'June 2026',
            readTime: '6 min read',
            summary: 'Practical lessons from running CRDT state machines inside Web Workers.',
            content: 'Modern web apps demand sub-16ms UI feedback regardless of network conditions.',
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'sec-contact',
      type: 'contact',
      title: 'Initiate a Conversation',
      subtitle: 'Available for architectural consulting, speaking, and leadership opportunities',
      visible: true,
      order: 8,
      data: {
        email: 'alex.rivera@folio.dev',
        phone: '+1 (415) 890-4321',
        location: 'San Francisco, CA',
        formEnabled: true,
        socials: [
          { id: 'soc-1', platform: 'github', label: 'GitHub', url: 'https://github.com' },
          { id: 'soc-2', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
          { id: 'soc-3', platform: 'twitter', label: 'X / Twitter', url: 'https://x.com' },
          { id: 'soc-4', platform: 'website', label: 'Technical Blog', url: 'https://example.com' },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
  ],
  seo: {
    title: 'Alex Rivera — Staff Systems & AI Infrastructure Engineer',
    description: 'Portfolio of Alex Rivera, Staff Systems Engineer specializing in distributed cloud infrastructure, Rust, TypeScript, and AI runtimes in San Francisco.',
    keywords: ['Alex Rivera', 'Staff Engineer', 'Distributed Systems', 'Rust', 'TypeScript', 'San Francisco'],
    ogImage: SAMPLE_ASSETS.projectCloud,
    faviconEmoji: '⚡',
    language: 'en',
  },
  settings: {
    showMadeWithFolio: true,
    formEndpoint: '',
    enableContactForm: true,
    customSlug: 'alex-rivera',
    analyticsEnabled: true,
  },
};

export const DESIGNER_SAMPLE_PORTFOLIO: Portfolio = {
  id: 'sample-designer',
  name: 'Elena Rostova — Product Designer',
  profession: 'Designer',
  status: 'published',
  updatedAt: new Date().toISOString(),
  profile: {
    name: 'Elena Rostova',
    headline: 'Principal Product & Design Systems Architect crafting tactile, quiet software.',
    typingRoles: ['Principal Product Designer', 'Design Systems Lead', 'Creative Director'],
    location: 'Zurich & London',
    email: 'elena@rostova.design',
    phone: '+41 44 580 12 90',
    avatarUrl: SAMPLE_ASSETS.designerAvatar,
    avatarAlt: 'Elena Rostova studio portrait',
    resumeUrl: '#resume',
    availableForWork: true,
    availabilityText: 'Booking Q4/Q1 design system audits & product direction',
  },
  theme: {
    mode: 'light',
    paletteId: 'swiss-paper',
    primary: '#18181B',
    secondary: '#E11D48',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#09090B',
    mutedText: '#52525B',
    gradient: 'linear-gradient(135deg, #18181B 0%, #E11D48 100%)',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'IBM Plex Mono',
    headingFontWeight: 'bold',
    headingScale: 'xl',
    bodyScale: 'md',
    letterSpacing: 'tight',
    fontWeight: 'medium',
    borderRadius: 'md',
    shadowIntensity: 'subtle',
    buttonStyle: 'solid',
    animationsEnabled: true,
    animationIntensity: 'subtle',
    customCss: '',
  } as any,
  layout: {
    templateId: 'designer-showcase',
    navbarStyle: 'sticky',
    footerStyle: 'editorial',
    containerWidth: 'wide',
    heroStyle: {
      showAvatar: true,
      avatarShape: 'rounded',
      backgroundType: 'solid',
      typingAnimation: true,
      primaryCtaText: 'Read Case Studies',
      primaryCtaTarget: '#projects',
      secondaryCtaText: 'Inquire for Direction',
      secondaryCtaTarget: '#contact',
    },
  },
  sections: [
    {
      id: 'des-hero',
      type: 'hero',
      title: 'Hero',
      visible: true,
      order: 0,
      data: {
        greeting: 'Principal Product Designer · Design Systems',
        metrics: [
          { label: 'Design System Adoption', value: '140+ Engineers' },
          { label: 'Conversion Lift Across Flows', value: '+34% Avg' },
          { label: 'International Design Awards', value: '6x Red Dot / Awwwards' },
        ],
      },
      style: { alignment: 'left', width: 'wide', spacing: 'spacious', background: 'default' },
    },
    {
      id: 'des-projects',
      type: 'projects',
      title: 'Curated Case Studies',
      subtitle: 'Selected product architecture, multi-brand token systems, and spatial interfaces',
      visible: true,
      order: 1,
      data: {
        items: [
          {
            id: 'dproj-1',
            title: 'Kinetix Multi-Brand Design System',
            description: 'Unified 42 product squads under a single WCAG AAA accessible token architecture in Figma and React, cutting UI engineering handoff time by 52%.',
            tags: ['Design Systems', 'Figma Tokens', 'React Aria', 'Typography'],
            coverImage: SAMPLE_ASSETS.projectDesignSystem,
            coverAlt: 'Kinetix Design System specimen',
            liveUrl: 'https://example.com/kinetix',
            githubUrl: '',
            featured: true,
            category: 'Design Systems',
            metrics: '-52% handoff cycle · 100% WCAG AA',
          },
          {
            id: 'dproj-2',
            title: 'Aether Financial Workstation',
            description: 'Redesigned a high-density institutional trading and treasury terminal with calm typographic hierarchy and keyboard-first command workflows.',
            tags: ['Product Design', 'Data Visualization', 'Fintech'],
            coverImage: SAMPLE_ASSETS.projectCloud,
            coverAlt: 'Aether Financial Workstation interface',
            liveUrl: 'https://example.com/aether',
            githubUrl: '',
            featured: true,
            category: 'Fintech Product',
            metrics: '+41% daily analyst task completion speed',
          },
        ],
      },
      style: { alignment: 'left', width: 'wide', spacing: 'spacious', background: 'default' },
    },
    {
      id: 'des-services',
      type: 'services',
      title: 'Advisory & Design Services',
      subtitle: 'Structured engagements for seed-to-series-C product teams',
      visible: true,
      order: 2,
      data: {
        items: [
          {
            id: 'srv-1',
            title: '01. Design System Architecture',
            description: 'End-to-end token taxonomy, accessible component primitives, and governance workflows bridging Figma and production code.',
            icon: 'layers',
            price: 'From $8,500',
          },
          {
            id: 'srv-2',
            title: '02. Zero-to-One Product Direction',
            description: 'High-conviction product discovery, interactive prototyping, and visual identity for flagship software launches.',
            icon: 'compass',
            price: 'From $12,000',
          },
          {
            id: 'srv-3',
            title: '03. UX & Accessibility Audit',
            description: 'Comprehensive heuristic, typographic, and WCAG 2.1 AA compliance audit with actionable engineering PR guidelines.',
            icon: 'check-circle',
            price: '$4,200 flat',
          },
        ],
      },
      style: { alignment: 'left', width: 'wide', spacing: 'normal', background: 'surface' },
    },
    {
      id: 'des-about',
      type: 'about',
      title: 'Design Ethos',
      visible: true,
      order: 3,
      data: {
        bio: 'Trained in Swiss editorial typography and human-computer interaction in Zurich, I believe the best interfaces feel inevitable. I strip away decorative noise so users can focus entirely on their craft.',
        quickFacts: [
          { id: 'dqf-1', label: 'Discipline', value: 'Product Design, Systems, Editorial Typography' },
          { id: 'dqf-2', label: 'Locations', value: 'Zurich & London' },
          { id: 'dqf-3', label: 'Languages', value: 'English, German, French' },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'des-experience',
      type: 'experience',
      title: 'Experience',
      visible: true,
      order: 4,
      data: {
        items: [
          {
            id: 'dexp-1',
            role: 'Principal Product Designer',
            company: 'Studio Nord',
            startDate: '2022',
            endDate: 'Present',
            current: true,
            location: 'Zurich',
            bullets: [
              'Directed product design and brand systems for 12 venture-backed European software companies.',
              'Established the multi-platform design token specification adopted by 140+ frontend engineers.',
            ],
          },
          {
            id: 'dexp-2',
            role: 'Staff Design Systems Lead',
            company: 'Monolith Financial',
            startDate: '2019',
            endDate: '2022',
            current: false,
            location: 'London',
            bullets: [
              'Led a team of 8 designers and UI engineers building accessible web and iOS component libraries.',
            ],
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'des-contact',
      type: 'contact',
      title: 'Start a Project',
      visible: true,
      order: 5,
      data: {
        email: 'elena@rostova.design',
        phone: '+41 44 580 12 90',
        location: 'Zurich, Switzerland',
        formEnabled: true,
        socials: [
          { id: 'dsoc-1', platform: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com' },
          { id: 'dsoc-2', platform: 'behance', label: 'Behance', url: 'https://behance.net' },
          { id: 'dsoc-3', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
  ],
  seo: {
    title: 'Elena Rostova — Principal Product & Design Systems Architect',
    description: 'Editorial portfolio and case studies of Elena Rostova, Principal Product Designer in Zurich & London.',
    keywords: ['Product Designer', 'Design Systems', 'Swiss Typography', 'UX Director'],
    ogImage: SAMPLE_ASSETS.projectDesignSystem,
    faviconEmoji: '✦',
    language: 'en',
  },
  settings: {
    showMadeWithFolio: true,
    formEndpoint: '',
    enableContactForm: true,
    customSlug: 'elena-rostova',
    analyticsEnabled: false,
  },
};

export const PHOTOGRAPHER_SAMPLE_PORTFOLIO: Portfolio = {
  id: 'sample-photographer',
  name: 'Marcus Vance — Visual Monograph',
  profession: 'Photographer',
  status: 'published',
  updatedAt: new Date().toISOString(),
  profile: {
    name: 'Marcus Vance',
    headline: 'Architectural & Editorial Photographer studying brutalist geometry and natural light.',
    typingRoles: ['Architectural Photographer', 'Visual Director', 'Fine Art Printmaker'],
    location: 'New York & Tokyo',
    email: 'studio@marcusvance.photo',
    phone: '+1 (212) 555-0184',
    avatarUrl: SAMPLE_ASSETS.photographerAvatar,
    avatarAlt: 'Marcus Vance with medium format camera',
    resumeUrl: '#resume',
    availableForWork: true,
    availabilityText: 'Available for international editorial commissions & exhibitions',
  },
  theme: {
    mode: 'dark',
    paletteId: 'amber-studio',
    primary: '#F59E0B',
    secondary: '#FBBF24',
    background: '#0C0A09',
    surface: '#1C1917',
    text: '#FAFAF9',
    mutedText: '#A8A29E',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'DM Sans',
    monoFont: 'Space Mono',
    headingScale: 'xl',
    bodyScale: 'md',
    letterSpacing: 'normal',
    fontWeight: 'medium',
    borderRadius: 'sm',
    shadowIntensity: 'strong',
    buttonStyle: 'outline',
    animationsEnabled: true,
    animationIntensity: 'subtle',
    customCss: '',
  },
  layout: {
    templateId: 'photographer-gallery',
    navbarStyle: 'minimal',
    footerStyle: 'minimal',
    containerWidth: 'wide',
    heroStyle: {
      showAvatar: true,
      avatarShape: 'square',
      backgroundType: 'solid',
      typingAnimation: false,
      primaryCtaText: 'Enter Exhibition Gallery',
      primaryCtaTarget: '#gallery',
      secondaryCtaText: 'Commission Inquiry',
      secondaryCtaTarget: '#contact',
    },
  },
  sections: [
    {
      id: 'ph-hero',
      type: 'hero',
      title: 'Hero',
      visible: true,
      order: 0,
      data: {
        greeting: 'Monograph · Architectural & Editorial Photography',
        metrics: [
          { label: 'Published Monographs', value: '4 Volumes' },
          { label: 'Solo Gallery Exhibitions', value: '11 Cities' },
          { label: 'Primary Medium', value: 'Hasselblad 120mm & Large Format' },
        ],
      },
      style: { alignment: 'left', width: 'wide', spacing: 'spacious', background: 'default' },
    },
    {
      id: 'ph-gallery',
      type: 'gallery',
      title: 'Selected Plates (2022–2026)',
      subtitle: 'Click any plate to inspect in fullscreen lightbox with optical metadata',
      visible: true,
      order: 1,
      data: {
        items: [
          {
            id: 'gal-1',
            imageUrl: SAMPLE_ASSETS.photoArchitecture1,
            caption: 'Plate I — Naoshima Concrete Pavilion at Solstice',
            alt: 'Brutalist concrete museum geometry in golden hour light',
            category: 'Architecture',
            exif: 'Hasselblad 907X · 45mm f/4 · ISO 64 · 1/250s',
          },
          {
            id: 'gal-2',
            imageUrl: SAMPLE_ASSETS.photoArchitecture2,
            caption: 'Plate II — Silent Colonnade, Milan',
            alt: 'Minimalist architectural archways and deep shadows',
            category: 'Monograph',
            exif: 'Leica SL2-S · 35mm Summilux · ISO 100 · 1/500s',
          },
          {
            id: 'gal-3',
            imageUrl: SAMPLE_ASSETS.photoArchitecture3,
            caption: 'Plate III — Kyoto Light Study No. 7',
            alt: 'Geometric shadow study on warm plaster wall',
            category: 'Editorial',
            exif: 'Hasselblad 500C/M · Kodak Portra 400 · 80mm f/2.8',
          },
          {
            id: 'gal-4',
            imageUrl: SAMPLE_ASSETS.projectDesignSystem,
            caption: 'Plate IV — Dieter Rams Archive Study, Frankfurt',
            alt: 'Industrial design object study on travertine stone',
            category: 'Still Life',
            exif: 'Leica M11 Monochrom · 50mm APO · ISO 125',
          },
        ],
      },
      style: { alignment: 'left', width: 'wide', spacing: 'spacious', background: 'default' },
    },
    {
      id: 'ph-about',
      type: 'about',
      title: 'Artist Statement',
      visible: true,
      order: 2,
      data: {
        bio: 'Marcus Vance is an architectural and fine-art photographer splitting time between New York and Tokyo. Working primarily with medium-format digital backs and 120mm film, his work examines how monumental concrete and timber structures shape human solitude and natural light.',
        quickFacts: [
          { id: 'pqf-1', label: 'Representation', value: 'Galerie Vesper (Paris / Tokyo)' },
          { id: 'pqf-2', label: 'Editorial Clients', value: 'Architectural Digest, Wallpaper*, Kinfolk, Cereal' },
          { id: 'pqf-3', label: 'Archival Prints', value: 'Signed museum-grade Hahnemühle Baryta editions' },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'surface' },
    },
    {
      id: 'ph-achievements',
      type: 'achievements',
      title: 'Exhibitions & Honors',
      visible: true,
      order: 3,
      data: {
        items: [
          {
            id: 'ach-1',
            title: 'International Architecture Photography Prize — Laureate',
            issuer: 'Venice Biennale Collateral Exhibition',
            date: '2025',
            description: 'Awarded for the 24-plate monograph "Concrete & Silence: Post-War Japanese Museums".',
            metric: '1st Place Global',
          },
          {
            id: 'ach-2',
            title: 'Solo Exhibition: "Forms of Light"',
            issuer: 'Tokyo Photographic Art Museum (TOP)',
            date: '2024',
            description: 'Eight-week retrospective attended by 42,000+ visitors.',
            metric: '42,000+ Visitors',
          },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
    {
      id: 'ph-contact',
      type: 'contact',
      title: 'Studio & Print Inquiries',
      visible: true,
      order: 4,
      data: {
        email: 'studio@marcusvance.photo',
        phone: '+1 (212) 555-0184',
        location: 'SoHo, New York / Shibuya, Tokyo',
        formEnabled: true,
        socials: [
          { id: 'psoc-1', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
          { id: 'psoc-2', platform: 'behance', label: 'Behance Archive', url: 'https://behance.net' },
          { id: 'psoc-3', platform: 'website', label: 'Print Shop', url: 'https://example.com' },
        ],
      },
      style: { alignment: 'left', width: 'standard', spacing: 'normal', background: 'default' },
    },
  ],
  seo: {
    title: 'Marcus Vance — Architectural & Editorial Photographer',
    description: 'Fine art architectural monograph and editorial photography by Marcus Vance (New York & Tokyo).',
    keywords: ['Architectural Photography', 'Marcus Vance', 'Editorial Photographer', 'Fine Art Prints'],
    ogImage: SAMPLE_ASSETS.photoArchitecture1,
    faviconEmoji: '📷',
    language: 'en',
  },
  settings: {
    showMadeWithFolio: true,
    formEndpoint: '',
    enableContactForm: true,
    customSlug: 'marcus-vance',
    analyticsEnabled: false,
  },
};

export const ALL_SAMPLE_PORTFOLIOS: Portfolio[] = [
  DEVELOPER_SAMPLE_PORTFOLIO,
  DESIGNER_SAMPLE_PORTFOLIO,
  PHOTOGRAPHER_SAMPLE_PORTFOLIO,
];

export function createStarterPortfolioForProfession(
  profession: ProfessionType,
  customName?: string
): Portfolio {
  const baseSample =
    profession === 'Designer'
      ? DESIGNER_SAMPLE_PORTFOLIO
      : profession === 'Photographer'
      ? PHOTOGRAPHER_SAMPLE_PORTFOLIO
      : DEVELOPER_SAMPLE_PORTFOLIO;

  const preset = PROFESSION_PRESETS[profession] || PROFESSION_PRESETS.Developer;
  const palette = COLOR_PALETTES.find((p) => p.id === preset.recommendedPalette) || COLOR_PALETTES[0];

  const cloned: Portfolio = structuredClone(baseSample);
  cloned.id = `folio-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  cloned.profession = profession;
  cloned.name = customName || `${profession} Portfolio`;
  cloned.status = 'draft';
  cloned.updatedAt = new Date().toISOString();
  cloned.layout.templateId = preset.recommendedTemplate;
  cloned.theme = {
    ...cloned.theme,
    paletteId: palette.id,
    mode: palette.mode,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    surface: palette.surface,
    text: palette.text,
    mutedText: palette.mutedText,
    gradient: palette.gradient,
  };

  return cloned;
}
