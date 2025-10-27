/**
 * SMS Service Enums
 * Core enums for SMS service functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * SMS Provider Enum
 * Defines available SMS providers
 */
export const {
  enum: SmsProvider,
  options: SmsProviderOptions,
  Value: SmsProviderValue,
} = createEnumOptions({
  TWILIO: "app.api.v1.core.emails.enums.smsProvider.twilio",
  AWS_SNS: "app.api.v1.core.emails.enums.smsProvider.awsSns",
  MESSAGEBIRD: "app.api.v1.core.emails.enums.smsProvider.messagebird",
  PLIVO: "app.api.v1.core.emails.enums.smsProvider.plivo",
});

/**
 * SMS Status Enum
 * Defines SMS delivery status
 */
export const {
  enum: SmsStatus,
  options: SmsStatusOptions,
  Value: SmsStatusValue,
} = createEnumOptions({
  PENDING: "app.api.v1.core.emails.enums.smsStatus.pending",
  SENT: "app.api.v1.core.emails.enums.smsStatus.sent",
  DELIVERED: "app.api.v1.core.emails.enums.smsStatus.delivered",
  FAILED: "app.api.v1.core.emails.enums.smsStatus.failed",
  REJECTED: "app.api.v1.core.emails.enums.smsStatus.rejected",
  UNDELIVERED: "app.api.v1.core.emails.enums.smsStatus.undelivered",
});

/**
 * SMS Template Type Enum
 * Defines types of SMS templates
 */
export const {
  enum: SmsTemplateType,
  options: SmsTemplateTypeOptions,
  Value: SmsTemplateTypeValue,
} = createEnumOptions({
  NOTIFICATION: "app.api.v1.core.emails.enums.smsTemplateType.notification",
  VERIFICATION: "app.api.v1.core.emails.enums.smsTemplateType.verification",
  MARKETING: "app.api.v1.core.emails.enums.smsTemplateType.marketing",
  ALERT: "app.api.v1.core.emails.enums.smsTemplateType.alert",
  REMINDER: "app.api.v1.core.emails.enums.smsTemplateType.reminder",
});

// DB enum exports for Drizzle
export const SmsProviderDB = [
  SmsProvider.TWILIO,
  SmsProvider.AWS_SNS,
  SmsProvider.MESSAGEBIRD,
  SmsProvider.PLIVO,
] as const;

export const SmsStatusDB = [
  SmsStatus.PENDING,
  SmsStatus.SENT,
  SmsStatus.DELIVERED,
  SmsStatus.FAILED,
  SmsStatus.REJECTED,
  SmsStatus.UNDELIVERED,
] as const;

export const SmsTemplateTypeDB = [
  SmsTemplateType.NOTIFICATION,
  SmsTemplateType.VERIFICATION,
  SmsTemplateType.MARKETING,
  SmsTemplateType.ALERT,
  SmsTemplateType.REMINDER,
] as const;
