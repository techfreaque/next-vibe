/**
 * Draft Storage
 * Manages localStorage for input drafts and global settings
 */

import type { ModelId } from "../config/models";

const DRAFT_KEY_PREFIX = "chat-draft-";
const GLOBAL_MODEL_KEY = "chat-global-model";
const GLOBAL_TONE_KEY = "chat-global-tone";

/**
 * Get draft for a specific thread
 */
export function getDraft(threadId: string): string {
  if (typeof window === "undefined") return "";
  
  try {
    const key = `${DRAFT_KEY_PREFIX}${threadId}`;
    return localStorage.getItem(key) || "";
  } catch (error) {
    console.error("[Draft Storage] Error getting draft:", error);
    return "";
  }
}

/**
 * Save draft for a specific thread
 */
export function saveDraft(threadId: string, content: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const key = `${DRAFT_KEY_PREFIX}${threadId}`;
    if (content.trim()) {
      localStorage.setItem(key, content);
    } else {
      // Remove empty drafts
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("[Draft Storage] Error saving draft:", error);
  }
}

/**
 * Clear draft for a specific thread
 */
export function clearDraft(threadId: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const key = `${DRAFT_KEY_PREFIX}${threadId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("[Draft Storage] Error clearing draft:", error);
  }
}

/**
 * Get global model selection
 */
export function getGlobalModel(): ModelId | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(GLOBAL_MODEL_KEY);
    return stored as ModelId | null;
  } catch (error) {
    console.error("[Draft Storage] Error getting global model:", error);
    return null;
  }
}

/**
 * Save global model selection
 */
export function saveGlobalModel(model: ModelId): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(GLOBAL_MODEL_KEY, model);
  } catch (error) {
    console.error("[Draft Storage] Error saving global model:", error);
  }
}

/**
 * Get global tone selection
 */
export function getGlobalTone(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    return localStorage.getItem(GLOBAL_TONE_KEY);
  } catch (error) {
    console.error("[Draft Storage] Error getting global tone:", error);
    return null;
  }
}

/**
 * Save global tone selection
 */
export function saveGlobalTone(tone: string): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(GLOBAL_TONE_KEY, tone);
  } catch (error) {
    console.error("[Draft Storage] Error saving global tone:", error);
  }
}

