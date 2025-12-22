/**
 * Contact API Enums with Translation Options
 * Enum definitions for contact form operations with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Contact Subject options
 * Uses scoped translation keys from contact i18n _components
 */
export const {
  enum: ContactSubject,
  options: ContactSubjectOptions,
  Value: ContactSubjectValue,
} = createEnumOptions({
  HELP_SUPPORT: "_components.contact.subjects.HELP_SUPPORT",
  GENERAL_INQUIRY: "_components.contact.subjects.GENERAL_INQUIRY",
  TECHNICAL_SUPPORT: "_components.contact.subjects.TECHNICAL_SUPPORT",
  ACCOUNT_QUESTION: "_components.contact.subjects.ACCOUNT_QUESTION",
  BILLING_QUESTION: "_components.contact.subjects.BILLING_QUESTION",
  SALES_INQUIRY: "_components.contact.subjects.SALES_INQUIRY",
  FEATURE_REQUEST: "_components.contact.subjects.FEATURE_REQUEST",
  BUG_REPORT: "_components.contact.subjects.BUG_REPORT",
  FEEDBACK: "_components.contact.subjects.FEEDBACK",
  COMPLAINT: "_components.contact.subjects.COMPLAINT",
  PARTNERSHIP: "_components.contact.subjects.PARTNERSHIP",
  OTHER: "_components.contact.subjects.OTHER",
});

// Create DB enum array for Drizzle
export const ContactSubjectDB = [
  ContactSubject.HELP_SUPPORT,
  ContactSubject.GENERAL_INQUIRY,
  ContactSubject.TECHNICAL_SUPPORT,
  ContactSubject.ACCOUNT_QUESTION,
  ContactSubject.BILLING_QUESTION,
  ContactSubject.SALES_INQUIRY,
  ContactSubject.FEATURE_REQUEST,
  ContactSubject.BUG_REPORT,
  ContactSubject.FEEDBACK,
  ContactSubject.COMPLAINT,
  ContactSubject.PARTNERSHIP,
  ContactSubject.OTHER,
] as const;

/**
 * Contact Priority options
 * Uses scoped translation keys from contact i18n
 */
export const {
  enum: ContactPriority,
  options: ContactPriorityOptions,
  Value: ContactPriorityValue,
} = createEnumOptions({
  LOW: "priority.low",
  MEDIUM: "priority.medium",
  HIGH: "priority.high",
  URGENT: "priority.urgent",
});

// Create DB enum array for Drizzle
export const ContactPriorityDB = [
  ContactPriority.LOW,
  ContactPriority.MEDIUM,
  ContactPriority.HIGH,
  ContactPriority.URGENT,
] as const;

/**
 * Contact Status options
 * Uses scoped translation keys from contact i18n
 */
export const {
  enum: ContactStatus,
  options: ContactStatusOptions,
  Value: ContactStatusValue,
} = createEnumOptions({
  NEW: "status.new",
  IN_PROGRESS: "status.inProgress",
  RESOLVED: "status.resolved",
  CLOSED: "status.closed",
});

// Create DB enum array for Drizzle
export const ContactStatusDB = [
  ContactStatus.NEW,
  ContactStatus.IN_PROGRESS,
  ContactStatus.RESOLVED,
  ContactStatus.CLOSED,
] as const;
