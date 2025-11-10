/**
 * 4chan-style Post Number Management
 * Generates and stores sequential post numbers for messages
 */

import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";

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
 * Get post number map from storage
 */
async function getPostNumberMap(
  logger: EndpointLogger,
): Promise<PostNumberMap> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = await storage.getItem(POST_NUMBER_KEY);
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
 * Save post number map to storage
 */
async function savePostNumberMap(
  map: PostNumberMap,
  logger: EndpointLogger,
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await storage.setItem(POST_NUMBER_KEY, JSON.stringify(map));
  } catch (error) {
    logger.error("Storage", "Error saving post numbers", parseError(error));
  }
}

/**
 * Get current counter value
 */
async function getCounter(logger: EndpointLogger): Promise<number> {
  if (typeof window === "undefined") {
    return POST_NUMBER_START;
  }

  try {
    const stored = await storage.getItem(POST_NUMBER_COUNTER_KEY);
    return stored ? parseInt(stored, 10) : POST_NUMBER_START;
  } catch (error) {
    logger.error("Storage", "Error loading counter", parseError(error));
    return POST_NUMBER_START;
  }
}

/**
 * Save counter value
 */
async function saveCounter(
  counter: number,
  logger: EndpointLogger,
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await storage.setItem(POST_NUMBER_COUNTER_KEY, counter.toString());
  } catch (error) {
    logger.error("Storage", "Error saving counter", parseError(error));
  }
}

/**
 * Get or generate post number for a message
 * Returns existing number if already assigned, otherwise generates new one
 */
export async function getPostNumber(
  messageId: string,
  logger: EndpointLogger,
): Promise<number> {
  const map = await getPostNumberMap(logger);

  // Return existing number if found
  if (map[messageId]) {
    return map[messageId];
  }

  // Generate new number
  const counter = await getCounter(logger);
  const newNumber = counter;

  // Save new number
  map[messageId] = newNumber;
  await savePostNumberMap(map, logger);
  await saveCounter(counter + 1, logger);

  return newNumber;
}

/**
 * Get post numbers for multiple messages at once
 * More efficient than calling getPostNumber multiple times
 */
export async function getPostNumbers(
  messageIds: string[],
  logger: EndpointLogger,
): Promise<Record<string, number>> {
  const map = await getPostNumberMap(logger);
  let counter = await getCounter(logger);
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
    await savePostNumberMap(map, logger);
    await saveCounter(counter, logger);
  }

  return result;
}

/**
 * Clear all post numbers (for testing/reset)
 */
export async function clearPostNumbers(logger: EndpointLogger): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await storage.removeItem(POST_NUMBER_KEY);
    await storage.removeItem(POST_NUMBER_COUNTER_KEY);
  } catch (error) {
    logger.error("Storage", "Error clearing post numbers", parseError(error));
  }
}

/**
 * Format post number for display (e.g., "No.1234567")
 */
export function formatPostNumber(
  postNumber: string,
  locale: CountryLanguage,
): string {
  const { t } = simpleT(locale);
  return t("app.chat.messages.postNumber", { number: postNumber });
}
