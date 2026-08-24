import React from 'react';
import {
  Sparkles,
  Zap,
  FileText,
  BookOpen,
  Briefcase,
  CheckSquare,
  Cpu,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { SummaryLength, SummaryFocus } from '../types';

interface SummaryControlsProps {
  selectedLength: SummaryLength;
  onLengthChange: (length: SummaryLength) => void;
  selectedFocus: SummaryFocus;
  onFocusChange: (focus: SummaryFocus) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const SummaryControls: React.FC<SummaryControlsProps> = ({
  selectedLength,
  onLengthChange,
  selectedFocus,
  onFocusChange,
  onGenerate,
  isGenerating,
}) => {
  const lengths: Array<{
    id: SummaryLength;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'short',
      label: 'Short',
      description: 'Executive snapshot (~60-90 words)',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: 'medium',
      label: 'Medium',
      description: 'Balanced overview (~160-240 words)',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'long',
      label: 'In-Depth',
      description: 'Full multi-section breakdown (~400-600 words)',
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
  ];

  const focusModes: Array<{
    id: SummaryFocus;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'general', label: 'Balanced', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'executive', label: 'Executive', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'action_items', label: 'Action Items', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'technical', label: 'Technical', icon: <Cpu className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Length Selector */}
        <div className="space-y-1.5 w-full md:w-auto">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Summary Depth / Length
          </label>
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 w-full sm:w-auto">
            {lengths.map((len) => {
              const active = selectedLength === len.id;
              return (
                <button
                  key={len.id}
                  onClick={() => onLengthChange(len.id)}
                  disabled={isGenerating}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  } disabled:opacity-50`}
                  title={len.description}
                >
                  {len.icon}
                  <span>{len.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Focus Mode Selector */}
        <div className="space-y-1.5 w-full md:w-auto">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Analysis Focus
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {focusModes.map((mode) => {
              const active = selectedFocus === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onFocusChange(mode.id)}
                  disabled={isGenerating}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    active
                      ? 'bg-slate-800 text-brand-300 border-brand-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
                  } disabled:opacity-50`}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate / Regenerate Action */}
        <div className="w-full md:w-auto pt-2 md:pt-0">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-500 via-sky-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 active:scale-95 shadow-lg shadow-brand-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating Summary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span>Generate Smart Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
