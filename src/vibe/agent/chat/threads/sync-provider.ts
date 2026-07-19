import "server-only";

/**
 * Threads Sync Provider
 * Registers chat threads and their messages for cross-instance sync via the
 * unified SyncProvider interface.
 *
 * Pull-on-connect only — threads are not pushed in real time (too large,
 * high-frequency). On receive, threads land in the REMOTE/{instanceId}
 * subfolder so both sides share the same conversation history.
 *
 * Wire format is an envelope: the sender's instanceId, the served threads
 * (each carrying its origin so the receiver resolves the REMOTE/<origin>
 * subfolder at upsert time), and — when the serve is complete — a
 * full-presence thread-id manifest the receiver reconciles deletions against.
 */
import {
  and,
  asc,
  eq,
  inArray,
  isNull,
  lt,
  max,
  ne,
  notInArray,
  sql,
} from "drizzle-orm";
import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { ThreadsSyncCursor } from "next-vibe/remote-connection/db";
import {
  type SyncProvider,
  toThreadsCursor,
} from "next-vibe/remote-connection/sync/provider";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import { z } from "zod";

import { DefaultFolderId } from "../config";
import {
  CHAT_MESSAGE_COLUMNS,
  chatFolders,
  type ChatMessage,
  chatMessages,
  chatThreads,
  type MessageMetadata,
} from "../db";
import { ChatMessageRoleDB, ThreadStatusDB } from "../enum";

// ─── Wire Schemas ─────────────────────────────────────────────────────────────

const syncedMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(ChatMessageRoleDB),
  content: z.string().nullable(),
  parentId: z.string().uuid().nullable(),
  sequenceId: z.string().uuid().nullable(),
  authorId: z.string().nullable(),
  authorName: z.string().nullable(),
  isAI: z.boolean(),
  model: z.string().nullable(),
  skill: z.string().nullable(),
  metadata: WidgetDataSchema.nullable() as z.ZodType<MessageMetadata | null>,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const syncedThreadSchema = z.object({
  /** Thread UUID — used as syncId */
  id: z.string().uuid(),
  /**
   * The instance that OWNS this thread:
   *   - the sender's own selfInstanceId for its local (private/background) threads
   *   - the peer instance for mirror threads (REMOTE/<X>/… or BACKGROUND/remote/<X>/…)
   * The receiver places foreign-origin threads under REMOTE/<origin>/<segment>
   * and never re-places its OWN threads (origin === receiver's selfInstanceId).
   */
  originInstanceId: z.string(),

  /** The thread's own folderId (same id on every instance; null = root level). */
  folderId: z.string().uuid().nullable(),
  /** The origin's root folder id — scaffold segment + own-thread restore. */
  originRootFolderId: z.string(),
  /**
   * The instance the thread's LOOP runs on (sender's column, null = sender-
   * local). The receiver compares it to its OWN id: when the receiver IS the
   * executor, the owner's message rows are a MIRROR of the receiver's writes
   * — never authoritative over them.
   */
  loopInstanceId: z.string().nullable().optional(),
  title: z.string(),
  status: z.enum(ThreadStatusDB),
  defaultModel: z.string().nullable(),
  defaultSkill: z.string().nullable(),
  systemPrompt: z.string().nullable(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  pinned: z.boolean(),
  archived: z.boolean(),
  updatedAt: z.string(),
  messages: z.array(syncedMessageSchema),
});

type SyncedThread = z.infer<typeof syncedThreadSchema>;

/**
 * Threads wire envelope. `presentThreadIds` lists EVERY sync-eligible thread
 * id on the sender and ships only when the serve is COMPLETE (batch under the
 * limit) — the receiver reaps its mirrors of the sender's threads that are
 * missing from it. Deletions have no tombstones: the thread-deleted event
 * only reaches connected peers, so a delete during a disconnect would
 * otherwise leave the mirror behind forever. Legacy payloads were a bare
 * thread array — still accepted (no reconcile possible without a sender).
 */
const syncedThreadsEnvelopeSchema = z.object({
  senderInstanceId: z.string().nullable(),
  threads: z.array(syncedThreadSchema),
  presentThreadIds: z.array(z.string().uuid()).optional(),
  /**
   * The sender's OWN private/background folder rows (SAME ids everywhere).
   * The receiver upserts them under its REMOTE/<sender>/<segment> scaffold —
   * folders exist BEFORE any thread references them, so no wire ever ships
   * name chains and thread placement is a plain same-id folderId lookup.
   */
  folders: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        parentId: z.string().uuid().nullable(),
        rootFolderId: z.string(),
        icon: z.string().nullable().optional(),
        color: z.string().nullable().optional(),
      }),
    )
    .optional(),
});

const threadsWireSchema = z.union([
  syncedThreadsEnvelopeSchema,
  z.array(syncedThreadSchema).transform((threads) => ({
    senderInstanceId: null,
    threads,
    presentThreadIds: undefined,
    folders: undefined,
  })),
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** One synced folder row — the SAME id travels to every instance. */
export interface SyncedFolderRow {
  id: string;
  name: string;
  parentId: string | null;
  icon?: IconKey | null;
  color?: string | null;
}

/** A thread's origin: owning instance + SAME-ID folder placement. */
export interface ThreadOrigin {
  originInstanceId: string;
  folderId: string | null;
  originRootFolderId: string;
}

/**
 * Describe a thread's ORIGIN for the wire (sender side). Ownership comes from
 * the COLUMN (origin_instance_id, NULL = ours) — placement is never decoded.
 * The folder chain ships as ROWS with PRESERVED ids (root→leaf); the receiver
 * upserts them by id under its REMOTE/<origin>/<segment> scaffold. Threads
 * living under REMOTE/<x> (Remote-tab creations) drop the top instance folder
 * (the receiver's scaffold replaces it) and read as private on the wire.
 * folderById must contain every folder of the user.
 */
export function describeThreadOrigin(
  thread: {
    rootFolderId: string;
    folderId: string | null;
    originInstanceId: string | null;
  },
  selfInstanceId: string,
): ThreadOrigin {
  const isLegacyRemote = thread.rootFolderId === DefaultFolderId.REMOTE;
  return {
    originInstanceId: thread.originInstanceId ?? selfInstanceId,
    // SAME-ID placement: the folder id is identical on every instance —
    // receivers look it up directly (folders sync as first-class items; no
    // wire ever ships name chains).
    folderId: thread.folderId,
    originRootFolderId: isLegacyRemote
      ? DefaultFolderId.PRIVATE
      : thread.rootFolderId,
  };
}

const SYNC_ELIGIBILITY_TTL_MS = 30_000;

/**
 * globalThis-backed so it (a) survives vite SSR module duplication and
 * (b) is safe under circular-import evaluation — the bridge consults
 * eligibility while this module may still be mid-initialization.
 */
function getSyncEligibilityCache(): Map<
  string,
  { eligible: boolean; expires: number }
> {
  const holder = globalThis as {
    __vibeThreadSyncEligibility?: Map<
      string,
      { eligible: boolean; expires: number }
    >;
  };
  holder.__vibeThreadSyncEligibility ??= new Map();
  return holder.__vibeThreadSyncEligibility;
}

/**
 * Whether a thread may leave the instance via thread sync. Pure COLUMN read:
 * INCOGNITO threads have no rows (viewer-local), and transient plumbing
 * threads carry sync_eligible=false — never derived from folder names.
 * Missing thread → eligible (a deletion may relay after the row is gone; the
 * peer's applier no-ops when irrelevant). Cached per thread (hot relay path).
 */
export async function isThreadSyncEligible(
  userId: string,
  threadId: string,
): Promise<boolean> {
  const now = Date.now();
  const cache = getSyncEligibilityCache();
  const cached = cache.get(threadId);
  if (cached && cached.expires > now) {
    return cached.eligible;
  }
  const [thread] = await db
    .select({
      rootFolderId: chatThreads.rootFolderId,
      syncEligible: chatThreads.syncEligible,
    })
    .from(chatThreads)
    .where(and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)))
    .limit(1);
  if (!thread) {
    return true;
  }
  const eligible =
    thread.syncEligible && thread.rootFolderId !== DefaultFolderId.INCOGNITO;
  cache.set(threadId, {
    eligible,
    expires: now + SYNC_ELIGIBILITY_TTL_MS,
  });
  return eligible;
}

