/**
 * Production-ready debug utilities for CLI performance monitoring and resource cleanup
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/**
 * Internal Node.js handle type for resource monitoring
 * These are internal APIs not in @types/node, accessed via type assertion
 */
interface InternalNodeHandle {
  constructor: { name: string };
  close?: () => void;
  destroy?: () => void;
  end?: () => void;
}

/**
 * Extended process type with internal Node.js APIs
 * Used for resource monitoring - these are undocumented internal APIs
 */
interface ProcessWithInternals {
  _getActiveHandles?: () => InternalNodeHandle[];
  _getActiveRequests?: () => unknown[];
}
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { binaryStartTime } from "../vibe-runtime";
import type { RouteExecutionResult } from "./route-executor";

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
          "app.api.system.unifiedInterface.cli.vibe.utils.debug.cleanupFunctionFailed",
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
      // Cast to access internal Node.js APIs
      const proc = process as unknown as ProcessWithInternals;
      if (proc._getActiveHandles) {
        const activeHandles = proc._getActiveHandles();
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
      // Cast to access internal Node.js APIs
      const proc = process as unknown as ProcessWithInternals;
      if (proc._getActiveRequests) {
        return proc._getActiveRequests().length;
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
      // Cast to access internal Node.js APIs
      const proc = process as unknown as ProcessWithInternals;
      if (proc._getActiveHandles) {
        const handles = proc._getActiveHandles();
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
 * Format performance breakdown for verbose output
 */
function formatPerformanceBreakdown(breakdown: PerformanceBreakdown): string {
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
function formatActiveHandles(handles: ActiveHandle[]): string {
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
function formatExecutionSummary(
  breakdown: PerformanceBreakdown,
  locale: CountryLanguage,
): string {
  const { t } = simpleT(locale);
  const overhead = breakdown.totalDuration - breakdown.routeExecution;
  const executionSeconds = (breakdown.routeExecution / 1000).toFixed(2);
  const overheadSeconds = (overhead / 1000).toFixed(2);
  const totalSeconds = (breakdown.totalDuration / 1000).toFixed(2);

  return `\n${t(
    "app.api.system.unifiedInterface.cli.vibe.utils.debug.executionSummary",
    {
      executionSeconds,
      overheadSeconds,
      totalSeconds,
    },
  )}`;
}

/**
 * Debug output formatter
 */
export const DebugFormatter = {
  formatPerformanceBreakdown,
  formatActiveHandles,
  formatExecutionSummary,
};

/**
 * CLI resource manager for proper cleanup
 */
export class CliResourceManager {
  private performanceMonitor = new CliPerformanceMonitor();
  private cleanupRegistry = new ResourceCleanupRegistry();
  private resourceMonitor = new ResourceMonitor();
  private abortController: AbortController | null = null;

  /**
   * Initialize CLI resources and monitoring
   */
  initialize(logger: EndpointLogger, locale: CountryLanguage): void {
    this.performanceMonitor.initialize();

    // Create AbortController for request cancellation
    this.abortController = new AbortController();

    // Register database cleanup - this is critical for preventing hanging
    this.cleanupRegistry.register(async () => {
      try {
        const { closeDatabase } = await import("@/app/api/[locale]/system/db");
        await closeDatabase(logger);
      } catch {
        // Database might not be imported yet
      }
    });

    // Register process signal handlers for graceful shutdown
    this.setupSignalHandlers(locale);
  }

  /**
   * Get abort signal for request cancellation
   */
  getAbortSignal(): AbortSignal | undefined {
    return this.abortController?.signal;
  }

  /**
   * Get performance monitor
   */
  getPerformanceMonitor(): CliPerformanceMonitor {
    return this.performanceMonitor;
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(locale: CountryLanguage): void {
    const handleShutdown = async (): Promise<void> => {
      // Abort any ongoing requests first
      if (this.abortController) {
        this.abortController.abort();
      }

      const logger = createEndpointLogger(false, Date.now(), locale);
      try {
        await this.cleanupRegistry.cleanup(logger);
        process.exit(0);
      } catch {
        process.exit(1);
      }
    };

    // Handle SIGINT but do nothing - just prevent vibe-runtime from exiting
    // The child process (dev server) will handle SIGINT and manage cleanup
    // We need to stay alive so the child can finish its cleanup properly
    process.on("SIGINT", () => {
      // Do nothing - child will handle cleanup and exit
      // We stay alive to let the child finish properly
    });

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
    result: RouteExecutionResult,
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
            "app.api.system.unifiedInterface.cli.vibe.utils.debug.executionTime",
            { totalSeconds },
          );
          logger.info(
            "app.api.system.unifiedInterface.cli.vibe.utils.debug.performanceBreakdown",
          );
          logger.info(DebugFormatter.formatPerformanceBreakdown(breakdown));
        } else {
          logger.info(DebugFormatter.formatExecutionSummary(breakdown, locale));
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
            "app.api.system.unifiedInterface.cli.vibe.utils.debug.remainingResources",
          );
          logger.info(
            "app.api.system.unifiedInterface.cli.vibe.utils.debug.activeHandles",
            {
              handles: DebugFormatter.formatActiveHandles(handles),
            },
          );
          logger.info(
            "app.api.system.unifiedInterface.cli.vibe.utils.debug.activeRequests",
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
            "app.api.system.unifiedInterface.cli.vibe.utils.debug.problematicHandlesDetected",
          );
        }
        setTimeout(() => this.exit(result), 100);
      } else {
        // Clean exit
        this.exit(result);
      }
    } catch (cleanupError) {
      const error =
        cleanupError instanceof Error
          ? { message: cleanupError.message, stack: cleanupError.stack }
          : { message: String(cleanupError) };
      logger.warn(
        "app.api.system.unifiedInterface.cli.vibe.utils.debug.cleanupError",
        { cleanupError: error },
      );
      process.exit(1);
    }
  }

  exit(result: RouteExecutionResult): void {
    // Exit with error code if the result indicates failure
    if (
      !result.success ||
      result.cause ||
      result.error ||
      result.isErrorResponse
    ) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

/**
 * Global CLI resource manager instance
 */
export const cliResourceManager = new CliResourceManager();
