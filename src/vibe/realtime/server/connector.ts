/**
 * WsProviderConnector — Unified Reverse WebSocket Manager
 *
 * Manages one persistent outbound WS connection per remoteConnections row.
 * One socket per connection carries the inbound remote-event relay (the peer
 * publishes on its hub; we subscribe to it).
 *
 * Lifecycle: demand-driven (no boot-time startup).
 *   - openConnection(config)           — hot-open after connect/register
 *   - closeConnection(instanceId)      — hot-close after disconnect
 *   - acquireConnection(instanceId)    — demand-open + ref-count; returns release()
 *   - getWsConnection(instanceId)      — get live connection (null if not open)
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
import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { coreClientEnv } from "../../core/env-client";
import { defaultLocale } from "../../core/i18n/core/config";
import { ErrorResponseTypes } from "../../core/route/response.schema";
import { db } from "../../database";
import { VibeMode } from "../../env/env-util";
import { createEndpointLogger } from "../../logger/server";
import type { EndpointLogger } from "../../logger/types";
import bridgeDefinition from "../remote-event-bridge/definition";
import { SYNC_DOMAINS } from "../core/sync-domain";
import {
  remoteConnections,
  StandardSyncCursorSchema,
  type SyncCursor,
  type SyncScope,
  ThreadsSyncCursorSchema,
} from "../../remote-connection/db";
import { RemoteConnectionRepository } from "../../remote-connection/repository";
import { RemoteTransport } from "../../remote-connection/transport";
import { z } from "zod";

import { buildUserWsChannel } from "../core/channel";
import type { AnyEndpointEventEnvelope } from "../core/structured-events";
import type { WsWireMessage } from "../core/types";
import { parseWsFrame } from "../core/types";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Config for a single reverse-ws connection loaded from DB */
export interface ConnectionConfig {
  id: string;
  instanceId: string;
  remoteUrl: string;
  token: string;
  leadId: string;
  userId: string;
  /**
   * The PEER-side userId (this same account's id on the remote's DB). The
   * connector subscribes to the bridge endpoint's user-scoped channel for that
   * identity — the bridge transport is a regular scope:"user" event, so it
   * rides that channel. Null until learned on the connect/register handshake.
   */
  remoteUserId: string | null;
  capabilitiesVersion: string | null;
  sentCapabilitiesVersion: string | null;
  syncScope: SyncScope | null;
  syncCursors: Record<string, SyncCursor> | null;
  pushCursors: Record<string, SyncCursor> | null;
  /** How WE reach the peer. Null/direct-http ⇒ no outbound socket is opened. */
  transportMode: string | null;
  /** How the PEER reaches us. reverse-ws ⇒ we hold an outbound socket for it. */
  remoteTransportMode: string | null;
}

/** Handler registered for a channel on a connection */
type ChannelHandler = (data: WsWireMessage["data"]) => void;

// ─── Constants ────────────────────────────────────────────────────────────────

const BACKOFF_MS = [1000, 2000, 4000, 8000, 16000, 30000] as const;

/** The bridge transport event — a regular scope:"user" event we identify by its
 *  endpoint + name (no special channel/event-name). */
const BRIDGE_PATH = bridgeDefinition.POST.path.join("/");
const BRIDGE_EVENT_NAME = "remote-event";

/**
 * True when an inbound envelope is the bridge transport event. The transport is
 * an ordinary endpoint event riding the peer's user channel, so we match on its
 * endpoint path + event name rather than a bespoke channel.
 */
function isBridgeEventEnvelope(data: WsWireMessage["data"]): boolean {
  return (
    Array.isArray(data.endpointPath) &&
    data.endpointPath.join("/") === BRIDGE_PATH &&
    data.eventName === BRIDGE_EVENT_NAME
  );
}

// ─── WsConnection ─────────────────────────────────────────────────────────────

/**
 * One persistent outbound WS to a single remote instance.
 * Handles the inbound remote-event relay and additional subscribed channels.
 */
class WsConnection {
  private ws: WebSocket | null = null;
  private stopped = false;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  /** Extra channel handlers registered by callers */
  private readonly channelHandlers = new Map<string, Set<ChannelHandler>>();

