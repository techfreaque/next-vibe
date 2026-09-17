/**
 * Chrome DevTools MCP Configuration
 * Configuration for the Chrome DevTools MCP server integration
 */

import "server-only";

import { createRequire } from "node:module";

import { browserEnv } from "./env";

export interface ChromeMCPConfig {
  /** Command to run the MCP server */
  command: string;
  /** Arguments to pass to the MCP server */
  args: string[];
  /** Environment variables for the MCP server */
  env?: Record<string, string>;
  /** Timeout for MCP operations in milliseconds */
  timeout?: number;
  /** Whether to enable debug logging */
  debug?: boolean;
}

/**
 * Port Chrome listens on for remote debugging.
 * All chrome-devtools-mcp instances connect to this shared Chrome process.
 * Overridable via CHROME_REMOTE_DEBUG_PORT.
 */
export const CHROME_REMOTE_DEBUG_PORT = browserEnv.CHROME_REMOTE_DEBUG_PORT;

let chromeDevtoolsMcpBinCache: string | undefined;
/**
 * Resolve the chrome-devtools-mcp entrypoint as an absolute script path
 * rather than going through node_modules/.bin: the .bin entry is a POSIX
 * shell shim that Windows cannot spawn (ENOENT), and a relative path breaks
 * whenever the server process's cwd isn't the repo root. require.resolve
 * gives an absolute, platform-independent path we can run directly with the
 * current runtime.
 */
function chromeDevtoolsMcpBin(): string {
  chromeDevtoolsMcpBinCache ??= createRequire(import.meta.url).resolve(
    "chrome-devtools-mcp/build/src/bin/chrome-devtools-mcp.js",
  );
  return chromeDevtoolsMcpBinCache;
}

/** chrome-devtools-mcp is a Node program - don't inherit Bun as the runtime. */
const nodeRuntime = process.execPath.toLowerCase().includes("bun")
  ? "node"
  : process.execPath;

/**
 * Default Chrome DevTools MCP configuration.
 * Connects to a shared Chrome instance via --browserUrl instead of launching
 * its own Chrome - this allows multiple Bun processes (hermes, atlas,
 * Claude Code) to share one Chrome without profile-lock conflicts.
 */
export const chromeMCPConfig: ChromeMCPConfig = {
  command: nodeRuntime,
  args: [
    chromeDevtoolsMcpBin(),
    `--browserUrl=http://127.0.0.1:${CHROME_REMOTE_DEBUG_PORT}`,
  ],
  env: {},
  timeout: 120000,
  debug: false,
};

/**
 * Get Chrome MCP configuration
 * Allows overriding default config via environment variables
 */
export function getChromeMCPConfig(): ChromeMCPConfig {
  const config = { ...chromeMCPConfig, env: { ...chromeMCPConfig.env } };
  const isLinux = process.platform === "linux";

  // Propagate Linux display env to the MCP subprocess
  if (isLinux) {
    const xdgRuntimeDir =
      process.env["XDG_RUNTIME_DIR"] ??
      `/run/user/${process.getuid?.() ?? 1000}`;
    config.env = { ...config.env, XDG_RUNTIME_DIR: xdgRuntimeDir };

    const waylandDisplay = process.env["WAYLAND_DISPLAY"];
    if (waylandDisplay) {
      config.env = { ...config.env, WAYLAND_DISPLAY: waylandDisplay };
    }

    const display = process.env["DISPLAY"];
    if (display) {
      config.env = { ...config.env, DISPLAY: display };
    }

    const dbusAddr = process.env["DBUS_SESSION_BUS_ADDRESS"];
    if (dbusAddr) {
      config.env = { ...config.env, DBUS_SESSION_BUS_ADDRESS: dbusAddr };
    }
  }

  if (browserEnv.CHROME_MCP_DEBUG) {
    config.debug = true;
  }

  if (browserEnv.CHROME_MCP_TIMEOUT !== undefined) {
    config.timeout = browserEnv.CHROME_MCP_TIMEOUT;
  }

  return config;
}
