/**
 * Core Client Environment
 */

import { Environment } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { defineEnvClient } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env-client";

const isServer = typeof window === "undefined";
const isBrowser = !isServer && typeof document !== "undefined";

export const platform = { isServer, isReactNative: false, isBrowser };

export const requireEnvs = true as const;

// Helper to create properly typed schemas based on requireEnvs
type RequireEnvs = typeof requireEnvs;

export function createSchema<T extends z.ZodTypeAny, U extends z.ZodTypeAny>(
  required: T,
  optional: U,
): RequireEnvs extends true ? T : U {
  return (requireEnvs ? required : optional) as RequireEnvs extends true ? T : U;
}

export const { envClient } = defineEnvClient({
  NODE_ENV: {
    schema: createSchema(z.enum(Environment), z.enum(Environment).default(Environment.DEVELOPMENT)),
    value: process.env.NODE_ENV,
    example: "development",
  },
  NEXT_PUBLIC_APP_URL: {
    schema: createSchema(z.string().url(), z.string().optional()),
    value: process.env.NEXT_PUBLIC_APP_URL,
    example: "http://localhost:3000",
  },
  NEXT_PUBLIC_TEST_SERVER_URL: {
    schema: createSchema(z.string(), z.string().optional()),
    value: process.env.NEXT_PUBLIC_TEST_SERVER_URL,
    example: "http://localhost:4000",
  },
  NEXT_PUBLIC_DEBUG_PRODUCTION: {
    schema: createSchema(
      z.string().transform((v) => v === "true"),
      z
        .string()
        .optional()
        .default("false")
        .transform((v) => v === "true"),
    ),
    value: process.env.NEXT_PUBLIC_DEBUG_PRODUCTION,
    example: "false",
  },
});

export type EnvClient = typeof envClient;
