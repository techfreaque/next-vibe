/**
 * Browser API Repository
 *
 * One shared chrome-devtools-mcp process per Bun server instance.
 * Session ID = String(process.pid) - stable for the server lifetime, unique per instance.
 * Each session owns one Chrome tab via chrome-devtools-mcp's new_page tool.
 * select_page + tool call are serialized atomically via a mutex so concurrent
 * requests within a server don't stomp each other's selected page.
 * When Chrome closes, chrome-devtools-mcp exits → MCP process dies cleanly.
 */

import "server-only";

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  type ContentBlock,
  type ContentResponse,
  createContentResponse,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { env } from "@/config/env";

import { CHROME_REMOTE_DEBUG_PORT, getChromeMCPConfig } from "./config";
import { BrowserTool, BrowserToolStatus } from "./enum";
import { browserEnv } from "./env";
import type { BrowserT } from "./i18n";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

interface MCPRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: Record<string, WidgetData>;
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: number;
  result?: WidgetData;
  error?: { code: number; message: string; data?: WidgetData };
}

interface PendingRequest {
  resolve: (r: MCPResponse) => void;
  reject: (e: Error) => void;
}

/** Shared chrome-devtools-mcp process (one per Bun server instance). */
interface MCPProcess {
  proc: ChildProcess;
  nextId: number;
  pending: Map<number, PendingRequest>;
  initialized: boolean;
  mutex: Promise<void>;
}

/** Per-session state: which Chrome tab this session owns, tracked by stable CDP target ID. */
interface SessionState {
  /** Stable Chrome-level target ID (hex string from /json endpoint). Survives chrome-devtools-mcp restarts. */
  cdpTargetId: string;
  /** Current MCP integer page ID - reassigned each time chrome-devtools-mcp restarts. */
  mcpPageId: number;
}

// ---------------------------------------------------------------------------
// Shared chrome-devtools-mcp process singleton
// Stored on globalThis so it survives hot-reload module re-imports within the
// same MCP process. Each dynamic import() re-executes the module, but
// globalThis persists for the lifetime of the process.
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var __sharedMCP: MCPProcess | null | undefined;
  // eslint-disable-next-line no-var
  var __browserSessions: Map<string, SessionState> | undefined;
}

function getSharedMCP(): MCPProcess | null {
  return globalThis.__sharedMCP ?? null;
}
function setSharedMCP(mcp: MCPProcess | null): void {
  globalThis.__sharedMCP = mcp;
}

function isMCPAlive(mcp: MCPProcess): boolean {
  return mcp.proc.exitCode === null && mcp.proc.pid !== undefined;
}

function createMCPProcess(logger: EndpointLogger): MCPProcess {
  const config = getChromeMCPConfig();
  const proc = spawn(config.command, config.args, {
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, ...config.env },
  });

  const mcp: MCPProcess = {
    proc,
    nextId: 1,
    pending: new Map(),
    initialized: false,
    mutex: Promise.resolve(),
  };

  let buf = "";
  proc.stdout?.on("data", (chunk: Buffer) => {
    buf += chunk.toString();
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }
      try {
        const msg = JSON.parse(line) as MCPResponse;
        const cb = mcp.pending.get(msg.id);
        if (cb) {
          mcp.pending.delete(msg.id);
          if (msg.error) {
            cb.reject(new Error(msg.error.message));
          } else {
            cb.resolve(msg);
          }
        }
      } catch {
        // ignore unparseable lines
      }
    }
  });

  proc.stderr?.on("data", (chunk: Buffer) => {
    logger.warn("[Browser] chrome-devtools-mcp stderr", {
      data: chunk.toString().trim(),
    });
  });

  proc.on("exit", (code) => {
    logger.warn("[Browser] chrome-devtools-mcp exited", { code });
    for (const cb of mcp.pending.values()) {
      cb.reject(new Error("chrome-devtools-mcp exited"));
    }
    mcp.pending.clear();
    sessions.clear();
    if (getSharedMCP() === mcp) {
      setSharedMCP(null);
    }
  });

  return mcp;
}

