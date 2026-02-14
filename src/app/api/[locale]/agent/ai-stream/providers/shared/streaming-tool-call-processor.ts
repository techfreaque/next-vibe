/**
 * Shared streaming processor for providers that use tool calling via prompt engineering
 * Handles real-time streaming while detecting and stripping <tool_calls> markup
 *
 * Used by: Venice.ai, FreedomGPT, Gab AI
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import {
  type OpenAIToolCall,
  parseToolCalls,
} from "./tool-calling-prompt-engineering";

/**
 * OpenAI Response Types
 */

interface OpenAIChoice {
  index: number;
  message?: {
    role?: string;
    content?: string;
    tool_calls?: OpenAIToolCall[];
  };
  delta?: {
    role?: string;
    content?: string;
    tool_calls?: OpenAIToolCall[];
  };
  finish_reason?: string;
}

interface OpenAIResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: OpenAIChoice[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * Process streaming response from API that uses prompt engineering for tool calls
 * Handles:
 * - Real-time streaming of content
 * - Detection of <tool_calls> markup and stopping forward
 * - Parsing tool calls at the end
 * - Including usage data in final chunk (if available)
 */
export async function processStreamingResponseWithToolCalls(
  response: Response,
  logger: EndpointLogger,
  providerName: string,
  waitForUsage = false,
): Promise<Response> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let accumulatedContent = "";
  let baseId = "";
  let created = 0;
  let model = "";
  let usage: OpenAIResponse["usage"] | undefined;
  let buffer = ""; // Buffer for incomplete lines
  let finishReason: string | null = null;
  let hasFinished = false;
  let hasSentFinalChunks = false;
  let hasDetectedToolCalls = false;

  const sendFinalChunks = (
    controller: ReadableStreamDefaultController,
  ): void => {
    if (hasSentFinalChunks) {
      return;
    }
    hasSentFinalChunks = true;

    logger.info(`[${providerName}] Sending final chunks`, {
      hasContent: !!accumulatedContent,
      contentLength: accumulatedContent.length,
      hasUsage: !!usage,
      usage,
      hasDetectedToolCalls,
    });

    // Parse accumulated content for tool calls
    const { toolCalls } = parseToolCalls(accumulatedContent, logger);

    // When we detect tool calls, we've already forwarded the content chunks
    // from the API (which includes role and text content before the <)
    // So we should NOT re-send the text content here - it's already been streamed
    // We only need to send tool calls and finish chunk

    // Send tool calls chunk if present (always send these, they're new)
    if (toolCalls && toolCalls.length > 0) {
      // Send each tool call in a separate chunk with proper index
      toolCalls.forEach((tc, idx) => {
        // Extract noLoop from arguments (it will be stripped by AI SDK validation otherwise)
        // We DON'T remove it from arguments - let it pass through
        // The AI SDK will strip it during validation, but we keep it in the JSON string
        const toolCallChunk: OpenAIResponse = {
          id: baseId,
          object: "chat.completion.chunk",
          created,
          model,
          choices: [
            {
              index: 0,
              delta: {
                tool_calls: [
                  {
                    index: idx,
                    id: `call_${baseId}_${idx}`,
                    type: "function",
                    function: {
                      name: tc.name,
                      arguments: JSON.stringify(tc.arguments),
                    },
                  },
                ],
              },
              finish_reason: undefined,
            },
          ],
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(toolCallChunk)}\n\n`),
        );
      });
    }

    // Send finish chunk with usage data
    // Use "tool_calls" if we have tool calls, otherwise use "stop"
    // The noLoop parameter in tool arguments will be handled by tool-call-handler
    const effectiveFinishReason =
      toolCalls && toolCalls.length > 0 ? "tool_calls" : finishReason || "stop";

    const finishChunk: OpenAIResponse = {
      id: baseId,
      object: "chat.completion.chunk",
      created,
      model,
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: effectiveFinishReason,
        },
      ],
      usage,
    };
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify(finishChunk)}\n\n`),
    );

    // Send [DONE]
    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
  };

  const stream = new ReadableStream({
    async start(controller): Promise<void> {
      if (!response.body) {
        controller.close();
        return;
      }

      const reader = response.body.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // If we finished reading but never got the final chunk sent, send it now
            if (hasFinished && finishReason && !hasSentFinalChunks) {
              sendFinalChunks(controller);
            }
            break;
          }

          // Append to buffer and split by newlines
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) {
              continue;
            }
            if (line === "data: [DONE]") {
              continue;
            }

            const jsonStr = line.slice(6);
            try {
              const data = JSON.parse(jsonStr) as OpenAIResponse;

              // Store metadata
              if (data.id) {
                baseId = data.id;
              }
              if (data.created) {
                created = data.created;
              }
              if (data.model) {
                model = data.model;
              }

              // Check if this is a usage-only chunk (comes after finish in some providers)
              if (data.usage) {
                usage = data.usage;

                // If we already got the finish reason, now we can send the final chunks
                if (waitForUsage && hasFinished && finishReason) {
                  sendFinalChunks(controller);
                }
              }

              // Accumulate content and check for tool calls
              const delta = data.choices?.[0]?.delta;
              const hasContentInThisChunk = !!delta?.content;

              if (delta?.content) {
                const combined = accumulatedContent + delta.content;

                // Check if we're starting to see potential tool call markup
                // Stop forwarding at the FIRST sign of "<" that could be tool calls
                const mightStartToolCalls =
                  !hasDetectedToolCalls &&
                  (combined.includes("<tool_calls>") ||
                    // Check if we have a partial match that could complete later
                    (combined.includes("<") &&
                      "<tool_calls>".startsWith(
                        combined.slice(combined.lastIndexOf("<")),
                      )));

                if (mightStartToolCalls) {
                  hasDetectedToolCalls = true;
                  logger.info(
                    `[${providerName}] Potential tool calls detected, stopping forward`,
                    {
                      accumulatedLength: accumulatedContent.length,
                      chunkLength: delta.content.length,
                      lastChars: combined.slice(-20),
                    },
                  );
                }

                accumulatedContent += delta.content;
              }

              // Check for finish but don't send finish chunk yet (wait for usage if needed)
              const currentFinishReason = data.choices?.[0]?.finish_reason;
              if (currentFinishReason && !hasFinished) {
                finishReason = currentFinishReason;
                hasFinished = true;

                // If we already have usage (or don't need to wait), send final chunks immediately
                // Otherwise, we'll wait for the usage chunk
                if (!waitForUsage || usage) {
                  sendFinalChunks(controller);
                }
              } else if (
                !hasFinished &&
                !data.usage &&
                !hasDetectedToolCalls &&
                hasContentInThisChunk
              ) {
                // Only forward content chunks if we haven't detected tool calls yet
                // Stop forwarding as soon as we detect potential tool call markup
                controller.enqueue(encoder.encode(`data: ${jsonStr}\n\n`));
              }
            } catch (error) {
              logger.error(
                `[${providerName}] Failed to parse SSE chunk`,
                parseError(error),
                { line },
              );
            }
          }
        }
      } catch (error) {
        logger.error(
          `[${providerName}] Error processing stream`,
          parseError(error),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
