/**
 * SMS Module Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

import { AwsSnsAwsRegions } from "./providers/aws-sns-enum";
import { SmsProviders } from "./utils-enum";

export const {
  env: smsEnv,
  schema: smsEnvSchema,
  examples: smsEnvExamples,
} = defineEnv({
  // Core SMS config
  SMS_PROVIDER: {
    schema: z.enum([
      SmsProviders.TWILIO,
      SmsProviders.AWS,
      SmsProviders.AWS_SNS,
      SmsProviders.MESSAGEBIRD,
      SmsProviders.HTTP,
    ]),
    example: "twilio",
    comment: "Options: twilio, aws, aws-sns, messagebird, http",
  },
  SMS_FROM_NUMBER: { schema: z.string(), example: "+1234567890" },
  SMS_MAX_LENGTH: { schema: z.string().optional(), example: "160" },
  SMS_MAX_RETRY_ATTEMPTS: { schema: z.string().optional(), example: "3" },
  SMS_RETRY_DELAY_MS: { schema: z.string().optional(), example: "1000" },
  ADMIN_NOTIFICATION_PHONE: {
    schema: z.string().optional(),
    example: "+1234567890",
  },

  // MessageBird provider
  MESSAGEBIRD_ACCESS_KEY: {
    schema: z.string().optional(),
    example: "your_messagebird_key",
    comment: "MessageBird provider",
  },

  // Twilio provider
  TWILIO_ACCOUNT_SID: {
    schema: z.string().optional(),
    example: "your_twilio_account_sid",
    comment: "Twilio provider",
  },
  TWILIO_AUTH_TOKEN: {
    schema: z.string().optional(),
    example: "your_twilio_auth_token",
  },
  TWILIO_REGION: { schema: z.string().optional(), example: "us1" },

  // AWS SNS provider
  AWS_ACCESS_KEY_ID: {
    schema: z.string().optional(),
    example: "your_aws_access_key",
    comment: "AWS SNS provider",
  },
  AWS_SECRET_ACCESS_KEY: {
    schema: z.string().optional(),
    example: "your_aws_secret_key",
  },
  AWS_REGION: {
    schema: z
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
    example: "us-east-1",
  },

  // HTTP provider
  SMS_HTTP_API_URL: {
    schema: z.string().optional(),
    example: "https://api.example.com/sms",
    comment: "HTTP SMS provider",
  },
  SMS_HTTP_API_KEY: { schema: z.string().optional(), example: "your_api_key" },
  SMS_HTTP_API_METHOD: { schema: z.string().optional(), example: "POST" },
  SMS_HTTP_PHONE_REGEX: {
    schema: z.string().optional(),
    example: "^\\+[1-9]\\d{1,14}$",
  },
  SMS_HTTP_TO_FIELD: { schema: z.string().optional(), example: "to" },
  SMS_HTTP_MESSAGE_FIELD: { schema: z.string().optional(), example: "message" },
  SMS_HTTP_FROM_FIELD: { schema: z.string().optional(), example: "from" },
  SMS_HTTP_RESPONSE_ID_FIELD: { schema: z.string().optional(), example: "id" },
  SMS_HTTP_CUSTOM_HEADERS: {
    schema: z.string().optional(),
    example: '{"X-Custom": "value"}',
  },
  SMS_HTTP_AUTH_SCHEME: { schema: z.string().optional(), example: "Bearer" },
  SMS_HTTP_CONTENT_TYPE: {
    schema: z.string().optional(),
    example: "application/json",
  },
});
