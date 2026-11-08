/**
 * Chat Enums
 * Defines enumerations for chat functionality (threads, folders, messages)
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const NEW_MESSAGE_ID = "new";

/**
 * Chat Message Role enum
 */
export enum ChatMessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  TOOL = "tool",
  ERROR = "error",
}

// Create DB enum array for Drizzle
export const ChatMessageRoleDB = [
  ChatMessageRole.USER,
  ChatMessageRole.ASSISTANT,
  ChatMessageRole.SYSTEM,
  ChatMessageRole.TOOL,
  ChatMessageRole.ERROR,
] as const;

// Create options for select fields
export const ChatMessageRoleOptions = [
  {
    value: ChatMessageRole.USER,
    label: "chat.enums.role.user" as const,
  },
  {
    value: ChatMessageRole.ASSISTANT,
    label: "chat.enums.role.assistant" as const,
  },
  {
    value: ChatMessageRole.SYSTEM,
    label: "chat.enums.role.system" as const,
  },
  {
    value: ChatMessageRole.TOOL,
    label: "chat.enums.role.tool" as const,
  },
  {
    value: ChatMessageRole.ERROR,
    label: "chat.enums.role.error" as const,
  },
];

/**
 * Thread status enum
 */
export const {
  enum: ThreadStatus,
  options: ThreadStatusOptions,
  Value: ThreadStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "enums.threadStatus.active",
  ARCHIVED: "enums.threadStatus.archived",
  DELETED: "enums.threadStatus.deleted",
});

export const ThreadStatusDB = [
  ThreadStatus.ACTIVE,
  ThreadStatus.ARCHIVED,
  ThreadStatus.DELETED,
] as const;

/**
 * Moderation status of a publicly visible thread (PUBLIC feed / SHARED links).
 * VISIBLE -> UNDER_REVIEW (auto-hidden at the report threshold) -> REMOVED (admin).
 */
export const {
  enum: ThreadModerationStatus,
  options: ThreadModerationStatusOptions,
  Value: ThreadModerationStatusValue,
} = createEnumOptions(scopedTranslation, {
  VISIBLE: "enums.threadModerationStatus.visible",
  UNDER_REVIEW: "enums.threadModerationStatus.underReview",
  REMOVED: "enums.threadModerationStatus.removed",
});

export const ThreadModerationStatusDB = [
  ThreadModerationStatus.VISIBLE,
  ThreadModerationStatus.UNDER_REVIEW,
  ThreadModerationStatus.REMOVED,
] as const;

/** Why a viewer reported a public thread. */
export const {
  enum: ThreadReportReason,
  options: ThreadReportReasonOptions,
  Value: ThreadReportReasonValue,
} = createEnumOptions(scopedTranslation, {
  SPAM: "enums.threadReportReason.spam",
  ILLEGAL: "enums.threadReportReason.illegal",
  ABUSE: "enums.threadReportReason.abuse",
  CSAM_FLAG: "enums.threadReportReason.csamFlag",
  OTHER: "enums.threadReportReason.other",
});

export const ThreadReportReasonDB = [
  ThreadReportReason.SPAM,
  ThreadReportReason.ILLEGAL,
  ThreadReportReason.ABUSE,
  ThreadReportReason.CSAM_FLAG,
  ThreadReportReason.OTHER,
] as const;

/** Admin decision on a reported thread. */
export const {
  enum: ThreadModerationAction,
  options: ThreadModerationActionOptions,
  Value: ThreadModerationActionValue,
} = createEnumOptions(scopedTranslation, {
  DISMISS: "enums.threadModerationAction.dismiss",
  REMOVE: "enums.threadModerationAction.remove",
  BAN_AUTHOR: "enums.threadModerationAction.banAuthor",
});

export const ThreadModerationActionDB = [
  ThreadModerationAction.DISMISS,
  ThreadModerationAction.REMOVE,
  ThreadModerationAction.BAN_AUTHOR,
] as const;

/**
 * View mode enum for message display
 */
export const {
  enum: ViewMode,
  options: ViewModeOptions,
  Value: ViewModeValue,
} = createEnumOptions(scopedTranslation, {
  LINEAR: "enums.viewMode.linear",
  THREADED: "enums.viewMode.threaded",
  FLAT: "enums.viewMode.flat",
  DEBUG: "enums.viewMode.debug",
});

export const ViewModeDB = [
  ViewMode.LINEAR,
  ViewMode.THREADED,
  ViewMode.FLAT,
  ViewMode.DEBUG,
] as const;

/**
 * Thread streaming state enum
 * 'waiting' = stream ended but an escalated task is still in flight
 */
export enum ThreadStreamingState {
  IDLE = "idle",
  STREAMING = "streaming",
  ABORTING = "aborting",
  WAITING = "waiting",
}

export const ThreadStreamingStateDB = [
  ThreadStreamingState.IDLE,
  ThreadStreamingState.STREAMING,
  ThreadStreamingState.ABORTING,
  ThreadStreamingState.WAITING,
] as const;
