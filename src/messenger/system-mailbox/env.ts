/**
 * System Mailbox Environment Configuration
 * Credentials of the platform-owned ops mailbox (IMAP 993/SSL + SMTP 465/SSL).
 */

import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: systemMailboxEnv,
  schema: systemMailboxEnvSchema,
  examples: systemMailboxEnvExamples,
} = defineEnv({
  THEA_MAIL_ADDRESS: {
    schema: z.string().optional(),
    example: "ops@example.com",
    comment:
      "Platform (system) mailbox address. Used as IMAP/SMTP login and From address.",
    commented: true,
    fieldType: "email",
  },
  THEA_MAIL_HOST: {
    schema: z.string().optional(),
    example: "mail.example.com",
    comment:
      "Mail host for the system mailbox. IMAP on 993 (SSL), SMTP on 465 (SSL).",
    commented: true,
  },
  THEA_MAIL_PASSWORD: {
    schema: z.string().optional(),
    example: "your-mailbox-password",
    comment: "System mailbox password. Never stored in the database.",
    commented: true,
    sensitive: true,
  },
  THEA_MAIL_REPORT_TO: {
    schema: z.string().optional(),
    example: "founder@example.com",
    comment: "Default recipient of the daily internal status report.",
    commented: true,
    fieldType: "email",
  },
  THEA_MAIL_RATE_LIMIT_PER_HOUR: {
    schema: z.coerce.number().int().min(1).max(500).optional().default(20),
    example: "20",
    comment: "Safety limit: max sends per hour from the system mailbox.",
    commented: true,
    fieldType: "number",
  },
});
