import { z } from "zod";

import { envClientBaseSchema, envValidationLogger } from "../client/env-client";
import { stringToIntSchema } from "../shared/types/common.schema";
import { validateEnv } from "../shared/utils/env-util";
import { AwsSnsAwsRegions } from "./sms/providers/aws-sns";
import { SmsProviders } from "./sms/utils";

export const envSchema = envClientBaseSchema.extend({
  JWT_SECRET_KEY: z.string(),
  CRON_SECRET: z.string(),
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_TEST_SERVER_URL: z.string(),

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

    // eslint-disable-next-line no-restricted-syntax
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

    // eslint-disable-next-line no-restricted-syntax
    throw new Error("The env ENABLE_ANALYTICS must be a boolean");
  }),

  // SMS environment variables
  // TODO validate based on provider
  SMS_PROVIDER: z.enum(SmsProviders),
  SMS_FROM_NUMBER: z.string(),
  SMS_MAX_LENGTH: z.string().optional(),
  SMS_MAX_RETRY_ATTEMPTS: z.string().optional(),
  SMS_RETRY_DELAY_MS: z.string().optional(),

  // MessageBird provider
  MESSAGEBIRD_ACCESS_KEY: z.string().optional(),

  // Twilio provider
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_REGION: z.string().optional(),

  // AWS SNS provider
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.enum(AwsSnsAwsRegions).optional(),

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
      // eslint-disable-next-line no-restricted-syntax
      throw new Error("The env IMAP_SEED_SECURE must be a boolean");
    })
    .optional(),
});

export type Env = z.infer<typeof envSchema>;

// Export validated environment for use throughout the application

export const env: Env = validateEnv(
  // eslint-disable-next-line node/no-process-env
  process.env,
  envSchema,
  envValidationLogger,
);
