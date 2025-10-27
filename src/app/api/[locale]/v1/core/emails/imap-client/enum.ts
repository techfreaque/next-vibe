import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * IMAP Sync Status Enum
 */
export const {
  enum: ImapSyncStatus,
  options: ImapSyncStatusOptions,
  Value: ImapSyncStatusValue,
} = createEnumOptions({
  PENDING: "app.api.v1.core.emails.enums.imapSyncStatus.pending",
  SYNCING: "app.api.v1.core.emails.enums.imapSyncStatus.syncing",
  SYNCED: "app.api.v1.core.emails.enums.imapSyncStatus.synced",
  ERROR: "app.api.v1.core.emails.enums.imapSyncStatus.error",
});

/**
 * IMAP Overall Sync Status Enum
 */
export const {
  enum: ImapOverallSyncStatus,
  options: ImapOverallSyncStatusOptions,
  Value: ImapOverallSyncStatusValue,
} = createEnumOptions({
  IDLE: "app.api.v1.core.emails.enums.imapOverallSyncStatus.idle",
  RUNNING: "app.api.v1.core.emails.enums.imapOverallSyncStatus.running",
  COMPLETED: "app.api.v1.core.emails.enums.imapOverallSyncStatus.completed",
  FAILED: "app.api.v1.core.emails.enums.imapOverallSyncStatus.failed",
  CANCELLED: "app.api.v1.core.emails.enums.imapOverallSyncStatus.cancelled",
});

/**
 * Sort order enumeration
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions({
  ASC: "app.api.v1.core.emails.enums.imapSortOrder.asc",
  DESC: "app.api.v1.core.emails.enums.imapSortOrder.desc",
});

/**
 * IMAP Authentication Method Enum
 */
export const {
  enum: ImapAuthMethod,
  options: ImapAuthMethodOptions,
  Value: ImapAuthMethodValue,
} = createEnumOptions({
  PLAIN: "app.api.v1.core.emails.enums.imapAuthMethod.plain",
  OAUTH2: "app.api.v1.core.emails.enums.imapAuthMethod.oauth2",
  XOAUTH2: "app.api.v1.core.emails.enums.imapAuthMethod.xoauth2",
});

/**
 * IMAP Special Use Folder Types
 */
export const {
  enum: ImapSpecialUseType,
  options: ImapSpecialUseTypeOptions,
  Value: ImapSpecialUseTypeValue,
} = createEnumOptions({
  INBOX: "app.api.v1.core.emails.enums.imapSpecialUseType.inbox",
  SENT: "app.api.v1.core.emails.enums.imapSpecialUseType.sent",
  DRAFTS: "app.api.v1.core.emails.enums.imapSpecialUseType.drafts",
  TRASH: "app.api.v1.core.emails.enums.imapSpecialUseType.trash",
  JUNK: "app.api.v1.core.emails.enums.imapSpecialUseType.junk",
  ARCHIVE: "app.api.v1.core.emails.enums.imapSpecialUseType.archive",
});

/**
 * IMAP Folder Sort Fields
 */
export const {
  enum: ImapFolderSortField,
  options: ImapFolderSortFieldOptions,
  Value: ImapFolderSortFieldValue,
} = createEnumOptions({
  NAME: "app.api.v1.core.emails.enums.imapFolderSortField.name",
  DISPLAY_NAME: "app.api.v1.core.emails.enums.imapFolderSortField.displayName",
  MESSAGE_COUNT:
    "app.api.v1.core.emails.enums.imapFolderSortField.messageCount",
  UNSEEN_COUNT: "app.api.v1.core.emails.enums.imapFolderSortField.unseenCount",
  CREATED_AT: "app.api.v1.core.emails.enums.imapFolderSortField.createdAt",
});

/**
 * IMAP Account Sort Fields
 */
export const {
  enum: ImapAccountSortField,
  options: ImapAccountSortFieldOptions,
  Value: ImapAccountSortFieldValue,
} = createEnumOptions({
  NAME: "app.api.v1.core.emails.enums.imapAccountSortField.name",
  EMAIL: "app.api.v1.core.emails.enums.imapAccountSortField.email",
  HOST: "app.api.v1.core.emails.enums.imapAccountSortField.host",
  ENABLED: "app.api.v1.core.emails.enums.imapAccountSortField.enabled",
  LAST_SYNC_AT: "app.api.v1.core.emails.enums.imapAccountSortField.lastSyncAt",
  CREATED_AT: "app.api.v1.core.emails.enums.imapAccountSortField.createdAt",
});

/**
 * IMAP Connection Status Enum
 */
export const {
  enum: ImapConnectionStatus,
  options: ImapConnectionStatusOptions,
  Value: ImapConnectionStatusValue,
} = createEnumOptions({
  DISCONNECTED:
    "app.api.v1.core.emails.enums.imapConnectionStatus.disconnected",
  CONNECTING: "app.api.v1.core.emails.enums.imapConnectionStatus.connecting",
  CONNECTED: "app.api.v1.core.emails.enums.imapConnectionStatus.connected",
  ERROR: "app.api.v1.core.emails.enums.imapConnectionStatus.error",
  TIMEOUT: "app.api.v1.core.emails.enums.imapConnectionStatus.timeout",
});

/**
 * IMAP Sync Status Filter Enum (includes "all" option)
 */
