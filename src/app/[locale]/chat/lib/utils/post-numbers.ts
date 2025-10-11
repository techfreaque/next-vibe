/**
 * 4chan-style Post Number Management
 * Generates and stores sequential post numbers for messages
 */

import { POST_NUMBER_CONFIG } from "../config/constants";

const POST_NUMBER_KEY = "chat-post-numbers";
const POST_NUMBER_COUNTER_KEY = "chat-post-counter";

interface PostNumberMap {
  [messageId: string]: number;
}

/**
 * Get all post numbers from localStorage
 */
function getPostNumberMap(): PostNumberMap {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(POST_NUMBER_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("[Post Numbers] Error reading post numbers:", error);
    return {};
  }
}

/**
 * Save post numbers to localStorage
 */
function savePostNumberMap(map: PostNumberMap): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(POST_NUMBER_KEY, JSON.stringify(map));
  } catch (error) {
    console.error("[Post Numbers] Error saving post numbers:", error);
  }
}

/**
 * Get current counter value
 */
function getCounter(): number {
  if (typeof window === "undefined") return POST_NUMBER_CONFIG.START_NUMBER;

  try {
    const stored = localStorage.getItem(POST_NUMBER_COUNTER_KEY);
    return stored ? parseInt(stored, 10) : POST_NUMBER_CONFIG.START_NUMBER;
  } catch (error) {
    console.error("[Post Numbers] Error reading counter:", error);
    return POST_NUMBER_CONFIG.START_NUMBER;
  }
}

/**
 * Save counter value
 */
function saveCounter(value: number): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(POST_NUMBER_COUNTER_KEY, value.toString());
  } catch (error) {
    console.error("[Post Numbers] Error saving counter:", error);
  }
}

/**
 * Get or generate post number for a message
 * Returns existing number if already assigned, otherwise generates new one
 */
export function getPostNumber(messageId: string): number {
  const map = getPostNumberMap();
  
  // Return existing number if found
  if (map[messageId]) {
    return map[messageId];
  }
  
  // Generate new number
  const counter = getCounter();
  const newNumber = counter;
  
  // Save new number
  map[messageId] = newNumber;
  savePostNumberMap(map);
  saveCounter(counter + 1);
  
  return newNumber;
}

/**
 * Get post numbers for multiple messages at once
 * More efficient than calling getPostNumber multiple times
 */
export function getPostNumbers(messageIds: string[]): Record<string, number> {
  const map = getPostNumberMap();
  let counter = getCounter();
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
    savePostNumberMap(map);
    saveCounter(counter);
  }
  
  return result;
}

/**
 * Clear all post numbers (for testing/reset)
 */
export function clearPostNumbers(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(POST_NUMBER_KEY);
    localStorage.removeItem(POST_NUMBER_COUNTER_KEY);
  } catch (error) {
    console.error("[Post Numbers] Error clearing post numbers:", error);
  }
}

/**
 * Format post number for display (e.g., "No.1234567")
 */
export function formatPostNumber(postNumber: number): string {
  return `No.${postNumber}`;
}

