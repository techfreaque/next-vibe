import "server-only";

import { z } from "zod";

import { defineEnv } from "../../env/define-env";

export const {
  env: pulseEnv,
  schema: pulseEnvSchema,
  examples: pulseEnvExamples,
} = defineEnv({
  PULSE_INTERVAL_MINUTES: {
    schema: z.coerce.number().int().positive().default(1),
    example: "1",
    comment: "Pulse runner interval in minutes (default: 1)",
    fieldType: "number",
  },
});
