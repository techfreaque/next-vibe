import "server-only";

import { z } from "zod";

import { defineEnv } from "../../env/define-env";

export const {
  env: devWatcherEnv,
  schema: devWatcherEnvSchema,
  examples: devWatcherEnvExamples,
} = defineEnv({
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
