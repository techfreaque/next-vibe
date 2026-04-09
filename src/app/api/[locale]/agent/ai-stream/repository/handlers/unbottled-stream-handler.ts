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
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { WsWireMessage } from "@/app/api/[locale]/system/unified-interface/websocket/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { ChatMessageRole } from "../../../chat/enum";
import type { WsEmitCallback } from "../../../chat/threads/[threadId]/messages/emitter";
import {
  StreamEventType,
  createStreamEvent,
  type ContentDeltaEventData,
  type ContentDoneEventData,
  type CreditsDeductedEventData,
  type GeneratedMediaAddedEventData,
  type MessageCreatedEventData,
  type ReasoningDeltaEventData,
  type ReasoningDoneEventData,
  type StreamFinishedEventData,
  type TokensUpdatedEventData,
  type ToolCallEventData,
  type ToolResultEventData,
} from "../../../chat/threads/[threadId]/messages/events";
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
    parentMessageId,
    model,
    skill,
    sequenceId,
    userId,
    user,
    isIncognito,
    streamAbortController,
    logger,
    timezone,
    t,
    dbWriter,
    wsEmit,
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
        Authorization: `Bearer ${session.token}`,
        Cookie: `${LEAD_ID_COOKIE_NAME}=${session.leadId}`,
      },
      body: JSON.stringify({
        content,
        model: modelConfig.providerModel,
        skill,
        timezone,
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

  return new Promise<void>((resolve) => {
    // Maps remote message IDs → local IDs (assistant + tool messages)
    const remoteToLocalId = new Map<string, string>();

    // Multi-turn state: tracks the current assistant message in tool loops.
    // In a tool loop the cloud sends: assistant1 → tool1 → assistant2 → tool2 → ...
    // Each new assistant message gets a fresh local ID with correct parentage.
    let currentAssistantId = aiMessageId;
    let currentAssistantContent = "";
    let firstAssistantCreated = false;
    // Tracks the last tool message ID so subsequent assistant messages parent to it
    let lastToolMessageId: string | null = null;

    const ws = new WebSocket(wsUrl);

    const finish = (): void => {
      try {
        ws.close();
      } catch {
        // Already closed
      }
      resolve();
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

        void handleRemoteEvent(msg);
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
      remoteMessageId: string,
      localMessageId: string,
      localParentId: string | null,
    ): Promise<void> {
      remoteToLocalId.set(remoteMessageId, localMessageId);
      if (!isIncognito) {
        await dbWriter.emitMessageCreated({
          messageId: localMessageId,
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
        wsEmit(
          createStreamEvent.messageCreated({
            messageId: localMessageId,
            threadId,
            role: ChatMessageRole.ASSISTANT,
            content: "",
            parentId: localParentId ?? userMessageId,
            sequenceId,
            model,
            skill,
          }),
        );
      }
    }

    async function handleRemoteEvent(msg: WsWireMessage): Promise<void> {
      switch (msg.event) {
        case StreamEventType.MESSAGE_CREATED: {
          const data = msg.data as MessageCreatedEventData;

          if (data.role === ChatMessageRole.ASSISTANT) {
            if (!firstAssistantCreated) {
              // First assistant message - uses pre-generated aiMessageId
              firstAssistantCreated = true;
              currentAssistantId = aiMessageId;
              currentAssistantContent = "";
              await createAssistantMessage(
                data.messageId,
                aiMessageId,
                parentMessageId ?? userMessageId,
              );
            } else {
              // Subsequent assistant in a tool loop - fresh ID, parent = last tool message
              const newLocalId = crypto.randomUUID();
              currentAssistantId = newLocalId;
              currentAssistantContent = "";
              await createAssistantMessage(
                data.messageId,
                newLocalId,
                lastToolMessageId ?? currentAssistantId,
              );
            }
          } else if (data.role === ChatMessageRole.TOOL && data.toolCall) {
            // Tool message from cloud - parent is the current assistant message
            const localToolMessageId = crypto.randomUUID();
            remoteToLocalId.set(data.messageId, localToolMessageId);
            lastToolMessageId = localToolMessageId;

            if (!isIncognito) {
              await dbWriter.emitToolCall({
                toolMessageId: localToolMessageId,
                threadId,
                parentId: currentAssistantId,
                userId,
                model,
                skill,
                sequenceId,
                toolCall: data.toolCall,
              });
            } else {
              // Incognito: emit WS event only
              wsEmit(
                createStreamEvent.toolCall({
                  messageId: localToolMessageId,
                  toolName: data.toolCall.toolName,
                  args: data.toolCall.args,
                }),
              );
            }
          }
          break;
        }

        case StreamEventType.CONTENT_DELTA: {
          const data = msg.data as ContentDeltaEventData;
          const localId =
            remoteToLocalId.get(data.messageId) ?? currentAssistantId;
          currentAssistantContent += data.delta;

          // If we get a delta before MESSAGE_CREATED (rare edge case), create the message
          if (!firstAssistantCreated) {
            firstAssistantCreated = true;
            currentAssistantId = aiMessageId;
            currentAssistantContent = data.delta;
            await createAssistantMessage(
              data.messageId,
              aiMessageId,
              parentMessageId ?? userMessageId,
            );
          }

          // Emit CONTENT_DELTA SSE + schedule throttled DB update
          dbWriter.emitDeltaAndSchedule(
            localId,
            data.delta,
            currentAssistantContent,
          );
          break;
        }

        case StreamEventType.CONTENT_DONE: {
          const data = msg.data as ContentDoneEventData;
          const localId =
            remoteToLocalId.get(data.messageId) ?? currentAssistantId;
          currentAssistantContent = data.content;

          // Emit CONTENT_DONE SSE + flush DB + write token metadata
          await dbWriter.emitContentDone({
            messageId: localId,
            content: data.content,
            totalTokens: data.totalTokens,
            finishReason: data.finishReason,
            promptTokens: null,
            completionTokens: null,
          });
          break;
        }

        case StreamEventType.TOOL_CALL: {
          // Already handled in MESSAGE_CREATED for TOOL role.
          // This is just a real-time UX event - re-emit with local ID.
          const data = msg.data as ToolCallEventData;
          const localId = remoteToLocalId.get(data.messageId);
          if (localId) {
            wsEmit(
              createStreamEvent.toolCall({
                messageId: localId,
                toolName: data.toolName,
                args: data.args,
              }),
            );
          }
          break;
        }

        case StreamEventType.TOOL_RESULT: {
          const data = msg.data as ToolResultEventData;
          const localId = remoteToLocalId.get(data.messageId);
          if (localId && data.toolCall) {
            if (!isIncognito) {
              // Use dbWriter: updates DB + emits TOOL_RESULT SSE
              await dbWriter.emitToolResult({
                toolMessageId: localId,
                threadId,
                parentId: currentAssistantId,
                userId,
                model,
                skill,
                sequenceId,
                toolCall: data.toolCall,
                toolName: data.toolName,
                result: data.result,
                error: data.error,
                user,
              });
            } else {
              wsEmit(
                createStreamEvent.toolResult({
                  messageId: localId,
                  toolName: data.toolName,
                  result: data.result,
                  error: data.error,
                }),
              );
            }
          } else if (localId) {
            // Fallback: emit raw event if no full toolCall data
            wsEmit(
              createStreamEvent.toolResult({
                messageId: localId,
                toolName: data.toolName,
                result: data.result,
                error: data.error,
              }),
            );
          }
          break;
        }

        case StreamEventType.REASONING_DELTA: {
          const data = msg.data as ReasoningDeltaEventData;
          const localId =
            remoteToLocalId.get(data.messageId) ?? currentAssistantId;
          wsEmit(
            createStreamEvent.reasoningDelta({
              messageId: localId,
              delta: data.delta,
            }),
          );
          break;
        }

        case StreamEventType.REASONING_DONE: {
          const data = msg.data as ReasoningDoneEventData;
          const localId =
            remoteToLocalId.get(data.messageId) ?? currentAssistantId;
          wsEmit(
            createStreamEvent.reasoningDone({
              messageId: localId,
              content: data.content,
            }),
          );
          break;
        }

        case StreamEventType.CREDITS_DEDUCTED: {
          const data = msg.data as CreditsDeductedEventData;
          // Deduct credits locally - the cloud already charged its own credits,
          // but the self-hosted instance needs to track local credit usage too.
          await dbWriter.deductAndEmitCredits({
            user,
            amount: data.amount,
            feature: model,
            type: "model",
            model,
          });
          break;
        }

        case StreamEventType.TOKENS_UPDATED: {
          const data = msg.data as TokensUpdatedEventData;
          const localId =
            remoteToLocalId.get(data.messageId) ?? currentAssistantId;

          // Write token metadata to local DB
          if (!isIncognito) {
            await dbWriter.writeTokenMetadataOnly(localId, {
              promptTokens: data.promptTokens ?? 0,
              completionTokens: data.completionTokens ?? 0,
              finishReason: data.finishReason ?? null,
              cachedInputTokens: data.cachedInputTokens ?? 0,
              cacheWriteTokens: data.cacheWriteTokens ?? 0,
              timeToFirstToken: data.timeToFirstToken ?? null,
              creditCost: data.creditCost ?? 0,
            });
          }

          wsEmit(
            createStreamEvent.tokensUpdated({
              ...data,
              messageId: localId,
            }),
          );
          break;
        }

        case StreamEventType.GENERATED_MEDIA_ADDED: {
          const data = msg.data as GeneratedMediaAddedEventData;
          const localId =
            remoteToLocalId.get(data.messageId) ?? currentAssistantId;
          if (!isIncognito) {
            // Use dbWriter: emits SSE + updates DB metadata
            await dbWriter.emitGeneratedMediaOnExistingMessage({
              messageId: localId,
              generatedMedia: data.generatedMedia,
            });
          } else {
            wsEmit(
              createStreamEvent.generatedMediaAdded({
                messageId: localId,
                generatedMedia: data.generatedMedia,
              }),
            );
          }
          break;
        }

        case StreamEventType.ERROR: {
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
              userId,
            });
          } else {
            dbWriter.emitError(data);
          }
          break;
        }

        case StreamEventType.STREAM_FINISHED: {
          const data = msg.data as StreamFinishedEventData;
          logger.debug("[Unbottled] Cloud stream finished", {
            reason: data.reason,
          });

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
      user,
      locale,
      logger,
      t,
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
      userId,
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
    wsEmit(
      createStreamEvent.messageCreated({
        messageId: aiMessageId,
        threadId: params.threadId,
        role: ChatMessageRole.ASSISTANT,
        content: "",
        parentId: userMessageId,
        sequenceId,
        model,
        skill,
      }),
    );
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
