/**
 * Chat Enums
 * Defines enumerations for chat functionality (threads, folders, messages)
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

// using a regular enum as this needs no translation
export enum ChatMessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  ERROR = "error",
}

// Create DB enum array for Drizzle
export const ChatMessageRoleDB = [
  ChatMessageRole.USER,
  ChatMessageRole.ASSISTANT,
  ChatMessageRole.SYSTEM,
  ChatMessageRole.ERROR,
] as const;

// Create options for select fields
export const ChatMessageRoleOptions = [
  {
    value: ChatMessageRole.USER,
    // eslint-disable-next-line i18next/no-literal-string
    label: "User",
  },
  {
    value: ChatMessageRole.ASSISTANT,
    // eslint-disable-next-line i18next/no-literal-string
    label: "Assistant",
  },
  {
    value: ChatMessageRole.SYSTEM,
    // eslint-disable-next-line i18next/no-literal-string
    label: "System",
  },
  {
    value: ChatMessageRole.ERROR,
    // eslint-disable-next-line i18next/no-literal-string
    label: "Error",
  },
] as const;

/**
 * Thread status enum
 */
export const {
  enum: ThreadStatus,
  options: ThreadStatusOptions,
  Value: ThreadStatusValue,
} = createEnumOptions({
  ACTIVE: "app.api.v1.core.agent.chat.enums.threadStatus.active",
  ARCHIVED: "app.api.v1.core.agent.chat.enums.threadStatus.archived",
  DELETED: "app.api.v1.core.agent.chat.enums.threadStatus.deleted",
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
  LINEAR: "app.api.v1.core.agent.chat.enums.viewMode.linear",
  THREADED: "app.api.v1.core.agent.chat.enums.viewMode.threaded",
  FLAT: "app.api.v1.core.agent.chat.enums.viewMode.flat",
});

export const ViewModeDB = [
  ViewMode.LINEAR,
  ViewMode.THREADED,
  ViewMode.FLAT,
] as const;
