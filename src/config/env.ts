/**
 * Core Server Environment
 */

import "server-only";

import { Environment } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const { env } = defineEnv({
  NODE_ENV: { schema: z.enum(Environment), example: "development" },
  NEXT_PUBLIC_APP_URL: {
    schema: z.string().url(),
    example: "http://localhost:3000",
  },
  NEXT_PUBLIC_TEST_SERVER_URL: {
    schema: z.string().url(),
    example: "http://localhost:4000",
  },
  DATABASE_URL: {
    schema: z.string().url(),
    example: "postgres://localhost:5432/postgres",
    comment: "Database",
  },
  JWT_SECRET_KEY: {
    schema: z.string().min(32),
    example: "your-secret-key-min-32-chars!!",
    comment: "JWT secret",
  },
  CRON_SECRET: { schema: z.string().min(1), example: "your-cron-secret" },
  ENABLE_ANALYTICS: {
    schema: z.string().transform((v) => v === "true"),
    example: "false",
  },
});
