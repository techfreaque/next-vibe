/**
 * Logger Environment
 */

import "server-only";

import { z } from "zod";

import {
  cliArgs,
  isDevCommand,
  isHermesDev,
  isMcpCommand,
  isPreviewMode,
  isStartCommand,
} from "@/vibe/env/detect";

import { defineEnv } from "../env/define-env";

type VibeServerMode = "atlas-dev" | "hermes-dev" | "hermes-prod" | "mcp";

const vibeServerMode: VibeServerMode = isMcpCommand
  ? "mcp"
  : isStartCommand
    ? "hermes-prod"
    : isHermesDev
      ? "hermes-dev"
      : "atlas-dev";

const LOG_FILE_BY_MODE: Record<VibeServerMode, string> = {
  "atlas-dev": ".atlas.log",
  "hermes-dev": ".hermes-dev.log",
  "hermes-prod": ".hermes.log",
  mcp: ".vibe-mcp.log",
};

export const {
  env: loggerEnv,
  schema: loggerEnvSchema,
  examples: loggerEnvExamples,
} = defineEnv({
  VIBE_SERVER_MODE: {
    schema: z
      .enum(["atlas-dev", "hermes-dev", "hermes-prod", "mcp"])
      .default(vibeServerMode),
    example: false,
    comment:
      "Stable server mode marker for log routing. Auto-detected from argv: atlas-dev (vibe dev), hermes-dev (vibe --hermes dev), hermes-prod (vibe start/build/rebuild), mcp (vibe mcp). Set automatically — no need to configure manually.",
    commented: true,
  },
  VIBE_PID: {
    schema: z.string().default(String(process.pid)),
    example: false,
    comment:
      "Vibe runtime process ID. Set automatically at startup - no need to configure manually.",
    commented: true,
  },
  VIBE_START_TIME: {
    schema: z
      .string()
      .default(process.env["VIBE_START_TIME"] ?? String(Date.now())),
    example: false,
    comment:
      "Process start timestamp (ms). Inherited from parent process when available so all sub-processes share the same origin. Set automatically.",
    commented: true,
  },
  NEXT_PUBLIC_VIBE_DEBUG: {
    schema: z
      .string()
      .optional()
      .default(
        cliArgs.includes("--verbose") ||
          cliArgs.includes("-v") ||
          process.env["NEXT_PUBLIC_VIBE_DEBUG"] === "true"
          ? "true"
          : "false",
      )
      .transform((v) => v === "true"),
    example: "false",
    comment:
      "Enable verbose debug logging across the full stack, including the browser client. Two ways to activate: (1) pass -v or --verbose to any vibe command - detected at startup and baked into the build automatically; (2) set NEXT_PUBLIC_VIBE_DEBUG=true in .env for a persistent always-on debug build.",
    commented: true,
    fieldType: "boolean",
  },
  VIBE_LOG_TARGET: {
    schema: z
      .enum(["file", "db", "none"])
      .optional()
      .default(
        vibeServerMode === "hermes-prod" &&
          process.env["NODE_ENV"] === "production"
          ? "db"
          : "file",
      ),
    example: "file",
    comment:
      "Log persistence target. Auto-resolved from VIBE_SERVER_MODE if not set: atlas-dev/hermes-dev/mcp→file, hermes-prod+production→db. Values: 'file' (write to VIBE_LOG_PATH log files), 'db' (errors+warnings to error_logs table only, no file), 'none' (no persistence).",
    commented: true,
    fieldType: "select",
    options: ["file", "db", "none"],
  },
  VIBE_LOG_PATH: {
    schema: z
      .string()
      .optional()
      .default(isDevCommand || isPreviewMode || isMcpCommand ? ".tmp" : "false")
      .refine((v) => v.length > 0, {
        message: "VIBE_LOG_PATH must be a non-empty directory path",
      }),
    example: ".tmp",
    comment:
      "Directory for server log files (.atlas.log, .hermes.log, .hermes-dev.log, .vibe-mcp.log). Only used when VIBE_LOG_TARGET=file. Defaults to .tmp. Set to an absolute or relative path to change location.",
    commented: true,
    fieldType: "log-path",
  },
  VIBE_LOG_FILE: {
    schema: z.string().optional().default(LOG_FILE_BY_MODE[vibeServerMode]),
    example: false,
    comment:
      "Log filename within VIBE_LOG_PATH. Auto-resolved from VIBE_SERVER_MODE if not set: atlas-dev→.atlas.log, hermes-dev→.hermes-dev.log, hermes-prod→.hermes.log, mcp→.vibe-mcp.log. Override to send all modes to a custom file.",
    commented: true,
  },
  VIBE_LOG_TIMESTAMP: {
    schema: z
      .enum(["elapsed", "iso"])
      .optional()
      .default(
        vibeServerMode === "atlas-dev" || vibeServerMode === "hermes-dev"
          ? "elapsed"
          : "iso",
      ),
    example: false,
    comment:
      "Timestamp format in log files. Auto-resolved from VIBE_SERVER_MODE if not set: elapsed (0.123s) for atlas-dev/hermes-dev, iso (HH:MM:SS.mmm) for hermes-prod/mcp. Only used when VIBE_LOG_TARGET=file.",
    commented: true,
    fieldType: "select",
    options: ["elapsed", "iso"],
  },
});
