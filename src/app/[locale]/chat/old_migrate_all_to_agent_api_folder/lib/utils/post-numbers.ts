/**
 * 4chan-style Post Number Management
 * Generates and stores sequential post numbers for messages
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { POST_NUMBER_CONFIG } from "../config/constants";

const POST_NUMBER_KEY = "chat-post-numbers";
const POST_NUMBER_COUNTER_KEY = "chat-post-counter";

interface PostNumberMap {
  [messageId: string]: number;
}

/**
 * Get all post numbers from localStorage
 */
function getPostNumberMap(logger: EndpointLogger): PostNumberMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(POST_NUMBER_KEY);
    return stored ? (JSON.parse(stored) as PostNumberMap) : {};
  } catch (error) {
    logger.error("Storage", "Error reading post numbers", error);
    return {};
  }
}

/**
 * Save post numbers to localStorage
 */
function savePostNumberMap(map: PostNumberMap, logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(POST_NUMBER_KEY, JSON.stringify(map));
  } catch (error) {
    logger.error("Storage", "Error saving post numbers", error);
  }
}

/**
 * Get current counter value
 */
function getCounter(logger: EndpointLogger): number {
  if (typeof window === "undefined") {
    return POST_NUMBER_CONFIG.START_NUMBER;
  }

  try {
    const stored = localStorage.getItem(POST_NUMBER_COUNTER_KEY);
    return stored ? parseInt(stored, 10) : POST_NUMBER_CONFIG.START_NUMBER;
  } catch (error) {
    logger.error("Storage", "Error reading counter", error);
    return POST_NUMBER_CONFIG.START_NUMBER;
  }
}

/**
 * Save counter value
 */
function saveCounter(value: number, logger: EndpointLogger): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(POST_NUMBER_COUNTER_KEY, value.toString());
  } catch (error) {
    logger.error("Storage", "Error saving counter", error);
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
    logger.error("Storage", "Error clearing post numbers", error);
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
