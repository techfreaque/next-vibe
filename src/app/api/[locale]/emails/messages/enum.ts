/**
 * Emails Enums
 * Enums for email management and filtering
 */
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export { SortOrder, SortOrderOptions } from "../imap-client/enum";

/**
 * Email Status Enum
 */
export const {
  enum: EmailStatus,
  options: EmailStatusOptions,
  Value: EmailStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.status.pending",
  SENT: "enums.status.sent",
  DELIVERED: "enums.status.delivered",
  OPENED: "enums.status.opened",
  CLICKED: "enums.status.clicked",
  BOUNCED: "enums.status.bounced",
  FAILED: "enums.status.failed",
  UNSUBSCRIBED: "enums.status.unsubscribed",
});

/**
 * Email Type Enum
 */
export const {
  enum: EmailType,
  options: EmailTypeOptions,
  Value: EmailTypeValue,
} = createEnumOptions(scopedTranslation, {
  TRANSACTIONAL: "enums.type.transactional",
  MARKETING: "enums.type.marketing",
  NOTIFICATION: "enums.type.notification",
  SYSTEM: "enums.type.system",
  LEAD_CAMPAIGN: "enums.type.leadCampaign",
  USER_COMMUNICATION: "enums.type.userCommunication",
});

/**
 * Email Provider Enum
 */
export const {
  enum: EmailProvider,
  options: EmailProviderOptions,
  Value: EmailProviderValue,
} = createEnumOptions(scopedTranslation, {
  RESEND: "enums.provider.resend",
  SENDGRID: "enums.provider.sendgrid",
  MAILGUN: "enums.provider.mailgun",
  SES: "enums.provider.ses",
  SMTP: "enums.provider.smtp",
  MAILJET: "enums.provider.mailjet",
  POSTMARK: "enums.provider.postmark",
  OTHER: "enums.provider.other",
});

/**
 * Email Sort Fields Enum
 */
export const {
  enum: EmailSortField,
  options: EmailSortFieldOptions,
  Value: EmailSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  SUBJECT: "enums.sortField.subject",
  RECIPIENT_EMAIL: "enums.sortField.recipientEmail",
  RECIPIENT_NAME: "enums.sortField.recipientName",
  TYPE: "enums.sortField.type",
  STATUS: "enums.sortField.status",
  SENT_AT: "enums.sortField.sentAt",
  CREATED_AT: "enums.sortField.createdAt",
});

/**
 * Email Status Filter Enum (includes "any" option)
 */
export const {
  enum: EmailStatusFilter,
  options: EmailStatusFilterOptions,
  Value: EmailStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.statusFilter.any",
  PENDING: "enums.status.pending",
  SENT: "enums.status.sent",
  DELIVERED: "enums.status.delivered",
  OPENED: "enums.status.opened",
  CLICKED: "enums.status.clicked",
  BOUNCED: "enums.status.bounced",
  FAILED: "enums.status.failed",
  UNSUBSCRIBED: "enums.status.unsubscribed",
});

/**
 * Email Type Filter Enum (includes "any" option)
 */
export const {
  enum: EmailTypeFilter,
  options: EmailTypeFilterOptions,
  Value: EmailTypeFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.typeFilter.any",
  TRANSACTIONAL: "enums.type.transactional",
  MARKETING: "enums.type.marketing",
  NOTIFICATION: "enums.type.notification",
  SYSTEM: "enums.type.system",
  LEAD_CAMPAIGN: "enums.type.leadCampaign",
  USER_COMMUNICATION: "enums.type.userCommunication",
});

/**
 * Retry Range Enum for email retry statistics
 */
export const {
  enum: RetryRange,
  options: RetryRangeOptions,
  Value: RetryRangeValue,
} = createEnumOptions(scopedTranslation, {
  NO_RETRIES: "enums.retryRange.noRetries",
  ONE_TO_TWO: "enums.retryRange.oneToTwo",
  THREE_TO_FIVE: "enums.retryRange.threeToFive",
  SIX_PLUS: "enums.retryRange.sixPlus",
});

/**
 * Map email status filter to actual status
 */
export function mapEmailStatusFilter(
  filter:
    | (typeof EmailStatusFilter)[keyof typeof EmailStatusFilter]
    | undefined,
): (typeof EmailStatus)[keyof typeof EmailStatus] | null {
  switch (filter) {
    case EmailStatusFilter.PENDING:
      return EmailStatus.PENDING;
    case EmailStatusFilter.SENT:
      return EmailStatus.SENT;
    case EmailStatusFilter.DELIVERED:
      return EmailStatus.DELIVERED;
    case EmailStatusFilter.OPENED:
      return EmailStatus.OPENED;
    case EmailStatusFilter.CLICKED:
      return EmailStatus.CLICKED;
    case EmailStatusFilter.BOUNCED:
      return EmailStatus.BOUNCED;
    case EmailStatusFilter.FAILED:
      return EmailStatus.FAILED;
    case EmailStatusFilter.UNSUBSCRIBED:
      return EmailStatus.UNSUBSCRIBED;
    default:
      return null;
  }
}

/**
 * Map email type filter to actual type
 */
export function mapEmailTypeFilter(
  filter: (typeof EmailTypeFilter)[keyof typeof EmailTypeFilter] | undefined,
): (typeof EmailType)[keyof typeof EmailType] | null {
  switch (filter) {
    case EmailTypeFilter.TRANSACTIONAL:
      return EmailType.TRANSACTIONAL;
    case EmailTypeFilter.MARKETING:
      return EmailType.MARKETING;
    case EmailTypeFilter.NOTIFICATION:
      return EmailType.NOTIFICATION;
    case EmailTypeFilter.SYSTEM:
      return EmailType.SYSTEM;
    case EmailTypeFilter.LEAD_CAMPAIGN:
      return EmailType.LEAD_CAMPAIGN;
    case EmailTypeFilter.USER_COMMUNICATION:
      return EmailType.USER_COMMUNICATION;
    default:
      return null;
  }
}

// DB enum exports for Drizzle
export const EmailStatusDB = [
  EmailStatus.PENDING,
  EmailStatus.SENT,
  EmailStatus.DELIVERED,
  EmailStatus.BOUNCED,
  EmailStatus.FAILED,
  EmailStatus.OPENED,
  EmailStatus.CLICKED,
  EmailStatus.UNSUBSCRIBED,
] as const;

export const EmailProviderDB = [
  EmailProvider.SMTP,
  EmailProvider.SENDGRID,
  EmailProvider.MAILGUN,
  EmailProvider.SES,
  EmailProvider.POSTMARK,
  EmailProvider.RESEND,
] as const;

export const EmailTypeDB = [
  EmailType.TRANSACTIONAL,
  EmailType.MARKETING,
  EmailType.NOTIFICATION,
  EmailType.SYSTEM,
  EmailType.LEAD_CAMPAIGN,
  EmailType.USER_COMMUNICATION,
] as const;

export const EmailTypeFilterDB = [
  EmailTypeFilter.ANY,
  EmailTypeFilter.TRANSACTIONAL,
  EmailTypeFilter.MARKETING,
  EmailTypeFilter.NOTIFICATION,
  EmailTypeFilter.SYSTEM,
  EmailTypeFilter.USER_COMMUNICATION,
] as const;

export const EmailSortFieldDB = [
  EmailSortField.CREATED_AT,
  EmailSortField.SENT_AT,
  EmailSortField.SUBJECT,
  EmailSortField.RECIPIENT_EMAIL,
  EmailSortField.RECIPIENT_NAME,
  EmailSortField.STATUS,
  EmailSortField.TYPE,
] as const;
