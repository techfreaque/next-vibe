/**
 * Anthropic Agent SDK Provider
 *
 * Implements LanguageModelV2 interface using the Claude Agent SDK.
 * This allows the Agent SDK to be used as a standard provider in streamText(),
 * identical to OpenRouter, Venice.ai, etc. - no special-casing required.
 *
 * How it works:
 * 1. Our tools are passed to the Agent SDK via createSdkMcpServer()
 * 2. The Agent SDK manages its own tool execution loop internally
 * 3. Tool calls use providerExecuted=true so streamText() doesn't re-execute them
 * 4. SDK streaming events are mapped to LanguageModelV2StreamPart events
 * 5. streamText() processes them exactly as it would any other provider
 */

import "server-only";

import type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2CallWarning,
  LanguageModelV2Content,
  LanguageModelV2FinishReason,
  LanguageModelV2StreamPart,
  LanguageModelV2ToolResultOutput,
  LanguageModelV2Usage,
} from "@ai-sdk/provider";
import type { BetaRawMessageStreamEvent } from "@anthropic-ai/sdk/resources/beta/messages/messages.mjs";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { AgentToolExecutorRegistry } from "./anthropic-agent-tool-bridge";
import { logProviderRequest } from "./shared/debug-file-logger";

/**
 * Create an Anthropic Agent SDK provider conforming to the standard provider interface.
 *
 * @param logger - Endpoint logger
 * @param toolExecutors - Optional pre-populated registry of tool executor functions
 * @returns Provider with chat() method, same as OpenRouter/VeniceAI/etc.
 */
export function createClaudeCode(
  logger: EndpointLogger,
  toolExecutors?: AgentToolExecutorRegistry,
): {
  chat: (modelId: string) => LanguageModelV2;
  /** Registry for tool executors - populate with registerTools() before streaming */
  toolExecutors: AgentToolExecutorRegistry;
} {
  const registry = toolExecutors ?? new AgentToolExecutorRegistry();
  return {
    toolExecutors: registry,
    chat: (modelId: string): LanguageModelV2 => {
      return new AnthropicAgentLanguageModel(modelId, logger, registry);
    },
  };
}

/**
 * LanguageModelV2 implementation backed by the Claude Agent SDK.
 *
 * The `doStream()` method:
 * 1. Extracts the prompt text from the AI SDK's prompt format
 * 2. Converts our tools from LanguageModelV2 format to Agent SDK MCP tools
 * 3. MCP handlers execute tools via AgentToolExecutorRegistry
 * 4. Tool calls are emitted with providerExecuted=true + tool-result
 * 5. Calls Agent SDK query() and maps streaming events to LanguageModelV2StreamPart
 */
class AnthropicAgentLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = "v2" as const;
  // eslint-disable-next-line i18next/no-literal-string -- provider identifier
  readonly provider = "claude-code";
  readonly modelId: string;
  readonly supportedUrls: Record<string, RegExp[]> = {};

  private readonly logger: EndpointLogger;
  private readonly toolExecutors: AgentToolExecutorRegistry;

  constructor(
    modelId: string,
    logger: EndpointLogger,
    toolExecutors: AgentToolExecutorRegistry,
  ) {
    this.modelId = modelId;
    this.logger = logger;
    this.toolExecutors = toolExecutors;
  }

  /**
   * Non-streaming generation - collect streaming output into a single response.
   */
  async doGenerate(options: LanguageModelV2CallOptions): Promise<{
    content: LanguageModelV2Content[];
    finishReason: LanguageModelV2FinishReason;
    usage: LanguageModelV2Usage;
    warnings: LanguageModelV2CallWarning[];
  }> {
    const streamResult = await this.doStream(options);
    const contentParts: LanguageModelV2Content[] = [];
    let usage: LanguageModelV2Usage = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };
    let finishReason: LanguageModelV2FinishReason = "other";
    let currentText = "";

    const reader = streamResult.stream.getReader();
    try {
      let readResult = await reader.read();
      while (!readResult.done) {
        const part = readResult.value;
        if (part.type === "text-delta") {
          currentText += part.delta;
        } else if (part.type === "finish") {
          usage = part.usage;
          finishReason = part.finishReason;
        }
        readResult = await reader.read();
      }
    } finally {
      reader.releaseLock();
    }

    if (currentText) {
      contentParts.push({ type: "text", text: currentText });
    }

    return {
      content: contentParts,
      finishReason,
      usage,
      warnings: [],
    };
  }

  /**
   * Streaming generation - the main entry point.
   * Maps Agent SDK query() output to LanguageModelV2StreamPart events.
   */
  async doStream(options: LanguageModelV2CallOptions): Promise<{
    stream: ReadableStream<LanguageModelV2StreamPart>;
  }> {
    const { prompt, tools, abortSignal } = options;

    // Extract system prompt and user messages from AI SDK prompt format
    const { systemPrompt, userPrompt } = extractPromptParts(prompt);

    // Lazy import Agent SDK to avoid loading at module level
    const {
      query,
      createSdkMcpServer,
      tool: sdkTool,
    } = await import("@anthropic-ai/claude-agent-sdk");

    // Convert AI SDK tools to Agent SDK MCP tools
    // MCP handlers execute tools via AgentToolExecutorRegistry and return results
    // to the Agent SDK. We also emit tool-call/tool-result stream parts for the UI.
    const { z: z4 } = await import("zod/v4");
    const toolExecutors = this.toolExecutors;
    const logger = this.logger;

    // Stream controller ref - set once ReadableStream.start() fires.
    // MCP handlers use this to emit tool-call/tool-result in real-time.
    let streamController: ReadableStreamDefaultController<LanguageModelV2StreamPart> | null =
      null;

    const mcpTools = (tools ?? [])
      .filter(
        (t): t is typeof t & { type: "function" } => t.type === "function",
      )
      .map((t) => {
        const inputShape = jsonSchemaToZodV4Shape(
          z4,
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- JSON Schema is untyped by nature
          t.inputSchema as Record<string, unknown>,
        );
        return sdkTool(
          t.name,
          t.description ?? t.name,
          inputShape,
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- MCP handler args are dynamic
          async (args: Record<string, unknown>) => {
            const toolCallId = crypto.randomUUID();

            // Emit tool-call BEFORE execution so frontend shows it in-progress
            streamController?.enqueue({
              type: "tool-call",
              toolCallId,
              toolName: t.name,
              input: JSON.stringify(args),
              providerExecuted: true,
            });

            // Record callbackMode directly from args - stream-part-handler may not
            // have processed the tool-call event yet, so ctx flags aren't reliable here.
            const callbackMode =
              typeof args["callbackMode"] === "string"
                ? args["callbackMode"]
                : null;
            if (callbackMode) {
              toolExecutors.batchStopModes.add(callbackMode);
            }

            logger.debug("[AnthropicAgent] MCP handler invoked", {
              toolName: t.name,
              toolCallId,
              callbackMode,
              batchRemaining: toolExecutors.batchRemaining,
              batchStopModes: [...toolExecutors.batchStopModes],
            });

            // approve tools must NOT execute - stream-part-handler emits TOOL_WAITING
            // and the user confirms separately. Return a placeholder so the Agent SDK
            // gets a result (which we'll discard via abort anyway).
            const isApprove = callbackMode === "approve";

            const { isLastInBatch, ...executionResult } = isApprove
              ? {
                  // eslint-disable-next-line i18next/no-literal-string -- placeholder for approve tools
                  content: [
                    { type: "text" as const, text: "awaiting confirmation" },
                  ],
                  isLastInBatch: toolExecutors.consumeOne(),
                }
              : await toolExecutors.execute(t.name, args, logger, toolCallId);

            // Emit tool-result AFTER execution so frontend updates with result
            streamController?.enqueue({
              type: "tool-result",
              toolCallId,
              toolName: t.name,
              result: executionResult.content[0]?.text ?? "",
            });

            // Only abort after the full parallel batch completes (isLastInBatch).
            // Check stop modes directly from args (not ctx) - ctx flags may not be
            // set yet since stream-part-handler runs asynchronously.
            const stopModes = toolExecutors.batchStopModes;
            const shouldStop =
              stopModes.has("endLoop") || stopModes.has("approve");
            if (isLastInBatch && shouldStop) {
              logger.info(
                "[AnthropicAgent] Stop condition met after batch - aborting agent loop",
                { toolName: t.name, toolCallId, stopModes: [...stopModes] },
              );
              agentAbortController.abort();
            }

            return executionResult;
          },
        );
      });

    // Create MCP server with our tools
    const vibeServer = createSdkMcpServer({
      // eslint-disable-next-line i18next/no-literal-string -- technical identifier
      name: "vibe-local",
      // eslint-disable-next-line i18next/no-literal-string -- semver
      version: "1.0.0",
      tools: mcpTools,
    });

    const allowedToolNames = mcpTools.map(
      // eslint-disable-next-line i18next/no-literal-string -- MCP naming convention
      (t) => `mcp__vibe-local__${t.name}`,
    );

    const agentAbortController = new AbortController();
    if (abortSignal) {
      abortSignal.addEventListener("abort", () => agentAbortController.abort());
    }

    const modelId = this.modelId;

    // Create a ReadableStream that maps Agent SDK events to LanguageModelV2StreamPart
    const stream = new ReadableStream<LanguageModelV2StreamPart>({
      async start(controller): Promise<void> {
        // Expose controller to MCP handlers so they can emit tool events in real-time
        streamController = controller;
        // Log full prompt in verbose mode so we can diagnose what the AI actually received.
        // Placed here (inside start()) so it fires when the stream is actually consumed,
        // not just when doStream() returns the stream object (which may be lazy in the AI SDK).
        logProviderRequest(
          "claude-code",
          JSON.stringify(
            {
              systemPrompt,
              userPrompt,
              tools: mcpTools.map((t) => t.name),
            },
            null,
            2,
          ),
        );

        let totalInputTokens = 0;
        let totalOutputTokens = 0;
        let totalCachedTokens = 0;
        let totalCacheWriteTokens = 0;
        let finishReason: LanguageModelV2FinishReason = "other";
        let textBlockId = 0;
        let hasStartedText = false;
        /** Current text block id - stable across deltas within the same block */
        let currentTextId = "";
        /** Track current reasoning block id for emitting reasoning-end */
        let currentReasoningId = "";
        let isInReasoningBlock = false;

        // Build env without CLAUDECODE / CLAUDE_CODE_ENTRYPOINT so the nested-session
        // guard doesn't fire when running inside a Claude Code session.
        // Must omit keys entirely - setting to undefined is ignored by the SDK merge.
        const { CLAUDECODE, CLAUDE_CODE_ENTRYPOINT, ...agentEnv } = process.env;
        void CLAUDECODE;
        void CLAUDE_CODE_ENTRYPOINT;

        try {
          const agentQuery = query({
            prompt: userPrompt,
            options: {
              abortController: agentAbortController,
              model: modelId,
              systemPrompt,
              tools: [],
              mcpServers: {
                // eslint-disable-next-line i18next/no-literal-string -- MCP server name
                "vibe-tools": vibeServer,
              },
              allowedTools: allowedToolNames,
              permissionMode: "bypassPermissions",
              allowDangerouslySkipPermissions: true,
              persistSession: false,
              settingSources: [],
              thinking: { type: "adaptive" },
              includePartialMessages: true,
              stderr: (data: string) => {
                logger.warn("[AnthropicAgent] stderr", { data });
              },
              env: agentEnv,
            },
          });

          // Emit stream-start
          controller.enqueue({
            type: "stream-start",
            warnings: [],
          });

          for await (const message of agentQuery) {
            if (agentAbortController.signal.aborted) {
              break;
            }

            switch (message.type) {
              case "stream_event": {
                const event = message.event;

                // Handle content_block_start - track block type and allocate ids
                if (event.type === "content_block_start") {
                  if (event.content_block.type === "text") {
                    currentTextId = `text-${textBlockId++}`;
                    hasStartedText = true;
                  } else if (event.content_block.type === "thinking") {
                    currentReasoningId = `reasoning-${event.index}`;
                    isInReasoningBlock = true;
                  }
                }

                // Handle content_block_stop - emit reasoning-end / text-end
                if (event.type === "content_block_stop") {
                  if (isInReasoningBlock) {
                    controller.enqueue({
                      type: "reasoning-end",
                      id: currentReasoningId,
                    });
                    isInReasoningBlock = false;
                  }
                  // text-end is emitted in the "assistant" case below
                }

                // Map BetaRawMessageStreamEvent to LanguageModelV2StreamPart
                // Pass the stable currentTextId so all deltas in a block share the same id
                const parts = mapStreamEvent(
                  event,
                  currentTextId,
                  currentReasoningId,
                );
                for (const part of parts) {
                  controller.enqueue(part);
                }
                break;
              }

              case "assistant": {
                // Accumulate usage from complete messages
                const msg = message.message;
                // Count tool_use blocks so the registry knows batch size before
                // any MCP handlers fire - needed for isLastInBatch accuracy.
                const toolUseCount = msg.content.filter(
                  (b) => b.type === "tool_use",
                ).length;
                if (toolUseCount > 0) {
                  toolExecutors.setBatchSize(toolUseCount);
                }
                if (msg.usage) {
                  totalInputTokens += msg.usage.input_tokens;
                  totalOutputTokens += msg.usage.output_tokens;
                  const extUsage = msg.usage as typeof msg.usage & {
                    cache_read_input_tokens?: number;
                    cache_creation_input_tokens?: number;
                  };
                  totalCachedTokens += extUsage.cache_read_input_tokens ?? 0;
                  totalCacheWriteTokens +=
                    extUsage.cache_creation_input_tokens ?? 0;
                }
                finishReason =
                  msg.stop_reason === "tool_use" ? "tool-calls" : "stop";

                // End any open text block from streaming
                if (hasStartedText) {
                  controller.enqueue({
                    type: "text-end",
                    id: currentTextId,
                  });
                  hasStartedText = false;
                }
                break;
              }

              case "result": {
                // Final result - override totals
                if (message.usage) {
                  totalInputTokens = message.usage.input_tokens;
                  totalOutputTokens = message.usage.output_tokens;
                  totalCachedTokens =
                    message.usage.cache_read_input_tokens ?? 0;
                  totalCacheWriteTokens =
                    message.usage.cache_creation_input_tokens ?? 0;
                }
                finishReason = message.subtype === "success" ? "stop" : "error";
                break;
              }

              default:
                // Ignore system, tool_progress, auth_status, etc.
                break;
            }
          }

          // Emit finish - include cache write tokens in providerMetadata
          // since LanguageModelV2Usage doesn't have inputTokenDetails
          controller.enqueue({
            type: "finish",
            usage: {
              inputTokens: totalInputTokens,
              outputTokens: totalOutputTokens,
              totalTokens: totalInputTokens + totalOutputTokens,
              cachedInputTokens: totalCachedTokens,
            },
            finishReason,
            providerMetadata: {
              "claude-code": { cacheWriteTokens: totalCacheWriteTokens },
            },
          });
        } catch (error) {
          if (
            error instanceof Error &&
            (error.name === "AbortError" || error.message.includes("aborted"))
          ) {
            // Normal abort
            controller.enqueue({
              type: "finish",
              usage: {
                inputTokens: totalInputTokens,
                outputTokens: totalOutputTokens,
                totalTokens: totalInputTokens + totalOutputTokens,
                cachedInputTokens: totalCachedTokens,
              },
              finishReason: "other",
              providerMetadata: {
                "claude-code": { cacheWriteTokens: totalCacheWriteTokens },
              },
            });
          } else {
            logger.error("[AnthropicAgent] Stream error", {
              error: error instanceof Error ? error.message : String(error),
            });
            controller.enqueue({
              type: "error",
              error,
            });
          }
        } finally {
          controller.close();
        }
      },
    });

    return { stream };
  }
}

