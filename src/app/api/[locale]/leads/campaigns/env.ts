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
    schema: z.string().email(),
    example: "leads@example.com",
    comment: "Lead campaigns SMTP",
    commented: true,
    fieldType: "email",
  },
  LEADS_EMAIL_HOST: {
    schema: z.string(),
    example: "smtp.example.com",
    commented: true,
  },
  LEADS_EMAIL_PORT: {
    schema: z.coerce.number(),
    example: "587",
    commented: true,
    fieldType: "number",
  },
  LEADS_EMAIL_SECURE: {
    schema: z.string().transform((v) => v === "true"),
    example: "true",
    commented: true,
    fieldType: "boolean",
  },
  LEADS_EMAIL_USER: {
    schema: z.string(),
    example: "leads_email_username",
    commented: true,
  },
  LEADS_EMAIL_PASS: {
    schema: z.string(),
    example: "leads_email_password",
    commented: true,
  },
});
