#!/usr/bin/env node
/**
 * MCP Server Entry Point
 * Main server class that ties together transport and protocol handler
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import { getMCPConfig, isMCPServerEnabled } from "./config";
import type { EndpointLogger } from "../shared/endpoint-logger";
import { createEndpointLogger } from "../shared/endpoint-logger";
import { createMCPProtocolHandler } from "./protocol-handler";
import { StdioTransport } from "./stdio-transport";

/**
 * MCP Server Options
 */
export interface MCPServerOptions {
  locale: CountryLanguage;
  debug?: boolean;
}

/**
 * MCP Server
 */
export class MCPServer {
  private logger: EndpointLogger;
  private locale: CountryLanguage;
  private transport?: StdioTransport;
  private running = false;

  constructor(options: MCPServerOptions = {}) {
    const config = getMCPConfig();
    this.locale = options.locale || config.locale;
    this.logger = createEndpointLogger(
      options.debug ?? config.debug,
      Date.now(),
      this.locale,
    );
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    if (this.running) {
      this.logger.warn("[MCP Server] Server already running");
      return;
    }

    if (!isMCPServerEnabled()) {
      this.logger.error("[MCP Server] MCP server is disabled");
      // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
      throw new Error("MCP server is disabled");
    }

    try {
      this.logger.info("[MCP Server] Starting...");

      const config = getMCPConfig();
      this.logger.info("[MCP Server] Configuration", {
        name: config.name,
        version: config.version,
        locale: this.locale,
        debug: config.debug,
        capabilities: config.capabilities,
      });

      // Create protocol handler
      const protocolHandler = await createMCPProtocolHandler(
        this.logger,
        this.locale,
      );

      // Create transport
      this.transport = new StdioTransport(this.logger);

      // Connect transport to protocol handler
      this.transport.onMessage(async (request) => {
        const response = await protocolHandler.handleRequest(request);
        await this.transport!.send(response);
      });

      // Start transport
      await this.transport.start();

      this.running = true;
      this.logger.info("[MCP Server] Server started successfully");

      // Setup graceful shutdown
      this.setupShutdownHandlers();

      // Keep process alive
      await this.keepAlive();
    } catch (error) {
      this.logger.error("[MCP Server] Failed to start", {
        error: error instanceof Error ? error.message : String(error),
      });
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    this.logger.info("[MCP Server] Stopping...");

    if (this.transport) {
      await this.transport.stop();
      this.transport = undefined;
    }

    this.running = false;
    this.logger.info("[MCP Server] Server stopped");
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
  private setupShutdownHandlers(): void {
    const shutdown = async (signal: string): Promise<void> => {
      this.logger.info(`[MCP Server] Received ${signal}, shutting down...`);
      await this.stop();
      process.exit(0);
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      this.logger.error("[MCP Server] Uncaught exception", {
        error: error.message,
        stack: error.stack,
      });
      void shutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason) => {
      this.logger.error("[MCP Server] Unhandled rejection", {
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
