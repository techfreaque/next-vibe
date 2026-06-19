/**
 * WsProviderConnector — Unified Reverse WebSocket Manager
 *
 * Manages one persistent outbound WS connection per remoteConnections row.
 * All traffic for a given connection flows over a single WS: tool dispatch,
 * tool results, stream events, sync.
 *
 * Lifecycle: demand-driven (no boot-time startup).
 *   - openConnection(config)           — hot-open after connect/register
 *   - closeConnection(instanceId)      — hot-close after disconnect
 *   - acquireConnection(instanceId)    — demand-open + ref-count; returns release()
 *   - getWsConnection(instanceId)      — get live connection (null if not open)
 *   - getWsConnectionByUrl(remoteUrl)  — get live connection by URL
 *
 * Ref-counting: multiple parallel streams share one WS connection.
 * When the last stream calls release(), a 5-minute idle timer starts.
 * If nothing re-acquires, the connection closes automatically.
 *
 * Each WsConnection exposes:
 *   subscribe(channel, handler) → () => void  (cleanup)
 *   send(channel, event, data)                (fire-and-forget to remote)
 *   isConnected()                             (health check)
 */

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type {
  SyncCursor,
  SyncScope,
} from "@/app/api/[locale]/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import {
  StandardSyncCursorSchema,
  ThreadsSyncCursorSchema,
} from "@/app/api/[locale]/remote-connection/db";
import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";
// Wire schema + executor shared with the WS server (both delivery paths
// execute identically — see tool-executor.ts).
import {
  executeIncomingToolRequest,
  ToolExecuteRequestSchema,
} from "@/app/api/[locale]/remote-connection/tool-executor";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type {
  WsWireBatch,
  WsWireMessage,
} from "@/app/api/[locale]/system/unified-interface/websocket/types";
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Config for a single reverse-ws connection loaded from DB */
export interface ConnectionConfig {
  id: string;
  instanceId: string;
  remoteUrl: string;
  token: string;
  leadId: string;
  userId: string;
  capabilitiesVersion: string | null;
  sentCapabilitiesVersion: string | null;
  syncScope: SyncScope | null;
  syncCursors: Record<string, SyncCursor> | null;
  pushCursors: Record<string, SyncCursor> | null;
}

/** Handler registered for a channel on a connection */
type ChannelHandler = (event: string, data: WsWireMessage["data"]) => void;

// ─── Constants ────────────────────────────────────────────────────────────────

const DISPATCH_CHANNEL_PREFIX = "system/tool-dispatch/";
const SYNC_NOTIFY_CHANNEL_PREFIX = "system/sync/";
const CONTROL_CHANNEL_PREFIX = "system/control/";
const BACKOFF_MS = [1000, 2000, 4000, 8000, 16000, 30000] as const;

// ─── WsConnection ─────────────────────────────────────────────────────────────

/**
 * One persistent outbound WS to a single remote instance.
 * Handles tool dispatch, sync events, and any additional channels
 * subscribed via subscribe().
 */
export class WsConnection {
  private ws: WebSocket | null = null;
  private stopped = false;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  /** Extra channel handlers registered by callers (e.g. HeadlessRelayProcessor) */
  private readonly channelHandlers = new Map<string, Set<ChannelHandler>>();

  /** Pending waitForConnected() resolvers — flushed true on open, false on stop */
  private openWaiters: Array<(connected: boolean) => void> = [];

  /** Mutable: reconnects re-read the row and rename re-keys the registry */
  private config: ConnectionConfig;
  private currentInstanceId: string;
  private readonly logger: EndpointLogger;

  constructor(config: ConnectionConfig, logger: EndpointLogger) {
    this.config = config;
    this.currentInstanceId = config.instanceId;
    this.logger = logger;
  }

  get instanceId(): string {
    return this.currentInstanceId;
  }

  get remoteUrl(): string {
    return this.config.remoteUrl;
  }

