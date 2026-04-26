/**
 * WS Provider Stream Repository
 *
 * Delegates to AiStreamRepository.createAiStream() to run the AI stream.
 * All tools execute on the local node (the caller) via bidirectional WS events:
 *   remote emits TOOL_EXECUTE_REQUEST → local executes → local broadcasts TOOL_EXECUTE_RESULT
 *   to remote's /ws/broadcast → remote's WS subscription receives it → AI loop continues.
 */

import "server-only";

import { jsonSchema, tool } from "ai";
import type { NextRequest } from "next-vibe-ui/lib/request";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { WsWireMessage } from "@/app/api/[locale]/system/unified-interface/websocket/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { AiStreamRepository } from "../../repository";
import type { AiStreamPostRequestOutput } from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import type {
  WsProviderStreamPostRequestOutput,
  WsProviderStreamPostResponseOutput,
} from "./definition";

// ============================================================================
// MODULE-LEVEL PENDING TOOL RESOLVERS
// ============================================================================

/**
 * Pending tool result resolvers.
 * Keyed by callId. When the remote AI loop calls a delegated tool, it registers
 * a resolver here and awaits it. When the local node broadcasts TOOL_EXECUTE_RESULT
 * on the messages channel, our WS subscription resolves the matching promise.
 * Scoped to this Next.js process - no Bun proxy involvement.
 */
const pendingToolWaiters = new Map<
  string,
  (result: WidgetData, error?: string) => void
>();

// ============================================================================
// WS SUBSCRIPTION FOR RECEIVING TOOL RESULTS
// ============================================================================

/**
 * Open a WebSocket subscription to the messages channel on the local Bun proxy.
 * Returns a Promise that resolves with a cleanup function once the connection is
 * established and subscribed - guaranteeing no TOOL_EXECUTE_RESULT events are missed.
 * Rejects after 5 s if the local proxy isn't reachable.
 */
async function openToolResultSubscription(
  channel: string,
  logger: EndpointLogger,
): Promise<() => void> {
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
  let wsPort: number;
  try {
    const parsed = new URL(appUrl);
    const mainPort = parsed.port ? parseInt(parsed.port, 10) : 3000;
    const disableProxy = process.env["VIBE_DISABLE_PROXY"] === "true";
    wsPort = disableProxy ? mainPort + 1000 : mainPort;
  } catch {
    wsPort = 3000;
  }

  const wsUrl = `ws://127.0.0.1:${wsPort}/ws?channel=${encodeURIComponent(channel)}`;

  return new Promise<() => void>((resolve, reject) => {
    let ws: WebSocket;
    let closed = false;

    const connectionTimeout = setTimeout(() => {
      closed = true;
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      reject(new Error("[WsProvider] Tool result subscription timed out (5s)"));
    }, 5_000);

    try {
      ws = new WebSocket(wsUrl);
    } catch (err) {
      clearTimeout(connectionTimeout);
      reject(err);
      return;
    }

    ws.addEventListener("open", (): void => {
      clearTimeout(connectionTimeout);
      if (closed) {
        return;
      }
      ws.send(JSON.stringify({ type: "subscribe", channel }));
      logger.debug("[WsProvider] Subscribed to tool-result channel", {
        channel,
      });

      // Resolve with cleanup function - AI stream may now start.
      resolve((): void => {
        closed = true;
        try {
          ws.close();
        } catch {
          /* Already closed */
        }
      });
    });

    ws.addEventListener("message", (event): void => {
      try {
        const msg = JSON.parse(
          typeof event.data === "string"
            ? event.data
            : new TextDecoder().decode(event.data as ArrayBuffer),
        ) as WsWireMessage;

        if (msg.channel !== channel || msg.event !== "tool-execute-result") {
          return;
        }

        const eventData = msg.data as {
          callId: string;
          result: WidgetData;
          error?: string;
        };
        const waiter = pendingToolWaiters.get(eventData.callId);
        if (waiter) {
          pendingToolWaiters.delete(eventData.callId);
          waiter(eventData.result, eventData.error);
          logger.debug("[WsProvider] Tool result received", {
            callId: eventData.callId,
          });
        }
      } catch {
        // Malformed message - ignore
      }
    });

    ws.addEventListener("error", (): void => {
      clearTimeout(connectionTimeout);
      if (!closed) {
        logger.warn("[WsProvider] Tool result subscription WS error");
        // If we haven't resolved yet, reject so the caller knows setup failed.
        reject(new Error("[WsProvider] Tool result subscription WS error"));
      }
    });
  });
}

// ============================================================================
// DELEGATED TOOL BUILDER
// ============================================================================

/**
 * Build pass-through CoreTool definitions from client-provided tool specs.
 * Each tool's execute() emits TOOL_EXECUTE_REQUEST via publishWsEvent on the
 * messages channel, then awaits a TOOL_EXECUTE_RESULT event with the same callId.
 * The result arrives via the WS subscription opened in openToolResultSubscription().
 */
