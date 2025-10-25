/**
 * SMS Provider Enums
 * Separated from utils.ts to avoid circular dependency with env.ts
 */

export enum SmsProviders {
  TWILIO = "twilio",
  AWS = "aws",
  AWS_SNS = "aws-sns",
  MESSAGEBIRD = "messagebird",
  HTTP = "http",
}

