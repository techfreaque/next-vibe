/**
 * Chat Enums
 * Defines enumerations for chat functionality (threads, folders, messages)
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Chat message role enum
 */
export const {
  enum: ChatMessageRole,
  options: ChatMessageRoleOptions,
  Value: ChatMessageRoleValue,
} = createEnumOptions({
  USER: "app.api.v1.core.agent.chat.enums.role.user",
  ASSISTANT: "app.api.v1.core.agent.chat.enums.role.assistant",
  SYSTEM: "app.api.v1.core.agent.chat.enums.role.system",
  ERROR: "app.api.v1.core.agent.chat.enums.role.error",
});

// Create DB enum array for Drizzle
export const ChatMessageRoleDB = [
  ChatMessageRole.USER,
  ChatMessageRole.ASSISTANT,
  ChatMessageRole.SYSTEM,
  ChatMessageRole.ERROR,
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