  /** Subscribe to a channel on this connection. Returns cleanup fn. */
  subscribe(channel: string, handler: ChannelHandler): () => void {
    let handlers = this.channelHandlers.get(channel);
    if (!handlers) {
      handlers = new Set();
      this.channelHandlers.set(channel, handlers);
    }
    handlers.add(handler);

    // Subscribe on the live WS if already connected
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "subscribe", channel }));
    }

    return () => {
      const hs = this.channelHandlers.get(channel);
      if (hs) {
        hs.delete(handler);
        if (hs.size === 0) {
          this.channelHandlers.delete(channel);
        }
      }
    };
  }

  /** Send an event to the remote on a channel. Fire-and-forget. */
  send(channel: string, event: string, data: WidgetData): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.logger.warn("[WsConnection] send() called but not connected", {
        instanceId: this.instanceId,
        channel,
        event,
      });
      return;
    }
    const msg: WsWireMessage = { channel, event, data, seq: 0 };
    try {
      this.ws.send(JSON.stringify(msg));
    } catch (err) {
      this.logger.warn("[WsConnection] send() failed", {
        instanceId: this.instanceId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Resolves true once the socket is OPEN, false on timeout or stop.
   * Never throws. Callers MUST await this before send() when delivery matters
   * (see channel/spec.md → WsConnection). A reconnect succeeding within the
   * timeout resolves true — transient closes don't fail waiters early.
   */
  waitForConnected(timeoutMs: number): Promise<boolean> {
    if (this.isConnected()) {
      return Promise.resolve(true);
    }
    if (this.stopped) {
      return Promise.resolve(false);
    }
    const opened = new Promise<boolean>((resolve) => {
      this.openWaiters.push(resolve);
    });
    const timedOut = new Promise<boolean>((resolve) => {
      setTimeout((): void => {
        resolve(false);
      }, timeoutMs);
    });
    // Settling a lost race branch later is a harmless no-op; flushOpenWaiters
    // clears stale waiters on the next open/stop.
    return Promise.race([opened, timedOut]);
  }

  private flushOpenWaiters(connected: boolean): void {
    const waiters = this.openWaiters;
    this.openWaiters = [];
    for (const waiter of waiters) {
      waiter(connected);
    }
  }

  start(): void {
    if (this.ws || this.stopped) {
      return;
    }
    this.connect();
  }

  stop(): void {
    this.stopped = true;
    this.flushOpenWaiters(false);
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
    this.clearConnectedAt();
    // Force-release the sync slot so a replacement connection can claim it immediately.
    // The in-flight pull (if any) will try releaseSyncSlot in its finally block — that's a no-op.
    const syncSlotKey = `${this.config.userId}:${this.instanceId}`;
    void import("@/app/api/[locale]/remote-connection/sync/repository").then(
      ({ forceReleaseSyncSlot }) => {
        forceReleaseSyncSlot(syncSlotKey);
        return undefined;
      },
    );
  }

  /** wsConnectedAt must never survive a closed socket — health/UI read it. */
  private clearConnectedAt(): void {
    void db
      .update(remoteConnections)
      .set({ wsConnectedAt: null })
      .where(eq(remoteConnections.id, this.config.id))
      .then((): undefined => undefined)
      .catch((err: Error): void => {
        this.logger.warn("[WsConnection] Failed to clear wsConnectedAt", {
          error: err.message,
        });
      });
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private connect(): void {
    if (this.stopped) {
      return;
    }

    const { remoteUrl, token, leadId, userId } = this.config;

    const wsBase = remoteUrl
      .replace(/^https:\/\//, "wss://")
      .replace(/^http:\/\//, "ws://")
      .replace(/\/$/, "");
    const wsUrl = `${wsBase}/ws?token=${encodeURIComponent(token)}&leadId=${encodeURIComponent(leadId)}`;

    const dispatchChannel = `${DISPATCH_CHANNEL_PREFIX}${userId}`;
    const syncChannel = `${SYNC_NOTIFY_CHANNEL_PREFIX}${userId}`;
    const controlChannel = `${CONTROL_CHANNEL_PREFIX}${userId}`;

    this.logger.debug("[WsConnection] Connecting", {
      instanceId: this.instanceId,
      remoteUrl,
    });

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
    } catch (err) {
      this.logger.warn("[WsConnection] Failed to create WebSocket", {
        instanceId: this.instanceId,
        error: err instanceof Error ? err.message : String(err),
      });
      this.scheduleReconnect();
      return;
    }

    this.ws = ws;

    ws.addEventListener("open", (): void => {
      this.reconnectAttempt = 0;
      this.flushOpenWaiters(true);
      this.logger.debug("[WsConnection] Connected", {
        instanceId: this.instanceId,
      });

      // Core subscriptions
      ws.send(JSON.stringify({ type: "subscribe", channel: dispatchChannel }));
      ws.send(JSON.stringify({ type: "subscribe", channel: syncChannel }));
      ws.send(JSON.stringify({ type: "subscribe", channel: controlChannel }));

      // Re-subscribe any dynamically registered channels
      for (const channel of this.channelHandlers.keys()) {
        ws.send(JSON.stringify({ type: "subscribe", channel }));
      }

      // Update wsConnectedAt in DB
      void db
        .update(remoteConnections)
        .set({ wsConnectedAt: new Date() })
        .where(eq(remoteConnections.id, this.config.id))
        .then(() => undefined)
        .catch((err: Error) => {
          this.logger.warn("[WsConnection] Failed to update wsConnectedAt", {
            error: err.message,
          });
        });

      // Flush any tasks queued while offline
      void this.flushPendingQueue();
    });

    ws.addEventListener("message", (event: MessageEvent): void => {
      try {
        const raw =
          typeof event.data === "string"
            ? event.data
            : new TextDecoder().decode(event.data as ArrayBuffer);
        const msg = JSON.parse(raw) as WsWireMessage;

        // Tool dispatch channel
        if (
          msg.channel === dispatchChannel &&
          msg.event === "tool-execute-request"
        ) {
          const parsedReq = ToolExecuteRequestSchema.safeParse(msg.data);
          if (!parsedReq.success) {
            this.logger.warn(
              "[WsConnection] tool-execute-request: invalid payload — dropped",
              {
                instanceId: this.instanceId,
                issues: parsedReq.error.issues.map((i) => i.message),
              },
            );
            return;
          }
          void executeIncomingToolRequest({
            req: parsedReq.data,
            reportTo: { remoteUrl, token, leadId },
            executedByInstance: this.instanceId,
            logger: this.logger,
            localUserId: this.config.userId,
          });
          return;
        }

        // Inline reply for a wait/endLoop dispatch we sent over this socket
        // (remote-call/spec.md: caller blocks keyed by callId).
        if (
          msg.channel === dispatchChannel &&
          msg.event === "tool-execute-result"
        ) {
          void this.handleToolExecuteResult(msg.data);
          return;
        }

        // Sync channel
        if (msg.channel === syncChannel && msg.event === "sync-event") {
          void this.handleSyncNotify(msg.data);
          return;
        }

        // Live message event — a thread streaming on the peer; re-emit each raw
        // chunk on the LOCAL messages channel so a mirrored thread streams into
        // this instance's frontend live, and persist it to the local DB.
        if (msg.channel === syncChannel && msg.event === "live-message-event") {
          void this.handleLiveMessageEvent(msg.data);
          return;
        }

        // Control channel — rename and settings-update from remote side
        if (msg.channel === controlChannel) {
          void this.handleControlMessage(msg.event, msg.data);
          return;
        }

        // Dispatch to registered channel handlers
        const handlers = this.channelHandlers.get(msg.channel);
        if (handlers && handlers.size > 0) {
          for (const handler of handlers) {
            handler(msg.event, msg.data);
          }
        }
      } catch {
        // Malformed message — ignore
      }
    });

    ws.addEventListener("close", (): void => {
      this.clearConnectedAt();
      if (!this.stopped) {
        this.logger.debug("[WsConnection] Closed — scheduling reconnect", {
          instanceId: this.instanceId,
        });
        this.ws = null;
        this.scheduleReconnect();
      }
    });

    ws.addEventListener("error", (): void => {
      this.logger.warn("[WsConnection] WS error", {
        instanceId: this.instanceId,
      });
      // close event always follows — reconnect handled there
    });
  }

  private scheduleReconnect(): void {
    if (this.stopped) {
      return;
    }
    const delayMs =
      BACKOFF_MS[Math.min(this.reconnectAttempt, BACKOFF_MS.length - 1)] ??
      30000;
    this.reconnectAttempt++;
    this.reconnectTimer = setTimeout((): void => {
      this.reconnectTimer = null;
      void this.revalidateAndConnect();
    }, delayMs);
  }

  /**
   * From the 2nd consecutive failed attempt, re-read the connection row before
   * reconnecting: a deleted/deactivated row stops the loop (no zombie
   * reconnects), a rotated token or changed URL is picked up live.
   */
  private async revalidateAndConnect(): Promise<void> {
    if (this.stopped) {
      return;
    }
    if (this.reconnectAttempt >= 2) {
      const fresh = await loadRowByInstanceId(this.currentInstanceId).catch(
        (): null => null,
      );
      if (this.stopped) {
        return;
      }
      if (!fresh) {
        this.logger.info(
          "[WsConnection] Connection row gone or inactive — stopping reconnect",
          { instanceId: this.currentInstanceId },
        );
        closeConnection(this.currentInstanceId);
        return;
      }
      this.config = fresh;
    }
    this.connect();
  }

  /**
   * Inline reply to a wait/endLoop dispatch: complete the pending call so
   * the blocked execute-tool caller (awaitPendingCallResult) resumes.
   */
  private async handleToolExecuteResult(
    data: WsWireMessage["data"],
  ): Promise<void> {
    const parsed = z
      .object({
        callId: z.string().min(1),
        status: z.enum(["completed", "failed"]),
        output: z.record(z.string(), WidgetDataSchema).nullable(),
        error: z.string().nullable().optional(),
      })
      .safeParse(data);
    if (!parsed.success) {
      this.logger.warn(
        "[WsConnection] tool-execute-result: invalid payload — dropped",
        { instanceId: this.instanceId },
      );
      return;
    }
    const { completePendingCall } =
      await import("@/app/api/[locale]/remote-connection/pending-calls");
    const outcome = completePendingCall(parsed.data.callId, {
      status: parsed.data.status,
      output: parsed.data.output,
    });
    this.logger.debug("[WsConnection] tool-execute-result applied", {
      callId: parsed.data.callId,
      status: parsed.data.status,
      outcome: outcome.kind,
    });
  }

  private async handleSyncNotify(data: WsWireMessage["data"]): Promise<void> {
    // Inline sync payloads — apply directly, no HTTP round trip.
    // Wire shape: { userId: string; syncPayloads: Record<string, string> }
    const parsed = z
      .object({
        userId: z.string(),
        syncPayloads: z.record(z.string(), z.string()),
      })
      .safeParse(data);
    if (!parsed.success) {
      this.logger.warn(
        "[WsConnection] Sync-notify: invalid payload shape, skipping",
        {
          instanceId: this.instanceId,
          issues: parsed.error.issues.map((i) => i.message),
        },
      );
      return;
    }
    try {
      const { applySyncPayloads } =
        await import("@/app/api/[locale]/remote-connection/sync-provider");

      // Respect syncScope: filter out providers not enabled for this connection.
      // null scope = unrestricted — all domains pass through.
      const filteredPayloads = { ...parsed.data.syncPayloads };
      const scope = this.config.syncScope;
      if (scope) {
        if (!scope.memories) {
          delete filteredPayloads.memories;
        }
        if (!scope.documents) {
          delete filteredPayloads.documents;
        }
        if (!scope.skills) {
          delete filteredPayloads.skills;
        }
        if (!scope.favorites) {
          delete filteredPayloads.favorites;
        }
        if (!scope.threads) {
          delete filteredPayloads.threads;
        }
      }

      const counts = await applySyncPayloads(
        filteredPayloads,
        parsed.data.userId,
        this.logger,
      );
      this.logger.debug("[WsConnection] Sync-notify: applied inline payloads", {
        instanceId: this.instanceId,
        counts,
      });
    } catch (err) {
      this.logger.warn("[WsConnection] Sync-notify apply failed", {
        instanceId: this.instanceId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  /**
   * Handle a live message event from a peer: a thread streaming on the peer.
   * Re-emit each raw chunk on this instance's LOCAL messages channel so a
   * mirrored thread streams into this frontend live, exactly as it does on the
   * origin. Durable DB persistence is handled by the provider-level threads
   * sync (pushThreadSync at stream end + pull-on-connect) — both converge on the
   * same thread UUID, so the live path is frontend-only and idempotent.
   *
   * Echo loops are prevented two ways: the originInstanceId stamp (drop our own)
   * and the replay going through createMessagesEmitter with fanOut=false.
   */
  private async handleLiveMessageEvent(
    data: WsWireMessage["data"],
  ): Promise<void> {
    const parsed = z
      .object({
        userId: z.string(),
        threadId: z.string(),
        originInstanceId: z.string(),
        eventName: z.string(),
        data: WidgetDataSchema,
      })
      .safeParse(data);
    if (!parsed.success) {
      return;
    }
    const evt = parsed.data;

    // Drop our own echoes — an event we fanned out that bounced back.
    if (
      evt.originInstanceId ===
      RemoteConnectionRepository.deriveDefaultSelfInstanceId()
    ) {
      return;
    }

    // Respect syncScope: threads must be enabled for this connection.
    if (!this.config.syncScope?.threads) {
      return;
    }

    try {
      // Mirror filter: only act on threads we actually mirror locally (the
      // thread UUID is preserved cross-instance, so it exists in our DB once
      // pull-on-connect or a prior live event created it). Skip otherwise to
      // avoid emitting on a channel for a thread the frontend can't show yet.
      const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
      const [thread] = await db
        .select({ rootFolderId: chatThreads.rootFolderId })
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.id, evt.threadId),
            eq(chatThreads.userId, this.config.userId),
          ),
        )
        .limit(1);
      if (!thread) {
        return;
      }

      const { parseMessagesEventInput, replayMessagesEvent } =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter");
      const input = parseMessagesEventInput(evt.eventName, evt.data);
      if (!input) {
        return; // unknown event name — nothing definition-backed to replay
      }

      const user: JwtPrivatePayloadType = {
        id: this.config.userId,
        leadId: this.config.leadId,
        isPublic: false,
        roles: [],
      };
      replayMessagesEvent(
        evt.threadId,
        thread.rootFolderId,
        input,
        this.logger,
        user,
      );
    } catch (err) {
      this.logger.warn("[WsConnection] live-message-event replay failed", {
        instanceId: this.instanceId,
        threadId: evt.threadId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  /**
   * Handle a control message received from remote on system/control/{userId}.
   * Currently dispatches: "rename" (update local instanceId + subfolder name)
   *                       "settings-update" (update syncScope / transportMode)
   */
  private async handleControlMessage(
    event: string,
    data: WsWireMessage["data"],
  ): Promise<void> {
    if (event === "rename") {
      const parsed = z
        .object({ newInstanceId: z.string().min(1).max(32) })
        .safeParse(data);
      if (!parsed.success) {
        this.logger.warn("[WsConnection] Control rename: invalid payload", {
          instanceId: this.instanceId,
        });
        return;
      }
      const { newInstanceId } = parsed.data;
      try {
        // Update local connection row
        await db
          .update(remoteConnections)
          .set({ instanceId: newInstanceId, updatedAt: new Date() })
          .where(eq(remoteConnections.id, this.config.id));

        // Rename local subfolder inside REMOTE/
        const { chatFolders } =
          await import("@/app/api/[locale]/agent/chat/db");
        const { isNull: isNullFn } = await import("drizzle-orm");
        await db
          .update(chatFolders)
          .set({ name: newInstanceId, updatedAt: new Date() })
          .where(
            and(
              eq(chatFolders.userId, this.config.userId),
              eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
              eq(chatFolders.name, this.instanceId),
              isNullFn(chatFolders.parentId),
            ),
          );

        // Re-key the connector registry so getWsConnection(newInstanceId)
        // resolves immediately — otherwise settings-push silently no-ops
        // until the next reconnect.
        const oldInstanceId = this.currentInstanceId;
        rekeyConnection(oldInstanceId, newInstanceId);
        this.currentInstanceId = newInstanceId;
        this.config = { ...this.config, instanceId: newInstanceId };

        this.logger.info("[WsConnection] Control rename applied", {
          oldInstanceId,
          newInstanceId,
        });
      } catch (err) {
        this.logger.warn("[WsConnection] Control rename failed", {
          instanceId: this.instanceId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      return;
    }

    if (event === "settings-update") {
      // transportMode is NOT a control event — auto-negotiated only (spec.md).
      const parsed = z
        .object({
          syncScope: z
            .object({
              memories: z.boolean().optional(),
              documents: z.boolean().optional(),
              skills: z.boolean().optional(),
              favorites: z.boolean().optional(),
              threads: z.boolean().optional(),
            })
            .optional(),
        })
        .safeParse(data);
      if (!parsed.success) {
        this.logger.warn(
          "[WsConnection] Control settings-update: invalid payload",
          { instanceId: this.instanceId },
        );
        return;
      }
      try {
        const patch: Partial<typeof remoteConnections.$inferInsert> = {
          updatedAt: new Date(),
        };
        if (parsed.data.syncScope !== undefined) {
          patch.syncScope = parsed.data.syncScope as typeof patch.syncScope;
        }
        await db
          .update(remoteConnections)
          .set(patch)
          .where(eq(remoteConnections.id, this.config.id));

        this.logger.info("[WsConnection] Control settings-update applied", {
          instanceId: this.instanceId,
          fields: Object.keys(parsed.data),
        });

        // If any sync scope provider was enabled, trigger an immediate
        // pull-on-connect so newly-enabled providers backfill right away
        // without waiting for the next WS reconnect.
        const scope = parsed.data.syncScope;
        if (
          scope?.memories === true ||
          scope?.documents === true ||
          scope?.skills === true ||
          scope?.favorites === true ||
          scope?.threads === true
        ) {
          const { remoteUrl, token, leadId } = this.config;
          void this.pullOnConnect(remoteUrl, token, leadId);
        }
      } catch (err) {
        this.logger.warn("[WsConnection] Control settings-update failed", {
          instanceId: this.instanceId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      return;
    }

    this.logger.debug("[WsConnection] Unknown control event (ignored)", {
      instanceId: this.instanceId,
      event,
    });
  }

  private async flushPendingQueue(): Promise<void> {
    const { remoteUrl, token, leadId } = this.config;

    // Pull-on-connect: cursor-based catch-up for all enabled sync providers.
    await this.pullOnConnect(remoteUrl, token, leadId);
  }

  /**
   * Trigger a pull-on-connect exchange immediately via HTTP, without waiting
   * for WS open. Used by `restartConnection` to ensure sync fires even when the
   * WS upgrade fails (e.g. Vite HMR pressure during dev).
   */
  doPullNow(): void {
    const { remoteUrl, token, leadId } = this.config;
    this.logger.warn("[WsConnection] doPullNow: firing pullOnConnect", {
      instanceId: this.instanceId,
    });
    void this.pullOnConnect(remoteUrl, token, leadId);
  }

  private async pullOnConnect(
    remoteUrl: string,
    token: string,
    leadId: string,
  ): Promise<void> {
    // One exchange per connection at a time — a concurrent pull (e.g. an
    // explicit trigger during connect) skips instead of duplicating the work.
    const { claimSyncSlot, releaseSyncSlot } =
      await import("@/app/api/[locale]/remote-connection/sync/repository");
    const syncSlotKey = `${this.config.userId}:${this.instanceId}`;
    if (!claimSyncSlot(syncSlotKey)) {
      this.logger.warn(
        "[WsConnection] pull-on-connect skipped - sync already in flight",
        { instanceId: this.instanceId },
      );
      return;
    }
    try {
      const { applySyncPayloads, buildSyncPayloads } =
        await import("@/app/api/[locale]/remote-connection/sync-provider");
      const { endpoints: syncEndpoints } =
        await import("@/app/api/[locale]/remote-connection/sync/definition");
      const { RemoteConnectionRepository: ConnRepo } =
        await import("@/app/api/[locale]/remote-connection/repository");
      const { z: zod } = await import("zod");
      const { RemoteToolCapabilitySchema } =
        await import("@/app/api/[locale]/remote-connection/db");

      const conn = this.config;
      const { CAPABILITIES_VERSION } =
        await import("@/app/api/[locale]/system/generated/remote-capabilities/version").catch(
          () => ({ CAPABILITIES_VERSION: "unknown" }),
        );

      // Build per-domain cursors for enabled providers from stored syncCursors.
      // Only include domains that have a stored cursor — null means "full sync",
      // which is handled by the remote returning everything; don't send null values
      // as they fail remote ZodError validation.
      // null syncScope = unrestricted — all stored cursors are valid to send.
      const storedCursors = conn.syncCursors ?? {};
      const scope = conn.syncScope;
      const localSyncCursors: Record<string, SyncCursor> = {};
      const domainAllowed = (domain: string): boolean => {
        if (!scope) {
          return true;
        }
        return (
          (domain === "memories" && !!scope.memories) ||
          (domain === "documents" && !!scope.documents) ||
          (domain === "skills" && !!scope.skills) ||
          (domain === "favorites" && !!scope.favorites) ||
          (domain === "threads" && !!scope.threads)
        );
      };
      for (const [domain, cursor] of Object.entries(storedCursors)) {
        if (cursor && domainAllowed(domain)) {
          localSyncCursors[domain] = cursor;
        }
      }

      // Bidirectional push (sync/spec.md → Connect-Time Push-Pull): serialize
      // OUR changes since the last successful push to this remote, scoped to
      // enabled domains. The remote applies them before serializing its reply.
      const storedPushCursors = conn.pushCursors ?? {};
      const { syncPayloads: allPushPayloads, ourCursors: pushHighWater } =
        await buildSyncPayloads(storedPushCursors, conn.userId, this.logger);
      // Push payloads carry everything newer than pushCursors — no size cap.
      const pushPayloads: Record<string, string> = {};
      for (const [domain, payload] of Object.entries(allPushPayloads)) {
        // "[]" — nothing new since the last push; skip empty domains.
        if (!domainAllowed(domain) || payload === "[]") {
          continue;
        }
        pushPayloads[domain] = payload;
      }

      const syncUrl = `${remoteUrl}/api/${defaultLocale}/${syncEndpoints.POST.path.join("/")}`;
      // Send OUR capabilities only when the peer has not yet confirmed
      // storing this exact version — once per change, never per exchange.
      const sendCapabilities =
        conn.sentCapabilitiesVersion !== CAPABILITIES_VERSION;

      const body: Record<
        string,
        string | Record<string, SyncCursor> | Record<string, string>
      > = {
        instanceId: ConnRepo.deriveDefaultSelfInstanceId(),
        syncCursors: localSyncCursors,
        // Version of the PEER's snapshot we hold — the peer returns its
        // capabilities only when its current version differs.
        capabilitiesVersion: conn.capabilitiesVersion ?? "none",
        // Version of OUR snapshot — stored by the peer with capabilitiesJson.
        senderCapabilitiesVersion: CAPABILITIES_VERSION,
      };
      if (Object.keys(pushPayloads).length > 0) {
        body.pushPayloads = pushPayloads;
      }

      if (sendCapabilities) {
        const { userRoles: userRolesTable } =
          await import("@/app/api/[locale]/user/db");
        const { UserPermissionRole } =
          await import("@/app/api/[locale]/user/user-roles/enum");
        const { eq: eqFn } = await import("drizzle-orm");
        const roleRows = await db
          .select({ role: userRolesTable.role })
          .from(userRolesTable)
          .where(eqFn(userRolesTable.userId, conn.userId));
        const roles = roleRows.map((r) => r.role);
        const roleSlug = roles.includes(UserPermissionRole.ADMIN)
          ? "admin"
          : roles.includes(UserPermissionRole.CUSTOMER)
            ? "customer"
            : "public";
        const capFile =
          roleSlug === "admin"
            ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/admin.json").catch(
                () => null,
              )
            : roleSlug === "customer"
              ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/customer.json").catch(
                  () => null,
                )
              : await import("@/app/api/[locale]/system/generated/remote-capabilities/en/public.json").catch(
                  () => null,
                );
        if (capFile) {
          const localInstanceId = ConnRepo.deriveDefaultSelfInstanceId();
          const caps = zod
            .array(RemoteToolCapabilitySchema)
            .parse(capFile.default);
          body.capabilitiesJson = JSON.stringify(
            caps.map((c) => ({ ...c, instanceId: localInstanceId })),
          );
        }
      }

      // Retry up to 4× on 500 — Vite HMR or transient DB errors can cause 500s
      // during module reload. 15s between retries, 60s total budget.
      let response!: Response;
      for (let attempt = 0; attempt <= 4; attempt++) {
        if (attempt > 0) {
          this.logger.warn(
            `[WsConnection] pull-on-connect: 500 — retrying after 15s (attempt ${String(attempt)}/4)`,
            { instanceId: this.instanceId },
          );
          await new Promise((resolve) => {
            setTimeout(resolve, 15_000);
          });
        }
        response = await fetch(syncUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${leadId}`,
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000),
        });
        if (response.status !== 500) {
          break;
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          await db
            .update(remoteConnections)
            .set({ isActive: false, updatedAt: new Date() })
            .where(eq(remoteConnections.id, conn.id));
          this.logger.warn(
            "[WsConnection] pull-on-connect: 401 — deactivated and stopping channel",
            {
              instanceId: this.instanceId,
            },
          );
          // A dead token means every future send fails too — stop the channel,
          // don't keep a zombie socket reconnecting against a deactivated row.
          closeConnection(this.instanceId);
        } else {
          this.logger.warn("[WsConnection] pull-on-connect failed", {
            instanceId: this.instanceId,
            status: response.status,
          });
        }
        return;
      }

      const syncCursorSchema = z.union([
        StandardSyncCursorSchema,
        ThreadsSyncCursorSchema,
      ]);
      const remoteSyncResponseSchema = zod.object({
        success: zod.boolean(),
        data: zod
          .object({
            remoteCursors: zod
              .record(zod.string(), syncCursorSchema)
              .optional(),
            syncPayloads: zod.record(zod.string(), zod.string()).optional(),
            remoteCapabilitiesVersion: zod.string().optional(),
            capabilities: zod.string().nullable().optional(),
            serverTime: zod.string(),
          })
          .optional(),
      });
      const result = remoteSyncResponseSchema.parse(await response.json());

      if (!result.success || !result.data) {
        this.logger.warn(
          "[WsConnection] pull-on-connect: remote returned failure",
          {
            instanceId: this.instanceId,
          },
        );
        return;
      }

      const { data } = result;

      if (data.syncPayloads) {
        await applySyncPayloads(data.syncPayloads, conn.userId, this.logger);
      }

      const caps = data.capabilities
        ? zod
            .array(RemoteToolCapabilitySchema)
            .parse(JSON.parse(data.capabilities))
        : undefined;

      // Advance stored syncCursors from remoteCursors so next pull sends newer cursors.
      const updatedCursors = data.remoteCursors
        ? { ...storedCursors, ...data.remoteCursors }
        : storedCursors;

      // Advance pushCursors for domains we actually pushed — next connect
      // pushes only records newer than these high-water marks.
      const updatedPushCursors = { ...storedPushCursors };
      for (const domain of Object.keys(pushPayloads)) {
        const highWater = pushHighWater[domain];
        if (highWater) {
          updatedPushCursors[domain] = highWater;
        }
      }

      await db
        .update(remoteConnections)
        .set({
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
          syncCursors: updatedCursors,
          pushCursors: updatedPushCursors,
          // The peer stored our pushed snapshot — don't send it again.
          ...(sendCapabilities
            ? { sentCapabilitiesVersion: CAPABILITIES_VERSION }
            : {}),
          // The PEER's snapshot version — gates future returns of its caps.
          ...(caps && data.remoteCapabilitiesVersion
            ? { capabilitiesVersion: data.remoteCapabilitiesVersion }
            : {}),
          ...(caps ? { capabilities: caps } : {}),
        })
        .where(eq(remoteConnections.id, conn.id));

      this.logger.warn("[WsConnection] pull-on-connect complete", {
        instanceId: this.instanceId,
        syncPayloadKeys: data.syncPayloads
          ? Object.keys(data.syncPayloads)
          : [],
        pushPayloadKeys: Object.keys(pushPayloads),
      });
    } catch (err) {
      this.logger.warn("[WsConnection] pull-on-connect error", {
        instanceId: this.instanceId,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      releaseSyncSlot(syncSlotKey);
    }
  }
}

// ─── Manager ──────────────────────────────────────────────────────────────────

/**
 * Registry of all active reverse-ws connections. Keyed by instanceId.
 * Lifecycle: demand-driven (open on first acquire, close after idle timeout).
 */
const _connections = new Map<string, WsConnection>();

/**
 * Active stream ref counts per instanceId.
 * >0 means at least one stream is actively using this connection.
 */
const _refCounts = new Map<string, number>();

/**
 * Idle close timers per instanceId.
 * Fires IDLE_TIMEOUT_MS after all streams release the connection.
 */
const _idleTimers = new Map<string, ReturnType<typeof setTimeout>>();

/** Close WS connection 5 minutes after last stream releases it. */
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const _logger: EndpointLogger = createEndpointLogger(
  false,
  Date.now(),
  defaultLocale,
);

async function loadRowByInstanceId(
  instanceId: string,
): Promise<ConnectionConfig | null> {
  const [row] = await db
    .select()
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.isActive, true),
        eq(remoteConnections.instanceId, instanceId),
      ),
    )
    .limit(1);
  if (!row?.token) {
    return null;
  }
  return {
    id: row.id,
    instanceId: row.instanceId,
    remoteUrl: row.remoteUrl,
    token: RemoteConnectionRepository.decryptToken(row.token),
    leadId: row.leadId,
    userId: row.userId,
    capabilitiesVersion: row.capabilitiesVersion ?? null,
    sentCapabilitiesVersion: row.sentCapabilitiesVersion ?? null,
    syncScope: row.syncScope ?? null,
    syncCursors: row.syncCursors ?? null,
    pushCursors: row.pushCursors ?? null,
  };
}

/**
 * Get a live WsConnection by instanceId. Returns null if not connected.
 */
export function getWsConnection(instanceId: string): WsConnection | null {
  return _connections.get(instanceId) ?? null;
}

/**
 * Get a live WsConnection by remoteUrl. Returns null if not connected.
 * Used by relay handlers that have the session URL but not the instanceId.
 */
export function getWsConnectionByUrl(remoteUrl: string): WsConnection | null {
  const normalized = remoteUrl.replace(/\/$/, "");
  for (const conn of _connections.values()) {
    if (conn.remoteUrl.replace(/\/$/, "") === normalized) {
      return conn;
    }
  }
  return null;
}

/**
 * Acquire a connection for a stream. Opens it on demand if not already connected.
 *
 * Increments the ref-count for the connection. Returns a release function that
 * decrements the ref-count. When the last holder calls release(), a 5-minute
 * idle timer starts; if nothing acquires within that window, the WS closes.
 *
 * Usage:
 *   const release = await acquireConnection(instanceId);
 *   try { ... use conn ... } finally { release(); }
 */
export async function acquireConnection(
  instanceId: string,
): Promise<() => void> {
  // Cancel any pending idle close — connection is being used again.
  const existingTimer = _idleTimers.get(instanceId);
  if (existingTimer !== undefined) {
    clearTimeout(existingTimer);
    _idleTimers.delete(instanceId);
    _logger.debug("[Connector] Cancelled idle timer (re-acquired)", {
      instanceId,
    });
  }

  // Lazy-open: if not connected, load config and open.
  if (!_connections.has(instanceId)) {
    const config = await loadRowByInstanceId(instanceId);
    if (!config) {
      _logger.warn("[Connector] acquireConnection: no DB row found", {
        instanceId,
      });
      // Return a no-op release so callers don't need to null-check.
      return () => {
        _logger.debug("[Connector] release called on failed acquire (noop)", {
          instanceId,
        });
      };
    }
    const conn = new WsConnection(config, _logger);
    _connections.set(instanceId, conn);
    conn.start();
    _logger.debug("[Connector] Opened connection (demand)", { instanceId });
  }

  // Increment ref count.
  _refCounts.set(instanceId, (_refCounts.get(instanceId) ?? 0) + 1);
  _logger.debug("[Connector] Acquired", {
    instanceId,
    refs: _refCounts.get(instanceId),
  });

  return () => {
    const current = _refCounts.get(instanceId) ?? 0;
    const next = Math.max(0, current - 1);
    _refCounts.set(instanceId, next);
    _logger.debug("[Connector] Released", { instanceId, refs: next });

    if (next === 0) {
      // Last holder released. Start idle timer.
      const timer = setTimeout(() => {
        _idleTimers.delete(instanceId);
        const conn = _connections.get(instanceId);
        if (conn) {
          conn.stop();
          _connections.delete(instanceId);
          _refCounts.delete(instanceId);
          _logger.debug("[Connector] Closed connection (idle timeout)", {
            instanceId,
          });
        }
      }, IDLE_TIMEOUT_MS);
      _idleTimers.set(instanceId, timer);
      _logger.debug("[Connector] Idle timer started", {
        instanceId,
        idleMs: IDLE_TIMEOUT_MS,
      });
    }
  };
}

/**
 * Open a single WS connection immediately — called after connect/register succeeds.
 * No restart needed. Idempotent: if already connected, resets idle timer.
 * Does NOT increment ref count — use acquireConnection() for stream-lifecycle tracking.
 */
export function openConnection(config: ConnectionConfig): void {
  // Cloud instances never open outbound WS connections.
  // They receive connections from local instances only.
  if (env.NEXT_PUBLIC_VIBE_IS_CLOUD) {
    _logger.debug("[Connector] openConnection: skipped (cloud instance)", {
      instanceId: config.instanceId,
    });
    return;
  }

  // Cancel idle close if pending — explicit re-open is a signal to keep alive.
  const timer = _idleTimers.get(config.instanceId);
  if (timer !== undefined) {
    clearTimeout(timer);
    _idleTimers.delete(config.instanceId);
  }

  if (_connections.has(config.instanceId)) {
    _logger.debug("[Connector] openConnection: already connected (noop)", {
      instanceId: config.instanceId,
    });
    return;
  }
  const conn = new WsConnection(config, _logger);
  _connections.set(config.instanceId, conn);
  conn.start();
  _logger.debug("[Connector] Opened connection (hot)", {
    instanceId: config.instanceId,
  });
}

/**
 * Restart a connection with fresh DB state — close, reload row, reopen.
 * Called after token rotation (reauth), rename, or transport flips so the
 * live channel picks up new credentials immediately instead of reconnecting
 * forever with a stale token.
 */
export async function restartConnection(instanceId: string): Promise<void> {
  closeConnection(instanceId);
  const config = await loadRowByInstanceId(instanceId);
  if (!config) {
    _logger.warn(
      "[Connector] restartConnection: no active row — staying closed",
      {
        instanceId,
      },
    );
    return;
  }
  openConnection(config);
  // Also fire pullOnConnect directly so sync happens even if WS open fails
  // (e.g. during Vite HMR module invalidation in dev).
  // Delay 50ms to let stop()'s async forceReleaseSyncSlot complete first.
  const conn = _connections.get(instanceId);
  if (conn) {
    setTimeout(() => {
      conn.doPullNow();
    }, 50);
  }
}

/**
 * Move a connection's registry entries from the old instanceId to the new one.
 * Called by the control-rename handler — without this, getWsConnection(newId)
 * returns null until the next reconnect.
 */
function rekeyConnection(oldInstanceId: string, newInstanceId: string): void {
  const conn = _connections.get(oldInstanceId);
  if (conn) {
    _connections.delete(oldInstanceId);
    _connections.set(newInstanceId, conn);
  }
  const refs = _refCounts.get(oldInstanceId);
  if (refs !== undefined) {
    _refCounts.delete(oldInstanceId);
    _refCounts.set(newInstanceId, refs);
  }
  const timer = _idleTimers.get(oldInstanceId);
  if (timer !== undefined) {
    // The pending idle callback captured the old key — cancel it; the next
    // release() arms a fresh timer under the new key.
    clearTimeout(timer);
    _idleTimers.delete(oldInstanceId);
  }
}

/**
 * Close a single WS connection immediately — called after disconnect.
 * No restart needed. Idempotent: if not connected, does nothing.
 * Cancels any pending idle timer.
 */
export function closeConnection(instanceId: string): void {
  const timer = _idleTimers.get(instanceId);
  if (timer !== undefined) {
    clearTimeout(timer);
    _idleTimers.delete(instanceId);
  }
  _refCounts.delete(instanceId);

  const existing = _connections.get(instanceId);
  if (!existing) {
    return;
  }
  existing.stop();
  _connections.delete(instanceId);
  _logger.debug("[Connector] Closed connection (hot)", { instanceId });
}

/**
 * Admin-forced reset — close all open connections and clear state.
 * Next acquireConnection() call will re-open on demand.
 * Used by debug/admin tooling only.
 */
export function reloadWsProviderConnector(instanceId?: string): void {
  if (instanceId) {
    closeConnection(instanceId);
  } else {
    for (const [id, timer] of _idleTimers) {
      clearTimeout(timer);
      _idleTimers.delete(id);
    }
    _refCounts.clear();
    for (const conn of _connections.values()) {
      conn.stop();
    }
    _connections.clear();
    _logger.debug("[Connector] All connections reset (admin)");
  }
}
