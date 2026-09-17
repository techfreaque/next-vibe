/**
 * Browser Module Environment Configuration
 */

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: browserEnv,
  schema: browserEnvSchema,
  examples: browserEnvExamples,
} = defineEnv({
  CHROME_EXECUTABLE_PATH: {
    schema: z.string().optional(),
    example: "/usr/bin/chromium",
    comment:
      "Absolute path to the Chrome/Chromium binary. Auto-detected from common install paths if unset.",
    commented: true,
  },
  CHROME_REMOTE_DEBUG_PORT: {
    schema: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 9222))
      .pipe(z.number().int().min(1).max(65535)),
    example: "9222",
    comment:
      "Port the shared automation Chrome listens on for remote debugging. Every process on the machine " +
      "attaches to the same port, so this only needs changing to run a fully separate browser (e.g. a test " +
      "suite). Default: 9222.",
    commented: true,
  },
  CHROME_USER_DATA_DIR: {
    schema: z.string().optional(),
    example: "/tmp/chrome-profile",
    comment:
      "Custom Chrome user-data directory. Defaults to ~/.cache/chrome-devtools-mcp/chrome-profile.",
    commented: true,
  },
  CHROME_HEADLESS: {
    schema: z
      .enum(["true", "false"])
      .optional()
      .transform((v) => v === "true"),
    example: "true",
    comment:
      "Launch Chrome in headless mode (required for servers without a display). Default: false.",
    commented: true,
  },
  CHROME_MCP_DEBUG: {
    schema: z
      .enum(["true", "false"])
      .optional()
      .transform((v) => v === "true"),
    example: "true",
    comment:
      "Enable verbose Chrome DevTools MCP debug logging. Default: false.",
    commented: true,
  },
  CHROME_MCP_TIMEOUT: {
    schema: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined)),
    example: "120000",
    comment: "Timeout in ms for Chrome MCP operations. Default: 120000.",
    commented: true,
  },
});
