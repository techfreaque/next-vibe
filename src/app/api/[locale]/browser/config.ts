/**
 * Chrome DevTools MCP Configuration
 * Configuration for the Chrome DevTools MCP server integration
 */

import "server-only";

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
 * Default Chrome DevTools MCP configuration
 * Optimized for headless Chromium with Wayland support
 */
export const chromeMCPConfig: ChromeMCPConfig = {
  command: "bunx",
  args: [
    "chrome-devtools-mcp@latest",
    "--executablePath=/usr/bin/chromium",
    "--isolated=false",
    // "--user-data-dir",
    "--chromeArg=--enable-features=UseOzonePlatform",
    "--chromeArg=--ozone-platform=wayland",
    "--chromeArg=--no-sandbox",
    "--chromeArg=--disable-setuid-sandbox",
    "--chromeArg=--disable-dev-shm-usage",
  ],
  env: {
    XDG_RUNTIME_DIR: "/run/user/1000",
    WAYLAND_DISPLAY: "wayland-0",
  },
  timeout: 30000,
  debug: false,
};

/**
 * Get Chrome MCP configuration
 * Allows overriding default config via environment variables
 */
export function getChromeMCPConfig(): ChromeMCPConfig {
  const config = { ...chromeMCPConfig };

  // Override executable path if specified
  if (process.env.CHROME_EXECUTABLE_PATH) {
    const executableArgIndex = config.args.findIndex((arg) => arg.startsWith("--executablePath"));
    if (executableArgIndex !== -1) {
      config.args[executableArgIndex] = `--executablePath=${process.env.CHROME_EXECUTABLE_PATH}`;
    }
  }

  // Override Wayland display if specified
  if (process.env.WAYLAND_DISPLAY) {
    config.env = {
      ...config.env,
      WAYLAND_DISPLAY: process.env.WAYLAND_DISPLAY,
    };
  }

  // Override XDG runtime dir if specified
  if (process.env.XDG_RUNTIME_DIR) {
    config.env = {
      ...config.env,
      XDG_RUNTIME_DIR: process.env.XDG_RUNTIME_DIR,
    };
  }

  // Enable debug mode if specified
  if (process.env.CHROME_MCP_DEBUG === "true") {
    config.debug = true;
  }

  // Override timeout if specified
  if (process.env.CHROME_MCP_TIMEOUT) {
    config.timeout = parseInt(process.env.CHROME_MCP_TIMEOUT, 10);
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
