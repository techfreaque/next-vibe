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
export async function loadDraft(storageKey: string, logger: EndpointLogger): Promise<string> {
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
export async function clearDraft(storageKey: string, logger: EndpointLogger): Promise<void> {
  try {
    await storage.removeItem(storageKey);
    await clearDraftAttachments(storageKey, logger);
    logger.debug("Chat Input Autosave", "Cleared draft", { storageKey });
  } catch (error) {
    logger.error("Chat Input Autosave", "Failed to clear draft", {
      error: error instanceof Error ? error : String(error),
      storageKey,
    });
  }
}

/**
 * Serializable file data for localStorage
 */
interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  data: string; // base64 encoded
}

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result as string;
      // Extract base64 data (remove data:...;base64, prefix)
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 string back to File
 */
function base64ToFile(data: SerializableFile): File {
  const byteString = atob(data.data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new File([arrayBuffer], data.name, {
    type: data.type,
    lastModified: data.lastModified,
  });
}

/**
 * Save draft attachments to localStorage
 */
export async function saveDraftAttachments(
  storageKey: string,
  files: File[],
  logger: EndpointLogger,
): Promise<void> {
  try {
    const attachmentKey = `${storageKey}-attachments`;

    if (files.length === 0) {
      await storage.removeItem(attachmentKey);
      logger.debug("Chat Input Autosave", "Removed empty draft attachments", {
        storageKey,
      });
      return;
    }

    // Convert files to serializable format
    const serializableFiles = await Promise.all(
      files.map(
        async (file): Promise<SerializableFile> => ({
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          data: await fileToBase64(file),
        }),
      ),
    );

    await storage.setItem(attachmentKey, JSON.stringify(serializableFiles));
    logger.debug("Chat Input Autosave", "Saved draft attachments", {
      storageKey,
      fileCount: files.length,
    });
  } catch (error) {
    logger.error("Chat Input Autosave", "Failed to save draft attachments", {
      error: error instanceof Error ? error.message : String(error),
      storageKey,
    });
  }
}

/**
 * Load draft attachments from localStorage
 */
export async function loadDraftAttachments(
  storageKey: string,
  logger: EndpointLogger,
): Promise<File[]> {
  try {
    const attachmentKey = `${storageKey}-attachments`;
    const saved = await storage.getItem(attachmentKey);

    if (!saved) {
      return [];
    }

    const serializableFiles = JSON.parse(saved) as SerializableFile[];
    const files = serializableFiles.map(base64ToFile);

    logger.debug("Chat Input Autosave", "Loaded draft attachments", {
      storageKey,
      fileCount: files.length,
    });

    return files;
  } catch (error) {
    logger.error("Chat Input Autosave", "Failed to load draft attachments", {
      error: error instanceof Error ? error.message : String(error),
      storageKey,
    });
    return [];
  }
}

/**
 * Clear draft attachments from localStorage
 */
export async function clearDraftAttachments(
  storageKey: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    const attachmentKey = `${storageKey}-attachments`;
    await storage.removeItem(attachmentKey);
    logger.debug("Chat Input Autosave", "Cleared draft attachments", {
      storageKey,
    });
  } catch (error) {
    logger.error("Chat Input Autosave", "Failed to clear draft attachments", {
      error: error instanceof Error ? error.message : String(error),
      storageKey,
    });
  }
}