/**
 * The mirror subtree nests the ORIGIN's root under the instance folder:
 * REMOTE/<origin>/private/… and REMOTE/<origin>/background/…. Anything that
 * is not the background root (incl. legacy REMOTE placements) maps to
 * "private".
 */
export function originRootSegment(originRootFolderId: string): string {
  return originRootFolderId === DefaultFolderId.BACKGROUND
    ? "background"
    : "private";
}

/**
 * Resolve the scaffold folder id for a foreign-origin thread mirror.
 * The scaffold REMOTE/<originInstanceId>/<private|background> is guaranteed to
 * exist from the moment a connection is live (created in onConnectionEstablished).
 * Returns the scaffold folder id, or null if it hasn't been created yet (race
 * during the very first connection exchange before onConnectionEstablished runs).
 */
export async function resolveScaffoldFolderId(
  userId: string,
  originInstanceId: string,
  originRootFolderId: string,
): Promise<string | null> {
  const segment = originRootSegment(originRootFolderId);
  // Walk REMOTE → <originInstanceId> → <segment> by name to find the leaf.
  const [instanceFolder] = await db
    .select({ id: chatFolders.id })
    .from(chatFolders)
    .where(
      and(
        eq(chatFolders.userId, userId),
        eq(
          chatFolders.rootFolderId,
          DefaultFolderId.REMOTE as (typeof chatFolders.$inferSelect)["rootFolderId"],
        ),
        eq(chatFolders.name, originInstanceId),
        isNull(chatFolders.parentId),
      ),
    )
    .limit(1);
  if (!instanceFolder) {
    return null;
  }
  const [segmentFolder] = await db
    .select({ id: chatFolders.id })
    .from(chatFolders)
    .where(
      and(
        eq(chatFolders.userId, userId),
        eq(
          chatFolders.rootFolderId,
          DefaultFolderId.REMOTE as (typeof chatFolders.$inferSelect)["rootFolderId"],
        ),
        eq(chatFolders.name, segment),
        eq(chatFolders.parentId, instanceFolder.id),
      ),
    )
    .limit(1);
  return segmentFolder?.id ?? null;
}

/**
 * Race-proof select-or-create of ONE folder segment. Concurrent creators
 * (live thread-updated appliers, message-stub placement, relay landings, the
 * pull-sync applier) previously raced select-then-insert and produced
 * duplicate sibling folders. A transaction-scoped advisory lock keyed on the
 * exact segment identity serializes creation without constraining user-named
 * folders elsewhere.
 */
