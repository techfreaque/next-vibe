/**
 * Shared streaming processor for providers that use tool calling via prompt engineering
 * Handles real-time streaming while detecting and stripping <tool_calls> markup
 *
 * Used by: Venice.ai, FreedomGPT, Gab AI
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { isStreamAbort } from "../../repository/core/constants";
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

export interface OpenAIResponse {
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

const TOOL_CALLS_TAG = "<tool_calls>";

/**
 * Cap on the held-back `<tool_calls>` markup of one response. A real call is a
 * few KB (a document-writing call a few tens of KB). Past this the model is
 * looping inside the block: prod 2026-11-16, Venice Uncensored streamed ~110k
 * hidden tokens for 5 minutes until the context ran out, and the user saw
 * nothing but was billed for all of it.
 */
export const MAX_TOOL_CALL_MARKUP_CHARS = 80_000;

/**
 * How far `content` (from `from` on) can be forwarded as visible text.
 * - `confirmed`: a `<tool_calls>` block starts at `end`; everything after it
 *   is tool markup and is held back for parsing.
 * - otherwise a trailing `<`, `<to`, ... that may still grow into the tag is
 *   held back from `end`; text before it is safe. A `<` that can no longer
 *   become the tag ("a < b", "<table>") is plain text and is forwarded.
 */
export function forwardableEnd(
  content: string,
  from: number,
): { end: number; confirmed: boolean } {
  const tagIndex = content.indexOf(TOOL_CALLS_TAG, from);
  if (tagIndex !== -1) {
    return { end: tagIndex, confirmed: true };
  }
  const lastLt = content.lastIndexOf("<");
  if (lastLt >= from && TOOL_CALLS_TAG.startsWith(content.slice(lastLt))) {
    return { end: lastLt, confirmed: false };
  }
  return { end: content.length, confirmed: false };
}

/**
 * Process streaming response from API that uses prompt engineering for tool calls
 * Handles:
 * - Real-time streaming of content
 * - Holding back <tool_calls> markup (and a possible partial tag) from the
 *   visible stream; a false alarm ("a < b") is released as text
 * - Parsing tool calls at the end
 * - Cutting a runaway tool-call block off at MAX_TOOL_CALL_MARKUP_CHARS
 * - Including usage data in final chunk (if available)
 */
