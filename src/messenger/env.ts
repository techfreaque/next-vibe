/**
 * Messenger Module Environment Configuration
 * Fallback SMTP credentials used when no messenger_accounts row is configured.
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: messengerEnv,
  schema: messengerEnvSchema,
  examples: messengerEnvExamples,
} = defineEnv({
  EMAIL_FROM_EMAIL: {
    schema: z.email().optional(),
    example: "noreply@example.com",
    commented: true,
    fieldType: "email",
  },
  EMAIL_FROM_NAME: {
    schema: z.string().optional(),
    example: "Unbottled",
    comment: "Display name in the From header for system emails",
    commented: true,
  },
  EMAIL_HOST: {
    schema: z.string().optional(),
    example: "smtp.example.com",
    commented: true,
  },
  EMAIL_PORT: {
    schema: z.coerce.number().optional(),
    example: "587",
    commented: true,
    fieldType: "number",
  },
  EMAIL_SECURE: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    example: "true",
    commented: true,
    fieldType: "boolean",
  },
  EMAIL_USER: {
    schema: z.string().optional(),
    example: "your_email_username",
    commented: true,
  },
  EMAIL_PASS: {
    schema: z.string().optional(),
    example: "your_email_password",
    commented: true,
  },
  IMAP_HOST: {
    schema: z.string().optional(),
    example: "imap.example.com",
    comment: "System IMAP (inbound) - leave blank if same host as SMTP",
    commented: true,
  },
  IMAP_PORT: {
    schema: z.coerce.number().optional().default(993),
    example: "993",
    commented: true,
    fieldType: "number",
  },
  IMAP_SECURE: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    example: "true",
    commented: true,
    fieldType: "boolean",
  },
  IMAP_USER: {
    schema: z.string().optional(),
    example: "your_imap_username",
    commented: true,
  },
  IMAP_PASS: {
    schema: z.string().optional(),
    example: "your_imap_password",
    commented: true,
  },
  RESEND_API_KEY: {
    schema: z.string().optional(),
    example: "re_your_resend_api_key",
    comment:
      "Resend API key. Used as the default email provider when no SMTP account is configured.",
    commented: true,
    sensitive: true,
  },
  RESEND_FROM_EMAIL: {
    schema: z.email().optional(),
    example: "noreply@example.com",
    comment: "From address for emails sent via Resend.",
    commented: true,
    fieldType: "email",
  },
});
