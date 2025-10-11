/* eslint-disable node/no-process-env */
import "server-only";

import { envSchema as vibeEnvSchema } from "next-vibe/server/env";
import { stringToIntSchema } from "next-vibe/shared/types/common.schema";
import { validateEnv } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { envValidationLogger } from "@/packages/next-vibe/client/env-client";

export const envSchema = vibeEnvSchema.extend({
  OPENROUTER_API_KEY: z.string().min(1),
  UNCENSORED_AI_API_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),

  // LLM Configuration
  LLM_PROVIDER: z.enum(["openai", "anthropic", "local"]).default("openai"),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default("gpt-4-turbo-preview"),
  LLM_MAX_TOKENS: stringToIntSchema(
    "The env LLM_MAX_TOKENS must be a number",
  ).default(2000),
  LLM_TEMPERATURE: z
    .string()
    .transform((val: string): number => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        // eslint-disable-next-line no-restricted-syntax
        throw new Error("The env LLM_TEMPERATURE must be a number");
      }
      return parsed;
    })
    .default(0.1),
  LLM_TIMEOUT: stringToIntSchema(
    "The env LLM_TIMEOUT must be a number",
  ).default(30000),
  LLM_RETRY_ATTEMPTS: stringToIntSchema(
    "The env LLM_RETRY_ATTEMPTS must be a number",
  ).default(3),
  LLM_FALLBACK_MODEL: z.string().default("gpt-3.5-turbo"),

  // Lead campaigns email configuration
  LEADS_EMAIL_FROM_EMAIL: z.email(),
  LEADS_EMAIL_HOST: z.string(),
  LEADS_EMAIL_PORT: stringToIntSchema(
    "The env LEADS_EMAIL_PORT must be a number",
  ),
  LEADS_EMAIL_SECURE: z.string().transform((val: string): boolean => {
    if (val === "true") {
      return true;
    }
    if (val === "false") {
      return false;
    }

    // eslint-disable-next-line no-restricted-syntax
    throw new Error("The env LEADS_EMAIL_SECURE must be a boolean");
  }),
  LEADS_EMAIL_USER: z.string(),
  LEADS_EMAIL_PASS: z.string(),

  // Stripe Price IDs for subscription plans
  // DE (EUR) Region
  STRIPE_STARTER_MONTHLY_DE_PRICE_ID: z.string(),
  STRIPE_STARTER_YEARLY_DE_PRICE_ID: z.string(),
  STRIPE_PROFESSIONAL_MONTHLY_DE_PRICE_ID: z.string(),
  STRIPE_PROFESSIONAL_YEARLY_DE_PRICE_ID: z.string(),
  STRIPE_PREMIUM_MONTHLY_DE_PRICE_ID: z.string(),
  STRIPE_PREMIUM_YEARLY_DE_PRICE_ID: z.string(),

  // PL (PLN) Region
  STRIPE_STARTER_MONTHLY_PL_PRICE_ID: z.string(),
  STRIPE_STARTER_YEARLY_PL_PRICE_ID: z.string(),
  STRIPE_PROFESSIONAL_MONTHLY_PL_PRICE_ID: z.string(),
  STRIPE_PROFESSIONAL_YEARLY_PL_PRICE_ID: z.string(),
  STRIPE_PREMIUM_MONTHLY_PL_PRICE_ID: z.string(),
  STRIPE_PREMIUM_YEARLY_PL_PRICE_ID: z.string(),

  // GLOBAL (USD) Region
  STRIPE_STARTER_MONTHLY_GLOBAL_PRICE_ID: z.string(),
  STRIPE_STARTER_YEARLY_GLOBAL_PRICE_ID: z.string(),
  STRIPE_PROFESSIONAL_MONTHLY_GLOBAL_PRICE_ID: z.string(),
  STRIPE_PROFESSIONAL_YEARLY_GLOBAL_PRICE_ID: z.string(),
  STRIPE_PREMIUM_MONTHLY_GLOBAL_PRICE_ID: z.string(),
  STRIPE_PREMIUM_YEARLY_GLOBAL_PRICE_ID: z.string(),

  // Google Calendar integration (optional for development)
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.email(),
  GOOGLE_PRIVATE_KEY: z.string(),
  GOOGLE_CALENDAR_ID_DE: z.string().optional(),
  GOOGLE_CALENDAR_ID_PL: z.string().optional(),
  GOOGLE_CALENDAR_ID_GLOBAL: z.string().optional(),
  GOOGLE_CALENDAR_ID_DEFAULT: z.string(),

  // IMAP Seeding Configuration (required for seeding)
  IMAP_SEED_ACCOUNT_NAME: z.string(),
  IMAP_SEED_EMAIL: z.email(),
  IMAP_SEED_HOST: z.string(),
  IMAP_SEED_USERNAME: z.string(),
  IMAP_SEED_PASSWORD: z.string(),
  IMAP_SEED_PORT: stringToIntSchema("The env IMAP_SEED_PORT must be a number"),
  IMAP_SEED_SECURE: z.string().transform((val: string): boolean => {
    if (val === "true") {
      return true;
    }
    if (val === "false") {
      return false;
    }

    // eslint-disable-next-line no-restricted-syntax
    throw new Error("The env IMAP_SEED_SECURE must be a boolean");
  }),

  // Platform-specific environment variables (automatically set by hosting platforms)
  // Vercel
  VERCEL: z.string().optional(),
  VERCEL_REGION: z.string().optional(),
  VERCEL_URL: z.string().optional(),

  // AWS Lambda
  AWS_LAMBDA_FUNCTION_NAME: z.string().optional(),

  // Netlify
  NETLIFY: z.string().optional(),
  NETLIFY_SITE_NAME: z.string().optional(),

  // Cloudflare Workers
  CLOUDFLARE_WORKERS: z.string().optional(),

  // Railway
  RAILWAY_ENVIRONMENT: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Export validated environment for use throughout the application
export const env: Env = validateEnv(
  process.env,
  envSchema,
  envValidationLogger,
);
