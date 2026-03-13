import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * IMAP Auth Method Enum
 * Keys match MessengerImapAuthMethod in accounts/enum so values are identical — no converter needed.
 */
export const {
  enum: ImapAuthMethod,
  options: ImapAuthMethodOptions,
  Value: ImapAuthMethodValue,
} = createEnumOptions(scopedTranslation, {
  PLAIN: "enums.imapAuthMethod.plain",
  OAUTH2: "enums.imapAuthMethod.oauth2",
  XOAUTH2: "enums.imapAuthMethod.xoauth2",
});

export const ImapAuthMethodDB = [
  ImapAuthMethod.PLAIN,
  ImapAuthMethod.OAUTH2,
  ImapAuthMethod.XOAUTH2,
] as const;

/**
 * IMAP Sync Status Enum
 */
export const {
  enum: ImapSyncStatus,
  options: ImapSyncStatusOptions,
  Value: ImapSyncStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.syncStatus.pending",
  SYNCING: "enums.syncStatus.syncing",
  SYNCED: "enums.syncStatus.synced",
  ERROR: "enums.syncStatus.error",
});

/**
 * IMAP Overall Sync Status Enum
 */
export const {
  enum: ImapOverallSyncStatus,
  options: ImapOverallSyncStatusOptions,
  Value: ImapOverallSyncStatusValue,
} = createEnumOptions(scopedTranslation, {
  IDLE: "enums.overallSyncStatus.idle",
  RUNNING: "enums.overallSyncStatus.running",
  COMPLETED: "enums.overallSyncStatus.completed",
  FAILED: "enums.overallSyncStatus.failed",
  CANCELLED: "enums.overallSyncStatus.cancelled",
});

/**
 * Sort order enumeration
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions(scopedTranslation, {
  ASC: "enums.sortOrder.asc",
  DESC: "enums.sortOrder.desc",
});

export const SortOrderDB = [SortOrder.ASC, SortOrder.DESC] as const;

/**
 * IMAP Special Use Folder Types
 */
export const {
  enum: ImapSpecialUseType,
  options: ImapSpecialUseTypeOptions,
  Value: ImapSpecialUseTypeValue,
} = createEnumOptions(scopedTranslation, {
  INBOX: "enums.specialUseType.inbox",
  SENT: "enums.specialUseType.sent",
  DRAFTS: "enums.specialUseType.drafts",
  TRASH: "enums.specialUseType.trash",
  JUNK: "enums.specialUseType.junk",
  ARCHIVE: "enums.specialUseType.archive",
});

/**
 * IMAP Folder Sort Fields
 */
export const {
  enum: ImapFolderSortField,
  options: ImapFolderSortFieldOptions,
  Value: ImapFolderSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  NAME: "enums.folderSortField.name",
  DISPLAY_NAME: "enums.folderSortField.displayName",
  MESSAGE_COUNT: "enums.folderSortField.messageCount",
  UNSEEN_COUNT: "enums.folderSortField.unseenCount",
  CREATED_AT: "enums.folderSortField.createdAt",
});

/**
 * IMAP Account Sort Fields
 */
export const {
  enum: ImapAccountSortField,
  options: ImapAccountSortFieldOptions,
  Value: ImapAccountSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  NAME: "enums.accountSortField.name",
  EMAIL: "enums.accountSortField.email",
  HOST: "enums.accountSortField.host",
  ENABLED: "enums.accountSortField.enabled",
  LAST_SYNC_AT: "enums.accountSortField.lastSyncAt",
  CREATED_AT: "enums.accountSortField.createdAt",
});

/**
 * IMAP Connection Status Enum
 */
export const {
  enum: ImapConnectionStatus,
  options: ImapConnectionStatusOptions,
  Value: ImapConnectionStatusValue,
} = createEnumOptions(scopedTranslation, {
  DISCONNECTED: "enums.connectionStatus.disconnected",
  CONNECTING: "enums.connectionStatus.connecting",
  CONNECTED: "enums.connectionStatus.connected",
  ERROR: "enums.connectionStatus.error",
  TIMEOUT: "enums.connectionStatus.timeout",
});

/**
 * IMAP Sync Status Filter Enum (includes "all" option)
 */