function buildDelegatedTools(
  toolSpecs: Array<{
    name: string;
    description: string;
    parameters: Record<string, WidgetData>;
  }>,
  channel: string,
  logger: EndpointLogger,
): Record<string, CoreTool> {
  const tools: Record<string, CoreTool> = {};

  // Derive the broadcast URL for emitting events to the local WS server.
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
  let broadcastUrl: string;
  try {
    const parsed = new URL(appUrl);
    const mainPort = parsed.port ? parseInt(parsed.port, 10) : 3000;
    const disableProxy = process.env["VIBE_DISABLE_PROXY"] === "true";
    const wsPort = disableProxy ? mainPort + 1000 : mainPort;
    broadcastUrl = `http://127.0.0.1:${wsPort}/ws/broadcast`;
  } catch {
    broadcastUrl = "http://127.0.0.1:3000/ws/broadcast";
  }

  for (const spec of toolSpecs) {
    const inputSchema = jsonSchema<Record<string, WidgetData>>(
      spec.parameters as Parameters<typeof jsonSchema>[0],
    );
    tools[spec.name] = tool({
      description: spec.description,
      inputSchema,
      execute: async (args): Promise<WidgetData> => {
        const callId = crypto.randomUUID();
        logger.debug("[WsProvider] Delegating tool to local", {
          toolName: spec.name,
          callId,
        });

        // 1. Register pending resolver before emitting - avoid race condition.
        //    A single `resolved` flag ensures the promise settles exactly once.
        let resolveToolResult!: (result: WidgetData) => void;
        const resultPromise = new Promise<WidgetData>((resolve) => {
          resolveToolResult = resolve;
        });

        let settled = false;
        const timeout = setTimeout(() => {
          if (!settled) {
            settled = true;
            pendingToolWaiters.delete(callId);
            resolveToolResult({
              error: "Tool result timeout (120s)",
            });
          }
        }, 120_000);

        pendingToolWaiters.set(callId, (result, error) => {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            resolveToolResult(error ? { error } : (result ?? {}));
          }
        });

        // 2. Emit TOOL_EXECUTE_REQUEST on the messages channel via /ws/broadcast
        //    This uses the same mechanism as publishWsEvent - standard framework call.
        try {
          await fetch(broadcastUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              channel,
              event: "tool-execute-request",
              data: { callId, toolName: spec.name, args },
            }),
          });
        } catch (emitErr) {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            pendingToolWaiters.delete(callId);
          }
          logger.warn("[WsProvider] Failed to emit TOOL_EXECUTE_REQUEST", {
            toolName: spec.name,
            callId,
            error: emitErr instanceof Error ? emitErr.message : String(emitErr),
          });
          return { error: "Failed to dispatch tool execution request" };
        }

        // 3. Await the result (resolved by WS subscription when TOOL_EXECUTE_RESULT arrives)
        return resultPromise;
      },
    });
  }

  return tools;
}

// ============================================================================
// REPOSITORY
// ============================================================================

export class WsProviderStreamRepository {
  static async stream({
    data,
    locale,
    logger,
    user,
    request,
  }: {
    data: WsProviderStreamPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request?: NextRequest;
  }): Promise<ResponseType<WsProviderStreamPostResponseOutput>> {
    // Get AI stream translation function (needed for createAiStream and error messages)
    const { scopedTranslation: aiStreamI18n } =
      await import("@/app/api/[locale]/agent/ai-stream/stream/i18n");
    const t: AiStreamT = aiStreamI18n.scopedT(locale).t;

    try {
      // 1. Resolve threadId - use existing or generate new
      const threadId = data.threadId ?? crypto.randomUUID();

      // 2. The messages channel - local subscribes to receive TOOL_EXECUTE_REQUEST
      //    events; remote emits them here; local sends TOOL_EXECUTE_RESULT back.
      const channel = `agent/chat/threads/${threadId}/messages`;

      // 3. Open WS subscription for receiving TOOL_EXECUTE_RESULT events from local.
      //    Awaited so the connection is confirmed ready before the AI stream starts —
      //    guarantees no tool results arrive before we're listening.
      const closeSubscription: () => void =
        data.tools && data.tools.length > 0
          ? await openToolResultSubscription(channel, logger)
          : (): void => {
              /* no-op: no delegated tools */
            };

      // 4. Build delegated tools from client-provided specs.
      //    All tools execute on local - remote emits the request and awaits the result.
      const toolsOverride =
        data.tools && data.tools.length > 0
          ? buildDelegatedTools(
              data.tools as Array<{
                name: string;
                description: string;
                parameters: Record<string, WidgetData>;
              }>,
              channel,
              logger,
            )
          : undefined;

      // 5. Build AiStream-compatible data object
      //    userMessageId is generated here (provider-side) - it becomes the
      //    server-assigned ID that flows to the client via MESSAGE_CREATED.
      const aiStreamData: AiStreamPostRequestOutput = {
        operation: "send",
        rootFolderId: data.rootFolderId ?? DefaultFolderId.PRIVATE,
        subFolderId: null,
        threadId,
        userMessageId: crypto.randomUUID(),
        parentMessageId: null,
        leafMessageId: null,
        content: data.content,
        role: ChatMessageRole.USER,
        model: data.model,
        skill: data.skill,
        favoriteConfig: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
        audioInput: { file: null },
        timezone: data.timezone,
        imageSize: undefined,
        imageQuality: undefined,
        musicDuration: undefined,
      };

      // 6. Call AiStreamRepository.createAiStream() with delegated tools.
      //    If no tools provided, AI runs with no tools (pure inference).
      let result: Awaited<ReturnType<typeof AiStreamRepository.createAiStream>>;
      try {
        result = await AiStreamRepository.createAiStream({
          data: aiStreamData,
          locale,
          logger,
          user,
          request,
          headless: false,
          subAgentDepth: 0,
          t,
          extraInstructions: data.systemPrompt,
          ...(toolsOverride ? { toolsOverride } : {}),
        });
      } finally {
        closeSubscription();
      }

      if (!result.success) {
        return fail({
          message: result.message,
          errorType: result.errorType ?? ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // 7. Return threadId and messageId
      // messageId is always set when headless: false (AiStreamPostResponseOutput)
      const messageId = result.data.messageId ?? "";
      return success({
        responseThreadId: result.data.responseThreadId ?? threadId,
        messageId,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("[WsProviderStream] Unexpected error", {
        error: parsedError,
      });
      return fail({
        message: t("errors.unexpectedError", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
