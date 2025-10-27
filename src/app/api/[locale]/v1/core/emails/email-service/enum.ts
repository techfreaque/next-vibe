/**
 * Email Service Enums
 * Core enums for email service functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * Email Service Priority Enum
 * Defines priority levels for email sending
 */
export const {
  enum: EmailServicePriority,
  options: EmailServicePriorityOptions,
  Value: EmailServicePriorityValue,
} = createEnumOptions({
  LOW: "app.api.v1.core.emails.enums.emailServicePriority.low",
  NORMAL: "app.api.v1.core.emails.enums.emailServicePriority.normal",
  HIGH: "app.api.v1.core.emails.enums.emailServicePriority.high",
  URGENT: "app.api.v1.core.emails.enums.emailServicePriority.urgent",
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
  IDLE: "app.api.v1.core.emails.enums.emailServiceStatus.idle",
  PROCESSING: "app.api.v1.core.emails.enums.emailServiceStatus.processing",
  COMPLETED: "app.api.v1.core.emails.enums.emailServiceStatus.completed",
  FAILED: "app.api.v1.core.emails.enums.emailServiceStatus.failed",
  RETRYING: "app.api.v1.core.emails.enums.emailServiceStatus.retrying",
});
