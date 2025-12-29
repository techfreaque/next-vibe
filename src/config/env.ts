/**
 * Core Server Environment
 */

import "server-only";

import { z } from "zod";

import { Environment } from "@/app/api/[locale]/shared/utils/env-util";
import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

import { createSchema } from "./env-client";

export const { env } = defineEnv({
  NODE_ENV: {
    schema: createSchema(
      z.enum(Environment),
      z.enum(Environment).default(Environment.DEVELOPMENT),
    ),
    example: "development",
  },
  NEXT_PUBLIC_APP_URL: {
    schema: createSchema(z.string().url(), z.string().url().optional()),
    example: "http://localhost:3000",
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
  JWT_SECRET_KEY: {
    schema: createSchema(z.string().min(32), z.string().min(32).optional()),
    example: "your-secret-key-min-32-chars!!",
    comment: "JWT secret",
  },
  CRON_SECRET: {
    schema: createSchema(z.string().min(1), z.string().min(1).optional()),
    example: "your-cron-secret",
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
});
