/**
 * Production-ready debug utilities for CLI performance monitoring and resource cleanup
 *
 * Note: Triple-slash reference required for Node.js internal API types
 * These are not available in standard @types/node and must be augmented locally
 */

/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/node.d.ts" />

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { binaryStartTime } from "../../../cli/vibe-runtime";
import type { EndpointLogger } from "../../logger/endpoint";

/**
 * Safe handle types that should not be forcefully closed
 */
const WRITE_STREAM = "WriteStream";
const READ_STREAM = "ReadStream";
const TTY = "TTY";
const SAFE_HANDLE_TYPES = [WRITE_STREAM, READ_STREAM, TTY] as const;

/**
 * Timing data structure for performance monitoring
 */
export interface TimingData {
  binaryStart: number;
  tsStart: number;
  initStart: number;
  initEnd: number;
  parseStart: number;
  parseEnd: number;
  routeStart: number;
  routeEnd: number;
  renderStart: number;
  renderEnd: number;
  end: number;
}

/**
 * Performance breakdown data
 */
export interface PerformanceBreakdown {
  totalDuration: number;
  binaryOverhead: number;
  initOverhead: number;
  parseOverhead: number;
  routeExecution: number;
  renderOverhead: number;
  preRouteOverhead: number;
  postRouteOverhead: number;
}

/**
 * Active handle information
 */
export interface ActiveHandle {
  type: string;
  constructor: string;
}

/**
 * Resource cleanup registry
 */
export class ResourceCleanupRegistry {
  private cleanupFunctions: Array<() => void | Promise<void>> = [];
  private timers: Set<NodeJS.Timeout> = new Set();
  private intervals: Set<NodeJS.Timeout> = new Set();

  /**
   * Register a cleanup function
   */
  register(cleanup: () => void | Promise<void>): void {
    this.cleanupFunctions.push(cleanup);
  }

  /**
   * Register a timer for cleanup
   */
  registerTimer(timer: NodeJS.Timeout): void {
    this.timers.add(timer);
  }

  /**
   * Register an interval for cleanup
   */
  registerInterval(interval: NodeJS.Timeout): void {
    this.intervals.add(interval);
  }

  /**
   * Execute all cleanup functions
   */
  async cleanup(logger: EndpointLogger): Promise<void> {
    // Clear all timers and intervals
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
    for (const interval of this.intervals) {
      clearInterval(interval);
    }

    // Execute cleanup functions
    for (const cleanup of this.cleanupFunctions) {
      try {
        await cleanup();
      } catch (cleanupError) {
        const error =
          cleanupError instanceof Error
            ? { message: cleanupError.message, stack: cleanupError.stack }
            : { message: String(cleanupError) };
        logger.warn(
          "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.cleanupFunctionFailed",
          { cleanupError: error },
        );
      }
    }

    // Clear registries
    this.cleanupFunctions = [];
    this.timers.clear();
    this.intervals.clear();
  }
}

/**
 * Performance monitor for CLI operations
 */
export class CliPerformanceMonitor {
  private timings: Partial<TimingData> = {};

  /**
   * Initialize timing with binary start time from environment
   */
  initialize(): void {
    this.timings = {
      binaryStart: binaryStartTime,
      tsStart: Date.now(),
      initStart: Date.now(),
    };
  }

  /**
   * Mark a timing point
   */
  mark(point: keyof TimingData): void {
    this.timings[point] = Date.now();
  }

  /**
   * Get current timings
   */
  getTimings(): Partial<TimingData> {
    return { ...this.timings };
  }

  /**
   * Calculate performance breakdown
   */
  calculateBreakdown(): PerformanceBreakdown | null {
    const t = this.timings;
    if (!t.binaryStart || !t.end || !t.routeStart || !t.routeEnd) {
      return null;
    }

    const totalDuration = t.end - t.binaryStart;
    const binaryOverhead = (t.tsStart || t.binaryStart) - t.binaryStart;
    const initOverhead = Math.max(0, (t.initEnd || 0) - (t.initStart || 0));
    const parseOverhead = Math.max(0, (t.parseEnd || 0) - (t.parseStart || 0));
    const routeExecution = t.routeEnd - t.routeStart;
    const renderOverhead = Math.max(
      0,
      (t.renderEnd || 0) - (t.renderStart || 0),
    );
    const preRouteOverhead = Math.max(
      0,
      t.routeStart - (t.tsStart || t.binaryStart),
    );
    const postRouteOverhead = Math.max(0, t.end - t.routeEnd);

    return {
      totalDuration,
      binaryOverhead,
      initOverhead,
      parseOverhead,
      routeExecution,
      renderOverhead,
      preRouteOverhead,
      postRouteOverhead,
    };
  }
}

