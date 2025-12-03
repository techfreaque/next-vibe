/**
 * SMS Service Enums
 * Core enums for SMS service functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * SMS Provider Enum
 * Defines available SMS providers
 */
export const {
  enum: SmsProvider,
  options: SmsProviderOptions,
  Value: SmsProviderValue,
} = createEnumOptions({
  TWILIO: "app.api.emails.enums.smsProvider.twilio",
  AWS_SNS: "app.api.emails.enums.smsProvider.awsSns",
  MESSAGEBIRD: "app.api.emails.enums.smsProvider.messagebird",
  PLIVO: "app.api.emails.enums.smsProvider.plivo",
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
  PENDING: "app.api.emails.enums.smsStatus.pending",
  SENT: "app.api.emails.enums.smsStatus.sent",
  DELIVERED: "app.api.emails.enums.smsStatus.delivered",
  FAILED: "app.api.emails.enums.smsStatus.failed",
  REJECTED: "app.api.emails.enums.smsStatus.rejected",
  UNDELIVERED: "app.api.emails.enums.smsStatus.undelivered",
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
  NOTIFICATION: "app.api.emails.enums.smsTemplateType.notification",
  VERIFICATION: "app.api.emails.enums.smsTemplateType.verification",
  MARKETING: "app.api.emails.enums.smsTemplateType.marketing",
  ALERT: "app.api.emails.enums.smsTemplateType.alert",
  REMINDER: "app.api.emails.enums.smsTemplateType.reminder",
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
