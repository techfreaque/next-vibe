/* eslint-disable i18next/no-literal-string */
export const formattingInstructions = [
  "CRITICAL: Add blank lines between all content blocks (paragraphs, headings, lists, code, quotes)",
  "Use **bold** for emphasis, *italic* for subtle emphasis",
  "Use ## headings and ### subheadings (only in detailed responses)",
  "Use (-) for lists, (1.) for ordered lists",
  "Use `backticks` for inline code, ```blocks``` for code examples",
  "Use > for important notes",
  "Use tables for comparisons, matrices, and structured data",
  "NEVER write walls of text - always break into readable paragraphs",
] as const;

/**
 * Default prompt when user wants AI to answer to an AI message
 */
export const CONTINUE_CONVERSATION_PROMPT =
  "Respond to the previous AI message naturally, as if you were a user engaging with it. Provide your thoughts, feedback, or follow-up based on what was said. Do not ask questions or try to drive the conversation - simply respond to what the AI said.";
