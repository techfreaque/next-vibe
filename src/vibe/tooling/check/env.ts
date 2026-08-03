/**
 * Vibe Check Tooling Environment
 */

import "server-only";

import { defineEnv } from "../../env/define-env";
import { z } from "zod";

export const {
  env: checkEnv,
  schema: checkEnvSchema,
  examples: checkEnvExamples,
} = defineEnv({
  TSGO_PATH: {
    schema: z.string().optional(),
    example: "/path/to/tsgo",
    comment:
      "Explicit path to the tsgo binary. Auto-discovered from the project or the checker's own node_modules when unset.",
    commented: true,
  },
});
