/**
 * UnbottledStreamHandler - Executes AI stream via unbottled.ai cloud relay.
 *
 * Instead of calling AI SDK's streamText() locally, this handler:
 * 1. POSTs to unbottled.ai's ws-provider/stream endpoint
 * 2. Opens a WebSocket to unbottled.ai's WS server
 * 3. Subscribes to the remote thread's messages channel
 * 4. Relays events to the local WS channel via MessageDbWriter (DB + WS in one)
 *
 * The cloud side runs the full AI stream (including tool execution).
 * The self-hosted instance acts as a transparent relay, writing all messages
 * locally as duplicates via MessageDbWriter.
 *
 * Multi-turn tool loops are fully supported: each assistant → tool → assistant
 * cycle creates a fresh local message with correct parent chain.
 */

import "server-only";

import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { WsWireMessage } from "@/app/api/[locale]/system/unified-interface/websocket/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { ChatMessageRole } from "../../../chat/enum";
import type { WsEmitCallback } from "../../../chat/threads/[threadId]/messages/emitter";
import type { ToolCall } from "../../../chat/db";
import type { UnbottledCloudSession } from "../../../env";
import type { ChatModelId, ChatModelOption } from "../../models";
import type { AiStreamT } from "../../stream/i18n";
import type { MessageDbWriter } from "../core/message-db-writer";

interface UnbottledStreamParams {
  session: UnbottledCloudSession;
  modelConfig: ChatModelOption;
  content: string;
  threadId: string;
  aiMessageId: string;
  userMessageId: string;
  parentMessageId: string | null;
  model: ChatModelId;
  skill: string;
  sequenceId: string | null;
  userId: string | undefined;
  user: JwtPayloadType;
  isIncognito: boolean;
  streamAbortController: AbortController;
  logger: EndpointLogger;
  timezone: string;
  locale: CountryLanguage;
  t: AiStreamT;
  dbWriter: MessageDbWriter;
  wsEmit: WsEmitCallback;
  /** Stream context for local tool execution (used when remote sends TOOL_EXECUTE_REQUEST) */
  streamContext: ToolExecutionContext;
}

/**
 * Execute an AI stream via unbottled.ai cloud.
 * This replaces StreamExecutionHandler.executeStream() when the model
 * uses ApiProvider.UNBOTTLED.
 */
