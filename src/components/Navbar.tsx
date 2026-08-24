import React from 'react';
import { FileText, Sparkles, Sun, Moon, HelpCircle } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSelectSample: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onSelectSample,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 shadow-lg shadow-brand-500/25">
            <FileText className="w-5 h-5 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit']">
                Docu<span className="text-brand-400">Summarizer</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                AI Assistant
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Smart PDF & Scanned Image Summary Assistant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sample quick button */}
          <button
            onClick={onSelectSample}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-all hover:border-slate-600 shadow-sm"
            title="Load sample documents"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
            <span>Sample Documents</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
            aria-label="Toggle Theme"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
