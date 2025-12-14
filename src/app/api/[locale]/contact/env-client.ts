/**
 * Contact Module Client Environment Configuration
 */

import { z } from "zod";

import { defineEnvClient } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env-client";

export const { envClient: contactClientEnv } = defineEnvClient({
  NEXT_PUBLIC_SUPPORT_EMAIL_DE: {
    schema: z.string().email(),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_DE,
    example: "support-de@example.com",
  },
  NEXT_PUBLIC_SUPPORT_EMAIL_PL: {
    schema: z.string().email(),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_PL,
    example: "support-pl@example.com",
  },
  NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: {
    schema: z.string().email(),
    value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL,
    example: "support@example.com",
  },
});