export const {
  enum: ImapSyncStatusFilter,
  options: ImapSyncStatusFilterOptions,
  Value: ImapSyncStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.emails.enums.imapSyncStatusFilter.all",
  PENDING: "app.api.v1.core.emails.enums.imapSyncStatus.pending",
  SYNCING: "app.api.v1.core.emails.enums.imapSyncStatus.syncing",
  SYNCED: "app.api.v1.core.emails.enums.imapSyncStatus.synced",
  ERROR: "app.api.v1.core.emails.enums.imapSyncStatus.error",
});

/**
 * IMAP Account Status Filter Enum (includes "all" option)
 */
export const {
  enum: ImapAccountStatusFilter,
  options: ImapAccountStatusFilterOptions,
  Value: ImapAccountStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.emails.enums.imapAccountStatusFilter.all",
  ENABLED: "app.api.v1.core.emails.enums.imapAccountStatusFilter.enabled",
  DISABLED: "app.api.v1.core.emails.enums.imapAccountStatusFilter.disabled",
  CONNECTED: "app.api.v1.core.emails.enums.imapConnectionStatus.connected",
  DISCONNECTED:
    "app.api.v1.core.emails.enums.imapConnectionStatus.disconnected",
  ERROR: "app.api.v1.core.emails.enums.imapConnectionStatus.error",
});

/**
 * IMAP Account Filter Values
 */
export const {
  enum: ImapAccountFilter,
  options: ImapAccountFilterOptions,
  Value: ImapAccountFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.emails.enums.imapAccountFilter.all",
});

/**
 * IMAP Message Sort Fields
 */
export const {
  enum: ImapMessageSortField,
  options: ImapMessageSortFieldOptions,
  Value: ImapMessageSortFieldValue,
} = createEnumOptions({
  SUBJECT: "app.api.v1.core.emails.enums.imapMessageSortField.subject",
  SENDER_NAME: "app.api.v1.core.emails.enums.imapMessageSortField.senderName",
  SENDER_EMAIL: "app.api.v1.core.emails.enums.imapMessageSortField.senderEmail",
  RECIPIENT_EMAIL:
    "app.api.v1.core.emails.enums.imapMessageSortField.recipientEmail",
  RECIPIENT_NAME:
    "app.api.v1.core.emails.enums.imapMessageSortField.recipientName",
  IS_READ: "app.api.v1.core.emails.enums.imapMessageSortField.isRead",
  IS_FLAGGED: "app.api.v1.core.emails.enums.imapMessageSortField.isFlagged",
  MESSAGE_SIZE: "app.api.v1.core.emails.enums.imapMessageSortField.messageSize",
  SENT_AT: "app.api.v1.core.emails.enums.imapMessageSortField.sentAt",
  CREATED_AT: "app.api.v1.core.emails.enums.imapMessageSortField.createdAt",
});

/**
 * IMAP Message Status Filter Enum
 */
export const {
  enum: ImapMessageStatusFilter,
  options: ImapMessageStatusFilterOptions,
  Value: ImapMessageStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.emails.enums.imapMessageStatusFilter.all",
  READ: "app.api.v1.core.emails.enums.imapMessageStatusFilter.read",
  UNREAD: "app.api.v1.core.emails.enums.imapMessageStatusFilter.unread",
  FLAGGED: "app.api.v1.core.emails.enums.imapMessageStatusFilter.flagged",
  UNFLAGGED: "app.api.v1.core.emails.enums.imapMessageStatusFilter.unflagged",
  DRAFT: "app.api.v1.core.emails.enums.imapMessageStatusFilter.draft",
  DELETED: "app.api.v1.core.emails.enums.imapMessageStatusFilter.deleted",
  HAS_ATTACHMENTS:
    "app.api.v1.core.emails.enums.imapMessageStatusFilter.hasAttachments",
  NO_ATTACHMENTS:
    "app.api.v1.core.emails.enums.imapMessageStatusFilter.noAttachments",
});

/**
 * IMAP Health Status Enum
 */
export const {
  enum: ImapHealthStatus,
  options: ImapHealthStatusOptions,
  Value: ImapHealthStatusValue,
} = createEnumOptions({
  HEALTHY: "app.api.v1.core.emails.enums.imapHealthStatus.healthy",
  WARNING: "app.api.v1.core.emails.enums.imapHealthStatus.warning",
  ERROR: "app.api.v1.core.emails.enums.imapHealthStatus.error",
  MAINTENANCE: "app.api.v1.core.emails.enums.imapHealthStatus.maintenance",
});

/**
 * IMAP Performance Metric Status Enum
 */
export const {
  enum: ImapPerformanceStatus,
  options: ImapPerformanceStatusOptions,
  Value: ImapPerformanceStatusValue,
} = createEnumOptions({
  GOOD: "app.api.v1.core.emails.enums.imapPerformanceStatus.good",
  WARNING: "app.api.v1.core.emails.enums.imapPerformanceStatus.warning",
  ERROR: "app.api.v1.core.emails.enums.imapPerformanceStatus.error",
});

// DB enum exports for Drizzle
export const ImapSyncStatusDB = [
  ImapSyncStatus.PENDING,
  ImapSyncStatus.SYNCING,
  ImapSyncStatus.SYNCED,
  ImapSyncStatus.ERROR,
] as const;

export const ImapSpecialUseTypeDB = [
  ImapSpecialUseType.INBOX,
  ImapSpecialUseType.SENT,
  ImapSpecialUseType.DRAFTS,
  ImapSpecialUseType.TRASH,
  ImapSpecialUseType.JUNK,
  ImapSpecialUseType.ARCHIVE,
] as const;

export const ImapAuthMethodDB = [
  ImapAuthMethod.PLAIN,
  ImapAuthMethod.OAUTH2,
  ImapAuthMethod.XOAUTH2,
] as const;
