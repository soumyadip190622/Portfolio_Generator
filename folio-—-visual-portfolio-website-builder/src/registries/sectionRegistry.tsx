import React, { useState } from 'react';
import {
  Portfolio,
  PortfolioSection,
  SectionType,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  CertificateItem,
  AchievementItem,
  ServiceItem,
  GalleryItem,
  TestimonialItem,
  BlogItem,
  SocialLinkItem,
} from '../types/portfolio';
import { AIAssistWidget } from '../components/AIAssistWidget';
import { compressImageFile } from '../utils/storage';
import { SAMPLE_ASSETS } from '../data/samplePortfolios';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Upload,
  Maximize2,
  X,
  Send,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export interface SectionEditorProps {
  section: PortfolioSection<any>;
  portfolio: Portfolio;
  onUpdateSectionData: (newData: any) => void;
  onUpdateSectionMeta: (patch: Partial<PortfolioSection>) => void;
  onUpdateProfile: (patch: Partial<Portfolio['profile']>) => void;
}

export interface SectionRendererProps {
  section: PortfolioSection<any>;
  portfolio: Portfolio;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelectSection?: (sectionId: string) => void;
  onInlineUpdateSection?: (sectionId: string, patch: Partial<PortfolioSection>) => void;
  onInlineUpdateProfile?: (patch: Partial<Portfolio['profile']>) => void;
  variant?: 'default' | 'terminal' | 'editorial' | 'bento' | 'resume' | 'glass' | 'futuristic';
}

export interface SectionRegistryEntry {
  type: SectionType;
  label: string;
  description: string;
  defaultTitle: string;
  defaultData: Record<string, any>;
  Editor: React.FC<SectionEditorProps>;
  Renderer: React.FC<SectionRendererProps>;
}

