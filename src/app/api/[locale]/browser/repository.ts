/**
 * Browser API Repository
 * Business logic for executing Chrome DevTools MCP tools
 */

import "server-only";

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  type ContentBlock,
  type ContentResponse,
  createContentResponse,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { getChromeMCPConfig } from "./config";
import { BrowserTool, BrowserToolStatus } from "./enum";
import type { BrowserT } from "./i18n";

/**
 * Map translation keys to MCP tool names
 */
const TOOL_NAME_MAP: Record<string, string> = {
  [BrowserTool.CLICK]: "click",
  [BrowserTool.DRAG]: "drag",
  [BrowserTool.FILL]: "fill",
  [BrowserTool.FILL_FORM]: "fill_form",
  [BrowserTool.HANDLE_DIALOG]: "handle_dialog",
  [BrowserTool.HOVER]: "hover",
  [BrowserTool.PRESS_KEY]: "press_key",
  [BrowserTool.UPLOAD_FILE]: "upload_file",
  [BrowserTool.CLOSE_PAGE]: "close_page",
  [BrowserTool.LIST_PAGES]: "list_pages",
  [BrowserTool.NAVIGATE_PAGE]: "navigate_page",
  [BrowserTool.NEW_PAGE]: "new_page",
  [BrowserTool.SELECT_PAGE]: "select_page",
  [BrowserTool.WAIT_FOR]: "wait_for",
  [BrowserTool.EMULATE]: "emulate",
  [BrowserTool.RESIZE_PAGE]: "resize_page",
  [BrowserTool.PERFORMANCE_ANALYZE_INSIGHT]: "performance_analyze_insight",
  [BrowserTool.PERFORMANCE_START_TRACE]: "performance_start_trace",
  [BrowserTool.PERFORMANCE_STOP_TRACE]: "performance_stop_trace",
  [BrowserTool.GET_NETWORK_REQUEST]: "get_network_request",
  [BrowserTool.LIST_NETWORK_REQUESTS]: "list_network_requests",
  [BrowserTool.EVALUATE_SCRIPT]: "evaluate_script",
  [BrowserTool.GET_CONSOLE_MESSAGE]: "get_console_message",
  [BrowserTool.LIST_CONSOLE_MESSAGES]: "list_console_messages",
  [BrowserTool.TAKE_SCREENSHOT]: "take_screenshot",
  [BrowserTool.TAKE_SNAPSHOT]: "take_snapshot",
};

/**
 * MCP bridge response — the shape executeTool always returns
 */
export interface MCPBridgeResponse {
  success: boolean;
  result: Array<{
    type: string;
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  status: string[];
  executionId: string;
}

/**
 * Browser repository interface
 */
export interface BrowserRepository {
  executeTool(
    data: { tool: string; arguments?: string },
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MCPBridgeResponse> | ContentResponse>;
}

/**
 * MCP JSON-RPC message types
 */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

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
    data: { tool: string; arguments?: string },
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MCPBridgeResponse> | ContentResponse> {
    logger.info("[Browser Repository] Executing Chrome DevTools tool", {
      tool: data.tool,
      hasArguments: !!data.arguments,
    });

    try {
      // Ensure MCP server is running
      const serverReady = await this.ensureMCPServer(logger);
      if (!serverReady) {
        return fail({
          message: t("repository.mcp.connect.failedToInitialize"),
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
            error:
              parseError instanceof Error
                ? parseError.message
                : String(parseError),
          });
          return fail({
            message: t("repository.mcp.tool.call.invalidJsonArguments"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      // Execute the tool with mapped name
      const result = await this.callTool(mcpToolName, parsedArgs, logger);

      const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      // Check for MCP tool-level errors (isError flag in content response)
      const mcpResult = result.result as
        | {
            content?: Array<{
              type: string;
              text?: string;
              data?: string;
              mimeType?: string;
            }>;
            isError?: boolean;
          }
        | undefined;

      const isToolError = mcpResult?.isError === true;
      const toolSuccess = result.success && !isToolError;

      logger.info("[Browser Repository] Tool execution completed", {
        tool: data.tool,
        success: toolSuccess,
        executionId,
      });

      // Extract content from MCP response
      const content = mcpResult?.content ?? [];

      // On error, wrap the error message into a content block
      const resultContent = toolSuccess
        ? content
        : result.error
          ? [{ type: "text" as const, text: result.error }]
          : content;

      // If result contains image blocks, return as ContentResponse
      // so MCP clients and AI models can render/see images natively
      const hasImages = resultContent.some((block) => block.type === "image");
      if (hasImages && toolSuccess) {
        const contentBlocks: ContentBlock[] = [];
        for (const block of resultContent) {
          if (block.type === "image" && block.data && block.mimeType) {
            contentBlocks.push({
              type: "image",
              data: block.data,
              mimeType: block.mimeType,
            });
          } else if (block.type === "text" && block.text) {
            contentBlocks.push({ type: "text", text: block.text });
          }
        }
        return createContentResponse(contentBlocks);
      }

      return success({
        success: toolSuccess,
        result: resultContent,
        status: [
          toolSuccess ? BrowserToolStatus.COMPLETED : BrowserToolStatus.FAILED,
        ],
        executionId,
      });
    } catch (error) {
      logger.error("[Browser Repository] Tool execution error", {
        tool: data.tool,
        error: error instanceof Error ? error.message : String(error),
      });

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return fail({
        message: t("repository.mcp.tool.call.executionFailed"),
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
  private sendRequest(
    request: MCPRequest,
    logger: EndpointLogger,
  ): Promise<MCPResponse> {
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
