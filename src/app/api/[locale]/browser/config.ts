/**
 * Chrome DevTools MCP Configuration
 * Configuration for the Chrome DevTools MCP server integration
 */

import "server-only";

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
 */
export const CHROME_REMOTE_DEBUG_PORT = 9222;

/**
 * Default Chrome DevTools MCP configuration.
 * Connects to a shared Chrome instance via --browserUrl instead of launching
 * its own Chrome - this allows multiple Bun processes (hermes, hermes-dev,
 * Claude Code) to share one Chrome without profile-lock conflicts.
 */
export const chromeMCPConfig: ChromeMCPConfig = {
  command: "node_modules/.bin/chrome-devtools-mcp",
  args: [`--browserUrl=http://127.0.0.1:${CHROME_REMOTE_DEBUG_PORT}`],
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

/**
 * Get MCP server configuration for external clients
 * Returns the configuration that can be used in MCP client config files
 */
export const getMCPServerConfig = (): {
  mcpServers: {
    "Chrome Dev Tools": {
      command: string;
      args: string[];
      env?: Record<string, string>;
    };
  };
} => {
  const config = getChromeMCPConfig();
  return {
    mcpServers: {
      "Chrome Dev Tools": {
        command: config.command,
        args: config.args,
        env: config.env,
      },
    },
  };
};
