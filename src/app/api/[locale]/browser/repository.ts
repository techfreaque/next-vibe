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

import { CHROME_REMOTE_DEBUG_PORT, getChromeMCPConfig } from "./config";
import { BrowserTool, BrowserToolStatus } from "./enum";
import type { BrowserT } from "./i18n";

/**
 * MCP bridge response - the shape executeTool always returns
 */
interface MCPBridgeResponse {
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
 * Per-session MCP connection - one chrome-devtools-mcp process per session.
 * Each connects to the shared Chrome via --browserUrl, so they share tabs
 * without sharing a request queue.
 */
interface SessionMCP {
  process: ChildProcess;
  nextRequestId: number;
  pendingRequests: Map<
    number,
    { resolve: (value: MCPResponse) => void; reject: (error: Error) => void }
  >;
  /** chrome-devtools-mcp pageId for this session's dedicated tab. */
  pageId: number | null;
  initialized: boolean;
}

/**
 * Browser repository
 */
export class BrowserRepository {
  /**
   * Map translation keys to MCP tool names
   */
  private static readonly TOOL_NAME_MAP: Record<string, string> = {
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
   * Tools that manage pages - skip pageId injection for these.
   */
  private static readonly PAGE_MGMT_TOOLS = new Set([
    "new_page",
    "close_page",
    "list_pages",
    "select_page",
  ]);

  /** Chrome process launched by this Bun instance (if we started it). */
  private static chromeProcess: ChildProcess | null = null;

  /**
   * Per-session MCP connections.
   * Key: sessionId (auth token / user.id / user.leadId).
   * Each session gets its own chrome-devtools-mcp process so tool calls
   * run in parallel without a shared request queue.
   */
  private static sessions = new Map<string, SessionMCP>();

  /**
   * Execute a Chrome DevTools MCP tool
   */
  static async executeTool(
    data: { tool: string; arguments?: string; sessionId: string },
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MCPBridgeResponse> | ContentResponse> {
    logger.info("[Browser Repository] Executing Chrome DevTools tool", {
      tool: data.tool,
      hasArguments: !!data.arguments,
    });

    try {
      const session = await BrowserRepository.ensureSession(
        data.sessionId,
        logger,
      );
      if (!session) {
        return fail({
          message: t("repository.mcp.connect.failedToInitialize"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const mcpToolName =
        BrowserRepository.TOOL_NAME_MAP[data.tool] || data.tool;

      logger.debug("[Browser Repository] Tool name mapping", {
        translationKey: data.tool,
        mcpToolName,
      });

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

      const result = await BrowserRepository.callTool(
        session,
        mcpToolName,
        parsedArgs,
        logger,
      );

      const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

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

      // After a user-initiated new_page, update session.pageId to the new tab.
      if (mcpToolName === "new_page" && toolSuccess) {
        const text =
          mcpResult?.content?.find((b) => b.type === "text")?.text ?? "";
        const match = /^(\d+):[^\n]*\[selected\]/m.exec(text);
        if (match) {
          session.pageId = parseInt(match[1], 10);
        }
      }

      // If the tool reported "No page found", the session's pageId is stale
      // (e.g. after a server restart Chrome kept running but page IDs reset).
      // Clear it so the next request re-claims a fresh tab automatically.
      const errorText =
        mcpResult?.content?.find((b) => b.type === "text")?.text ?? "";
      if (isToolError && errorText.includes("No page found")) {
        logger.warn(
          "[Browser Repository] Stale pageId detected, resetting session tab",
          {
            sessionId: data.sessionId,
            stalePageId: session.pageId,
          },
        );
        session.pageId = null;
        await BrowserRepository.claimSessionPage(
          session,
          data.sessionId,
          logger,
        );
        // Retry the tool call once with the fresh pageId.
        const retryResult = await BrowserRepository.callTool(
          session,
          mcpToolName,
          parsedArgs,
          logger,
        );
        const retryMcpResult = retryResult.result as typeof mcpResult;
        const retrySuccess =
          retryResult.success && retryMcpResult?.isError !== true;
        const retryContent = retryMcpResult?.content ?? [];
        if (retrySuccess && retryContent.some((b) => b.type === "image")) {
          const contentBlocks: ContentBlock[] = [];
          for (const b of retryContent) {
            if (b.type === "image" && b.data && b.mimeType) {
              contentBlocks.push({
                type: "image",
                data: b.data,
                mimeType: b.mimeType,
              });
            } else if (b.type === "text" && b.text) {
              contentBlocks.push({ type: "text", text: b.text });
            }
          }
          return createContentResponse(contentBlocks);
        }
        return success({
          success: retrySuccess,
          result: retryContent,
          status: [
            retrySuccess
              ? BrowserToolStatus.COMPLETED
              : BrowserToolStatus.FAILED,
          ],
          executionId,
        });
      }

      const content = mcpResult?.content ?? [];

      const resultContent = toolSuccess
        ? content
        : result.error
          ? [{ type: "text" as const, text: result.error }]
          : content;

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
   * Ensure Chrome is running with remote debugging on CHROME_REMOTE_DEBUG_PORT.
   */
  private static async ensureChrome(logger: EndpointLogger): Promise<void> {
    const isReady = await BrowserRepository.isChromeReady();
    if (isReady) {
      logger.info("[Browser Repository] Chrome already running on debug port", {
        port: CHROME_REMOTE_DEBUG_PORT,
      });
      return;
    }

    logger.info("[Browser Repository] Launching Chrome with remote debugging", {
      port: CHROME_REMOTE_DEBUG_PORT,
    });

    const chromeArgs = [
      `--remote-debugging-port=${CHROME_REMOTE_DEBUG_PORT}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      "--disable-sync",
      "--disable-translate",
      "--disable-extensions",
      "--disable-crash-reporter",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--enable-features=UseOzonePlatform",
      "--ozone-platform=wayland",
      `--user-data-dir=${process.env["HOME"] ?? "/root"}/.cache/chrome-devtools-mcp/chrome-profile`,
      "about:blank",
    ];

    BrowserRepository.chromeProcess = spawn(
      process.env["CHROME_EXECUTABLE_PATH"] ?? "/usr/bin/chromium",
      chromeArgs,
      {
        stdio: "ignore",
        detached: false,
        env: {
          ...process.env,
          XDG_RUNTIME_DIR: process.env["XDG_RUNTIME_DIR"] ?? "/run/user/1000",
          WAYLAND_DISPLAY: process.env["WAYLAND_DISPLAY"] ?? "wayland-0",
        },
      },
    );

    BrowserRepository.chromeProcess.on("exit", (code) => {
      logger.warn("[Browser Repository] Chrome process exited", { code });
      BrowserRepository.chromeProcess = null;
    });

    for (let i = 0; i < 20; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });
      if (await BrowserRepository.isChromeReady()) {
        logger.info("[Browser Repository] Chrome is ready", {
          port: CHROME_REMOTE_DEBUG_PORT,
        });
        return;
      }
    }
    logger.warn("[Browser Repository] Chrome did not become ready in time");
  }

  private static async isChromeReady(): Promise<boolean> {
    try {
      const response = await fetch(
        `http://127.0.0.1:${CHROME_REMOTE_DEBUG_PORT}/json/version`,
        { signal: AbortSignal.timeout(1000) },
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get or create the session MCP connection for a caller.
   * Each session gets its own chrome-devtools-mcp process and dedicated tab.
   */
  private static async ensureSession(
    sessionId: string,
    logger: EndpointLogger,
  ): Promise<SessionMCP | null> {
    await BrowserRepository.ensureChrome(logger);

    let session = BrowserRepository.sessions.get(sessionId);

    // (Re)create if missing or dead.
    if (!session || !session.initialized || !session.process.pid) {
      const newSession = await BrowserRepository.createSession(
        sessionId,
        logger,
      );
      if (!newSession) {
        return null;
      }
      session = newSession;
    }

    // Claim a dedicated tab if not yet done.
    if (session.pageId === null) {
      await BrowserRepository.claimSessionPage(session, sessionId, logger);
    }

    return session;
  }

  /**
   * Spawn a new chrome-devtools-mcp process for a session and initialize it.
   */
  private static async createSession(
    sessionId: string,
    logger: EndpointLogger,
  ): Promise<SessionMCP | null> {
    logger.info("[Browser Repository] Creating session MCP process", {
      sessionId,
    });

    const config = getChromeMCPConfig();
    const proc = spawn(config.command, config.args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...config.env },
    });

    const session: SessionMCP = {
      process: proc,
      nextRequestId: 1,
      pendingRequests: new Map(),
      pageId: null,
      initialized: false,
    };

    BrowserRepository.sessions.set(sessionId, session);
    BrowserRepository.setupSessionMessageHandling(session, logger);

    proc.on("error", (error) => {
      logger.error("[Browser Repository] Session MCP process error", {
        sessionId,
        error: error.message,
      });
      session.initialized = false;
    });

    proc.on("exit", (code) => {
      logger.warn("[Browser Repository] Session MCP process exited", {
        sessionId,
        code,
      });
      session.initialized = false;
      // Remove so next call recreates it.
      if (BrowserRepository.sessions.get(sessionId) === session) {
        BrowserRepository.sessions.delete(sessionId);
      }
    });

    // Give the process time to start.
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 3000);
    });

    // Initialize MCP protocol.
    const initRequest: MCPRequest = {
      jsonrpc: "2.0",
      id: session.nextRequestId++,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: { listChanged: true } },
        clientInfo: { name: "next-vibe-browser-api", version: "1.0.0" },
      },
    };

    try {
      const response = await BrowserRepository.sendRequest(
        session,
        initRequest,
        logger,
      );
      if (response.error) {
        logger.error("[Browser Repository] Session MCP init failed", {
          sessionId,
          error: response.error.message,
        });
        return null;
      }
      session.initialized = true;
      logger.info("[Browser Repository] Session MCP initialized", {
        sessionId,
      });
      return session;
    } catch (error) {
      logger.error("[Browser Repository] Session MCP init error", {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Allocate a dedicated browser tab for this session.
   * Parses the pageId from new_page response and stores it on the session.
   */
  private static async claimSessionPage(
    session: SessionMCP,
    sessionId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const result = await BrowserRepository.callTool(
        session,
        "new_page",
        { url: "about:blank" },
        logger,
        true, // skip pageId injection - no tab yet
      );
      if (!result.success) {
        logger.warn(
          "[Browser Repository] new_page failed, using page 1 as fallback",
          { error: result.error, sessionId },
        );
        session.pageId = 1;
        return;
      }
      // Response: "## Pages\n1: about:blank\n2: about:blank [selected]"
      const mcpResult = result.result as
        | { content?: Array<{ type: string; text?: string }> }
        | undefined;
      const text =
        mcpResult?.content?.find((b) => b.type === "text")?.text ?? "";
      const match = /^(\d+):[^\n]*\[selected\]/m.exec(text);
      session.pageId = match ? parseInt(match[1], 10) : 1;
      logger.info("[Browser Repository] Claimed browser tab for session", {
        sessionId,
        pageId: session.pageId,
      });
    } catch (error) {
      logger.warn("[Browser Repository] Could not claim session tab", {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      });
      session.pageId = 1;
    }
  }

  /**
   * Call a tool on the session's own MCP process.
   * Injects pageId so chrome-devtools-mcp targets the session's tab directly.
   * Since each session has its own process with its own queue, calls across
   * sessions run fully in parallel.
   */
  private static async callTool(
    session: SessionMCP,
    toolName: string,
    args: Record<string, JsonValue>,
    logger: EndpointLogger,
    skipPageId = false,
  ): Promise<{ success: boolean; result?: JsonValue; error?: string }> {
    // Inject pageId for page-scoped tools.
    const toolArgs =
      !skipPageId &&
      !BrowserRepository.PAGE_MGMT_TOOLS.has(toolName) &&
      session.pageId !== null
        ? { ...args, pageId: session.pageId }
        : args;

    // If the caller explicitly selects a page, track it.
    if (toolName === "select_page" && typeof args.pageId === "number") {
      session.pageId = args.pageId;
    }

    const toolRequest: MCPRequest = {
      jsonrpc: "2.0",
      id: session.nextRequestId++,
      method: "tools/call",
      params: { name: toolName, arguments: toolArgs },
    };

    try {
      const response = await BrowserRepository.sendRequest(
        session,
        toolRequest,
        logger,
      );
      if (response.error) {
        return { success: false, error: response.error.message };
      }
      return { success: true, result: response.result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Send a JSON-RPC request to the session's MCP process.
   */
  private static sendRequest(
    session: SessionMCP,
    request: MCPRequest,
    logger: EndpointLogger,
  ): Promise<MCPResponse> {
    return new Promise((resolve, reject) => {
      if (!session.process.stdin) {
        reject(new Error("Session MCP process has no stdin"));
        return;
      }

      const id = request.id;
      session.pendingRequests.set(id, { resolve, reject });

      const message = `${JSON.stringify(request)}\n`;
      logger.debug("[Browser Repository] Sending MCP request", {
        method: request.method,
        id,
      });

      session.process.stdin.write(message);

      setTimeout(() => {
        if (session.pendingRequests.has(id)) {
          session.pendingRequests.delete(id);
          reject(new Error(`Request timeout for ${request.method}`));
        }
      }, 120000);
    });
  }

  /**
   * Wire stdout/stderr listeners for a session's MCP process.
   */
  private static setupSessionMessageHandling(
    session: SessionMCP,
    logger: EndpointLogger,
  ): void {
    let buffer = "";

    session.process.stdout?.on("data", (data) => {
      buffer += data.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }
        try {
          const response: MCPResponse = JSON.parse(line);
          logger.debug("[Browser Repository] Received MCP response", {
            id: response.id,
            hasResult: !!response.result,
            hasError: !!response.error,
          });

          const pending = session.pendingRequests.get(response.id);
          if (pending) {
            session.pendingRequests.delete(response.id);
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
    });

    session.process.stderr?.on("data", (data) => {
      logger.warn("[Browser Repository] Session MCP stderr", {
        data: data.toString().trim(),
      });
    });
  }

  /**
   * Clean up all resources.
   */
  static cleanup(): void {
    for (const session of BrowserRepository.sessions.values()) {
      session.process.kill();
    }
    BrowserRepository.sessions.clear();

    if (BrowserRepository.chromeProcess) {
      BrowserRepository.chromeProcess.kill();
      BrowserRepository.chromeProcess = null;
    }
  }
}

// Cleanup on process exit
if (typeof process !== "undefined") {
  process.on("exit", () => {
    BrowserRepository.cleanup();
  });

  process.on("SIGINT", () => {
    BrowserRepository.cleanup();
  });

  process.on("SIGTERM", () => {
    BrowserRepository.cleanup();
    process.exit();
  });
}
