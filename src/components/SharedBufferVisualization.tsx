import React from 'react';
import {
  Lock,
  Unlock,
  Wind,
  Droplets,
  Wheat,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  ArrowDown,
  Activity,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResourceItem,
  ProcessState,
  ResourceType,
  SimulationConfig,
} from '../types/simulation';
import { RESOURCE_MAP } from '../utils/resources';

interface SharedBufferProps {
  config: SimulationConfig;
  buffer: (ResourceItem | null)[];
  inPointer: number;
  outPointer: number;
  emptyVal: number;
  fullVal: number;
  mutexLocked: boolean;
  mutexHolder: 'PRODUCER' | 'CONSUMER' | null;
  producerState: ProcessState;
  consumerState: ProcessState;
  totalProduced: number;
  totalConsumed: number;
  itemsStored: number;
  producedCounts: Record<ResourceType, number>;
  consumedCounts: Record<ResourceType, number>;
  invariantSatisfied: boolean;
  lastProducedItem: ResourceItem | null;
  lastConsumedItem: ResourceItem | null;
  simpleStatus: string;
}

export const SharedBufferVisualization: React.FC<SharedBufferProps> = ({
  config,
  buffer,
  inPointer,
  outPointer,
  emptyVal,
  fullVal,
  mutexLocked,
  mutexHolder,
  producerState,
  consumerState,
  totalProduced,
  totalConsumed,
  itemsStored,
  producedCounts,
  consumedCounts,
  invariantSatisfied,
  lastProducedItem,
  lastConsumedItem,
  simpleStatus,
}) => {
  const isSimple = config.viewMode === 'SIMPLE';

  // Render icon for resource
  const renderResourceIcon = (type: ResourceType, className = 'w-4 h-4') => {
    switch (type) {
      case 'O2':
        return <Wind className={className} />;
      case 'H2O':
        return <Droplets className={className} />;
      case 'FOOD':
        return <Wheat className={className} />;
    }
  };

  // Human-readable process state label
  const getStateBadge = (state: ProcessState, actor: 'PROD' | 'CONS') => {
    switch (state) {
      case 'IDLE':
        return (
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />{' '}
            {isSimple ? 'Ready' : 'IDLE'}
          </span>
        );
      case 'WAITING_SEMAPHORE':
      case 'BLOCKED':
        return (
          <span className="text-[11px] font-mono text-rose-400 font-semibold flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{' '}
            {isSimple
              ? actor === 'PROD'
                ? 'WAITING (Storage Full)'
                : 'WAITING (Storage Empty)'
              : 'BLOCKED (WAIT)'}
          </span>
        );
      case 'ACQUIRING_MUTEX':
        return (
          <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{' '}
            {isSimple ? 'Unlocking Door...' : 'ACQUIRING MUTEX'}
          </span>
        );
      case 'CRITICAL_SECTION':
        return (
          <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />{' '}
            {isSimple ? 'Inside Storage Room' : 'CRITICAL SECTION'}
          </span>
        );
      case 'SIGNALING_MUTEX':
      case 'SIGNALING_SEMAPHORE':
        return (
          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />{' '}
            {isSimple ? 'Leaving Room' : 'SIGNALING'}
          </span>
        );
    }
  };

  return (
    <div id="simulation" className="space-y-5">
      {/* LIVE PLAIN ENGLISH STATUS BANNER */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900/80 to-blue-950/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-orange-400 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            What is happening right now:
          </div>
          <div className="text-sm md:text-base font-semibold text-white leading-snug">
            {simpleStatus}
          </div>
        </div>
      </div>

      {/* 3-Column Concurrency Stage: Producer -> Shared Buffer -> Consumer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: Producer Station */}
        <div className="lg:col-span-3 bg-[#0d121c] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          {producerState === 'CRITICAL_SECTION' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 animate-pulse" />
          )}

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-950/60 border border-orange-500/30 text-orange-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    {isSimple ? 'Resource Extractor' : 'Producer Unit'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {isSimple ? 'Role: Makes supplies' : 'Thread ID: #PROD_01'}
                  </p>
                </div>
              </div>
              <div>{getStateBadge(producerState, 'PROD')}</div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {isSimple
                ? 'Harvests resources from the Martian air and ice to keep astronauts alive.'
                : 'Autonomous atmospheric & subsurface synthesis generating pressurized canisters.'}
            </p>

            {/* Production Chamber Animation Box */}
            <div className="bg-[#090d14] border border-slate-800/80 rounded-xl p-4 mb-4 text-center">
              <div className="text-[11px] font-mono text-slate-400 mb-2">
                {isSimple ? 'ACTIVE PRODUCTION' : 'SYNTHESIS GENERATOR'}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                    producerState === 'CRITICAL_SECTION'
                      ? 'border-orange-500 bg-orange-950/40 text-orange-400 scale-105 shadow-md shadow-orange-950/50'
                      : producerState === 'BLOCKED'
                      ? 'border-rose-500/50 bg-rose-950/20 text-rose-400 opacity-60'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  {lastProducedItem ? (
                    renderResourceIcon(lastProducedItem.type, 'w-7 h-7')
                  ) : (
                    <Wind className="w-7 h-7" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-xs font-mono font-medium text-slate-300">
                {producerState === 'BLOCKED' ? (
                  <span className="text-rose-400">Paused: Storage Room is Full</span>
                ) : producerState === 'CRITICAL_SECTION' ? (
                  <span className="text-orange-400">
                    {isSimple ? `Placing in Slot [${inPointer}]` : `Writing to buffer[${inPointer}]`}
                  </span>
                ) : (
                  <span>Ready for next item</span>
                )}
              </div>
            </div>

            {/* Producer Breakdown */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Oxygen (O₂):</span>
                <span className="text-cyan-400 font-semibold tabular-nums">
                  {producedCounts.O2}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Water (H₂O):</span>
                <span className="text-blue-400 font-semibold tabular-nums">
                  {producedCounts.H2O}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Food Rations:</span>
                <span className="text-orange-400 font-semibold tabular-nums">
                  {producedCounts.FOOD}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {isSimple ? 'Total Made:' : 'Total Generated:'}
            </span>
            <span className="text-base font-mono font-bold text-orange-400 tabular-nums">
              {totalProduced} items
            </span>
          </div>
        </div>

        {/* MIDDLE COLUMN: Shared Circular Storage Buffer */}
        <div className="lg:col-span-6 bg-[#090d14] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Buffer Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  {isSimple ? 'Colony Supply Airlock' : 'Shared Circular Buffer'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {isSimple
                    ? `Capacity: ${config.bufferCapacity} slots max`
                    : `Protected Shared Memory (buffer[${config.bufferCapacity}])`}
                </p>
              </div>
            </div>

            {/* Mutex Status Indicator */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors ${
                mutexLocked
                  ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {mutexLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    {isSimple
                      ? `DOOR LOCKED (${mutexHolder === 'PRODUCER' ? 'Extractor inside' : 'Astronaut inside'})`
                      : `MUTEX: LOCKED (${mutexHolder})`}
                  </span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSimple ? 'DOOR UNLOCKED (Open)' : 'MUTEX: UNLOCKED'}</span>
                </>
              )}
            </div>
          </div>

          {/* Buffer Ring / Slots Grid */}
          <div className="my-6">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between mb-3 px-1">
              <span className="font-semibold text-slate-300">
                {isSimple ? 'STORAGE COMPARTMENTS:' : 'STORAGE BAYS:'}
              </span>
              <span className="text-slate-300">
                Filled: <strong className="text-cyan-400 font-bold tabular-nums">{itemsStored}</strong> /{' '}
                {config.bufferCapacity} slots
              </span>
            </div>

            {/* Dynamic Buffer Slots Visual Grid */}
            <div
              className={`grid gap-3 ${
                config.bufferCapacity <= 4
                  ? 'grid-cols-2 md:grid-cols-4'
                  : config.bufferCapacity <= 6
                  ? 'grid-cols-3 md:grid-cols-6'
                  : config.bufferCapacity <= 8
                  ? 'grid-cols-4 md:grid-cols-8'
                  : 'grid-cols-4 md:grid-cols-6'
              }`}
            >
              {buffer.map((item, idx) => {
                const isNextIn = inPointer === idx;
                const isNextOut = outPointer === idx;
                const isOccupied = item !== null;
                const isUnderMutation =
                  mutexLocked &&
                  ((mutexHolder === 'PRODUCER' && isNextIn) ||
                    (mutexHolder === 'CONSUMER' && isNextOut));

                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl p-2.5 flex flex-col items-center justify-between text-center min-h-[110px] transition-all border ${
                      isUnderMutation
                        ? 'border-yellow-400 bg-yellow-950/30 ring-2 ring-yellow-400/40 shadow-lg'
                        : isOccupied
                        ? 'border-cyan-500/40 bg-[#0d1624] shadow-sm'
                        : 'border-dashed border-slate-800 bg-[#090d14]/70'
                    }`}
                  >
                    {/* Slot Index Tag */}
                    <div className="text-[10px] font-mono text-slate-500 font-semibold">
                      Slot {idx}
                    </div>

                    {/* Slot Content */}
                    <div className="my-1.5 flex flex-col items-center justify-center">
                      {isOccupied && item ? (
                        <div
                          className="p-2 rounded-lg border flex flex-col items-center gap-1"
                          style={{
                            borderColor: RESOURCE_MAP[item.type].borderColor,
                            backgroundColor: RESOURCE_MAP[item.type].bgColor,
                            color: RESOURCE_MAP[item.type].color,
                          }}
                        >
                          {renderResourceIcon(item.type, 'w-4 h-4')}
                          <span className="text-[10px] font-mono font-bold leading-none">
                            {item.type}
                          </span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-slate-700">
                          <span className="text-[9px] font-mono">EMPTY</span>
                        </div>
                      )}
                    </div>

                    {/* Batch number or status */}
                    <div className="text-[10px] font-mono text-slate-400 truncate max-w-full">
                      {isOccupied && item ? `#${item.batchNumber}` : 'free'}
                    </div>

                    {/* Pointer Overlays */}
                    <div className="absolute -bottom-3 flex items-center justify-center gap-1 w-full z-10">
                      {isNextIn && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-600 text-white shadow-sm"
                          title="Where the next produced item will go"
                        >
                          {isSimple ? 'PUT HERE' : 'IN'}
                        </span>
                      )}
                      {isNextOut && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-600 text-white shadow-sm"
                          title="Where the next astronaut will take an item"
                        >
                          {isSimple ? 'TAKE HERE' : 'OUT'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pointer Legend & Invariants */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-orange-600 inline-block" />
                  <span>
                    {isSimple ? 'Put pointer' : 'in pointer'} ={' '}
                    <strong className="text-orange-400 font-bold tabular-nums">[{inPointer}]</strong>
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-600 inline-block" />
                  <span>
                    {isSimple ? 'Take pointer' : 'out pointer'} ={' '}
                    <strong className="text-cyan-400 font-bold tabular-nums">[{outPointer}]</strong>
                  </span>
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {isSimple ? 'Wraps around in a circle' : `Formula: (ptr + 1) % ${config.bufferCapacity}`}
              </div>
            </div>
          </div>

          {/* Semaphores Quick Readout */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-400">
                  {isSimple ? 'Free Spaces Available' : 'sem_t empty'}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                  {emptyVal} / {config.bufferCapacity}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(emptyVal / config.bufferCapacity) * 100}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                {emptyVal === 0 ? '⚠️ Zero spaces left!' : `${emptyVal} free slots remaining`}
              </div>
            </div>

            <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-400">
                  {isSimple ? 'Supplies Ready to Take' : 'sem_t full'}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
                  {fullVal} / {config.bufferCapacity}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${(fullVal / config.bufferCapacity) * 100}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                {fullVal === 0 ? '⚠️ Zero items left!' : `${fullVal} supplies stored`}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Consumer Station */}
        <div className="lg:col-span-3 bg-[#0d121c] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          {consumerState === 'CRITICAL_SECTION' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
          )}

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    {isSimple ? 'Astronaut Crew' : 'Consumer Unit'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {isSimple ? 'Role: Consumes supplies' : 'Thread ID: #ASTRONAUT_01'}
                  </p>
                </div>
              </div>
              <div>{getStateBadge(consumerState, 'CONS')}</div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {isSimple
                ? 'Astronauts living in the habitat need oxygen, water, and food from storage.'
                : 'Ares Habitat astronaut expedition crew consuming life-support resources.'}
            </p>

            {/* Consumption Chamber Animation Box */}
            <div className="bg-[#090d14] border border-slate-800/80 rounded-xl p-4 mb-4 text-center">
              <div className="text-[11px] font-mono text-slate-400 mb-2">
                {isSimple ? 'HABITAT CONSUMPTION' : 'HABITAT LIFE SUPPORT'}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                    consumerState === 'CRITICAL_SECTION'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 scale-105 shadow-md shadow-blue-950/50'
                      : consumerState === 'BLOCKED'
                      ? 'border-rose-500/50 bg-rose-950/20 text-rose-400 opacity-60'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  {lastConsumedItem ? (
                    renderResourceIcon(lastConsumedItem.type, 'w-7 h-7')
                  ) : (
                    <Layers className="w-7 h-7" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-xs font-mono font-medium text-slate-300">
                {consumerState === 'BLOCKED' ? (
                  <span className="text-rose-400">Paused: Storage Room is Empty</span>
                ) : consumerState === 'CRITICAL_SECTION' ? (
                  <span className="text-blue-400">
                    {isSimple
                      ? `Taking from Slot [${outPointer}]`
                      : `Extracting buffer[${outPointer}]`}
                  </span>
                ) : (
                  <span>Crew is breathing & eating</span>
                )}
              </div>
            </div>

            {/* Consumer Breakdown */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Oxygen (O₂):</span>
                <span className="text-cyan-400 font-semibold tabular-nums">
                  {consumedCounts.O2}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Water (H₂O):</span>
                <span className="text-blue-400 font-semibold tabular-nums">
                  {consumedCounts.H2O}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Food Rations:</span>
                <span className="text-orange-400 font-semibold tabular-nums">
                  {consumedCounts.FOOD}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {isSimple ? 'Total Consumed:' : 'Total Consumed:'}
            </span>
            <span className="text-base font-mono font-bold text-blue-400 tabular-nums">
              {totalConsumed} items
            </span>
          </div>
        </div>
      </div>

      {/* MATHEMATICAL INVARIANT VERIFICATION STRIP */}
      <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-lg border ${
              invariantSatisfied
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              {isSimple ? 'Resource Balance Check' : 'System Accounting Invariant'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              <code className="text-orange-400">
                {isSimple ? 'Supplies Made' : 'Total Produced'} ({totalProduced})
              </code>{' '}
              ={' '}
              <code className="text-blue-400">
                {isSimple ? 'Supplies Used' : 'Total Consumed'} ({totalConsumed})
              </code>{' '}
              +{' '}
              <code className="text-cyan-400">
                {isSimple ? 'In Storage' : 'Stored in Buffer'} ({itemsStored})
              </code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500">Balance: </span>
            <span className="text-white font-bold tabular-nums">
              {totalProduced} = {totalConsumed + itemsStored}
            </span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              invariantSatisfied
                ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/50 border-rose-500/30 text-rose-300'
            }`}
          >
            {invariantSatisfied
              ? isSimple
                ? '✔ 100% Accounted For (No Missing Items!)'
                : 'Zero Resource Loss (Invariants Preserved)'
              : 'Invariant Violation'}
          </div>
        </div>
      </div>
    </div>
  );
};
