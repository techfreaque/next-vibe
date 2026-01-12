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
  },
  LEADS_EMAIL_HOST: { schema: z.string(), example: "smtp.example.com" },
  LEADS_EMAIL_PORT: { schema: z.coerce.number(), example: "587" },
  LEADS_EMAIL_SECURE: {
    schema: z.string().transform((v) => v === "true"),
    example: "true",
  },
  LEADS_EMAIL_USER: { schema: z.string(), example: "leads_email_username" },
  LEADS_EMAIL_PASS: { schema: z.string(), example: "leads_email_password" },
});
