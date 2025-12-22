/**
 * Uncensored.ai Provider
 * Custom AI SDK-compatible provider implementation for Uncensored.ai API
 */

import "server-only";

import type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2StreamPart,
} from "@ai-sdk/provider";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/**
 * Check if a model ID is an Uncensored.ai model
 *
 * @param modelId - The model ID to check
 * @returns true if the model is from Uncensored.ai
 */
export function isUncensoredAIModel(modelId: string): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return modelId === "uncensored-lm" || modelId.startsWith("uncensored-");
}

/**
 * Configuration options for Uncensored.ai provider
 */
export interface UncensoredAIConfig {
  apiKey: string;
  baseURL?: string;
  logger: EndpointLogger;
}

/**
 * Create an Uncensored.ai provider compatible with AI SDK V2
 *
 * @param config - Provider configuration
 * @returns Provider object with chat() method
 */
export function createUncensoredAI(config: UncensoredAIConfig): {
  chat: (modelId: string) => LanguageModelV2;
} {
  const {
    apiKey,
    baseURL = "https://mkstqjtsujvcaobdksxs.functions.supabase.co/functions/v1/chat-backup",
    logger,
  } = config;

  return {
    chat: (modelId: string) =>
      new UncensoredAILanguageModel(modelId, apiKey, baseURL, logger),
  };
}

/**
 * Custom LanguageModelV2 implementation for UncensoredAI
 */
class UncensoredAILanguageModel implements LanguageModelV2 {
  readonly specificationVersion = "v2" as const;
  readonly provider = "uncensored-ai" as const;
  readonly modelId: string;
  readonly supportedUrls = {};

  constructor(
    modelId: string,
    private readonly apiKey: string,
    private readonly baseURL: string,
    private readonly logger: EndpointLogger,
  ) {
    this.modelId = modelId;
  }

  doGenerate(): Promise<never> {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("doGenerate not implemented - use doStream instead");
  }