/**
 * Resource monitor for detecting hanging handles
 */
export class ResourceMonitor {
  /**
   * Get active handles that might prevent process exit
   */
  getActiveHandles(): ActiveHandle[] {
    const handles: ActiveHandle[] = [];

    try {
      if (process._getActiveHandles) {
        const activeHandles = process._getActiveHandles();
        for (const handle of activeHandles) {
          handles.push({
            type: handle.constructor.name,
            constructor: handle.constructor.name,
          });
        }
      }
    } catch {
      // Ignore errors accessing internal APIs
    }

    return handles;
  }

  /**
   * Get active requests count
   */
  getActiveRequestsCount(): number {
    try {
      if (process._getActiveRequests) {
        return process._getActiveRequests().length;
      }
    } catch {
      // Ignore errors accessing internal APIs
    }
    return 0;
  }

  /**
   * Check if there are problematic handles preventing exit
   */
  hasProblematicHandles(): boolean {
    const handles = this.getActiveHandles();

    // Any handle that's not in the safe list is potentially problematic
    return handles.some((handle) => {
      const handleType = handle.type;
      return !SAFE_HANDLE_TYPES.includes(
        handleType as (typeof SAFE_HANDLE_TYPES)[number],
      );
    });
  }

  /**
   * Force close all handles (aggressive cleanup)
   */
  forceCloseHandles(): void {
    try {
      if (process._getActiveHandles) {
        const handles = process._getActiveHandles();
        for (const handle of handles) {
          try {
            // Skip stdio handles
            if (
              handle.constructor.name === WRITE_STREAM ||
              handle.constructor.name === READ_STREAM ||
              handle.constructor.name === TTY
            ) {
              continue;
            }

            // Try to close the handle
            if (typeof handle.close === "function") {
              handle.close();
            } else if (typeof handle.destroy === "function") {
              handle.destroy();
            } else if (typeof handle.end === "function") {
              handle.end();
            }
          } catch {
            // Ignore errors when force closing handles
          }
        }
      }
    } catch {
      // Ignore errors accessing internal APIs
    }
  }
}

/**
 * Debug output formatter
 */
export class DebugFormatter {
  /**
   * Format performance breakdown for verbose output
   */
  static formatPerformanceBreakdown(breakdown: PerformanceBreakdown): string {
    return JSON.stringify(
      {
        binaryStartup: `${breakdown.binaryOverhead}ms`,
        routeDiscovery: `${Math.round(breakdown.preRouteOverhead * 0.7)}ms`,
        cliInit: `${breakdown.initOverhead}ms`,
        dataParsing: `${breakdown.parseOverhead}ms`,
        routeExecution: `${breakdown.routeExecution}ms`,
        rendering: `${breakdown.renderOverhead}ms`,
        cleanup: `${Math.round(breakdown.postRouteOverhead)}ms`,
        totalOverhead: `${breakdown.totalDuration - breakdown.routeExecution}ms`,
      },
      null,
      2,
    );
  }