  /** Pending waitForConnected() resolvers — flushed true on open, false on stop */
  private openWaiters: Array<(connected: boolean) => void> = [];

  /** Mutable: reconnects re-read the row for fresh credentials */
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
      this.ws.send(
        JSON.stringify({ type: "subscribe", channel, locale: defaultLocale }),
      );
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
  send(channel: string, event: string, data: AnyEndpointEventEnvelope): void {
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
    void import("../../remote-connection/sync/repository").then(
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

    const { remoteUrl, token, leadId } = this.config;

    const wsBase = remoteUrl
      .replace(/^https:\/\//, "wss://")
      .replace(/^http:\/\//, "ws://")
      .replace(/\/$/, "");
    const wsUrl = `${wsBase}/ws?token=${encodeURIComponent(token)}&leadId=${encodeURIComponent(leadId)}&connectorInstanceId=${encodeURIComponent(this.instanceId)}`;

    // Subscribe to the bridge endpoint's user-scoped channel on the peer —
    // the bridge transport is a regular scope:"user" event, so the peer's
    // emitter delivers it there and ONLY there. remoteUserId is this account's
    // id on the peer's DB, learned on the connect/register handshake; the
    // peer's WS auth admits the channel because the connector's token
    // authenticates as exactly that user. One subscription per socket — no
    // other party ever joins this channel (browser tabs subscribe to the
    // endpoints they render). Fall back to nothing when not yet known (older
    // connections re-register and backfill it).
    // Erased view: the bridge POST has no url params (UrlVariablesOutput is
    // never), but the channel builder keys on whatever is present — same
    // erasure the emitter itself applies.
    const bridgeEndpoint: CreateApiEndpointAny = bridgeDefinition.POST;
    const remoteEventChannel = this.config.remoteUserId
      ? buildUserWsChannel(
          bridgeEndpoint,
          this.config.remoteUserId,
          {},
          undefined,
          this.logger,
        )
      : null;

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

    ws.addEventListener("open", () => {
      this.onOpen(ws, remoteEventChannel);
    });
    ws.addEventListener("message", (event: MessageEvent) => {
      this.onMessage(event);
    });
    ws.addEventListener("close", () => {
      this.onClose();
    });
    ws.addEventListener("error", (event) => {
      // close event always follows — reconnect is handled there.
      const message =
        "message" in event && typeof event.message === "string"
          ? event.message
          : "unknown";
      this.logger.warn("[WsConnection] WS error", {
        instanceId: this.instanceId,
        error: message,
      });
    });
  }

  /** Socket opened: reset backoff, subscribe core + dynamic channels, kick sync. */
  private onOpen(ws: WebSocket, remoteEventChannel: string | null): void {
    this.reconnectAttempt = 0;
    this.flushOpenWaiters(true);

    // Subscribe to the peer's user channel for the bridge transport event. Skip
    // only if the peer userId isn't known yet (pre-backfill connection); a
    // re-register fills it and the next reconnect subscribes.
    if (remoteEventChannel) {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          channel: remoteEventChannel,
          locale: defaultLocale,
        }),
      );
    } else {
      this.logger.warn(
        "[WsConnection] No remoteUserId — bridge event not subscribed",
        { instanceId: this.instanceId },
      );
    }
    // Re-subscribe any dynamically registered channels.
    for (const channel of this.channelHandlers.keys()) {
      ws.send(
        JSON.stringify({ type: "subscribe", channel, locale: defaultLocale }),
      );
    }

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

    // NOTE: pull-on-connect sync is intentionally NOT fired here. onOpen runs on
    // EVERY WS (re)open; syncing here re-ran a full pull on every reconnect. The
    // initial cursor-based sync fires EXACTLY ONCE from the connect flow
    // (openConnection → doPullNow); after that all state rides live WS remote
    // events. A reconnect only re-subscribes channels (done above), no re-sync.
  }

