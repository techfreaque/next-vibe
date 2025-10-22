/**
 * Chat Types - Re-exports from Agent API
 * ALL types MUST come from the agent API folder - NO EXCEPTIONS!
 * NO local type definitions allowed
 */

// Core types from agent API
export type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
export type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks";
export type { ModelId } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
export type {
  ChatFolder,
  ChatMessage,
  ChatThread,
  ToolCall,
} from "@/app/api/[locale]/v1/core/agent/chat/store";

// View mode type (UI-only, not from API)
export type ViewMode = "linear" | "flat" | "threaded";
