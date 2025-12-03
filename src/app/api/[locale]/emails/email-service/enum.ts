/**
 * Email Service Enums
 * Core enums for email service functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Email Service Priority Enum
 * Defines priority levels for email sending
 */
export const {
  enum: EmailServicePriority,
  options: EmailServicePriorityOptions,
  Value: EmailServicePriorityValue,
} = createEnumOptions({
  LOW: "app.api.emails.enums.emailServicePriority.low",
  NORMAL: "app.api.emails.enums.emailServicePriority.normal",
  HIGH: "app.api.emails.enums.emailServicePriority.high",
  URGENT: "app.api.emails.enums.emailServicePriority.urgent",
});

/**
 * Email Service Status Enum
 * Defines the current status of email service operations
 */
export const {
  enum: EmailServiceStatus,
  options: EmailServiceStatusOptions,
  Value: EmailServiceStatusValue,
} = createEnumOptions({
  IDLE: "app.api.emails.enums.emailServiceStatus.idle",
  PROCESSING: "app.api.emails.enums.emailServiceStatus.processing",
  COMPLETED: "app.api.emails.enums.emailServiceStatus.completed",
  FAILED: "app.api.emails.enums.emailServiceStatus.failed",
  RETRYING: "app.api.emails.enums.emailServiceStatus.retrying",
});