function sendRaw(mcp: MCPProcess, req: MCPRequest): Promise<MCPResponse> {
  return new Promise((resolve, reject) => {
    mcp.pending.set(req.id, { resolve, reject });
    mcp.proc.stdin?.write(`${JSON.stringify(req)}\n`);
    setTimeout(() => {
      if (mcp.pending.has(req.id)) {
        mcp.pending.delete(req.id);
        reject(new Error(`chrome-devtools-mcp timeout: ${req.method}`));
      }
    }, 120_000);
  });
}

async function ensureMCP(logger: EndpointLogger): Promise<MCPProcess | null> {
  const existing = getSharedMCP();
  if (existing && isMCPAlive(existing)) {
    return existing;
  }

  logger.info("[Browser] Starting chrome-devtools-mcp");
  const mcp = createMCPProcess(logger);

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 2000);
  });

  try {
    const resp = await sendRaw(mcp, {
      jsonrpc: "2.0",
      id: mcp.nextId++,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: { listChanged: true } },
        clientInfo: { name: "next-vibe-browser", version: "1.0.0" },
      },
    });
    if (resp.error) {
      logger.error("[Browser] chrome-devtools-mcp init error", {
        message: resp.error.message,
      });
      mcp.proc.kill();
      return null;
    }
    mcp.initialized = true;
    setSharedMCP(mcp);
    logger.info("[Browser] chrome-devtools-mcp ready");
    return mcp;
  } catch (e) {
    logger.error("[Browser] chrome-devtools-mcp init failed", {
      error: e instanceof Error ? e.message : String(e),
    });
    mcp.proc.kill();
    return null;
  }
}

// ---------------------------------------------------------------------------
// Chrome management
// ---------------------------------------------------------------------------

async function isChromeReady(): Promise<boolean> {
  try {
    const r = await fetch(
      `http://127.0.0.1:${CHROME_REMOTE_DEBUG_PORT}/json/version`,
      { signal: AbortSignal.timeout(1000) },
    );
    return r.ok;
  } catch {
    return false;
  }
}

function findChromeBinary(): string {
  if (browserEnv.CHROME_EXECUTABLE_PATH) {
    return browserEnv.CHROME_EXECUTABLE_PATH;
  }
  const candidates =
    process.platform === "darwin"
      ? [
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ]
      : process.platform === "win32"
        ? ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/snap/bin/chromium",
          ];
  return candidates.find(existsSync) ?? "chromium";
}

