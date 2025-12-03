/**
 * Chat Enums
 * Defines enumerations for chat functionality (threads, folders, messages)
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

export const NEW_MESSAGE_ID = "new";

/**
 * Chat Message Role enum
 * IMPORTANT: Using regular TypeScript enum to be compatible with AI SDK
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
    label: "app.api.agent.chat.enums.role.user" as const,
  },
  {
    value: ChatMessageRole.ASSISTANT,
    label: "app.api.agent.chat.enums.role.assistant" as const,
  },
  {
    value: ChatMessageRole.SYSTEM,
    label: "app.api.agent.chat.enums.role.system" as const,
  },
  {
    value: ChatMessageRole.TOOL,
    label: "app.api.agent.chat.enums.role.tool" as const,
  },
  {
    value: ChatMessageRole.ERROR,
    label: "app.api.agent.chat.enums.role.error" as const,
  },
];

/**
 * Thread status enum
 */
export const {
  enum: ThreadStatus,
  options: ThreadStatusOptions,
  Value: ThreadStatusValue,
} = createEnumOptions({
  ACTIVE: "app.api.agent.chat.enums.threadStatus.active",
  ARCHIVED: "app.api.agent.chat.enums.threadStatus.archived",
  DELETED: "app.api.agent.chat.enums.threadStatus.deleted",
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
} = createEnumOptions({
  LINEAR: "app.api.agent.chat.enums.viewMode.linear",
  THREADED: "app.api.agent.chat.enums.viewMode.threaded",
  FLAT: "app.api.agent.chat.enums.viewMode.flat",
  DEBUG: "app.api.agent.chat.enums.viewMode.debug",
});

export const ViewModeDB = [
  ViewMode.LINEAR,
  ViewMode.THREADED,
  ViewMode.FLAT,
  ViewMode.DEBUG,
] as const;
