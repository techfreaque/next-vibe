/**
 * Core Client Environment
 */

import { Environment } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { defineEnvClient } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env-client";

const isServer = typeof window === "undefined";
const isBrowser = !isServer && typeof document !== "undefined";

export const platform = { isServer, isReactNative: false, isBrowser };

export const requireEnvs = true;

export const { envClient } = defineEnvClient({
  NODE_ENV: {
    schema: requireEnvs
      ? z.enum(Environment)
      : z.enum(Environment).default(Environment.DEVELOPMENT),
    value: process.env.NODE_ENV,
    example: "development",
  },
  NEXT_PUBLIC_APP_URL: {
    schema: requireEnvs ? z.string() : z.string().optional(),
    value: process.env.NEXT_PUBLIC_APP_URL,
    example: "http://localhost:3000",
  },
  NEXT_PUBLIC_TEST_SERVER_URL: {
    schema: requireEnvs ? z.string() : z.string().optional(),
    value: process.env.NEXT_PUBLIC_TEST_SERVER_URL,
    example: "http://localhost:4000",
  },
  NEXT_PUBLIC_DEBUG_PRODUCTION: {
    schema: requireEnvs
      ? z.string().transform((v) => v === "true")
      : z
          .string()
          .optional()
          .default("false")
          .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_DEBUG_PRODUCTION,
    example: "false",
  },
});

export type EnvClient = typeof envClient;
