/**
 * IMAP Client Environment Configuration
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: imapClientEnv,
  schema: imapClientEnvSchema,
  examples: imapClientEnvExamples,
} = defineEnv({
  IMAP_SEED_ACCOUNT_NAME: {
    schema: z.string().optional(),
    example: "Your IMAP Account",
    comment: "IMAP seeding config",
    commented: true,
  },
  IMAP_SEED_EMAIL: {
    schema: z.string().optional(),
    example: "your-email@example.com",
    commented: true,
  },
  IMAP_SEED_HOST: {
    schema: z.string().optional(),
    example: "imap.example.com",
    commented: true,
  },
  IMAP_SEED_USERNAME: {
    schema: z.string().optional(),
    example: "your-email@example.com",
    commented: true,
  },
  IMAP_SEED_PASSWORD: {
    schema: z.string().optional(),
    example: "your-imap-password",
    commented: true,
  },
  IMAP_SEED_PORT: {
    schema: z.coerce.number().optional().default(993),
    example: "993",
    commented: true,
  },
  IMAP_SEED_SECURE: {
    schema: z
      .string()
      .transform((v) => v === "true")
      .optional()
      .default(true),
    example: "true",
    commented: true,
  },
});
