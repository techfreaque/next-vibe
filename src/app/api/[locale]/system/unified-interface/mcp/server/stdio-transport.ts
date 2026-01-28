/**
 * MCP STDIO Transport
 * Handles communication via stdin/stdout
 */

import * as readline from "node:readline";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { JsonRpcRequest, JsonRpcResponse } from "../types";

/**
 * MCP Transport Interface
 */
export interface IMCPTransport {
  start(): Promise<void>;
  stop(): Promise<void>;
  send(message: JsonRpcResponse): Promise<void>;
  onMessage(handler: (message: JsonRpcRequest) => Promise<void>): void;
}

/**
 * STDIO Transport Implementation
 */
export class StdioTransport implements IMCPTransport {
  private logger: EndpointLogger;
  private messageHandler?: (message: JsonRpcRequest) => Promise<void>;
  private readlineInterface?: readline.Interface;
  private running = false;
  private initializationReceived = false;
  private startupTimeout?: ReturnType<typeof setTimeout>;

  constructor(logger: EndpointLogger) {
    this.logger = logger;
  }

  /**
   * Start the transport
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async start(): Promise<void> {
    if (this.running) {
      return;
    }

    this.logger.info("[MCP Transport] Starting STDIO transport...");

    // Create readline interface
    // NOTE: Do NOT set output to process.stdout - it interferes with MCP protocol
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      terminal: false,
    });

    // Handle incoming lines
    this.readlineInterface.on("line", (line: string) => {
      void this.handleIncomingMessage(line);
    });

    // Handle close
    this.readlineInterface.on("close", () => {
      this.logger.info("[MCP Transport] STDIO closed");
      this.running = false;
    });

    // Handle errors
    process.stdin.on("error", (error: Error) => {
      this.logger.error("[MCP Transport] stdin error", {
        error: error.message,
      });
    });

    process.stdout.on("error", (error: Error) => {
      this.logger.error("[MCP Transport] stdout error", {
        error: error.message,
      });
    });

    this.running = true;
    this.logger.info("[MCP Transport] STDIO transport started");

    // Set up startup timeout - exit if no initialization within 5 seconds
    // This prevents hanging when health checks don't send initialization
    const timeoutMs = parseInt(process.env.MCP_STARTUP_TIMEOUT || "5000", 10);
    this.startupTimeout = setTimeout(() => {
      if (!this.initializationReceived) {
        this.logger.warn(
          "[MCP Transport] No initialization received within timeout, exiting",
        );
        process.exit(0);
      }
    }, timeoutMs);
  }

  /**
   * Stop the transport
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    this.logger.info("[MCP Transport] Stopping STDIO transport...");

    if (this.startupTimeout) {
      clearTimeout(this.startupTimeout);
      this.startupTimeout = undefined;
    }

    if (this.readlineInterface) {
      this.readlineInterface.close();
      this.readlineInterface = undefined;
    }

    this.running = false;
    this.logger.info("[MCP Transport] STDIO transport stopped");
  }

  /**
   * Send a message
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async send(message: JsonRpcResponse): Promise<void> {
    if (!this.running) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Transport infrastructure requires throwing for invalid state
      throw new Error("Transport not running");
    }

    try {
      const json = JSON.stringify(message);

      // Write to stdout with newline (MCP protocol)
      // eslint-disable-next-line i18next/no-literal-string
      process.stdout.write(`${json}\n`);
    } catch (error) {
      this.logger.error("[MCP Transport] Failed to send message", {
        error: parseError(error).message,
      });
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Re-throw transport errors for caller to handle
      throw error;
    }
  }

  /**
   * Register message handler
   */
  onMessage(handler: (message: JsonRpcRequest) => Promise<void>): void {
    this.messageHandler = handler;
  }

  /**
   * Handle incoming message
   */
  private async handleIncomingMessage(line: string): Promise<void> {
    if (!line.trim()) {
      return; // Ignore empty lines
    }

    try {
      const message = JSON.parse(line) as JsonRpcRequest;

      // Mark initialization as received if this is an initialize method
      if (message.method === "initialize") {
        this.initializationReceived = true;
        if (this.startupTimeout) {
          clearTimeout(this.startupTimeout);
          this.startupTimeout = undefined;
        }
      }

      if (!this.messageHandler) {
        this.logger.warn("[MCP Transport] No message handler registered");
        return;
      }

      await this.messageHandler(message);
    } catch (error) {
      const parsedError = parseError(error);
      this.logger.error("[MCP Transport] Failed to handle message", {
        error: parsedError.message,
        line: line.slice(0, 100), // Log first 100 chars
      });

      // Send error response if we can parse the ID
      try {
        const partialMessage = JSON.parse(line) as { id?: string | number };
        await this.send({
          jsonrpc: "2.0",
          error: {
            code: -32700,
            // eslint-disable-next-line i18next/no-literal-string
            message: "Parse error",
          },
          id: partialMessage.id || null,
        });
      } catch {
        // Can't even parse for ID, ignore
      }
    }
  }
}