async function selectOrCreateFolderSegment(
  userId: string,
  rootFolderId: string,
  name: string,
  parentId: string | null,
  icon?: IconKey | null,
  color?: string | null,
  pinned?: boolean,
): Promise<string | null> {
  const lockKey = `${userId}|${rootFolderId}|${parentId ?? ""}|${name}`;
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`,
    );
    const [existing]: Array<{ id: string }> = await tx
      .select({ id: chatFolders.id })
      .from(chatFolders)
      .where(
        and(
          eq(chatFolders.userId, userId),
          eq(
            chatFolders.rootFolderId,
            rootFolderId as (typeof chatFolders.$inferSelect)["rootFolderId"],
          ),
          eq(chatFolders.name, name),
          parentId === null
            ? isNull(chatFolders.parentId)
            : eq(chatFolders.parentId, parentId),
        ),
      )
      .limit(1);
    if (existing) {
      return existing.id;
    }
    const [created]: Array<{ id: string }> = await tx
      .insert(chatFolders)
      .values({
        userId,
        rootFolderId:
          rootFolderId as (typeof chatFolders.$inferInsert)["rootFolderId"],
        name,
        parentId,
        icon: icon ?? null,
        color: color ?? null,
        pinned: pinned ?? false,
      })
      .returning({ id: chatFolders.id });
    return created?.id ?? null;
  });
}

/**
 * Race-proof find-or-create of a folder NAME chain under a root. Shared by
 * every system that materializes placement chains (mirror placement, relay
 * executor landings). Returns the leaf folder id.
 * `pinnedLeaf` pins only the final segment (e.g. scaffold private/background).
 */
export async function ensureFolderChain(
  userId: string,
  rootFolderId: string,
  names: readonly string[],
  pinnedLeaf?: boolean,
): Promise<string | null> {
  try {
    let parentId: string | null = null;
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const isLeaf = i === names.length - 1;
      parentId = await selectOrCreateFolderSegment(
        userId,
        rootFolderId,
        name,
        parentId,
        null,
        null,
        isLeaf && pinnedLeaf ? true : undefined,
      );
      if (parentId === null) {
        return null;
      }
    }
    return parentId;
  } catch {
    return null;
  }
}

/**
 * Materialize a FOREIGN-origin folder chain with PRESERVED ids under the
 * REMOTE/<originInstanceId>/<private|background> scaffold. Folders sync like
 * threads/messages — SAME id on every instance; upsert-by-id makes this
 * idempotent, re-parenting/renaming follow the origin. Returns the leaf id
 * (identical to the origin's) or the scaffold id for an empty chain.
 */
export async function ensureMirrorFolders(
  userId: string,
  originInstanceId: string,
  originRootFolderId: string,
  folderChain: readonly SyncedFolderRow[],
): Promise<string | null> {
  const scaffoldId = await ensureFolderChain(userId, DefaultFolderId.REMOTE, [
    originInstanceId,
    originRootSegment(originRootFolderId),
  ]);
  if (scaffoldId === null) {
    return null;
  }
  let leafId: string | null = scaffoldId;
  for (const row of folderChain) {
    // Reserved scaffold names never arrive as chain content — a wire that
    // carries one is echoing a receiver-local scaffold (corruption signal).
    if (row.name === "private" || row.name === "background") {
      continue;
    }
    // A row that already exists OUTSIDE the REMOTE root is a LOCAL ORIGINAL —
    // we ARE that folder's origin. Mirroring must NEVER steal or re-parent
    // originals; the id resolves as-is.
    const [existingRow]: Array<{
      id: string;
      rootFolderId: string;
      parentId: string | null;
    }> = await db
      .select({
        id: chatFolders.id,
        rootFolderId: chatFolders.rootFolderId,
        parentId: chatFolders.parentId,
      })
      .from(chatFolders)
      .where(eq(chatFolders.id, row.id))
      .limit(1);
    if (existingRow && existingRow.rootFolderId !== DefaultFolderId.REMOTE) {
      leafId = existingRow.id;
      continue;
    }
    // REMOTE-rooted rows split two ways: MIRRORS live inside the scaffold
    // subtree (REMOTE/<origin>/<private|background>/…), while Remote-tab
    // ORIGINALS live directly under REMOTE/<instance>/… — the SAME ids ride
    // an executor's echo of a relay landing, and re-parenting an original
    // under the scaffold corrupts the caller's tree. Only rows whose CURRENT
    // ancestry passes through this origin's scaffold may be re-parented.
    if (existingRow) {
      let insideScaffold = false;
      let walk: string | null = existingRow.parentId;
      for (let depth = 0; depth < 32 && walk; depth++) {
        if (walk === scaffoldId) {
          insideScaffold = true;
          break;
        }
        const [wRow]: Array<{ parentId: string | null }> = await db
          .select({ parentId: chatFolders.parentId })
          .from(chatFolders)
          .where(eq(chatFolders.id, walk))
          .limit(1);
        walk = wRow?.parentId ?? null;
      }
      if (!insideScaffold) {
        leafId = existingRow.id;
        continue;
      }
    }
    let parentId = row.parentId ?? scaffoldId;
    if (parentId === row.id) {
      parentId = scaffoldId;
    }
    if (row.parentId) {
      // Out-of-order tolerance: a parent that has not synced yet falls back
      // to the scaffold; a later chain upsert re-parents it (upsert-by-id).
      const [parentRow]: Array<{ id: string }> = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(eq(chatFolders.id, row.parentId))
        .limit(1);
      if (!parentRow) {
        parentId = scaffoldId;
      }
    }
    // Cycle-proofing: never re-parent a row under its own descendant.
    let ancestor: string | null = parentId;
    for (let depth = 0; depth < 32 && ancestor; depth++) {
      if (ancestor === row.id) {
        parentId = scaffoldId;
        break;
      }
      const [parentRow2]: Array<{ parentId: string | null }> = await db
        .select({ parentId: chatFolders.parentId })
        .from(chatFolders)
        .where(eq(chatFolders.id, ancestor))
        .limit(1);
      ancestor = parentRow2?.parentId ?? null;
    }
    if (existingRow) {
      const [current]: Array<{ parentId: string | null }> = await db
        .select({ parentId: chatFolders.parentId })
        .from(chatFolders)
        .where(eq(chatFolders.id, row.id))
        .limit(1);
      if (current && current.parentId !== parentId) {
        // Re-parenting an existing mirror row — legitimate when the origin
        // moved the folder, but the historical corruption vector. Loud trail.
        // eslint-disable-next-line no-console
        console.warn("[MirrorFolders] RE-PARENT", {
          folderId: row.id,
          name: row.name,
          from: current.parentId,
          to: parentId,
          originInstanceId,
          originRootFolderId,
          stack: new Error("re-parent-trail").stack,
        });
      }
    }
    try {
      await db
        .insert(chatFolders)
        .values({
          id: row.id,
          userId,
          rootFolderId: DefaultFolderId.REMOTE,
          name: row.name,
          parentId,
          icon: row.icon ?? null,
          color: row.color ?? null,
        })
        .onConflictDoUpdate({
          target: chatFolders.id,
          set: {
            name: row.name,
            parentId,
            updatedAt: new Date(),
            icon: row.icon ?? null,
            color: row.color ?? null,
          },
        });
      leafId = row.id;
    } catch {
      return null;
    }
  }
  return leafId;
}

/**
 * Push the thread's full ancestor folder chain (root→leaf) as ONE
 * `folder-created` remoteEvent so the receiver's `applyRemoteFolderCreated`
 * materializes the SAME-ID chain under its REMOTE/<origin>/<segment> scaffold
 * BEFORE the thread-updated event references that folderId.
 *
 * Why this is load-bearing (not redundant with the live create-time emit):
 * folder-created fires once, at real creation time. A folder created while the
 * peer link was down — or before that connection enabled `threads` sync — never
 * reaches the peer, so a later thread mirror references a folderId the peer has
 * never seen and the mirrored thread falls to the REMOTE root. Re-shipping the
 * chain on every thread push is the self-healing mechanism: the appliers are
 * idempotent SAME-ID upserts, so a re-ship is a no-op when already present and a
 * repair when not. Chain rows carry their real `rootFolderId` (REMOTE for
 * Remote-tab creations, PRIVATE/BACKGROUND otherwise) — the applier reads it to
 * pick the origin-root scaffold.
 */
/**
 * Push a folder's ancestor chain (root→leaf) to a peer as a `folder-created`
 * remote event so the receiver materializes the SAME-ID chain under its
 * REMOTE/<origin>/<segment> scaffold. When `targetInstanceId` is given the push
 * is point-to-point AND awaited on the bridge, so — paired with a relay that
 * dispatches AFTER this resolves — the folders exist before the receiver creates
 * the mirror thread (no create-time placement race). With no target it fans out
 * to every peer (the self-healing thread-push variant).
 */
export async function pushFolderChainToPeer(
  folderId: string,
  userId: string,
  targetInstanceId: string | undefined,
  logger: EndpointLogger,
): Promise<void> {
  const chain: SyncedFolderRow[] = [];
  let currentId: string | null = folderId;
  let rootFolderId: string = DefaultFolderId.PRIVATE;
  for (let depth = 0; depth < 32 && currentId; depth++) {
    const [row]: Array<{
      id: string;
      name: string;
      parentId: string | null;
      rootFolderId: string;
      icon: IconKey | null;
      color: string | null;
    }> = await db
      .select({
        id: chatFolders.id,
        name: chatFolders.name,
        parentId: chatFolders.parentId,
        rootFolderId: chatFolders.rootFolderId,
        icon: chatFolders.icon,
        color: chatFolders.color,
      })
      .from(chatFolders)
      .where(and(eq(chatFolders.id, currentId), eq(chatFolders.userId, userId)))
      .limit(1);
    if (!row) {
      break;
    }
    rootFolderId = row.rootFolderId;
    // Boundary of the origin's own subtree. Under REMOTE, the top instance-tab
    // folder (root REMOTE, parentId null) and the private/background scaffold
    // segment are the RECEIVER's scaffold — it recreates them itself; shipping
    // them would upsert spurious content folders named after the instance/
    // segment. Stop before the instance-tab; the applier name-skips the segment.
    if (row.rootFolderId === DefaultFolderId.REMOTE && row.parentId === null) {
      break;
    }
    chain.unshift({
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      icon: row.icon,
      color: row.color,
    });
    currentId = row.parentId;
  }
  if (chain.length === 0) {
    return;
  }
  const [{ createFolderContentsEmitter }, folderContentsDefinitions] =
    await Promise.all([
      import("next-vibe/agent/chat/folder-contents/[rootFolderId]/emitter"),
      import("next-vibe/agent/chat/folder-contents/[rootFolderId]/definition"),
    ]);
  const emitUser: JwtPrivatePayloadType = {
    id: userId,
    leadId: userId,
    isPublic: false,
    roles: [],
  };
  const items = chain.map((row) => ({
    id: row.id,
    type: "folder" as const,
    name: row.name,
    icon: row.icon ?? null,
    color: row.color ?? null,
    parentId: row.parentId,
    sortOrder: 0,
    rootFolderId: rootFolderId as DefaultFolderId,
    createdAt: new Date(),
    updatedAt: new Date(),
    expanded: false,
    canManage: true,
    canCreateThread: true,
    canModerate: true,
    canDelete: true,
    canManagePermissions: true,
    rolesView: [],
    rolesManage: [],
    rolesCreateThread: [],
    rolesPost: [],
    rolesModerate: [],
    rolesAdmin: [],
  }));
  // Fan-out path (no target): the emitter's own relay reaches every peer. It is
  // fire-and-forget, which is fine for the self-heal-on-every-turn use.
  if (!targetInstanceId) {
    createFolderContentsEmitter(
      logger,
      emitUser,
      rootFolderId as DefaultFolderId,
      {
        fanOut: true,
      },
    )("folder-created", { responseData: { items } });
    return;
  }
  // Point-to-point AWAITED path (relay pre-flight): push directly through the
  // bridge to exactly the relay peer and AWAIT it, so the folders are on the
  // receiver before the relay dispatch creates the mirror thread. The emitter's
  // built-in relay is fire-and-forget; calling the bridge directly lets us await.
  const { RemoteEventBridgeRepository } =
    await import("next-vibe/realtime/remote-event-bridge/repository");
  const { buildWsChannel } = await import("next-vibe/realtime/channel");
  const def = folderContentsDefinitions.default.GET;
  const urlPathParams = { rootFolderId: DefaultFolderId.REMOTE };
  const channel = buildWsChannel(
    def,
    urlPathParams,
    { subFolderId: undefined, threadIds: undefined },
    logger,
  );
  await RemoteEventBridgeRepository.pushRemoteEvent({
    userId,
    logger,
    syncDomain: "threads",
    targetInstanceId,
    envelope: {
      endpointPath: def.path,
      endpointMethod: def.method,
      eventName: "folder-created",
      responseData: { items },
      requestData: undefined,
      urlPathParams,
      payload: undefined,
      channel,
    },
  });
}

export async function pushThreadSync(
  threadId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    const [thread] = await db
      .select({
        rootFolderId: chatThreads.rootFolderId,
        title: chatThreads.title,
        description: chatThreads.description,
        folderId: chatThreads.folderId,
        status: chatThreads.status,
        originInstanceId: chatThreads.originInstanceId,
        syncEligible: chatThreads.syncEligible,
      })
      .from(chatThreads)
      .where(and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)))
      .limit(1);
    // COLUMN-gated: incognito never persists server-side; transient plumbing
    // threads carry sync_eligible=false. Never derived from folder names.
    if (
      !thread ||
      thread.rootFolderId === DefaultFolderId.INCOGNITO ||
      !thread.syncEligible
    ) {
      return;
    }
    // Bump the thread updatedAt so the PULL path re-serves it too: the sync
    // provider selects threads by thread.updatedAt, and an out-of-band message
    // change (detach/wakeUp backfill) may not have touched the thread row.
    const updatedAt = new Date();
    await db
      .update(chatThreads)
      .set({ updatedAt })
      .where(eq(chatThreads.id, threadId));

    // Self-heal the folder placement FIRST: re-ship the thread's ancestor
    // folder chain (SAME-ID, idempotent) so the receiver has materialized the
    // target folder before the thread-updated below references its folderId.
    // Without this a folder created pre-sync (peer down / threads-sync toggled
    // on after the folder existed) is unknown to the peer and the mirror lands
    // at the REMOTE root. No-op for a root-level thread (folderId null).
    if (thread.folderId) {
      await pushFolderChainToPeer(thread.folderId, userId, undefined, logger);
    }

    // Relay this thread as the [threadId] PATCH thread-updated remoteEvent —
    // regular fields ONLY. folderId is the SAME id on every instance (folders
    // sync by id via the folder-created/updated/deleted events); ownership is
    // the receiver's own origin_instance_id column + the bridge wire's sender
    // label. No payload.
    const [{ createEndpointEmitter }, { default: threadsByIdDefinitions }] =
      await Promise.all([
        import("next-vibe/realtime/emitter"),
        import("next-vibe/agent/chat/threads/[threadId]/definition"),
      ]);
    const user: JwtPrivatePayloadType = {
      id: userId,
      leadId: userId,
      isPublic: false,
      roles: [],
    };

    createEndpointEmitter(threadsByIdDefinitions.PATCH, logger, user, {
      urlPathParams: { threadId },
    })("thread-updated", {
      requestData: {
        title: thread.title,
        description: thread.description,
        folderId: thread.folderId,
        status: thread.status,
        rootFolderId: thread.rootFolderId,
      },
      responseData: { updatedAt },
    });
  } catch (error) {
    logger.debug("[pushThreadSync] best-effort push failed", {
      threadId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const threadsSyncProvider: SyncProvider = {
  // Connect-time scaffold: REMOTE/<peer>/private + REMOTE/<peer>/background
  // exist from the moment the link is live — every mirror (sync AND relay
  // landing) hangs off these stable roots; no wire ever ships name chains.
  // Both are pinned so they stay anchored at the top of the REMOTE subfolder.
  async onConnectionEstablished(userId, peerInstanceId): Promise<void> {
    await ensureFolderChain(
      userId,
      DefaultFolderId.REMOTE,
      [peerInstanceId, "private"],
      true,
    );
    await ensureFolderChain(
      userId,
      DefaultFolderId.REMOTE,
      [peerInstanceId, "background"],
      true,
    );
  },

  // Thread-scoped relay gate: incognito and transient (sync_eligible=false)
  // threads are instance-local — their events must never cross (they would
  // materialize orphan mirror stubs on peers).
  async remoteEventGate(userId, urlPathParams): Promise<boolean> {
    const threadId = urlPathParams?.["threadId"];
    if (typeof threadId !== "string" || threadId.length === 0) {
      return true;
    }
    return isThreadSyncEligible(userId, threadId);
  },
  key: "threads",
  labelKey: "threads",

  async getCursor(userId): Promise<ThreadsSyncCursor> {
    // Single aggregation query: max thread updatedAt and per-thread message
    // high-water marks in one pass, avoiding a full table load into memory.
    const [threadMaxRow] = await db
      .select({ maxUpdatedAt: max(chatThreads.updatedAt) })
      .from(chatThreads)
      .where(eq(chatThreads.userId, userId));

    if (!threadMaxRow?.maxUpdatedAt) {
      return { threadsCursor: new Date(0).toISOString(), messageCursors: {} };
    }

    const threadsCursor = threadMaxRow.maxUpdatedAt.toISOString();

    // Per-thread message cursors via subquery — avoids shipping all thread IDs
    // over the wire in a potentially huge IN clause.
    const messageCursors: Record<string, string> = {};
    const lastMessageRows = await db
      .select({
        threadId: chatMessages.threadId,
        lastUpdatedAt: max(chatMessages.updatedAt),
      })
      .from(chatMessages)
      .where(
        inArray(
          chatMessages.threadId,
          db
            .select({ id: chatThreads.id })
            .from(chatThreads)
            .where(eq(chatThreads.userId, userId)),
        ),
      )
      .groupBy(chatMessages.threadId);
    for (const row of lastMessageRows) {
      if (row.lastUpdatedAt) {
        messageCursors[row.threadId] = row.lastUpdatedAt.toISOString();
      }
    }

    return { threadsCursor, messageCursors };
  },

  async serializeFromCursor(userId, cursor, logger) {
    const typedCursor = toThreadsCursor(cursor);
    const fallbackCursor: ThreadsSyncCursor = {
      threadsCursor: typedCursor?.threadsCursor ?? new Date(0).toISOString(),
      messageCursors: typedCursor?.messageCursors ?? {},
    };
    try {
      // Serves threads newer than the cursor (ascending updatedAt) in BOUNDED
      // batches, each with ALL its messages newer than that thread's message
      // cursor. The cursor of the last served thread is the watermark; a peer
      // with a stale/zero cursor converges over several pulls instead of
      // serializing the entire history in one payload (which OOMs on large DBs:
      // thousands of threads × tens of thousands of messages → multi-hundred-MB
      // JSON.stringify). THREAD_SYNC_BATCH bounds each payload; the `>=` filter
      // re-serves the boundary thread idempotently so no thread is skipped when
      // several share the same updatedAt at the batch edge.
      // The sender's OWN private/background folders ride every exchange —
      // small bounded set, idempotent same-id upserts on the receiver. This
      // (plus live folder-created events + the connect-time scaffold) is why
      // no wire ever needs folder name chains.
      const ownFolders = await db
        .select({
          id: chatFolders.id,
          name: chatFolders.name,
          parentId: chatFolders.parentId,
          rootFolderId: chatFolders.rootFolderId,
          icon: chatFolders.icon,
          color: chatFolders.color,
        })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, userId),
            inArray(chatFolders.rootFolderId, [
              DefaultFolderId.PRIVATE,
              DefaultFolderId.BACKGROUND,
            ]),
          ),
        );

      const THREAD_SYNC_BATCH = 200;
      const threads = await db
        .select()
        .from(chatThreads)
        .where(
          typedCursor
            ? and(
                eq(chatThreads.userId, userId),
                // Pass cursor as a raw SQL string literal to avoid pg driver timezone
                // conversion. The DB stores TIMESTAMP WITHOUT TIMEZONE in local time;
                // new Date(cursor) → pg converts to local+offset, skewing comparison.
                sql`${chatThreads.updatedAt} >= ${typedCursor.threadsCursor}::timestamp`,
              )
            : eq(chatThreads.userId, userId),
        )
        .orderBy(asc(chatThreads.updatedAt))
        .limit(THREAD_SYNC_BATCH);

      const result: SyncedThread[] = [];

      // Byte budget: a single thread with fat message content (media data-URLs)
      // can be multiple MB; 200 such threads in one payload reached ~180MB and
      // wedged the receiving instance for tens of seconds. Cap the serialized
      // payload by BYTES, not just count — once the budget is hit, stop and let
      // the peer's next (cursor-advanced) pull fetch the rest. Always include at
      // least the first thread so a single oversized thread still makes progress.
      const THREAD_SYNC_BUDGET_BYTES = 8_000_000; // ~8MB per exchange
      let serializedBytes = 0;
      let byteTruncated = false;

      // Resolve each thread's ORIGIN (owning instance + folder name chain) —
      // the receiver places foreign-origin threads by SAME-ID folder lookup.
      const { RemoteConnectionRepository } =
        await import("next-vibe/remote-connection/repository");
      const selfInstanceId =
        await RemoteConnectionRepository.getLocalInstanceId(userId);

      // Load messages in two passes — split by ownership so cursor filtering
      // can be applied at the DB level for own-origin threads.
      //
      // Foreign-origin: owner-authoritative → serve ALL messages so the peer's
      // mirror is always complete. Cursor doesn't apply.
      //
      // Own-origin: cursor-filtered. Use the minimum message cursor across the
      // own-origin set as a global DB prefilter (returns a superset), then
      // refine per-thread in the in-memory filter below. This avoids loading
      // already-delivered messages on incremental syncs.
      const messagesByThreadId = new Map<string, ChatMessage[]>();
      if (threads.length > 0) {
        // Partition thread ids by origin so each class gets the right query.
        const foreignIds: string[] = [];
        const ownIds: string[] = [];
        for (const t of threads) {
          if (t.rootFolderId === DefaultFolderId.INCOGNITO || !t.syncEligible) {
            continue;
          }
          const { originInstanceId } = describeThreadOrigin(t, selfInstanceId);
          if (originInstanceId !== selfInstanceId) {
            foreignIds.push(t.id);
          } else {
            ownIds.push(t.id);
          }
        }

        const fetchMessages = async (
          threadIds: string[],
          minUpdatedAt?: string,
        ): Promise<void> => {
          if (threadIds.length === 0) {
            return;
          }
          const where = minUpdatedAt
            ? and(
                inArray(chatMessages.threadId, threadIds),
                sql`${chatMessages.updatedAt} > ${minUpdatedAt}::timestamp`,
              )
            : inArray(chatMessages.threadId, threadIds);
          const rows = await db
            .select(CHAT_MESSAGE_COLUMNS)
            .from(chatMessages)
            .where(where)
            .orderBy(asc(chatMessages.createdAt));
          for (const message of rows) {
            const group = messagesByThreadId.get(message.threadId);
            if (group) {
              group.push(message);
            } else {
              messagesByThreadId.set(message.threadId, [message]);
            }
          }
        };

        // Foreign-origin: no cursor limit — mirror needs complete history.
        await fetchMessages(foreignIds);

        // Own-origin: prefilter by the minimum per-thread message cursor so
        // the DB only returns candidates that changed since the peer last saw
        // them. Per-thread refinement happens in the in-memory filter below.
        if (ownIds.length > 0) {
          const ownCursors = ownIds
            .map((id) => typedCursor?.messageCursors[id])
            .filter((c): c is string => c !== undefined);
          const minCursor =
            ownCursors.length > 0
              ? ownCursors.reduce((a, b) => (a < b ? a : b))
              : undefined;
          await fetchMessages(ownIds, minCursor);
        }
      }

      for (const thread of threads) {
        // COLUMN-gated: incognito has no server rows; transient plumbing
        // threads carry sync_eligible=false. Same rule as the live gates.
        if (
          thread.rootFolderId === DefaultFolderId.INCOGNITO ||
          !thread.syncEligible
        ) {
          continue;
        }
        const origin = describeThreadOrigin(thread, selfInstanceId);
        // Foreign-origin threads are OWNED by that instance — the receiver's
        // copy is a mirror and applies owner-authoritatively.
        const isForeignOrigin = origin.originInstanceId !== selfInstanceId;

        // Return messages changed since the cursor — by updatedAt, not just
        // createdAt, so an IN-PLACE edit (detach/wakeUp result backfill bumps
        // updatedAt but keeps createdAt) is re-served and mirrored. The cursor
        // is the updatedAt high-water mark of the served batch.
        // REMOTE-folder threads (instanceId set) are owner-authoritative on the
        // receiver: serve ALL their messages so any out-of-band re-parent or
        // backfill is delivered in full — the receiver applies unconditionally
        // and idempotently, so there is nothing to miss at a cursor boundary.
        const isOwnerAuthoritative = isForeignOrigin;
        const msgCursor = typedCursor?.messageCursors[thread.id] ?? null;
        const msgCursorTime = msgCursor ? new Date(msgCursor).getTime() : null;
        const messages = (messagesByThreadId.get(thread.id) ?? []).filter(
          (m) =>
            // Never ship compacting messages to peers — they are a local
            // context-management detail. The receiver already has the messages
            // in their original (pre-compaction) form from relay events.
            !m.metadata?.isCompacting &&
            (isOwnerAuthoritative ||
              msgCursorTime === null ||
              m.updatedAt.getTime() > msgCursorTime),
        );

        const serializedThread: SyncedThread = {
          id: thread.id,
          originInstanceId: origin.originInstanceId,
          loopInstanceId: thread.loopInstanceId ?? null,
          folderId: origin.folderId,
          originRootFolderId: origin.originRootFolderId,
          title: thread.title,
          status: thread.status,
          defaultModel: thread.defaultModel ?? null,
          defaultSkill: thread.defaultSkill ?? null,
          systemPrompt: thread.systemPrompt ?? null,
          description: thread.description ?? null,
          tags: thread.tags ?? [],
          pinned: thread.pinned,
          archived: thread.archived,
          updatedAt: thread.updatedAt.toISOString(),
          messages: messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content ?? null,
            parentId: m.parentId ?? null,
            sequenceId: m.sequenceId ?? null,
            authorId: m.authorId ?? null,
            authorName: m.authorName ?? null,
            isAI: m.isAI,
            model: m.model ?? null,
            skill: m.skill ?? null,
            metadata: (m.metadata ?? null) as MessageMetadata | null,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
          })),
        };

        // Enforce the byte budget: stop BEFORE pushing a thread that would take
        // the payload over budget — but always keep the first thread so a lone
        // oversized thread still makes forward progress. The cursor (below) is
        // derived from the LAST included thread, so the peer resumes exactly
        // here on its next pull; no thread is skipped or lost.
        const threadBytes = Buffer.byteLength(
          JSON.stringify(serializedThread),
          "utf8",
        );
        if (
          result.length > 0 &&
          serializedBytes + threadBytes > THREAD_SYNC_BUDGET_BYTES
        ) {
          byteTruncated = true;
          break;
        }
        serializedBytes += threadBytes;
        result.push(serializedThread);
      }

      // Cursor derived from the served threads — the batch high-water mark.
      const lastThread = result[result.length - 1];
      const threadsCursor = lastThread
        ? lastThread.updatedAt
        : fallbackCursor.threadsCursor;

      // Merge message cursors: keep the peer's known per-thread cursors and
      // advance threads served in this batch to the MAX updatedAt of the
      // served messages (messages are ordered by createdAt for FK-safe insert,
      // so the last element is not necessarily the latest updatedAt — e.g. a
      // backfilled early message). Matches the updatedAt-based serve filter.
      const messageCursors: Record<string, string> = {
        ...typedCursor?.messageCursors,
      };
      for (const servedThread of result) {
        let maxUpdatedAt: string | null = null;
        for (const m of servedThread.messages) {
          if (maxUpdatedAt === null || m.updatedAt > maxUpdatedAt) {
            maxUpdatedAt = m.updatedAt;
          }
        }
        if (maxUpdatedAt !== null) {
          messageCursors[servedThread.id] = maxUpdatedAt;
        }
      }

      // Full-presence manifest — only when this batch COMPLETES the serve
      // (raw batch under the limit AND not byte-truncated), so a receiver never
      // reaps against a partial view of our threads.
      let presentThreadIds: string[] | undefined;
      if (threads.length < THREAD_SYNC_BATCH && !byteTruncated) {
        const presentRows = await db
          .select({ id: chatThreads.id })
          .from(chatThreads)
          .where(
            and(
              eq(chatThreads.userId, userId),
              eq(chatThreads.syncEligible, true),
              ne(chatThreads.rootFolderId, DefaultFolderId.INCOGNITO),
            ),
          );
        presentThreadIds = presentRows.map((r) => r.id);
      }

      return {
        json: JSON.stringify({
          senderInstanceId: selfInstanceId,
          threads: result,
          folders: ownFolders,
          ...(presentThreadIds !== undefined && { presentThreadIds }),
        }),
        cursor: { threadsCursor, messageCursors },
      };
    } catch (error) {
      logger.error("Failed to serialize threads for sync", parseError(error));
      // Serve nothing and keep the peer's cursor unchanged — never advance
      // past data that was not delivered.
      return { json: "[]", cursor: fallbackCursor };
    }
  },

  async upsertFromJson(json, userId, logger) {
    const {
      senderInstanceId,
      threads: remoteThreads,
      presentThreadIds,
      folders: remoteFolders,
    } = threadsWireSchema.parse(JSON.parse(json));
    let synced = 0;

    // Placement: foreign-origin threads land at REMOTE/<origin>/<folderPath>;
    // OWN threads (origin === our selfInstanceId) are never re-placed by a
    // peer's echo. Cache resolved chains per origin+path.
    const { RemoteConnectionRepository } =
      await import("next-vibe/remote-connection/repository");
    const selfInstanceId =
      await RemoteConnectionRepository.getLocalInstanceId(userId);

    // The sender's OWN folders land FIRST (same ids, under our
    // REMOTE/<sender>/<segment> scaffold) — every thread that references one
    // of them then places with a plain same-id lookup. Never applied for our
    // own echo (senderInstanceId === self).
    if (
      remoteFolders &&
      remoteFolders.length > 0 &&
      senderInstanceId &&
      senderInstanceId !== selfInstanceId
    ) {
      const byRoot = new Map<string, typeof remoteFolders>();
      for (const row of remoteFolders) {
        const bucket = byRoot.get(row.rootFolderId) ?? [];
        bucket.push(row);
        byRoot.set(row.rootFolderId, bucket);
      }
      for (const [originRoot, rows] of byRoot) {
        await ensureMirrorFolders(
          userId,
          senderInstanceId,
          originRoot,
          // Structural fields only — icon/color are wire strings, not the
          // typed IconKey union; mirrors keep defaults.
          rows.map((row) => ({
            id: row.id,
            name: row.name,
            parentId: row.parentId,
          })),
        );
      }
    }
    const folderCache = new Map<string, string | null>();
    const scaffoldCache = new Map<string, string | null>();

    // Load existing threads and messages for the incoming ids up front
    const remoteThreadIds = remoteThreads.map((t) => t.id);
    const existingThreadRows =
      remoteThreadIds.length > 0
        ? await db
            .select({
              id: chatThreads.id,
              updatedAt: chatThreads.updatedAt,
              loopInstanceId: chatThreads.loopInstanceId,
            })
            .from(chatThreads)
            .where(
              and(
                inArray(chatThreads.id, remoteThreadIds),
                eq(chatThreads.userId, userId),
              ),
            )
        : [];
    const existingThreadById = new Map(
      existingThreadRows.map((t) => [t.id, t]),
    );

    const remoteMessageIds = remoteThreads.flatMap((t) =>
      t.messages.map((m) => m.id),
    );
    const existingMessageById = new Map<
      string,
      { id: string; updatedAt: Date }
    >();
    for (let i = 0; i < remoteMessageIds.length; i += 5000) {
      const idBatch = remoteMessageIds.slice(i, i + 5000);
      const rows = await db
        .select({ id: chatMessages.id, updatedAt: chatMessages.updatedAt })
        .from(chatMessages)
        .where(inArray(chatMessages.id, idBatch));
      for (const row of rows) {
        existingMessageById.set(row.id, row);
      }
    }

    // New rows are collected and inserted after the loop — threads first so
    // their messages can reference them
    const threadInsertRows: (typeof chatThreads.$inferInsert)[] = [];
    const messageInsertRows: (typeof chatMessages.$inferInsert)[] = [];

    for (const remoteThread of remoteThreads) {
      try {
        // We are the MIRROR for every foreign-origin thread — the owner's copy
        // is authoritative and it lands under REMOTE/<origin>/<folderPath>.
        const isForeignOrigin =
          remoteThread.originInstanceId !== selfInstanceId;
        logger.debug("[ThreadsSync] upsert decision", {
          threadId: remoteThread.id,
          wireOrigin: remoteThread.originInstanceId,
          selfInstanceId,
          isForeignOrigin,
          existing: existingThreadById.has(remoteThread.id),
          wireFolderId: remoteThread.folderId,
        });
        // Placement is a plain SAME-ID lookup: the sender's folders landed
        // above (and continuously via folder events + the connect scaffold)
        // — no chains ride any wire. When the specific folder hasn't synced
        // yet, fall back to the scaffold (REMOTE/<origin>/private|background)
        // so the thread always lands inside the correct instance subtree
        // rather than at the REMOTE root. The next exchange heals it to the
        // correct sub-folder via the same-id lookup succeeding then.
        let folderId: string | null = null;
        if (isForeignOrigin) {
          if (remoteThread.folderId) {
            const cached = folderCache.get(remoteThread.folderId);
            if (cached !== undefined) {
              folderId = cached;
            } else {
              const [folderRow] = await db
                .select({ id: chatFolders.id })
                .from(chatFolders)
                .where(
                  and(
                    eq(chatFolders.id, remoteThread.folderId),
                    eq(chatFolders.userId, userId),
                  ),
                )
                .limit(1);
              folderId = folderRow ? remoteThread.folderId : null;
              folderCache.set(remoteThread.folderId, folderId);
            }
          }
          // Fallback: when the specific folder didn't resolve, place inside
          // the scaffold so the thread never surfaces at the REMOTE root.
          if (folderId === null) {
            const scaffoldKey = `${remoteThread.originInstanceId}|${remoteThread.originRootFolderId}`;
            if (scaffoldCache.has(scaffoldKey)) {
              folderId = scaffoldCache.get(scaffoldKey) ?? null;
            } else {
              folderId = await resolveScaffoldFolderId(
                userId,
                remoteThread.originInstanceId,
                remoteThread.originRootFolderId,
              );
              scaffoldCache.set(scaffoldKey, folderId);
            }
          }
        }

        const existing = existingThreadById.get(remoteThread.id);

        const remoteTime = new Date(remoteThread.updatedAt).getTime();
        const ownerAuthoritativeThread = isForeignOrigin;

        if (existing) {
          // Owner-authoritative for mirrored threads; else last-writer-wins
          // (tie → remote wins, deterministic tiebreak per spec).
          if (
            ownerAuthoritativeThread ||
            remoteTime >= existing.updatedAt.getTime()
          ) {
            await db
              .update(chatThreads)
              .set({
                title: remoteThread.title,
                status: remoteThread.status,
                defaultModel: remoteThread.defaultModel as ChatModelId | null,
                defaultSkill: remoteThread.defaultSkill,
                systemPrompt: remoteThread.systemPrompt,
                description: remoteThread.description,
                tags: remoteThread.tags,
                pinned: remoteThread.pinned,
                archived: remoteThread.archived,
                // Mirror placement is derived, never user-set: keep it in
                // sync with the origin's folder chain. rootFolderId included:
                // it HEALS a mirror row that was ever created mis-rooted (a
                // foreign thread must always live under the REMOTE root).
                ...(isForeignOrigin && folderId !== null && { folderId }),
                ...(isForeignOrigin && {
                  rootFolderId: DefaultFolderId.REMOTE,
                  originInstanceId: remoteThread.originInstanceId,
                }),
                updatedAt: new Date(remoteThread.updatedAt),
              })
              .where(
                and(
                  eq(chatThreads.id, remoteThread.id),
                  eq(chatThreads.userId, userId),
                ),
              );
          }
        } else {
          // New thread: foreign-origin → REMOTE/<origin>/<folderPath> mirror;
          // own-origin (restoring our own thread from a peer's backup) → the
          // original root, unplaced (the local folder chain may not exist).
          threadInsertRows.push({
            id: remoteThread.id,
            userId,
            rootFolderId: isForeignOrigin
              ? DefaultFolderId.REMOTE
              : (remoteThread.originRootFolderId as (typeof chatThreads.$inferInsert)["rootFolderId"]),
            folderId: folderId ?? undefined,
            // Ownership is a COLUMN — mirrors carry their origin label, own
            // restores stay NULL (ours). Never decoded from folders again.
            originInstanceId: isForeignOrigin
              ? remoteThread.originInstanceId
              : null,
            title: remoteThread.title,
            status: remoteThread.status,
            defaultModel: remoteThread.defaultModel as ChatModelId | null,
            defaultSkill: remoteThread.defaultSkill,
            systemPrompt: remoteThread.systemPrompt,
            description: remoteThread.description,
            tags: remoteThread.tags,
            pinned: remoteThread.pinned,
            archived: remoteThread.archived,
            updatedAt: new Date(remoteThread.updatedAt),
          });
        }

        // A foreign-origin thread is OWNED by that instance from this
        // receiver's view — we are its mirror. The owner's copy is
        // authoritative for structure (parentId, content), so accept it
        // unconditionally instead of LWW: the local mirror's updatedAt is set
        // by the live-relay processor on an independent clock and would race
        // the owner's out-of-band edits (compacting re-parent, detach backfill).
        // Message authority is the WRITER's, not the thread owner's:
        //  - our OWN thread whose loop runs remotely: the serving peer (the
        //    executor) wrote the rows — ADOPT structure + creation time.
        //  - a foreign-origin thread whose loop runs HERE (wire says WE are
        //    the loop instance): the owner's copy mirrors OUR writes — its
        //    echo must NEVER overwrite the executor's truth (the ping-pong
        //    that once rewrote correct rows with stub-corrupted mirrors).
        const loopRunsRemotely = Boolean(
          existingThreadById.get(remoteThread.id)?.loopInstanceId,
        );
        const executorIsHere = remoteThread.loopInstanceId === selfInstanceId;
        const ownerAuthoritative =
          (isForeignOrigin && !executorIsHere) || loopRunsRemotely;
        const skipMessageUpdates = executorIsHere;

        // Upsert messages — owner-authoritative for mirrored threads, else LWW.
        for (const remoteMsg of remoteThread.messages) {
          try {
            const existingMsg = existingMessageById.get(remoteMsg.id);

            const msgRemoteTime = new Date(remoteMsg.updatedAt).getTime();

            if (existingMsg) {
              if (
                !skipMessageUpdates &&
                (ownerAuthoritative ||
                  msgRemoteTime >= existingMsg.updatedAt.getTime())
              ) {
                await db
                  .update(chatMessages)
                  .set({
                    content: remoteMsg.content,
                    // parentId adoption:
                    //  - LWW threads: the remote's parentId IS authoritative.
                    //  - writer-authoritative threads: adopt too — a lost live
                    //    message-created leaves a parentless stub (phantom
                    //    root) only the pull can heal — but ONLY when the
                    //    referenced parent exists locally: the wire filters
                    //    compacting nodes, and a dangling reference must keep
                    //    the local (pre-compaction) chain instead of breaking
                    //    the FK.
                    ...(!ownerAuthoritative && {
                      parentId: remoteMsg.parentId,
                    }),
                    ...(ownerAuthoritative &&
                      (remoteMsg.parentId === null ||
                        existingMessageById.has(remoteMsg.parentId)) && {
                        parentId: remoteMsg.parentId,
                      }),
                    // Wire role heals a mis-roled stub (parent stubs default
                    // to assistant until the real event names the role).
                    role: remoteMsg.role,
                    // Owner-authoritative mirrors HEAL createdAt: a lost live
                    // message-created leaves a delta-built stub stamped with
                    // local arrival time — chain chronology breaks until the
                    // pull restores the owner's authoritative creation time.
                    ...(ownerAuthoritative && {
                      createdAt: new Date(remoteMsg.createdAt),
                    }),
                    sequenceId: remoteMsg.sequenceId,
                    authorId: remoteMsg.authorId,
                    authorName: remoteMsg.authorName,
                    isAI: remoteMsg.isAI,
                    model: remoteMsg.model as ChatModelId | null,
                    skill: remoteMsg.skill,
                    metadata: (remoteMsg.metadata ?? {}) as MessageMetadata,
                    updatedAt: new Date(remoteMsg.updatedAt),
                  })
                  .where(eq(chatMessages.id, remoteMsg.id));
              }
            } else {
              // For owner-authoritative (mirrored) threads, skip empty assistant
              // messages on INSERT. These are streaming-start placeholders that
              // the relay-processor prunes on stream-finished. If sync re-inserts
              // them with the remote's parentId (which differs from the
              // relay-processor's chain), they become dead-end leaves.
              if (
                ownerAuthoritative &&
                remoteMsg.role === "assistant" &&
                !remoteMsg.content
              ) {
                continue;
              }
              messageInsertRows.push({
                id: remoteMsg.id,
                threadId: remoteThread.id,
                role: remoteMsg.role,
                content: remoteMsg.content,
                parentId: remoteMsg.parentId,
                sequenceId: remoteMsg.sequenceId,
                authorId: remoteMsg.authorId,
                authorName: remoteMsg.authorName,
                isAI: remoteMsg.isAI,
                model: remoteMsg.model as ChatModelId | null,
                skill: remoteMsg.skill,
                metadata: (remoteMsg.metadata ?? {}) as MessageMetadata,
                createdAt: new Date(remoteMsg.createdAt),
                updatedAt: new Date(remoteMsg.updatedAt),
              });
            }
          } catch (msgError) {
            logger.error("Failed to upsert synced message", {
              id: remoteMsg.id,
              threadId: remoteThread.id,
              rawError:
                msgError instanceof Error
                  ? `${msgError.name}: ${msgError.message}`
                  : String(msgError),
              stack:
                msgError instanceof Error
                  ? msgError.stack?.split("\n").slice(0, 5).join(" | ")
                  : undefined,
              ...parseError(msgError),
            });
          }
        }

        synced++;
      } catch (error) {
        logger.error("Failed to upsert synced thread", {
          id: remoteThread.id,
          ...parseError(error),
        });
      }
    }

    // Insert new threads first — their messages reference them
    if (threadInsertRows.length > 0) {
      try {
        await db
          .insert(chatThreads)
          .values(threadInsertRows)
          .onConflictDoNothing();
      } catch (error) {
        logger.error("Failed to upsert synced thread", parseError(error));
      }
    }

    // parent_id is a self-FK (chat_messages.parent_id → chat_messages.id). The
    // batch insert violates it (and onConflictDoNothing does NOT catch FK errors,
    // only PK conflicts) whenever a child precedes its parent, OR the parent is
    // absent — e.g. an empty-assistant placeholder skipped above (line ~621), or a
    // parent that lives in a thread outside this bounded sync batch. Reconcile both:
    //   1. Null out parentIds that reference neither an already-persisted message
    //      nor a message in THIS insert set → attach to thread root (no orphan FK).
    //   2. Topologically order so every parent is inserted before its children.
    const insertById = new Map<string, typeof chatMessages.$inferInsert>();
    for (const m of messageInsertRows) {
      if (typeof m.id === "string") {
        insertById.set(m.id, m);
      }
    }
    const parentResolvable = (pid: string): boolean =>
      existingMessageById.has(pid) || insertById.has(pid);
    for (const m of messageInsertRows) {
      if (typeof m.parentId === "string" && !parentResolvable(m.parentId)) {
        m.parentId = null;
      }
    }
    const orderedInserts: (typeof chatMessages.$inferInsert)[] = [];
    const emitted = new Set<string>();
    const place = (id: string): void => {
      if (emitted.has(id)) {
        return;
      }
      const m = insertById.get(id);
      if (!m) {
        return;
      }
      // Parent in THIS batch must be emitted first; parents already in the DB are
      // fine (FK satisfied) and are not in insertById.
      if (typeof m.parentId === "string" && insertById.has(m.parentId)) {
        place(m.parentId);
      }
      emitted.add(id);
      orderedInserts.push(m);
    };
    for (const m of messageInsertRows) {
      if (typeof m.id === "string") {
        place(m.id);
      }
    }

    for (let i = 0; i < orderedInserts.length; i += 1000) {
      const batch = orderedInserts.slice(i, i + 1000);
      try {
        await db.insert(chatMessages).values(batch).onConflictDoNothing();
      } catch (batchError) {
        logger.warn("[SyncProvider] Batch insert failed, retrying row-by-row", {
          batchSize: batch.length,
          error:
            batchError instanceof Error
              ? batchError.message
              : String(batchError),
        });
        // Try one-by-one to find the offending row and log it precisely
        for (const row of batch) {
          try {
            await db.insert(chatMessages).values([row]).onConflictDoNothing();
          } catch (singleError) {
            // pg driver errors carry the real cause on non-enumerable fields
            // (code/detail/constraint/table/column) that JSON.stringify drops to
            // {}. Read them explicitly so the failing constraint is visible.
            const pg = singleError as {
              code?: string;
              detail?: string;
              constraint?: string;
              table?: string;
              column?: string;
              message?: string;
            };
            logger.error(
              `Failed to insert synced message (single): ${pg.code ?? "?"} ${pg.constraint ?? ""} ${pg.detail ?? pg.message ?? String(singleError)} [id=${row.id} threadId=${row.threadId} role=${row.role} parentId=${String(row.parentId)}]`,
            );
          }
        }
      }
    }

    // Presence reconcile: reap our mirrors of the sender's threads that were
    // deleted on the sender while we were disconnected. Only mirrors OF the
    // sender (originInstanceId column) are eligible — a peer must never reap
    // another origin's mirrors or our own threads. The 60s updatedAt grace
    // shields a mirror born from a live relay event racing this exchange (the
    // manifest may predate it); a genuinely deleted one reaps on the next pull.
    if (senderInstanceId && presentThreadIds) {
      try {
        const staleMirrors = await db
          .select({ id: chatThreads.id })
          .from(chatThreads)
          .where(
            and(
              eq(chatThreads.userId, userId),
              eq(chatThreads.originInstanceId, senderInstanceId),
              lt(chatThreads.updatedAt, new Date(Date.now() - 60_000)),
              ...(presentThreadIds.length > 0
                ? [notInArray(chatThreads.id, presentThreadIds)]
                : []),
            ),
          );
        if (staleMirrors.length > 0) {
          const { ThreadByIdRepository } =
            await import("next-vibe/agent/chat/threads/[threadId]/repository");
          const user: JwtPrivatePayloadType = {
            id: userId,
            leadId: userId,
            isPublic: false,
            roles: [],
          };
          for (const stale of staleMirrors) {
            // relayed=true: applying the owner's deletion — never relay back.
            const result = await ThreadByIdRepository.deleteThread(
              stale.id,
              user,
              defaultLocale,
              logger,
              true,
            );
            if (!result.success) {
              logger.warn("[ThreadsSync] Failed to reap deleted mirror", {
                threadId: stale.id,
                message: result.message,
              });
            }
          }
          logger.info("[ThreadsSync] Reaped mirrors deleted on origin", {
            origin: senderInstanceId,
            count: staleMirrors.length,
          });
        }
      } catch (error) {
        logger.error(
          "[ThreadsSync] Presence reconcile failed",
          parseError(error),
        );
      }
    }

    return synced;
  },
};
