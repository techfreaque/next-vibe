/**
 * Core Server Environment
 */

import "server-only";

import { z } from "zod";

import { Environment } from "@/app/api/[locale]/shared/utils/env-util";
import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { createSchema } from "./env-client";

export const {
  env,
  schema: envSchema,
  examples: envExamples,
} = defineEnv({
  NODE_ENV: {
    schema: createSchema(
      z.enum(Environment),
      z.enum(Environment).default(Environment.DEVELOPMENT),
    ),
    example: "development",
    comment:
      "vibe dev always uses dev DB on port 5432. vibe build/start in development: auto-manages preview DB on port 5433. vibe build/start in production: no DB setup, expects externally managed database.",
  },
  PROJECT_ROOT: {
    schema: z.string().optional(),
    example: "/path/to/your/project",
    comment:
      "Absolute path to the project root. Mainly needed for MCP servers which often run in a different working directory.",
    commented: true,
  },
  NEXT_PUBLIC_APP_URL: {
    schema: createSchema(z.string().url(), z.string().url().optional()),
    example: "http://localhost:3000",
  },
  NEXT_PUBLIC_PROJECT_URL: {
    schema: z.string().url().default("https://unbottled.ai"),
    example: "https://unbottled.ai",
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
  },
  NEXT_PUBLIC_TEST_SERVER_URL: {
    schema: createSchema(z.string().url(), z.string().url().optional()),
    example: "http://localhost:4000",
  },
  DATABASE_URL: {
    schema: createSchema(z.string().url(), z.string().url().optional()),
    example: "postgres://localhost:5432/postgres",
    comment: "Database",
  },
  PREVIEW_DB_PORT: {
    schema: z.coerce.number().int().positive().optional().default(5433),
    example: "5433",
    comment:
      "Preview database port for local mode (vibe build/start). Derives DATABASE_URL by swapping the port.",
  },
  PREVIEW_PORT: {
    schema: z.coerce.number().int().positive().optional().default(3001),
    example: "3001",
    comment:
      "Preview app port for local mode (vibe build/start). Derives NEXT_PUBLIC_APP_URL by swapping the port.",
  },
  JWT_SECRET_KEY: {
    schema: createSchema(z.string().min(32), z.string().min(32).optional()),
    example: "your-secret-key-min-32-chars!!",
    comment: "JWT secret",
  },
  CRON_SECRET: {
    schema: createSchema(z.string().min(32), z.string().min(32).optional()),
    example: "your-cron-secret-min-32-chars!!",
  },
  INSTANCE_ID: {
    schema: z.string().min(1).optional(),
    example: "hermes",
    comment:
      "Unique instance identifier for task routing. Tasks with a targetInstance only run on the matching instance. E.g. 'hermes', 'thea-prod', 'thea-dev'.",
  },
  KNOWN_INSTANCE_IDS: {
    schema: z
      .string()
      .optional()
      .transform((v) =>
        v
          ? v
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      ),
    example: "hermes-max,hermes-laura,thea-prod",
    comment:
      "Comma-separated list of all known instance IDs. Used in system prompt so the AI knows which instances it can route tasks to.",
    commented: true,
  },
  THEA_REMOTE_URL: {
    schema: z.string().url().optional(),
    example: "https://unbottled.ai",
    comment:
      "Remote Thea instance URL for task sync. Local instance polls this for new tasks.",
    commented: true,
  },
  THEA_REMOTE_API_KEY: {
    schema: z.string().min(32).optional(),
    example: "your-remote-api-key-min-32-chars-here",
    comment:
      "Shared API key for task sync between local and remote Thea instances.",
    commented: true,
  },
  THEA_REMOTE_LEAD_ID: {
    schema: z.string().uuid().optional(),
    example: false,
    comment:
      "Lead ID cookie for remote Thea instance. Get by visiting the remote URL once and copying the lead_id cookie.",
  },
  PULSE_INTERVAL_MINUTES: {
    schema: z.coerce.number().int().positive().optional(),
    example: "1",
    comment: "Pulse runner interval in minutes (default: 1)",
  },
  ENABLE_ANALYTICS: {
    schema: createSchema(
      z.string().transform((v) => v === "true"),
      z
        .string()
        .optional()
        .default("false")
        .transform((v) => v === "true"),
    ),
    example: "false",
  },
  VIBE_ADMIN_USER_EMAIL: {
    schema: z.email(),
    example: "admin@example.com",
    comment:
      "Root admin email. Used for CLI auth, API tool access, and all admin endpoints. Change via the app syncs to DB.",
    commented: true,
  },
  VIBE_ADMIN_USER_PASSWORD: {
    schema: z.string().min(8),
    example: "your-admin-password",
    comment:
      "Root admin password. Protects all exposed tools/endpoints. Use a strong password in production! Change via the app syncs to DB.",
    commented: true,
  },
  VIBE_CLI_LOCALE: {
    schema: (z.string() as z.Schema<CountryLanguage>)
      .optional()
      .default(defaultLocale),
    example: defaultLocale,
    comment: "CLI locale setting",
  },
});
