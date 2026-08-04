/**
 * Tasks Environment
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "../env/define-env";

export const {
  env: tasksEnv,
  schema: tasksEnvSchema,
  examples: tasksEnvExamples,
} = defineEnv({
  CRON_SECRET: {
    schema: z.string().min(32),
    example: "REPLACE_WITH_openssl_rand_hex_32_output",
    comment: "Cron job secret - generate with: openssl rand -hex 32",
    sensitive: true,
    onboardingStep: 3,
    onboardingGroup: "security",
    autoGenerate: "hex64" as const,
  },
  PULSE_INTERVAL_MINUTES: {
    schema: z.coerce.number().int().positive().default(1),
    example: "1",
    comment: "Pulse runner interval in minutes (default: 1)",
    fieldType: "number",
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
});
