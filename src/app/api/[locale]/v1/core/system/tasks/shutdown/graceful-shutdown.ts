/**
 * Graceful Shutdown Handler
 * Handles SIGTERM/SIGINT signals to gracefully shutdown all running tasks
 */

/* eslint-disable no-console, i18next/no-literal-string */

import "server-only";

// import { parseError } from "next-vibe/shared/utils/parse-error";

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
      console.log("📡 Received SIGTERM signal");
      this.initiateShutdown("SIGTERM");
    });

    // Handle SIGINT (Ctrl+C)
    process.on("SIGINT", () => {
      console.log("📡 Received SIGINT signal (Ctrl+C)");
      this.initiateShutdown("SIGINT");
    });

    // Handle SIGHUP (terminal closed)
    process.on("SIGHUP", () => {
      console.log("📡 Received SIGHUP signal");
      this.initiateShutdown("SIGHUP");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("💥 Uncaught exception:", error.message || error);
      this.initiateShutdown("UNCAUGHT_EXCEPTION");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("💥 Unhandled promise rejection:", reason);
      this.initiateShutdown("UNHANDLED_REJECTION");
    });
  }

  /**
   * Initiate graceful shutdown
   */
  private async initiateShutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      console.log("⚠️  Shutdown already in progress...");
      return;
    }

    this.isShuttingDown = true;
    console.log(`🛑 Initiating graceful shutdown (${signal})...`);

    // Set a timeout to force exit if shutdown takes too long
    const forceExitTimeout = setTimeout(() => {
      console.error(
        `⏰ Shutdown timeout reached (${this.shutdownTimeout}ms), forcing exit`,
      );
      process.exit(1);
    }, this.shutdownTimeout);

    try {
      // Execute all shutdown handlers
      console.log(
        `🔄 Running ${this.shutdownHandlers.length} shutdown handlers...`,
      );

      const shutdownPromises = this.shutdownHandlers.map(
        async (handler, index) => {
          try {
            console.log(`🔄 Running shutdown handler ${index + 1}...`);
            await handler();
            console.log(`✅ Shutdown handler ${index + 1} completed`);
          } catch (error) {
            console.error(
              `❌ Shutdown handler ${index + 1} failed:`,
              error.message || error,
            );
          }
        },
      );

      // Wait for all handlers to complete
      await Promise.all(shutdownPromises);

      console.log("✅ All shutdown handlers completed");

      // Clear the force exit timeout
      clearTimeout(forceExitTimeout);

      console.log("👋 Graceful shutdown complete");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error.message || error);
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
  console.log("🛡️  Graceful shutdown handler initialized");

  // Register a default handler that logs shutdown initiation
  onShutdown(async () => {
    console.log("🛑 Task runner shutdown initiated");
  });
}

export { getGracefulShutdown as gracefulShutdown };
