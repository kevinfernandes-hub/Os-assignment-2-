import React from 'react';
import { Cpu, ShieldCheck, Database, Layers } from 'lucide-react';

export const ColonyHeroBanner: React.FC = () => {
  return (
    <div id="top" className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1017]">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/mars_colony_base_exterior_1793085259718.jpg"
          alt="Mars Ares Outpost Exterior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 filter saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-5xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-orange-400 mb-3">
          <span>Operating Systems Virtual Lab</span>
          <span aria-hidden="true">·</span>
          <span>Experiment #04</span>
          <span aria-hidden="true">·</span>
          <span>Inter-Process Communication & Synchronization</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance font-display">
          MARS COLONY: RESOURCE MANAGEMENT
        </h1>

        <p className="text-base md:text-lg text-slate-300 font-medium mb-6 max-w-3xl leading-relaxed">
          Process Synchronization using the classical Producer–Consumer Model. Autonomous life-support extractors generate vital Martian resources into a shared circular buffer, while astronaut habitat threads consume them under strict POSIX semaphore and mutex constraints.
        </p>

        {/* 4 Architectural Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-orange-950/40 border border-orange-500/20 text-orange-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Producer Process</div>
              <div className="text-[11px] text-slate-400">Atmospheric & Water Synthesis</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Shared Circular Buffer</div>
              <div className="text-[11px] text-slate-400">Bounded Airlock Storage Queue</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/20 text-blue-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Consumer Process</div>
              <div className="text-[11px] text-slate-400">Astronaut Crew Consumption</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Mutual Exclusion</div>
              <div className="text-[11px] text-slate-400">Mutex & Counting Semaphores</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
