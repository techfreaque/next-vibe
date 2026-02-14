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

/**
 * Token threshold for triggering history compacting
 * When conversation history exceeds this, older messages are automatically summarized
 * This is the absolute cap - we also enforce 60% of model's max context (whichever is lower)
 */
export const COMPACT_TRIGGER = 32_000;

/**
 * Maximum percentage of model's context window to use before triggering compacting
 * Set to 60% to keep costs manageable and ensure efficient cache reuse
 */
export const COMPACT_TRIGGER_PERCENTAGE = 0.6;
