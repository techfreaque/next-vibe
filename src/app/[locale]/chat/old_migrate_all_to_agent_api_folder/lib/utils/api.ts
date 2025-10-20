/**
 * API utilities for chat functionality
 * This file builds system prompts and context metadata for AI models.
 * All strings here are technical instructions for AI, not user-facing text.
 */

/* eslint-disable i18next/no-literal-string */

import { formattingInstructions } from "@/app/api/[locale]/v1/core/agent/chat/ai-stream/sytem-prompt";
import type { CountryLanguage } from "@/i18n/core/config";

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

  /** Default persona name */
  DEFAULT_PERSONA: "default",
} as const;

/**
 * Handle API response errors consistently
 */
export async function handleAPIError(response: Response): Promise<never> {
  // eslint-disable-next-line no-restricted-syntax -- Error data can be any type
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

  // eslint-disable-next-line no-restricted-syntax -- Throwing APIError is the correct pattern here
  throw new APIError(
    errorMessage,
    response.status,
    response.statusText,
    // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
    errorData.details as Error | Record<string, unknown> | null,
  );
}

/**
 * Format timestamp as readable date/time
 */
function formatMessageTimestamp(
  timestamp: number,
  locale: CountryLanguage,
): string {
  const date = new Date(timestamp);
  return date.toLocaleString(locale, {
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
  locale: CountryLanguage,
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
        const timestamp = formatMessageTimestamp(m.timestamp, locale);
        contextMetadata = `<context>User: ${userName} | ID: ${m.id.substring(0, API_CONSTANTS.ID_DISPLAY_LENGTH)} | ${timestamp}</context>\n`;
      } else if (m.role === "assistant") {
        // Assistant message context
        const modelName = m.model ? getModelById(m.model).name : "Assistant";
        const personaDetails = getPersonaDetails(m.tone);
        const timestamp = formatMessageTimestamp(m.timestamp, locale);
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
  const threadName = thread.title || "Untitled Conversation";

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
  const isAnswerToUser = parentMessage?.role === "user";

  // Parent message context (if responding to a specific message)
  if (parentMessageId && parentMessage) {
    const parentId = parentMessageId.substring(
      0,
      API_CONSTANTS.ID_DISPLAY_LENGTH,
    );

    if (isAnswerAsAI) {
      // Responding to an AI message
      const parentModelName = parentMessage.model
        ? getModelById(parentMessage.model).name
        : "Assistant";
      const parentPersonaDetails = getPersonaDetails(parentMessage.tone);
      sections.push(
        `\nResponding to: AI message (${parentModelName} with ${parentPersonaDetails.name} persona) | ID: ${parentId}`,
      );
    } else if (isAnswerToUser) {
      // Responding to a user message
      const userName =
        parentMessage.author?.name ||
        parentMessage.author?.id?.substring(
          0,
          API_CONSTANTS.ID_DISPLAY_LENGTH,
        ) ||
        "User";
      sections.push(
        `\nResponding to: User message from ${userName} | ID: ${parentId}`,
      );
    }
  }

  // Model and persona context
  sections.push(`\nYou are: ${modelName} with ${personaDetails.name} persona`);

  // Special instruction for Answer as AI feature
  if (isAnswerAsAI) {
    const parentModelName = parentMessage.model
      ? getModelById(parentMessage.model).name
      : "Assistant";
    const parentPersonaDetails = getPersonaDetails(parentMessage.tone);

    sections.push(
      `\n=== RESPOND AS AI MODE ===`,
      `You are responding to a previous AI assistant message in this conversation branch.`,
      ``,
      `CONTEXT AWARENESS:`,
      `- The last message in the conversation is from: ${parentModelName} (${parentPersonaDetails.name} persona)`,
      `- You can see the full conversation history leading up to this point`,
      `- Your response will create a new branch in the conversation`,
      ``,
      `YOUR ROLE:`,
      `- You are ${modelName} with ${personaDetails.name} persona`,
      `- Respond DIRECTLY to the last assistant message based on your persona`,
      `- You can: agree, disagree, add context, correct mistakes, provide alternative perspectives, make jokes, challenge assumptions, or continue the discussion`,
      `- Your response should be relevant to what the previous AI said`,
      ``,
      `IMPORTANT:`,
      `- Follow your ${personaDetails.name} persona strictly - do NOT mimic the previous assistant's style or persona`,
      `- Address the content of the last message directly`,
      `- Be natural and conversational as if you're joining an ongoing discussion`,
      `- Consider the full conversation context when forming your response`,
    );
  } else if (isAnswerToUser) {
    sections.push(
      `\n=== STANDARD RESPONSE MODE ===`,
      `You are responding to a user message.`,
      `Provide a helpful, relevant response based on your persona and the conversation context.`,
    );
  }

  // Persona system prompt
  if (personaDetails.systemPrompt) {
    sections.push(
      `\n=== PERSONA INSTRUCTIONS ===`,
      personaDetails.systemPrompt,
    );
  }

  // Thread-specific system prompt (if any)
  if (thread.settings?.systemPrompt) {
    sections.push(
      `\n=== ADDITIONAL INSTRUCTIONS ===`,
      thread.settings.systemPrompt,
    );
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
  locale: CountryLanguage,
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
    messages: convertMessagesToAPIFormat(messages, locale),
    model: modelConfig.openRouterModel,
    temperature,
    maxTokens,
    systemPrompt,
    enableSearch,
  };
}
