/**
 * Emails Enums
 * Enums for email management and filtering
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

export { SortOrder, SortOrderOptions } from "../imap-client/enum";

/**
 * Email Status Enum
 */
export const {
  enum: EmailStatus,
  options: EmailStatusOptions,
  Value: EmailStatusValue,
} = createEnumOptions({
  PENDING: "app.api.emails.enums.emailStatus.pending",
  SENT: "app.api.emails.enums.emailStatus.sent",
  DELIVERED: "app.api.emails.enums.emailStatus.delivered",
  OPENED: "app.api.emails.enums.emailStatus.opened",
  CLICKED: "app.api.emails.enums.emailStatus.clicked",
  BOUNCED: "app.api.emails.enums.emailStatus.bounced",
  FAILED: "app.api.emails.enums.emailStatus.failed",
  UNSUBSCRIBED: "app.api.emails.enums.emailStatus.unsubscribed",
});

/**
 * Email Type Enum
 */
export const {
  enum: EmailType,
  options: EmailTypeOptions,
  Value: EmailTypeValue,
} = createEnumOptions({
  TRANSACTIONAL: "app.api.emails.enums.emailType.transactional",
  MARKETING: "app.api.emails.enums.emailType.marketing",
  NOTIFICATION: "app.api.emails.enums.emailType.notification",
  SYSTEM: "app.api.emails.enums.emailType.system",
  LEAD_CAMPAIGN: "app.api.emails.enums.emailType.leadCampaign",
  USER_COMMUNICATION: "app.api.emails.enums.emailType.userCommunication",
});

/**
 * Email Provider Enum
 */
export const {
  enum: EmailProvider,
  options: EmailProviderOptions,
  Value: EmailProviderValue,
} = createEnumOptions({
  RESEND: "app.api.emails.enums.emailProvider.resend",
  SENDGRID: "app.api.emails.enums.emailProvider.sendgrid",
  MAILGUN: "app.api.emails.enums.emailProvider.mailgun",
  SES: "app.api.emails.enums.emailProvider.ses",
  SMTP: "app.api.emails.enums.emailProvider.smtp",
  MAILJET: "app.api.emails.enums.emailProvider.mailjet",
  POSTMARK: "app.api.emails.enums.emailProvider.postmark",
  OTHER: "app.api.emails.enums.emailProvider.other",
});

/**
 * Email Sort Fields Enum
 */
export const {
  enum: EmailSortField,
  options: EmailSortFieldOptions,
  Value: EmailSortFieldValue,
} = createEnumOptions({
  SUBJECT: "app.api.emails.enums.emailSortField.subject",
  RECIPIENT_EMAIL: "app.api.emails.enums.emailSortField.recipientEmail",
  RECIPIENT_NAME: "app.api.emails.enums.emailSortField.recipientName",
  TYPE: "app.api.emails.enums.emailSortField.type",
  STATUS: "app.api.emails.enums.emailSortField.status",
  SENT_AT: "app.api.emails.enums.emailSortField.sentAt",
  CREATED_AT: "app.api.emails.enums.emailSortField.createdAt",
});

/**
 * Email Status Filter Enum (includes "all" option)
 */
export const {
  enum: EmailStatusFilter,
  options: EmailStatusFilterOptions,
  Value: EmailStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.emailStatusFilter.all",
  PENDING: "app.api.emails.enums.emailStatus.pending",
  SENT: "app.api.emails.enums.emailStatus.sent",
  DELIVERED: "app.api.emails.enums.emailStatus.delivered",
  OPENED: "app.api.emails.enums.emailStatus.opened",
  CLICKED: "app.api.emails.enums.emailStatus.clicked",
  BOUNCED: "app.api.emails.enums.emailStatus.bounced",
  FAILED: "app.api.emails.enums.emailStatus.failed",
  UNSUBSCRIBED: "app.api.emails.enums.emailStatus.unsubscribed",
});

/**
 * Email Type Filter Enum (includes "all" option)
 */
export const {
  enum: EmailTypeFilter,
  options: EmailTypeFilterOptions,
  Value: EmailTypeFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.emailTypeFilter.all",
  TRANSACTIONAL: "app.api.emails.enums.emailType.transactional",
  MARKETING: "app.api.emails.enums.emailType.marketing",
  NOTIFICATION: "app.api.emails.enums.emailType.notification",
  SYSTEM: "app.api.emails.enums.emailType.system",
  LEAD_CAMPAIGN: "app.api.emails.enums.emailType.leadCampaign",
  USER_COMMUNICATION: "app.api.emails.enums.emailType.userCommunication",
});

/**
 * Retry Range Enum for email retry statistics
 */
export const {
  enum: RetryRange,
  options: RetryRangeOptions,
  Value: RetryRangeValue,
} = createEnumOptions({
  NO_RETRIES: "app.api.emails.enums.emailRetryRange.noRetries",
  ONE_TO_TWO: "app.api.emails.enums.emailRetryRange.oneToTwo",
  THREE_TO_FIVE: "app.api.emails.enums.emailRetryRange.threeToFive",
  SIX_PLUS: "app.api.emails.enums.emailRetryRange.sixPlus",
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
  EmailTypeFilter.ALL,
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
