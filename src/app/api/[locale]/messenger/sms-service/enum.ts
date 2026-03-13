/**
 * SMS Service Enums
 * Core enums for SMS service functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "../i18n";

/**
 * SMS Provider Enum
 * Defines available SMS providers
 */
export const {
  enum: SmsProvider,
  options: SmsProviderOptions,
  Value: SmsProviderValue,
} = createEnumOptions(scopedTranslation, {
  TWILIO: "enums.smsProvider.twilio",
  AWS_SNS: "enums.smsProvider.awsSns",
  MESSAGEBIRD: "enums.smsProvider.messagebird",
  PLIVO: "enums.smsProvider.plivo",
});

/**
 * SMS Status Enum
 * Defines SMS delivery status
 */
export const {
  enum: SmsStatus,
  options: SmsStatusOptions,
  Value: SmsStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.smsStatus.pending",
  SENT: "enums.smsStatus.sent",
  DELIVERED: "enums.smsStatus.delivered",
  FAILED: "enums.smsStatus.failed",
  REJECTED: "enums.smsStatus.rejected",
  UNDELIVERED: "enums.smsStatus.undelivered",
});

/**
 * SMS Template Type Enum
 * Defines types of SMS templates
 */
export const {
  enum: SmsTemplateType,
  options: SmsTemplateTypeOptions,
  Value: SmsTemplateTypeValue,
} = createEnumOptions(scopedTranslation, {
  NOTIFICATION: "enums.smsTemplateType.notification",
  VERIFICATION: "enums.smsTemplateType.verification",
  MARKETING: "enums.smsTemplateType.marketing",
  ALERT: "enums.smsTemplateType.alert",
  REMINDER: "enums.smsTemplateType.reminder",
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
