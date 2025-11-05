// Core types from agent API
export type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
export type { ToolCall } from "@/app/api/[locale]/v1/core/agent/chat/db";
export type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
export type { ModelId } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
export type {
  ChatFolder,
  ChatMessage,
  ChatThread,
} from "@/app/api/[locale]/v1/core/agent/chat/hooks/store";

// View mode type (UI-only, not from API)
export type ViewMode = "linear" | "flat" | "threaded";