export const {
  enum: ImapSyncStatusFilter,
  options: ImapSyncStatusFilterOptions,
  Value: ImapSyncStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.syncStatusFilter.all",
  PENDING: "enums.syncStatus.pending",
  SYNCING: "enums.syncStatus.syncing",
  SYNCED: "enums.syncStatus.synced",
  ERROR: "enums.syncStatus.error",
});

/**
 * IMAP Account Status Filter Enum (includes "all" option)
 */
export const {
  enum: ImapAccountStatusFilter,
  options: ImapAccountStatusFilterOptions,
  Value: ImapAccountStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.accountStatusFilter.all",
  ENABLED: "enums.accountStatusFilter.enabled",
  DISABLED: "enums.accountStatusFilter.disabled",
  CONNECTED: "enums.connectionStatus.connected",
  DISCONNECTED: "enums.connectionStatus.disconnected",
  ERROR: "enums.connectionStatus.error",
});

/**
 * IMAP Account Filter Values
 */
export const {
  enum: ImapAccountFilter,
  options: ImapAccountFilterOptions,
  Value: ImapAccountFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.accountFilter.all",
});

/**
 * IMAP Message Sort Fields
 */
export const {
  enum: ImapMessageSortField,
  options: ImapMessageSortFieldOptions,
  Value: ImapMessageSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  SUBJECT: "enums.messageSortField.subject",
  SENDER_NAME: "enums.messageSortField.senderName",
  SENDER_EMAIL: "enums.messageSortField.senderEmail",
  RECIPIENT_EMAIL: "enums.messageSortField.recipientEmail",
  RECIPIENT_NAME: "enums.messageSortField.recipientName",
  IS_READ: "enums.messageSortField.isRead",
  IS_FLAGGED: "enums.messageSortField.isFlagged",
  MESSAGE_SIZE: "enums.messageSortField.messageSize",
  SENT_AT: "enums.messageSortField.sentAt",
  CREATED_AT: "enums.messageSortField.createdAt",
});

/**
 * IMAP Message Status Filter Enum
 */
export const {
  enum: ImapMessageStatusFilter,
  options: ImapMessageStatusFilterOptions,
  Value: ImapMessageStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.messageStatusFilter.all",
  READ: "enums.messageStatusFilter.read",
  UNREAD: "enums.messageStatusFilter.unread",
  FLAGGED: "enums.messageStatusFilter.flagged",
  UNFLAGGED: "enums.messageStatusFilter.unflagged",
  DRAFT: "enums.messageStatusFilter.draft",
  DELETED: "enums.messageStatusFilter.deleted",
  HAS_ATTACHMENTS: "enums.messageStatusFilter.hasAttachments",
  NO_ATTACHMENTS: "enums.messageStatusFilter.noAttachments",
});

/**
 * IMAP Health Status Enum
 */
export const {
  enum: ImapHealthStatus,
  options: ImapHealthStatusOptions,
  Value: ImapHealthStatusValue,
} = createEnumOptions(scopedTranslation, {
  HEALTHY: "enums.healthStatus.healthy",
  WARNING: "enums.healthStatus.warning",
  ERROR: "enums.healthStatus.error",
  MAINTENANCE: "enums.healthStatus.maintenance",
});

/**
 * IMAP Performance Metric Status Enum
 */
export const {
  enum: ImapPerformanceStatus,
  options: ImapPerformanceStatusOptions,
  Value: ImapPerformanceStatusValue,
} = createEnumOptions(scopedTranslation, {
  GOOD: "enums.performanceStatus.good",
  WARNING: "enums.performanceStatus.warning",
  ERROR: "enums.performanceStatus.error",
});

/**
 * Bulk Message Action Enum
 */
export const {
  enum: BulkMessageAction,
  options: BulkMessageActionOptions,
  Value: BulkMessageActionValue,
} = createEnumOptions(scopedTranslation, {
  MARK_READ: "messages.id.widget.markRead",
  MARK_UNREAD: "messages.id.widget.markUnread",
  FLAG: "messages.id.widget.flag",
  UNFLAG: "messages.id.widget.unflag",
  DELETE: "enums.messageStatusFilter.deleted",
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
