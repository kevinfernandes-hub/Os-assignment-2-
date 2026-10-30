/**
 * Mars Colony Resource Management - OS Virtual Lab
 * Type Definitions for Producer-Consumer Process Synchronization
 */

export type ResourceType = 'O2' | 'H2O' | 'FOOD';

export interface ResourceDetails {
  type: ResourceType;
  name: string;
  formula: string;
  unit: string;
  color: string;
  borderColor: string;
  bgColor: string;
  iconName: string;
  description: string;
}

export interface ResourceItem {
  id: string;
  type: ResourceType;
  batchNumber: number;
  timestamp: number;
  producerId: string;
  consumedBy?: string;
}

export type ProcessState =
  | 'IDLE'
  | 'WAITING_SEMAPHORE'
  | 'ACQUIRING_MUTEX'
  | 'CRITICAL_SECTION'
  | 'SIGNALING_MUTEX'
  | 'SIGNALING_SEMAPHORE'
  | 'BLOCKED';

export type LogCategory = 'ALL' | 'PRODUCER' | 'CONSUMER' | 'MUTEX' | 'SEMAPHORE';

export interface LogEntry {
  id: string;
  timestamp: string;
  actor: 'PRODUCER' | 'CONSUMER' | 'SYSTEM' | 'KERNEL';
  action: string;
  detail: string;
  category: 'PRODUCER' | 'CONSUMER' | 'MUTEX' | 'SEMAPHORE';
  emptyVal: number;
  fullVal: number;
  mutexLocked: boolean;
  itemInfo?: string;
}

export interface SimulationConfig {
  bufferCapacity: number; // 3 to 12
  producerDelayMs: number; // 500 to 5000
  consumerDelayMs: number; // 500 to 5000
  activeResource: ResourceType | 'CYCLE';
  mode: 'CONTINUOUS' | 'STEP_BY_STEP';
  viewMode: 'SIMPLE' | 'ADVANCED';
}

export interface StepTrace {
  process: 'PRODUCER' | 'CONSUMER';
  codeLine: number;
  codeText: string;
  explanation: string;
  kernelAction: string;
}
