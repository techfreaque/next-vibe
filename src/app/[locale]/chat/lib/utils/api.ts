/**
 * API utilities for chat functionality
 */

import type { ChatMessage, ChatThread } from "../storage/types";
import type { ModelId } from "../config/models";
import { getModelById } from "../config/models";
import { getPersonaById } from "../config/personas";
import { APIError } from "./errors";
import { getMessagesInPath } from "../storage/message-tree";

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
    errorData.details
  );
}

/**
 * Format timestamp as readable date/time
 */
function formatMessageTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get persona details from tone ID
 */
function getPersonaDetails(tone?: string): { name: string; systemPrompt: string } {
  if (!tone) {
    return { name: "default", systemPrompt: "" };
  }

  const persona = getPersonaById(tone);
  return {
    name: persona.name,
    systemPrompt: persona.systemPrompt
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
  return content.replace(/<context>[\s\S]*?<\/context>\s*/gi, '');
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
}

/**
 * Convert chat messages to API format with context metadata
 * Filters out error messages and formats for API
 * Wraps context information in <context> tags for easy parsing/removal
 */
export function convertMessagesToAPIFormat(messages: ChatMessage[]): APIMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      // Build context metadata based on message type
      let contextMetadata = "";

      if (m.role === "user") {
        // User message context
        const userName = m.author?.name || m.author?.id?.substring(0, 8) || "User";
        const timestamp = formatMessageTimestamp(m.timestamp);
        contextMetadata = `<context>User: ${userName} | ID: ${m.id.substring(0, 8)} | ${timestamp}</context>\n`;
      } else if (m.role === "assistant") {
        // Assistant message context
        const modelName = m.model ? getModelById(m.model).name : "Assistant";
        const personaDetails = getPersonaDetails(m.tone);
        const timestamp = formatMessageTimestamp(m.timestamp);
        contextMetadata = `<context>Assistant: ${modelName} (${personaDetails.name}) | ID: ${m.id.substring(0, 8)} | ${timestamp}</context>\n`;
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
  parentMessageId: string | null
): string {
  const modelName = getModelById(modelId).name;
  const personaDetails = getPersonaDetails(tone);
  const threadName = thread.name || "Untitled Conversation";

  // Build context sections
  const sections: string[] = [];

  // Important instruction about context tags
  sections.push('IMPORTANT: Messages contain <context> tags with metadata. Do NOT include these tags in your response. Only respond with your actual message content.');

  // Thread context
  sections.push(`\nThread: "${threadName}"`);

  // Parent message context (if responding to a specific message)
  if (parentMessageId) {
    sections.push(`Responding to message ID: ${parentMessageId.substring(0, 8)}`);
  }

  // Model and persona context
  sections.push(`You are: ${modelName} with ${personaDetails.name} persona`);

  // Persona system prompt
  if (personaDetails.systemPrompt) {
    sections.push(`\n${personaDetails.systemPrompt}`);
  }

  // Thread-specific system prompt (if any)
  if (thread.settings?.systemPrompt) {
    sections.push(`\nAdditional instructions: ${thread.settings.systemPrompt}`);
  }

  return sections.join('\n');
}

/**
 * Build API request payload from thread with enhanced system prompt
 */
export function buildChatCompletionRequest(
  thread: ChatThread,
  modelId: ModelId,
  tone: string,
  parentMessageId: string | null,
  temperature: number = 0.7,
  maxTokens: number = 2000
): ChatCompletionRequest {
  const messages = getMessagesInPath(thread);
  const modelConfig = getModelById(modelId);
  const systemPrompt = buildEnhancedSystemPrompt(thread, modelId, tone, parentMessageId);

  return {
    messages: convertMessagesToAPIFormat(messages),
    model: modelConfig.openRouterModel,
    temperature,
    maxTokens,
    systemPrompt,
  };
}

/**
 * Build API path with locale
 */
export function buildAPIPath(locale: string, endpoint: string): string {
  return `/api/${locale}/v1/core/agent/chat/${endpoint}`;
}

/**
 * Fetch with error handling
 */
export async function fetchWithErrorHandling(
  url: string,
  options: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      await handleAPIError(response);
    }

    return response;
  } catch (error: unknown) {
    // If it's already an APIError, re-throw it
    if (error instanceof APIError) {
      throw error;
    }

    // Wrap other errors
    if (error instanceof Error) {
      throw new APIError(`Failed to fetch ${url}: ${error.message}`);
    }

    throw new APIError(`Failed to fetch ${url}: Unknown error`);
  }
}

/**
 * Create abort controller with timeout
 */
export function createAbortController(timeoutMs?: number): AbortController {
  const controller = new AbortController();

  if (timeoutMs) {
    setTimeout(() => {
      controller.abort();
    }, timeoutMs);
  }

  return controller;
}

/**
 * Check if error is an abort error
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

