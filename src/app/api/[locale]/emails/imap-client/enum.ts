import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * IMAP Sync Status Enum
 */
export const {
  enum: ImapSyncStatus,
  options: ImapSyncStatusOptions,
  Value: ImapSyncStatusValue,
} = createEnumOptions({
  PENDING: "app.api.emails.enums.imapSyncStatus.pending",
  SYNCING: "app.api.emails.enums.imapSyncStatus.syncing",
  SYNCED: "app.api.emails.enums.imapSyncStatus.synced",
  ERROR: "app.api.emails.enums.imapSyncStatus.error",
});

/**
 * IMAP Overall Sync Status Enum
 */
export const {
  enum: ImapOverallSyncStatus,
  options: ImapOverallSyncStatusOptions,
  Value: ImapOverallSyncStatusValue,
} = createEnumOptions({
  IDLE: "app.api.emails.enums.imapOverallSyncStatus.idle",
  RUNNING: "app.api.emails.enums.imapOverallSyncStatus.running",
  COMPLETED: "app.api.emails.enums.imapOverallSyncStatus.completed",
  FAILED: "app.api.emails.enums.imapOverallSyncStatus.failed",
  CANCELLED: "app.api.emails.enums.imapOverallSyncStatus.cancelled",
});

/**
 * Sort order enumeration
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions({
  ASC: "app.api.emails.enums.imapSortOrder.asc",
  DESC: "app.api.emails.enums.imapSortOrder.desc",
});

/**
 * IMAP Authentication Method Enum
 */
export const {
  enum: ImapAuthMethod,
  options: ImapAuthMethodOptions,
  Value: ImapAuthMethodValue,
} = createEnumOptions({
  PLAIN: "app.api.emails.enums.imapAuthMethod.plain",
  OAUTH2: "app.api.emails.enums.imapAuthMethod.oauth2",
  XOAUTH2: "app.api.emails.enums.imapAuthMethod.xoauth2",
});

/**
 * IMAP Special Use Folder Types
 */
export const {
  enum: ImapSpecialUseType,
  options: ImapSpecialUseTypeOptions,
  Value: ImapSpecialUseTypeValue,
} = createEnumOptions({
  INBOX: "app.api.emails.enums.imapSpecialUseType.inbox",
  SENT: "app.api.emails.enums.imapSpecialUseType.sent",
  DRAFTS: "app.api.emails.enums.imapSpecialUseType.drafts",
  TRASH: "app.api.emails.enums.imapSpecialUseType.trash",
  JUNK: "app.api.emails.enums.imapSpecialUseType.junk",
  ARCHIVE: "app.api.emails.enums.imapSpecialUseType.archive",
});

/**
 * IMAP Folder Sort Fields
 */
export const {
  enum: ImapFolderSortField,
  options: ImapFolderSortFieldOptions,
  Value: ImapFolderSortFieldValue,
} = createEnumOptions({
  NAME: "app.api.emails.enums.imapFolderSortField.name",
  DISPLAY_NAME: "app.api.emails.enums.imapFolderSortField.displayName",
  MESSAGE_COUNT: "app.api.emails.enums.imapFolderSortField.messageCount",
  UNSEEN_COUNT: "app.api.emails.enums.imapFolderSortField.unseenCount",
  CREATED_AT: "app.api.emails.enums.imapFolderSortField.createdAt",
});

/**
 * IMAP Account Sort Fields
 */
export const {
  enum: ImapAccountSortField,
  options: ImapAccountSortFieldOptions,
  Value: ImapAccountSortFieldValue,
} = createEnumOptions({
  NAME: "app.api.emails.enums.imapAccountSortField.name",
  EMAIL: "app.api.emails.enums.imapAccountSortField.email",
  HOST: "app.api.emails.enums.imapAccountSortField.host",
  ENABLED: "app.api.emails.enums.imapAccountSortField.enabled",
  LAST_SYNC_AT: "app.api.emails.enums.imapAccountSortField.lastSyncAt",
  CREATED_AT: "app.api.emails.enums.imapAccountSortField.createdAt",
});

/**
 * IMAP Connection Status Enum
 */
export const {
  enum: ImapConnectionStatus,
  options: ImapConnectionStatusOptions,
  Value: ImapConnectionStatusValue,
} = createEnumOptions({
  DISCONNECTED: "app.api.emails.enums.imapConnectionStatus.disconnected",
  CONNECTING: "app.api.emails.enums.imapConnectionStatus.connecting",
  CONNECTED: "app.api.emails.enums.imapConnectionStatus.connected",
  ERROR: "app.api.emails.enums.imapConnectionStatus.error",
  TIMEOUT: "app.api.emails.enums.imapConnectionStatus.timeout",
});

/**
 * IMAP Sync Status Filter Enum (includes "all" option)
 */
