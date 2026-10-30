/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSimulationEngine } from './hooks/useSimulationEngine';
import { Header } from './components/Header';
import { ColonyHeroBanner } from './components/ColonyHeroBanner';
import { SimpleGuideBanner } from './components/SimpleGuideBanner';
import { SimulationControls } from './components/SimulationControls';
import { SharedBufferVisualization } from './components/SharedBufferVisualization';
import { SynchronizationHUD } from './components/SynchronizationHUD';
import { EducationalCodeTracer } from './components/EducationalCodeTracer';
import { EventAuditLog } from './components/EventAuditLog';
import { EducationalLabManual } from './components/EducationalLabManual';

export default function App() {
  const {
    config,
    setConfig,
    setCapacity,
    isRunning,
    isPaused,
    buffer,
    inPointer,
    outPointer,
    emptyVal,
    fullVal,
    mutexLocked,
    mutexHolder,
    producerState,
    consumerState,
    producerActiveLine,
    consumerActiveLine,
    totalProduced,
    totalConsumed,
    itemsStored,
    producedCounts,
    consumedCounts,
    invariantSatisfied,
    lastProducedItem,
    lastConsumedItem,
    simpleStatus,
    logs,
    logFilter,
    setLogFilter,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    stepProducer,
    stepConsumer,
  } = useSimulationEngine();

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-200 selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navigation Bar */}
      <Header
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={startSimulation}
        onPause={pauseSimulation}
        onResume={resumeSimulation}
        onReset={resetSimulation}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Hero Banner */}
        <ColonyHeroBanner />

        {/* 30-Second Simple Guide & Mode Toggle (Easy vs Advanced) */}
        <SimpleGuideBanner config={config} setConfig={setConfig} />

        {/* Interactive Dashboard Controls & Presets */}
        <SimulationControls
          config={config}
          setConfig={setConfig}
          setCapacity={setCapacity}
          isRunning={isRunning}
          isPaused={isPaused}
          onStart={startSimulation}
          onPause={pauseSimulation}
          onResume={resumeSimulation}
          onReset={resetSimulation}
          onStepProducer={stepProducer}
          onStepConsumer={stepConsumer}
        />

        {/* Central Circular Buffer & Concurrency Visualization */}
        <SharedBufferVisualization
          config={config}
          buffer={buffer}
          inPointer={inPointer}
          outPointer={outPointer}
          emptyVal={emptyVal}
          fullVal={fullVal}
          mutexLocked={mutexLocked}
          mutexHolder={mutexHolder}
          producerState={producerState}
          consumerState={consumerState}
          totalProduced={totalProduced}
          totalConsumed={totalConsumed}
          itemsStored={itemsStored}
          producedCounts={producedCounts}
          consumedCounts={consumedCounts}
          invariantSatisfied={invariantSatisfied}
          lastProducedItem={lastProducedItem}
          lastConsumedItem={lastConsumedItem}
          simpleStatus={simpleStatus}
        />

        {/* Synchronization Telemetry & Primitives HUD */}
        <SynchronizationHUD
          config={config}
          emptyVal={emptyVal}
          fullVal={fullVal}
          mutexLocked={mutexLocked}
          mutexHolder={mutexHolder}
          inPointer={inPointer}
          outPointer={outPointer}
        />

        {/* POSIX C Code Execution Tracer */}
        <EducationalCodeTracer
          producerActiveLine={producerActiveLine}
          consumerActiveLine={consumerActiveLine}
          producerState={producerState}
          consumerState={consumerState}
          emptyVal={emptyVal}
          fullVal={fullVal}
          mutexLocked={mutexLocked}
          mutexHolder={mutexHolder}
        />

        {/* Live Synchronization Audit Log */}
        <EventAuditLog
          logs={logs}
          logFilter={logFilter}
          setLogFilter={setLogFilter}
        />

        {/* Academic Lab Manual & Technical Specifications */}
        <EducationalLabManual />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#05070a] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Mars Colony OS Virtual Lab</span>
            <span>·</span>
            <span>Process Synchronization (Producer–Consumer)</span>
          </div>
          <div className="text-slate-600 font-mono text-[11px]">
            POSIX Pthreads Model · sem_wait() · sem_post() · pthread_mutex_lock()
          </div>
        </div>
      </footer>
    </div>
  );
}
