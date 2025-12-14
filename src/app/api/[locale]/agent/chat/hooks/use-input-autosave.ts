/**
 * Input Autosave Utilities
 * Manages auto-saving and restoring chat input drafts to localStorage
 * Each thread (including 'new' threads per folder) gets its own draft storage
 */

import { storage } from "next-vibe-ui/lib/storage";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { DefaultFolderId } from "../config";
import { NEW_MESSAGE_ID } from "../enum";

/**
 * Generates a unique storage key for the current thread/folder context
 * Examples:
 * - For new thread in root folder "general": "chat-draft:general:new"
 * - For new thread in subfolder: "chat-draft:general:subfolder-id:new"
 * - For existing thread: "chat-draft:thread-abc123"
 */
export function getDraftKey(
  activeThreadId: string | null,
  currentRootFolderId: DefaultFolderId,
  currentSubFolderId: string | null,
): string {
  // For existing threads, use the thread ID
  if (activeThreadId && activeThreadId !== NEW_MESSAGE_ID) {
    return `chat-draft:${activeThreadId}`;
  }

  // For new threads, use folder context
  if (currentSubFolderId) {
    return `chat-draft:${currentRootFolderId}:${currentSubFolderId}:new`;
  }

  return `chat-draft:${currentRootFolderId}:new`;
}

/**
 * Load a draft from localStorage
 */
export async function loadDraft(
  storageKey: string,
  logger: EndpointLogger,
): Promise<string> {
  try {
    const savedDraft = await storage.getItem(storageKey);
    if (savedDraft) {
      logger.debug("Chat Input Autosave", "Loaded draft", {
        storageKey,
        draftLength: savedDraft.length,
      });
      return savedDraft;
    }
    logger.debug("Chat Input Autosave", "No draft found", {
      storageKey,
    });
    return "";
  } catch (error) {
    logger.error("Chat Input Autosave", "Failed to load draft", {
      error: error instanceof Error ? error : String(error),
      storageKey,
    });
    return "";
  }
}

/**
 * Save a draft to localStorage
 */
export async function saveDraft(
  storageKey: string,
  input: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    if (input.trim()) {
      await storage.setItem(storageKey, input);
      logger.debug("Chat Input Autosave", "Saved draft", {
        storageKey,
        inputLength: input.length,
      });
    } else {
      // Remove empty drafts to keep storage clean
      await storage.removeItem(storageKey);
      logger.debug("Chat Input Autosave", "Removed empty draft", {
        storageKey,
      });
    }
  } catch (error) {
    logger.error("Chat Input Autosave", "Failed to save draft", {
      error: error instanceof Error ? error : String(error),
      storageKey,
    });
  }
}

/**
 * Clear a draft from localStorage
 */
export async function clearDraft(
  storageKey: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    await storage.removeItem(storageKey);
    logger.debug("Chat Input Autosave", "Cleared draft", { storageKey });
  } catch (error) {
    logger.error("Chat Input Autosave", "Failed to clear draft", {
      error: error instanceof Error ? error : String(error),
      storageKey,
    });
  }
}