export const {
  enum: ImapSyncStatusFilter,
  options: ImapSyncStatusFilterOptions,
  Value: ImapSyncStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.imapSyncStatusFilter.all",
  PENDING: "app.api.emails.enums.imapSyncStatus.pending",
  SYNCING: "app.api.emails.enums.imapSyncStatus.syncing",
  SYNCED: "app.api.emails.enums.imapSyncStatus.synced",
  ERROR: "app.api.emails.enums.imapSyncStatus.error",
});

/**
 * IMAP Account Status Filter Enum (includes "all" option)
 */
export const {
  enum: ImapAccountStatusFilter,
  options: ImapAccountStatusFilterOptions,
  Value: ImapAccountStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.imapAccountStatusFilter.all",
  ENABLED: "app.api.emails.enums.imapAccountStatusFilter.enabled",
  DISABLED: "app.api.emails.enums.imapAccountStatusFilter.disabled",
  CONNECTED: "app.api.emails.enums.imapConnectionStatus.connected",
  DISCONNECTED: "app.api.emails.enums.imapConnectionStatus.disconnected",
  ERROR: "app.api.emails.enums.imapConnectionStatus.error",
});

/**
 * IMAP Account Filter Values
 */
export const {
  enum: ImapAccountFilter,
  options: ImapAccountFilterOptions,
  Value: ImapAccountFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.imapAccountFilter.all",
});

/**
 * IMAP Message Sort Fields
 */
export const {
  enum: ImapMessageSortField,
  options: ImapMessageSortFieldOptions,
  Value: ImapMessageSortFieldValue,
} = createEnumOptions({
  SUBJECT: "app.api.emails.enums.imapMessageSortField.subject",
  SENDER_NAME: "app.api.emails.enums.imapMessageSortField.senderName",
  SENDER_EMAIL: "app.api.emails.enums.imapMessageSortField.senderEmail",
  RECIPIENT_EMAIL: "app.api.emails.enums.imapMessageSortField.recipientEmail",
  RECIPIENT_NAME: "app.api.emails.enums.imapMessageSortField.recipientName",
  IS_READ: "app.api.emails.enums.imapMessageSortField.isRead",
  IS_FLAGGED: "app.api.emails.enums.imapMessageSortField.isFlagged",
  MESSAGE_SIZE: "app.api.emails.enums.imapMessageSortField.messageSize",
  SENT_AT: "app.api.emails.enums.imapMessageSortField.sentAt",
  CREATED_AT: "app.api.emails.enums.imapMessageSortField.createdAt",
});

/**
 * IMAP Message Status Filter Enum
 */
export const {
  enum: ImapMessageStatusFilter,
  options: ImapMessageStatusFilterOptions,
  Value: ImapMessageStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.imapMessageStatusFilter.all",
  READ: "app.api.emails.enums.imapMessageStatusFilter.read",
  UNREAD: "app.api.emails.enums.imapMessageStatusFilter.unread",
  FLAGGED: "app.api.emails.enums.imapMessageStatusFilter.flagged",
  UNFLAGGED: "app.api.emails.enums.imapMessageStatusFilter.unflagged",
  DRAFT: "app.api.emails.enums.imapMessageStatusFilter.draft",
  DELETED: "app.api.emails.enums.imapMessageStatusFilter.deleted",
  HAS_ATTACHMENTS:
    "app.api.emails.enums.imapMessageStatusFilter.hasAttachments",
  NO_ATTACHMENTS: "app.api.emails.enums.imapMessageStatusFilter.noAttachments",
});

/**
 * IMAP Health Status Enum
 */
export const {
  enum: ImapHealthStatus,
  options: ImapHealthStatusOptions,
  Value: ImapHealthStatusValue,
} = createEnumOptions({
  HEALTHY: "app.api.emails.enums.imapHealthStatus.healthy",
  WARNING: "app.api.emails.enums.imapHealthStatus.warning",
  ERROR: "app.api.emails.enums.imapHealthStatus.error",
  MAINTENANCE: "app.api.emails.enums.imapHealthStatus.maintenance",
});

/**
 * IMAP Performance Metric Status Enum
 */
export const {
  enum: ImapPerformanceStatus,
  options: ImapPerformanceStatusOptions,
  Value: ImapPerformanceStatusValue,
} = createEnumOptions({
  GOOD: "app.api.emails.enums.imapPerformanceStatus.good",
  WARNING: "app.api.emails.enums.imapPerformanceStatus.warning",
  ERROR: "app.api.emails.enums.imapPerformanceStatus.error",
});

/**
 * Bulk Message Action Enum
 */
export const {
  enum: BulkMessageAction,
  options: BulkMessageActionOptions,
  Value: BulkMessageActionValue,
} = createEnumOptions({
  MARK_READ: "app.api.emails.enums.bulkMessageAction.markRead",
  MARK_UNREAD: "app.api.emails.enums.bulkMessageAction.markUnread",
  FLAG: "app.api.emails.enums.bulkMessageAction.flag",
  UNFLAG: "app.api.emails.enums.bulkMessageAction.unflag",
  DELETE: "app.api.emails.enums.bulkMessageAction.delete",
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
