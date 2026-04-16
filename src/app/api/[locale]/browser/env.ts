/**
 * Browser Module Environment Configuration
 */

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

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
