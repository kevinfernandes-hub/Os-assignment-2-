import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ResourceType,
  ResourceItem,
  ProcessState,
  LogEntry,
  SimulationConfig,
  LogCategory,
} from '../types/simulation';
import { RESOURCE_MAP } from '../utils/resources';

const DEFAULT_CAPACITY = 6;

export function useSimulationEngine() {
  const [config, setConfig] = useState<SimulationConfig>({
    bufferCapacity: DEFAULT_CAPACITY,
    producerDelayMs: 2000,
    consumerDelayMs: 2200,
    activeResource: 'CYCLE',
    mode: 'CONTINUOUS',
    viewMode: 'SIMPLE',
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [simpleStatus, setSimpleStatus] = useState<string>(
    'Colony is ready. Click "Start" to watch resources being made, stored, and consumed!'
  );

  // Synchronization Variables
  const [buffer, setBuffer] = useState<(ResourceItem | null)[]>(
    () => new Array(DEFAULT_CAPACITY).fill(null)
  );
  const [inPointer, setInPointer] = useState<number>(0);
  const [outPointer, setOutPointer] = useState<number>(0);

  // Semaphores & Mutex
  const [emptyVal, setEmptyVal] = useState<number>(DEFAULT_CAPACITY);
  const [fullVal, setFullVal] = useState<number>(0);
  const [mutexLocked, setMutexLocked] = useState<boolean>(false);
  const [mutexHolder, setMutexHolder] = useState<'PRODUCER' | 'CONSUMER' | null>(null);

  // Process States
  const [producerState, setProducerState] = useState<ProcessState>('IDLE');
  const [consumerState, setConsumerState] = useState<ProcessState>('IDLE');
  const [producerActiveLine, setProducerActiveLine] = useState<number>(1);
  const [consumerActiveLine, setConsumerActiveLine] = useState<number>(1);

  // Accounting Metrics
  const [totalProduced, setTotalProduced] = useState<number>(0);
  const [totalConsumed, setTotalConsumed] = useState<number>(0);
  const [producedCounts, setProducedCounts] = useState<Record<ResourceType, number>>({
    O2: 0,
    H2O: 0,
    FOOD: 0,
  });
  const [consumedCounts, setConsumedCounts] = useState<Record<ResourceType, number>>({
    O2: 0,
    H2O: 0,
    FOOD: 0,
  });

  // Event Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<LogCategory>('ALL');

  // Last actions for UI animations
  const [lastProducedItem, setLastProducedItem] = useState<ResourceItem | null>(null);
  const [lastConsumedItem, setLastConsumedItem] = useState<ResourceItem | null>(null);

  // Refs for asynchronous coordination and state snapshots
  const stateRef = useRef({
    config,
    buffer,
    inPointer,
    outPointer,
    emptyVal,
    fullVal,
    mutexLocked,
    mutexHolder,
    totalProduced,
    totalConsumed,
    isRunning,
    isPaused,
    producerState,
    consumerState,
    producedCounts,
    consumedCounts,
  });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = {
      config,
      buffer,
      inPointer,
      outPointer,
      emptyVal,
      fullVal,
      mutexLocked,
      mutexHolder,
      totalProduced,
      totalConsumed,
      isRunning,
      isPaused,
      producerState,
      consumerState,
      producedCounts,
      consumedCounts,
    };
  }, [
    config,
    buffer,
    inPointer,
    outPointer,
    emptyVal,
    fullVal,
    mutexLocked,
    mutexHolder,
    totalProduced,
    totalConsumed,
    isRunning,
    isPaused,
    producerState,
    consumerState,
    producedCounts,
    consumedCounts,
  ]);

  const addLog = useCallback(
    (
      actor: 'PRODUCER' | 'CONSUMER' | 'SYSTEM' | 'KERNEL',
      action: string,
      detail: string,
      category: 'PRODUCER' | 'CONSUMER' | 'MUTEX' | 'SEMAPHORE',
      itemInfo?: string
    ) => {
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const entry: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp,
        actor,
        action,
        detail,
        category,
        emptyVal: stateRef.current.emptyVal,
        fullVal: stateRef.current.fullVal,
        mutexLocked: stateRef.current.mutexLocked,
        itemInfo,
      };
      setLogs((prev) => [entry, ...prev.slice(0, 199)]); // Keep last 200 logs
    },
    []
  );

  // Reset function
  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setBuffer(new Array(config.bufferCapacity).fill(null));
    setInPointer(0);
    setOutPointer(0);
    setEmptyVal(config.bufferCapacity);
    setFullVal(0);
    setMutexLocked(false);
    setMutexHolder(null);
    setProducerState('IDLE');
    setConsumerState('IDLE');
    setProducerActiveLine(1);
    setConsumerActiveLine(1);
    setTotalProduced(0);
    setTotalConsumed(0);
    setProducedCounts({ O2: 0, H2O: 0, FOOD: 0 });
    setConsumedCounts({ O2: 0, H2O: 0, FOOD: 0 });
    setLastProducedItem(null);
    setLastConsumedItem(null);

    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs([
      {
        id: 'init',
        timestamp,
        actor: 'SYSTEM',
        action: 'BUFFER_INITIALIZED',
        detail: `Circular buffer configured with capacity=${config.bufferCapacity}. empty=${config.bufferCapacity}, full=0, mutex=UNLOCKED.`,
        category: 'SEMAPHORE',
        emptyVal: config.bufferCapacity,
        fullVal: 0,
        mutexLocked: false,
      },
    ]);
  }, [config.bufferCapacity]);

  // Handle capacity change
  const setCapacity = useCallback(
    (newCap: number) => {
      if (newCap < 3 || newCap > 12) return;
      setConfig((prev) => ({ ...prev, bufferCapacity: newCap }));
      setIsRunning(false);
      setIsPaused(false);
      setBuffer(new Array(newCap).fill(null));
      setInPointer(0);
      setOutPointer(0);
      setEmptyVal(newCap);
      setFullVal(0);
      setMutexLocked(false);
      setMutexHolder(null);
      setProducerState('IDLE');
      setConsumerState('IDLE');
      setTotalProduced(0);
      setTotalConsumed(0);
      setProducedCounts({ O2: 0, H2O: 0, FOOD: 0 });
      setConsumedCounts({ O2: 0, H2O: 0, FOOD: 0 });
      addLog(
        'SYSTEM',
        'CAPACITY_RECONFIGURED',
        `Buffer capacity resized to ${newCap} slots. All queues and semaphores re-initialized.`,
        'SEMAPHORE'
      );
    },
    [addLog]
  );

  // Helper to get next resource type
  const getNextResourceType = useCallback((): ResourceType => {
    if (config.activeResource !== 'CYCLE') {
      return config.activeResource;
    }
    const cycleTypes: ResourceType[] = ['O2', 'H2O', 'FOOD'];
    const idx = stateRef.current.totalProduced % cycleTypes.length;
    return cycleTypes[idx];
  }, [config.activeResource]);

  // Execute Producer Step (Deterministic POSIX Synchronization Sequence)
  const executeProducerStep = useCallback(async () => {
    const s = stateRef.current;
    if (s.isPaused) return;

    // Line 2: produce item
    setProducerActiveLine(2);
    setProducerState('IDLE');
    const resType = getNextResourceType();
    const batchNum = 1001 + s.totalProduced;
    const newItem: ResourceItem = {
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: resType,
      batchNumber: batchNum,
      timestamp: Date.now(),
      producerId: 'Atmosphere/Aqua Synthesizer [Prod-1]',
    };

    // Line 3: sem_wait(&empty)
    setProducerActiveLine(3);
    if (s.emptyVal <= 0) {
      setProducerState('BLOCKED');
      setSimpleStatus(
        '⚠️ STORAGE IS FULL! The Producer has an item ready, but all storage slots are filled. The Producer is put to sleep until an astronaut consumes something!'
      );
      addLog(
        'PRODUCER',
        'BLOCKED [sem_wait(&empty)]',
        `Buffer is completely full (empty=0). Producer blocked by kernel scheduler until a consumer frees a slot.`,
        'SEMAPHORE'
      );
      return;
    }

    // Decrement empty semaphore
    setEmptyVal((prev) => Math.max(0, prev - 1));
    addLog(
      'KERNEL',
      'SEMAPHORE_DECREMENT',
      `sem_wait(&empty) succeeded. empty count: ${s.emptyVal} -> ${s.emptyVal - 1}`,
      'SEMAPHORE'
    );

    // Line 4: pthread_mutex_lock(&mutex)
    setProducerActiveLine(4);
    setProducerState('ACQUIRING_MUTEX');
    if (s.mutexLocked) {
      addLog(
        'PRODUCER',
        'WAIT_MUTEX',
        `Buffer access is currently held by ${s.mutexHolder}. Producer waiting on lock.`,
        'MUTEX'
      );
      // Wait momentarily for lock
      return;
    }

    // Lock acquired
    setMutexLocked(true);
    setMutexHolder('PRODUCER');
    setProducerState('CRITICAL_SECTION');
    addLog(
      'PRODUCER',
      'MUTEX_ACQUIRED',
      `Producer entered CRITICAL SECTION. Exclusive write access granted to buffer[${s.inPointer}].`,
      'MUTEX'
    );

    // Line 5: buffer[in] = item;
    setProducerActiveLine(5);
    setBuffer((prev) => {
      const copy = [...prev];
      copy[s.inPointer] = newItem;
      return copy;
    });
    setLastProducedItem(newItem);
    setTotalProduced((prev) => prev + 1);
    setProducedCounts((prev) => ({
      ...prev,
      [resType]: prev[resType] + 1,
    }));
    setSimpleStatus(
      `🏭 Extractor locked the door, placed a new ${RESOURCE_MAP[resType].name} into Slot [${s.inPointer}], and unlocked the door. Available spaces remaining: ${s.emptyVal - 1}.`
    );

    addLog(
      'PRODUCER',
      'WRITE_BUFFER',
      `Stored ${RESOURCE_MAP[resType].name} (Batch #${batchNum}) into Slot [${s.inPointer}].`,
      'PRODUCER',
      `${resType} #${batchNum}`
    );

    // Line 6: in = (in + 1) % CAPACITY;
    setProducerActiveLine(6);
    const nextIn = (s.inPointer + 1) % s.config.bufferCapacity;
    setInPointer(nextIn);

    // Line 7: pthread_mutex_unlock(&mutex);
    setProducerActiveLine(7);
    setMutexLocked(false);
    setMutexHolder(null);
    setProducerState('SIGNALING_MUTEX');
    addLog(
      'PRODUCER',
      'MUTEX_RELEASED',
      `Producer exited CRITICAL SECTION. Mutex lock released to OS lock pool.`,
      'MUTEX'
    );

    // Line 8: sem_post(&full);
    setProducerActiveLine(8);
    setFullVal((prev) => Math.min(s.config.bufferCapacity, prev + 1));
    setProducerState('SIGNALING_SEMAPHORE');
    addLog(
      'KERNEL',
      'SEMAPHORE_INCREMENT',
      `sem_post(&full) signaled. full count: ${s.fullVal} -> ${s.fullVal + 1}. Awaking any sleep-waiting consumers.`,
      'SEMAPHORE'
    );

    // Reset producer state
    setTimeout(() => {
      setProducerState('IDLE');
      setProducerActiveLine(1);
    }, 250);
  }, [addLog, getNextResourceType]);

  // Execute Consumer Step (Deterministic POSIX Synchronization Sequence)
  const executeConsumerStep = useCallback(async () => {
    const s = stateRef.current;
    if (s.isPaused) return;

    // Line 2: sem_wait(&full)
    setConsumerActiveLine(2);
    if (s.fullVal <= 0) {
      setConsumerState('BLOCKED');
      setSimpleStatus(
        '⚠️ STORAGE IS EMPTY! Astronauts came to get supplies, but there is nothing left. They are put to sleep until the Producer delivers new items!'
      );
      addLog(
        'CONSUMER',
        'BLOCKED [sem_wait(&full)]',
        `Buffer is completely empty (full=0). Astronaut crew blocked by kernel scheduler until a producer generates supplies.`,
        'SEMAPHORE'
      );
      return;
    }

    // Decrement full semaphore
    setFullVal((prev) => Math.max(0, prev - 1));
    addLog(
      'KERNEL',
      'SEMAPHORE_DECREMENT',
      `sem_wait(&full) succeeded. full count: ${s.fullVal} -> ${s.fullVal - 1}`,
      'SEMAPHORE'
    );

    // Line 3: pthread_mutex_lock(&mutex)
    setConsumerActiveLine(3);
    setConsumerState('ACQUIRING_MUTEX');
    if (s.mutexLocked) {
      addLog(
        'CONSUMER',
        'WAIT_MUTEX',
        `Buffer access is currently held by ${s.mutexHolder}. Consumer waiting on lock.`,
        'MUTEX'
      );
      return;
    }

    // Lock acquired
    setMutexLocked(true);
    setMutexHolder('CONSUMER');
    setConsumerState('CRITICAL_SECTION');
    addLog(
      'CONSUMER',
      'MUTEX_ACQUIRED',
      `Consumer entered CRITICAL SECTION. Exclusive read/extract access granted to buffer[${s.outPointer}].`,
      'MUTEX'
    );

    // Line 4: item = buffer[out]; buffer[out] = null;
    setConsumerActiveLine(4);
    const consumedItem = s.buffer[s.outPointer];
    setBuffer((prev) => {
      const copy = [...prev];
      copy[s.outPointer] = null;
      return copy;
    });

    if (consumedItem) {
      setLastConsumedItem(consumedItem);
      setTotalConsumed((prev) => prev + 1);
      setConsumedCounts((prev) => ({
        ...prev,
        [consumedItem.type]: prev[consumedItem.type] + 1,
      }));
      setSimpleStatus(
        `👨‍🚀 Astronaut crew locked the door, retrieved ${RESOURCE_MAP[consumedItem.type].name} from Slot [${s.outPointer}], and unlocked the door. Storage space freed up!`
      );
      addLog(
        'CONSUMER',
        'READ_BUFFER',
        `Extracted ${RESOURCE_MAP[consumedItem.type].name} (Batch #${consumedItem.batchNumber}) from Slot [${s.outPointer}].`,
        'CONSUMER',
        `${consumedItem.type} #${consumedItem.batchNumber}`
      );
    }

    // Line 6: out = (out + 1) % CAPACITY;
    setConsumerActiveLine(6);
    const nextOut = (s.outPointer + 1) % s.config.bufferCapacity;
    setOutPointer(nextOut);

    // Line 7: pthread_mutex_unlock(&mutex);
    setConsumerActiveLine(7);
    setMutexLocked(false);
    setMutexHolder(null);
    setConsumerState('SIGNALING_MUTEX');
    addLog(
      'CONSUMER',
      'MUTEX_RELEASED',
      `Consumer exited CRITICAL SECTION. Mutex lock released to OS lock pool.`,
      'MUTEX'
    );

    // Line 8: sem_post(&empty);
    setConsumerActiveLine(8);
    setEmptyVal((prev) => Math.min(s.config.bufferCapacity, prev + 1));
    setConsumerState('SIGNALING_SEMAPHORE');
    addLog(
      'KERNEL',
      'SEMAPHORE_INCREMENT',
      `sem_post(&empty) signaled. empty count: ${s.emptyVal} -> ${s.emptyVal + 1}. Awaking any sleep-waiting producers.`,
      'SEMAPHORE'
    );

    // Line 9: consume_resource(item);
    setConsumerActiveLine(9);
    setTimeout(() => {
      setConsumerState('IDLE');
      setConsumerActiveLine(1);
    }, 250);
  }, [addLog]);

  // Timers for automated continuous simulation
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const prodInterval = setInterval(() => {
      executeProducerStep();
    }, config.producerDelayMs);

    return () => clearInterval(prodInterval);
  }, [isRunning, isPaused, config.producerDelayMs, executeProducerStep]);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    // Offset slightly so they don't always fire in exact lockstep
    const timeout = setTimeout(() => {
      const consInterval = setInterval(() => {
        executeConsumerStep();
      }, config.consumerDelayMs);

      return () => clearInterval(consInterval);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isRunning, isPaused, config.consumerDelayMs, executeConsumerStep]);

  // Start simulation
  const startSimulation = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    addLog(
      'SYSTEM',
      'SIMULATION_STARTED',
      `Mars Life Support producer-consumer synchronization active. Producer rate: ${(1000 / config.producerDelayMs).toFixed(2)}/s, Consumer rate: ${(1000 / config.consumerDelayMs).toFixed(2)}/s.`,
      'PRODUCER'
    );
  }, [addLog, config.producerDelayMs, config.consumerDelayMs]);

  // Pause simulation
  const pauseSimulation = useCallback(() => {
    setIsPaused(true);
    addLog('SYSTEM', 'SIMULATION_PAUSED', 'Simulation paused by mission control operator.', 'PRODUCER');
  }, [addLog]);

  // Resume simulation
  const resumeSimulation = useCallback(() => {
    setIsPaused(false);
    addLog('SYSTEM', 'SIMULATION_RESUMED', 'Simulation resumed by mission control operator.', 'PRODUCER');
  }, [addLog]);

  // Step Single Operation
  const stepProducer = useCallback(() => {
    executeProducerStep();
  }, [executeProducerStep]);

  const stepConsumer = useCallback(() => {
    executeConsumerStep();
  }, [executeConsumerStep]);

  // Count items stored
  const itemsStored = buffer.filter(Boolean).length;

  // Invariant verification: Produced === Consumed + Currently Stored
  const invariantSatisfied = totalProduced === totalConsumed + itemsStored;

  return {
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
  };
}
