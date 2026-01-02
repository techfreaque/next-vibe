/**
 * Browser API Repository
 * Business logic for executing Chrome DevTools MCP tools
 */

import "server-only";

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { getChromeMCPConfig } from "./config";
import type { BrowserRequestOutput, BrowserResponseOutput } from "./definition";
import { BrowserTool, BrowserToolStatus } from "./enum";

/**
 * Map translation keys to MCP tool names
 */
const TOOL_NAME_MAP: Record<string, string> = {
  [BrowserTool.CLICK]: "click",
  [BrowserTool.DRAG]: "drag",
  [BrowserTool.FILL]: "fill",
  [BrowserTool.FILL_FORM]: "fill-form",
  [BrowserTool.HANDLE_DIALOG]: "handle-dialog",
  [BrowserTool.HOVER]: "hover",
  [BrowserTool.PRESS_KEY]: "press-key",
  [BrowserTool.UPLOAD_FILE]: "upload-file",
  [BrowserTool.CLOSE_PAGE]: "close-page",
  [BrowserTool.LIST_PAGES]: "list-pages",
  [BrowserTool.NAVIGATE_PAGE]: "navigate-page",
  [BrowserTool.NEW_PAGE]: "new-page",
  [BrowserTool.SELECT_PAGE]: "select-page",
  [BrowserTool.WAIT_FOR]: "wait-for",
  [BrowserTool.EMULATE]: "emulate",
  [BrowserTool.RESIZE_PAGE]: "resize-page",
  [BrowserTool.PERFORMANCE_ANALYZE_INSIGHT]: "performance-analyze-insight",
  [BrowserTool.PERFORMANCE_START_TRACE]: "performance-start-trace",
  [BrowserTool.PERFORMANCE_STOP_TRACE]: "performance-stop-trace",
  [BrowserTool.GET_NETWORK_REQUEST]: "get-network-request",
  [BrowserTool.LIST_NETWORK_REQUESTS]: "list-network-requests",
  [BrowserTool.EVALUATE_SCRIPT]: "evaluate-script",
  [BrowserTool.GET_CONSOLE_MESSAGE]: "get-console-message",
  [BrowserTool.LIST_CONSOLE_MESSAGES]: "list-console-messages",
  [BrowserTool.TAKE_SCREENSHOT]: "take-screenshot",
  [BrowserTool.TAKE_SNAPSHOT]: "take-snapshot",
};

/**
 * Browser repository interface
 */
export interface BrowserRepository {
  /**
   * Execute a Chrome DevTools MCP tool
   * @param data - Request data (tool and arguments)
   * @param logger - Logger instance for debugging and monitoring
   * @returns Tool execution result
   */
  executeTool(
    data: BrowserRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserResponseOutput>>;
}

/**
 * MCP JSON-RPC message types
 */
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface MCPRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: Record<string, JsonValue>;
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: number;
  result?: JsonValue;
  error?: {
    code: number;
    message: string;
    data?: JsonValue;
  };
}

/**
 * Browser repository implementation
 */
export class BrowserRepositoryImpl implements BrowserRepository {
  private mcpProcess: ChildProcess | null = null;
  private nextRequestId = 1;
  private pendingRequests = new Map<
    number,
    { resolve: (value: MCPResponse) => void; reject: (error: Error) => void }
  >();
  private isInitialized = false;

