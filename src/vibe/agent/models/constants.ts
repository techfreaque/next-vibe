/**
 * Default token estimates for credit cost calculation
 * These represent average token counts for typical conversations
 *
 * Input: ~16K tokens (mid-point before compacting trigger of 32K)
 * Output: ~1K tokens (typical AI response length)
 */
export const DEFAULT_INPUT_TOKENS = 16_000;
export const DEFAULT_OUTPUT_TOKENS = 1_000;
