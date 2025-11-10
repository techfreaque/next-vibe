/**
 * Uncensored.ai API Handler
 *
 * Clean implementation following the official API docs.
 * The API is OpenAI-compatible but does NOT support streaming.
 * We convert the complete response to a streaming format for our frontend.
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UncensoredMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface UncensoredRequest {
  model: string;
  messages: UncensoredMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface UncensoredResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call Uncensored.ai API and return streaming response
 *
 * @param apiKey - Uncensored.ai API key
 * @param messages - Array of chat messages
 * @param temperature - Temperature parameter (0-2)
 * @param maxTokens - Maximum tokens to generate
 * @param locale - Language locale for error messages
 * @returns Response with streaming text in Vercel AI SDK format
 */
export async function handleUncensoredAI(
  apiKey: string,
  messages: UncensoredMessage[],
  temperature = 0.7,
  maxTokens = 2000,
  locale: CountryLanguage,
): Promise<Response> {
  const { t } = simpleT(locale);
  // Make API call per official docs
  const requestBody: UncensoredRequest = {
    model: "uncensored-lm",
    messages: messages,
    temperature: temperature,
    max_tokens: maxTokens,
  };

  const response = await fetch(
    "https://mkstqjtsujvcaobdksxs.functions.supabase.co/functions/v1/uncensoredlm-api",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
    throw new Error(
      t(
        "app.api.v1.core.agent.chat.aiStream.providers.uncensoredHandler.errors.apiError",
        {
          status: response.status.toString(),
          errorText,
        },
      ),
    );
  }

  const data = (await response.json()) as UncensoredResponse;
  const content = data.choices?.[0]?.message?.content || "";

  // Convert complete response to streaming format
  // This simulates streaming for consistent frontend handling
  return createStreamingResponse(content);
}

/**
 * Convert complete text to streaming response
 * Uses Vercel AI SDK text stream format: "0:\"text\"\n"
 *
 * @param content - Complete text content
 * @returns Response with streaming text
 */
function createStreamingResponse(content: string): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller): void {
      // Send in small chunks to simulate streaming
      const chunkSize = 20;

      for (let i = 0; i < content.length; i += chunkSize) {
        const chunk = content.slice(i, i + chunkSize);
        // Use JSON.stringify to properly escape the chunk
        const escaped = JSON.stringify(chunk).slice(1, -1);
        // Vercel AI SDK format
        // eslint-disable-next-line i18next/no-literal-string
        controller.enqueue(encoder.encode(`0:"${escaped}"\n`));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      // eslint-disable-next-line i18next/no-literal-string
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
