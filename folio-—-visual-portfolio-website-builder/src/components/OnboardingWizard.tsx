import React, { useState } from 'react';
import {
  Portfolio,
  ProfessionType,
  TemplateId,
} from '../types/portfolio';
import { PROFESSION_PRESETS } from '../data/presets';
import {
  createStarterPortfolioForProfession,
  DEVELOPER_SAMPLE_PORTFOLIO,
  DESIGNER_SAMPLE_PORTFOLIO,
  PHOTOGRAPHER_SAMPLE_PORTFOLIO,
} from '../data/samplePortfolios';
import { TEMPLATE_REGISTRY } from '../registries/templateRegistry';
import { AIAssistWidget } from './AIAssistWidget';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Briefcase,
  User,
  FileText,
  Layers,
  LayoutTemplate,
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (portfolio: Portfolio) => void;
  onCancel: () => void;
}

const PROFESSIONS: ProfessionType[] = [
  'Developer',
  'Designer',
  'Photographer',
  'Student',
  'Freelancer',
  'Writer',
  'Other',
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  const [profession, setProfession] = useState<ProfessionType>('Developer');
  const [draft, setDraft] = useState<Portfolio>(() =>
    createStarterPortfolioForProfession('Developer', 'My Developer Portfolio')
  );

  const handleProfessionChange = (prof: ProfessionType) => {
    setProfession(prof);
    const fresh = createStarterPortfolioForProfession(prof, `${prof} Portfolio`);
    setDraft(fresh);
  };

  const handleQuickStartSample = (sampleBase: Portfolio) => {
    const cloned = structuredClone(sampleBase);
    cloned.id = `folio-${Date.now()}`;
    cloned.updatedAt = new Date().toISOString();
    onComplete(cloned);
  };

  const aboutSec = draft.sections.find((s) => s.type === 'about');
  const skillsSec = draft.sections.find((s) => s.type === 'skills');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-lg font-bold tracking-tight text-white"
          >
            FOLIO
          </button>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">New Portfolio Setup Wizard</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuickStartSample(DEVELOPER_SAMPLE_PORTFOLIO)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Start with Sample Data</span>
          </button>
          <button
            type="button"
            onClick={() => onComplete(draft)}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Skip Wizard →
          </button>
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-3xl w-full mx-auto my-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-200">
              Step {step} of {totalSteps}
            </span>
            <span>Autosaved to draft</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${(step / totalSteps) * 100}%` }}
              className="h-full bg-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* STEP 1: PROFESSION / GOAL */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
                <Briefcase className="w-4 h-4" />
                <span>Step 1 · Select Your Primary Craft</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                What best describes your profession or goal?
              </h2>
              <p className="text-xs text-slate-400">
                We pre-configure the most effective sections and recommend a tailored template. You can customize everything later.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROFESSIONS.map((prof) => {
                const preset = PROFESSION_PRESETS[prof];
                const active = profession === prof;
                return (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => handleProfessionChange(prof)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-blue-950/40 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{prof}</span>
                      <span className="text-[11px] font-mono text-blue-400">
                        {TEMPLATE_REGISTRY[preset.recommendedTemplate].name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{preset.taglineHint}</p>
                  </button>
                );
              })}
            </div>

            {/* Instant Sample Profiles Strip */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
              <div className="text-xs font-semibold text-slate-300">
                Want to explore a rich, pre-filled demo portfolio right away?
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickStartSample(DEVELOPER_SAMPLE_PORTFOLIO)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                >
                  Load Developer Demo (Alex Rivera)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStartSample(DESIGNER_SAMPLE_PORTFOLIO)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                >
                  Load Designer Demo (Elena Rostova)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStartSample(PHOTOGRAPHER_SAMPLE_PORTFOLIO)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                >
                  Load Photographer Demo (Marcus Vance)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BASIC PROFILE INFO */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
                <User className="w-4 h-4" />
                <span>Step 2 · Personal Identity</span>
              </div>
              <h2 className="text-xl font-bold text-white">Introduce yourself to visitors</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Portfolio Project Name
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={draft.profile.name}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, name: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Headline / Value Proposition
              </label>
              <input
                type="text"
                value={draft.profile.headline}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    profile: { ...draft.profile, headline: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
              <AIAssistWidget
                action="generate_taglines"
                label="Generate Headline Options with AI"
                input={draft.profile.headline}
                profession={profession}
                onAcceptText={(text) =>
                  setDraft({
                    ...draft,
                    profile: { ...draft.profile, headline: text },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={draft.profile.location}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, location: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={draft.profile.email}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, email: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ABOUT BIO */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
                <FileText className="w-4 h-4" />
                <span>Step 3 · Story & Bio</span>
              </div>
              <h2 className="text-xl font-bold text-white">Tell your professional story</h2>
            </div>

            <textarea
              rows={5}
              value={aboutSec?.data?.bio || ''}
              onChange={(e) => {
                const val = e.target.value;
                setDraft({
                  ...draft,
                  sections: draft.sections.map((s) =>
                    s.type === 'about' ? { ...s, data: { ...s.data, bio: val } } : s
                  ),
                });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white leading-relaxed"
            />

            <AIAssistWidget
              action="write_bio"
              label="Draft Bio with Gemini AI"
              input={aboutSec?.data?.bio || ''}
              profession={profession}
              onAcceptText={(text) =>
                setDraft({
                  ...draft,
                  sections: draft.sections.map((s) =>
                    s.type === 'about' ? { ...s, data: { ...s.data, bio: text } } : s
                  ),
                })
              }
            />
          </div>
        )}

        {/* STEP 4: SKILLS & SECTIONS */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
                <Layers className="w-4 h-4" />
                <span>Step 4 · Core Skills & Active Sections</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Confirm your skills and enabled portfolio sections
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Key Skills (comma separated)
              </label>
              <input
                type="text"
                value={(skillsSec?.data?.items || []).map((i: any) => i.name).join(', ')}
                onChange={(e) => {
                  const names = e.target.value
                    .split(',')
                    .map((n) => n.trim())
                    .filter(Boolean);
                  const newItems = names.map((name, i) => ({
                    id: `sk-${i}`,
                    name,
                    category: 'Core Expertise',
                    level: 90,
                  }));
                  setDraft({
                    ...draft,
                    sections: draft.sections.map((s) =>
                      s.type === 'skills' ? { ...s, data: { ...s.data, items: newItems } } : s
                    ),
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-300">Active Sections:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {draft.sections.map((sec) => (
                  <label
                    key={sec.id}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={sec.visible}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          sections: draft.sections.map((s) =>
                            s.id === sec.id ? { ...s, visible: e.target.checked } : s
                          ),
                        })
                      }
                    />
                    <span>{sec.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CHOOSE TEMPLATE */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
                <LayoutTemplate className="w-4 h-4" />
                <span>Step 5 · Pick Starting Template</span>
              </div>
              <h2 className="text-xl font-bold text-white">Select your architectural layout</h2>
              <p className="text-xs text-slate-400">
                You can switch between all 8 templates anytime inside the visual editor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {Object.values(TEMPLATE_REGISTRY).map((tpl) => {
                const selected = draft.layout.templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        layout: { ...draft.layout, templateId: tpl.id as TemplateId },
                      })
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selected
                        ? 'bg-blue-950/40 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{tpl.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{tpl.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{tpl.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : onCancel())}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step > 1 ? 'Previous' : 'Back'}</span>
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(draft)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
            >
              <Check className="w-4 h-4" />
              <span>Launch Visual Editor</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        FOLIO Workspace · Zero coding required · Local-first autosave
      </div>
    </div>
  );
};
