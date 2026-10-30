import React from 'react';
import {
  Sparkles,
  HelpCircle,
  Cpu,
  Layers,
  Database,
  Lock,
  ArrowRight,
  Eye,
  GraduationCap,
} from 'lucide-react';
import { SimulationConfig } from '../types/simulation';

interface SimpleGuideBannerProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

export const SimpleGuideBanner: React.FC<SimpleGuideBannerProps> = ({ config, setConfig }) => {
  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
      {/* Top Header with Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-950/60 border border-orange-500/30 text-orange-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white font-display">
              How Does This Work? (The Simple 30-Second Guide)
            </h2>
            <p className="text-xs text-slate-400">
              The Producer–Consumer problem simplified with a Mars colony storage room analogy.
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Simple vs Advanced */}
        <div className="flex items-center gap-1.5 p-1 bg-[#07090d] rounded-xl border border-slate-800">
          <button
            onClick={() => setConfig((prev) => ({ ...prev, viewMode: 'SIMPLE' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              config.viewMode === 'SIMPLE'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Simple View (Easy)</span>
          </button>

          <button
            onClick={() => setConfig((prev) => ({ ...prev, viewMode: 'ADVANCED' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              config.viewMode === 'ADVANCED'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Full OS Lab (C Code)</span>
          </button>
        </div>
      </div>

      {/* 4 Super Easy Steps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Step 1: Producer */}
        <div className="bg-[#080c14] border border-orange-500/20 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-orange-400">STEP 1 · PRODUCER</span>
            <Cpu className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xs font-bold text-slate-200">Colony Extractor Makes Supplies</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The machine creates Oxygen, Water, or Food canisters. Before storing, it checks if there is any free slot.
          </p>
        </div>

        {/* Step 2: Storage Buffer */}
        <div className="bg-[#080c14] border border-cyan-500/20 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-cyan-400">STEP 2 · SHARED ROOM</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xs font-bold text-slate-200">The Storage Airlock (Limited Size)</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Can hold only <strong className="text-cyan-400">{config.bufferCapacity} items</strong> at once. If full, the producer must pause and wait.
          </p>
        </div>

        {/* Step 3: Mutex Key */}
        <div className="bg-[#080c14] border border-emerald-500/20 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-400">STEP 3 · THE ROOM KEY</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-slate-200">The Mutex Lock (One at a Time)</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Only 1 person can unlock the door at a time. This prevents two hands from trying to touch the same shelf.
          </p>
        </div>

        {/* Step 4: Consumer */}
        <div className="bg-[#080c14] border border-blue-500/20 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-blue-400">STEP 4 · CONSUMER</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xs font-bold text-slate-200">Astronaut Crew Takes Supplies</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Astronauts take items when available. If the room is empty, they safely sleep until new items arrive.
          </p>
        </div>
      </div>
    </div>
  );
};