/**
 * Convert a LanguageModelV2ToolResultOutput to a plain text string
 * for inclusion in the claude-code Agent SDK text prompt.
 */
function toolResultOutputToText(
  output: LanguageModelV2ToolResultOutput,
): string {
  switch (output.type) {
    case "text":
      return output.value;
    case "json":
      return JSON.stringify(output.value, null, 2);
    case "error-text":
      return output.value;
    case "error-json":
      return JSON.stringify(output.value, null, 2);
    default:
      return JSON.stringify(output, null, 2);
  }
}

/**
 * Extract system prompt and user prompt from AI SDK prompt format
 */
function extractPromptParts(prompt: LanguageModelV2CallOptions["prompt"]): {
  systemPrompt: string;
  userPrompt: string;
} {
  let systemPrompt = "";
  const userParts: string[] = [];

  for (const message of prompt) {
    if (message.role === "system") {
      systemPrompt += message.content;
    } else if (message.role === "user") {
      for (const part of message.content) {
        if (part.type === "text") {
          userParts.push(part.text);
        }
      }
    } else if (message.role === "assistant") {
      for (const part of message.content) {
        if (part.type === "text") {
          // Include assistant context as part of the prompt
          userParts.push(part.text);
        }
        // tool-call parts are handled by tool-result below - no text to extract
      }
    } else if (message.role === "tool") {
      // Tool results must be included as text context so the Agent SDK knows
      // the tool already ran and can respond naturally without re-calling it.
      for (const part of message.content) {
        if (part.type === "tool-result") {
          const resultText = toolResultOutputToText(part.output);
          // eslint-disable-next-line i18next/no-literal-string -- technical context label
          userParts.push(`[Tool result for ${part.toolName}]:\n${resultText}`);
        }
      }
    }
  }

  return {
    systemPrompt,
    // eslint-disable-next-line i18next/no-literal-string -- fallback prompt
    userPrompt: userParts.join("\n") || "Hello",
  };
}

