/**
 * Chat Shared Types
 * Re-exports types from the agent API for use in chat components
 * This file exists to maintain backward compatibility with imports from '../shared/types'
 */

// Re-export all types from the main types index
export type {
  ChatFolder,
  ChatMessage,
  ChatThread,
  DefaultFolderId,
  ModelId,
  ToolCall,
  UseChatReturn,
  ViewMode,
} from "../types";
