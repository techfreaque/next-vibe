/**
 * Graceful Shutdown Handler
 * Handles SIGTERM/SIGINT signals to gracefully shutdown all running tasks
 */

/* eslint-disable i18next/no-literal-string */
/// <reference types="node" />

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

// Simple logger for shutdown operations using process streams
const logger = {
  info(message: string): void {
    process.stdout.write(`${message}\n`);
  },
  error(message: string, error?: string): void {
    process.stderr.write(`${message}${error ? ` ${error}` : ""}\n`);
  },
};

/**
 * Graceful Shutdown Manager
 * Manages shutdown handlers and ensures clean exit
 */
export class GracefulShutdownManager {
  private shutdownHandlers: Array<() => Promise<void>> = [];
  private isShuttingDown = false;
  private shutdownTimeout = 30000; // 30 seconds

  constructor() {
    this.setupSignalHandlers();
  }

  /**
   * Register a shutdown handler
   */
  registerShutdownHandler(handler: () => Promise<void>): void {
    this.shutdownHandlers.push(handler);
  }

  /**
   * Set shutdown timeout
   */
  setShutdownTimeout(timeoutMs: number): void {
    this.shutdownTimeout = timeoutMs;
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    // Handle SIGTERM (Docker, systemd, etc.)
    process.on("SIGTERM", () => {
      logger.info("📡 Received SIGTERM signal");
      void this.initiateShutdown("SIGTERM");
    });

    // Handle SIGINT (Ctrl+C)
    process.on("SIGINT", () => {
      logger.info("📡 Received SIGINT signal (Ctrl+C)");
      void this.initiateShutdown("SIGINT");
    });

    // Handle SIGHUP (terminal closed)
    process.on("SIGHUP", () => {
      logger.info("📡 Received SIGHUP signal");
      void this.initiateShutdown("SIGHUP");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      logger.error("💥 Uncaught exception:", error.message || String(error));
      void this.initiateShutdown("UNCAUGHT_EXCEPTION");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: Error | string) => {
      const errorMessage =
        typeof reason === "string" ? reason : reason.message || String(reason);
      logger.error("💥 Unhandled promise rejection:", errorMessage);
      void this.initiateShutdown("UNHANDLED_REJECTION");
    });
  }

  /**
   * Initiate graceful shutdown
   */
  private async initiateShutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      logger.info("⚠️  Shutdown already in progress...");
      return;
    }

    this.isShuttingDown = true;
    logger.info(`🛑 Initiating graceful shutdown (${signal})...`);

    // Set a timeout to force exit if shutdown takes too long
    const forceExitTimeout = setTimeout(() => {
      logger.error(
        `⏰ Shutdown timeout reached (${this.shutdownTimeout}ms), forcing exit`,
      );
      process.exit(1);
    }, this.shutdownTimeout);

    try {
      // Execute all shutdown handlers
      logger.info(
        `🔄 Running ${this.shutdownHandlers.length} shutdown handlers...`,
      );

      const shutdownPromises = this.shutdownHandlers.map(
        async (handler, index) => {
          try {
            logger.info(`🔄 Running shutdown handler ${index + 1}...`);
            await handler();
            logger.info(`✅ Shutdown handler ${index + 1} completed`);
          } catch (error) {
            const parsedError = parseError(error);
            logger.error(
              `❌ Shutdown handler ${index + 1} failed:`,
              parsedError.message,
            );
          }
        },
      );

      // Wait for all handlers to complete
      await Promise.all(shutdownPromises);

      logger.info("✅ All shutdown handlers completed");

      // Clear the force exit timeout
      clearTimeout(forceExitTimeout);

      logger.info("👋 Graceful shutdown complete");
      process.exit(0);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("❌ Error during shutdown:", parsedError.message);
      clearTimeout(forceExitTimeout);
      process.exit(1);
    }
  }

  /**
   * Manually trigger shutdown (for testing or programmatic shutdown)
   */
  async shutdown(): Promise<void> {
    await this.initiateShutdown("MANUAL");
  }
}

/**
 * Lazy global instance for convenience
 * Only created when first accessed to avoid interfering with CLI
 */
let gracefulShutdownInstance: GracefulShutdownManager | null = null;

function getGracefulShutdown(): GracefulShutdownManager {
  if (!gracefulShutdownInstance) {
    gracefulShutdownInstance = new GracefulShutdownManager();
  }
  return gracefulShutdownInstance;
}

/**
 * Convenience function to register shutdown handlers
 * Uses lazy initialization to avoid interfering with CLI
 */
export function onShutdown(handler: () => Promise<void>): void {
  getGracefulShutdown().registerShutdownHandler(handler);
}

/**
 * Convenience function to set shutdown timeout
 */
export function setShutdownTimeout(timeoutMs: number): void {
  getGracefulShutdown().setShutdownTimeout(timeoutMs);
}

/**
 * Initialize graceful shutdown for task runners
 */
export function initializeTaskRunnerShutdown(): void {
  logger.info("🛡️  Graceful shutdown handler initialized");

  // Register a default handler that logs shutdown initiation
  onShutdown(async () => {
    logger.info("🛑 Task runner shutdown initiated");
    return await Promise.resolve();
  });
}

export { getGracefulShutdown as gracefulShutdown };
