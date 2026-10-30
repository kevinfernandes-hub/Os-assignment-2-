import React from 'react';
import { Rocket, RotateCcw, Play, Pause } from 'lucide-react';

interface HeaderProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#090d14]/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#top"
        className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-orange-400 transition-colors"
      >
        <span className="p-1.5 rounded-lg bg-orange-950/60 border border-orange-500/30 text-orange-400">
          <Rocket className="w-4 h-4" />
        </span>
        <span>Mars Colony OS Lab</span>
      </a>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-400">
        <a
          href="#simulation"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          Simulation
        </a>
        <a
          href="#primitives"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          Semaphores & Mutex
        </a>
        <a
          href="#code-tracer"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          Code Tracer
        </a>
        <a
          href="#c-implementation"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          C Program
        </a>
        <a
          href="#lab-manual"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          Lab Manual
        </a>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors shadow-sm shadow-orange-900/30 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Simulation</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={onReset}
          title="Reset Simulation"
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