// Helper for resilient images with fallback
export const ResilientImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}> = ({ src, alt, className = '', onClick }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 p-4 text-center text-xs font-medium ${className}`}
      >
        <span>{alt || 'Portfolio Visual'}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || 'Portfolio Visual'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      onClick={onClick}
      className={className}
    />
  );
};

// ==========================================
// SECTION EDITORS
// ==========================================

const HeroEditor: React.FC<SectionEditorProps> = ({
  section,
  portfolio,
  onUpdateSectionData,
  onUpdateProfile,
}) => {
  const { profile } = portfolio;
  const metrics = Array.isArray(section.data?.metrics) ? section.data.metrics : [];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 500, 500, 0.82);
      onUpdateProfile({ avatarUrl: compressed });
    } catch {
      // ignore error
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onUpdateProfile({ name: e.target.value })}
            placeholder="Alex Rivera"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Kicker / Greeting</label>
          <input
            type="text"
            value={section.data?.greeting || ''}
            onChange={(e) => onUpdateSectionData({ ...section.data, greeting: e.target.value })}
            placeholder="Staff Engineer · Distributed Systems"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-300">Headline / Tagline</label>
          <span className="text-[11px] text-slate-500 tabular-nums">{profile.headline.length}/160</span>
        </div>
        <textarea
          rows={2}
          value={profile.headline}
          onChange={(e) => onUpdateProfile({ headline: e.target.value })}
          placeholder="Building resilient web applications and scalable design systems."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
        />
        <AIAssistWidget
          action="generate_taglines"
          label="Generate Tagline Ideas"
          input={profile.headline}
          profession={portfolio.profession}
          onAcceptText={(text) => onUpdateProfile({ headline: text })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => onUpdateProfile({ location: e.target.value })}
            placeholder="San Francisco, CA"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Availability Notice</label>
          <input
            type="text"
            value={profile.availabilityText}
            onChange={(e) => onUpdateProfile({ availabilityText: e.target.value })}
            placeholder="Open to select roles"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Animated Typing Roles (comma separated)
        </label>
        <input
          type="text"
          value={(profile.typingRoles || []).join(', ')}
          onChange={(e) =>
            onUpdateProfile({
              typingRoles: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="Full-Stack Engineer, Cloud Architect, Open Source Creator"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
        />
      </div>

      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">Avatar Portrait (Auto-Compressed)</span>
          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <ResilientImage
            src={profile.avatarUrl}
            alt={profile.avatarAlt || profile.name}
            className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <input
            type="text"
            value={profile.avatarAlt || ''}
            onChange={(e) => onUpdateProfile({ avatarAlt: e.target.value })}
            placeholder="Avatar Alt Text (for accessibility & SEO)"
            className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-300">Proof Metrics / Highlights</label>
          <button
            type="button"
            onClick={() =>
              onUpdateSectionData({
                ...section.data,
                metrics: [...metrics, { label: 'Projects Shipped', value: '25+' }],
              })
            }
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Metric</span>
          </button>
        </div>
        {metrics.map((m: { label: string; value: string }, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={m.value}
              onChange={(e) => {
                const next = [...metrics];
                next[idx] = { ...next[idx], value: e.target.value };
                onUpdateSectionData({ ...section.data, metrics: next });
              }}
              placeholder="e.g. 99.99%"
              className="w-28 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
            />
            <input
              type="text"
              value={m.label}
              onChange={(e) => {
                const next = [...metrics];
                next[idx] = { ...next[idx], label: e.target.value };
                onUpdateSectionData({ ...section.data, metrics: next });
              }}
              placeholder="Metric label"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={() => {
                const next = metrics.filter((_: any, i: number) => i !== idx);
                onUpdateSectionData({ ...section.data, metrics: next });
              }}
              aria-label={`Remove metric ${m.label}`}
              className="p-1.5 text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutEditor: React.FC<SectionEditorProps> = ({
  section,
  portfolio,
  onUpdateSectionData,
}) => {
  const bio = section.data?.bio || '';
  const quickFacts = Array.isArray(section.data?.quickFacts) ? section.data.quickFacts : [];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-300">Biography / Story</label>
          <span className="text-[11px] text-slate-500 tabular-nums">{bio.length} chars</span>
        </div>
        <textarea
          rows={5}
          value={bio}
          onChange={(e) => onUpdateSectionData({ ...section.data, bio: e.target.value })}
          placeholder="Share your background, philosophy, and what drives your work..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white leading-relaxed"
        />
        <div className="flex flex-wrap gap-2">
          <AIAssistWidget
            action="write_bio"
            label="Write Bio with AI"
            input={bio}
            profession={portfolio.profession}
            onAcceptText={(text) => onUpdateSectionData({ ...section.data, bio: text })}
          />
          <AIAssistWidget
            action="fix_grammar"
            label="Polish & Fix Grammar"
            input={bio}
            profession={portfolio.profession}
            onAcceptText={(text) => onUpdateSectionData({ ...section.data, bio: text })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-300">Quick Facts & Languages</label>
          <button
            type="button"
            onClick={() =>
              onUpdateSectionData({
                ...section.data,
                quickFacts: [
                  ...quickFacts,
                  { id: `qf-${Date.now()}`, label: 'Specialization', value: 'Product Engineering' },
                ],
              })
            }
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fact</span>
          </button>
        </div>
        {quickFacts.map((fact: { id: string; label: string; value: string }, idx: number) => (
          <div key={fact.id || idx} className="flex items-center gap-2">
            <input
              type="text"
              value={fact.label}
              onChange={(e) => {
                const next = [...quickFacts];
                next[idx] = { ...next[idx], label: e.target.value };
                onUpdateSectionData({ ...section.data, quickFacts: next });
              }}
              placeholder="Label (e.g. Languages)"
              className="w-1/3 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              value={fact.value}
              onChange={(e) => {
                const next = [...quickFacts];
                next[idx] = { ...next[idx], value: e.target.value };
                onUpdateSectionData({ ...section.data, quickFacts: next });
              }}
              placeholder="Value (e.g. English, Bengali)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={() => {
                const next = quickFacts.filter((_: any, i: number) => i !== idx);
                onUpdateSectionData({ ...section.data, quickFacts: next });
              }}
              aria-label={`Delete fact ${fact.label}`}
              className="p-1.5 text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsEditor: React.FC<SectionEditorProps> = ({
  section,
  portfolio,
  onUpdateSectionData,
}) => {
  const items: SkillItem[] = Array.isArray(section.data?.items) ? section.data.items : [];

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [removed] = next.splice(idx, 1);
    next.splice(target, 0, removed);
    onUpdateSectionData({ ...section.data, items: next });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AIAssistWidget
          action="suggest_skills"
          label="Suggest Skills for My Profession"
          input={items.map((i) => i.name).join(', ')}
          profession={portfolio.profession}
          onAcceptSkills={(suggested) => {
            const existingNames = new Set(items.map((s) => s.name.toLowerCase()));
            const newItems: SkillItem[] = suggested
              .filter((name) => !existingNames.has(name.toLowerCase()))
              .map((name, i) => ({
                id: `sk-${Date.now()}-${i}`,
                name,
                category: 'Core Capabilities',
                level: 88,
              }));
            onUpdateSectionData({ ...section.data, items: [...items, ...newItems] });
          }}
        />
        <button
          type="button"
          onClick={() =>
            onUpdateSectionData({
              ...section.data,
              items: [
                ...items,
                {
                  id: `sk-${Date.now()}`,
                  name: 'New Skill',
                  category: 'Frontend',
                  level: 85,
                },
              ],
            })
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {items.map((skill, idx) => (
          <div
            key={skill.id || idx}
            className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...skill, name: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Skill name (e.g. TypeScript)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
              />
              <input
                type="text"
                value={skill.category}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...skill, category: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Category (e.g. Backend)"
                className="w-36 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300"
              />
              <button
                type="button"
                onClick={() => moveItem(idx, -1)}
                aria-label={`Move ${skill.name} up`}
                className="p-1 text-slate-500 hover:text-slate-200"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(idx, 1)}
                aria-label={`Move ${skill.name} down`}
                className="p-1 text-slate-500 hover:text-slate-200"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = items.filter((_, i) => i !== idx);
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                aria-label={`Delete skill ${skill.name}`}
                className="p-1 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 w-20">Proficiency:</span>
              <input
                type="range"
                min={20}
                max={100}
                value={skill.level || 85}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...skill, level: Number(e.target.value) };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                className="flex-1 accent-blue-500"
              />
              <span className="text-xs font-mono text-slate-300 w-9 text-right tabular-nums">
                {skill.level || 85}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsEditor: React.FC<SectionEditorProps> = ({
  section,
  portfolio,
  onUpdateSectionData,
}) => {
  const items: ProjectItem[] = Array.isArray(section.data?.items) ? section.data.items : [];

  const handleProjectImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 900, 600, 0.8);
      const next = [...items];
      next[idx] = { ...next[idx], coverImage: compressed };
      onUpdateSectionData({ ...section.data, items: next });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{items.length} project case studies</span>
        <button
          type="button"
          onClick={() =>
            onUpdateSectionData({
              ...section.data,
              items: [
                ...items,
                {
                  id: `proj-${Date.now()}`,
                  title: 'New Flagship Project',
                  description: 'Engineered a scalable web platform with real-time state sync and accessible UI.',
                  tags: ['TypeScript', 'React', 'Tailwind'],
                  coverImage: SAMPLE_ASSETS.projectCloud,
                  coverAlt: 'Project cover preview',
                  liveUrl: 'https://example.com',
                  githubUrl: 'https://github.com',
                  featured: true,
                  category: 'Web Application',
                  metrics: '+40% conversion lift',
                },
              ],
            })
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={proj.title}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...proj, title: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Project Title"
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-semibold text-white"
              />
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(proj.featured)}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...proj, featured: e.target.checked };
                    onUpdateSectionData({ ...section.data, items: next });
                  }}
                />
                <span>Featured</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const next = items.filter((_, i) => i !== idx);
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                aria-label={`Delete project ${proj.title}`}
                className="p-1.5 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <textarea
              rows={2}
              value={proj.description}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...proj, description: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Describe the problem, architecture, and measurable outcome..."
              className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-200"
            />

            <AIAssistWidget
              action="project_description"
              label="Generate / Improve Project Description"
              input={proj.title}
              context={(proj.tags || []).join(', ')}
              profession={portfolio.profession}
              onAcceptText={(text) => {
                const next = [...items];
                next[idx] = { ...proj, description: text };
                onUpdateSectionData({ ...section.data, items: next });
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={(proj.tags || []).join(', ')}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = {
                    ...proj,
                    tags: e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Tech tags (comma separated)"
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                value={proj.metrics || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...proj, metrics: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Outcome metric (e.g. -64% p99 latency)"
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="url"
                value={proj.liveUrl}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...proj, liveUrl: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Live Demo URL"
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <input
                type="url"
                value={proj.githubUrl}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...proj, githubUrl: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="GitHub / Source URL"
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Cover Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProjectImage(idx, e)}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                value={proj.coverAlt || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...proj, coverAlt: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Image Alt Text"
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExperienceEditor: React.FC<SectionEditorProps> = ({
  section,
  portfolio,
  onUpdateSectionData,
}) => {
  const items: ExperienceItem[] = Array.isArray(section.data?.items) ? section.data.items : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{items.length} roles listed</span>
        <button
          type="button"
          onClick={() =>
            onUpdateSectionData({
              ...section.data,
              items: [
                ...items,
                {
                  id: `exp-${Date.now()}`,
                  role: 'Senior Engineer',
                  company: 'Acme Corp',
                  startDate: '2024',
                  endDate: 'Present',
                  current: true,
                  location: 'Remote',
                  bullets: ['Led architecture and delivery of flagship customer portal.'],
                },
              ],
            })
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {items.map((exp, idx) => (
        <div key={exp.id || idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={exp.role}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...exp, role: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Role / Title"
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-semibold text-white"
            />
            <input
              type="text"
              value={exp.company}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...exp, company: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Company"
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={() => {
                const next = items.filter((_, i) => i !== idx);
                onUpdateSectionData({ ...section.data, items: next });
              }}
              aria-label={`Remove experience ${exp.role}`}
              className="p-1 text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={exp.startDate}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...exp, startDate: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Start (e.g. 2022)"
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
            />
            <input
              type="text"
              value={exp.endDate}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...exp, endDate: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="End (or Present)"
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
            />
            <input
              type="text"
              value={exp.location}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...exp, location: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Location"
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Impact Bullet Points (one per line)
            </label>
            <textarea
              rows={3}
              value={(exp.bullets || []).join('\n')}
              onChange={(e) => {
                const next = [...items];
                next[idx] = {
                  ...exp,
                  bullets: e.target.value.split('\n').filter((b) => b.trim() !== ''),
                };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
            />
            <AIAssistWidget
              action="improve_description"
              label="Elevate Bullet Points with AI"
              input={(exp.bullets || []).join(' ')}
              profession={portfolio.profession}
              onAcceptText={(text) => {
                const next = [...items];
                next[idx] = { ...exp, bullets: [text] };
                onUpdateSectionData({ ...section.data, items: next });
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const EducationEditor: React.FC<SectionEditorProps> = ({ section, onUpdateSectionData }) => {
  const items: EducationItem[] = Array.isArray(section.data?.items) ? section.data.items : [];
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            onUpdateSectionData({
              ...section.data,
              items: [
                ...items,
                {
                  id: `edu-${Date.now()}`,
                  institute: 'University of Technology',
                  degree: 'B.S. in Computer Science',
                  startDate: '2018',
                  endDate: '2022',
                  grade: 'First Class Honors',
                },
              ],
            })
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>
      {items.map((edu, idx) => (
        <div key={edu.id || idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={edu.institute}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...edu, institute: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="University / Institution"
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={() => {
                const next = items.filter((_, i) => i !== idx);
                onUpdateSectionData({ ...section.data, items: next });
              }}
              aria-label={`Remove education ${edu.institute}`}
              className="p-1 text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={edu.degree}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...edu, degree: e.target.value };
              onUpdateSectionData({ ...section.data, items: next });
            }}
            placeholder="Degree & Major"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={edu.startDate}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...edu, startDate: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Start Year"
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
            />
            <input
              type="text"
              value={edu.endDate}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...edu, endDate: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="End Year"
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
            />
            <input
              type="text"
              value={edu.grade}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...edu, grade: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="GPA / Honors"
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const GenericListEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdateSectionData,
}) => {
  const items: any[] = Array.isArray(section.data?.items) ? section.data.items : [];

  const handleAddItem = () => {
    const newItem: Record<string, any> = { id: `item-${Date.now()}` };
    if (section.type === 'certificates') {
      Object.assign(newItem, { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2025', url: 'https://aws.amazon.com' });
    } else if (section.type === 'achievements') {
      Object.assign(newItem, { title: 'Global Hackathon Winner', issuer: 'ETHGlobal', date: '2025', description: '1st place among 400+ teams.', metric: '1st Place' });
    } else if (section.type === 'services') {
      Object.assign(newItem, { title: '01. Product & Architecture Consulting', description: 'End-to-end technical design, code review, and UI system delivery.', icon: 'layers', price: 'From $4,500' });
    } else if (section.type === 'gallery') {
      Object.assign(newItem, { imageUrl: SAMPLE_ASSETS.photoArchitecture1, caption: 'Architectural Study Plate', alt: 'Architectural study', category: 'Monograph', exif: '50mm f/2.8 · ISO 100' });
    } else if (section.type === 'testimonials') {
      Object.assign(newItem, { name: 'Sarah Jenkins', role: 'VP of Product', company: 'Veloce Inc.', quote: 'Delivered ahead of schedule with extraordinary attention to typography and system reliability.' });
    } else if (section.type === 'blog') {
      Object.assign(newItem, { title: 'Notes on Building Resilient Interfaces', date: 'October 2026', readTime: '5 min read', summary: 'Why deterministic state and clean typography matter more than ever.', content: 'Full article markdown content...' });
    }
    onUpdateSectionData({ ...section.data, items: [...items, newItem] });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{items.length} entries</span>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Entry</span>
        </button>
      </div>

      {items.map((item, idx) => (
        <div key={item.id || idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={item.title || item.name || item.caption || ''}
              onChange={(e) => {
                const next = [...items];
                const key = 'title' in item ? 'title' : 'name' in item ? 'name' : 'caption';
                next[idx] = { ...item, [key]: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Title / Name / Caption"
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-medium text-white"
            />
            <button
              type="button"
              onClick={() => {
                const next = items.filter((_, i) => i !== idx);
                onUpdateSectionData({ ...section.data, items: next });
              }}
              aria-label="Delete item"
              className="p-1 text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {(section.type === 'services' ||
            section.type === 'achievements' ||
            section.type === 'testimonials' ||
            section.type === 'blog') && (
            <textarea
              rows={2}
              value={item.description || item.quote || item.summary || ''}
              onChange={(e) => {
                const next = [...items];
                const key =
                  section.type === 'testimonials'
                    ? 'quote'
                    : section.type === 'blog'
                    ? 'summary'
                    : 'description';
                next[idx] = { ...item, [key]: e.target.value };
                onUpdateSectionData({ ...section.data, items: next });
              }}
              placeholder="Description / Quote / Summary"
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
            />
          )}

          {section.type === 'gallery' && (
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Plate</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const dataUrl = await compressImageFile(file, 1000, 800, 0.82);
                    const next = [...items];
                    next[idx] = { ...item, imageUrl: dataUrl };
                    onUpdateSectionData({ ...section.data, items: next });
                  }}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                value={item.exif || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...item, exif: e.target.value };
                  onUpdateSectionData({ ...section.data, items: next });
                }}
                placeholder="Camera / EXIF Metadata"
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ContactEditor: React.FC<SectionEditorProps> = ({
  section,
  portfolio,
  onUpdateSectionData,
  onUpdateProfile,
}) => {
  const socials: SocialLinkItem[] = Array.isArray(section.data?.socials) ? section.data.socials : [];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs text-slate-300 mb-1">Contact Email</label>
          <input
            type="email"
            value={section.data?.email ?? portfolio.profile.email}
            onChange={(e) => {
              onUpdateSectionData({ ...section.data, email: e.target.value });
              onUpdateProfile({ email: e.target.value });
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300 mb-1">Phone / WhatsApp</label>
          <input
            type="text"
            value={section.data?.phone ?? portfolio.profile.phone}
            onChange={(e) => {
              onUpdateSectionData({ ...section.data, phone: e.target.value });
              onUpdateProfile({ phone: e.target.value });
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          checked={section.data?.formEnabled !== false}
          onChange={(e) => onUpdateSectionData({ ...section.data, formEnabled: e.target.checked })}
        />
        <span>Display interactive contact form in portfolio</span>
      </label>

      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">Social Profiles</span>
          <button
            type="button"
            onClick={() =>
              onUpdateSectionData({
                ...section.data,
                socials: [
                  ...socials,
                  { id: `soc-${Date.now()}`, platform: 'github', label: 'GitHub', url: 'https://github.com' },
                ],
              })
            }
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>
        {socials.map((soc, idx) => (
          <div key={soc.id || idx} className="flex items-center gap-2">
            <input
              type="text"
              value={soc.label}
              onChange={(e) => {
                const next = [...socials];
                next[idx] = { ...soc, label: e.target.value };
                onUpdateSectionData({ ...section.data, socials: next });
              }}
              placeholder="Platform (e.g. LinkedIn)"
              className="w-28 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
            />
            <input
              type="url"
              value={soc.url}
              onChange={(e) => {
                const next = [...socials];
                next[idx] = { ...soc, url: e.target.value };
                onUpdateSectionData({ ...section.data, socials: next });
              }}
              placeholder="https://..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
            />
            <button
              type="button"
              onClick={() => {
                const next = socials.filter((_, i) => i !== idx);
                onUpdateSectionData({ ...section.data, socials: next });
              }}
              aria-label={`Remove social link ${soc.label}`}
              className="p-1 text-slate-500 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomTextEditor: React.FC<SectionEditorProps> = ({
  section,
  portfolio,
  onUpdateSectionData,
}) => {
  const content = section.data?.content || '';
  return (
    <div className="space-y-3">
      <label className="block text-xs text-slate-300">Custom Markdown / Prose Block</label>
      <textarea
        rows={5}
        value={content}
        onChange={(e) => onUpdateSectionData({ ...section.data, content: e.target.value })}
        placeholder="Write any custom announcement, speaking schedule, research abstract, or open-source manifesto..."
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white"
      />
      <AIAssistWidget
        action="improve_description"
        label="Refine Custom Text with AI"
        input={content}
        profession={portfolio.profession}
        onAcceptText={(text) => onUpdateSectionData({ ...section.data, content: text })}
      />
    </div>
  );
};

// ==========================================
// SECTION RENDERERS (Live Preview & Export)
// ==========================================

const SectionWrapper: React.FC<{
  section: PortfolioSection;
  portfolio: Portfolio;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelectSection?: (id: string) => void;
  onInlineUpdateSection?: (id: string, patch: Partial<PortfolioSection>) => void;
  hideHeader?: boolean;
  children: React.ReactNode;
}> = ({
  section,
  portfolio,
  isEditable,
  isSelected,
  onSelectSection,
  onInlineUpdateSection,
  hideHeader,
  children,
}) => {
  const spacingMap = {
    compact: 'py-8 md:py-10',
    normal: 'py-12 md:py-16',
    spacious: 'py-16 md:py-24',
  };
  const widthMap = {
    narrow: 'max-w-3xl',
    standard: 'max-w-5xl',
    wide: 'max-w-6xl',
    full: 'max-w-7xl',
  };

  const bgStyle: React.CSSProperties =
    section.style?.background === 'surface'
      ? { backgroundColor: portfolio.theme.surface }
      : section.style?.background === 'gradient'
      ? { backgroundImage: portfolio.theme.gradient }
      : {};

  return (
    <section
      id={section.type}
      data-section-id={section.id}
      onClick={(e) => {
        if (isEditable && onSelectSection) {
          e.stopPropagation();
          onSelectSection(section.id);
        }
      }}
      style={bgStyle}
      className={`relative transition-all ${spacingMap[section.style?.spacing || 'normal']} ${
        isEditable ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-blue-500/50' : ''
      } ${isSelected && isEditable ? 'outline outline-2 outline-blue-500/80' : ''}`}
    >
      {isEditable && isSelected && (
        <div className="absolute top-2 right-3 z-20 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600 text-white shadow">
          Editing: {section.title} (Click text to edit inline)
        </div>
      )}
      <div
        className={`mx-auto px-6 ${widthMap[section.style?.width || portfolio.layout.containerWidth || 'standard']} ${
          section.style?.alignment === 'center' ? 'text-center' : 'text-left'
        }`}
      >
        {!hideHeader && section.title && (
          <div className="mb-8 md:mb-10">
            <h2
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditable && onInlineUpdateSection) {
                  onInlineUpdateSection(section.id, { title: e.currentTarget.textContent || section.title });
                }
              }}
              style={{ fontFamily: portfolio.theme.headingFont, color: portfolio.theme.text }}
              className="text-2xl md:text-3xl font-bold tracking-tight outline-none focus:ring-1 focus:ring-blue-500/50 rounded"
            >
              {section.title}
            </h2>
            {section.subtitle && (
              <p
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (isEditable && onInlineUpdateSection) {
                    onInlineUpdateSection(section.id, { subtitle: e.currentTarget.textContent || '' });
                  }
                }}
                style={{ color: portfolio.theme.mutedText }}
                className="mt-2 text-sm md:text-base max-w-2xl outline-none focus:ring-1 focus:ring-blue-500/50 rounded"
              >
                {section.subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

const HeroRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio, isEditable, onInlineUpdateProfile } = props;
  const { profile, theme, layout } = portfolio;
  const metrics = Array.isArray(section.data?.metrics) ? section.data.metrics : [];

  return (
    <SectionWrapper {...props} hideHeader>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className={layout.heroStyle.showAvatar && profile.avatarUrl ? 'lg:col-span-8 space-y-5' : 'lg:col-span-12 space-y-5'}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium" style={{ color: theme.primary }}>
            <span>{section.data?.greeting || portfolio.profession}</span>
            {profile.availableForWork && profile.availabilityText && (
              <>
                <span aria-hidden="true">·</span>
                <span style={{ color: theme.mutedText }}>{profile.availabilityText}</span>
              </>
            )}
          </div>

          <h1
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditable && onInlineUpdateProfile) {
                onInlineUpdateProfile({ name: e.currentTarget.textContent || profile.name });
              }
            }}
            style={{ fontFamily: theme.headingFont, color: theme.text }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] outline-none focus:ring-1 focus:ring-blue-500/50 rounded"
          >
            {profile.name}
          </h1>

          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditable && onInlineUpdateProfile) {
                onInlineUpdateProfile({ headline: e.currentTarget.textContent || profile.headline });
              }
            }}
            style={{ color: theme.mutedText }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl outline-none focus:ring-1 focus:ring-blue-500/50 rounded"
          >
            {profile.headline}
          </p>

          {layout.heroStyle.typingAnimation && Array.isArray(profile.typingRoles) && profile.typingRoles.length > 0 && (
            <p className="text-xs font-mono" style={{ color: theme.secondary, fontFamily: theme.monoFont }}>
              {profile.typingRoles.join('  /  ')}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={layout.heroStyle.primaryCtaTarget || '#projects'}
              style={{
                backgroundColor: theme.primary,
                color: '#FFFFFF',
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-transform active:scale-95 whitespace-nowrap shrink-0"
            >
              {layout.heroStyle.primaryCtaText || 'View Selected Work'}
            </a>
            <a
              href={layout.heroStyle.secondaryCtaTarget || '#contact'}
              style={{
                borderColor: `${theme.mutedText}40`,
                color: theme.text,
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium border rounded-lg hover:opacity-85 transition-opacity whitespace-nowrap shrink-0"
            >
              {layout.heroStyle.secondaryCtaText || 'Get in Touch'}
            </a>
          </div>
        </div>

        {layout.heroStyle.showAvatar && profile.avatarUrl && (
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <ResilientImage
              src={profile.avatarUrl}
              alt={profile.avatarAlt || profile.name}
              className={`w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-cover border ${
                layout.heroStyle.avatarShape === 'circle'
                  ? 'rounded-full'
                  : layout.heroStyle.avatarShape === 'square'
                  ? 'rounded-none'
                  : 'rounded-2xl'
              }`}
            />
          </div>
        )}
      </div>

      {metrics.length > 0 && (
        <div
          style={{ borderColor: `${theme.mutedText}25` }}
          className="mt-10 pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {metrics.map((m: { label: string; value: string }, i: number) => (
            <div key={i}>
              <div
                style={{ color: theme.text, fontFamily: theme.monoFont }}
                className="text-2xl sm:text-3xl font-bold tabular-nums"
              >
                {m.value}
              </div>
              <div style={{ color: theme.mutedText }} className="text-xs mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

const AboutRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio, isEditable, onInlineUpdateSection } = props;
  const { theme } = portfolio;
  const quickFacts = Array.isArray(section.data?.quickFacts) ? section.data.quickFacts : [];

  return (
    <SectionWrapper {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditable && onInlineUpdateSection) {
                onInlineUpdateSection(section.id, {
                  data: { ...section.data, bio: e.currentTarget.textContent || '' },
                });
              }
            }}
            style={{ color: theme.text }}
            className="text-sm sm:text-base leading-relaxed whitespace-pre-line outline-none focus:ring-1 focus:ring-blue-500/50 rounded"
          >
            {section.data?.bio}
          </p>
        </div>
        {quickFacts.length > 0 && (
          <div
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}20` }}
            className="lg:col-span-5 p-5 rounded-xl border space-y-3"
          >
            {quickFacts.map((qf: { id: string; label: string; value: string }, idx: number) => (
              <div
                key={qf.id || idx}
                style={{ borderColor: `${theme.mutedText}15` }}
                className="pb-2.5 last:pb-0 border-b last:border-b-0 flex flex-col sm:flex-row sm:justify-between gap-1 text-xs"
              >
                <span style={{ color: theme.mutedText }}>{qf.label}</span>
                <span style={{ color: theme.text }} className="font-medium sm:text-right">
                  {qf.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

const SkillsRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  const { theme } = portfolio;
  const items: SkillItem[] = Array.isArray(section.data?.items) ? section.data.items : [];

  const grouped = items.reduce<Record<string, SkillItem[]>>((acc, item) => {
    const cat = item.category || 'Capabilities';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <SectionWrapper {...props}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([category, groupItems]) => (
          <div
            key={category}
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}20` }}
            className="p-5 rounded-xl border space-y-4"
          >
            <h3 style={{ color: theme.text, fontFamily: theme.headingFont }} className="text-sm font-semibold">
              {category}
            </h3>
            <div className="space-y-3">
              {groupItems.map((sk) => (
                <div key={sk.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: theme.text }} className="font-medium">
                      {sk.name}
                    </span>
                    <span
                      style={{ color: theme.mutedText, fontFamily: theme.monoFont }}
                      className="tabular-nums"
                    >
                      {sk.level}%
                    </span>
                  </div>
                  <div
                    style={{ backgroundColor: `${theme.mutedText}20` }}
                    className="w-full h-1.5 rounded-full overflow-hidden"
                  >
                    <div
                      style={{ width: `${sk.level}%`, backgroundColor: theme.primary }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

const ProjectsRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  const { theme } = portfolio;
  const items: ProjectItem[] = Array.isArray(section.data?.items) ? section.data.items : [];
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const filtered = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter);

  return (
    <SectionWrapper {...props}>
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(cat);
              }}
              style={{
                backgroundColor: activeFilter === cat ? theme.primary : theme.surface,
                color: activeFilter === cat ? '#FFFFFF' : theme.mutedText,
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => (
          <article
            key={proj.id}
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}22` }}
            className="rounded-xl border overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div>
              {proj.coverImage && (
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <ResilientImage
                    src={proj.coverImage}
                    alt={proj.coverAlt || proj.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs" style={{ color: theme.mutedText }}>
                  <span>{proj.category || 'Case Study'}</span>
                  {proj.metrics && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span style={{ color: theme.primary }} className="font-medium tabular-nums">
                        {proj.metrics}
                      </span>
                    </>
                  )}
                </div>

                <h3
                  style={{ color: theme.text, fontFamily: theme.headingFont }}
                  className="text-lg font-bold tracking-tight"
                >
                  {proj.title}
                </h3>

                <p style={{ color: theme.mutedText }} className="text-xs sm:text-sm leading-relaxed">
                  {proj.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 space-y-3">
              {Array.isArray(proj.tags) && proj.tags.length > 0 && (
                <div className="text-xs" style={{ color: theme.mutedText, fontFamily: theme.monoFont }}>
                  {proj.tags.join(' · ')}
                </div>
              )}

              <div className="flex items-center gap-4 pt-1 text-xs font-medium">
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: theme.primary }}
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Live Project</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: theme.text }}
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Source Code</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
};

const ExperienceRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  const { theme } = portfolio;
  const items: ExperienceItem[] = Array.isArray(section.data?.items) ? section.data.items : [];

  return (
    <SectionWrapper {...props}>
      <div className="space-y-6">
        {items.map((exp, idx) => (
          <div
            key={exp.id || idx}
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}20` }}
            className="p-5 rounded-xl border space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 style={{ color: theme.text, fontFamily: theme.headingFont }} className="text-base font-bold">
                  {exp.role}
                </h3>
                <div className="text-xs flex items-center gap-2" style={{ color: theme.primary }}>
                  <span className="font-medium">{exp.company}</span>
                  {exp.location && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span style={{ color: theme.mutedText }}>{exp.location}</span>
                    </>
                  )}
                </div>
              </div>
              <div
                style={{ color: theme.mutedText, fontFamily: theme.monoFont }}
                className="text-xs tabular-nums shrink-0"
              >
                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
              </div>
            </div>

            {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
              <ul className="space-y-1.5 pt-1 text-xs sm:text-sm list-disc list-inside" style={{ color: theme.mutedText }}>
                {exp.bullets.map((b, i) => (
                  <li key={i} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

const EducationRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  const { theme } = portfolio;
  const items: EducationItem[] = Array.isArray(section.data?.items) ? section.data.items : [];

  return (
    <SectionWrapper {...props}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((edu, idx) => (
          <div
            key={edu.id || idx}
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}20` }}
            className="p-5 rounded-xl border space-y-1.5"
          >
            <div
              style={{ color: theme.mutedText, fontFamily: theme.monoFont }}
              className="text-xs tabular-nums"
            >
              {edu.startDate} — {edu.endDate}
            </div>
            <h3 style={{ color: theme.text, fontFamily: theme.headingFont }} className="text-base font-bold">
              {edu.degree}
            </h3>
            <div className="text-xs flex items-center gap-2" style={{ color: theme.mutedText }}>
              <span>{edu.institute}</span>
              {edu.grade && (
                <>
                  <span aria-hidden="true">·</span>
                  <span style={{ color: theme.primary }}>{edu.grade}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

const GalleryRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  const { theme } = portfolio;
  const items: GalleryItem[] = Array.isArray(section.data?.items) ? section.data.items : [];
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  return (
    <SectionWrapper {...props}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <figure
            key={item.id || idx}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxItem(item);
            }}
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}20` }}
            className="group rounded-xl border overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              <ResilientImage
                src={item.imageUrl}
                alt={item.alt || item.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <figcaption className="p-4 space-y-1">
              <div className="text-xs font-semibold" style={{ color: theme.text }}>
                {item.caption}
              </div>
              {item.exif && (
                <div
                  className="text-[11px] font-mono"
                  style={{ color: theme.mutedText, fontFamily: theme.monoFont }}
                >
                  {item.exif}
                </div>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {lightboxItem && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setLightboxItem(null);
          }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">{lightboxItem.caption}</h4>
                {lightboxItem.exif && (
                  <p className="text-xs font-mono text-slate-400">{lightboxItem.exif}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close Lightbox"
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black p-4">
              <ResilientImage
                src={lightboxItem.imageUrl}
                alt={lightboxItem.alt || lightboxItem.caption}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

const GenericCardsRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  const { theme } = portfolio;
  const items: any[] = Array.isArray(section.data?.items) ? section.data.items : [];

  return (
    <SectionWrapper {...props}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}20` }}
            className="p-5 rounded-xl border space-y-2"
          >
            <div className="flex items-center justify-between gap-2 text-xs" style={{ color: theme.mutedText }}>
              <span>{item.issuer || item.company || item.date || item.role || section.title}</span>
              {(item.price || item.metric || item.readTime) && (
                <span style={{ color: theme.primary, fontFamily: theme.monoFont }} className="font-semibold">
                  {item.price || item.metric || item.readTime}
                </span>
              )}
            </div>
            <h3 style={{ color: theme.text, fontFamily: theme.headingFont }} className="text-base font-bold">
              {item.title || item.name}
            </h3>
            {(item.description || item.quote || item.summary) && (
              <p style={{ color: theme.mutedText }} className="text-xs sm:text-sm leading-relaxed">
                {section.type === 'testimonials' ? `"${item.quote}"` : item.description || item.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

const ContactRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  const { theme, profile } = portfolio;
  const [submitted, setSubmitted] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const socials: SocialLinkItem[] = Array.isArray(section.data?.socials) ? section.data.socials : [];
  const email = section.data?.email || profile.email;
  const phone = section.data?.phone || profile.phone;
  const location = section.data?.location || profile.location;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SectionWrapper {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3 text-xs sm:text-sm">
            {email && (
              <a
                href={`mailto:${email}`}
                style={{ color: theme.text }}
                className="flex items-center gap-2.5 hover:underline"
              >
                <Mail className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
                <span>{email}</span>
              </a>
            )}
            {phone && (
              <div style={{ color: theme.mutedText }} className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
                <span>{phone}</span>
              </div>
            )}
            {location && (
              <div style={{ color: theme.mutedText }} className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
                <span>{location}</span>
              </div>
            )}
          </div>

          {socials.length > 0 && (
            <div className="pt-3">
              <div className="text-xs mb-2" style={{ color: theme.mutedText }}>
                Elsewhere on the web
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {socials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: theme.primary }}
                    className="hover:underline"
                  >
                    {soc.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {section.data?.formEnabled !== false && (
          <div
            style={{ backgroundColor: theme.surface, borderColor: `${theme.mutedText}25` }}
            className="lg:col-span-7 p-6 rounded-xl border"
          >
            {submitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" style={{ color: theme.primary }} />
                <h4 style={{ color: theme.text }} className="text-sm font-semibold">
                  Message Prepared for {profile.name}
                </h4>
                <p style={{ color: theme.mutedText }} className="text-xs">
                  Thank you, {senderName || 'friend'}! Your inquiry has been logged.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSenderName('');
                    setSenderEmail('');
                    setMessage('');
                  }}
                  style={{ color: theme.primary }}
                  className="text-xs underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: theme.mutedText }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Jane Doe"
                      style={{
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: `${theme.mutedText}30`,
                      }}
                      className="w-full border rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: theme.mutedText }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="jane@company.com"
                      style={{
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: `${theme.mutedText}30`,
                      }}
                      className="w-full border rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: theme.mutedText }}>
                    Project or Role Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello, I would love to discuss..."
                    style={{
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: `${theme.mutedText}30`,
                    }}
                    className="w-full border rounded-lg p-3 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

const CustomTextRenderer: React.FC<SectionRendererProps> = (props) => {
  const { section, portfolio } = props;
  return (
    <SectionWrapper {...props}>
      <div
        style={{ backgroundColor: portfolio.theme.surface, borderColor: `${portfolio.theme.mutedText}20`, color: portfolio.theme.text }}
        className="p-6 rounded-xl border text-sm leading-relaxed whitespace-pre-line"
      >
        {section.data?.content || 'Custom block content.'}
      </div>
    </SectionWrapper>
  );
};

const ResumeRenderer: React.FC<SectionRendererProps> = (props) => {
  const { portfolio } = props;
  return (
    <SectionWrapper {...props}>
      <div
        style={{ backgroundColor: portfolio.theme.surface, borderColor: `${portfolio.theme.mutedText}25` }}
        className="p-6 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h3 style={{ color: portfolio.theme.text }} className="text-base font-bold">
            Curriculum Vitae & Complete Work History
          </h3>
          <p style={{ color: portfolio.theme.mutedText }} className="text-xs">
            Download a print-ready copy of {portfolio.profile.name}&apos;s resume or print directly from the browser.
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.print();
          }}
          style={{ backgroundColor: portfolio.theme.primary, color: '#FFFFFF' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Print / Save PDF Resume</span>
        </button>
      </div>
    </SectionWrapper>
  );
};

// ==========================================
// EXPORT SECTION REGISTRY MAP
// ==========================================

export const SECTION_REGISTRY: Record<SectionType, SectionRegistryEntry> = {
  hero: {
    type: 'hero',
    label: 'Hero & Personal Intro',
    description: 'Headline, avatar, animated typing roles, primary CTAs, and proof metrics.',
    defaultTitle: 'Introduction',
    defaultData: {
      greeting: 'Welcome',
      metrics: [{ label: 'Years Experience', value: '5+ yrs' }],
    },
    Editor: HeroEditor,
    Renderer: HeroRenderer,
  },
  about: {
    type: 'about',
    label: 'About & Quick Facts',
    description: 'Narrative biography, quick facts, and spoken languages.',
    defaultTitle: 'About Me',
    defaultData: {
      bio: 'Focused on crafting reliable digital products and thoughtful interfaces.',
      quickFacts: [{ id: 'qf-1', label: 'Location', value: 'Remote / Global' }],
    },
    Editor: AboutEditor,
    Renderer: AboutRenderer,
  },
  skills: {
    type: 'skills',
    label: 'Skills & Capabilities',
    description: 'Categorized technical and creative skills with proficiency indicators.',
    defaultTitle: 'Skills & Expertise',
    defaultData: {
      items: [
        { id: 'sk-1', name: 'TypeScript', category: 'Engineering', level: 92 },
        { id: 'sk-2', name: 'System Design', category: 'Architecture', level: 88 },
      ],
    },
    Editor: SkillsEditor,
    Renderer: SkillsRenderer,
  },
  projects: {
    type: 'projects',
    label: 'Projects & Case Studies',
    description: 'Featured work with cover visuals, tags, metrics, and live links.',
    defaultTitle: 'Selected Projects',
    defaultData: {
      items: [
        {
          id: 'proj-default',
          title: 'Flagship Platform Architecture',
          description: 'Built a modern full-stack application serving thousands of daily users.',
          tags: ['TypeScript', 'React', 'Cloud'],
          coverImage: SAMPLE_ASSETS.projectCloud,
          coverAlt: 'Flagship Platform',
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com',
          featured: true,
          category: 'Web App',
          metrics: '99.98% Uptime',
        },
      ],
    },
    Editor: ProjectsEditor,
    Renderer: ProjectsRenderer,
  },
  experience: {
    type: 'experience',
    label: 'Work Experience',
    description: 'Chronological career history with roles, dates, and impact bullets.',
    defaultTitle: 'Experience',
    defaultData: {
      items: [
        {
          id: 'exp-default',
          role: 'Senior Product Engineer',
          company: 'Tech Studio',
          startDate: '2023',
          endDate: 'Present',
          current: true,
          location: 'San Francisco, CA',
          bullets: ['Spearheaded core architecture and mentored engineering squad.'],
        },
      ],
    },
    Editor: ExperienceEditor,
    Renderer: ExperienceRenderer,
  },
  education: {
    type: 'education',
    label: 'Education',
    description: 'Academic degrees, universities, graduation years, and honors.',
    defaultTitle: 'Education',
    defaultData: {
      items: [
        {
          id: 'edu-default',
          institute: 'State University',
          degree: 'B.S. in Computer Science',
          startDate: '2018',
          endDate: '2022',
          grade: 'Honors',
        },
      ],
    },
    Editor: EducationEditor,
    Renderer: EducationRenderer,
  },
  certificates: {
    type: 'certificates',
    label: 'Certifications',
    description: 'Verified industry credentials and licenses.',
    defaultTitle: 'Certifications',
    defaultData: {
      items: [
        {
          id: 'cert-1',
          title: 'Cloud Solutions Architect Professional',
          issuer: 'Google Cloud',
          date: '2025',
          url: 'https://cloud.google.com',
        },
      ],
    },
    Editor: GenericListEditor,
    Renderer: GenericCardsRenderer,
  },
  achievements: {
    type: 'achievements',
    label: 'Achievements & Awards',
    description: 'Honors, competitions, grants, and exhibitions.',
    defaultTitle: 'Honors & Achievements',
    defaultData: {
      items: [
        {
          id: 'ach-1',
          title: 'Best Developer Tooling Award',
          issuer: 'Open Source Summit',
          date: '2025',
          description: 'Recognized for contributions to web performance tooling.',
          metric: '1st Place',
        },
      ],
    },
    Editor: GenericListEditor,
    Renderer: GenericCardsRenderer,
  },
  services: {
    type: 'services',
    label: 'Services & Offerings',
    description: 'Freelance packages, consulting retainers, and deliverables.',
    defaultTitle: 'Services',
    defaultData: {
      items: [
        {
          id: 'srv-1',
          title: '01. Full-Stack Product Engineering',
          description: 'End-to-end architecture, frontend craft, and API implementation.',
          icon: 'code',
          price: 'From $5,000',
        },
      ],
    },
    Editor: GenericListEditor,
    Renderer: GenericCardsRenderer,
  },
  gallery: {
    type: 'gallery',
    label: 'Visual Gallery & Lightbox',
    description: 'Photography plates and visual artwork with fullscreen lightbox.',
    defaultTitle: 'Visual Archive',
    defaultData: {
      items: [
        {
          id: 'gal-1',
          imageUrl: SAMPLE_ASSETS.photoArchitecture1,
          caption: 'Architectural Light Study I',
          alt: 'Architectural photograph',
          exif: '50mm · f/2.8 · ISO 100',
        },
      ],
    },
    Editor: GenericListEditor,
    Renderer: GalleryRenderer,
  },
  testimonials: {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Endorsements from clients, executives, and peers.',
    defaultTitle: 'Client & Peer Endorsements',
    defaultData: {
      items: [
        {
          id: 'test-1',
          name: 'Elena Vance',
          role: 'Director of Product',
          company: 'Horizon Labs',
          quote: 'An exceptional collaborator who elevates both code quality and user experience.',
        },
      ],
    },
    Editor: GenericListEditor,
    Renderer: GenericCardsRenderer,
  },
  blog: {
    type: 'blog',
    label: 'Articles & Writing',
    description: 'Published essays, technical notes, and tutorials.',
    defaultTitle: 'Selected Writing',
    defaultData: {
      items: [
        {
          id: 'blog-1',
          title: 'Principles of Calm Software Architecture',
          date: 'October 2026',
          readTime: '6 min read',
          summary: 'How simplicity in state management prevents production outages.',
          content: '',
        },
      ],
    },
    Editor: GenericListEditor,
    Renderer: GenericCardsRenderer,
  },
  contact: {
    type: 'contact',
    label: 'Contact & Social Links',
    description: 'Direct email, phone, location, social links, and contact form.',
    defaultTitle: 'Get in Touch',
    defaultData: {
      email: 'hello@example.com',
      phone: '+1 (555) 019-2831',
      location: 'San Francisco, CA',
      formEnabled: true,
      socials: [
        { id: 'soc-1', platform: 'github', label: 'GitHub', url: 'https://github.com' },
        { id: 'soc-2', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
      ],
    },
    Editor: ContactEditor,
    Renderer: ContactRenderer,
  },
  resume: {
    type: 'resume',
    label: 'Resume / CV Callout',
    description: 'Print-friendly resume download banner.',
    defaultTitle: 'Resume & Curriculum Vitae',
    defaultData: {},
    Editor: CustomTextEditor,
    Renderer: ResumeRenderer,
  },
  socialLinks: {
    type: 'socialLinks',
    label: 'Social Directory',
    description: 'Standalone social links bar.',
    defaultTitle: 'Connect Online',
    defaultData: {
      socials: [
        { id: 'soc-1', platform: 'github', label: 'GitHub', url: 'https://github.com' },
      ],
    },
    Editor: ContactEditor,
    Renderer: ContactRenderer,
  },
  customText: {
    type: 'customText',
    label: 'Custom Text Block',
    description: 'Flexible prose section for announcements or manifestos.',
    defaultTitle: 'Notes & Manifesto',
    defaultData: {
      content: 'Dedicated to building accessible, high-craft digital products.',
    },
    Editor: CustomTextEditor,
    Renderer: CustomTextRenderer,
  },
};