/**
 * Map a BetaRawMessageStreamEvent to LanguageModelV2StreamPart events.
 * Emits text and reasoning streaming events. Tool_use blocks are handled
 * separately via MCP handler and emitted as tool-call/tool-result.
 */
function mapStreamEvent(
  event: BetaRawMessageStreamEvent,
  /** Stable text block id - shared across all deltas within one content block */
  textId: string,
  /** Stable reasoning block id - shared across all deltas within one reasoning block */
  reasoningId: string,
): LanguageModelV2StreamPart[] {
  const parts: LanguageModelV2StreamPart[] = [];

  switch (event.type) {
    case "content_block_start": {
      const block = event.content_block;
      if (block.type === "thinking") {
        parts.push({ type: "reasoning-start", id: reasoningId });
      } else if (block.type === "text") {
        parts.push({ type: "text-start", id: textId });
      }
      break;
    }

    case "content_block_delta": {
      const delta = event.delta;
      if (delta.type === "text_delta") {
        parts.push({
          type: "text-delta",
          id: textId,
          delta: delta.text,
        });
      } else if (delta.type === "thinking_delta") {
        const thinkingContent = (
          delta as { type: "thinking_delta"; thinking: string }
        ).thinking;
        parts.push({
          type: "reasoning-delta",
          id: reasoningId,
          delta: thinkingContent,
        });
      }
      break;
    }

    case "content_block_stop":
    case "message_delta":
    default:
      break;
  }

  return parts;
}

