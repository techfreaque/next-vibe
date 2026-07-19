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
    schema: z.email().default("hi@unbottled.ai"),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_DE,
    commented: true,
    example: "hi@unbottled.ai",
  },
  NEXT_PUBLIC_SUPPORT_EMAIL_PL: {
    schema: z.email().default("hi@unbottled.ai"),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_PL,
    commented: true,
    example: "hi@unbottled.ai",
  },
  NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: {
    schema: z.email().default("hi@unbottled.ai"),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL,
    commented: true,
    example: "hi@unbottled.ai",
  },
});
