import React from 'react';
import { Terminal, Code, Cpu, Info, CheckCircle2 } from 'lucide-react';
import { C_CODE_PRODUCER, C_CODE_CONSUMER } from '../utils/resources';
import { ProcessState } from '../types/simulation';

interface EducationalCodeTracerProps {
  producerActiveLine: number;
  consumerActiveLine: number;
  producerState: ProcessState;
  consumerState: ProcessState;
  emptyVal: number;
  fullVal: number;
  mutexLocked: boolean;
  mutexHolder: 'PRODUCER' | 'CONSUMER' | null;
}

export const EducationalCodeTracer: React.FC<EducationalCodeTracerProps> = ({
  producerActiveLine,
  consumerActiveLine,
  producerState,
  consumerState,
  emptyVal,
  fullVal,
  mutexLocked,
  mutexHolder,
}) => {
  // Explanation for producer active line
  const getProducerStepExplanation = () => {
    switch (producerActiveLine) {
      case 2:
        return 'Producer is synthesizing a new resource unit (electrolysis or condensation). Buffer has not been accessed yet.';
      case 3:
        if (emptyVal === 0) {
          return 'CRITICAL BLOCK: sem_wait(&empty) found empty == 0 (buffer full). The kernel moves the producer thread into the BLOCKED/SLEEP queue until a consumer posts to &empty.';
        }
        return 'sem_wait(&empty) decrements the empty slot semaphore. Slot reserved in advance to prevent buffer overflow.';
      case 4:
        return 'pthread_mutex_lock(&mutex) requests exclusive write lock on shared buffer memory. Any other thread attempting access will block.';
      case 5:
        return 'IN CRITICAL SECTION: Producer stores resource in buffer[in]. Race conditions are mathematically prevented because mutex is held.';
      case 6:
        return 'Pointer update: in = (in + 1) % CAPACITY advances the circular buffer pointer to the next free storage cell.';
      case 7:
        return 'pthread_mutex_unlock(&mutex) releases the critical section lock, making buffer accessible to other threads.';
      case 8:
        return 'sem_post(&full) increments the full semaphore by 1. If any consumer was sleeping on empty buffer, the kernel wakes it up!';
      default:
        return 'Producer thread running loop: waiting for next scheduled production interval.';
    }
  };

  // Explanation for consumer active line
  const getConsumerStepExplanation = () => {
    switch (consumerActiveLine) {
      case 2:
        if (fullVal === 0) {
          return 'CRITICAL BLOCK: sem_wait(&full) found full == 0 (buffer empty). The kernel puts astronaut consumer into the SLEEP queue until supplies are produced.';
        }
        return 'sem_wait(&full) decrements the full items semaphore. Confirms an item is guaranteed to be present before buffer access.';
      case 3:
        return 'pthread_mutex_lock(&mutex) requests exclusive read lock on shared buffer memory. Protects pointer manipulation.';
      case 4:
      case 5:
        return 'IN CRITICAL SECTION: Consumer reads and removes resource from buffer[out]. Slot cleared to prevent double-consumption.';
      case 6:
        return 'Pointer update: out = (out + 1) % CAPACITY advances the retrieval pointer to the next available slot.';
      case 7:
        return 'pthread_mutex_unlock(&mutex) releases the critical section lock back to the OS scheduler.';
      case 8:
        return 'sem_post(&empty) increments the empty semaphore by 1. Signals that a storage slot has been liberated, waking blocked producers.';
      case 9:
        return 'Astronaut crew metabolizes/utilizes the retrieved survival supplies in the colony habitat.';
      default:
        return 'Consumer thread running loop: waiting for next scheduled consumption cycle.';
    }
  };

  return (
    <div id="code-tracer" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span>Dual Thread POSIX Code Execution Tracer</span>
        </h2>
        <span className="text-xs font-mono text-slate-400">
          Live C/Pthreads Step Inspector
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* PRODUCER THREAD CODE BOX */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  producer_thread() [POSIX C]
                </span>
              </div>
              <span className="text-[11px] font-mono text-orange-400">
                Line {producerActiveLine + 1}
              </span>
            </div>

            {/* Code Lines with Highlighting */}
            <div className="font-mono text-xs space-y-1 overflow-x-auto py-1">
              {C_CODE_PRODUCER.map((line, idx) => {
                const isActive = producerActiveLine === idx;
                const isCritical = idx === 4 || idx === 5 || idx === 6;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-2 py-1 rounded transition-colors ${
                      isActive
                        ? 'bg-orange-950/70 text-orange-200 border-l-2 border-orange-500 font-semibold shadow-sm'
                        : isCritical
                        ? 'text-yellow-400/80'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-5 text-[10px] text-slate-600 select-none text-right font-mono">
                      {idx + 1}
                    </span>
                    <pre className="m-0 font-mono whitespace-pre">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Kernel Explanation */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 bg-[#070a10] rounded-lg p-3">
            <div className="text-[11px] font-mono text-orange-400 font-semibold mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Kernel State Insight:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {getProducerStepExplanation()}
            </p>
          </div>
        </div>

        {/* CONSUMER THREAD CODE BOX */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  consumer_thread() [POSIX C]
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                Line {consumerActiveLine + 1}
              </span>
            </div>

            {/* Code Lines with Highlighting */}
            <div className="font-mono text-xs space-y-1 overflow-x-auto py-1">
              {C_CODE_CONSUMER.map((line, idx) => {
                const isActive = consumerActiveLine === idx;
                const isCritical = idx === 3 || idx === 4 || idx === 5;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-2 py-1 rounded transition-colors ${
                      isActive
                        ? 'bg-cyan-950/70 text-cyan-200 border-l-2 border-cyan-500 font-semibold shadow-sm'
                        : isCritical
                        ? 'text-yellow-400/80'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-5 text-[10px] text-slate-600 select-none text-right font-mono">
                      {idx + 1}
                    </span>
                    <pre className="m-0 font-mono whitespace-pre">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Kernel Explanation */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 bg-[#070a10] rounded-lg p-3">
            <div className="text-[11px] font-mono text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Kernel State Insight:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {getConsumerStepExplanation()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
