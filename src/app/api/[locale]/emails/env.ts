/**
 * Email Module Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const { env: emailEnv } = defineEnv({
  EMAIL_FROM_EMAIL: {
    schema: z.string().email(),
    example: "noreply@example.com",
  },
  EMAIL_HOST: { schema: z.string(), example: "smtp.example.com" },
  EMAIL_PORT: { schema: z.coerce.number(), example: "587" },
  EMAIL_SECURE: {
    schema: z.string().transform((v) => v === "true"),
    example: "true",
  },
  EMAIL_USER: { schema: z.string(), example: "your_email_username" },
  EMAIL_PASS: { schema: z.string(), example: "your_email_password" },
});
