/**
 * Keyboard utilities for chat input handling
 */

import type { KeyboardEvent } from "react";

import { KEYBOARD } from "../config/constants";

/**
 * Check if the Enter key was pressed without Shift modifier
 * Used to determine if user wants to submit the message
 *
 * @param event - Keyboard event from textarea
 * @returns True if Enter was pressed without Shift
 */
export function isSubmitKeyPress(
  event: KeyboardEvent<HTMLTextAreaElement>,
): boolean {
  return event.key === KEYBOARD.SUBMIT_KEY && !event.shiftKey;
}

/**
 * Check if input value is valid for submission
 * @param value - Input value to check
 * @returns True if value is not empty after trimming
 */
export function isValidInput(value: string): boolean {
  return value.trim().length > 0;
}
