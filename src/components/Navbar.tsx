import React from 'react';
import { Sparkles, Timer } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  hasActivePlan: boolean;
  timerActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToSection,
  hasActivePlan,
  timerActive,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-purple-400 flex items-center justify-center font-bold text-lg shadow-sm">
            F
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            FocusFlow
          </span>
        </div>

        {/* Zone 2: Clean 4 nav links with subtle hover states */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onScrollToSection('planner-section')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Study Planner
          </button>
          <button
            onClick={() => onScrollToSection('plan-section')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Recommended Plan
          </button>
          <button
            onClick={() => onScrollToSection('timer-section')}
            className="hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            Study Timer
            {timerActive && (
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => onScrollToSection('myp-section')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Interactions Concept
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onScrollToSection(hasActivePlan ? 'timer-section' : 'planner-section')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {hasActivePlan ? (
              <>
                <Timer className="w-3.5 h-3.5 text-purple-300" />
                <span className="whitespace-nowrap">Open Timer</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span className="whitespace-nowrap">Plan Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
