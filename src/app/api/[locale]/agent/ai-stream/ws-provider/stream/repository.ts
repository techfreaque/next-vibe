/**
 * WS Provider Stream Repository
 *
 * Delegates to AiStreamRepository.createAiStream() to run the AI stream.
 * All tools execute on the local node (the caller) via bidirectional WS events:
 *   remote emits TOOL_EXECUTE_REQUEST → local executes → local broadcasts TOOL_EXECUTE_RESULT
 *   to remote's /ws/broadcast → remote's WS subscription receives it → AI loop continues.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { NextRequest } from "next-vibe-ui/lib/request";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import { EXECUTE_TOOL_ALIAS } from "@/app/api/[locale]/system/unified-interface/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
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
// MODULE-LEVEL PENDING TOOL RESOLVERS + SHARED SUBSCRIBER
// ============================================================================

/**
 * Pending tool result resolvers.
 * Keyed by callId. Registered before TOOL_EXECUTE_REQUEST is emitted to avoid
 * race conditions. Resolved by the shared subscriber when TOOL_EXECUTE_RESULT
 * arrives on any thread channel.
 */
const pendingToolWaiters = new Map<
  string,
  (result: WidgetData, error?: string) => void
>();

/**
 * Shared persistent WS connection to the local Bun proxy.
 * Subscribes to all channels on-demand as streams start; routes
 * tool-execute-result events to pendingToolWaiters by callId.
 * One connection reused across all concurrent WsProvider streams.
 */
let sharedSubscriber: SharedToolResultSubscriber | null = null;

class SharedToolResultSubscriber {
  private ws: WebSocket | null = null;
  private stopped = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  /** Channels we should be subscribed to */
  private readonly subscribedChannels = new Set<string>();

  private readonly wsUrl: string;
  private readonly broadcastUrl: string;

  constructor() {
    const appUrl =
      process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
    let wsPort: number;
    try {
      const parsed = new URL(appUrl);
      const mainPort = parsed.port ? parseInt(parsed.port, 10) : 3000;
      const disableProxy = process.env["VIBE_DISABLE_PROXY"] === "true";
      wsPort = disableProxy ? mainPort + 1000 : mainPort;
    } catch {
      wsPort = 3000;
    }
    // Use an unauthenticated URL — no token needed for server-side internal WS
    // The channel auth is enforced server-side at subscribe time.
    // We pass a stable leadId so the Bun proxy accepts the connection.
    this.wsUrl = `ws://127.0.0.1:${wsPort}/ws?leadId=ws-provider-internal`;
    this.broadcastUrl = `http://127.0.0.1:${wsPort}/ws/broadcast`;
  }

  get broadcastUrlValue(): string {
    return this.broadcastUrl;
  }

  /** Ensure the WS is connected and subscribed to a channel. Returns cleanup fn. */
  subscribeChannel(channel: string): () => void {
    this.subscribedChannels.add(channel);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "subscribe", channel }));
    } else {
      this.ensureConnected();
    }
    return () => {
      this.subscribedChannels.delete(channel);
    };
  }

  stop(): void {
    this.stopped = true;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        /* ignore */
      }
      this.ws = null;
    }
  }

  private ensureConnected(): void {
    if (this.ws || this.stopped) {
      return;
    }
    this.connect();
  }

  private connect(): void {
    if (this.stopped) {
      return;
    }

    let ws: WebSocket;
    try {
      ws = new WebSocket(this.wsUrl);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws = ws;

    ws.addEventListener("open", (): void => {
      this.reconnectAttempt = 0;
      // Re-subscribe to all registered channels
      for (const channel of this.subscribedChannels) {
        ws.send(JSON.stringify({ type: "subscribe", channel }));
      }
    });

    ws.addEventListener("message", (event: MessageEvent): void => {
      try {
        const raw =
          typeof event.data === "string"
            ? event.data
            : new TextDecoder().decode(event.data as ArrayBuffer);
        const msg = JSON.parse(raw) as WsWireMessage;

        if (msg.event !== "tool-execute-result") {
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
        }
      } catch {
        // Malformed message — ignore
      }
    });

    ws.addEventListener("close", (): void => {
      this.ws = null;
      if (!this.stopped && this.subscribedChannels.size > 0) {
        this.scheduleReconnect();
      }
    });

    ws.addEventListener("error", (): void => {
      // close event follows — reconnect handled there
    });
  }

  private scheduleReconnect(): void {
    if (this.stopped || this.reconnectTimer !== null) {
      return;
    }
    const BACKOFF = [500, 1000, 2000, 4000, 8000];
    const delayMs =
      BACKOFF[Math.min(this.reconnectAttempt, BACKOFF.length - 1)] ?? 8000;
    this.reconnectAttempt++;
    this.reconnectTimer = setTimeout((): void => {
      this.reconnectTimer = null;
      this.connect();
    }, delayMs);
  }
}

