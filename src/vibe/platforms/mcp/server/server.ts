#!/usr/bin/env node
/**
 * MCP Server Entry Point
 * Main server class that ties together transport and protocol handler
 */

import "server-only";

import type { IDefinitionLoader } from "next-vibe/core/definition/loader";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { IDefinitionsRegistry } from "next-vibe/core/route/definitions-registry";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { MCPRegistry } from "../registry";
import { createMCPProtocolHandler } from "./protocol-handler";
import { StdioTransport } from "./stdio-transport";

/**
 * MCP Server
 */
export class MCPServer {
  private transport?: StdioTransport;
  private running = false;
  private readonly registry?: MCPRegistry;
  private readonly defRegistry?: IDefinitionsRegistry;
  private readonly definitionLdr?: IDefinitionLoader;
  private protocolHandler?: ReturnType<typeof createMCPProtocolHandler>;

  constructor(
    registry?: MCPRegistry,
    defRegistry?: IDefinitionsRegistry,
    definitionLdr?: IDefinitionLoader,
  ) {
    this.registry = registry;
    this.defRegistry = defRegistry;
    this.definitionLdr = definitionLdr;
  }

  /**
   * Start the MCP server
   */
  async start(
    logger: EndpointLogger,
    locale: CountryLanguage,
    user: JwtPayloadType,
  ): Promise<void> {
    if (this.running) {
      logger.warn("[MCP Server] Server already running");
      return;
    }

    const isMCPServerEnabled = process.env.VIBE_MCP_DISABLED !== "true";
    if (!isMCPServerEnabled) {
      logger.error("[MCP Server] MCP server is disabled");
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- MCP server infrastructure requires throwing for disabled server
      throw new Error("MCP server is disabled");
    }

    try {
      logger.debug(
        // eslint-disable-next-line i18next/no-literal-string
        `[MCP Server] Starting locale=${String(locale)} debug=${String(logger.isDebugEnabled)} root=${process.env["PROJECT_ROOT"] ?? process.cwd()}`,
      );

      // Create protocol handler
      this.protocolHandler = createMCPProtocolHandler(
        logger,
        locale,
        user,
        this.registry,
        this.defRegistry,
        this.definitionLdr,
      );

      // Create transport
      this.transport = new StdioTransport(logger);

      // Connect transport to protocol handler
      this.transport.onMessage(async (request) => {
        const response = await this.protocolHandler!.handleRequest(request);

        // Only send response if request had an ID (not a notification)
        // JSON-RPC 2.0: notifications (id: null) must not receive responses
        if (request.id !== null && request.id !== undefined) {
          await this.transport!.send(response);
        }
      });

      // Start transport
      await this.transport.start();

      this.running = true;
      logger.debug("[MCP Server] Started");

      // Setup graceful shutdown
      this.setupShutdownHandlers(logger);

      // Keep process alive
      await this.keepAlive();
    } catch (error) {
      logger.error("[MCP Server] Failed to start", {
        error: parseError(error).message,
      });
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Re-throw MCP server startup errors for caller to handle
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

    // Abort any in-flight tool calls before tearing down the transport
    if (this.protocolHandler) {
      this.protocolHandler.abortAllToolCalls();
      this.protocolHandler = undefined;
    }

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
      logger.error("[MCP Server] Uncaught exception (non-fatal)", {
        name: error.name,
        error: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      });
      // Do NOT exit - log and continue so one bad route import
      // doesn't kill the whole MCP session.
    });

    process.on("unhandledRejection", (reason) => {
      const isError = reason instanceof Error;
      logger.error("[MCP Server] Unhandled rejection (non-fatal)", {
        name: isError ? reason.name : undefined,
        reason: isError ? reason.message : String(reason),
        stack: isError
          ? reason.stack?.split("\n").slice(0, 5).join("\n")
          : undefined,
      });
      // Do NOT exit - one bad dynamic import (e.g. server-only in a route)
      // must not kill the whole MCP session.
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
