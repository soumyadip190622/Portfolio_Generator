import React, { useState } from 'react';
import { Wand2, RefreshCw, Check, X, AlertCircle, Loader2 } from 'lucide-react';

export type AIAssistAction =
  | 'write_bio'
  | 'improve_description'
  | 'suggest_skills'
  | 'generate_taglines'
  | 'fix_grammar'
  | 'project_description';

interface AIAssistWidgetProps {
  action: AIAssistAction;
  label: string;
  input: string;
  profession: string;
  context?: string;
  onAcceptText?: (text: string) => void;
  onAcceptSkills?: (skills: string[]) => void;
}

export const AIAssistWidget: React.FC<AIAssistWidgetProps> = ({
  action,
  label,
  input,
  profession,
  context = '',
  onAcceptText,
  onAcceptSkills,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [customKeywords, setCustomKeywords] = useState('');
  const [showPromptBox, setShowPromptBox] = useState(false);

  const runAction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          input: customKeywords.trim() ? `${input} (${customKeywords.trim()})` : input,
          profession,
          context,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to reach AI writing assistant.');
      }
      const data = await response.json();
      if (action === 'suggest_skills' && Array.isArray(data.skills)) {
        setSuggestedSkills(data.skills);
        setResultText(null);
      } else if (action === 'generate_taglines' && Array.isArray(data.taglines)) {
        setResultText(data.taglines[0] || '');
        setAlternatives(data.taglines.slice(1));
      } else {
        setResultText(data.result || '');
        setAlternatives(Array.isArray(data.alternatives) ? data.alternatives : []);
      }
      setShowPromptBox(false);
    } catch (err: any) {
      setError(err?.message || 'AI request encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setResultText(null);
    setAlternatives([]);
    setSuggestedSkills([]);
    setError(null);
    setShowPromptBox(false);
  };

  const hasResult = resultText !== null || suggestedSkills.length > 0;

  return (
    <div className="mt-2">
      {!hasResult && !loading && !showPromptBox && (
        <button
          type="button"
          onClick={() => {
            if (action === 'write_bio' && !input.trim()) {
              setShowPromptBox(true);
            } else {
              runAction();
            }
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-300 bg-blue-950/60 hover:bg-blue-900/70 border border-blue-800/60 rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      )}

      {showPromptBox && !loading && (
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5">
          <label className="block text-xs font-medium text-slate-300">
            Enter a few keywords or focus areas for Gemini AI:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="e.g. 5 years React, fintech systems, clean UI..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={runAction}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md whitespace-nowrap shrink-0"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/90 border border-blue-900/50 text-xs text-blue-300">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span>Gemini AI is drafting suggestions...</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={runAction}
              className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-red-100 rounded text-xs"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="px-2 py-1 text-red-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {hasResult && !loading && (
        <div className="p-3 rounded-lg bg-slate-900/95 border border-blue-500/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-blue-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5" />
              AI Suggestion
            </span>
          </div>

          {resultText !== null && (
            <div className="space-y-2">
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-2.5 rounded border border-slate-800">
                {resultText}
              </p>
              {alternatives.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Alternative options (click to select):</span>
                  {alternatives.map((alt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const prev = resultText;
                        setResultText(alt);
                        setAlternatives((curr) => curr.map((item, idx) => (idx === i ? prev : item)));
                      }}
                      className="block w-full text-left text-xs text-slate-300 hover:text-white bg-slate-950/40 hover:bg-slate-950 p-2 rounded border border-slate-800/60 transition-colors"
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {suggestedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-2.5 rounded border border-slate-800">
              {suggestedSkills.map((sk) => (
                <span key={sk} className="text-xs text-slate-200 px-2 py-0.5 bg-slate-800 rounded">
                  {sk}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (suggestedSkills.length > 0 && onAcceptSkills) {
                  onAcceptSkills(suggestedSkills);
                } else if (resultText !== null && onAcceptText) {
                  onAcceptText(resultText);
                }
                handleDiscard();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept</span>
            </button>
            <button
              type="button"
              onClick={runAction}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
