/**
 * Uncensored.ai API Handler
 *
 * Clean implementation following the official API docs.
 * Automatically detects and handles both streaming and non-streaming responses:
 * - When API supports streaming: passes through real-time SSE/JSON stream
 * - When API doesn't support streaming: converts complete response to simulated stream
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
  stream?: boolean;
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

  // Request streaming - the API will automatically switch to streaming when supported
  const requestBody: UncensoredRequest = {
    model: "uncensored-lm",
    messages: messages,
    temperature: temperature,
    max_tokens: maxTokens,
    stream: true, // Always request streaming
  };

  const response = await fetch(
    "https://mkstqjtsujvcaobdksxs.functions.supabase.co/functions/v1/chat-backup",
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

  // Auto-detect streaming vs non-streaming response
  return transformResponseToStream(response);
}

/**
 * Auto-detect and transform response to Vercel AI SDK streaming format
 * Intelligently handles:
 * 1. True streaming (SSE format with "data:" prefix)
 * 2. Newline-delimited JSON streaming
 * 3. Complete JSON response (auto-converts to simulated stream)
 *
 * @param response - Fetch response (streaming or complete)
 * @returns Response with Vercel AI SDK format stream
 */
function transformResponseToStream(response: Response): Response {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  if (!reader) {
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
    throw new Error("Response body is not readable");
  }

  const stream = new ReadableStream({
    async start(controller): Promise<void> {
      let buffer = "";
      let isStreamingMode = false; // Auto-detect streaming vs complete response
      let hasProcessedStreamingData = false;

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Handle any remaining buffered data as complete JSON response
            if (buffer.trim() && !hasProcessedStreamingData) {
              try {
                const parsed = JSON.parse(buffer);
                const content = parsed.choices?.[0]?.message?.content;
                if (content) {
                  // Convert complete response to streaming format
                  const chunkSize = 20;
                  for (let i = 0; i < content.length; i += chunkSize) {
                    const chunk = content.slice(i, i + chunkSize);
                    const escaped = JSON.stringify(chunk).slice(1, -1);
                    // eslint-disable-next-line i18next/no-literal-string
                    controller.enqueue(encoder.encode(`0:"${escaped}"\n`));
                  }
                }
              } catch {
                // Not valid JSON, ignore
              }
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Detect streaming mode: check if we have SSE or newline-delimited JSON
          if (!isStreamingMode && buffer.includes("\n")) {
            const firstLine = buffer.split("\n")[0].trim();
            isStreamingMode =
              firstLine.startsWith("data:") || firstLine.startsWith("{");
          }

          // If not in streaming mode yet, continue buffering
          if (!isStreamingMode) {
            continue;
          }

          // Process streaming data line-by-line
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
              continue;
            }

            let jsonData: string | null = null;

            // Handle SSE format: "data: {json}"
            if (trimmedLine.startsWith("data: ")) {
              jsonData = trimmedLine.slice(6);
            }
            // Handle newline-delimited JSON streaming
            else if (trimmedLine.startsWith("{")) {
              jsonData = trimmedLine;
            }

            if (!jsonData || jsonData === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(jsonData);

              // Check for streaming format (delta.content - OpenAI streaming format)
              const deltaContent = parsed.choices?.[0]?.delta?.content;

              // Check for non-streaming format (message.content - complete format)
              const messageContent = parsed.choices?.[0]?.message?.content;

              const content = deltaContent || messageContent;

              if (content) {
                hasProcessedStreamingData = true;
                // Immediately forward content to frontend
                const escaped = JSON.stringify(content).slice(1, -1);
                // eslint-disable-next-line i18next/no-literal-string
                controller.enqueue(encoder.encode(`0:"${escaped}"\n`));
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      // eslint-disable-next-line i18next/no-literal-string
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
