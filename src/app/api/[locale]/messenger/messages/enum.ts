/**
 * Messenger Messages Enums
 * Channel-agnostic enums for all message types, statuses, and folder types.
 */
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Message Status
 */
export const {
  enum: MessageStatus,
  options: MessageStatusOptions,
  Value: MessageStatusValue,
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

export const MessageStatusDB = [
  MessageStatus.PENDING,
  MessageStatus.SENT,
  MessageStatus.DELIVERED,
  MessageStatus.BOUNCED,
  MessageStatus.FAILED,
  MessageStatus.OPENED,
  MessageStatus.CLICKED,
  MessageStatus.UNSUBSCRIBED,
] as const;

/**
 * Message Status Filter (includes ANY)
 */
export const {
  enum: MessageStatusFilter,
  options: MessageStatusFilterOptions,
  Value: MessageStatusFilterValue,
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

export const MessageStatusFilterDB = [
  MessageStatusFilter.ANY,
  MessageStatusFilter.PENDING,
  MessageStatusFilter.SENT,
  MessageStatusFilter.DELIVERED,
  MessageStatusFilter.OPENED,
  MessageStatusFilter.CLICKED,
  MessageStatusFilter.BOUNCED,
  MessageStatusFilter.FAILED,
  MessageStatusFilter.UNSUBSCRIBED,
] as const;

/**
 * Message Type
 */
export const {
  enum: MessageType,
  options: MessageTypeOptions,
  Value: MessageTypeValue,
} = createEnumOptions(scopedTranslation, {
  TRANSACTIONAL: "enums.type.transactional",
  MARKETING: "enums.type.marketing",
  NOTIFICATION: "enums.type.notification",
  SYSTEM: "enums.type.system",
  LEAD_CAMPAIGN: "enums.type.leadCampaign",
  USER_COMMUNICATION: "enums.type.userCommunication",
});

export const MessageTypeDB = [
  MessageType.TRANSACTIONAL,
  MessageType.MARKETING,
  MessageType.NOTIFICATION,
  MessageType.SYSTEM,
  MessageType.LEAD_CAMPAIGN,
  MessageType.USER_COMMUNICATION,
] as const;

/**
 * Message Type Filter (includes ANY)
 */
export const {
  enum: MessageTypeFilter,
  options: MessageTypeFilterOptions,
  Value: MessageTypeFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.typeFilter.any",
  TRANSACTIONAL: "enums.type.transactional",
  MARKETING: "enums.type.marketing",
  NOTIFICATION: "enums.type.notification",
  SYSTEM: "enums.type.system",
  LEAD_CAMPAIGN: "enums.type.leadCampaign",
  USER_COMMUNICATION: "enums.type.userCommunication",
});

export const MessageTypeFilterDB = [
  MessageTypeFilter.ANY,
  MessageTypeFilter.TRANSACTIONAL,
  MessageTypeFilter.MARKETING,
  MessageTypeFilter.NOTIFICATION,
  MessageTypeFilter.SYSTEM,
  MessageTypeFilter.USER_COMMUNICATION,
] as const;

/**
 * Message Sort Field
 */
export const {
  enum: MessageSortField,
  options: MessageSortFieldOptions,
  Value: MessageSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  SUBJECT: "enums.sortField.subject",
  RECIPIENT_EMAIL: "enums.sortField.recipientEmail",
  RECIPIENT_NAME: "enums.sortField.recipientName",
  TYPE: "enums.sortField.type",
  STATUS: "enums.sortField.status",
  SENT_AT: "enums.sortField.sentAt",
  CREATED_AT: "enums.sortField.createdAt",
});

export const MessageSortFieldDB = [
  MessageSortField.CREATED_AT,
  MessageSortField.SENT_AT,
  MessageSortField.SUBJECT,
  MessageSortField.RECIPIENT_EMAIL,
  MessageSortField.RECIPIENT_NAME,
  MessageSortField.STATUS,
  MessageSortField.TYPE,
] as const;

/**
 * Sort Order
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
 * Message Sync Status — used for inbox sync (IMAP, WhatsApp, etc.)
 */
export const {
  enum: MessageSyncStatus,
  options: MessageSyncStatusOptions,
  Value: MessageSyncStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.syncStatus.pending",
  SYNCING: "enums.syncStatus.syncing",
  SYNCED: "enums.syncStatus.synced",
  FAILED: "enums.syncStatus.failed",
});

export const MessageSyncStatusDB = [
  MessageSyncStatus.PENDING,
  MessageSyncStatus.SYNCING,
  MessageSyncStatus.SYNCED,
  MessageSyncStatus.FAILED,
] as const;

/**
 * Special Folder Type — well-known inbox folder roles
 */
export const {
  enum: SpecialFolderType,
  options: SpecialFolderTypeOptions,
  Value: SpecialFolderTypeValue,
} = createEnumOptions(scopedTranslation, {
  INBOX: "enums.specialFolder.inbox",
  SENT: "enums.specialFolder.sent",
  DRAFTS: "enums.specialFolder.drafts",
  TRASH: "enums.specialFolder.trash",
  SPAM: "enums.specialFolder.spam",
  ARCHIVE: "enums.specialFolder.archive",
});

export const SpecialFolderTypeDB = [
  SpecialFolderType.INBOX,
  SpecialFolderType.SENT,
  SpecialFolderType.DRAFTS,
  SpecialFolderType.TRASH,
  SpecialFolderType.SPAM,
  SpecialFolderType.ARCHIVE,
] as const;

/**
 * Retry Range — for message retry statistics
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

export function mapMessageStatusFilter(
  filter:
    | (typeof MessageStatusFilter)[keyof typeof MessageStatusFilter]
    | undefined,
): (typeof MessageStatus)[keyof typeof MessageStatus] | null {
  switch (filter) {
    case MessageStatusFilter.PENDING:
      return MessageStatus.PENDING;
    case MessageStatusFilter.SENT:
      return MessageStatus.SENT;
    case MessageStatusFilter.DELIVERED:
      return MessageStatus.DELIVERED;
    case MessageStatusFilter.OPENED:
      return MessageStatus.OPENED;
    case MessageStatusFilter.CLICKED:
      return MessageStatus.CLICKED;
    case MessageStatusFilter.BOUNCED:
      return MessageStatus.BOUNCED;
    case MessageStatusFilter.FAILED:
      return MessageStatus.FAILED;
    case MessageStatusFilter.UNSUBSCRIBED:
      return MessageStatus.UNSUBSCRIBED;
    default:
      return null;
  }
}

export function mapMessageTypeFilter(
  filter:
    | (typeof MessageTypeFilter)[keyof typeof MessageTypeFilter]
    | undefined,
): (typeof MessageType)[keyof typeof MessageType] | null {
  switch (filter) {
    case MessageTypeFilter.TRANSACTIONAL:
      return MessageType.TRANSACTIONAL;
    case MessageTypeFilter.MARKETING:
      return MessageType.MARKETING;
    case MessageTypeFilter.NOTIFICATION:
      return MessageType.NOTIFICATION;
    case MessageTypeFilter.SYSTEM:
      return MessageType.SYSTEM;
    case MessageTypeFilter.LEAD_CAMPAIGN:
      return MessageType.LEAD_CAMPAIGN;
    case MessageTypeFilter.USER_COMMUNICATION:
      return MessageType.USER_COMMUNICATION;
    default:
      return null;
  }
}
