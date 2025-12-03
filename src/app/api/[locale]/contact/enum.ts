/**
 * Contact API Enums with Translation Options
 * Enum definitions for contact form operations with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Contact Subject options
 */
export const {
  enum: ContactSubject,
  options: ContactSubjectOptions,
  Value: ContactSubjectValue,
} = createEnumOptions({
  HELP_SUPPORT: "app.api.contact.subject.helpSupport",
  GENERAL_INQUIRY: "app.api.contact.subject.generalInquiry",
  TECHNICAL_SUPPORT: "app.api.contact.subject.technicalSupport",
  ACCOUNT_QUESTION: "app.api.contact.subject.accountQuestion",
  BILLING_QUESTION: "app.api.contact.subject.billingQuestion",
  SALES_INQUIRY: "app.api.contact.subject.salesInquiry",
  FEATURE_REQUEST: "app.api.contact.subject.featureRequest",
  BUG_REPORT: "app.api.contact.subject.bugReport",
  FEEDBACK: "app.api.contact.subject.feedback",
  COMPLAINT: "app.api.contact.subject.complaint",
  PARTNERSHIP: "app.api.contact.subject.partnership",
  OTHER: "app.api.contact.subject.other",
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
 */
export const {
  enum: ContactPriority,
  options: ContactPriorityOptions,
  Value: ContactPriorityValue,
} = createEnumOptions({
  LOW: "app.api.contact.priority.low",
  MEDIUM: "app.api.contact.priority.medium",
  HIGH: "app.api.contact.priority.high",
  URGENT: "app.api.contact.priority.urgent",
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
 */
export const {
  enum: ContactStatus,
  options: ContactStatusOptions,
  Value: ContactStatusValue,
} = createEnumOptions({
  NEW: "app.api.contact.status.new",
  IN_PROGRESS: "app.api.contact.status.inProgress",
  RESOLVED: "app.api.contact.status.resolved",
  CLOSED: "app.api.contact.status.closed",
});

// Create DB enum array for Drizzle
export const ContactStatusDB = [
  ContactStatus.NEW,
  ContactStatus.IN_PROGRESS,
  ContactStatus.RESOLVED,
  ContactStatus.CLOSED,
] as const;
