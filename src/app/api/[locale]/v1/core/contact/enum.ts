/**
 * Contact API Enums with Translation Options
 * Enum definitions for contact form operations with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

/**
 * Contact Subject options
 */
export const {
  enum: ContactSubject,
  options: ContactSubjectOptions,
  Value: ContactSubjectValue,
} = createEnumOptions({
  HELP_SUPPORT: "app.api.v1.core.contact.subject.helpSupport",
  GENERAL_INQUIRY: "app.api.v1.core.contact.subject.generalInquiry",
  TECHNICAL_SUPPORT: "app.api.v1.core.contact.subject.technicalSupport",
  ACCOUNT_QUESTION: "app.api.v1.core.contact.subject.accountQuestion",
  BILLING_QUESTION: "app.api.v1.core.contact.subject.billingQuestion",
  SALES_INQUIRY: "app.api.v1.core.contact.subject.salesInquiry",
  FEATURE_REQUEST: "app.api.v1.core.contact.subject.featureRequest",
  BUG_REPORT: "app.api.v1.core.contact.subject.bugReport",
  FEEDBACK: "app.api.v1.core.contact.subject.feedback",
  COMPLAINT: "app.api.v1.core.contact.subject.complaint",
  PARTNERSHIP: "app.api.v1.core.contact.subject.partnership",
  OTHER: "app.api.v1.core.contact.subject.other",
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
  LOW: "app.api.v1.core.contact.priority.low",
  MEDIUM: "app.api.v1.core.contact.priority.medium",
  HIGH: "app.api.v1.core.contact.priority.high",
  URGENT: "app.api.v1.core.contact.priority.urgent",
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
  NEW: "app.api.v1.core.contact.status.new",
  IN_PROGRESS: "app.api.v1.core.contact.status.inProgress",
  RESOLVED: "app.api.v1.core.contact.status.resolved",
  CLOSED: "app.api.v1.core.contact.status.closed",
});

// Create DB enum array for Drizzle
export const ContactStatusDB = [
  ContactStatus.NEW,
  ContactStatus.IN_PROGRESS,
  ContactStatus.RESOLVED,
  ContactStatus.CLOSED,
] as const;
