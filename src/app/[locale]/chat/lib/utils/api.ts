/**
 * API utilities for chat functionality
 */

import { formattingInstructions } from "@/app/api/[locale]/v1/core/agent/chat/ai-stream/sytem-prompt";

import type { ModelId } from "../config/models";
import { getModelById } from "../config/models";
import { getPersonaById } from "../config/personas";
import { getMessagesInPath } from "../storage/message-tree";
import type { ChatMessage, ChatThread } from "../storage/types";
import { APIError } from "./errors";

/**
 * API constants
 */
const API_CONSTANTS = {
  /** Length of message ID prefix for display */
  ID_DISPLAY_LENGTH: 8,

  /** Default locale for date formatting */
  DEFAULT_LOCALE: "en-US",

  /** Default persona name */
  DEFAULT_PERSONA: "default",
} as const;

/**
 * Handle API response errors consistently
 */
export async function handleAPIError(response: Response): Promise<never> {
  let errorData: Record<string, unknown> = {};
  try {
    errorData = await response.json();
  } catch {
    // If JSON parsing fails, use empty object
  }

  const errorMessage =
    (errorData.error as string) ||
    (errorData.message as string) ||
    `API error: ${response.statusText}`;

  throw new APIError(
    errorMessage,
    response.status,
    response.statusText,
    errorData.details,
  );
}

/**
 * Format timestamp as readable date/time
 */
function formatMessageTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString(API_CONSTANTS.DEFAULT_LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get persona details from tone ID
 */
function getPersonaDetails(tone?: string): {
  name: string;
  systemPrompt: string;
} {
  if (!tone) {
    return { name: API_CONSTANTS.DEFAULT_PERSONA, systemPrompt: "" };
  }

  const persona = getPersonaById(tone);
  return {
    name: persona.name,
    systemPrompt: persona.systemPrompt,
  };
}

/**
 * Strip context tags from AI response
 * Some models may echo back the <context> tags in their responses
 *
 * Examples:
 * - Input: "<context>User: John | ID: abc123</context>\nHello!" → Output: "Hello!"
 * - Input: "Sure! <context>...</context> Here's the answer" → Output: "Sure!  Here's the answer"
 * - Input: "No context tags here" → Output: "No context tags here"
 */
export function stripContextTags(content: string): string {
  // Remove <context>...</context> tags (case-insensitive, multiline)
  return content.replace(/<context>[\s\S]*?<\/context>\s*/gi, "");
}

/**
 * API message format (simplified for API calls)
 */
export interface APIMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * API request payload for chat completion
 */
export interface ChatCompletionRequest {
  messages: APIMessage[];
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  enableSearch?: boolean;
}

/**
 * Convert chat messages to API format with context metadata
 * Filters out error messages and formats for API
 * Wraps context information in <context> tags for easy parsing/removal
 */
export function convertMessagesToAPIFormat(
  messages: ChatMessage[],
): APIMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      // Build context metadata based on message type
      let contextMetadata = "";

      if (m.role === "user") {
        // User message context
        const userName =
          m.author?.name ||
          m.author?.id?.substring(0, API_CONSTANTS.ID_DISPLAY_LENGTH) ||
          "User";
        const timestamp = formatMessageTimestamp(m.timestamp);
        contextMetadata = `<context>User: ${userName} | ID: ${m.id.substring(0, API_CONSTANTS.ID_DISPLAY_LENGTH)} | ${timestamp}</context>\n`;
      } else if (m.role === "assistant") {
        // Assistant message context
        const modelName = m.model ? getModelById(m.model).name : "Assistant";
        const personaDetails = getPersonaDetails(m.tone);
        const timestamp = formatMessageTimestamp(m.timestamp);
        contextMetadata = `<context>Assistant: ${modelName} (${personaDetails.name}) | ID: ${m.id.substring(0, API_CONSTANTS.ID_DISPLAY_LENGTH)} | ${timestamp}</context>\n`;
      }

      return {
        role: m.role.toLowerCase() as "user" | "assistant",
        content: contextMetadata + m.content,
      };
    });
}

/**
 * Build enhanced system prompt with context
 */
function buildEnhancedSystemPrompt(
  thread: ChatThread,
  modelId: ModelId,
  tone: string,
  parentMessageId: string | null,
): string {
  const modelName = getModelById(modelId).name;
  const personaDetails = getPersonaDetails(tone);
  const threadName = thread.name || "Untitled Conversation";

  // Build context sections
  const sections: string[] = [formattingInstructions.join("; ")];

  // Important instruction about context tags
  sections.push(
    "IMPORTANT: Messages contain <context> tags with metadata. Do NOT include these tags in your response. Only respond with your actual message content.",
  );

  // Thread context
  sections.push(`\nThread: "${threadName}"`);

  // Check if parent message is an assistant message (Answer as AI scenario)
  const parentMessage = parentMessageId
    ? thread.messages[parentMessageId]
    : null;
  const isAnswerAsAI = parentMessage?.role === "assistant";

  // Parent message context (if responding to a specific message)
  if (parentMessageId) {
    sections.push(
      `Responding to message ID: ${parentMessageId.substring(0, API_CONSTANTS.ID_DISPLAY_LENGTH)}`,
    );
  }

  // Model and persona context
  sections.push(`You are: ${modelName} with ${personaDetails.name} persona`);

  // Special instruction for Answer as AI feature
  if (isAnswerAsAI) {
    sections.push(
      `\nIMPORTANT: You are generating a new AI response continuing from a previous assistant message. You MUST respond according to the ${personaDetails.name} persona specified above, not based on the style or persona of the previous assistant message. Follow the persona instructions strictly.`,
    );
  }

  // Persona system prompt
  if (personaDetails.systemPrompt) {
    sections.push(`\n${personaDetails.systemPrompt}`);
  }

  // Thread-specific system prompt (if any)
  if (thread.settings?.systemPrompt) {
    sections.push(`\nAdditional instructions: ${thread.settings.systemPrompt}`);
  }

  return sections.join("\n");
}

/**
 * Build API request payload from thread with enhanced system prompt
 */
export function buildChatCompletionRequest(
  thread: ChatThread,
  modelId: ModelId,
  tone: string,
  parentMessageId: string | null,
  temperature = 0.7,
  maxTokens = 2000,
  enableSearch = false,
): ChatCompletionRequest {
  const messages = getMessagesInPath(thread);
  const modelConfig = getModelById(modelId);
  const systemPrompt = buildEnhancedSystemPrompt(
    thread,
    modelId,
    tone,
    parentMessageId,
  );

  return {
    messages: convertMessagesToAPIFormat(messages),
    model: modelConfig.openRouterModel,
    temperature,
    maxTokens,
    systemPrompt,
    enableSearch,
  };
}
