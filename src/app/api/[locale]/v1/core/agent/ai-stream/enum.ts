/**
 * AI Stream Enums
 * Defines enumerations for AI-powered streaming chat functionality
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
  USER: "app.api.v1.core.agent.chat.aiStream.enums.role.user",
  ASSISTANT: "app.api.v1.core.agent.chat.aiStream.enums.role.assistant",
  SYSTEM: "app.api.v1.core.agent.chat.aiStream.enums.role.system",
});

// Create DB enum array for Drizzle
export const ChatMessageRoleDB = [
  ChatMessageRole.USER,
  ChatMessageRole.ASSISTANT,
  ChatMessageRole.SYSTEM,
] as const;
