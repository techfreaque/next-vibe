/**
 * MCP STDIO Transport
 * Handles communication via stdin/stdout
 */

import * as readline from "readline";

import type { EndpointLogger } from "../../cli/vibe/endpoints/endpoint-handler/logger";
import type { IMCPTransport, JsonRpcRequest, JsonRpcResponse } from "../types";

/**
 * STDIO Transport Implementation
 */
export class StdioTransport implements IMCPTransport {
  private logger: EndpointLogger;
  private messageHandler?: (message: JsonRpcRequest) => Promise<void>;
  private readlineInterface?: readline.Interface;
  private running = false;

  constructor(logger: EndpointLogger) {
    this.logger = logger;
  }

  /**
   * Start the transport
   */
  async start(): Promise<void> {
    if (this.running) {
      return;
    }

    this.logger.info("[MCP Transport] Starting STDIO transport...");

    // Create readline interface
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
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
    process.stdin.on("error", (error) => {
      this.logger.error("[MCP Transport] stdin error", {
        error: error.message,
      });
    });

    process.stdout.on("error", (error) => {
      this.logger.error("[MCP Transport] stdout error", {
        error: error.message,
      });
    });

    this.running = true;
    this.logger.info("[MCP Transport] STDIO transport started");
  }

  /**
   * Stop the transport
   */
  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    this.logger.info("[MCP Transport] Stopping STDIO transport...");

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
  async send(message: JsonRpcResponse): Promise<void> {
    if (!this.running) {
      throw new Error("Transport not running");
    }

    try {
      const json = JSON.stringify(message);
      this.logger.debug("[MCP Transport] Sending message", {
        id: message.id,
        hasError: !!message.error,
      });

      // Write to stdout with newline
      process.stdout.write(`${json}\n`);
    } catch (error) {
      this.logger.error("[MCP Transport] Failed to send message", {
        error: error instanceof Error ? error.message : String(error),
      });
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
      this.logger.debug("[MCP Transport] Received message", {
        length: line.length,
      });

      const message = JSON.parse(line) as JsonRpcRequest;

      if (!this.messageHandler) {
        this.logger.warn("[MCP Transport] No message handler registered");
        return;
      }

      await this.messageHandler(message);
    } catch (error) {
      this.logger.error("[MCP Transport] Failed to handle message", {
        error: error instanceof Error ? error.message : String(error),
        line: line.substring(0, 100), // Log first 100 chars
      });

      // Send error response if we can parse the ID
      try {
        const partialMessage = JSON.parse(line) as { id?: string | number };
        await this.send({
          jsonrpc: "2.0",
          error: {
            code: -32700,
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
