/**
 * AI Stream Constants
 * System prompts and internal AI instructions
 */

/**
 * Default prompt when user wants AI to continue conversation
 */
export const CONTINUE_CONVERSATION_PROMPT =
  "Continue the conversation by elaborating on or providing additional information about your previous response.";

/**
 * System instructions for proper tool usage workflow
 * Ensures AI always provides text responses after using tools
 */
export const TOOL_USAGE_GUIDELINES = `
IMPORTANT: When you use tools, you MUST follow this workflow:
1. Call the necessary tools to gather information
2. Wait for the tool results
3. ALWAYS generate a comprehensive text response that:
   - Summarizes the information from the tool results
   - Answers the user's question based on the tool results
   - Cites sources when applicable
   - Provides context and explanation

NEVER stop after calling tools without generating a final text response. The user expects a complete answer, not just tool calls.`;