  /**
   * Execute a Chrome DevTools MCP tool
   */
  async executeTool(
    data: BrowserRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserResponseOutput>> {
    logger.info("[Browser Repository] Executing Chrome DevTools tool", {
      tool: data.tool,
      hasArguments: !!data.arguments,
    });

    try {
      // Ensure MCP server is running
      const serverReady = await this.ensureMCPServer(logger);
      if (!serverReady) {
        return fail({
          message: "app.api.browser.repository.mcp.connect.failedToInitialize",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Map translation key to MCP tool name
      const mcpToolName = TOOL_NAME_MAP[data.tool] || data.tool;

      logger.debug("[Browser Repository] Tool name mapping", {
        translationKey: data.tool,
        mcpToolName,
      });

      // Parse arguments
      let parsedArgs: Record<string, JsonValue> = {};
      if (data.arguments) {
        try {
          parsedArgs = JSON.parse(data.arguments) as Record<string, JsonValue>;
        } catch (parseError) {
          logger.warn("[Browser Repository] Failed to parse arguments", {
            arguments: data.arguments,
            error: parseError instanceof Error ? parseError.message : String(parseError),
          });
          return fail({
            message: "app.api.browser.repository.mcp.tool.call.invalidJsonArguments",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      // Execute the tool with mapped name
      const result = await this.callTool(mcpToolName, parsedArgs, logger);

      const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      logger.info("[Browser Repository] Tool execution completed", {
        tool: data.tool,
        success: result.success,
        executionId,
      });

      return success({
        success: result.success,
        result: result.success ? result.result : result.error,
        status: [result.success ? BrowserToolStatus.COMPLETED : BrowserToolStatus.FAILED],
        executionId,
      });
    } catch (error) {
      logger.error("[Browser Repository] Tool execution error", {
        tool: data.tool,
        error: error instanceof Error ? error.message : String(error),
      });

      const errorMessage = error instanceof Error ? error.message : String(error);
      return fail({
        message: "app.api.browser.repository.mcp.tool.call.executionFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }

  /**
   * Ensure the MCP server is running and initialized
   */
  private async ensureMCPServer(logger: EndpointLogger): Promise<boolean> {
    if (this.isInitialized && this.mcpProcess) {
      return true;
    }

    try {
      await this.startMCPServer(logger);
      const initialized = await this.initializeMCP(logger);
      return initialized;
    } catch (error) {
      logger.error("[Browser Repository] Failed to ensure MCP server", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Start the chrome-devtools-mcp server process
   */
  private async startMCPServer(logger: EndpointLogger): Promise<void> {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
    }

    logger.info("[Browser Repository] Starting chrome-devtools-mcp server");

    const config = getChromeMCPConfig();

    this.mcpProcess = spawn(config.command, config.args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...config.env },
    });

    // Set up message handling
    this.setupMessageHandling(logger);

    // Handle process lifecycle
    this.mcpProcess.on("error", (error) => {
      logger.error("[Browser Repository] MCP process error", {
        error: error.message,
      });
      this.isInitialized = false;
    });

    this.mcpProcess.on("exit", (code) => {
      logger.warn("[Browser Repository] MCP process exited", { code });
      this.isInitialized = false;
    });

    // Wait for process to start
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
  }

  /**
   * Initialize MCP connection
   */
  private async initializeMCP(logger: EndpointLogger): Promise<boolean> {
    const initRequest: MCPRequest = {
      jsonrpc: "2.0",
      id: this.nextRequestId++,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: { listChanged: true },
        },
        clientInfo: {
          name: "next-vibe-browser-api",
          version: "1.0.0",
        },
      },
    };

    try {
      const response = await this.sendRequest(initRequest, logger);

      if (response.error) {
        logger.error("[Browser Repository] MCP initialization failed", {
          error: response.error.message,
        });
        return false;
      }

      this.isInitialized = true;
      logger.info("[Browser Repository] MCP server initialized");
      return true;
    } catch (error) {
      logger.error("[Browser Repository] MCP initialization error", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Call a tool via MCP
   */
  private async callTool(
    toolName: string,
    args: Record<string, JsonValue>,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; result?: JsonValue; error?: string }> {
    const toolRequest: MCPRequest = {
      jsonrpc: "2.0",
      id: this.nextRequestId++,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    };

    try {
      const response = await this.sendRequest(toolRequest, logger);

      if (response.error) {
        return {
          success: false,
          error: response.error.message,
        };
      }

      return {
        success: true,
        result: response.result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Send a request to the MCP server
   */
  private sendRequest(request: MCPRequest, logger: EndpointLogger): Promise<MCPResponse> {
    return new Promise((resolve, reject) => {
      if (!this.mcpProcess) {
        reject(new Error("MCP process not running"));
        return;
      }

      const id = request.id;
      this.pendingRequests.set(id, { resolve, reject });

      const message = `${JSON.stringify(request)}\n`;
      logger.debug("[Browser Repository] Sending MCP request", {
        method: request.method,
        id,
      });

      this.mcpProcess.stdin?.write(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout for ${request.method}`));
        }
      }, 30000);
    });
  }

  /**
   * Set up message handling from MCP server
   */
  private setupMessageHandling(logger: EndpointLogger): void {
    if (!this.mcpProcess) {
      return;
    }

    let buffer = "";

    this.mcpProcess.stdout?.on("data", (data) => {
      buffer += data.toString();
      const lines = buffer.split("\n");

      // Keep the last incomplete line in buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          try {
            const response: MCPResponse = JSON.parse(line);
            logger.debug("[Browser Repository] Received MCP response", {
              id: response.id,
              hasResult: !!response.result,
              hasError: !!response.error,
            });

            const pending = this.pendingRequests.get(response.id);
            if (pending) {
              this.pendingRequests.delete(response.id);
              if (response.error) {
                pending.reject(new Error(response.error.message));
              } else {
                pending.resolve(response);
              }
            }
          } catch (error) {
            logger.warn("[Browser Repository] Failed to parse MCP response", {
              line,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      }
    });

    this.mcpProcess.stderr?.on("data", (data) => {
      logger.warn("[Browser Repository] MCP stderr", {
        data: data.toString().trim(),
      });
    });
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
      this.isInitialized = false;
    }
    this.pendingRequests.clear();
  }
}

// Export singleton instance of the repository
export const browserRepository = new BrowserRepositoryImpl();

// Cleanup on process exit
if (typeof process !== "undefined") {
  process.on("exit", () => {
    browserRepository.cleanup();
  });

  process.on("SIGINT", () => {
    browserRepository.cleanup();
    // Don't call process.exit() - let other handlers (like dev server) manage exit
  });

  process.on("SIGTERM", () => {
    browserRepository.cleanup();
    process.exit();
  });
}