  /**
   * Format active handles for debugging
   */
  static formatActiveHandles(handles: ActiveHandle[]): string {
    const grouped = handles.reduce(
      (acc, handle) => {
        acc[handle.type] = (acc[handle.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .map(([type, count]) => `${type}: ${count}`)
      .join(", ");
  }

  /**
   * Format simple execution summary for non-verbose output
   */
  static formatExecutionSummary(
    breakdown: PerformanceBreakdown,
    locale: CountryLanguage,
  ): string {
    const { t } = simpleT(locale);
    const overhead = breakdown.totalDuration - breakdown.routeExecution;
    const executionSeconds = (breakdown.routeExecution / 1000).toFixed(2);
    const overheadSeconds = (overhead / 1000).toFixed(2);
    const totalSeconds = (breakdown.totalDuration / 1000).toFixed(2);

    return (
      // eslint-disable-next-line prefer-template
      "\n" +
      t(
        "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.executionSummary",
        {
          executionSeconds,
          overheadSeconds,
          totalSeconds,
        },
      )
    );
  }
}

/**
 * CLI resource manager for proper cleanup
 */
export class CliResourceManager {
  private performanceMonitor = new CliPerformanceMonitor();
  private cleanupRegistry = new ResourceCleanupRegistry();
  private resourceMonitor = new ResourceMonitor();

  /**
   * Initialize CLI resources and monitoring
   */
  initialize(logger: EndpointLogger): void {
    this.performanceMonitor.initialize();

    // Register performance monitor cleanup
    this.cleanupRegistry.register(async () => {
      try {
        const { performanceMonitor } = await import("./performance");
        performanceMonitor.setEnabled(false);
      } catch {
        // Performance monitor might not be available
      }
    });

    // Register database cleanup - this is critical for preventing hanging
    this.cleanupRegistry.register(async () => {
      try {
        const { closeDatabase } = await import("../../../../db");
        await closeDatabase(logger);
      } catch {
        // Database might not be imported yet
      }
    });

    // Register process signal handlers for graceful shutdown
    this.setupSignalHandlers();
  }

  /**
   * Get performance monitor
   */
  getPerformanceMonitor(): CliPerformanceMonitor {
    return this.performanceMonitor;
  }

  /**
   * Get cleanup registry
   */
  getCleanupRegistry(): ResourceCleanupRegistry {
    return this.cleanupRegistry;
  }

  /**
   * Get resource monitor
   */
  getResourceMonitor(): ResourceMonitor {
    return this.resourceMonitor;
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    const handleShutdown = async (): Promise<void> => {
      // Create a minimal logger for signal handler context
      const logger: EndpointLogger = {
        info: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
        vibe: () => {},
        isDebugEnabled: false,
      };

      try {
        await this.cleanupRegistry.cleanup(logger);
        process.exit(0);
      } catch {
        process.exit(1);
      }
    };

    process.on("SIGINT", () => void handleShutdown());
    process.on("SIGTERM", () => void handleShutdown());
    process.on("SIGHUP", () => void handleShutdown());
  }

  /**
   * Perform comprehensive cleanup and exit gracefully
   */
  async cleanupAndExit(
    logger: EndpointLogger,
    verbose = false,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      // Mark end timing
      this.performanceMonitor.mark("end");

      // Show performance summary
      const breakdown = this.performanceMonitor.calculateBreakdown();
      if (breakdown) {
        if (verbose) {
          const totalSeconds = (breakdown.totalDuration / 1000).toFixed(2);
          logger.info(
            "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.executionTime",
            { totalSeconds },
          );
          logger.info(
            "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.performanceBreakdown",
          );
          console.log(DebugFormatter.formatPerformanceBreakdown(breakdown));
        } else {
          console.log(DebugFormatter.formatExecutionSummary(breakdown, locale));
        }
      }

      // Perform cleanup
      await this.cleanupRegistry.cleanup(logger);

      // Force close any remaining problematic handles
      this.resourceMonitor.forceCloseHandles();

      // Give a moment for cleanup to complete
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 50);
      });

      // Check for remaining problematic handles
      if (verbose) {
        const handles = this.resourceMonitor.getActiveHandles();
        const requests = this.resourceMonitor.getActiveRequestsCount();

        if (handles.length > 0 || requests > 0) {
          logger.info(
            "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.remainingResources",
          );
          logger.info(
            "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.activeHandles",
            {
              handles: DebugFormatter.formatActiveHandles(handles),
            },
          );
          logger.info(
            "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.activeRequests",
            {
              requests: requests.toString(),
            },
          );
        }
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Check if we need to force exit
      const hasProblematic = this.resourceMonitor.hasProblematicHandles();
      if (hasProblematic) {
        if (verbose) {
          logger.warn(
            "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.problematicHandlesDetected",
          );
        }
        setTimeout(() => process.exit(0), 100);
      } else {
        // Clean exit
        process.exit(0);
      }
    } catch (cleanupError) {
      const error =
        cleanupError instanceof Error
          ? { message: cleanupError.message, stack: cleanupError.stack }
          : { message: String(cleanupError) };
      logger.warn(
        "app.api.v1.core.system.unifiedUi.cli.vibe.utils.debug.cleanupError",
        { cleanupError: error },
      );
      process.exit(1);
    }
  }
}

/**
 * Global CLI resource manager instance
 */
export const cliResourceManager = new CliResourceManager();
