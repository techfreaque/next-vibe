/// <reference types="node" />
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable i18next/no-literal-string */

/**
 * Performance monitoring and optimization for Vibe CLI
 */

import { performance } from "node:perf_hooks";

/**
 * Performance metric metadata type
 */
export type PerformanceMetadata = Record<string, string | number | boolean>;

/**
 * Performance metric data
 */
export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: PerformanceMetadata;
  tags?: string[];
}

/**
 * Performance statistics
 */
export interface PerformanceStats {
  totalOperations: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  errorRate: number;
}

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private completedMetrics: PerformanceMetric[] = [];
  private enabled: boolean;
  private maxMetrics: number;

  constructor(enabled = true, maxMetrics = 1000) {
    this.enabled = enabled;
    this.maxMetrics = maxMetrics;
  }

  /**
   * Start timing an operation
   */
  startTimer(
    name: string,
    metadata?: PerformanceMetadata,
    tags?: string[],
  ): string {
    if (!this.enabled) {
      return name;
    }

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
      tags,
    };

    this.metrics.set(name, metric);
    return name;
  }

  /**
   * End timing an operation
   */
  endTimer(name: string, metadata?: PerformanceMetadata): number | null {
    if (!this.enabled) {
      return null;
    }

    const metric = this.metrics.get(name);
    if (!metric) {
      if (process.env.NODE_ENV !== "production") {
        process.stderr.write(`Performance timer '${name}' not found\n`);
      }
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
      metadata: { ...metric.metadata, ...metadata },
    };

    this.metrics.delete(name);
    this.addCompletedMetric(completedMetric);

    if (process.env.NODE_ENV !== "production") {
      const metaStr = JSON.stringify({
        duration,
        metadata: completedMetric.metadata,
      });
      process.stdout.write(
        `Performance: ${name} completed in ${duration.toFixed(2)}ms ${metaStr}\n`,
      );
    }

    return duration;
  }

  /**
   * Time an async operation
   */
  async timeAsync<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: PerformanceMetadata,
    tags?: string[],
  ): Promise<T> {
    if (!this.enabled) {
      return await operation();
    }

    this.startTimer(name, metadata, tags);

    try {
      const result = await operation();
      this.endTimer(name, { success: true });
      return result;
    } catch (error) {
      this.endTimer(name, { success: false, error: String(error) });
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Error re-throwing is necessary to propagate errors through call stack
      throw error;
    }
  }

  /**
   * Time a synchronous operation
   */
  timeSync<T>(
    name: string,
    operation: () => T,
    metadata?: PerformanceMetadata,
    tags?: string[],
  ): T {
    if (!this.enabled) {
      return operation();
    }

    this.startTimer(name, metadata, tags);

    try {
      const result = operation();
      this.endTimer(name, { success: true });
      return result;
    } catch (error) {
      this.endTimer(name, { success: false, error: String(error) });
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Error re-throwing is necessary to propagate errors through call stack
      throw error;
    }
  }

  /**
   * Add completed metric to history
   */
  private addCompletedMetric(metric: PerformanceMetric): void {
    this.completedMetrics.push(metric);

    // Keep only the most recent metrics to prevent memory leaks
    if (this.completedMetrics.length > this.maxMetrics) {
      this.completedMetrics.shift();
    }
  }

  /**
   * Get performance statistics for an operation
   */
  getStats(operationName?: string): PerformanceStats | null {
    const metrics = operationName
      ? this.completedMetrics.filter((m) => m.name === operationName)
      : this.completedMetrics;

    if (metrics.length === 0) {
      return null;
    }

    const durations = metrics
      .map((m) => m.duration)
      .filter((d): d is number => d !== undefined)
      .toSorted((a, b) => a - b);

    const errorCount = metrics.filter(
      (m) => m.metadata?.success === false,
    ).length;

    return {
      totalOperations: metrics.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: durations[0] || 0,
      maxDuration: durations[durations.length - 1] || 0,
      p50Duration: durations[Math.floor(durations.length * 0.5)] || 0,
      p95Duration: durations[Math.floor(durations.length * 0.95)] || 0,
      p99Duration: durations[Math.floor(durations.length * 0.99)] || 0,
      errorRate: errorCount / metrics.length,
    };
  }

  /**
   * Get all operation names
   */
  getOperationNames(): string[] {
    const names = new Set(this.completedMetrics.map((m) => m.name));
    return [...names].toSorted();
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }

  /**
   * Get current active timers
   */
  getActiveTimers(): string[] {
    return [...this.metrics.keys()];
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.metrics.clear();
    }
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const operationNames = this.getOperationNames();

    if (operationNames.length === 0) {
      return "No performance data available";
    }

    let report = "📊 Performance Report\n";
    report += `${"=".repeat(50)}\n\n`;

    for (const name of operationNames) {
      const stats = this.getStats(name);
      if (!stats) {
        continue;
      }

      report += `Operation: ${name}\n`;
      report += `  Total operations: ${stats.totalOperations}\n`;
      report += `  Average duration: ${stats.averageDuration.toFixed(2)}ms\n`;
      report += `  Min duration: ${stats.minDuration.toFixed(2)}ms\n`;
      report += `  Max duration: ${stats.maxDuration.toFixed(2)}ms\n`;
      report += `  P95 duration: ${stats.p95Duration.toFixed(2)}ms\n`;
      report += `  Error rate: ${(stats.errorRate * 100).toFixed(2)}%\n\n`;
    }

    const activeTimers = this.getActiveTimers();
    if (activeTimers.length) {
      report += `Active timers: ${activeTimers.join(", ")}\n`;
    }

    return report;
  }
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  private snapshots: Array<{
    timestamp: number;
    usage: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
      external: number;
      arrayBuffers: number;
    };
  }> = [];

  /**
   * Take memory snapshot
   */
  snapshot(): {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  } {
    const usage = process.memoryUsage();

    this.snapshots.push({
      timestamp: Date.now(),
      usage,
    });

    // Keep only last 100 snapshots
    if (this.snapshots.length > 100) {
      this.snapshots = this.snapshots.slice(-100);
    }

    return usage;
  }

  /**
   * Get memory usage in human-readable format
   */
  getFormattedUsage(usage?: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  }): string {
    const mem = usage || process.memoryUsage();

    return [
      `RSS: ${this.formatBytes(mem.rss)}`,
      `Heap Used: ${this.formatBytes(mem.heapUsed)}`,
      `Heap Total: ${this.formatBytes(mem.heapTotal)}`,
      `External: ${this.formatBytes(mem.external)}`,
    ].join(", ");
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Check for memory leaks
   */
  checkMemoryLeak(): {
    hasLeak: boolean;
    trend: "increasing" | "decreasing" | "stable";
    message: string;
  } {
    if (this.snapshots.length < 10) {
      return {
        hasLeak: false,
        trend: "stable",
        message: "Not enough data to detect memory leaks",
      };
    }

    const recent = this.snapshots.slice(-10);
    const first = recent[0].usage.heapUsed;
    const last = recent[recent.length - 1].usage.heapUsed;
    const growth = last - first;
    const growthPercent = (growth / first) * 100;

    if (growthPercent > 50) {
      return {
        hasLeak: true,
        trend: "increasing",
        message: `Memory usage increased by ${growthPercent.toFixed(2)}% in recent operations`,
      };
    }

    if (growthPercent < -20) {
      return {
        hasLeak: false,
        trend: "decreasing",
        message: `Memory usage decreased by ${Math.abs(growthPercent).toFixed(2)}%`,
      };
    }

    return {
      hasLeak: false,
      trend: "stable",
      message: "Memory usage is stable",
    };
  }
}

/**
 * Default performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Default memory monitor instance
 */
export const memoryMonitor = new MemoryMonitor();
