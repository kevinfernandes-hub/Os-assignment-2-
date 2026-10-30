import { ResourceDetails, ResourceType } from '../types/simulation';

export const RESOURCE_MAP: Record<ResourceType, ResourceDetails> = {
  O2: {
    type: 'O2',
    name: 'Liquid Oxygen Canister',
    formula: 'O₂ (99.8% Pure)',
    unit: 'bar / 20kg',
    color: '#06b6d4', // cyan-500
    borderColor: '#0891b2', // cyan-600
    bgColor: 'rgba(6, 182, 212, 0.12)',
    iconName: 'Wind',
    description: 'MOXIE atmospheric carbon dioxide electrolysis unit extracting breathable oxygen for the Hab pressurized domes.',
  },
  H2O: {
    type: 'H2O',
    name: 'Purified Water Cylinders',
    formula: 'H₂O (Potable)',
    unit: 'Liters / 50L',
    color: '#3b82f6', // blue-500
    borderColor: '#2563eb', // blue-600
    bgColor: 'rgba(59, 130, 246, 0.12)',
    iconName: 'Droplets',
    description: 'Subsurface permafrost thermal drill & reverse-osmosis condensation loop providing life-critical water.',
  },
  FOOD: {
    type: 'FOOD',
    name: 'Hydroponic Ration Crate',
    formula: 'C₆H₁₂O₆ + Micronutrients',
    unit: 'MRE Ration / 2500 kcal',
    color: '#f97316', // orange-500
    borderColor: '#ea580c', // orange-600
    bgColor: 'rgba(249, 115, 22, 0.12)',
    iconName: 'Wheat',
    description: 'Spirulina algae bioreactor & vertical aeroponic strawberry/wheat greenhouse racks in the bio-dome.',
  },
};

export const C_CODE_PRODUCER = [
  'void *producer(void *arg) {',
  '    while (colony_active) {',
  '        resource_t item = produce_resource();',
  '        sem_wait(&empty);            // Wait for free slot',
  '        pthread_mutex_lock(&mutex);   // Enter Critical Section',
  '        buffer[in] = item;           // Store resource',
  '        in = (in + 1) % CAPACITY;    // Advance pointer',
  '        pthread_mutex_unlock(&mutex); // Exit Critical Section',
  '        sem_post(&full);             // Signal resource available',
  '        sleep(producer_interval);',
  '    }',
  '}',
];

export const C_CODE_CONSUMER = [
  'void *consumer(void *arg) {',
  '    while (colony_active) {',
  '        sem_wait(&full);             // Wait for available resource',
  '        pthread_mutex_lock(&mutex);   // Enter Critical Section',
  '        resource_t item = buffer[out]; // Retrieve resource',
  '        buffer[out] = EMPTY_SLOT;',
  '        out = (out + 1) % CAPACITY;  // Advance pointer',
  '        pthread_mutex_unlock(&mutex); // Exit Critical Section',
  '        sem_post(&empty);            // Signal slot freed',
  '        consume_resource(item);',
  '        sleep(consumer_interval);',
  '    }',
  '}',
];

export const COMPLETE_C_PROGRAM = `/**
 * MARS COLONY: RESOURCE MANAGEMENT
 * Process Synchronization using POSIX Pthreads, Semaphores, and Mutex
 * Operating Systems Virtual Lab Experiment
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define BUFFER_SIZE 6
#define TOTAL_ITEMS 15

typedef struct {
    int id;
    char type[16];
    int batch;
} Resource;

Resource buffer[BUFFER_SIZE];
int in = 0;
int out = 0;

// Synchronization Primitives
pthread_mutex_t mutex;
sem_t empty;
sem_t full;

void* producer(void* pno) {
    int id = *((int*)pno);
    const char* types[] = {"Oxygen [O2]", "Water [H2O]", "Food [Ration]"};
    
    for (int i = 0; i < TOTAL_ITEMS; i++) {
        // 1. Produce Item
        Resource item;
        item.id = i + 1;
        item.batch = 1000 + i;
        snprintf(item.type, sizeof(item.type), "%s", types[i % 3]);
        
        printf("[Producer %d] Preparing %s (Batch #%d)\\n", id, item.type, item.batch);
        
        // 2. Decrement empty count (blocks if buffer is full, i.e., empty == 0)
        sem_wait(&empty);
        
        // 3. Acquire exclusive mutex lock for buffer access
        pthread_mutex_lock(&mutex);
        
        // CRITICAL SECTION
        buffer[in] = item;
        printf(" -> [CRITICAL SECTION] Producer placed %s into Slot [%d]\\n", item.type, in);
        in = (in + 1) % BUFFER_SIZE;
        
        // 4. Release mutex lock
        pthread_mutex_unlock(&mutex);
        
        // 5. Increment full count (wakes up waiting consumers)
        sem_post(&full);
        
        usleep(400000); // Simulated production delay (400ms)
    }
    return NULL;
}

void* consumer(void* cno) {
    int id = *((int*)cno);
    
    for (int i = 0; i < TOTAL_ITEMS; i++) {
        // 1. Decrement full count (blocks if buffer is empty, i.e., full == 0)
        sem_wait(&full);
        
        // 2. Acquire exclusive mutex lock for buffer access
        pthread_mutex_lock(&mutex);
        
        // CRITICAL SECTION
        Resource item = buffer[out];
        printf(" <- [CRITICAL SECTION] Astronaut %d consumed %s from Slot [%d]\\n", id, item.type, out);
        out = (out + 1) % BUFFER_SIZE;
        
        // 3. Release mutex lock
        pthread_mutex_unlock(&mutex);
        
        // 4. Increment empty count (wakes up waiting producers)
        sem_post(&empty);
        
        // 5. Consume resource
        printf("[Astronaut %d] Successfully metabolized %s\\n", id, item.type);
        
        usleep(600000); // Simulated consumption delay (600ms)
    }
    return NULL;
}

int main() {
    pthread_t prod_thread, cons_thread;
    int p_id = 1, c_id = 1;
    
    printf("===================================================\\n");
    printf("MARS COLONY: RESOURCE MANAGEMENT SYNCHRONIZATION LAB\\n");
    printf("Buffer Capacity: %d slots | Total Items: %d\\n", BUFFER_SIZE, TOTAL_ITEMS);
    printf("===================================================\\n");
    
    // Initialize synchronization primitives
    pthread_mutex_init(&mutex, NULL);
    sem_init(&empty, 0, BUFFER_SIZE); // Initial empty slots = BUFFER_SIZE
    sem_init(&full, 0, 0);            // Initial full slots = 0
    
    // Create threads
    pthread_create(&prod_thread, NULL, producer, (void*)&p_id);
    pthread_create(&cons_thread, NULL, consumer, (void*)&c_id);
    
    // Join threads (wait for completion)
    pthread_join(prod_thread, NULL);
    pthread_join(cons_thread, NULL);
    
    // Cleanup primitives
    pthread_mutex_destroy(&mutex);
    sem_destroy(&empty);
    sem_destroy(&full);
    
    printf("Simulation completed successfully. Invariants preserved.\\n");
    return 0;
}
`;
