/**
 * Production-ready debug utilities for CLI performance monitoring and resource cleanup
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { mcpSilentMode } from "@/config/debug";
import type { CountryLanguage } from "@/i18n/core/config";

import { binaryStartTime } from "../run-cli";
import type { RouteExecutionResult } from "./route-executor";

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
  _getActiveRequests?: () => never[];
}

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
interface TimingData {
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
interface PerformanceBreakdown {
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
interface ActiveHandle {
  type: string;
  constructor: string;
}

/**
 * Resource cleanup registry
 */
class ResourceCleanupRegistry {
  private cleanupFunctions: Array<() => void | Promise<void>> = [];

  /**
   * Register a cleanup function
   */
  register(cleanup: () => void | Promise<void>): void {
    this.cleanupFunctions.push(cleanup);
  }

  /**
   * Execute all cleanup functions
   */
  async cleanup(logger: EndpointLogger): Promise<void> {
    // Execute cleanup functions
    for (const cleanup of this.cleanupFunctions) {
      try {
        await cleanup();
      } catch (cleanupError) {
        const error =
          cleanupError instanceof Error
            ? { message: cleanupError.message, stack: cleanupError.stack }
            : { message: String(cleanupError) };
        logger.warn("Cleanup function failed", {
          cleanupError: error,
        });
      }
    }

    // Clear registries
    this.cleanupFunctions = [];
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
      const proc = process as ProcessWithInternals;
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
      const proc = process as ProcessWithInternals;
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
      const proc = process as ProcessWithInternals;
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

// Performance keys are translated label strings (e.g. "Oxlint", "ESLint", "TypeScript")
// The order controls display sequence in the summary line.
const CHECKER_KEY_ORDER: string[] = ["Oxlint", "ESLint", "TypeScript"];
const TOTAL_KEY = "Total";

/**
 * Format simple execution summary shown after every command (non-verbose).
 * Layout: overhead | load | [checker timings] | total
 */
function formatExecutionSummary(
  breakdown: PerformanceBreakdown,
  result: {
    performance?: Partial<Record<string, number>>;
    endpointLoadMs?: number;
    renderMs?: number;
  },
): string {
  const parts: string[] = [];

  // Render time comes from inside the route execution (result-formatter.ts)
  const renderMs = result.renderMs ?? 0;

  // Overhead = total minus route execution (which includes render) — i.e. startup + tool load
  const overhead = breakdown.totalDuration - breakdown.routeExecution;
  parts.push(`Overhead ${Math.max(0, overhead)}ms`);

  // Endpoint load time (dominant part of overhead)
  if (result.endpointLoadMs !== undefined) {
    parts.push(`Tool load ${result.endpointLoadMs}ms`);
  }

  // Per-checker timings in fixed order, skipping the "Total" key
  if (result.performance) {
    for (const key of CHECKER_KEY_ORDER) {
      const ms = result.performance[key];
      if (ms !== undefined) {
        parts.push(`${key} ${(ms / 1000).toFixed(2)}s`);
      }
    }
    // Also handle any unknown keys (future checkers) not in CHECKER_KEY_ORDER
    for (const [key, ms] of Object.entries(result.performance)) {
      if (
        !CHECKER_KEY_ORDER.includes(key) &&
        key !== TOTAL_KEY &&
        ms !== undefined
      ) {
        parts.push(`${key} ${(ms / 1000).toFixed(2)}s`);
      }
    }
  }

  // Render time (Ink widget tree)
  if (renderMs > 0) {
    parts.push(`Render ${renderMs}ms`);
  }

  // Total wall-clock time
  parts.push(`Total ${(breakdown.totalDuration / 1000).toFixed(2)}s`);

  return `\n${parts.join(" | ")}`;
}

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
    result: RouteExecutionResult,
  ): Promise<void> {
    try {
      // Mark end timing
      this.performanceMonitor.mark("end");

      // Show performance summary
      const breakdown = this.performanceMonitor.calculateBreakdown();
      if (breakdown) {
        if (verbose) {
          const endpointLoad =
            result.endpointLoadMs !== undefined
              ? ` tool-load=${result.endpointLoadMs}ms`
              : "";
          const renderMs = result.renderMs ?? 0;
          const overhead = Math.max(
            0,
            breakdown.totalDuration - breakdown.routeExecution,
          );
          logger.debug(
            `[CLI] startup=${breakdown.binaryOverhead}ms${endpointLoad} overhead=${overhead}ms exec=${breakdown.routeExecution}ms render=${renderMs}ms total=${breakdown.totalDuration}ms`,
          );
        }
        if (!mcpSilentMode) {
          // oxlint-disable-next-line no-console
          console.log(formatExecutionSummary(breakdown, result));
        }
      }

      // Perform cleanup
      await this.cleanupRegistry.cleanup(logger);

      // Force close any remaining problematic handles
      this.resourceMonitor.forceCloseHandles();

      // Check for remaining problematic handles
      if (verbose) {
        const handles = this.resourceMonitor.getActiveHandles();
        const requests = this.resourceMonitor.getActiveRequestsCount();

        if (handles.length > 0 || requests > 0) {
          logger.info("CLI remaining resources after cleanup");
          logger.info("CLI active handles", {
            handles: formatActiveHandles(handles),
          });
          logger.info("CLI active requests", {
            requests: requests.toString(),
          });
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
          logger.warn("CLI problematic handles detected, forcing exit");
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
      logger.warn("CLI cleanup error", {
        cleanupError: error,
      });
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
