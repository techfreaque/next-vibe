/**
 * Core Client Environment
 */

import { defineEnvClient } from "next-vibe/env/define-env-client";
import { Environment } from "next-vibe/env/env-util";
import { getCurrentOrigin } from "next-vibe/ui/lib/location";
import { z } from "zod";

const isServer = typeof window === "undefined";
const isBrowser = !isServer && typeof document !== "undefined";

export const platform = { isServer, isReactNative: false, isBrowser };

export const {
  envClient: coreClientEnv,
  schema: coreClientEnvSchema,
  examples: coreClientEnvExamples,
} = defineEnvClient({
  NODE_ENV: {
    schema: z.enum(Environment).default(Environment.DEVELOPMENT),
    value: process.env.NODE_ENV,
    example: "development",
  },
  NEXT_PUBLIC_APP_URL: {
    schema: z
      .string()
      .url()
      .default("http://localhost:3000")
      .transform((s) =>
        isBrowser ? getCurrentOrigin() : s.replace(/\/$/, ""),
      ),
    value: process.env.NEXT_PUBLIC_APP_URL,
    example: "http://localhost:3000",
  },
  NEXT_PUBLIC_PROJECT_URL: {
    // eslint-disable-next-line i18next/no-literal-string
    schema: z.string().url().default("https://unbottled.ai"),
    value: process.env.NEXT_PUBLIC_PROJECT_URL,
    example: "https://unbottled.ai",
    comment:
      "Project URL - defaults to https://unbottled.ai. Override to use your own domain.",
    commented: true,
  },
  NEXT_PUBLIC_LOCAL_MODE: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_LOCAL_MODE,
    example: "false",
  },
  NEXT_PUBLIC_DEBUG_PRODUCTION: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_DEBUG_PRODUCTION,
    example: "false",
  },
  NEXT_PUBLIC_VIBE_IS_CLOUD: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_VIBE_IS_CLOUD,
    example: "false",
    comment:
      "Set to true on cloud/SaaS instances that receive syncs from users. Disables outbound task/memory sync so the cloud instance never pushes back to user devices.",
  },
});

export type CoreClientEnv = typeof coreClientEnv;