  async doStream(options: LanguageModelV2CallOptions): Promise<{
    stream: ReadableStream<LanguageModelV2StreamPart>;
    request?: { body?: string };
    response?: { headers?: Record<string, string> };
  }> {
    const { prompt, tools, ...settings } = options;

    // Convert AI SDK V2 prompt format to OpenAI format
    // Keep custom logic for potential future adjustments
    const messages = prompt.map((msg) => {
      if (msg.role === "system") {
        return { role: "system" as const, content: msg.content };
      }
      if (msg.role === "user") {
        const textContent = msg.content
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n");
        return { role: "user" as const, content: textContent };
      }
      if (msg.role === "assistant") {
        const textContent = msg.content
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n");
        return { role: "assistant" as const, content: textContent };
      }
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error(`Unsupported message role: ${msg.role}`);
    });

    // Convert AI SDK tools to OpenAI format
    // AI SDK passes tools as an array of LanguageModelV2FunctionTool
    // Each tool has: { type: 'function', name: string, description?: string, parameters: JSONSchema7 }
    const openAITools = tools
      ? tools.map((tool) => {
          if (tool.type === "function") {
            return {
              type: "function" as const,
              function: {
                name: tool.name,
                description: tool.description || "",
                parameters: tool.inputSchema, // AI SDK v2 uses inputSchema
              },
            };
          }
          // Provider-defined tools
          return {
            type: "function" as const,
            function: {
              name: tool.name,
              description: "",
              parameters: {},
            },
          };
        })
      : undefined;

    const requestBody = {
      model: this.modelId,
      messages,
      temperature: settings.temperature ?? 0.7,
      max_tokens: settings.maxOutputTokens ?? 2000,
      stream: true,
      ...(openAITools && openAITools.length > 0 ? { tools: openAITools } : {}),
    };

    const startTime = Date.now();

    let response: Response;
    try {
      response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: settings.abortSignal,
      });
    } catch (fetchError) {
      const elapsed = Date.now() - startTime;
      if (fetchError instanceof Error) {
        this.logger.error("[UncensoredAI] Request failed", {
          elapsed: `${elapsed}ms`,
          error: fetchError.message,
        });
      }
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw fetchError;
    }

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error("[UncensoredAI] API error", {
        status: response.status,
        error: errorText.slice(0, 500),
      });
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      throw new Error(
        `UncensoredAI API error: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const stream = this.createStreamTransformer(response.body!, this.logger);

    return {
      stream,
      request: {
        body: JSON.stringify(requestBody),
      },
      response: {
        headers: Object.fromEntries(response.headers.entries()),
      },
    };
  }

  private createStreamTransformer(
    responseBody: ReadableStream<Uint8Array>,
    logger: EndpointLogger,
  ): ReadableStream<LanguageModelV2StreamPart> {
    const reader = responseBody.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const textId = `text-${Date.now()}`;
    let chunkCount = 0;
    const streamStartTime = Date.now();

    // Stall timeout - if no data received for 30 seconds, abort
    const STALL_TIMEOUT_MS = 30000;

    return new ReadableStream<LanguageModelV2StreamPart>({
      async pull(controller): Promise<void> {
        // Keep reading until we can emit something or error out
        while (true) {
          try {
            // Add stall timeout to reader.read()
            const readPromise = reader.read();
            // eslint-disable-next-line no-unused-vars
            const timeoutPromise = new Promise<never>((_resolve, reject) => {
              setTimeout(() => {
                reject(
                  new Error(
                    `No data received for ${STALL_TIMEOUT_MS / 1000} seconds - connection stalled`,
                  ),
                );
              }, STALL_TIMEOUT_MS);
            });

            const { done, value } = await Promise.race([
              readPromise,
              timeoutPromise,
            ]);
            chunkCount++;

            if (done) {
              // Handle any remaining buffered data
              if (buffer.trim()) {
                try {
                  const parsed = JSON.parse(buffer);
                  const message = parsed.choices?.[0]?.message;

                  // Handle tool calls
                  if (
                    message?.tool_calls &&
                    Array.isArray(message.tool_calls)
                  ) {
                    for (const toolCall of message.tool_calls) {
                      controller.enqueue({
                        type: "tool-call",
                        toolCallId: toolCall.id,
                        toolName: toolCall.function?.name,
                        input:
                          typeof toolCall.function?.arguments === "string"
                            ? JSON.parse(toolCall.function.arguments)
                            : toolCall.function?.arguments,
                      });
                    }
                  }

                  // Handle text content
                  const content = message?.content;
                  if (content) {
                    controller.enqueue({
                      type: "text-delta",
                      delta: content,
                      id: textId,
                    });
                  }
                } catch {
                  logger.warn(
                    "[UncensoredAI] Failed to parse final buffer as JSON",
                  );
                }
              }
              controller.enqueue({
                type: "finish",
                finishReason: "stop",
                usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
              });
              controller.close();
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Try to parse as complete JSON (non-streaming response)
            // The API returns a complete JSON object, not streaming chunks
            try {
              const parsed = JSON.parse(buffer);
              const message = parsed.choices?.[0]?.message;

              // Handle tool calls
              if (message?.tool_calls && Array.isArray(message.tool_calls)) {
                for (const toolCall of message.tool_calls) {
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: toolCall.id,
                    toolName: toolCall.function?.name,
                    input:
                      typeof toolCall.function?.arguments === "string"
                        ? JSON.parse(toolCall.function.arguments)
                        : toolCall.function?.arguments,
                  });
                }
              }

              // Handle text content
              const content = message?.content;
              if (content) {
                controller.enqueue({
                  type: "text-delta",
                  delta: content,
                  id: textId,
                });
              }

              // Clear buffer and signal completion if we got a response
              if (message) {
                buffer = "";
                controller.enqueue({
                  type: "finish",
                  finishReason: "stop",
                  usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
                });
                controller.close();
                return; // Exit the while loop after closing
              }
            } catch {
              // Not yet a complete JSON, continue looping to read more data
              continue;
            }
          } catch (error) {
            const streamDuration = Date.now() - streamStartTime;
            logger.error("[UncensoredAI] Stream error", {
              error: error instanceof Error ? error.message : String(error),
              chunkCount,
              duration: `${streamDuration}ms`,
            });
            controller.error(error);
            return; // Exit the while loop and function on error
          }
        } // end while
      },

      cancel(): void {
        reader.cancel();
      },
    });
  }
}