  /** Route an inbound frame (or batch) to remote-event / control / channel handlers. */
  private onMessage(event: MessageEvent): void {
    try {
      const raw =
        typeof event.data === "string"
          ? event.data
          : new TextDecoder().decode(event.data as ArrayBuffer);
      const frame = parseWsFrame(raw);
      if (!frame) {
        return;
      }

      // Unwrap batched frames — the batching emitter sends multiple events in a
      // single POST to the WS proxy; the proxy delivers them as one frame.
      const msgs: ReadonlyArray<WsWireMessage> =
        "type" in frame && frame.type === "batch"
          ? frame.events
          : [frame as WsWireMessage];

      for (const msg of msgs) {
        // The bridge transport is a regular scope:"user" event riding the peer's
        // user channel. It arrives as a normal __event__ envelope; we identify it
        // by its endpoint + event name (not a special channel). The bridge runs it
        // via the target route's onRemoteEvent (persist, re-emit, both — the route
        // decides). syncScope gating already happened at the sender.
        if (isBridgeEventEnvelope(msg.data)) {
          void this.handleRemoteEvent(msg.data);
          continue;
        }
        // Dispatch to registered channel handlers.
        const handlers = this.channelHandlers.get(msg.channel);
        if (handlers) {
          for (const handler of handlers) {
            handler(msg.data);
          }
        }
      }
    } catch {
      // Malformed message — ignore.
    }
  }

