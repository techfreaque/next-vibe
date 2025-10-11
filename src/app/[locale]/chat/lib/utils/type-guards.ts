/**
 * Type Guards and Validation Utilities
 * 
 * Type-safe utilities for checking message types and validating data.
 */

import type { ChatMessage, MessageRole } from "../storage/types";

/**
 * Check if a message is a user message
 * 
 * @param message - Message to check
 * @returns true if message is from user
 */
export function isUserMessage(message: ChatMessage): boolean {
  return message.role === "user";
}

/**
 * Check if a message is an assistant message
 * 
 * @param message - Message to check
 * @returns true if message is from assistant
 */
export function isAssistantMessage(message: ChatMessage): boolean {
  return message.role === "assistant";
}

/**
 * Check if a message is an error message
 * 
 * @param message - Message to check
 * @returns true if message is an error
 */
export function isErrorMessage(message: ChatMessage): boolean {
  return message.role === "error";
}

/**
 * Check if a message is a system message
 * 
 * @param message - Message to check
 * @returns true if message is a system message
 */
export function isSystemMessage(message: ChatMessage): boolean {
  return message.role === "system";
}

/**
 * Check if a message has content
 * 
 * @param message - Message to check
 * @returns true if message has non-empty content
 */
export function hasContent(message: ChatMessage): boolean {
  return message.content.trim().length > 0;
}

/**
 * Check if a message is valid for API submission
 * (user or assistant with content)
 * 
 * @param message - Message to check
 * @returns true if message can be sent to API
 */
export function isValidForAPI(message: ChatMessage): boolean {
  return (
    (message.role === "user" || message.role === "assistant") &&
    hasContent(message)
  );
}

/**
 * Check if a message has branches (multiple children)
 * 
 * @param message - Message to check
 * @returns true if message has more than one child
 */
export function hasBranches(message: ChatMessage): boolean {
  return message.childrenIds.length > 1;
}

/**
 * Check if a message is a leaf node (no children)
 * 
 * @param message - Message to check
 * @returns true if message has no children
 */
export function isLeafMessage(message: ChatMessage): boolean {
  return message.childrenIds.length === 0;
}

/**
 * Check if a message is a root message (no parent)
 * 
 * @param message - Message to check
 * @returns true if message has no parent
 */
export function isRootMessage(message: ChatMessage): boolean {
  return message.parentId === null;
}

/**
 * Check if a message was edited
 * 
 * @param message - Message to check
 * @returns true if message has edit metadata
 */
export function isEditedMessage(message: ChatMessage): boolean {
  return message.metadata?.edited === true;
}

/**
 * Validate message role
 * 
 * @param role - Role string to validate
 * @returns true if role is valid
 */
export function isValidRole(role: string): role is MessageRole {
  return ["user", "assistant", "system", "error"].includes(role);
}

