/**
 * Core Server Environment
 */

import "server-only";

import { z } from "zod";

import { Environment } from "@/app/api/[locale]/shared/utils/env-util";
import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { DEFAULT_PROJECT_URL } from "./constants";

export const {
  env,
  schema: envSchema,
  examples: envExamples,
} = defineEnv({
  NODE_ENV: {
    schema: z.enum(Environment).default(Environment.DEVELOPMENT),
    example: "development",
    comment:
      "vibe dev always uses dev DB on port 5432. vibe build/start in development: auto-manages preview DB on port 5433. vibe build/start in production: no DB setup, expects externally managed database.",
    fieldType: "select",
    options: ["development", "test", "production"],
  },
  PROJECT_ROOT: {
    schema: z.string().optional(),
    example: "/path/to/your/project",
    comment:
      "Absolute path to the project root. Mainly needed for MCP servers which often run in a different working directory.",
    commented: true,
  },
  NEXT_PUBLIC_APP_URL: {
    schema: z
      .string()
      .url()
      .default("http://localhost:3000")
      .transform((s) => s.replace(/\/$/, "")),
    example: "http://localhost:3000",
    fieldType: "url",
  },
  NEXT_PUBLIC_PROJECT_URL: {
    schema: z.string().url().default(DEFAULT_PROJECT_URL),
    example: DEFAULT_PROJECT_URL,
    fieldType: "url",
  },
  VIBE_PID: {
    schema: z.string().default(String(process.pid)),
    example: false,
    comment:
      "Vibe runtime process ID. Set automatically at startup - no need to configure manually.",
    commented: true,
  },
  IS_PREVIEW_MODE: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v !== "false"),
    example: false,
    commented: true,
    fieldType: "boolean",
  },
  NEXT_PUBLIC_LOCAL_MODE: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v !== "false"),
    example: "true",
    comment:
      "Self-hosted mode. Hides SaaS features (login buttons, lead management), makes AI keys optional, and adjusts navigation. Set automatically by vibe build/start.",
    fieldType: "boolean",
  },
  NEXT_PUBLIC_TEST_SERVER_URL: {
    schema: z.string().url().default("http://localhost:4000"),
    example: "http://localhost:4000",
    fieldType: "url",
  },
  DATABASE_URL: {
    schema: z
      .string()
      .url()
      .default("postgres://postgres:postgres@localhost:5432/postgres"),
    example: "postgres://postgres:postgres@localhost:5432/postgres",
    comment: "Database connection URL",
    sensitive: true,
  },
  PREVIEW_DB_PORT: {
    schema: z.coerce.number().int().positive().optional().default(5433),
    example: "5433",
    comment:
      "Preview database port for local mode (vibe build/start). Derives DATABASE_URL by swapping the port.",
    fieldType: "number",
  },
  PREVIEW_PORT: {
    schema: z.coerce.number().int().positive().optional().default(3001),
    example: "3001",
    comment:
      "Preview app port for local mode (vibe build/start). Derives NEXT_PUBLIC_APP_URL by swapping the port.",
    fieldType: "number",
  },
  JWT_SECRET_KEY: {
    schema: z.string().min(32),
    example: "REPLACE_WITH_openssl_rand_hex_32_output",
    comment:
      "JWT signing secret - MUST be at least 64 random characters in production. Generate with: openssl rand -hex 32",
    sensitive: true,
    onboardingRequired: true,
    onboardingStep: 3,
    onboardingGroup: "security",
    autoGenerate: "hex64" as const,
  },
  CRON_SECRET: {
    schema: z.string().min(32),
    example: "REPLACE_WITH_openssl_rand_hex_32_output",
    comment: "Cron job secret - generate with: openssl rand -hex 32",
    sensitive: true,
    onboardingStep: 3,
    onboardingGroup: "security",
    autoGenerate: "hex64" as const,
  },
  NEXT_PUBLIC_VIBE_IS_CLOUD: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    example: false,
    comment:
      "Set to true on cloud/SaaS instances that receive syncs from users. Disables outbound task/memory sync so the cloud instance never pushes back to user devices.",
    fieldType: "boolean",
  },
  VIBE_REMOTE_URL: {
    schema: z.string().url().default(DEFAULT_PROJECT_URL),
    example: DEFAULT_PROJECT_URL,
    comment: "Remote server URL for `vibe --remote` CLI execution.",
    commented: true,
    fieldType: "url",
  },
  PULSE_INTERVAL_MINUTES: {
    schema: z.coerce.number().int().positive().default(1),
    example: "1",
    comment: "Pulse runner interval in minutes (default: 1)",
    fieldType: "number",
  },
  VIBE_ADMIN_USER_EMAIL: {
    schema: z.email().optional().default("admin@please.change.me"),
    example: "admin@please.change.me",
    comment:
      "Root admin email. Used for CLI auth, API tool access, and all admin endpoints. Change via the app syncs to DB.",
    commented: true,
    onboardingRequired: true,
    onboardingStep: 1,
    onboardingGroup: "admin",
    fieldType: "email",
  },
  VIBE_ADMIN_USER_PASSWORD: {
    schema: z.string().min(8).optional().default("change-me-now"),
    example: "your-admin-password",
    comment:
      "Root admin password. Protects all exposed tools/endpoints. Use a strong password in production! Change via the app syncs to DB.",
    commented: true,
    sensitive: true,
    onboardingRequired: true,
    onboardingStep: 1,
    onboardingGroup: "admin",
  },
  VIBE_CLI_LOCALE: {
    schema: (z.string() as z.Schema<CountryLanguage>)
      .optional()
      .default(defaultLocale),
    example: defaultLocale,
    comment: "CLI locale setting",
    fieldType: "select",
    options: ["en-US", "en-GLOBAL", "de-DE", "de-GLOBAL", "pl-PL", "pl-GLOBAL"],
  },
  NEXT_PUBLIC_VIBE_DEBUG: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    example: "false",
    comment:
      "Enable verbose debug logging across the full stack, including the browser client. Two ways to activate: (1) pass -v or --verbose to any vibe command - detected at startup and baked into the build automatically; (2) set NEXT_PUBLIC_VIBE_DEBUG=true in .env for a persistent always-on debug build.",
    commented: true,
    fieldType: "boolean",
  },
  VIBE_LOG_PATH: {
    schema: z
      .string()
      .optional()
      .default(".tmp")
      .refine((v) => v === "false" || v.length > 0, {
        message:
          "VIBE_LOG_PATH must be a directory path or 'false' to disable file logging",
      }),
    example: ".tmp",
    comment:
      "Directory for server log files (vibe-start.log, vibe-dev.log, vibe-mcp.log). Defaults to .tmp. Set to an absolute or relative path to change location. Set to 'false' to disable file logging entirely. Auto-set by vibe dev/start if not configured.",
    commented: true,
    fieldType: "log-path",
  },
  VIBE_DISABLE_PROXY: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    example: "false",
    comment:
      "Opt out of the built-in Bun HTTP+WebSocket proxy. When true: Next.js runs directly on the main port and the WebSocket sidecar runs on port+1000. Use this when you have your own reverse proxy (Caddy, nginx, etc.) that already forwards /ws to the sidecar port. Your reverse proxy must route /ws → port+1000 and everything else → main port.",
    commented: true,
    fieldType: "boolean",
  },
  WS_PUBSUB_TYPE: {
    schema: z.enum(["local", "redis"]).optional().default("local"),
    example: "local",
    comment:
      "WebSocket pub/sub adapter. 'local' for single-instance (default), 'redis' for multi-instance broadcasting.",
    commented: true,
    fieldType: "select",
    options: ["local", "redis"],
  },
  REDIS_URL: {
    schema: z.string().url().optional(),
    example: "redis://localhost:6379",
    comment:
      "Redis connection URL. Required when WS_PUBSUB_TYPE=redis for cross-instance WebSocket broadcasting.",
    commented: true,
    fieldType: "url",
  },
  DEV_WATCHER_CONTINUOUS: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    example: "false",
    comment:
      "Enable continuous file watching during development. When false (default), generators run once on startup and again when you press 'r' in the terminal - no CPU overhead. When true, generators re-run automatically on every file change. WARNING: continuous mode requires a high-end workstation (64 GB+ RAM, fast multi-core CPU). On less powerful machines it will cause noticeable slowdowns and may make the dev server unresponsive.",
    fieldType: "boolean",
  },
  VIBE_SECRET_KEY: {
    schema: z.string().min(64).optional(),
    example: false,
    comment:
      "Explicit AES-256 encryption key (hex, 64 chars) for sensitive env values at rest. If not set, derived from JWT_SECRET_KEY. Use this in Docker/CI for a fully independent key.",
    sensitive: true,
    commented: true,
  },
});