  /** Socket closed: clear liveness and schedule a reconnect unless stopped. */
  private onClose(): void {
    this.clearConnectedAt();
    if (this.stopped) {
      return;
    }
    this.logger.debug("[WsConnection] Closed — scheduling reconnect", {
      instanceId: this.instanceId,
    });
    this.ws = null;
    this.scheduleReconnect();
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
   * Handle a relayed remote-event from the peer: run it via the target route's
   * onRemoteEvent (the bridge dispatches by endpointPath+method+eventName).
   * One handler for every cross-instance effect.
   *
   * Reverse-ws peers share the sender's local hub, so this connection re-applies
   * ITS OWN syncScope here: a domained event is dropped unless THIS connection
   * enabled that domain. (Direct-http peers are gated at the sender instead.)
   */
  private async handleRemoteEvent(data: WsWireMessage["data"]): Promise<void> {
    // The bridge transport event carries the relayed event in its requestData.payload
    // (the bridge endpoint's requestFields: payload) — read it there.
    const parsed = z
      .object({
        originInstanceId: z.string(),
        syncDomain: z.enum(SYNC_DOMAINS).optional(),
        envelope: z.custom<AnyEndpointEventEnvelope>(),
        targetLeadId: z.string().optional(),
      })
      .safeParse(data.requestData?.["payload"]);
    if (!parsed.success) {
      return;
    }
    // Addressed (point-to-point) frame: the shared hub channel reaches every
    // peer connector of the account — only the addressed connection applies it
    // (tool dispatch would otherwise double-execute / leak across peers).
    if (
      parsed.data.targetLeadId &&
      parsed.data.targetLeadId !== this.config.leadId
    ) {
      return;
    }
    // Per-connection syncScope gate: drop a domained event this connection
    // hasn't enabled.
    const { syncDomain } = parsed.data;
    if (syncDomain && this.config.syncScope?.[syncDomain] !== true) {
      return;
    }
    const { RemoteEventBridgeRepository } =
      await import("../remote-event-bridge/repository");
    await RemoteEventBridgeRepository.handleRemoteEvent(
      {
        originInstanceId: parsed.data.originInstanceId,
        syncDomain: parsed.data.syncDomain,
        envelope: parsed.data.envelope,
      },
      this.config.userId,
      this.logger,
    );
  }

  /**
   * Trigger the pull-on-connect exchange immediately via HTTP, without waiting
   * for WS open. This is THE single entry point that starts the initial sync —
   * called exactly once by the connect flow (openConnection). It is NOT wired
   * to WS onOpen, so a WS reconnect never re-syncs; after this one pull, all
   * state rides live WS remote events.
   */
  doPullNow(): void {
    const { remoteUrl, token, leadId } = this.config;
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
      await import("../../remote-connection/sync/repository");
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
        await import("../../remote-connection/sync/provider");
      const { endpoints: syncEndpoints } =
        await import("../../remote-connection/sync/definition");
      const { RemoteConnectionRepository: ConnRepo } =
        await import("../../remote-connection/repository");
      const { z: zod } = await import("zod");
      const { RemoteToolCapabilitySchema } =
        await import("../../remote-connection/db");

      const conn = this.config;
      const { CAPABILITIES_VERSION } =
        await import("@/generated/remote-capabilities/version").catch(() => ({
          CAPABILITIES_VERSION: "unknown",
        }));

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
        // A stored cursor for a domain no longer in SyncScope (e.g. the removed
        // `chat` domain) is simply not allowed.
        return !!(scope as Record<string, boolean | undefined>)[domain];
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
        await buildSyncPayloads(
          storedPushCursors,
          conn.userId,
          this.logger,
          conn.syncScope,
        );
      // Cap the combined push body by a byte budget. Each provider's
      // serializeFromCursor is already page-limited, but on a FRESH connect
      // (empty pushCursors) many domains × full first pages can exceed the
      // peer's request-body limit → HTTP 413, failing the whole sync. Include
      // domains until the budget is hit; DEFER the rest by NOT advancing their
      // push cursor — the peer's own (paginated) pull fetches them, and the next
      // connect pushes the remainder. Prevents the 413 without losing data.
      const PUSH_BODY_BUDGET_BYTES = 4_000_000; // ~4MB, well under typical limits
      const pushPayloads: Record<string, string> = {};
      let pushBudgetUsed = 0;
      for (const [domain, payload] of Object.entries(allPushPayloads)) {
        // "[]" — nothing new since the last push; skip empty domains.
        if (!domainAllowed(domain) || payload === "[]") {
          continue;
        }
        const size = Buffer.byteLength(payload, "utf8");
        if (pushBudgetUsed + size > PUSH_BODY_BUDGET_BYTES) {
          // Deferred: do NOT advance this domain's push cursor (drop it from
          // pushHighWater) so a later connect re-pushes it; the peer pulls it now.
          delete pushHighWater[domain];
          this.logger.warn(
            "[WsConnection] push-on-connect: domain deferred (body budget)",
            { instanceId: this.instanceId, domain, size },
          );
          continue;
        }
        pushPayloads[domain] = payload;
        pushBudgetUsed += size;
      }

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
          await import("../../identity/user/db");
        const { UserPermissionRole } =
          await import("../../identity/roles/enum");
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
            ? await import("@/generated/remote-capabilities/en/admin.json").catch(
                () => null,
              )
            : roleSlug === "customer"
              ? await import("@/generated/remote-capabilities/en/customer.json").catch(
                  () => null,
                )
              : await import("@/generated/remote-capabilities/en/public.json").catch(
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

      // Typed direct call on the ALREADY-ESTABLISHED connection — no DB reload,
      // no execute()/dispatch re-entry (this runs inside the connector itself).
      // ONE attempt: pull-on-connect either works or it doesn't. No retry loop —
      // a retry masks the real failure and stalls the run.
      const { response: syncResult } = await RemoteTransport.callEndpointDirect(
        {
          connection: { remoteUrl, token, leadId },
          definition: syncEndpoints.POST,
          input: body,
          locale: defaultLocale,
          timeoutMs: 60_000,
        },
      );
      if (!syncResult.success) {
        this.logger.warn("[WsConnection] pull-on-connect sync failed", {
          instanceId: this.instanceId,
          errorType: syncResult.errorType?.errorCode,
          message: syncResult.message,
        });
      }

      if (!syncResult?.success) {
        if (syncResult?.errorType === ErrorResponseTypes.UNAUTHORIZED) {
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
          });
        }
        return;
      }

      const data = syncResult.data;
      if (!data) {
        this.logger.warn(
          "[WsConnection] pull-on-connect: remote returned failure",
          {
            instanceId: this.instanceId,
          },
        );
        return;
      }

      if (data.syncPayloads) {
        await applySyncPayloads(
          data.syncPayloads,
          conn.userId,
          this.logger,
          conn.syncScope,
        );
      }

      const caps = data.capabilities
        ? zod
            .array(RemoteToolCapabilitySchema)
            .parse(JSON.parse(data.capabilities))
        : undefined;

      // Advance stored syncCursors from remoteCursors so next pull sends newer
      // cursors. The endpoint types remoteCursors as WidgetData; re-parse to the
      // strict SyncCursor shape before persisting.
      const parsedRemoteCursors = data.remoteCursors
        ? z
            .record(
              z.string(),
              z.union([StandardSyncCursorSchema, ThreadsSyncCursorSchema]),
            )
            .parse(data.remoteCursors)
        : undefined;
      const updatedCursors = parsedRemoteCursors
        ? { ...storedCursors, ...parsedRemoteCursors }
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

const _logger: EndpointLogger = createEndpointLogger(false, defaultLocale);

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
  const decryptedToken = RemoteConnectionRepository.decryptToken(row.token);
  return {
    id: row.id,
    instanceId: row.instanceId,
    remoteUrl: row.remoteUrl,
    token: decryptedToken,
    leadId: row.leadId,
    userId: row.userId,
    remoteUserId: row.remoteUserId ?? null,
    capabilitiesVersion: row.capabilitiesVersion ?? null,
    sentCapabilitiesVersion: row.sentCapabilitiesVersion ?? null,
    syncScope: row.syncScope ?? null,
    syncCursors: row.syncCursors ?? null,
    pushCursors: row.pushCursors ?? null,
    transportMode: row.transportMode ?? null,
    remoteTransportMode: row.remoteTransportMode ?? null,
  };
}

/**
 * A connection needs an outbound reverse-ws SOCKET only when a leg is reverse-ws
 * — either WE reach the peer over reverse-ws (our transportMode) or the peer
 * reaches US over reverse-ws (remoteTransportMode). A fully direct-http pair
 * never opens a socket: cross-instance events ride the event bridge over HTTP.
 */
function configNeedsSocket(config: ConnectionConfig): boolean {
  return (
    config.transportMode === "reverse-ws" ||
    config.remoteTransportMode === "reverse-ws"
  );
}

/**
 * Get a live WsConnection by instanceId. Returns null if not connected.
 */
export function getWsConnection(instanceId: string): WsConnection | null {
  return _connections.get(instanceId) ?? null;
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
  if (coreClientEnv.NEXT_PUBLIC_VIBE_MODE === VibeMode.CLOUD) {
    _logger.debug("[Connector] openConnection: skipped (cloud instance)", {
      instanceId: config.instanceId,
    });
    return;
  }

  // Two independent concerns are gated here separately:
  //   1. the ONE pull-on-connect (HTTP sync exchange) — runs for EVERY
  //      transport, direct-http included; it never touches the socket.
  //   2. the persistent outbound WS socket — opened ONLY when a leg is
  //      reverse-ws (configNeedsSocket). A fully direct-http pair rides the
  //      event bridge over HTTP and must NEVER open a socket (that is the
  //      "ws://…/ws closed before established" noise we eliminated).
  const needsSocket = configNeedsSocket(config);

  // Cancel idle close if pending — explicit re-open is a signal to keep alive.
  const timer = _idleTimers.get(config.instanceId);
  if (timer !== undefined) {
    clearTimeout(timer);
    _idleTimers.delete(config.instanceId);
  }

  // Already have a live (socketed) connection for this instance → nothing to do.
  // For direct-http there is no registered connection, so this never short-
  // circuits the pull below.
  if (needsSocket && _connections.has(config.instanceId)) {
    _logger.debug("[Connector] openConnection: already connected (noop)", {
      instanceId: config.instanceId,
    });
    return;
  }

  const conn = new WsConnection(config, _logger);
  if (needsSocket) {
    // reverse-ws leg: register + open the persistent socket.
    _connections.set(config.instanceId, conn);
    conn.start();
    _logger.debug("[Connector] Opened connection (hot)", {
      instanceId: config.instanceId,
    });
  } else {
    _logger.debug(
      "[Connector] openConnection: direct-http — pull only, no socket",
      { instanceId: config.instanceId },
    );
  }
  // Fire the ONE pull-on-connect for this fresh connection lifetime, over HTTP,
  // independent of WS open (which can be delayed/flaky in dev, and absent
  // entirely for direct-http). This is the sole sync per connect; from here on
  // state rides live remote events (WS for reverse-ws legs, the HTTP event
  // bridge for direct-http). For direct-http the transient `conn` exists only
  // to run this pull and is then discarded (not registered).
  conn.doPullNow();
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
  // openConnection fires the single pull-on-connect for the fresh lifetime
  // (over HTTP, independent of WS open) — no separate pull needed here.
  openConnection(config);
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
