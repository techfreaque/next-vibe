/**
 * AI Stream Constants
 * System prompts and internal AI instructions
 */

/**
 * Search tool instructions added to system prompt when search is enabled
 */
export const SEARCH_TOOL_INSTRUCTIONS =
  "You have access to a web search tool called 'search'. When the user asks about current events, recent information, or anything that requires up-to-date knowledge, you MUST use the search tool to find relevant information. To use the search tool, call it with a 'query' parameter containing the search keywords. After receiving search results, provide a comprehensive answer based on those results and cite your sources.";

/**
 * Default prompt when user wants AI to continue conversation
 */
export const CONTINUE_CONVERSATION_PROMPT =
  "Continue the conversation by elaborating on or providing additional information about your previous response.";
