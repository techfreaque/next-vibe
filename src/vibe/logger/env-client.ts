/**
 * Logger Client Environment
 *
 * NEXT_PUBLIC_VIBE_DEBUG is produced server-side by logger/env.ts, which
 * resolves -v/--verbose from argv and writes the result to process.env (dev)
 * or bakes it into the bundle (prod build). This module is the client-side
 * consumer: the explicit `process.env.NEXT_PUBLIC_VIBE_DEBUG` reference is
 * what lets the bundler inline the value for the browser.
 */

import { z } from "zod";

import { defineEnvClient } from "../env/define-env-client";

export const {
  envClient: loggerClientEnv,
  schema: loggerClientEnvSchema,
  examples: loggerClientEnvExamples,
} = defineEnvClient({
  NEXT_PUBLIC_VIBE_DEBUG: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_VIBE_DEBUG,
    example: "false",
    comment:
      "Enable verbose debug logging across the full stack, including the browser client. Two ways to activate: (1) pass -v or --verbose to any vibe command - detected at startup and baked into the build automatically; (2) set NEXT_PUBLIC_VIBE_DEBUG=true in .env for a persistent always-on debug build.",
    commented: true,
  },
});