export async function executeUnbottledStream(
  params: UnbottledStreamParams,
): Promise<void> {
  const {
    session,
    modelConfig,
    content,
    threadId,
    aiMessageId,
    userMessageId,
    model,
    skill,
    sequenceId,
    userId,
    user,
    isIncognito,
    streamAbortController,
    logger,
    timezone,
    locale,
    t,
    dbWriter,
    wsEmit,
    streamContext,
  } = params;

  // Self-relay: when the remote URL points at ourselves, run the AI stream
  // in-process instead of HTTP+WS. Avoids needing a running server for tests
  // and supports the "use yourself as unbottled provider" scenario.
  const { env } = await import("@/config/env");
  const localUrl = env.NEXT_PUBLIC_APP_URL;
  if (
    session.remoteUrl === localUrl ||
    session.remoteUrl.replace(/\/$/, "") === localUrl.replace(/\/$/, "")
  ) {
    await executeSelfRelay(params);
    return;
  }

  // 1. POST to cloud's ws-provider/stream
  const streamUrl = `${session.remoteUrl}/api/${defaultLocale}/agent/ai-stream/ws-provider/stream`;

  logger.debug("[Unbottled] Starting cloud stream", {
    model,
    remoteUrl: session.remoteUrl,
  });

  let streamResult: {
    success: boolean;
    data?: { responseThreadId: string; messageId: string };
    message?: string;
  };

  try {
    const streamResponse = await fetch(streamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${session.token}${BEARER_LEAD_ID_SEPARATOR}${session.leadId}`,
      },
      body: JSON.stringify({
        content,
        model: modelConfig.providerModel,
        skill,
        timezone,
        // Pass the local thread ID as the remote thread ID so all turns
        // (T1–T12) share a single thread on the remote side.
        // The remote creates the thread on first use; subsequent calls append.
        threadId,
        instanceId: threadId,
      }),
      signal: streamAbortController.signal,
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse
        .text()
        .catch(() => "Unknown error");
      logger.error("[Unbottled] Cloud stream POST failed", {
        status: streamResponse.status,
        error: errorText,
      });
      dbWriter.emitError(
        fail({
          message: t("route.errors.streamCreationFailed"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        }),
      );
      return;
    }

    streamResult = (await streamResponse.json()) as typeof streamResult;
  } catch (fetchErr) {
    if (streamAbortController.signal.aborted) {
      return;
    }
    logger.error("[Unbottled] Cloud stream fetch error", {
      error: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
    });
    dbWriter.emitError(
      fail({
        message: t("route.errors.streamCreationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      }),
    );
    return;
  }

  if (!streamResult.success || !streamResult.data) {
    logger.error("[Unbottled] Cloud stream returned failure", {
      message: streamResult.message,
    });
    dbWriter.emitError(
      fail({
        message: t("route.errors.streamCreationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      }),
    );
    return;
  }

  const remoteThreadId = streamResult.data.responseThreadId;
  logger.debug("[Unbottled] Cloud stream started", {
    remoteThreadId,
    remoteMessageId: streamResult.data.messageId,
  });

  // 2. Connect to cloud's WebSocket and subscribe to remote thread's messages
  // Auth via query params - the cloud's WS server accepts token+leadId as URL params.
  const remoteChannel = `agent/chat/threads/${remoteThreadId}/messages`;
  const wsProtocol = session.remoteUrl.startsWith("https://") ? "wss:" : "ws:";
  const wsHost = session.remoteUrl.replace(/^https?:\/\//, "");
  const wsUrl = `${wsProtocol}//${wsHost}/ws?channel=${encodeURIComponent(remoteChannel)}&token=${encodeURIComponent(session.token)}&leadId=${encodeURIComponent(session.leadId)}`;

  /**
   * Execute a tool locally and broadcast the result back to the remote /ws/broadcast.
   * Defined outside the Promise constructor so the linter doesn't mistake fetch() for
   * a Promise resolve call (eslint-plugin-promise/no-multiple-resolved false positive).
   */
  async function executeAndBroadcastToolResult(
    callId: string,
    toolName: string,
    args: WidgetData,
    remoteBroadcastUrl: string,
    channel: string,
  ): Promise<void> {
    let toolResult: WidgetData;
    let toolError: string | undefined;
    try {
      const { RouteExecutionExecutor } =
        await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");
      const result = await RouteExecutionExecutor.executeGenericHandler<
        Record<string, WidgetData>
      >({
        toolName,
        data: (args as Record<string, WidgetData>) ?? {},
        user,
        locale,
        logger,
        platform: Platform.AI,
        streamContext,
      });
      if (result.success) {
        toolResult = result.data ?? {};
      } else {
        toolResult = {};
        toolError = result.message ?? "Tool execution failed";
      }
    } catch (execErr) {
      toolResult = {};
      toolError = execErr instanceof Error ? execErr.message : String(execErr);
    }

    const resultData: { callId: string; result: WidgetData; error?: string } =
      toolError
        ? { callId, result: toolResult, error: toolError }
        : { callId, result: toolResult };

    try {
      await fetch(remoteBroadcastUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${session.token}${BEARER_LEAD_ID_SEPARATOR}${session.leadId}`,
        },
        body: JSON.stringify({
          channel,
          event: "tool-execute-result",
          data: resultData,
        }),
      });
      logger.debug("[Unbottled] Tool result broadcast to remote", {
        toolName,
        callId,
      });
    } catch (broadcastErr) {
      logger.warn("[Unbottled] Failed to broadcast tool result to remote", {
        toolName,
        callId,
        error:
          broadcastErr instanceof Error
            ? broadcastErr.message
            : String(broadcastErr),
      });
    }
  }

  return new Promise<void>((resolve) => {
    // Server-provided IDs are used verbatim — no local remapping.
    // The remote generates all message and tool call IDs; clients store them as-is.
    // Sync is trivial: identical IDs mean identical state across platforms.
    const seenMessageIds = new Set<string>();

    // Multi-turn state: tracks the current assistant message in tool loops.
    let currentAssistantId = aiMessageId;
    let currentAssistantContent = "";
    let firstAssistantCreated = false;
    // Tracks the last tool message ID so subsequent assistant messages parent to it
    let lastToolMessageId: string | null = null;

    const ws = new WebSocket(wsUrl);

    // Serialize async event handlers so CREDITS_DEDUCTED always completes
    // before STREAM_FINISHED calls finish(). Without this, fire-and-forget
    // void calls can race: stream-finished resolves while credit deduction
    // is still awaiting the DB, leaving totalCreditsDeducted = 0.
    let eventQueue = Promise.resolve();
    const enqueueEvent = (msg: WsWireMessage): void => {
      eventQueue = eventQueue
        .then(() => handleRemoteEvent(msg))
        .catch((err) => {
          logger.warn("[Unbottled] Event handler error", {
            event: msg.event,
            error: err instanceof Error ? err.message : String(err),
          });
        });
    };

    let finished = false;
    const finish = (): void => {
      try {
        ws.close();
      } catch {
        // Already closed
      }
      if (finished) {
        return;
      }
      finished = true;
      // Drain the event queue before resolving so all async handlers
      // (e.g. CREDITS_DEDUCTED DB write) complete before the stream ends.
      void eventQueue.then(resolve);
    };

    // Abort handler
    const onAbort = (): void => {
      logger.debug("[Unbottled] Stream aborted, closing cloud WS");
      finish();
    };
    streamAbortController.signal.addEventListener("abort", onAbort, {
      once: true,
    });

    // Connection timeout
    const wsTimeout = setTimeout(() => {
      logger.warn("[Unbottled] WS connection timeout (120s)");
      finish();
    }, 120_000);

    ws.addEventListener("open", () => {
      logger.debug("[Unbottled] WS connected to cloud");
      clearTimeout(wsTimeout);

      // Subscribe to remote messages channel
      ws.send(JSON.stringify({ type: "subscribe", channel: remoteChannel }));
    });

    ws.addEventListener("message", (wsEvent) => {
      try {
        const msg = JSON.parse(
          typeof wsEvent.data === "string"
            ? wsEvent.data
            : new TextDecoder().decode(wsEvent.data as ArrayBuffer),
        ) as WsWireMessage;

        if (msg.channel !== remoteChannel) {
          return;
        }

        enqueueEvent(msg);
      } catch (parseErr) {
        logger.warn("[Unbottled] Failed to parse WS message", {
          error:
            parseErr instanceof Error ? parseErr.message : String(parseErr),
        });
      }
    });

    ws.addEventListener("error", (wsEvent) => {
      logger.error("[Unbottled] WS error", { error: String(wsEvent) });
      clearTimeout(wsTimeout);
      finish();
    });

    ws.addEventListener("close", () => {
      logger.debug("[Unbottled] WS closed");
      clearTimeout(wsTimeout);
      streamAbortController.signal.removeEventListener("abort", onAbort);
      finish();
    });

    /**
     * Create a local assistant message (MESSAGE_CREATED + DB insert).
     * Used for the first assistant message and each subsequent one in tool loops.
     */
    async function createAssistantMessage(
      messageId: string,
      localParentId: string | null,
    ): Promise<void> {
      if (!isIncognito) {
        await dbWriter.emitMessageCreated({
          messageId,
          threadId,
          content: "",
          parentId: localParentId ?? userMessageId,
          userId,
          model,
          skill,
          sequenceId,
        });
      } else {
        // Incognito: emit WS event only, no DB write
        wsEmit("message-created", {
          messages: [
            {
              id: messageId,
              threadId,
              role: ChatMessageRole.ASSISTANT,
              isAI: true,
              content: "",
              parentId: localParentId ?? userMessageId,
              sequenceId,
              model,
              skill,
              metadata: null,
            },
          ],
          streamingState: "streaming",
        });
      }
    }

    async function handleRemoteEvent(msg: WsWireMessage): Promise<void> {
      // The remote emitter wraps all events in response-shaped partials.
      // We extract data from the wrapper before processing.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = msg.data as Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type RawRecord = Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firstMsg: RawRecord | undefined = Array.isArray(raw.messages)
        ? (raw.messages[0] as RawRecord)
        : undefined;

      switch (msg.event) {
        case "message-created": {
          // Remote shape: { streamingState, messages: [{ id, threadId, role, content, parentId, sequenceId, model, skill, metadata: { toolCall? } }] }
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const role = firstMsg.role as ChatMessageRole;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const toolCall = firstMsg.metadata?.toolCall as ToolCall | undefined;
          // Deduplicate: skip if we already processed this ID
          if (seenMessageIds.has(remoteId)) {
            break;
          }
          seenMessageIds.add(remoteId);
          if (role === ChatMessageRole.ASSISTANT) {
            if (!firstAssistantCreated) {
              // First assistant message — use server-provided ID directly.
              firstAssistantCreated = true;
              currentAssistantId = remoteId;
              currentAssistantContent = "";
              await createAssistantMessage(remoteId, userMessageId);
            } else {
              // Subsequent assistant in a tool loop — server ID, parent = last tool message
              currentAssistantId = remoteId;
              currentAssistantContent = "";
              await createAssistantMessage(
                remoteId,
                lastToolMessageId ?? currentAssistantId,
              );
            }
          } else if (role === ChatMessageRole.TOOL && toolCall) {
            // Tool message from cloud — use server-provided ID directly.
            lastToolMessageId = remoteId;

            if (!isIncognito) {
              await dbWriter.emitToolCall({
                toolMessageId: remoteId,
                threadId,
                parentId: currentAssistantId,
                userId,
                model,
                skill,
                sequenceId,
                toolCall,
              });
            } else {
              // Incognito: emit message-created for tool role
              wsEmit("message-created", {
                streamingState: "streaming",
                messages: [
                  {
                    id: remoteId,
                    threadId,
                    role: ChatMessageRole.TOOL,
                    isAI: true,
                    content: null,
                    parentId: currentAssistantId,
                    sequenceId,
                    model,
                    skill,
                    metadata: { toolCall },
                  },
                ],
              });
            }
          }
          break;
        }

        case "content-delta": {
          // Remote shape: { messages: [{ id: messageId, content: delta }] }
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const delta = (firstMsg.content ?? "") as string;
          currentAssistantContent += delta;

          // If we get a delta before MESSAGE_CREATED (rare edge case), create the message
          if (!firstAssistantCreated) {
            firstAssistantCreated = true;
            currentAssistantId = remoteId;
            currentAssistantContent = delta;
            await createAssistantMessage(remoteId, userMessageId);
          }

          // Emit CONTENT_DELTA SSE + schedule throttled DB update
          dbWriter.emitDeltaAndSchedule(
            remoteId,
            delta,
            currentAssistantContent,
          );
          break;
        }

        case "content-done": {
          // Remote shape: { messages: [{ id, content, metadata: { totalTokens, finishReason, isStreaming } }] }
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const doneContent = (firstMsg.content ?? "") as string;
          const totalTokens =
            (firstMsg.metadata?.totalTokens as number | null | undefined) ??
            null;
          const finishReason =
            (firstMsg.metadata?.finishReason as string | null | undefined) ??
            null;
          currentAssistantContent = doneContent;

          // Emit CONTENT_DONE SSE + flush DB + write token metadata
          await dbWriter.emitContentDone({
            messageId: remoteId,
            content: doneContent,
            totalTokens,
            finishReason,
            promptTokens: null,
            completionTokens: null,
          });
          break;
        }

        case "tool-call": {
          // Remote shape: {} (empty — informational only, no message data available)
          // Tool call handling is done in MESSAGE_CREATED for TOOL role.
          break;
        }

        case "tool-execute-request": {
          // Bidirectional tool execution: remote asks local to execute a tool.
          // Remote shape: { callId, toolName, args }
          const execData = raw as {
            callId: string;
            toolName: string;
            args: WidgetData;
          };
          const { callId, toolName, args } = execData;
          if (!callId || !toolName) {
            logger.warn(
              "[Unbottled] TOOL_EXECUTE_REQUEST missing callId/toolName",
              { callId, toolName },
            );
            break;
          }
          logger.debug("[Unbottled] Executing tool locally for remote", {
            toolName,
            callId,
          });

          // Execute async outside the event queue so other events aren't blocked.
          void executeAndBroadcastToolResult(
            callId,
            toolName,
            args,
            `${session.remoteUrl}/ws/broadcast`,
            remoteChannel,
          );
          break;
        }

        case "tool-result": {
          // Remote shape: { messages: [{ id, metadata: { toolCall } }] } or {}
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const toolCall = firstMsg.metadata?.toolCall as ToolCall | undefined;
          if (toolCall) {
            if (!isIncognito) {
              // Use dbWriter: updates DB + emits TOOL_RESULT SSE
              await dbWriter.emitToolResult({
                toolMessageId: remoteId,
                threadId,
                parentId: currentAssistantId,
                userId,
                model,
                skill,
                sequenceId,
                toolCall,
                toolName: toolCall.toolName,
                result: toolCall.result,
                error: undefined,
                user,
              });
            } else {
              wsEmit("tool-result", {
                messages: [
                  {
                    id: remoteId,
                    metadata: { toolCall },
                  },
                ],
              });
            }
          }
          break;
        }

        case "reasoning-delta": {
          // Remote shape: { messages: [{ id, content: delta }] }
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const delta = (firstMsg.content ?? "") as string;
          wsEmit("reasoning-delta", {
            messages: [{ id: remoteId, content: delta }],
          });
          break;
        }

        case "reasoning-done": {
          // Remote shape: { messages: [{ id, content }] }
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const reasoningContent = (firstMsg.content ?? "") as string;
          wsEmit("reasoning-done", {
            messages: [{ id: remoteId, content: reasoningContent }],
          });
          break;
        }

        case "credits-deducted": {
          // Remote shape: { amount, feature, type, partial } (raw fields, no messages wrapper)
          const amount = (raw.amount as number | undefined) ?? 0;
          // Deduct credits locally - the cloud already charged its own credits,
          // but the self-hosted instance needs to track local credit usage too.
          await dbWriter.deductAndEmitCredits({
            user,
            amount,
            feature: model,
            type: "model",
            model,
          });
          break;
        }

        case "tokens-updated": {
          // Remote shape: { messages: [{ id, metadata: { promptTokens, completionTokens, ... } }] }
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const meta = (firstMsg.metadata ?? {}) as Record<
            string,
            number | null | undefined
          >;
          const promptTokens = (meta.promptTokens as number | undefined) ?? 0;
          const completionTokens =
            (meta.completionTokens as number | undefined) ?? 0;
          const totalTokens = (meta.totalTokens as number | undefined) ?? 0;
          const cachedInputTokens =
            (meta.cachedInputTokens as number | undefined) ?? 0;
          const cacheWriteTokens =
            (meta.cacheWriteTokens as number | undefined) ?? 0;
          const timeToFirstToken =
            (meta.timeToFirstToken as number | null | undefined) ?? null;
          const finishReason =
            (meta.finishReason as string | null | undefined) ?? null;
          const creditCost = (meta.creditCost as number | undefined) ?? 0;

          // Write token metadata to local DB
          if (!isIncognito) {
            await dbWriter.writeTokenMetadataOnly(remoteId, {
              promptTokens,
              completionTokens,
              finishReason,
              cachedInputTokens,
              cacheWriteTokens,
              timeToFirstToken,
              creditCost,
            });
          }

          wsEmit("tokens-updated", {
            messages: [
              {
                id: remoteId,
                metadata: {
                  promptTokens,
                  completionTokens,
                  totalTokens,
                  cachedInputTokens,
                  cacheWriteTokens,
                  timeToFirstToken: timeToFirstToken ?? undefined,
                  finishReason: finishReason ?? undefined,
                  creditCost,
                },
              },
            ],
          });
          break;
        }

        case "generated-media-added": {
          // Remote shape: { messages: [{ id, metadata: { generatedMedia } }] }
          if (!firstMsg) {
            break;
          }
          const remoteId = firstMsg.id as string;
          const generatedMedia = firstMsg.metadata?.generatedMedia as
            | {
                type: "image" | "audio" | "video";
                url: string | undefined;
                prompt: string;
                modelId: string;
                mimeType: string;
                creditCost: number;
                status: "complete" | "pending" | "failed";
              }
            | undefined;
          if (generatedMedia) {
            if (!isIncognito) {
              // Use dbWriter: emits SSE + updates DB metadata
              await dbWriter.emitGeneratedMediaOnExistingMessage({
                messageId: remoteId,
                generatedMedia,
              });
            } else {
              wsEmit("generated-media-added", {
                messages: [{ id: remoteId, metadata: { generatedMedia } }],
              });
            }
          }
          break;
        }

        case "error": {
          // Remote shape: { message, errorType } (raw fields)
          const data = msg.data as ErrorResponseType;
          logger.error("[Unbottled] Error from cloud", {
            error: data.message,
          });
          // Persist error as a chat message so it survives refresh
          if (!isIncognito && userId) {
            await dbWriter.emitErrorMessage({
              threadId,
              errorType: "UNBOTTLED_CLOUD_ERROR",
              error: data,
              parentId: currentAssistantId,
              sequenceId,
              user,
            });
          } else {
            dbWriter.emitError(data);
          }
          break;
        }

        case "stream-finished": {
          // Remote shape: { threadId, reason, finalState, streamingState } (raw fields)
          const reason =
            (raw.reason as "completed" | "cancelled" | "error" | "timeout") ??
            "completed";
          logger.debug("[Unbottled] Cloud stream finished", { reason });

          // Flush all pending throttled DB writes
          if (!isIncognito) {
            await dbWriter.flushAll();
          }

          finish();
          break;
        }

        default:
          // Pass through any other events by re-emitting on local channel
          logger.debug(`[Unbottled] Unhandled event type: ${msg.event}`);
          break;
      }
    }
  });
}

/**
 * Self-relay: run the AI stream in-process using the underlying model.
 * Used when session.remoteUrl points at the local instance.
 * Runs headless with threadMode "none" (no extra DB writes on the "remote" side),
 * then relays the result through dbWriter on the caller's thread.
 */
async function executeSelfRelay(params: UnbottledStreamParams): Promise<void> {
  const {
    modelConfig,
    content,
    aiMessageId,
    userMessageId,
    model,
    skill,
    sequenceId,
    userId,
    user,
    isIncognito,
    logger,
    locale,
    t,
    dbWriter,
    wsEmit,
  } = params;

  const { runHeadlessAiStream } = await import("../headless");
  const { DefaultFolderId } =
    await import("@/app/api/[locale]/agent/chat/config");
  const { NO_SKILL_ID } =
    await import("@/app/api/[locale]/agent/chat/skills/constants");

  // The providerModel is the model ID the UNBOTTLED remote recognises.
  // For self-relay this is our own instance, so we need to resolve it back
  // to a non-UNBOTTLED provider to avoid infinite recursion.
  const underlyingModel = modelConfig.providerModel as ChatModelId;

  // Temporarily restore the original (non-UNBOTTLED) provider for the inner
  // call so it doesn't re-enter the UNBOTTLED handler and loop forever.
  const { chatModelOptionsIndex, chatModelDefinitions } =
    await import("../../models");
  const { ApiProvider } =
    await import("@/app/api/[locale]/agent/models/models");
  const currentEntry = chatModelOptionsIndex[underlyingModel];
  const savedApiProvider = currentEntry?.apiProvider;
  const savedProviderModel = currentEntry?.providerModel;
  if (currentEntry?.apiProvider === ApiProvider.UNBOTTLED) {
    const def = chatModelDefinitions[underlyingModel];
    const originalProvider = def?.providers.find(
      (p) => p.apiProvider !== ApiProvider.UNBOTTLED,
    );
    if (originalProvider) {
      // Swap routing fields so the inner call uses the real provider
      currentEntry.apiProvider = originalProvider.apiProvider;
      currentEntry.providerModel = originalProvider.providerModel;
    }
  }

  logger.debug("[Unbottled] Self-relay mode - running in-process", {
    model,
    underlyingModel,
  });

  // Run the stream headless with no DB persistence on the "remote" side.
  // We persist locally through dbWriter instead.
  let result;
  try {
    result = await runHeadlessAiStream({
      model: underlyingModel,
      skill: skill || NO_SKILL_ID,
      prompt: content,
      rootFolderId: DefaultFolderId.INCOGNITO,
      subAgentDepth: params.streamContext.subAgentDepth,
      user,
      locale,
      logger,
      t,
      abortSignal: params.streamAbortController.signal,
    });
  } finally {
    // Restore the UNBOTTLED routing fields
    if (
      currentEntry &&
      savedApiProvider !== undefined &&
      savedProviderModel !== undefined
    ) {
      currentEntry.apiProvider = savedApiProvider;
      currentEntry.providerModel = savedProviderModel;
    }
  }

  if (!result.success) {
    logger.error("[Unbottled] Self-relay headless stream failed", {
      message: result.message,
    });
    await dbWriter.emitErrorMessage({
      threadId: params.threadId,
      errorType: "UNBOTTLED_SELF_RELAY_ERROR",
      error: result,
      parentId: aiMessageId,
      sequenceId,
      user,
    });
    return;
  }

  const responseContent = result.data.lastAiMessageContent ?? "";
  const creditsDeducted = result.data.totalCreditsDeducted ?? 0;

  // Create the local assistant message.
  // The AI message is always parented to the user message (not the previous
  // turn's AI message - that is the user message's parent).
  if (!isIncognito) {
    await dbWriter.emitMessageCreated({
      messageId: aiMessageId,
      threadId: params.threadId,
      content: "",
      parentId: userMessageId,
      userId,
      model,
      skill,
      sequenceId,
    });
  } else {
    wsEmit("message-created", {
      messages: [
        {
          id: aiMessageId,
          threadId: params.threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          parentId: userMessageId,
          sequenceId,
          model,
          skill,
          metadata: null,
        },
      ],
      streamingState: "streaming",
    });
  }

  // Emit content done with full response
  await dbWriter.emitContentDone({
    messageId: aiMessageId,
    content: responseContent,
    totalTokens: null,
    finishReason: "stop",
    promptTokens: null,
    completionTokens: null,
  });

  // Credits were already deducted by the headless run - just track the total
  // so the caller's capturedTotalCreditsDeducted is correct.
  dbWriter.totalCreditsDeducted += creditsDeducted;

  // Track generated media URL for headless callers
  if (result.data.lastGeneratedMediaUrl) {
    dbWriter.lastGeneratedMediaUrl = result.data.lastGeneratedMediaUrl;
  }

  logger.debug("[Unbottled] Self-relay complete", {
    contentLength: responseContent.length,
    creditsDeducted,
  });
}