export async function processStreamingResponseWithToolCalls(
  response: Response,
  logger: EndpointLogger,
  providerName: string,
  waitForUsage = false,
  /** Sees every parsed upstream chunk as received (e.g. to read a cost field
   *  the re-emitted chunks drop). */
  onUpstreamChunk?: (chunk: OpenAIResponse) => void,
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
  /** A `<tool_calls>` tag was seen: the rest of the response is tool markup. */
  let hasDetectedToolCalls = false;
  /** accumulatedContent[0, forwardedUpTo) has been streamed as visible text. */
  let forwardedUpTo = 0;
  /** Index of the `<tool_calls>` tag once detected. */
  let toolMarkupStart = 0;
  /** Set when the markup cap cut the upstream read short. */
  let runawayCutOff = false;

  const enqueueContent = (
    controller: ReadableStreamDefaultController,
    content: string,
  ): void => {
    const chunk: OpenAIResponse = {
      id: baseId,
      object: "chat.completion.chunk",
      created,
      model,
      choices: [{ index: 0, delta: { content } }],
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
  };

  const sendFinalChunks = (
    controller: ReadableStreamDefaultController,
  ): void => {
    if (hasSentFinalChunks) {
      return;
    }
    hasSentFinalChunks = true;

    logger.debug(`[${providerName}] Sending final chunks`, {
      hasContent: !!accumulatedContent,
      contentLength: accumulatedContent.length,
      hasUsage: !!usage,
      usage,
      hasDetectedToolCalls,
    });

    // Parse accumulated content for tool calls
    const { toolCalls } = parseToolCalls(accumulatedContent, logger);

    // Release visible text not streamed yet: a held-back partial tag that
    // never became `<tool_calls>` ("... <" at the very end), or text that
    // arrived in the finish chunk itself.
    const releaseEnd = hasDetectedToolCalls
      ? toolMarkupStart
      : accumulatedContent.length;
    if (releaseEnd > forwardedUpTo) {
      enqueueContent(
        controller,
        accumulatedContent.slice(forwardedUpTo, releaseEnd),
      );
      forwardedUpTo = releaseEnd;
    }
    if (hasDetectedToolCalls && (!toolCalls || toolCalls.length === 0)) {
      // Markup that never parsed: nothing reaches the user from it, so make
      // the turn diagnosable (the loop reports it as an empty answer).
      logger.warn(`[${providerName}] Tool-call markup did not parse`, {
        markupChars: accumulatedContent.length - toolMarkupStart,
        finishReason,
        runawayCutOff,
        head: accumulatedContent.slice(toolMarkupStart, toolMarkupStart + 300),
      });
    }

    // When we detect tool calls, we've already forwarded the content chunks
    // from the API (which includes role and text content before the <)
    // So we should NOT re-send the text content here - it's already been streamed
    // We only need to send tool calls and finish chunk

    // Send tool calls chunk if present (always send these, they're new)
    if (toolCalls && toolCalls.length > 0) {
      // Send each tool call in a separate chunk with proper index
      toolCalls.forEach((tc, idx) => {
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
    const effectiveFinishReason =
      toolCalls && toolCalls.length > 0
        ? "tool_calls"
        : runawayCutOff
          ? "length"
          : finishReason || "stop";

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
              onUpstreamChunk?.(data);

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

              // Visible text of this chunk: forwarded below unless this is the
              // finish chunk (then sendFinalChunks releases it).
              let visibleEnd = forwardedUpTo;
              if (delta?.content) {
                accumulatedContent += delta.content;
                if (!hasDetectedToolCalls) {
                  const { end, confirmed } = forwardableEnd(
                    accumulatedContent,
                    forwardedUpTo,
                  );
                  visibleEnd = end;
                  if (confirmed) {
                    hasDetectedToolCalls = true;
                    toolMarkupStart = end;
                    logger.info(
                      `[${providerName}] Tool calls detected, stopping forward`,
                      {
                        accumulatedLength: accumulatedContent.length,
                        visibleLength: end,
                      },
                    );
                  }
                }
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
              } else if (!hasFinished && !data.usage && hasContentInThisChunk) {
                // Forward only visible text; tool markup and a partial tag
                // that may still become one stay held back. A chunk that is
                // all visible goes out raw (keeps any extra delta fields).
                const chunkStart =
                  accumulatedContent.length - (delta?.content?.length ?? 0);
                if (
                  forwardedUpTo === chunkStart &&
                  visibleEnd === accumulatedContent.length
                ) {
                  controller.enqueue(encoder.encode(`data: ${jsonStr}\n\n`));
                } else if (visibleEnd > forwardedUpTo) {
                  enqueueContent(
                    controller,
                    accumulatedContent.slice(forwardedUpTo, visibleEnd),
                  );
                }
                forwardedUpTo = Math.max(forwardedUpTo, visibleEnd);
              }

              // Runaway tool-call block: stop reading (closing the upstream
              // stops the generation and its cost) and finish with what we
              // have. A complete call already in the markup still runs.
              if (
                hasDetectedToolCalls &&
                !hasFinished &&
                accumulatedContent.length - toolMarkupStart >
                  MAX_TOOL_CALL_MARKUP_CHARS
              ) {
                runawayCutOff = true;
                hasFinished = true;
                logger.warn(
                  `[${providerName}] Tool-call markup exceeded cap, cutting the stream`,
                  {
                    markupChars: accumulatedContent.length - toolMarkupStart,
                    cap: MAX_TOOL_CALL_MARKUP_CHARS,
                    head: accumulatedContent.slice(
                      toolMarkupStart,
                      toolMarkupStart + 300,
                    ),
                  },
                );
                sendFinalChunks(controller);
                await reader.cancel();
                break;
              }
            } catch (error) {
              logger.error(
                `[${providerName}] Failed to parse SSE chunk`,
                parseError(error),
                {
                  line,
                },
              );
            }
          }
          if (runawayCutOff) {
            break;
          }
        }
      } catch (error) {
        // StreamAbortError (superseded, user_cancelled, loop_stop, ...) is
        // the app's own graceful-abort signal - it never matches the raw
        // DOM AbortError check below, so it was falling through to
        // logger.error for perfectly normal control flow.
        if (
          error instanceof Error &&
          (error.name === "AbortError" || isStreamAbort(error))
        ) {
          logger.debug(`[${providerName}] Stream closed by client`, {
            reason: isStreamAbort(error) ? error.reason : undefined,
          });
        } else {
          logger.error(
            `[${providerName}] Error processing stream`,
            parseError(error),
          );
          controller.error(error);
        }
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