/** Get or create the module-level shared subscriber. */
function getSharedSubscriber(): SharedToolResultSubscriber {
  if (!sharedSubscriber) {
    sharedSubscriber = new SharedToolResultSubscriber();
  }
  return sharedSubscriber;
}

// ============================================================================
// DELEGATED TOOL BUILDER
// ============================================================================

/**
 * Build pass-through CoreTool definitions from client-provided tool specs.
 * Each tool's execute() emits TOOL_EXECUTE_REQUEST via the local /ws/broadcast,
 * then awaits a TOOL_EXECUTE_RESULT event with the same callId.
 * Results arrive via the shared persistent WS subscriber (pendingToolWaiters).
 *
 * When instanceId + userId are provided, tool specs are filtered against the
 * caller's capability snapshot (fail-closed when snapshot exists). This prevents
 * a caller from injecting tool names that were never declared in their manifest.
 */
async function buildDelegatedTools(
  toolSpecs: Array<{
    name: string;
    description: string;
    parameters: Record<string, WidgetData>;
  }>,
  channel: string,
  logger: EndpointLogger,
  instanceId?: string,
  userId?: string,
): Promise<Record<string, CoreTool>> {
  const tools: Record<string, CoreTool> = {};

  // Capability gate: filter specs against the caller's declared capability snapshot.
  // If snapshot is present and non-empty, reject any tool not in the manifest.
  // If snapshot is absent (not yet synced), allow all — fail-open on first connection.
  let allowedToolNames: Set<string> | null = null;
  if (instanceId && userId) {
    const [connRow] = await db
      .select({ capabilities: remoteConnections.capabilities })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.instanceId, instanceId),
        ),
      )
      .limit(1);
    if (connRow?.capabilities && connRow.capabilities.length > 0) {
      allowedToolNames = new Set(connRow.capabilities.map((c) => c.toolName));
    }
  }

  // Use the shared subscriber's broadcast URL (already computed once).
  const broadcastUrl = getSharedSubscriber().broadcastUrlValue;

  for (const spec of toolSpecs) {
    if (allowedToolNames !== null && !allowedToolNames.has(spec.name)) {
      logger.warn(
        "[WsProvider] Dropping tool spec not in capability snapshot",
        {
          toolName: spec.name,
          instanceId,
        },
      );
      continue;
    }

    const inputSchema = jsonSchema<Record<string, WidgetData>>(
      spec.parameters as Parameters<typeof jsonSchema>[0],
    );
    tools[spec.name] = tool({
      description: spec.description,
      inputSchema,
      execute: async (args, executeOptions): Promise<WidgetData> => {
        const callId = crypto.randomUUID();
        // The AI SDK toolCallId identifies this call's TOOL message on every
        // instance that mirrors it - the executor binds background completions
        // (detach/wakeUp) to that message.
        const aiToolCallId = executeOptions?.toolCallId;
        logger.debug("[WsProvider] Delegating tool to local", {
          toolName: spec.name,
          callId,
          aiToolCallId,
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
              error: "Tool result timeout (300s)",
            });
          }
        }, 300_000);

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
              data: {
                callId,
                toolName: spec.name,
                args,
                toolCallId: aiToolCallId,
              },
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

      // 3. Subscribe to the thread channel via the shared persistent WS subscriber.
      //    The shared subscriber reuses one WS connection for all concurrent streams.
      //    Returns a cleanup fn that removes this channel from the subscriber's set.
      const closeSubscription: () => void =
        data.tools && data.tools.length > 0
          ? getSharedSubscriber().subscribeChannel(channel)
          : (): void => {
              /* no-op: no delegated tools */
            };

      // 4. Resolve userId for capability validation.
      const userId =
        "id" in user && typeof user.id === "string" ? user.id : undefined;

      // 5. Build delegated tools from client-provided specs.
      //    All tools execute on local - remote emits the request and awaits the result.
      const toolsOverride =
        data.tools && data.tools.length > 0
          ? await buildDelegatedTools(
              data.tools as Array<{
                name: string;
                description: string;
                parameters: Record<string, WidgetData>;
              }>,
              channel,
              logger,
              data.instanceId ?? undefined,
              userId,
            )
          : undefined;

      // 6. Provider-side persistence policy.
      //    - Peer connection relay (REMOTE-folder loop): this instance OWNS the
      //      running thread. When the wire threadMirrorMode includes the
      //      provider side ('both'/'cloud') AND a peer connection entry exists
      //      for the caller, persist under REMOTE/<caller instance> so the
      //      loop's tool messages exist in DB (detach/wakeUp backfill, revival)
      //      and the caller's mirror has a canonical source.
      //    - Inference-provider relay (e.g. UNBOTTLED) and mirror modes that
      //      exclude the provider: INCOGNITO - no DB writes, ephemeral session.
      let effectiveRootFolderId: DefaultFolderId = DefaultFolderId.INCOGNITO;
      let resolvedSubFolderId: string | null = null;
      const providerPersists =
        (data.threadMirrorMode === "both" ||
          data.threadMirrorMode === "cloud") &&
        data.instanceId &&
        userId;
      logger.warn("[WsProvider] persistence check", {
        providerPersists: !!providerPersists,
        threadMirrorMode: data.threadMirrorMode,
        instanceId: data.instanceId,
        userId,
      });
      if (providerPersists) {
        const [peerRow] = await db
          .select({ id: remoteConnections.id })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, userId),
              eq(remoteConnections.instanceId, data.instanceId!),
              eq(remoteConnections.isActive, true),
            ),
          )
          .limit(1);
        logger.warn("[WsProvider] peerRow lookup result", {
          found: !!peerRow,
          userId,
          instanceId: data.instanceId,
        });
        if (peerRow) {
          const { chatFolders } =
            await import("@/app/api/[locale]/agent/chat/db");
          const { isNull } = await import("drizzle-orm");

          // Resolve or create BACKGROUND/<caller-instanceId> as the root sub-folder.
          const [existingFolder] = await db
            .select({ id: chatFolders.id })
            .from(chatFolders)
            .where(
              and(
                eq(chatFolders.userId, userId),
                eq(chatFolders.rootFolderId, DefaultFolderId.BACKGROUND),
                eq(chatFolders.name, data.instanceId!),
                isNull(chatFolders.parentId),
              ),
            )
            .limit(1);
          let currentParentId: string;
          if (existingFolder) {
            currentParentId = existingFolder.id;
          } else {
            const [insertedFolder] = await db
              .insert(chatFolders)
              .values({
                userId,
                rootFolderId: DefaultFolderId.BACKGROUND,
                name: data.instanceId!,
                parentId: null,
              })
              .returning({ id: chatFolders.id });
            currentParentId = insertedFolder!.id;
          }

          // Walk folderPath to create or resolve each nested sub-folder in order.
          // folderPath mirrors the caller's sub-folder hierarchy (e.g. ["tests", "my-suite"]).
          for (const segment of data.folderPath ?? []) {
            const [existingSub] = await db
              .select({ id: chatFolders.id })
              .from(chatFolders)
              .where(
                and(
                  eq(chatFolders.userId, userId),
                  eq(chatFolders.rootFolderId, DefaultFolderId.BACKGROUND),
                  eq(chatFolders.name, segment),
                  eq(chatFolders.parentId, currentParentId),
                ),
              )
              .limit(1);
            if (existingSub) {
              currentParentId = existingSub.id;
            } else {
              const [insertedSub] = await db
                .insert(chatFolders)
                .values({
                  userId,
                  rootFolderId: DefaultFolderId.BACKGROUND,
                  name: segment,
                  parentId: currentParentId,
                })
                .returning({ id: chatFolders.id });
              currentParentId = insertedSub!.id;
            }
          }

          resolvedSubFolderId = currentParentId;
          effectiveRootFolderId = DefaultFolderId.BACKGROUND;
          logger.debug(
            "[WsProvider] Peer relay - persisting thread under BACKGROUND/<caller>",
            {
              instanceId: data.instanceId,
              folderPath: data.folderPath,
              subFolderId: resolvedSubFolderId,
              threadMirrorMode: data.threadMirrorMode,
            },
          );
        } else {
          logger.warn(
            "[WsProvider] threadMirrorMode requests provider persistence but no active peer connection entry exists - running INCOGNITO",
            { instanceId: data.instanceId },
          );
        }
      }

      // 7. Build AiStream-compatible data object
      //    userMessageId is generated here (provider-side) - it becomes the
      //    server-assigned ID that flows to the client via MESSAGE_CREATED.
      //    Attachments arrive base64-encoded and are rebuilt as File objects
      //    so the stream pipeline handles them exactly like local uploads.
      const wireAttachments = (data.attachments ?? []).map(
        (att) =>
          new File([Buffer.from(att.data, "base64")], att.filename, {
            type: att.mimeType,
          }),
      );
      // The OWNER keeps its own chain consistent. When this instance persists
      // the thread (REMOTE-folder peer relay) and has inserted a COMPACTING
      // message after the caller's wire parent since the caller last saw the
      // thread, the new turn must chain through that compacting node — not
      // off the now-superseded pre-compacting leaf (which would orphan the
      // compacting message as a dead branch). Only the compacting case
      // re-parents; intentional UI branches (retry/fork) are left untouched.
      let resolvedParentMessageId: string | null = data.parentMessageId ?? null;
      if (
        effectiveRootFolderId !== DefaultFolderId.INCOGNITO &&
        data.parentMessageId
      ) {
        const { chatMessages: ownMessages } =
          await import("@/app/api/[locale]/agent/chat/db");
        const { eq: ownEq } = await import("drizzle-orm");
        const { db: ownDb } = await import("@/app/api/[locale]/system/db");
        // Follow the compacting chain forward from the wire parent: while the
        // current node has a compacting child, descend to it.
        let cursor = data.parentMessageId;
        for (let hop = 0; hop < 10; hop++) {
          const children = await ownDb
            .select({ id: ownMessages.id, metadata: ownMessages.metadata })
            .from(ownMessages)
            .where(ownEq(ownMessages.parentId, cursor));
          const compactingChild = children.find(
            (c) => c.metadata?.isCompacting === true,
          );
          if (!compactingChild) {
            break;
          }
          cursor = compactingChild.id;
          resolvedParentMessageId = compactingChild.id;
        }
      }

      const aiStreamData: AiStreamPostRequestOutput = {
        operation: "send",
        rootFolderId: effectiveRootFolderId,
        subFolderId: resolvedSubFolderId,
        threadId,
        // Honour the caller's user-message id so the message persists under the
        // same id on both sides — the threads sync round-trip is then idempotent
        // (no duplicate orphan-root user message synced back to the caller).
        userMessageId: data.userMessageId ?? crypto.randomUUID(),
        // Owner-resolved leaf (see above) so the persisted thread is a single
        // linked list on both sides even across this instance's compactions.
        parentMessageId: resolvedParentMessageId,
        leafMessageId: null,
        content: data.content,
        role: ChatMessageRole.USER,
        model: data.model,
        skill: data.skill,
        favoriteConfig: null,
        toolConfirmations: data.toolConfirmations ?? null,
        // Persisted peer threads read history from this instance's own DB -
        // wire history only feeds stateless (incognito) relay sessions.
        messageHistory:
          effectiveRootFolderId === DefaultFolderId.INCOGNITO
            ? (data.messageHistory ?? [])
            : [],
        attachments: wireAttachments,
        resumeToken: null,
        voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
        audioInput: { file: null },
        timezone: data.timezone,
        imageSize: undefined,
        imageQuality: undefined,
        musicDuration: undefined,
      };

      // 8. Call AiStreamRepository.createAiStream() with delegated tools.
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
          // Carry the caller's favorite/skill confirmation gates to this loop —
          // the provider has no favorite of its own, so without these the
          // execute-tool gate never pauses a confirmation-required tool.
          confirmationOverridesOverride:
            data.confirmationOverrides
              ?.filter(
                (o): o is { toolId: string; requiresConfirmation: boolean } =>
                  typeof o.toolId === "string" &&
                  typeof o.requiresConfirmation === "boolean",
              )
              .map((o) => ({
                toolId: o.toolId,
                requiresConfirmation: o.requiresConfirmation,
              })) ?? null,
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

      // 9. Return threadId and messageId
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
