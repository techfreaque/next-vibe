/**
 * Contact Module Client Environment Configuration
 */

import { defineEnvClient } from "next-vibe/env/define-env-client";
import { z } from "zod";

export const {
  envClient: contactClientEnv,
  schema: contactClientEnvSchema,
  examples: contactClientEnvExamples,
} = defineEnvClient({
  NEXT_PUBLIC_SUPPORT_EMAIL_DE: {
    schema: z.string().email().default("hi@unbottled.ai"),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_DE,
    example: "hi@unbottled.ai",
  },
  NEXT_PUBLIC_SUPPORT_EMAIL_PL: {
    schema: z.string().email().default("hi@unbottled.ai"),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_PL,
    example: "hi@unbottled.ai",
  },
  NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: {
    schema: z.string().email().default("hi@unbottled.ai"),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL,
    example: "hi@unbottled.ai",
  },
});
