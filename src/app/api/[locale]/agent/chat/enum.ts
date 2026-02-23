/**
 * Chat Enums
 * Defines enumerations for chat functionality (threads, folders, messages)
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

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
