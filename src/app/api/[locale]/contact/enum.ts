/**
 * Contact API Enums with Translation Options
 * Enum definitions for contact form operations with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Contact Subject options
 * Uses scoped translation keys from contact i18n _components
 */
export const {
  enum: ContactSubject,
  options: ContactSubjectOptions,
  Value: ContactSubjectValue,
} = createEnumOptions(scopedTranslation, {
  HELP_SUPPORT: "subject.helpSupport",
  GENERAL_INQUIRY: "subject.generalInquiry",
  TECHNICAL_SUPPORT: "subject.technicalSupport",
  ACCOUNT_QUESTION: "subject.accountQuestion",
  BILLING_QUESTION: "subject.billingQuestion",
  SALES_INQUIRY: "subject.salesInquiry",
  FEATURE_REQUEST: "subject.featureRequest",
  BUG_REPORT: "subject.bugReport",
  FEEDBACK: "subject.feedback",
  COMPLAINT: "subject.complaint",
  PARTNERSHIP: "subject.partnership",
  OTHER: "subject.other",
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
} = createEnumOptions(scopedTranslation, {
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
} = createEnumOptions(scopedTranslation, {
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
