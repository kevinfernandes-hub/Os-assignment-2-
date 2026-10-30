import React from 'react';
import { Lock, Unlock, Database, Cpu, Layers, GitBranch, ArrowRight } from 'lucide-react';
import { SimulationConfig } from '../types/simulation';

interface SynchronizationHUDProps {
  config: SimulationConfig;
  emptyVal: number;
  fullVal: number;
  mutexLocked: boolean;
  mutexHolder: 'PRODUCER' | 'CONSUMER' | null;
  inPointer: number;
  outPointer: number;
}

export const SynchronizationHUD: React.FC<SynchronizationHUDProps> = ({
  config,
  emptyVal,
  fullVal,
  mutexLocked,
  mutexHolder,
  inPointer,
  outPointer,
}) => {
  const isSimple = config.viewMode === 'SIMPLE';

  return (
    <div id="primitives" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span>{isSimple ? 'Storage Room Locks & Counters' : 'Synchronization Telemetry & Primitives'}</span>
        </h2>
        <span className="text-xs font-mono text-slate-400">
          {isSimple ? 'Real-Time State of Locks and Counters' : 'POSIX Semaphores & Mutex Registry'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: MUTEX LOCK */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-slate-300 font-semibold">
                {isSimple ? 'Storage Room Key' : 'pthread_mutex_t mutex'}
              </span>
              {mutexLocked ? (
                <Lock className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className={`text-2xl font-mono font-bold ${
                  mutexLocked ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {mutexLocked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Key held by:{' '}
              <strong className="text-slate-200">
                {mutexHolder
                  ? isSimple
                    ? mutexHolder === 'PRODUCER'
                      ? 'Extractor'
                      : 'Astronaut'
                    : mutexHolder
                  : 'Nobody (Door free)'}
              </strong>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-tight">
            {isSimple
              ? 'Only 1 process can be inside the room at a time so items do not get mixed up.'
              : 'Enforces strict Mutual Exclusion. Only 1 process in Critical Section at any time.'}
          </div>
        </div>

        {/* CARD 2: EMPTY SEMAPHORE */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-slate-300 font-semibold">
                {isSimple ? 'Empty Space Counter' : 'sem_t empty'}
              </span>
              <span className="text-[11px] font-mono text-slate-500">Max: {config.bufferCapacity}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                {emptyVal}
              </span>
              <span className="text-xs font-mono text-slate-500">/ {config.bufferCapacity} slots</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Status:{' '}
              {emptyVal === 0 ? (
                <span className="text-rose-400 font-bold">
                  {isSimple ? 'Full! Producer must wait' : 'Buffer Full (Producer Blocks)'}
                </span>
              ) : (
                <span className="text-emerald-400">
                  {isSimple ? `${emptyVal} free slots` : 'Available Slots'}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-tight">
            {isSimple
              ? 'Tells the producer if there is room to store an item. If 0, producer pauses.'
              : 'Tracks available slots. Decremented by producer; incremented by consumer.'}
          </div>
        </div>

        {/* CARD 3: FULL SEMAPHORE */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-slate-300 font-semibold">
                {isSimple ? 'Stored Items Counter' : 'sem_t full'}
              </span>
              <span className="text-[11px] font-mono text-slate-500">Max: {config.bufferCapacity}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                {fullVal}
              </span>
              <span className="text-xs font-mono text-slate-500">/ {config.bufferCapacity} items</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Status:{' '}
              {fullVal === 0 ? (
                <span className="text-amber-400 font-bold">
                  {isSimple ? 'Empty! Astronauts wait' : 'Buffer Empty (Consumer Blocks)'}
                </span>
              ) : (
                <span className="text-cyan-400">
                  {isSimple ? `${fullVal} supplies ready` : 'Supplies Ready'}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-tight">
            {isSimple
              ? 'Tells astronauts if there are supplies ready. If 0, astronauts pause and sleep.'
              : 'Tracks filled slots. Decremented by consumer; incremented by producer.'}
          </div>
        </div>

        {/* CARD 4: CIRCULAR BUFFER POINTERS */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-slate-300 font-semibold">
                {isSimple ? 'Conveyor Positions' : 'Circular Pointers'}
              </span>
              <GitBranch className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-orange-400">
                {isSimple ? 'Put: ' : 'in: '}
                <strong className="text-lg font-bold tabular-nums">[{inPointer}]</strong>
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {isSimple ? 'Take: ' : 'out: '}
                <strong className="text-lg font-bold tabular-nums">[{outPointer}]</strong>
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {isSimple ? 'Slots in use: ' : 'Distance: '}
              <strong className="text-slate-200">
                {(inPointer - outPointer + config.bufferCapacity) % config.bufferCapacity}
              </strong>{' '}
              items apart
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-tight">
            {isSimple
              ? 'Positions wrap around in a circle when reaching the end of the conveyor.'
              : 'Bounded circular array indexing using modulo arithmetic prevents buffer overflow.'}
          </div>
        </div>
      </div>
    </div>
  );
};
