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
 * Ensures AI always provides text responses before AND after using tools
 */
export const TOOL_USAGE_GUIDELINES = `
CRITICAL TOOL USAGE WORKFLOW - YOU MUST FOLLOW THIS EXACTLY:

1. BEFORE calling any tool:
   - ALWAYS generate a brief text response explaining what you're about to do
   - Example: "Let me search for that information..." or "I'll look that up for you..."
   - This text MUST be generated BEFORE the tool call, not after

2. Call the necessary tools to gather information
   - You can call MULTIPLE tools in sequence if needed
   - You have up to 50 steps available for complex multi-tool workflows
   - Tool sequences can take minutes to complete - this is expected and acceptable

3. AFTER receiving tool results:
   - ALWAYS generate a comprehensive text response that:
     * Summarizes the information from the tool results
     * Answers the user's question based on the tool results
     * Cites sources when applicable
     * Provides context and explanation

NEVER call a tool without first generating explanatory text.
NEVER stop after calling tools without generating a final text response.
The user expects a complete conversational experience with text before AND after tool calls.
You can chain multiple tool calls together - don't hesitate to use tools multiple times in one response.`;
