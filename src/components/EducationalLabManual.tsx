import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Terminal,
  Cpu,
  Layers,
  HelpCircle,
  FileText,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { COMPLETE_C_PROGRAM } from '../utils/resources';

export const EducationalLabManual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'AIM' | 'PROBLEM' | 'ALGO' | 'PRIMITIVES' | 'C_CODE' | 'SCENARIOS' | 'CONCLUSION' | 'VIVA'
  >('AIM');

  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(COMPLETE_C_PROGRAM);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div id="lab-manual" className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="text-xs font-mono text-orange-400 mb-1">
            Academic Virtual Lab Manual · Experiment 04
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display">
            Producer–Consumer Process Synchronization Specification
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#07090d] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('AIM')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'AIM'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Aim
          </button>
          <button
            onClick={() => setActiveTab('PROBLEM')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'PROBLEM'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Problem
          </button>
          <button
            onClick={() => setActiveTab('ALGO')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'ALGO'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Algorithm
          </button>
          <button
            onClick={() => setActiveTab('PRIMITIVES')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'PRIMITIVES'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Mechanisms
          </button>
          <button
            onClick={() => setActiveTab('C_CODE')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'C_CODE'
                ? 'bg-orange-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5. C Program (Pthreads)
          </button>
          <button
            onClick={() => setActiveTab('SCENARIOS')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'SCENARIOS'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            6. Sample Output
          </button>
          <button
            onClick={() => setActiveTab('CONCLUSION')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'CONCLUSION'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7. Conclusion
          </button>
          <button
            onClick={() => setActiveTab('VIVA')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'VIVA'
                ? 'bg-cyan-700 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Viva Voce
          </button>
        </div>
      </div>

      {/* Tab 1: AIM */}
      {activeTab === 'AIM' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Experiment Aim & Objectives</span>
          </h3>
          <p>
            To study, design, and demonstrate the classical <strong>Producer–Consumer Problem</strong> (also known as the Bounded-Buffer Problem) using POSIX counting semaphores and mutual exclusion locks (mutex) in a multi-threaded simulated Mars colony environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono text-orange-400 font-semibold uppercase">
                Core Objectives
              </div>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
                <li>Eliminate race conditions on shared memory structures.</li>
                <li>Ensure mutual exclusion inside the critical section.</li>
                <li>Prevent buffer overflow when production rate exceeds consumption.</li>
                <li>Prevent buffer underflow (starvation) when consumption outpaces production.</li>
                <li>Verify safety, progress, and bounded-waiting guarantees.</li>
              </ul>
            </div>

            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Domain Analogy (Mars Outpost)
              </div>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
                <li><strong>Producer:</strong> Automated life support synthesizing Oxygen (O₂), Water (H₂O), and Food.</li>
                <li><strong>Shared Buffer:</strong> Pressurized airlock storage bay with finite capacity <code className="text-cyan-400">N</code>.</li>
                <li><strong>Consumer:</strong> Mars Habitat astronaut expedition crew consuming daily supplies.</li>
                <li><strong>Mutex & Semaphores:</strong> Robotic airlock docking locks and pressure gate controllers.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PROBLEM STATEMENT */}
      {activeTab === 'PROBLEM' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>The Producer–Consumer Concurrency Dilemma</span>
          </h3>
          <p>
            The <strong>Bounded-Buffer Problem</strong> is a quintessential synchronization benchmark. Two concurrent processes—a Producer and a Consumer—share a fixed-size buffer of capacity <code className="text-cyan-400">N</code>.
          </p>

          <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-mono text-amber-400 font-semibold">
              Crucial Synchronization Requirements:
            </div>
            <ol className="list-decimal list-inside text-xs space-y-2 text-slate-300">
              <li>
                <strong>Mutual Exclusion:</strong> The producer and consumer must never access the buffer simultaneously. If both threads attempt to modify pointers or write/read array indices at the same clock cycle, the buffer state becomes corrupt (race condition).
              </li>
              <li>
                <strong>Bounded Overflow Prevention:</strong> The producer must not attempt to add data into the buffer if it is already full (<code className="text-emerald-400">empty == 0</code>). The producer must sleep/wait until space is freed.
              </li>
              <li>
                <strong>Underflow Prevention:</strong> The consumer must not attempt to extract data from an empty buffer (<code className="text-cyan-400">full == 0</code>). The consumer must sleep/wait until an item is produced.
              </li>
              <li>
                <strong>Deadlock-Free Lock Ordering:</strong> The semaphore wait must precede the mutex lock (<code className="text-orange-400">sem_wait(&empty)</code> before <code className="text-orange-400">pthread_mutex_lock(&mutex)</code>). Inverting this order creates a fatal deadlock!
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 3: ALGORITHM */}
      {activeTab === 'ALGO' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Mathematical & Algorithmic Formulation</span>
          </h3>

          <p>
            The shared buffer is represented as a circular array <code className="text-cyan-400">buffer[N]</code> with two indices: <code className="text-orange-400">in</code> (next available slot for producer) and <code className="text-cyan-400">out</code> (next occupied slot for consumer).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Producer Pseudocode */}
            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs">
              <div className="text-orange-400 font-bold mb-2">PRODUCER PROCESS</div>
              <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`do {
    // 1. Generate new resource item
    item = produce_item();

    // 2. Wait for at least one empty slot
    wait(empty);

    // 3. Acquire exclusive mutex
    wait(mutex);

    // --- CRITICAL SECTION ---
    buffer[in] = item;
    in = (in + 1) % BUFFER_SIZE;
    // ------------------------

    // 4. Release mutex
    signal(mutex);

    // 5. Signal that an item is available
    signal(full);
} while (TRUE);`}
              </pre>
            </div>

            {/* Consumer Pseudocode */}
            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs">
              <div className="text-cyan-400 font-bold mb-2">CONSUMER PROCESS</div>
              <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`do {
    // 1. Wait for at least one full slot
    wait(full);

    // 2. Acquire exclusive mutex
    wait(mutex);

    // --- CRITICAL SECTION ---
    item = buffer[out];
    buffer[out] = NULL;
    out = (out + 1) % BUFFER_SIZE;
    // ------------------------

    // 3. Release mutex
    signal(mutex);

    // 4. Signal that a slot has been freed
    signal(empty);

    // 5. Consume resource item
    consume_item(item);
} while (TRUE);`}
              </pre>
            </div>
          </div>

          <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-2">
            <div className="text-emerald-400 font-bold">SYSTEM INVARIANTS:</div>
            <div>1. <code className="text-slate-300">empty + full == BUFFER_SIZE</code> (at any stable quiescent state)</div>
            <div>2. <code className="text-slate-300">0 &le; full &le; BUFFER_SIZE</code> and <code className="text-slate-300">0 &le; empty &le; BUFFER_SIZE</code></div>
            <div>3. <code className="text-slate-300">Total Produced == Total Consumed + Items Stored</code></div>
          </div>
        </div>
      )}

      {/* Tab 4: SYNCHRONIZATION MECHANISMS */}
      {activeTab === 'PRIMITIVES' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Operating System Synchronization Primitives</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono text-orange-400 font-bold">sem_t empty</div>
              <div className="text-xs text-slate-400">Counting Semaphore</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Initialized to <code className="text-cyan-400">N</code>. Tracks available buffer slots. When it reaches 0, any subsequent <code className="text-orange-400">sem_wait(&empty)</code> call forces the calling thread to sleep on the semaphore's kernel wait queue without spinning (saving CPU cycles).
              </p>
            </div>

            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold">sem_t full</div>
              <div className="text-xs text-slate-400">Counting Semaphore</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Initialized to <code className="text-cyan-400">0</code>. Tracks the number of full, consumable resource slots. When it equals 0, any <code className="text-cyan-400">sem_wait(&full)</code> call blocks the consumer thread until a producer posts to it.
              </p>
            </div>

            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">pthread_mutex_t mutex</div>
              <div className="text-xs text-slate-400">Binary Mutual Exclusion</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Binary lock initialized to unlocked state. Only one thread can hold this lock at any instant. Guarantees that buffer writes, array indexing, and pointer advancements are fully atomic.
              </p>
            </div>
          </div>

          <div className="bg-[#07090d] border border-rose-900/50 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>THE DEADLOCK PITFALL (Why order matters!):</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Suppose a programmer swaps the order in the producer to:
              <br />
              <code className="text-rose-300">pthread_mutex_lock(&mutex);</code> followed by <code className="text-rose-300">sem_wait(&empty);</code>
              <br />
              If the buffer is full, the producer acquires the mutex lock, then blocks on <code className="text-rose-300">sem_wait(&empty)</code>. But the consumer needs that exact mutex lock to consume an item and free a slot! The consumer is blocked on the mutex, and the producer is blocked on the semaphore. <strong>Result: DEADLOCK (Circular wait).</strong>
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: COMPLETE C PROGRAM */}
      {activeTab === 'C_CODE' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Original POSIX C Implementation</span>
              </h3>
              <p className="text-xs text-slate-400">
                Complete, self-contained, compilable C code with POSIX threads, semaphores, and mutex.
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy C Source Code</span>
                </>
              )}
            </button>
          </div>

          {/* Compilation Instructions Box */}
          <div className="bg-[#07090d] border border-slate-800 rounded-xl p-3 font-mono text-xs space-y-1">
            <div className="text-slate-500">// Compilation and Execution Command in Linux / macOS:</div>
            <div className="text-emerald-400">gcc -pthread -Wall producer_consumer.c -o producer_consumer</div>
            <div className="text-emerald-400">./producer_consumer</div>
          </div>

          {/* Code Viewer */}
          <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed select-text">
              {COMPLETE_C_PROGRAM}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 6: SAMPLE OUTPUT */}
      {activeTab === 'SCENARIOS' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Sample Output & Experimental Test Cases</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-mono text-orange-400 font-bold mb-1">
                Scenario 1: High Production Rate (Producer &gt; Consumer)
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Producer produces every 0.8s, consumer consumes every 3.2s. Buffer capacity = 6.
              </p>
              <div className="bg-[#040608] border border-slate-800/80 rounded-lg p-3 font-mono text-xs text-slate-300 space-y-1">
                <div>[Producer 1] Stored Oxygen [O2] into Slot [0] (empty: 5, full: 1)</div>
                <div>[Producer 1] Stored Water [H2O] into Slot [1] (empty: 4, full: 2)</div>
                <div>[Producer 1] Stored Food into Slot [2] (empty: 3, full: 3)</div>
                <div>[Producer 1] Stored Oxygen [O2] into Slot [3] (empty: 2, full: 4)</div>
                <div>[Producer 1] Stored Water [H2O] into Slot [4] (empty: 1, full: 5)</div>
                <div>[Producer 1] Stored Food into Slot [5] (empty: 0, full: 6)</div>
                <div className="text-rose-400 font-bold">
                  [Producer 1] Buffer is full! Thread blocked on sem_wait(&empty)...
                </div>
                <div className="text-cyan-400">
                  [Astronaut 1] Consumed Oxygen from Slot [0]. sem_post(&empty) signaled!
                </div>
                <div className="text-emerald-400">
                  [Kernel] Producer thread awakened! Resumed critical section entry.
                </div>
              </div>
            </div>

            <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                Scenario 2: High Consumption Rate (Consumer &gt; Producer)
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Consumer consumes every 0.8s, producer produces every 3.2s.
              </p>
              <div className="bg-[#040608] border border-slate-800/80 rounded-lg p-3 font-mono text-xs text-slate-300 space-y-1">
                <div>[Astronaut 1] Consumed stored resource from Slot [0]. (full: 0)</div>
                <div className="text-amber-400 font-bold">
                  [Astronaut 1] Buffer is empty! Thread blocked on sem_wait(&full)...
                </div>
                <div className="text-orange-400">
                  [Producer 1] Produced Water [H2O] into Slot [1]. sem_post(&full) signaled!
                </div>
                <div className="text-emerald-400">
                  [Kernel] Astronaut thread awakened! Retrieved resource successfully.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: RESULT & CONCLUSION */}
      {activeTab === 'CONCLUSION' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Result & Conclusion</span>
          </h3>

          <div className="bg-[#07090d] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
              Experimental Verification
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. <strong>Safety Property (Mutual Exclusion):</strong> Verified. At no point during high-concurrency simulation did both the producer and consumer manipulate the buffer array simultaneously. The mutex lock enforced strict serial access to the shared critical section.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              2. <strong>Liveness Property (Absence of Deadlock):</strong> Verified. By structuring the synchronization so that counting semaphores (<code className="text-cyan-400">empty</code> and <code className="text-cyan-400">full</code>) are decremented <em>before</em> acquiring the binary mutex lock, circular wait condition is prevented.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              3. <strong>Invariant Conservation:</strong> Throughout all test cycles, <code className="text-orange-400 font-mono">Total Produced == Total Consumed + Buffer Stored</code> remained strictly equal, confirming that zero resource loss or overwrite occurred.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              4. <strong>Technical Note on Simulation Runtime:</strong> This browser-based virtual lab simulates the exact deterministic state-transition semantics of the POSIX Pthreads model. While JavaScript in a web browser runs on an event-loop execution model rather than true kernel-level hardware preemption, the synchronization transitions (blocking on zero semaphore, mutual exclusion flags, wait queue wakeups, circular pointer advancement) accurately mirror the behavior of POSIX semaphores in a Linux kernel.
            </p>
          </div>
        </div>
      )}

      {/* Tab 8: VIVA VOCE QUESTIONS */}
      {activeTab === 'VIVA' && (
        <div className="space-y-4 max-w-4xl text-slate-300 leading-relaxed text-sm">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Operating Systems Practical Viva Voce Questions & Answers
            </h3>
          </div>

          <div className="space-y-3">
            <details className="bg-[#07090d] border border-slate-800 rounded-xl p-4 cursor-pointer group">
              <summary className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                Q1: Why do we need both a Mutex and Semaphores in this solution?
              </summary>
              <p className="text-xs text-slate-400 mt-2 pl-4 border-l-2 border-cyan-500 leading-relaxed">
                A: The counting semaphores (<code className="text-slate-200">empty</code> and <code className="text-slate-200">full</code>) handle <strong>condition synchronization</strong> (ensuring the buffer does not overflow or underflow). The binary mutex lock handles <strong>mutual exclusion</strong> (ensuring that only one thread mutates the shared buffer array and circular pointers at any instant).
              </p>
            </details>

            <details className="bg-[#07090d] border border-slate-800 rounded-xl p-4 cursor-pointer group">
              <summary className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                Q2: What is the initial value of semaphore empty and full?
              </summary>
              <p className="text-xs text-slate-400 mt-2 pl-4 border-l-2 border-cyan-500 leading-relaxed">
                A: <code className="text-slate-200">empty = CAPACITY</code> (because all slots are initially free), and <code className="text-slate-200">full = 0</code> (because no items are stored initially).
              </p>
            </details>

            <details className="bg-[#07090d] border border-slate-800 rounded-xl p-4 cursor-pointer group">
              <summary className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                Q3: Why must sem_wait(&empty) be called BEFORE pthread_mutex_lock(&mutex)?
              </summary>
              <p className="text-xs text-slate-400 mt-2 pl-4 border-l-2 border-cyan-500 leading-relaxed">
                A: If the order is reversed and the buffer is full, the producer will acquire the mutex and then block waiting for <code className="text-slate-200">empty</code>. The consumer will then try to acquire the mutex to consume an item, but will be blocked by the producer. Both threads will wait forever: a classic <strong>Deadlock</strong>.
              </p>
            </details>

            <details className="bg-[#07090d] border border-slate-800 rounded-xl p-4 cursor-pointer group">
              <summary className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                Q4: What is the difference between counting semaphore and binary semaphore?
              </summary>
              <p className="text-xs text-slate-400 mt-2 pl-4 border-l-2 border-cyan-500 leading-relaxed">
                A: A binary semaphore can only have values 0 and 1, functioning similarly to a mutex lock. A counting semaphore can take any non-negative integer value and is used to control access to a resource pool with multiple instances.
              </p>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};
