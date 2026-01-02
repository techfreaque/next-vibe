/**
 * Check Configuration Utilities
 *
 * Shared utilities for code quality configuration:
 * - Ignore pattern conversion (oxlint vs eslint format)
 * - ESLint stub creation for oxlint-handled rules
 * - System resource detection for parallel workers
 */

import { cpus, freemem, totalmem } from "node:os";

// ============================================================
// Types
// ============================================================

/** ESLint stub plugin structure */
export interface EslintStubPlugin {
  rules: Record<
    string,
    {
      create: () => Record<string, never>;
      meta: { docs: { description: string } };
    }
  >;
}

/** Ignore pattern formats */
export interface IgnoreFormats {
  /** Raw patterns for oxlint (directories, files, globs) */
  oxlintIgnores: string[];
  /** Glob patterns for ESLint flat config */
  eslintIgnores: string[];
}

/** System resource information for worker allocation */
export interface SystemResources {
  cpuCores: number;
  availableMemoryMB: number;
  maxWorkers: number;
}

// ============================================================
// Constants - Worker Memory Configuration
// ============================================================

/** Memory configuration for parallel workers */
const WORKER_MEMORY_CONFIG = {
  /** Minimum system buffer to reserve (512MB) */
  MIN_SYSTEM_BUFFER_BYTES: 512 * 1024 * 1024,
  /** Percentage of total memory to reserve as buffer */
  SYSTEM_BUFFER_PERCENTAGE: 0.1,
  /** Maximum worker hard cap */
  MAX_WORKER_HARD_CAP: 4,
  /** Memory thresholds (GB) and corresponding worker memory (bytes) */
  MEMORY_THRESHOLDS: [
    { minGB: 32, workerMemoryMB: 400 },
    { minGB: 16, workerMemoryMB: 300 },
    { minGB: 8, workerMemoryMB: 250 },
    { minGB: 4, workerMemoryMB: 200 },
    { minGB: 0, workerMemoryMB: 150 },
  ] as const,
} as const;

// ============================================================
// System Resources
// ============================================================

/**
 * Calculate memory per worker based on system total memory.
 *
 * Scales memory allocation based on available system resources.
 * Larger systems get more memory per worker for better performance.
 *
 * @param totalMemoryBytes - Total system memory in bytes
 * @returns Memory to allocate per worker in bytes
 */
export function calculateMemoryPerWorker(totalMemoryBytes: number): number {
  const totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024);

  for (const threshold of WORKER_MEMORY_CONFIG.MEMORY_THRESHOLDS) {
    if (totalMemoryGB >= threshold.minGB) {
      return threshold.workerMemoryMB * 1024 * 1024;
    }
  }

  // Fallback (should never reach due to minGB: 0 threshold)
  return 150 * 1024 * 1024;
}

/**
 * Calculate maximum worker cap based on system capabilities.
 *
 * Considers both CPU cores and available memory to prevent
 * over-allocation that could cause system instability.
 *
 * @param cpuCores - Number of CPU cores
 * @param totalMemoryBytes - Total system memory in bytes
 * @returns Maximum number of workers to spawn
 */
export function calculateMaxWorkerCap(cpuCores: number, totalMemoryBytes: number): number {
  const totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024);

  // Base cap on CPU cores, but consider memory constraints
  const cpuBasedCap = Math.max(2, cpuCores); // At least 2, up to CPU cores
  const memoryBasedCap = Math.floor(totalMemoryGB / 2); // 1 worker per 2GB of RAM

  // Use the minimum, but cap at reasonable limits
  const dynamicCap = Math.min(cpuBasedCap, memoryBasedCap);
  return Math.max(1, Math.min(dynamicCap, WORKER_MEMORY_CONFIG.MAX_WORKER_HARD_CAP, cpuCores * 2));
}

/**
 * Get system resources and calculate optimal worker count.
 *
 * Detects available CPU and memory, then calculates the optimal
 * number of parallel workers for linting operations.
 *
 * @returns System resource info with recommended worker count
 *
 * @example
 * ```typescript
 * const resources = getSystemResources();
 * console.log(`Using ${resources.maxWorkers} workers`);
 * console.log(`Available memory: ${resources.availableMemoryMB}MB`);
 * ```
 */
export function getSystemResources(): SystemResources {
  const cpuCores = cpus().length;
  const totalMemoryBytes = totalmem();
  const freeMemoryBytes = freemem();

  // Use actual available memory, but leave some buffer for the system
  const systemBufferBytes = Math.max(
    totalMemoryBytes * WORKER_MEMORY_CONFIG.SYSTEM_BUFFER_PERCENTAGE,
    WORKER_MEMORY_CONFIG.MIN_SYSTEM_BUFFER_BYTES,
  );
  const availableMemoryBytes = Math.max(0, freeMemoryBytes - systemBufferBytes);

  // Dynamic memory per worker based on total system memory
  const memoryPerWorkerBytes = calculateMemoryPerWorker(totalMemoryBytes);

  // Calculate optimal worker count based on CPU cores and memory
  const memoryBasedWorkers = Math.floor(availableMemoryBytes / memoryPerWorkerBytes);
  const cpuBasedWorkers = Math.max(1, cpuCores - 1); // Leave one core for main process

  // Dynamic worker cap based on system capabilities
  const maxWorkerCap = calculateMaxWorkerCap(cpuCores, totalMemoryBytes);
  const maxWorkers = Math.min(memoryBasedWorkers, cpuBasedWorkers, maxWorkerCap);

  return {
    cpuCores,
    availableMemoryMB: Math.floor(availableMemoryBytes / (1024 * 1024)),
    maxWorkers: Math.max(1, maxWorkers), // Ensure at least 1 worker
  };
}
