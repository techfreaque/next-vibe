/**
 * Consultation enums
 * Defines the enums used in the consultation module
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Consultation status enum
 */
export const {
  enum: ConsultationStatus,
  options: ConsultationStatusOptions,
  Value: ConsultationStatusValue,
} = createEnumOptions({
  PENDING: "app.api.v1.core.consultation.enums.consultationStatus.pending",
  SCHEDULED: "app.api.v1.core.consultation.enums.consultationStatus.scheduled",
  CONFIRMED: "app.api.v1.core.consultation.enums.consultationStatus.confirmed",
  COMPLETED: "app.api.v1.core.consultation.enums.consultationStatus.completed",
  CANCELLED: "app.api.v1.core.consultation.enums.consultationStatus.cancelled",
  NO_SHOW: "app.api.v1.core.consultation.enums.consultationStatus.noShow",
});

/**
 * Consultation Status Filter Enum - includes ALL option for filtering
 */
export const {
  enum: ConsultationStatusFilter,
  options: ConsultationStatusFilterOptions,
  Value: ConsultationStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.consultation.enums.consultationStatusFilter.all",
  PENDING:
    "app.api.v1.core.consultation.enums.consultationStatusFilter.pending",
  SCHEDULED:
    "app.api.v1.core.consultation.enums.consultationStatusFilter.scheduled",
  CONFIRMED:
    "app.api.v1.core.consultation.enums.consultationStatusFilter.confirmed",
  COMPLETED:
    "app.api.v1.core.consultation.enums.consultationStatusFilter.completed",
  CANCELLED:
    "app.api.v1.core.consultation.enums.consultationStatusFilter.cancelled",
  NO_SHOW: "app.api.v1.core.consultation.enums.consultationStatusFilter.noShow",
});

/**
 * Consultation Sort Fields
 */
export const {
  enum: ConsultationSortField,
  options: ConsultationSortFieldOptions,
  Value: ConsultationSortFieldValue,
} = createEnumOptions({
  CREATED_AT:
    "app.api.v1.core.consultation.enums.consultationSortField.createdAt",
  UPDATED_AT:
    "app.api.v1.core.consultation.enums.consultationSortField.updatedAt",
  PREFERRED_DATE:
    "app.api.v1.core.consultation.enums.consultationSortField.preferredDate",
  SCHEDULED_DATE:
    "app.api.v1.core.consultation.enums.consultationSortField.scheduledDate",
  STATUS: "app.api.v1.core.consultation.enums.consultationSortField.status",
  USER_EMAIL:
    "app.api.v1.core.consultation.enums.consultationSortField.userEmail",
});

/**
 * Sort Order
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions({
  ASC: "app.api.v1.core.consultation.enums.sortOrder.asc",
  DESC: "app.api.v1.core.consultation.enums.sortOrder.desc",
});

/**
 * Consultation Outcome Enum - defines the possible outcomes of a consultation
 * NOTE: Values must match database enum exactly (lowercase with underscores)
 * Using TypeScript enum to work with z.nativeEnum while ensuring correct database values
 */
export const {
  enum: ConsultationOutcome,
  options: ConsultationOutcomeOptions,
  Value: ConsultationOutcomeValue,
} = createEnumOptions({
  SUCCESSFUL:
    "app.api.v1.core.consultation.enums.consultationOutcome.successful",
  FOLLOW_UP_NEEDED:
    "app.api.v1.core.consultation.enums.consultationOutcome.followUpNeeded",
  NOT_INTERESTED:
    "app.api.v1.core.consultation.enums.consultationOutcome.notInterested",
  RESCHEDULED:
    "app.api.v1.core.consultation.enums.consultationOutcome.rescheduled",
  NO_SHOW: "app.api.v1.core.consultation.enums.consultationOutcome.noShow",
  CANCELLED: "app.api.v1.core.consultation.enums.consultationOutcome.cancelled",
  TECHNICAL_ISSUES:
    "app.api.v1.core.consultation.enums.consultationOutcome.technicalIssues",
});

// Create DB arrays for database schema
export const ConsultationStatusDB = [
  ConsultationStatus.PENDING,
  ConsultationStatus.SCHEDULED,
  ConsultationStatus.CONFIRMED,
  ConsultationStatus.COMPLETED,
  ConsultationStatus.CANCELLED,
  ConsultationStatus.NO_SHOW,
] as const;

