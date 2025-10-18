/**
 * Draft Storage
 * Manages localStorage for input drafts and global settings
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { ModelId } from "../config/models";

const DRAFT_KEY_PREFIX = "chat-draft-folder-";
const GLOBAL_MODEL_KEY = "chat-global-model";
const GLOBAL_TONE_KEY = "chat-global-tone";
const GLOBAL_ENABLE_SEARCH_KEY = "chat-enable-search";
const GLOBAL_TTS_AUTOPLAY_KEY = "chat-tts-autoplay";

/**
 * Get draft for a specific folder
 * Drafts are now stored per folder, not per thread
 */
export function getDraft(folderId: string, logger: EndpointLogger): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const key = `${DRAFT_KEY_PREFIX}${folderId}`;
    return localStorage.getItem(key) || "";
  } catch (error) {
    logger.error("Storage", "Error getting draft", error);
    return "";
  }
}

/**
 * Save draft for a specific folder
 * Drafts are now stored per folder, not per thread
 */
export function saveDraft(
  folderId: string,
  content: string,
  logger: EndpointLogger,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const key = `${DRAFT_KEY_PREFIX}${folderId}`;
    if (content.trim()) {
      localStorage.setItem(key, content);
    } else {
      // Remove empty drafts
      localStorage.removeItem(key);
    }
  } catch (error) {
    logger.error("Storage", "Error saving draft", error);
  }
}

/**
 * Clear draft for a specific folder
 * Drafts are now stored per folder, not per thread
 * This should only be called when a message is sent
 */
export function clearDraft(folderId: string, logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const key = `${DRAFT_KEY_PREFIX}${folderId}`;
    localStorage.removeItem(key);
  } catch (error) {
    logger.error("Storage", "Error clearing draft", error);
  }
}

/**
 * Get global model selection
 */
export function getGlobalModel(logger: EndpointLogger): ModelId | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(GLOBAL_MODEL_KEY);
    return stored as ModelId | null;
  } catch (error) {
    logger.error("Storage", "Error getting global model", error);
    return null;
  }
}

/**
 * Save global model selection
 */
export function saveGlobalModel(model: ModelId, logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(GLOBAL_MODEL_KEY, model);
  } catch (error) {
    logger.error("Storage", "Error saving global model", error);
  }
}

/**
 * Get global tone selection
 */
export function getGlobalTone(logger: EndpointLogger): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(GLOBAL_TONE_KEY);
  } catch (error) {
    logger.error("Storage", "Error getting global tone", error);
    return null;
  }
}

/**
 * Save global tone selection
 */
export function saveGlobalTone(tone: string, logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(GLOBAL_TONE_KEY, tone);
  } catch (error) {
    logger.error("Storage", "Error saving global tone", error);
  }
}

/**
 * Get global enable search setting (defaults to false)
 */
export function getGlobalEnableSearch(logger: EndpointLogger): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const stored = localStorage.getItem(GLOBAL_ENABLE_SEARCH_KEY);
    return stored === "true";
  } catch (error) {
    logger.error("Storage", "Error getting enable search setting", error);
    return false;
  }
}

/**
 * Save global enable search setting
 */
export function saveGlobalEnableSearch(
  enabled: boolean,
  logger: EndpointLogger,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(GLOBAL_ENABLE_SEARCH_KEY, enabled.toString());
  } catch (error) {
    logger.error("Storage", "Error saving enable search setting", error);
  }
}

/**
 * Get global TTS autoplay setting (defaults to false)
 */
export function getGlobalTTSAutoplay(logger: EndpointLogger): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const stored = localStorage.getItem(GLOBAL_TTS_AUTOPLAY_KEY);
    return stored === "true";
  } catch (error) {
    logger.error("Storage", "Error getting TTS autoplay setting", error);
    return false;
  }
}

/**
 * Save global TTS autoplay setting
 */
export function saveGlobalTTSAutoplay(
  enabled: boolean,
  logger: EndpointLogger,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(GLOBAL_TTS_AUTOPLAY_KEY, enabled.toString());
  } catch (error) {
    logger.error("Storage", "Error saving TTS autoplay setting", error);
  }
}
