/**
 * Cortex Exec Environment
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: cortexEnv,
  schema: cortexEnvSchema,
  examples: cortexEnvExamples,
} = defineEnv({
  LOCAL_MAX_OUTPUT_BYTES: {
    schema: z.coerce.number().int().positive().optional().default(32768),
    example: "32768",
    comment: "Max bytes of output captured from a local exec command.",
    commented: true,
    fieldType: "number",
  },
  LOCAL_DEFAULT_TIMEOUT_MS: {
    schema: z.coerce.number().int().positive().optional().default(30000),
    example: "30000",
    comment: "Default timeout for a local exec command, in milliseconds.",
    commented: true,
    fieldType: "number",
  },
});