export const ConsultationOutcomeDB = [
  ConsultationOutcome.SUCCESSFUL,
  ConsultationOutcome.FOLLOW_UP_NEEDED,
  ConsultationOutcome.NOT_INTERESTED,
  ConsultationOutcome.RESCHEDULED,
  ConsultationOutcome.NO_SHOW,
  ConsultationOutcome.CANCELLED,
  ConsultationOutcome.TECHNICAL_ISSUES,
] as const;

/**
 * Consultation Type Enum - defines the different types of consultations
 */
export const {
  enum: ConsultationType,
  options: ConsultationTypeOptions,
  Value: ConsultationTypeValue,
} = createEnumOptions({
  INITIAL: "app.api.v1.core.consultation.enums.consultationType.initial",
  FOLLOW_UP: "app.api.v1.core.consultation.enums.consultationType.followUp",
  TECHNICAL: "app.api.v1.core.consultation.enums.consultationType.technical",
  SALES: "app.api.v1.core.consultation.enums.consultationType.sales",
  SUPPORT: "app.api.v1.core.consultation.enums.consultationType.support",
  STRATEGY: "app.api.v1.core.consultation.enums.consultationType.strategy",
});

/**
 * Helper function to convert status filter to actual status
 */
export function getConsultationStatusFromFilter(
  filter: typeof ConsultationStatusFilterValue,
): typeof ConsultationStatusValue | null {
  switch (filter) {
    case ConsultationStatusFilter.PENDING:
      return ConsultationStatus.PENDING;
    case ConsultationStatusFilter.SCHEDULED:
      return ConsultationStatus.SCHEDULED;
    case ConsultationStatusFilter.CONFIRMED:
      return ConsultationStatus.CONFIRMED;
    case ConsultationStatusFilter.COMPLETED:
      return ConsultationStatus.COMPLETED;
    case ConsultationStatusFilter.CANCELLED:
      return ConsultationStatus.CANCELLED;
    case ConsultationStatusFilter.NO_SHOW:
      return ConsultationStatus.NO_SHOW;
    case ConsultationStatusFilter.ALL:
      return null;
  }
}

/**
 * JavaScript weekday enum (as returned by Date.getDay())
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export const {
  enum: JSWeekday,
  options: JSWeekdayOptions,
  Value: JSWeekdayValue,
} = createEnumOptions({
  SUNDAY: "app.api.v1.core.consultation.enums.jsWeekday.sunday",
  MONDAY: "app.api.v1.core.consultation.enums.jsWeekday.monday",
  TUESDAY: "app.api.v1.core.consultation.enums.jsWeekday.tuesday",
  WEDNESDAY: "app.api.v1.core.consultation.enums.jsWeekday.wednesday",
  THURSDAY: "app.api.v1.core.consultation.enums.jsWeekday.thursday",
  FRIDAY: "app.api.v1.core.consultation.enums.jsWeekday.friday",
  SATURDAY: "app.api.v1.core.consultation.enums.jsWeekday.saturday",
});

// Maintain numeric values for Date.getDay() compatibility
export const JSWeekdayValues = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

/**
 * ISO weekday enum (ISO 8601 standard)
 * 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
 */
export const {
  enum: ISOWeekday,
  options: ISOWeekdayOptions,
  Value: ISOWeekdayValue,
} = createEnumOptions({
  MONDAY: "app.api.v1.core.consultation.enums.isoWeekday.monday",
  TUESDAY: "app.api.v1.core.consultation.enums.isoWeekday.tuesday",
  WEDNESDAY: "app.api.v1.core.consultation.enums.isoWeekday.wednesday",
  THURSDAY: "app.api.v1.core.consultation.enums.isoWeekday.thursday",
  FRIDAY: "app.api.v1.core.consultation.enums.isoWeekday.friday",
  SATURDAY: "app.api.v1.core.consultation.enums.isoWeekday.saturday",
  SUNDAY: "app.api.v1.core.consultation.enums.isoWeekday.sunday",
});

// Maintain numeric values for ISO standard compatibility
export const ISOWeekdayValues = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
} as const;

// Maintain numeric values for calendar compatibility
export const WeekStartDayValues = {
  SUNDAY: 0,
  MONDAY: 1,
} as const;

/**
 * Calendar week start preferences by locale
 */
export const {
  enum: WeekStartDay,
  options: WeekStartDayOptions,
  Value: WeekStartDayValue,
} = createEnumOptions({
  SUNDAY: "app.api.v1.core.consultation.enums.weekStartDay.sunday", // US, International
  MONDAY: "app.api.v1.core.consultation.enums.weekStartDay.monday", // Germany, Poland, most of Europe
});
