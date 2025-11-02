import "server-only";

import { stringToIntSchema } from "next-vibe/shared/types/common.schema";
import { validateEnv } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { AwsSnsAwsRegions } from "@/app/api/[locale]/v1/core/sms/providers/aws-sns-enum";
import { SmsProviders } from "@/app/api/[locale]/v1/core/sms/utils-enum";
import { envClientSchema, envValidationLogger } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

// We intentionally disable process at the type level for react native and typesafety
declare const process: {
  env: {
    [key: string]: string | undefined | { [key: string]: string | undefined };
  };
};

const isServer = true;
const isReactNative = false;
const isBrowser = false;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

export const envSchema = envClientSchema.extend({
  JWT_SECRET_KEY: z.string(),
  CRON_SECRET: z.string(),
  DATABASE_URL: z.string(),

  EMAIL_FROM_EMAIL: z.email(),
  EMAIL_HOST: z.string(),

  EMAIL_PORT: stringToIntSchema("The env EMAIL_PORT must be a number"),
  EMAIL_SECURE: z.string().transform((val: string): boolean => {
    if (val === "true") {
      return true;
    }
    if (val === "false") {
      return false;
    }

    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Environment validation needs to throw for invalid configuration at startup
    throw new Error("The env EMAIL_SECURE must be a boolean");
  }),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),

  ENABLE_ANALYTICS: z.string().transform((val: string): boolean => {
    if (val === "true") {
      return true;
    }
    if (val === "false") {
      return false;
    }

    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Environment validation needs to throw for invalid configuration at startup
    throw new Error("The env ENABLE_ANALYTICS must be a boolean");
  }),

  // SMS environment variables
  // TODO validate config based on provider
  SMS_PROVIDER: z.enum([
    SmsProviders.TWILIO,
    SmsProviders.AWS,
    SmsProviders.AWS_SNS,
    SmsProviders.MESSAGEBIRD,
    SmsProviders.HTTP,
  ]),
  SMS_FROM_NUMBER: z.string(),
  SMS_MAX_LENGTH: z.string().optional(),
  SMS_MAX_RETRY_ATTEMPTS: z.string().optional(),
  SMS_RETRY_DELAY_MS: z.string().optional(),
  ADMIN_NOTIFICATION_PHONE: z.string().optional(),

  // MessageBird provider
  MESSAGEBIRD_ACCESS_KEY: z.string().optional(),

  // Twilio provider
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_REGION: z.string().optional(),

  // AWS SNS provider
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z
    .enum([
      AwsSnsAwsRegions.US_EAST_1,
      AwsSnsAwsRegions.US_WEST_1,
      AwsSnsAwsRegions.US_WEST_2,
      AwsSnsAwsRegions.EU_WEST_1,
      AwsSnsAwsRegions.EU_CENTRAL_1,
      AwsSnsAwsRegions.AP_SOUTHEAST_1,
      AwsSnsAwsRegions.AP_SOUTHEAST_2,
      AwsSnsAwsRegions.AP_NORTHEAST_1,
      AwsSnsAwsRegions.AP_NORTHEAST_2,
      AwsSnsAwsRegions.AP_SOUTH_1,
      AwsSnsAwsRegions.AP_EAST_1,
      AwsSnsAwsRegions.CA_CENTRAL_1,
      AwsSnsAwsRegions.SA_EAST_1,
      AwsSnsAwsRegions.AF_SOUTH_1,
      AwsSnsAwsRegions.EU_SOUTH_1,
      AwsSnsAwsRegions.ME_SOUTH_1,
      AwsSnsAwsRegions.EU_NORTH_1,
    ])
    .optional(),

  // HTTP provider
  SMS_HTTP_API_URL: z.string().optional(),
  SMS_HTTP_API_KEY: z.string().optional(),
  SMS_HTTP_API_METHOD: z.string().optional(),
  SMS_HTTP_PHONE_REGEX: z.string().optional(),
  SMS_HTTP_TO_FIELD: z.string().optional(),
  SMS_HTTP_MESSAGE_FIELD: z.string().optional(),
  SMS_HTTP_FROM_FIELD: z.string().optional(),
  SMS_HTTP_RESPONSE_ID_FIELD: z.string().optional(),
  SMS_HTTP_CUSTOM_HEADERS: z.string().optional(),
  SMS_HTTP_AUTH_SCHEME: z.string().optional(),
  SMS_HTTP_CONTENT_TYPE: z.string().optional(),

  // IMAP seed environment variables (optional, used for seeding development data)
  IMAP_SEED_ACCOUNT_NAME: z.string().optional(),
  IMAP_SEED_EMAIL: z.string().optional(),
  IMAP_SEED_HOST: z.string().optional(),
  IMAP_SEED_USERNAME: z.string().optional(),
  IMAP_SEED_PASSWORD: z.string().optional(),
  IMAP_SEED_PORT: stringToIntSchema(
    "The env IMAP_SEED_PORT must be a number",
  ).optional(),
  IMAP_SEED_SECURE: z
    .string()
    .transform((val: string | undefined): boolean => {
      if (val === undefined || val === "") {
        return true; // default to secure
      }
      if (val === "true") {
        return true;
      }
      if (val === "false") {
        return false;
      }
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Environment validation needs to throw for invalid configuration at startup
      throw new Error("The env IMAP_SEED_SECURE must be a boolean");
    })
    .optional(),

  OPENROUTER_API_KEY: z.string().min(1),
  UNCENSORED_AI_API_KEY: z.string().optional(),
  EDEN_AI_API_KEY: z.string().min(1),
  BRAVE_SEARCH_API_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
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

    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Environment validation needs to throw for invalid configuration at startup
    throw new Error("The env LEADS_EMAIL_SECURE must be a boolean");
  }),
  LEADS_EMAIL_USER: z.string(),
  LEADS_EMAIL_PASS: z.string(),

  // Google Calendar integration (optional for development)
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.email(),
  GOOGLE_PRIVATE_KEY: z.string(),
  GOOGLE_CALENDAR_ID_DE: z.string().optional(),
  GOOGLE_CALENDAR_ID_PL: z.string().optional(),
  GOOGLE_CALENDAR_ID_GLOBAL: z.string().optional(),
  GOOGLE_CALENDAR_ID_DEFAULT: z.string(),

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

  // CLI Configuration
  // Optional: If not provided, CLI/MCP will use public user with leadId
  VIBE_CLI_USER_EMAIL: z.string().email().optional(),

  VIBE_LOCALE: (z.string() as z.Schema<CountryLanguage>)
    .optional()
    .default(defaultLocale),
});

export type Env = z.infer<typeof envSchema>;

// Export validated environment for use throughout the application
export const env: Env = validateEnv(
  { ...process.env, platform },
  envSchema,
  envValidationLogger,
);
