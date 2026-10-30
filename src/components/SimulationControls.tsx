import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Sliders,
  Wind,
  Droplets,
  Wheat,
  Sparkles,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { SimulationConfig, ResourceType } from '../types/simulation';

interface SimulationControlsProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  setCapacity: (cap: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStepProducer: () => void;
  onStepConsumer: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  config,
  setConfig,
  setCapacity,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onStepProducer,
  onStepConsumer,
}) => {
  const isSimple = config.viewMode === 'SIMPLE';

  // Scenario Presets
  const applyPreset = (preset: 'BALANCED' | 'PROD_FAST' | 'CONS_FAST' | 'MIN_BUFFER') => {
    switch (preset) {
      case 'BALANCED':
        setConfig((prev) => ({
          ...prev,
          producerDelayMs: 2000,
          consumerDelayMs: 2000,
        }));
        break;
      case 'PROD_FAST':
        // Producer 3x faster than consumer -> buffer will fill up and producer will block
        setConfig((prev) => ({
          ...prev,
          producerDelayMs: 800,
          consumerDelayMs: 3200,
        }));
        break;
      case 'CONS_FAST':
        // Consumer 3x faster than producer -> buffer will empty and consumer will block
        setConfig((prev) => ({
          ...prev,
          producerDelayMs: 3200,
          consumerDelayMs: 800,
        }));
        break;
      case 'MIN_BUFFER':
        setCapacity(3);
        setConfig((prev) => ({
          ...prev,
          producerDelayMs: 1200,
          consumerDelayMs: 1200,
        }));
        break;
    }
  };

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6">
      {/* Top Bar: Main Controls & Manual Step */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-500 transition-colors shadow-sm shadow-orange-950/40 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSimple ? '▶ Start Simulation' : 'Start Continuous Run'}</span>
            </button>
          ) : isPaused ? (
            <button
              onClick={onResume}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSimple ? '▶ Resume' : 'Resume Run'}</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-500 transition-colors shadow-sm cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>{isSimple ? '⏸ Pause' : 'Pause Run'}</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSimple ? 'Reset Storage' : 'Reset Buffer'}</span>
          </button>
        </div>

        {/* Manual Step Controls (One-click single action) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            {isSimple ? 'Step-by-step:' : 'Manual Step:'}
          </span>
          <button
            onClick={onStepProducer}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-orange-300 bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/30 rounded-lg transition-colors cursor-pointer"
            title="Produce 1 item and put in storage"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>{isSimple ? 'Make 1 Item' : 'Step Producer'}</span>
          </button>

          <button
            onClick={onStepConsumer}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
            title="Astronaut takes 1 item from storage"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>{isSimple ? 'Consume 1 Item' : 'Step Consumer'}</span>
          </button>
        </div>
      </div>

      {/* Sliders Grid: Capacity, Producer Speed, Consumer Speed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Buffer Capacity */}
        <div className="space-y-2.5 bg-[#070a10] p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <label htmlFor="buffer-capacity" className="text-xs font-semibold text-slate-200">
              {isSimple ? 'Storage Size (Capacity)' : 'Buffer Capacity (N)'}
            </label>
            <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
              {config.bufferCapacity} slots
            </span>
          </div>
          <input
            id="buffer-capacity"
            type="range"
            min={3}
            max={12}
            step={1}
            value={config.bufferCapacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>3 (Small)</span>
            <span>6 (Normal)</span>
            <span>12 (Large)</span>
          </div>
        </div>

        {/* Producer Production Interval */}
        <div className="space-y-2.5 bg-[#070a10] p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <label htmlFor="producer-interval" className="text-xs font-semibold text-slate-200">
              {isSimple ? 'Production Speed' : 'Producer Interval (Delay)'}
            </label>
            <span className="text-xs font-mono font-bold text-orange-400 tabular-nums">
              1 item every {(config.producerDelayMs / 1000).toFixed(1)}s
            </span>
          </div>
          <input
            id="producer-interval"
            type="range"
            min={500}
            max={5000}
            step={100}
            value={config.producerDelayMs}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                producerDelayMs: Number(e.target.value),
              }))
            }
            className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>⚡ Fast (0.5s)</span>
            <span>Normal (2.0s)</span>
            <span>🐢 Slow (5.0s)</span>
          </div>
        </div>

        {/* Consumer Consumption Interval */}
        <div className="space-y-2.5 bg-[#070a10] p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <label htmlFor="consumer-interval" className="text-xs font-semibold text-slate-200">
              {isSimple ? 'Consumption Speed' : 'Consumer Interval (Delay)'}
            </label>
            <span className="text-xs font-mono font-bold text-blue-400 tabular-nums">
              1 item every {(config.consumerDelayMs / 1000).toFixed(1)}s
            </span>
          </div>
          <input
            id="consumer-interval"
            type="range"
            min={500}
            max={5000}
            step={100}
            value={config.consumerDelayMs}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                consumerDelayMs: Number(e.target.value),
              }))
            }
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>⚡ Fast (0.5s)</span>
            <span>Normal (2.2s)</span>
            <span>🐢 Slow (5.0s)</span>
          </div>
        </div>
      </div>

      {/* Resource Selection & Preset Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-slate-800/80">
        {/* Resource Selector */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            {isSimple ? 'Select Resource to Produce:' : 'Target Colony Resource:'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setConfig((prev) => ({ ...prev, activeResource: 'CYCLE' }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                config.activeResource === 'CYCLE'
                  ? 'bg-slate-200 text-slate-900 font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All 3 Resources (Cycle)</span>
            </button>

            <button
              onClick={() => setConfig((prev) => ({ ...prev, activeResource: 'O2' }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                config.activeResource === 'O2'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-900/40'
                  : 'bg-slate-800/80 text-cyan-400 hover:text-cyan-300'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Oxygen (O₂)</span>
            </button>

            <button
              onClick={() => setConfig((prev) => ({ ...prev, activeResource: 'H2O' }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                config.activeResource === 'H2O'
                  ? 'bg-blue-500 text-white font-semibold shadow-sm shadow-blue-900/40'
                  : 'bg-slate-800/80 text-blue-400 hover:text-blue-300'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Water (H₂O)</span>
            </button>

            <button
              onClick={() => setConfig((prev) => ({ ...prev, activeResource: 'FOOD' }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                config.activeResource === 'FOOD'
                  ? 'bg-orange-500 text-slate-950 font-semibold shadow-sm shadow-orange-900/40'
                  : 'bg-slate-800/80 text-orange-400 hover:text-orange-300'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              <span>Food Rations</span>
            </button>
          </div>
        </div>

        {/* One-Click Synchronization Scenarios */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span>{isSimple ? 'Try These 4 Experiments:' : 'Test Scenarios & Edge Cases:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => applyPreset('BALANCED')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
              title="Producer and Consumer run at equal speeds. Storage stays stable."
            >
              🟢 Balanced Harmony
            </button>
            <button
              onClick={() => applyPreset('PROD_FAST')}
              className="px-2.5 py-1 text-xs font-medium bg-orange-950/40 hover:bg-orange-900/50 text-orange-300 border border-orange-500/30 rounded-md transition-colors cursor-pointer"
              title="Producer is fast. Storage fills up to 100%, and producer pauses!"
            >
              🔴 Overflow Test (Storage Fills)
            </button>
            <button
              onClick={() => applyPreset('CONS_FAST')}
              className="px-2.5 py-1 text-xs font-medium bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-500/30 rounded-md transition-colors cursor-pointer"
              title="Astronauts eat fast. Storage runs out, and astronauts pause!"
            >
              🔵 Starvation Test (Storage Empties)
            </button>
            <button
              onClick={() => applyPreset('MIN_BUFFER')}
              className="px-2.5 py-1 text-xs font-medium bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 rounded-md transition-colors cursor-pointer"
              title="Tiny 3-slot room. Tests high contention."
            >
              🟣 Tiny Storage (3 Slots)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
