/**
 * Lead Campaigns Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const {
  env: leadsCampaignsEnv,
  schema: leadsCampaignsEnvSchema,
  examples: leadsCampaignsEnvExamples,
} = defineEnv({
  LEADS_EMAIL_FROM_EMAIL: {
    schema: z.string().email().optional(),
    example: "leads@example.com",
    comment: "Lead campaigns SMTP",
    commented: true,
    fieldType: "email",
  },
  LEADS_EMAIL_FROM_NAME: {
    schema: z.string().optional(),
    example: "Unbottled Team",
    comment: "Display name in the From header for lead campaign emails",
    commented: true,
  },
  LEADS_EMAIL_HOST: {
    schema: z.string().optional(),
    example: "smtp.example.com",
    commented: true,
  },
  LEADS_EMAIL_PORT: {
    schema: z.coerce.number().optional(),
    example: "587",
    commented: true,
    fieldType: "number",
  },
  LEADS_EMAIL_SECURE: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    example: "true",
    commented: true,
    fieldType: "boolean",
  },
  LEADS_EMAIL_USER: {
    schema: z.string().optional(),
    example: "leads_email_username",
    commented: true,
  },
  LEADS_EMAIL_PASS: {
    schema: z.string().optional(),
    example: "leads_email_password",
    commented: true,
  },
  LEADS_IMAP_HOST: {
    schema: z.string().optional(),
    example: "imap.example.com",
    comment: "Lead campaigns IMAP (inbound) — leave blank if same host as SMTP",
    commented: true,
  },
  LEADS_IMAP_PORT: {
    schema: z.coerce.number().optional().default(993),
    example: "993",
    commented: true,
    fieldType: "number",
  },
  LEADS_IMAP_SECURE: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    example: "true",
    commented: true,
    fieldType: "boolean",
  },
  LEADS_IMAP_USER: {
    schema: z.string().optional(),
    example: "leads_imap_username",
    commented: true,
  },
  LEADS_IMAP_PASS: {
    schema: z.string().optional(),
    example: "leads_imap_password",
    commented: true,
  },
});
