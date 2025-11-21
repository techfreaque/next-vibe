#!/usr/bin/env node
/**
 * MCP Server Entry Point
 * Main server class that ties together transport and protocol handler
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";

import { MCP_CONFIG } from "../config";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import { createMCPProtocolHandler } from "./protocol-handler";
import { StdioTransport } from "./stdio-transport";

/**
 * MCP Server
 */
export class MCPServer {
  private transport?: StdioTransport;
  private running = false;

  /**
   * Start the MCP server
   */
  async start(logger: EndpointLogger, locale: CountryLanguage): Promise<void> {
    if (this.running) {
      logger.warn("[MCP Server] Server already running");
      return;
    }

    const isMCPServerEnabled = process.env.VIBE_MCP_DISABLED !== "true";
    if (!isMCPServerEnabled) {
      logger.error("[MCP Server] MCP server is disabled");
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- MCP server infrastructure requires throwing for disabled server
      throw new Error("MCP server is disabled");
    }

    try {
      logger.info("[MCP Server] Starting...");

      const capabilities = MCP_CONFIG.platformSpecific?.capabilities || {
        tools: true,
        prompts: false,
        resources: false,
      };

      logger.info("[MCP Server] Configuration", {
        // eslint-disable-next-line i18next/no-literal-string
        name: "Vibe MCP Server",
        version: "1.0.0",
        locale: locale,
        debug: logger.isDebugEnabled,
        capabilities,
      });

      // Create protocol handler
      const protocolHandler = await createMCPProtocolHandler(logger, locale);

      // Create transport
      this.transport = new StdioTransport(logger);

      // Connect transport to protocol handler
      this.transport.onMessage(async (request) => {
        const response = await protocolHandler.handleRequest(request);
        await this.transport!.send(response);
      });

      // Start transport
      await this.transport.start();

      this.running = true;
      logger.info("[MCP Server] Server started successfully");

      // Setup graceful shutdown
      this.setupShutdownHandlers(logger);

      // Keep process alive
      await this.keepAlive();
    } catch (error) {
      logger.error("[MCP Server] Failed to start", {
        error: parseError(error).message,
      });
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Re-throw MCP server startup errors for caller to handle
      throw error;
    }
  }

  /**
   * Stop the MCP server
   */
  async stop(logger: EndpointLogger): Promise<void> {
    if (!this.running) {
      return;
    }

    logger.info("[MCP Server] Stopping...");

    if (this.transport) {
      await this.transport.stop();
      this.transport = undefined;
    }

    this.running = false;
    logger.info("[MCP Server] Server stopped");
  }

  /**
   * Check if server is running
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupShutdownHandlers(logger: EndpointLogger): void {
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`[MCP Server] Received ${signal}, shutting down...`);
      await this.stop(logger);
      process.exit(0);
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      logger.error("[MCP Server] Uncaught exception", {
        error: error.message,
        stack: error.stack,
      });
      void shutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason) => {
      logger.error("[MCP Server] Unhandled rejection", {
        reason: String(reason),
      });
      void shutdown("unhandledRejection");
    });
  }

  /**
   * Keep process alive
   */
  private async keepAlive(): Promise<void> {
    // Wait indefinitely
    return await new Promise(() => {
      // This promise never resolves, keeping the process alive
      // The process will exit via shutdown handlers
    });
  }
}
