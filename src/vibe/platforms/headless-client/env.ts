/**
 * Headless Client Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "../../env/define-env";

export const {
  env: headlessClientEnv,
  schema: headlessClientEnvSchema,
  examples: headlessClientEnvExamples,
} = defineEnv({
  VIBE_COMPUTER_NAME: {
    schema: z.string().optional(),
    example: "my-desktop",
    comment:
      "Headless client identity. Overrides the auto-detected name (dev fixed name, or OS hostname in production).",
    commented: true,
  },
});
