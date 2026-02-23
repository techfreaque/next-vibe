/**
 * Email Service Enums
 * Core enums for email service functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Email Service Priority Enum
 * Defines priority levels for email sending
 */
export const {
  enum: EmailServicePriority,
  options: EmailServicePriorityOptions,
  Value: EmailServicePriorityValue,
} = createEnumOptions(scopedTranslation, {
  LOW: "emailServicePriority.low",
  NORMAL: "emailServicePriority.normal",
  HIGH: "emailServicePriority.high",
  URGENT: "emailServicePriority.urgent",
});

/**
 * Email Service Status Enum
 * Defines the current status of email service operations
 */
export const {
  enum: EmailServiceStatus,
  options: EmailServiceStatusOptions,
  Value: EmailServiceStatusValue,
} = createEnumOptions(scopedTranslation, {
  IDLE: "emailServiceStatus.idle",
  PROCESSING: "emailServiceStatus.processing",
  COMPLETED: "emailServiceStatus.completed",
  FAILED: "emailServiceStatus.failed",
  RETRYING: "emailServiceStatus.retrying",
});
