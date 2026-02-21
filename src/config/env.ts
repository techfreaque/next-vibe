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
  },
  PROJECT_ROOT: {
    schema: z.string().optional(),
    example: "/path/to/your/project",
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
      .default("true")
      .transform((v) => v !== "false"),
    example: "true",
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
  LOCAL_MODE_DATABASE_URL: {
    schema: z.string().url().optional(),
    example: "postgres://postgres:postgres@localhost:5433/postgres",
    comment:
      "Database for local mode (vibe start). Defaults to preview postgres on port 5433.",
  },
  LOCAL_MODE_APP_URL: {
    schema: z.string().url().optional(),
    example: "http://localhost:3001",
    comment:
      "App URL for local mode (vibe start). Overrides NEXT_PUBLIC_APP_URL so local instance uses its own port.",
  },
  JWT_SECRET_KEY: {
    schema: createSchema(z.string().min(32), z.string().min(32).optional()),
    example: "your-secret-key-min-32-chars!!",
    comment: "JWT secret",
  },
  CRON_SECRET: {
    schema: createSchema(z.string().min(1), z.string().min(1).optional()),
    example: "your-cron-secret",
  },
  THEA_REMOTE_URL: {
    schema: z.string().url().optional(),
    example: "https://unbottled.ai",
    comment:
      "Remote Thea instance URL for task sync. Local instance polls this for new tasks.",
  },
  THEA_REMOTE_API_KEY: {
    schema: z.string().min(32).optional(),
    example: "your-remote-api-key-min-32-chars-here",
    comment:
      "Shared API key for task sync between local and remote Thea instances.",
  },
  THEA_REMOTE_LEAD_ID: {
    schema: z.string().uuid().optional(),
    example: "00000000-0000-0000-0000-000000000000",
    comment:
      "Lead ID cookie for remote Thea instance. Get by visiting the remote URL once and copying the lead_id cookie.",
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
    comment: "Admin user email (used for CLI auth and seeding)",
  },
  VIBE_ADMIN_USER_PASSWORD: {
    schema: z.string().min(8),
    example: "your-admin-password",
    comment: "Admin user password (used for seeding)",
  },
  VIBE_CLI_LOCALE: {
    schema: (z.string() as z.Schema<CountryLanguage>)
      .optional()
      .default(defaultLocale),
    example: "en-GLOBAL",
    comment: "CLI locale setting",
  },
});