async function ensureChrome(logger: EndpointLogger): Promise<void> {
  if (await isChromeReady()) {
    return;
  }

  logger.info("[Browser] Launching Chrome");
  const isLinux = process.platform === "linux";
  const waylandDisplay = process.env["WAYLAND_DISPLAY"];
  const userDataDir =
    browserEnv.CHROME_USER_DATA_DIR ??
    `${process.env["HOME"] ?? "/root"}/.cache/chrome-devtools-mcp/chrome-profile`;

  // Use headless mode when explicitly requested, or when on Linux without any
  // display (neither X11 nor Wayland). With a display available, prefer X11
  // over Wayland because Chrome on Wayland needs a visible window to have a
  // compositor surface - without one, Puppeteer screenshots return black.
  const x11Display = process.env["DISPLAY"];
  const noDisplay = isLinux && !x11Display && !waylandDisplay;
  const useHeadless = browserEnv.CHROME_HEADLESS || noDisplay;

  const args = [
    `--remote-debugging-port=${CHROME_REMOTE_DEBUG_PORT}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-sync",
    "--disable-extensions",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-features=IsolateOrigins,site-per-process",
    `--user-data-dir=${userDataDir}`,
    "--no-startup-window",
    ...(useHeadless ? ["--headless=new"] : []),
    // Only use Wayland if X11 is not available. Chrome on Wayland without a
    // visible window cannot capture screenshots (black output).
    ...(isLinux && waylandDisplay && !x11Display
      ? ["--enable-features=UseOzonePlatform", "--ozone-platform=wayland"]
      : []),
  ];

  const chromeEnv: NodeJS.ProcessEnv = { ...process.env };
  if (isLinux) {
    chromeEnv["XDG_RUNTIME_DIR"] =
      process.env["XDG_RUNTIME_DIR"] ??
      `/run/user/${process.getuid?.() ?? 1000}`;
    if (waylandDisplay) {
      chromeEnv["WAYLAND_DISPLAY"] = waylandDisplay;
    }
    if (process.env["DBUS_SESSION_BUS_ADDRESS"]) {
      chromeEnv["DBUS_SESSION_BUS_ADDRESS"] =
        process.env["DBUS_SESSION_BUS_ADDRESS"];
    }
  }

  const proc = spawn(findChromeBinary(), args, {
    stdio: "ignore",
    detached: true,
    env: chromeEnv,
  });
  proc.unref();

  for (let i = 0; i < 20; i++) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    if (await isChromeReady()) {
      logger.info("[Browser] Chrome ready");
      return;
    }
  }
  logger.warn("[Browser] Chrome did not become ready in time");
}

// ---------------------------------------------------------------------------
// CDP target list (stable Chrome-level IDs, survives chrome-devtools-mcp restarts)
// ---------------------------------------------------------------------------

interface CDPTarget {
  id: string;
  url: string;
  webSocketDebuggerUrl: string;
}

async function listCDPTargets(): Promise<CDPTarget[]> {
  try {
    const resp = await fetch(
      `http://127.0.0.1:${CHROME_REMOTE_DEBUG_PORT}/json`,
      { signal: AbortSignal.timeout(3000) },
    );
    const targets = (await resp.json()) as Array<{
      id: string;
      url: string;
      type: string;
      webSocketDebuggerUrl: string;
    }>;
    return targets.filter((t) => t.type === "page");
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// chrome-devtools-mcp page list (MCP integer IDs - reset on each restart)
// ---------------------------------------------------------------------------

function parsePageList(
  text: string,
): Array<{ id: number; url: string; selected: boolean }> {
  const pages: Array<{ id: number; url: string; selected: boolean }> = [];
  for (const line of text.split("\n")) {
    const m = /^(\d+):\s+(\S+)/.exec(line.trim());
    if (m) {
      pages.push({
        id: parseInt(m[1] ?? "0", 10),
        url: m[2] ?? "",
        selected: line.includes("[selected]"),
      });
    }
  }
  return pages;
}

async function listMCPPages(
  mcp: MCPProcess,
): Promise<Array<{ id: number; url: string; selected: boolean }>> {
  const resp = await sendRaw(mcp, {
    jsonrpc: "2.0",
    id: mcp.nextId++,
    method: "tools/call",
    params: { name: "list_pages", arguments: {} },
  });
  const result = resp.result as
    | { content?: Array<{ type: string; text?: string }> }
    | undefined;
  const text = result?.content?.find((c) => c.type === "text")?.text ?? "";
  return parsePageList(text);
}

// ---------------------------------------------------------------------------
// Per-session state (keyed by sessionId, tracked by stable CDP target ID)
// Persisted to .tmp/browser-sessions.json so it survives process restarts.
// ---------------------------------------------------------------------------

const SESSIONS_FILE = join(process.cwd(), ".tmp", "browser-sessions.json");

function loadSessions(): Map<string, SessionState> {
  try {
    const raw = readFileSync(SESSIONS_FILE, "utf-8");
    const obj = JSON.parse(raw) as Record<
      string,
      { cdpTargetId: string; mcpPageId: number }
    >;
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}

function saveSessions(sessions: Map<string, SessionState>): void {
  try {
    mkdirSync(join(process.cwd(), ".tmp"), { recursive: true });
    const obj: Record<string, SessionState> = {};
    for (const [k, v] of sessions) {
      obj[k] = v;
    }
    writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch {
    // Non-fatal - session will be re-created on next call.
  }
}

// Use globalThis so the Map survives hot-reload module re-imports.
if (!globalThis.__browserSessions) {
  globalThis.__browserSessions = loadSessions();
}
const sessions: Map<string, SessionState> = globalThis.__browserSessions;

/**
 * Find the MCP integer page ID that corresponds to a given CDP target ID.
 * Strategy: list MCP pages, list CDP targets, match by URL if target ID isn't
 * directly readable from MCP output. Falls back to URL matching when needed.
 */
async function findMCPPageForTarget(
  mcp: MCPProcess,
  cdpTargetId: string,
  cdpTargets: CDPTarget[],
): Promise<number | null> {
  const mcpPages = await listMCPPages(mcp);
  const target = cdpTargets.find((t) => t.id === cdpTargetId);
  if (!target) {
    return null;
  }

  // Match by URL - works as long as each tab has a unique URL.
  // For about:blank tabs, match by open count order as fallback.
  const match = mcpPages.find((p) => p.url === target.url);
  return match?.id ?? null;
}

/**
 * Create a new Puppeteer-tracked tab via chrome-devtools-mcp's new_page tool,
 * then immediately identify its CDP target ID via /json HTTP endpoint.
 * Puppeteer-created tabs are the ONLY ones visible to createPagesSnapshot(),
 * so they must be created through MCP, not via /json/new directly.
 */
async function createSessionTab(
  sessionId: string,
  mcp: MCPProcess,
  logger: EndpointLogger,
): Promise<SessionState | null> {
  // Snapshot CDP targets before opening so we can identify the new one.
  const beforeTargets = await listCDPTargets();
  const beforeIds = new Set(beforeTargets.map((t) => t.id));

  // Open via MCP so Puppeteer tracks it.
  const resp = await sendRaw(mcp, {
    jsonrpc: "2.0",
    id: mcp.nextId++,
    method: "tools/call",
    params: { name: "new_page", arguments: { url: "about:blank" } },
  });

  const result = resp.result as
    | { content?: Array<{ type: string; text?: string }> }
    | undefined;
  const text = result?.content?.find((c) => c.type === "text")?.text ?? "";

  // new_page returns the page list with the new page [selected].
  const selectedMatch = /^(\d+):.*\[selected\]/m.exec(text);
  if (!selectedMatch) {
    logger.error("[Browser] new_page did not return selected page", {
      sessionId,
      text,
    });
    return null;
  }
  const mcpPageId = parseInt(selectedMatch[1] ?? "0", 10);

  // Give Chrome a moment to register the new target.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 300);
  });

  // Find the new CDP target ID (the one that wasn't there before).
  const afterTargets = await listCDPTargets();
  const newTarget = afterTargets.find((t) => !beforeIds.has(t.id));
  if (!newTarget) {
    // Fallback: find by about:blank that appeared after.
    logger.warn("[Browser] Could not identify new CDP target by diff", {
      sessionId,
      mcpPageId,
    });
    // Use mcpPageId as best effort without cdpTargetId resolution.
    const state: SessionState = {
      cdpTargetId: `unknown-${mcpPageId}`,
      mcpPageId,
    };
    sessions.set(sessionId, state);
    saveSessions(sessions);
    return state;
  }

  const state: SessionState = {
    cdpTargetId: newTarget.id,
    mcpPageId,
  };
  sessions.set(sessionId, state);
  saveSessions(sessions);
  logger.info("[Browser] Opened session tab via MCP new_page", {
    sessionId,
    cdpTargetId: newTarget.id,
    mcpPageId,
  });
  return state;
}

async function ensureSession(
  sessionId: string,
  mcp: MCPProcess,
  logger: EndpointLogger,
): Promise<SessionState | null> {
  let state: SessionState | undefined | null = sessions.get(sessionId);
  const cdpTargets = await listCDPTargets();

  if (state) {
    // Check whether the CDP target is still alive in Chrome.
    const knownTargetId = state.cdpTargetId;
    const targetAlive =
      knownTargetId.startsWith("unknown-") ||
      cdpTargets.some((t) => t.id === knownTargetId);
    if (!targetAlive) {
      logger.warn("[Browser] Session CDP target closed, reopening", {
        sessionId,
        lostTargetId: knownTargetId,
      });
      sessions.delete(sessionId);
      saveSessions(sessions);
      state = undefined;
    } else if (!knownTargetId.startsWith("unknown-")) {
      // Target is alive - re-resolve MCP integer ID in case chrome-devtools-mcp restarted.
      const mcpId = await findMCPPageForTarget(mcp, knownTargetId, cdpTargets);
      if (mcpId !== null) {
        state.mcpPageId = mcpId;
      }
    }
  }

  if (!state) {
    state = await createSessionTab(sessionId, mcp, logger);
    if (!state) {
      return null;
    }
  }

  // Select our page so all subsequent tool calls operate on it.
  await sendRaw(mcp, {
    jsonrpc: "2.0",
    id: mcp.nextId++,
    method: "tools/call",
    params: { name: "select_page", arguments: { pageId: state.mcpPageId } },
  });

  return state;
}

// ---------------------------------------------------------------------------
// Tool name map
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export class BrowserRepository {
  static async executeTool(
    data: { tool: string; arguments?: string },
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MCPBridgeResponse> | ContentResponse> {
    const sessionId = env.VIBE_PID;
    logger.info("[Browser] Executing tool", {
      tool: data.tool,
      sessionId,
    });

    try {
      await ensureChrome(logger);

      const mcp = await ensureMCP(logger);
      if (!mcp) {
        return fail({
          message: t("repository.mcp.connect.failedToInitialize"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      let parsedArgs: Record<string, WidgetData> = {};
      if (data.arguments) {
        try {
          parsedArgs = JSON.parse(data.arguments) as Record<string, WidgetData>;
        } catch {
          return fail({
            message: t("repository.mcp.tool.call.invalidJsonArguments"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      const mcpToolName = TOOL_NAME_MAP[data.tool] ?? data.tool;

      // Acquire mutex: select_page + tool call are atomic.
      let releaseMutex!: () => void;
      const acquired = new Promise<void>((resolve) => {
        releaseMutex = resolve;
      });
      const prev = mcp.mutex;
      mcp.mutex = prev.then(() => acquired);
      await prev;

      try {
        const state = await ensureSession(sessionId, mcp, logger);
        if (!state) {
          return fail({
            message: t("repository.mcp.connect.failedToInitialize"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        const resp = await sendRaw(mcp, {
          jsonrpc: "2.0",
          id: mcp.nextId++,
          method: "tools/call",
          params: { name: mcpToolName, arguments: parsedArgs },
        });

        const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const mcpResult = resp.result as
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

        const toolSuccess = !resp.error && !mcpResult?.isError;

        // Tab-management tools (new_page, select_page, close_page) explicitly
        // change which page is selected - the session tab should NOT follow.
        // Only follow an unexpected page switch caused by navigation tools
        // (e.g. clicking a link that opens in a new tab).
        const isTabManagementTool =
          mcpToolName === "new_page" ||
          mcpToolName === "select_page" ||
          mcpToolName === "close_page";

        if (toolSuccess && !isTabManagementTool) {
          const text =
            mcpResult?.content?.find((c) => c.type === "text")?.text ?? "";
          const selectedMatch = /^(\d+):.*\[selected\]/m.exec(text);
          if (selectedMatch) {
            const nowSelectedId = parseInt(selectedMatch[1] ?? "0", 10);
            if (nowSelectedId !== state.mcpPageId) {
              const oldTargetId = state.cdpTargetId;
              // Resolve the new CDP target ID for the newly-selected MCP page.
              const nowTargets = await listCDPTargets();
              const nowSelectedUrl =
                parsePageList(text).find((p) => p.id === nowSelectedId)?.url ??
                "";
              const nowTarget = nowTargets.find(
                (tgt) => tgt.url === nowSelectedUrl && tgt.id !== oldTargetId,
              );
              state.mcpPageId = nowSelectedId;
              if (nowTarget) {
                state.cdpTargetId = nowTarget.id;
              }
              sessions.set(sessionId, state);
              saveSessions(sessions);
              logger.info(
                "[Browser] Session tab followed unexpected page switch",
                {
                  sessionId: sessionId,
                  mcpPageId: nowSelectedId,
                  cdpTargetId: state.cdpTargetId,
                },
              );
            }
          }
        }

        const content = mcpResult?.content ?? [];
        const resultContent = toolSuccess
          ? content
          : resp.error
            ? [{ type: "text" as const, text: resp.error.message }]
            : content;

        const hasImages = resultContent.some((b) => b.type === "image");
        if (hasImages && toolSuccess) {
          const blocks: ContentBlock[] = resultContent.map((b) =>
            b.type === "image" && b.data && b.mimeType
              ? { type: "image" as const, data: b.data, mimeType: b.mimeType }
              : { type: "text" as const, text: b.text ?? "" },
          );
          return createContentResponse(blocks);
        }

        return success({
          success: toolSuccess,
          result: resultContent,
          status: [
            toolSuccess
              ? BrowserToolStatus.COMPLETED
              : BrowserToolStatus.FAILED,
          ],
          executionId,
        });
      } finally {
        releaseMutex();
      }
    } catch (error) {
      logger.error("[Browser] Tool execution error", {
        tool: data.tool,
        error: error instanceof Error ? error.message : String(error),
      });
      return fail({
        message: t("repository.mcp.tool.call.executionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
}