/**
 * Convert JSON Schema to Zod v4 raw shape for Agent SDK tool definitions
 */
function jsonSchemaToZodV4Shape(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod v4 module type
  z4: any,
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- JSON Schema is untyped by nature
  schema: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod raw shape
): Record<string, any> {
  if (schema.type !== "object" || !schema.properties) {
    return {};
  }

  /* eslint-disable oxlint-plugin-restricted/restricted-syntax -- JSON Schema properties are untyped */
  const properties = schema.properties as Record<
    string,
    Record<string, unknown>
  >;
  /* eslint-enable oxlint-plugin-restricted/restricted-syntax */
  const required = (schema.required as string[]) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod raw shape
  const shape: Record<string, any> = {};

  for (const [key, prop] of Object.entries(properties)) {
    const isRequired = required.includes(key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod type inference
    let zodType: any;

    switch (prop.type) {
      case "string":
        zodType = prop.enum
          ? z4.enum(prop.enum as [string, ...string[]])
          : z4.string();
        break;
      case "number":
      case "integer":
        zodType = z4.number();
        break;
      case "boolean":
        zodType = z4.boolean();
        break;
      case "array":
        zodType = z4.array(z4.any());
        break;
      case "object":
        zodType = z4.record(z4.string(), z4.any());
        break;
      default:
        zodType = z4.any();
        break;
    }

    if (prop.description && typeof zodType.describe === "function") {
      zodType = zodType.describe(prop.description as string);
    }

    shape[key] = isRequired ? zodType : zodType.optional();
  }

  return shape;
}
