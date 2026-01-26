/**
 * AI Stream Constants
 * Shared constants for AI streaming functionality
 */

/**
 * Tool loop control parameter name
 * When this parameter is set to true in a tool call's arguments,
 * the AI streaming loop will stop after that tool completes
 */
export const NO_LOOP_PARAM = "noLoop" as const;

/**
 * Maximum number of tool calls allowed in a single streaming session
 * Used internally by the streaming system, not exposed to the model
 */
export const MAX_TOOL_CALLS = 50;
