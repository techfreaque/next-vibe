/**
 * 4chan-style Post Number Management
 * Generates and stores sequential post numbers for messages
 */

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

const POST_NUMBER_KEY = "chat-post-numbers";
const POST_NUMBER_COUNTER_KEY = "chat-post-counter";
const POST_NUMBER_START = 1000000;

interface PostNumberMap {
  [messageId: string]: number;
}

/**
 * Type guard to validate if parsed JSON matches PostNumberMap structure
 */
function isPostNumberMap(
  value: Record<string, number> | null | string | number | boolean,
): value is PostNumberMap {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return Object.values(value).every((val) => typeof val === "number");
}

/**
 * Get post number map from localStorage
 */
function getPostNumberMap(logger: EndpointLogger): PostNumberMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(POST_NUMBER_KEY);
    if (!stored) {
      return {};
    }
    const parsed = JSON.parse(stored) as
      | Record<string, number>
      | null
      | string
      | number
      | boolean;
    if (!isPostNumberMap(parsed)) {
      logger.error("Storage", "Invalid post number map format", {
        message: "Stored data is not a valid PostNumberMap",
      });
      return {};
    }
    return parsed;
  } catch (error) {
    logger.error("Storage", "Error loading post numbers", parseError(error));
    return {};
  }
}

/**
 * Save post number map to localStorage
 */
function savePostNumberMap(map: PostNumberMap, logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(POST_NUMBER_KEY, JSON.stringify(map));
  } catch (error) {
    logger.error("Storage", "Error saving post numbers", parseError(error));
  }
}

/**
 * Get current counter value
 */
function getCounter(logger: EndpointLogger): number {
  if (typeof window === "undefined") {
    return POST_NUMBER_START;
  }

  try {
    const stored = localStorage.getItem(POST_NUMBER_COUNTER_KEY);
    return stored ? parseInt(stored, 10) : POST_NUMBER_START;
  } catch (error) {
    logger.error("Storage", "Error loading counter", parseError(error));
    return POST_NUMBER_START;
  }
}

/**
 * Save counter value
 */
function saveCounter(counter: number, logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(POST_NUMBER_COUNTER_KEY, counter.toString());
  } catch (error) {
    logger.error("Storage", "Error saving counter", parseError(error));
  }
}

/**
 * Get or generate post number for a message
 * Returns existing number if already assigned, otherwise generates new one
 */
export function getPostNumber(
  messageId: string,
  logger: EndpointLogger,
): number {
  const map = getPostNumberMap(logger);

  // Return existing number if found
  if (map[messageId]) {
    return map[messageId];
  }

  // Generate new number
  const counter = getCounter(logger);
  const newNumber = counter;

  // Save new number
  map[messageId] = newNumber;
  savePostNumberMap(map, logger);
  saveCounter(counter + 1, logger);

  return newNumber;
}

/**
 * Get post numbers for multiple messages at once
 * More efficient than calling getPostNumber multiple times
 */
export function getPostNumbers(
  messageIds: string[],
  logger: EndpointLogger,
): Record<string, number> {
  const map = getPostNumberMap(logger);
  let counter = getCounter(logger);
  let hasNewNumbers = false;

  const result: Record<string, number> = {};

  for (const messageId of messageIds) {
    if (map[messageId]) {
      result[messageId] = map[messageId];
    } else {
      result[messageId] = counter;
      map[messageId] = counter;
      counter++;
      hasNewNumbers = true;
    }
  }

  // Save if we generated any new numbers
  if (hasNewNumbers) {
    savePostNumberMap(map, logger);
    saveCounter(counter, logger);
  }

  return result;
}

/**
 * Clear all post numbers (for testing/reset)
 */
export function clearPostNumbers(logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(POST_NUMBER_KEY);
    localStorage.removeItem(POST_NUMBER_COUNTER_KEY);
  } catch (error) {
    logger.error("Storage", "Error clearing post numbers", parseError(error));
  }
}

/**
 * Format post number for display (e.g., "No.1234567")
 */
export function formatPostNumber(
  postNumber: number,
  locale: CountryLanguage,
): string {
  const { t } = simpleT(locale);
  return t("app.chat.messages.postNumber", { number: postNumber });
}
