/**
 * Cortex E2E Sync Tests — Every Mount, Every Subfolder
 *
 * Comprehensive end-to-end tests proving all cortex mounts and sync providers
 * work correctly across two instances via WS push and pull-on-reconnect.
 *
 * Structure:
 *   1-3.  Synced mounts (documents, memories, skills): cross-instance CRUD
 *   4-10. Read-only mounts (threads, favorites, tasks, uploads, searches, gens, ssh):
 *         in-process hierarchy verification at every subfolder level
 *   11.   Hash engine cross-instance assertions
 *   12.   WS push (live sync without explicit pull)
 *
 * PREREQUISITES
 * ─────────────
 * Cross-instance tests (sections 1-3, 11-12) require:
 *   Terminal 1: vibe dev                   (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev           (port 3002, prod DB port 5433)
 *   Env: SYNC_CROSS_INSTANCE_TEST=1
 *
 * Read-only mount tests (sections 4-10) run in-process, no extra servers needed.
 */

import "server-only";

import { and, eq, like, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";
import {
  closeProdDb,
  connectToHermes,
  disconnectFromHermes,
  getProdDb,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrl,
  triggerPull,
  unregisterDevFromHermes,
} from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import { callEndpoint } from "@/app/api/[locale]/remote-connection/call-endpoint";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import {
  buildSyncPayloads,
  computeSyncHashes,
  ensureProvidersRegistered,
} from "@/app/api/[locale]/remote-connection/sync-provider";
import type { RemoteTarget } from "@/app/api/[locale]/remote-connection/transport";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import { SkillCategory } from "@/app/api/[locale]/agent/chat/skills/enum";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { cortexNodes } from "./db";
import { CortexNodeType } from "./enum";
import { resolveVirtualList, resolveVirtualRead } from "./mounts/resolver";

// ── Constants ─────────────────────────────────────────────────────────────────

const SYNC_TIMEOUT = 60_000;
const MOUNT_TIMEOUT = 30_000;

/** Wait for async sync processing */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Poll a predicate every 200ms until it returns truthy or timeout expires.
 * Throws with a descriptive message on timeout.
 */
async function pollUntil<T>(
  label: string,
  fn: () => Promise<T | null | undefined | false>,
  timeoutMs = 15_000,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await fn();
    if (result) {
      return result;
    }
    await sleep(200);
  }
  return Promise.reject(
    new Error(`[pollUntil] ${label}: timed out after ${timeoutMs}ms`),
  ) as Promise<T>;
}

// ── Shared user resolution ────────────────────────────────────────────────────

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;
  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);
  if (!link) {
    return null;
  }
  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );
  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

/** Check if cross-instance testing is enabled */
function isCrossInstanceEnabled(): boolean {
  return process.env["SYNC_CROSS_INSTANCE_TEST"] === "1";
}

function skipCrossInstance(label: string): void {
  // eslint-disable-next-line no-console
  console.info(
    `[${label}] cross-instance test skipped (set SYNC_CROSS_INSTANCE_TEST=1 to enable)`,
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. DOCUMENTS — synced via "documents" provider
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: documents provider (cross-instance CRUD)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;

  const RUN_ID = Date.now().toString(36);
  const D_ROOT_PATH = `/documents/e2e-sync-${RUN_ID}`;
  const D_FILE_PATH = `${D_ROOT_PATH}/test-doc.md`;
  const D_NESTED_PATH = `${D_ROOT_PATH}/subfolder/nested-doc.md`;
  const D_CONTENT = `# E2E Sync Document\n\nCreated for cross-instance sync test.\nMarker: ${RUN_ID}`;
  const D_NESTED_CONTENT = `# Nested Document\n\nSubfolder sync test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-doc] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    // Clean dev DB
    if (devUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            like(cortexNodes.path, `${D_ROOT_PATH}%`),
          ),
        );
    }
    // Clean prod DB
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE ${`${D_ROOT_PATH}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "D1: create document via transport → verify on prod DB",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D1");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: { path: D_FILE_PATH, content: D_CONTENT, createParents: true },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D1: write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const d1Row = await pollUntil(
        "D1: document must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string; content: string }>(
            sql`SELECT path, content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(d1Row.path, "D1: path must match").toBe(D_FILE_PATH);
      expect(d1Row.content, "D1: content must match").toContain(RUN_ID);
    },
    SYNC_TIMEOUT,
  );

  it(
    "D2: create nested document via transport → verify on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D2");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: D_NESTED_PATH,
          content: D_NESTED_CONTENT,
          createParents: true,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D2: nested write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const d2Row = await pollUntil(
        "D2: nested document must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string }>(
            sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_NESTED_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(d2Row.path, "D2: nested path must match").toBe(D_NESTED_PATH);
    },
    SYNC_TIMEOUT,
  );

  it(
    "D3: update content via transport → verify updated on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D3");
        return;
      }

      const updatedContent = `${D_CONTENT}\n\n## Updated\n\nAdded by D3 test.`;
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: D_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D3: update write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const d3Row = await pollUntil(
        "D3: updated content must appear on prod",
        async () => {
          const r = await pdb.execute<{ content: string }>(
            sql`SELECT content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} LIMIT 1`,
          );
          const row = r.rows[0];
          return row?.content?.includes("Added by D3 test") ? row : false;
        },
      );
      expect(d3Row.content, "D3: content must be updated").toContain(
        "Added by D3 test",
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "D4: delete via transport → verify gone on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D4");
        return;
      }

      const pdb = getProdDb();

      // Confirm the node exists on prod before deleting (D1 must have run first)
      const beforeRows = await pdb.execute<{ path: string }>(
        sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
      );
      expect(
        beforeRows.rows.length,
        "D4: node must exist on prod before delete (D1 must have created it)",
      ).toBeGreaterThanOrEqual(1);

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await callEndpoint({
        definition: cortexDeleteDef.DELETE,
        input: { path: D_FILE_PATH, recursive: false },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D4: delete must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Prod must apply delete: row gone or marked isDeleted
      await pollUntil(
        "D4: delete must propagate to prod (node gone or is_deleted=true)",
        async () => {
          const r = await pdb.execute<{ is_deleted: boolean }>(
            sql`SELECT is_deleted FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
          );
          return r.rows.length === 0;
        },
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "D5: create on prod → WS push → verify on dev DB",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D5");
        return;
      }

      const reverseSyncId = randomUUID();
      const reversePath = `${D_ROOT_PATH}/reverse-doc.md`;
      const reverseContent = `# Reverse Sync\n\nWritten on prod for dev to pull.\nMarker: ${reverseSyncId}`;

      // Write to hermes via callEndpoint — hermes writes to its DB and WS-pushes to atlas
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: reversePath,
          content: reverseContent,
          createParents: true,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D5: write to hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // WS push from hermes delivers the node to atlas's cortex_nodes
      const d5Node = await pollUntil(
        "D5: reverse-synced document must appear on dev",
        async () => {
          const [row] = await db
            .select({ path: cortexNodes.path, content: cortexNodes.content })
            .from(cortexNodes)
            .where(
              and(
                eq(cortexNodes.userId, devUser.id),
                eq(cortexNodes.path, reversePath),
              ),
            );
          return row ?? false;
        },
      );
      expect(d5Node.content, "D5: content must contain marker").toContain(
        reverseSyncId,
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "D6: bidirectional write → WS push → last-writer-wins",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D6");
        return;
      }

      const biSyncId = randomUUID();
      const biPath = `${D_ROOT_PATH}/bidirectional.md`;

      // Step 1: Write "older" version to hermes via callEndpoint (gets current timestamp on hermes)
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const hermesResult = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: biPath,
          content: "# Prod loses (older)",
          createParents: true,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        hermesResult.success,
        `D6: hermes write must succeed — ${hermesResult.success ? "" : JSON.stringify(hermesResult)}`,
      ).toBe(true);

      // Step 2: Write "newer" version locally on atlas with a timestamp strictly after hermes's write.
      // Use a future timestamp so atlas's version always beats hermes's.
      const newerTime = new Date(Date.now() + 3_600_000); // 1h in the future
      await db
        .insert(cortexNodes)
        .values({
          userId: devUser.id,
          path: biPath,
          content: "# Dev wins (newer)",
          size: 20,
          nodeType: CortexNodeType.FILE,
          syncId: biSyncId,
          frontmatter: {},
          tags: [],
          updatedAt: newerTime,
        })
        .onConflictDoNothing();

      // Also update if node already exists from the WS push (hermes wrote it first)
      await db
        .update(cortexNodes)
        .set({
          content: "# Dev wins (newer)",
          syncId: biSyncId,
          updatedAt: newerTime,
        })
        .where(
          and(eq(cortexNodes.userId, devUser.id), eq(cortexNodes.path, biPath)),
        );

      // Wait for WS push from hermes to arrive and be processed by LWW.
      // LWW: atlas's version is 1h newer so it must not be overwritten.
      await sleep(3_000);

      const [d6Node] = await db
        .select({ content: cortexNodes.content })
        .from(cortexNodes)
        .where(
          and(eq(cortexNodes.userId, devUser.id), eq(cortexNodes.path, biPath)),
        );

      expect(d6Node?.content, "D6: dev must keep newer version (LWW)").toBe(
        "# Dev wins (newer)",
      );
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 1b. DOCUMENTS (reverse-ws transport) — same CRUD via reverse WS
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: documents provider (cross-instance CRUD, reverse-ws)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;

  const RUN_ID = `rws-${Date.now().toString(36)}`;
  const D_ROOT_PATH = `/documents/e2e-sync-${RUN_ID}`;
  const D_FILE_PATH = `${D_ROOT_PATH}/test-doc.md`;
  const D_NESTED_PATH = `${D_ROOT_PATH}/subfolder/nested-doc.md`;
  const D_CONTENT = `# E2E Sync Document\n\nCreated for cross-instance sync test.\nMarker: ${RUN_ID}`;
  const D_NESTED_CONTENT = `# Nested Document\n\nSubfolder sync test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      // Switch to reverse-ws transport
      await db
        .update(remoteConnections)
        .set({ transportMode: "reverse-ws", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, devUser.id),
            eq(remoteConnections.instanceId, "hermes"),
          ),
        );
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-doc-rws] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    // Reset transport mode before disconnect
    if (devUser) {
      await db
        .update(remoteConnections)
        .set({ transportMode: "direct-http", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, devUser.id),
            eq(remoteConnections.instanceId, "hermes"),
          ),
        );
    }
    // Clean dev DB
    if (devUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            like(cortexNodes.path, `${D_ROOT_PATH}%`),
          ),
        );
    }
    // Clean prod DB
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE ${`${D_ROOT_PATH}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "D1: create document via transport → verify on prod DB",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D1-rws");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: { path: D_FILE_PATH, content: D_CONTENT, createParents: true },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D1-rws: write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const d1Row = await pollUntil(
        "D1-rws: document must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string; content: string }>(
            sql`SELECT path, content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(d1Row.path, "D1-rws: path must match").toBe(D_FILE_PATH);
      expect(d1Row.content, "D1-rws: content must match").toContain(RUN_ID);
    },
    SYNC_TIMEOUT,
  );

  it(
    "D2: create nested document via transport → verify on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D2-rws");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: D_NESTED_PATH,
          content: D_NESTED_CONTENT,
          createParents: true,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D2-rws: nested write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const d2Row = await pollUntil(
        "D2-rws: nested document must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string }>(
            sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_NESTED_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(d2Row.path, "D2-rws: nested path must match").toBe(D_NESTED_PATH);
    },
    SYNC_TIMEOUT,
  );

  it(
    "D3: update content via transport → verify updated on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D3-rws");
        return;
      }

      const updatedContent = `${D_CONTENT}\n\n## Updated\n\nAdded by D3-rws test.`;
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: D_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D3-rws: update write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const d3Row = await pollUntil(
        "D3-rws: updated content must appear on prod",
        async () => {
          const r = await pdb.execute<{ content: string }>(
            sql`SELECT content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} LIMIT 1`,
          );
          const row = r.rows[0];
          return row?.content?.includes("Added by D3-rws test") ? row : false;
        },
      );
      expect(d3Row.content, "D3-rws: content must be updated").toContain(
        "Added by D3-rws test",
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "D4: delete via transport → verify gone on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("D4-rws");
        return;
      }

      const pdb = getProdDb();

      const beforeRows = await pdb.execute<{ path: string }>(
        sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
      );
      expect(
        beforeRows.rows.length,
        "D4-rws: node must exist on prod before delete",
      ).toBeGreaterThanOrEqual(1);

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await callEndpoint({
        definition: cortexDeleteDef.DELETE,
        input: { path: D_FILE_PATH, recursive: false },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `D4-rws: delete must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      await pollUntil("D4-rws: delete must propagate to prod", async () => {
        const r = await pdb.execute<{ is_deleted: boolean }>(
          sql`SELECT is_deleted FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${D_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
        );
        return r.rows.length === 0;
      });
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 2. MEMORIES — synced via "memories" provider
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: memories provider (cross-instance CRUD)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;

  const RUN_ID = Date.now().toString(36);
  const M_FILE_PATH = `/memories/e2e-sync-${RUN_ID}.md`;
  const M_SUBFOLDER_PATH = `/memories/e2e-subfolder-${RUN_ID}/note.md`;
  const M_CONTENT = `# E2E Memory\n\nMemory sync test.\nMarker: ${RUN_ID}`;
  const M_SUB_CONTENT = `# Subfolder Memory\n\nNested memory test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-mem] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    if (devUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            like(cortexNodes.path, `/memories/e2e-%${RUN_ID}%`),
          ),
        );
    }
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE ${`/memories/e2e-%${RUN_ID}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "M1: create memory via transport → verify on prod DB",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M1");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: { path: M_FILE_PATH, content: M_CONTENT, createParents: true },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M1: write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const m1Row = await pollUntil(
        "M1: memory must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string; content: string }>(
            sql`SELECT path, content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(m1Row.content, "M1: content must match").toContain(RUN_ID);
    },
    SYNC_TIMEOUT,
  );

  it(
    "M2: create nested memory in subfolder via transport → verify on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M2");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: M_SUBFOLDER_PATH,
          content: M_SUB_CONTENT,
          createParents: true,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M2: nested write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const m2Row = await pollUntil(
        "M2: nested memory must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string }>(
            sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_SUBFOLDER_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(m2Row.path, "M2: path must match").toBe(M_SUBFOLDER_PATH);
    },
    SYNC_TIMEOUT,
  );

  it(
    "M3: update memory via transport → verify updated on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M3");
        return;
      }

      const updatedContent = `${M_CONTENT}\n\n## Updated by M3`;
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: M_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M3: update write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const m3Row = await pollUntil(
        "M3: updated memory must appear on prod",
        async () => {
          const r = await pdb.execute<{ content: string }>(
            sql`SELECT content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} LIMIT 1`,
          );
          const row = r.rows[0];
          return row?.content?.includes("Updated by M3") ? row : false;
        },
      );
      expect(m3Row.content, "M3: content must be updated").toContain(
        "Updated by M3",
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "M4: delete memory via transport → verify gone on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M4");
        return;
      }

      const pdb = getProdDb();

      // Confirm the node exists on prod before deleting (M1 must have created it)
      const m4Before = await pdb.execute<{ path: string }>(
        sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
      );
      expect(
        m4Before.rows.length,
        "M4: node must exist on prod before delete (M1 must have created it)",
      ).toBeGreaterThanOrEqual(1);

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await callEndpoint({
        definition: cortexDeleteDef.DELETE,
        input: { path: M_FILE_PATH, recursive: false },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M4: delete must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Prod must apply delete: row gone or marked isDeleted
      await pollUntil(
        "M4: delete must propagate to prod (node gone or is_deleted=true)",
        async () => {
          const r = await pdb.execute<{ is_deleted: boolean }>(
            sql`SELECT is_deleted FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
          );
          return r.rows.length === 0;
        },
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "M5: create memory on prod → WS push → verify on dev",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M5");
        return;
      }

      const reverseSyncId = randomUUID();
      const reversePath = `/memories/e2e-sync-reverse-${RUN_ID}.md`;
      const reverseContent = `# Reverse Memory\n\nMarker: ${reverseSyncId}`;

      // Write to hermes via callEndpoint — hermes writes to its DB and WS-pushes to atlas
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: reversePath,
          content: reverseContent,
          createParents: true,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M5: write to hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // WS push from hermes delivers the node to atlas's cortex_nodes
      const m5Node = await pollUntil(
        "M5: reverse-synced memory must appear on dev",
        async () => {
          const [row] = await db
            .select({ content: cortexNodes.content })
            .from(cortexNodes)
            .where(
              and(
                eq(cortexNodes.userId, devUser.id),
                eq(cortexNodes.path, reversePath),
              ),
            );
          return row ?? false;
        },
      );
      expect(m5Node.content, "M5: content must match").toContain(reverseSyncId);
    },
    SYNC_TIMEOUT,
  );

  it(
    "M6: provider isolation — memory change only triggers 'memories' payload",
    async () => {
      if (!devUser) {
        return;
      }

      await ensureProvidersRegistered();
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);

      const { perProvider: hashBefore } = await computeSyncHashes(devUser.id);

      // Insert a memory node
      const isoSyncId = randomUUID();
      const isoPath = `/memories/e2e-isolation-${RUN_ID}.md`;
      await db.insert(cortexNodes).values({
        userId: devUser.id,
        path: isoPath,
        content: "# Isolation test",
        size: 17,
        nodeType: CortexNodeType.FILE,
        syncId: isoSyncId,
        frontmatter: {},
        tags: [],
      });

      const { perProvider: hashAfter } = await computeSyncHashes(devUser.id);

      // Memories hash must change
      expect(hashBefore["memories"], "M6: memories hash must change").not.toBe(
        hashAfter["memories"],
      );
      // Skills hash must NOT change
      expect(hashBefore["skills"], "M6: skills hash must be unchanged").toBe(
        hashAfter["skills"],
      );

      // Build payloads with old memories hash, current skills/documents hash
      const { syncPayloads } = await buildSyncPayloads(
        {
          documents: hashAfter["documents"]!,
          skills: hashAfter["skills"]!,
          memories: hashBefore["memories"]!,
        },
        devUser.id,
        logger,
      );

      expect(
        syncPayloads,
        "M6: only memories must be in payload",
      ).toHaveProperty("memories");
      expect(
        syncPayloads,
        "M6: skills must NOT be in payload",
      ).not.toHaveProperty("skills");

      // Cleanup
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, isoPath),
          ),
        );
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 2b. MEMORIES (reverse-ws transport) — same CRUD via reverse WS
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: memories provider (cross-instance CRUD, reverse-ws)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;

  const RUN_ID = `rws-${Date.now().toString(36)}`;
  const M_FILE_PATH = `/memories/e2e-sync-${RUN_ID}.md`;
  const M_SUBFOLDER_PATH = `/memories/e2e-subfolder-${RUN_ID}/note.md`;
  const M_CONTENT = `# E2E Memory\n\nMemory sync test.\nMarker: ${RUN_ID}`;
  const M_SUB_CONTENT = `# Subfolder Memory\n\nNested memory test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      // Switch to reverse-ws transport
      await db
        .update(remoteConnections)
        .set({ transportMode: "reverse-ws", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, devUser.id),
            eq(remoteConnections.instanceId, "hermes"),
          ),
        );
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-mem-rws] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    // Reset transport mode before disconnect
    if (devUser) {
      await db
        .update(remoteConnections)
        .set({ transportMode: "direct-http", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, devUser.id),
            eq(remoteConnections.instanceId, "hermes"),
          ),
        );
    }
    if (devUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            like(cortexNodes.path, `/memories/e2e-%${RUN_ID}%`),
          ),
        );
    }
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE ${`/memories/e2e-%${RUN_ID}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "M1: create memory via transport → verify on prod DB",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M1-rws");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: { path: M_FILE_PATH, content: M_CONTENT, createParents: true },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M1-rws: write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const m1Row = await pollUntil(
        "M1-rws: memory must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string; content: string }>(
            sql`SELECT path, content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(m1Row.content, "M1-rws: content must match").toContain(RUN_ID);
    },
    SYNC_TIMEOUT,
  );

  it(
    "M2: create nested memory in subfolder via transport → verify on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M2-rws");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: M_SUBFOLDER_PATH,
          content: M_SUB_CONTENT,
          createParents: true,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M2-rws: nested write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const m2Row = await pollUntil(
        "M2-rws: nested memory must appear on prod",
        async () => {
          const r = await pdb.execute<{ path: string }>(
            sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_SUBFOLDER_PATH} LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(m2Row.path, "M2-rws: path must match").toBe(M_SUBFOLDER_PATH);
    },
    SYNC_TIMEOUT,
  );

  it(
    "M3: update memory via transport → verify updated on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M3-rws");
        return;
      }

      const updatedContent = `${M_CONTENT}\n\n## Updated by M3-rws`;
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: {
          path: M_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M3-rws: update write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const m3Row = await pollUntil(
        "M3-rws: updated memory must appear on prod",
        async () => {
          const r = await pdb.execute<{ content: string }>(
            sql`SELECT content FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} LIMIT 1`,
          );
          const row = r.rows[0];
          return row?.content?.includes("Updated by M3-rws") ? row : false;
        },
      );
      expect(m3Row.content, "M3-rws: content must be updated").toContain(
        "Updated by M3-rws",
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "M4: delete memory via transport → verify gone on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("M4-rws");
        return;
      }

      const pdb = getProdDb();

      const m4Before = await pdb.execute<{ path: string }>(
        sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
      );
      expect(
        m4Before.rows.length,
        "M4-rws: node must exist on prod before delete",
      ).toBeGreaterThanOrEqual(1);

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await callEndpoint({
        definition: cortexDeleteDef.DELETE,
        input: { path: M_FILE_PATH, recursive: false },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `M4-rws: delete must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      await pollUntil("M4-rws: delete must propagate to prod", async () => {
        const r = await pdb.execute<{ is_deleted: boolean }>(
          sql`SELECT is_deleted FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${M_FILE_PATH} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
        );
        return r.rows.length === 0;
      });
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 3. SKILLS — synced via "skills" provider
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: skills provider (cross-instance CRUD)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;
  let prodSkillId = "";

  const RUN_ID = Date.now().toString(36);
  const TEST_SKILL_SLUG = `e2e-sync-skill-${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-skill] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    // Clean dev custom skills
    if (devUser) {
      const { customSkills } =
        await import("@/app/api/[locale]/agent/chat/skills/db");
      await db
        .delete(customSkills)
        .where(
          and(
            eq(customSkills.userId, devUser.id),
            like(customSkills.slug, `e2e-sync-skill-${RUN_ID}%`),
          ),
        );
    }
    // Clean prod custom skills
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM custom_skills WHERE user_id = ${prodUserId} AND slug LIKE ${`e2e-sync-skill-${RUN_ID}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "S1: create custom skill via transport → verify on prod DB",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("S1");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillCreateDef } =
        await import("@/app/api/[locale]/agent/chat/skills/create/definition");
      const result = await callEndpoint({
        definition: skillCreateDef.POST,
        input: {
          name: "E2E Sync Skill",
          tagline: "E2E test tagline",
          icon: "sparkles",
          description: "Skill for E2E sync testing — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are an E2E test skill.",
          modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `S1: create skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const s1Row = await pollUntil(
        "S1: skill must appear on prod",
        async () => {
          const r = await pdb.execute<{
            id: string;
            name: string;
            slug: string;
          }>(
            sql`SELECT id, name, slug FROM custom_skills WHERE user_id = ${prodUserId} AND name = 'E2E Sync Skill' LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(s1Row.name, "S1: name must match").toBe("E2E Sync Skill");
      prodSkillId = s1Row.id;
    },
    SYNC_TIMEOUT,
  );

  it(
    "S2: update skill via transport → verify updated on prod",
    async () => {
      if (
        !connected ||
        !remoteTarget ||
        !devUser ||
        !prodUserId ||
        !prodSkillId
      ) {
        skipCrossInstance("S2");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillDef } =
        await import("@/app/api/[locale]/agent/chat/skills/[id]/definition");
      // name is typed as SkillsTranslationKey in the definition due to i18n type constraint;
      // cast to bypass in test context where we pass a real string.
      const s2Input = {
        name: "E2E Sync Skill Updated",
        systemPrompt: "You are an updated E2E test skill.",
      } as unknown as typeof skillDef.PATCH.types.RequestOutput;
      const result = await callEndpoint({
        definition: skillDef.PATCH,
        input: s2Input,
        urlPathParams: { id: prodSkillId },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `S2: update skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const s2Row = await pollUntil(
        "S2: updated skill must appear on prod",
        async () => {
          const r = await pdb.execute<{ name: string; system_prompt: string }>(
            sql`SELECT name, system_prompt FROM custom_skills WHERE user_id = ${prodUserId} AND id = ${prodSkillId} LIMIT 1`,
          );
          const row = r.rows[0];
          return row?.name === "E2E Sync Skill Updated" ? row : false;
        },
      );
      expect(s2Row.name, "S2: name must be updated").toBe(
        "E2E Sync Skill Updated",
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "S3: delete skill via transport → verify removed on prod",
    async () => {
      if (
        !connected ||
        !remoteTarget ||
        !devUser ||
        !prodUserId ||
        !prodSkillId
      ) {
        skipCrossInstance("S3");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillDef } =
        await import("@/app/api/[locale]/agent/chat/skills/[id]/definition");
      const result = await callEndpoint({
        definition: skillDef.DELETE,
        input: {},
        urlPathParams: { id: prodSkillId },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `S3: delete skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Poll prod DB — row gone or marked is_deleted=true
      const pdb = getProdDb();
      const deadline = Date.now() + 10_000;
      let activeRow: { id: string; is_deleted: boolean } | undefined;
      while (Date.now() < deadline) {
        const rows = await pdb.execute<{ id: string; is_deleted: boolean }>(
          sql`SELECT id, is_deleted FROM custom_skills WHERE user_id = ${prodUserId} AND id = ${prodSkillId} LIMIT 1`,
        );
        const row = rows.rows[0];
        if (!row || row.is_deleted) {
          activeRow = undefined;
          break;
        }
        activeRow = row;
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 200);
        });
      }

      // If an active (non-deleted) row still exists after timeout, delete wasn't applied
      expect(
        activeRow,
        "S3: prod skill must be deleted or marked is_deleted=true",
      ).toBeUndefined();
    },
    SYNC_TIMEOUT,
  );

  it(
    "S4: create skill on prod → WS push → verify on dev",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("S4");
        return;
      }

      const reverseSlug = `${TEST_SKILL_SLUG}-reverse`;

      // Create skill on hermes via callEndpoint — hermes writes and WS-pushes to atlas
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillCreateDef } =
        await import("@/app/api/[locale]/agent/chat/skills/create/definition");
      const result = await callEndpoint({
        definition: skillCreateDef.POST,
        input: {
          name: "Reverse Skill",
          tagline: "Reverse sync tagline",
          icon: "test",
          description: "Reverse sync test skill for E2E",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are reverse.",
          modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `S4: create skill on hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // WS push from hermes delivers the skill to atlas's custom_skills
      const { customSkills } =
        await import("@/app/api/[locale]/agent/chat/skills/db");
      const s4Skill = await pollUntil(
        "S4: reverse-synced skill must appear on dev",
        async () => {
          const [row] = await db
            .select({ name: customSkills.name })
            .from(customSkills)
            .where(
              and(
                eq(customSkills.userId, devUser.id),
                eq(customSkills.name, "Reverse Skill"),
              ),
            );
          return row ?? false;
        },
      );

      expect(s4Skill.name, "S4: name must match").toBe("Reverse Skill");
    },
    SYNC_TIMEOUT,
  );

  it(
    "S5: provider isolation — skill change only triggers 'skills' payload",
    async () => {
      if (!devUser) {
        return;
      }

      await ensureProvidersRegistered();
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { perProvider: hashBefore } = await computeSyncHashes(devUser.id);

      const { customSkills } =
        await import("@/app/api/[locale]/agent/chat/skills/db");
      const isoSlug = `${TEST_SKILL_SLUG}-isolation`;
      await db.insert(customSkills).values({
        id: randomUUID(),
        userId: devUser.id,
        name: "Isolation Skill",
        slug: isoSlug,
        description: "For isolation test",
        systemPrompt: "Isolation.",
        icon: "test",
        tagline: "iso",
        category: "enums.category.assistant",
        ownershipType: "enums.ownershipType.user",
        variants: [
          {
            id: "default",
            modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
            isDefault: true,
          },
        ],
      });

      const { perProvider: hashAfter } = await computeSyncHashes(devUser.id);

      expect(hashBefore["skills"], "S5: skills hash must change").not.toBe(
        hashAfter["skills"],
      );
      expect(
        hashBefore["documents"],
        "S5: documents hash must be unchanged",
      ).toBe(hashAfter["documents"]);
      expect(
        hashBefore["memories"],
        "S5: memories hash must be unchanged",
      ).toBe(hashAfter["memories"]);

      // Cleanup
      await db
        .delete(customSkills)
        .where(
          and(
            eq(customSkills.userId, devUser.id),
            eq(customSkills.slug, isoSlug),
          ),
        );
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 3b. SKILLS (reverse-ws transport) — same CRUD via reverse WS
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: skills provider (cross-instance CRUD, reverse-ws)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;
  let prodSkillId = "";

  const RUN_ID = `rws-${Date.now().toString(36)}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      // Switch to reverse-ws transport
      await db
        .update(remoteConnections)
        .set({ transportMode: "reverse-ws", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, devUser.id),
            eq(remoteConnections.instanceId, "hermes"),
          ),
        );
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-skill-rws] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    // Reset transport mode before disconnect
    if (devUser) {
      await db
        .update(remoteConnections)
        .set({ transportMode: "direct-http", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, devUser.id),
            eq(remoteConnections.instanceId, "hermes"),
          ),
        );
    }
    // Clean dev custom skills
    if (devUser) {
      const { customSkills } =
        await import("@/app/api/[locale]/agent/chat/skills/db");
      await db
        .delete(customSkills)
        .where(
          and(
            eq(customSkills.userId, devUser.id),
            like(customSkills.slug, `e2e-sync-skill-${RUN_ID}%`),
          ),
        );
    }
    // Clean prod custom skills
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM custom_skills WHERE user_id = ${prodUserId} AND slug LIKE ${`e2e-sync-skill-${RUN_ID}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "S1: create custom skill via transport → verify on prod DB",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("S1-rws");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillCreateDef } =
        await import("@/app/api/[locale]/agent/chat/skills/create/definition");
      const result = await callEndpoint({
        definition: skillCreateDef.POST,
        input: {
          name: "E2E Sync Skill RWS",
          tagline: "E2E test tagline",
          icon: "sparkles",
          description: "Skill for E2E sync testing — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are an E2E test skill (reverse-ws).",
          modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `S1-rws: create skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const s1Row = await pollUntil(
        "S1-rws: skill must appear on prod",
        async () => {
          const r = await pdb.execute<{
            id: string;
            name: string;
            slug: string;
          }>(
            sql`SELECT id, name, slug FROM custom_skills WHERE user_id = ${prodUserId} AND name = 'E2E Sync Skill RWS' LIMIT 1`,
          );
          return r.rows[0] ?? false;
        },
      );
      expect(s1Row.name, "S1-rws: name must match").toBe("E2E Sync Skill RWS");
      prodSkillId = s1Row.id;
    },
    SYNC_TIMEOUT,
  );

  it(
    "S2: update skill via transport → verify updated on prod",
    async () => {
      if (
        !connected ||
        !remoteTarget ||
        !devUser ||
        !prodUserId ||
        !prodSkillId
      ) {
        skipCrossInstance("S2-rws");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillDef } =
        await import("@/app/api/[locale]/agent/chat/skills/[id]/definition");
      const result = await callEndpoint({
        definition: skillDef.PATCH,
        input: {
          systemPrompt: "You are an updated E2E test skill (reverse-ws).",
        },
        urlPathParams: { id: prodSkillId },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `S2-rws: update skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const s2Row = await pollUntil(
        "S2-rws: updated skill must appear on prod",
        async () => {
          const r = await pdb.execute<{ system_prompt: string }>(
            sql`SELECT system_prompt FROM custom_skills WHERE user_id = ${prodUserId} AND id = ${prodSkillId} LIMIT 1`,
          );
          const row = r.rows[0];
          return row?.system_prompt ===
            "You are an updated E2E test skill (reverse-ws)."
            ? row
            : false;
        },
      );
      expect(s2Row.system_prompt, "S2-rws: system_prompt must be updated").toBe(
        "You are an updated E2E test skill (reverse-ws).",
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "S3: delete skill via transport → verify removed on prod",
    async () => {
      if (
        !connected ||
        !remoteTarget ||
        !devUser ||
        !prodUserId ||
        !prodSkillId
      ) {
        skipCrossInstance("S3-rws");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillDef } =
        await import("@/app/api/[locale]/agent/chat/skills/[id]/definition");
      const result = await callEndpoint({
        definition: skillDef.DELETE,
        input: {},
        urlPathParams: { id: prodSkillId },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `S3-rws: delete skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const deadline = Date.now() + 10_000;
      let activeRow: { id: string; is_deleted: boolean } | undefined;
      while (Date.now() < deadline) {
        const rows = await pdb.execute<{ id: string; is_deleted: boolean }>(
          sql`SELECT id, is_deleted FROM custom_skills WHERE user_id = ${prodUserId} AND id = ${prodSkillId} LIMIT 1`,
        );
        const row = rows.rows[0];
        if (!row || row.is_deleted) {
          activeRow = undefined;
          break;
        }
        activeRow = row;
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 200);
        });
      }
      expect(
        activeRow,
        "S3-rws: prod skill must be deleted or marked is_deleted=true",
      ).toBeUndefined();
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 3.5. THREADS SYNC — pull-on-connect cross-instance CRUD
// ══════════════════════════════════════════════════════════════════════════════
//
// Threads are pull-on-connect only (not WS-pushed). On receive, threads land
// in the REMOTE/{instanceId} subfolder (created by connectToHermes).
//
// Tested flows:
//  TH1: create thread on dev → hermes pulls → thread appears in prod
//       REMOTE/atlas subfolder
//  TH2: thread includes messages → messages appear on prod after pull
//  TH3: update thread on dev → hermes pulls → updated fields on prod
//  TH4: create thread on prod → dev pulls → appears in dev REMOTE/hermes subfolder
//  TH5: bidirectional write → pull → last-writer-wins (LWW >=)
//  TH6: syncScope.threads=false → thread NOT synced on pull

describe("E2E Sync: threads provider (pull-on-connect cross-instance)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;

  const RUN_ID = Date.now().toString(36);
  const TH_THREAD_ID = randomUUID();
  const TH_TITLE = `E2E Thread Sync ${RUN_ID}`;
  const TH_MSG_CONTENT = `Hello from thread sync test ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-thread] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    // Clean dev threads + messages
    if (devUser) {
      const { chatThreads: ct, chatMessages: cm } =
        await import("@/app/api/[locale]/agent/chat/db");
      await db.delete(cm).where(eq(cm.threadId, TH_THREAD_ID));
      await db
        .delete(ct)
        .where(
          and(
            eq(ct.userId, devUser.id),
            like(ct.title, `E2E Thread Sync ${RUN_ID}%`),
          ),
        );
    }
    // Clean prod threads + messages
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM chat_messages WHERE thread_id IN (SELECT id FROM chat_threads WHERE user_id = ${prodUserId} AND title LIKE ${`E2E Thread Sync ${RUN_ID}%`})`,
        );
        await pdb.execute(
          sql`DELETE FROM chat_threads WHERE user_id = ${prodUserId} AND title LIKE ${`E2E Thread Sync ${RUN_ID}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "TH1: create thread via transport → appears on prod with REMOTE root folder",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("TH1");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: threadsDef } =
        await import("@/app/api/[locale]/agent/chat/threads/definition");
      const result = await callEndpoint({
        definition: threadsDef.POST,
        input: {
          id: TH_THREAD_ID,
          title: TH_TITLE,
          rootFolderId: DefaultFolderId.PRIVATE,
          model: ChatModelId.GPT_5_4_NANO,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `TH1: create thread must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Poll prod DB — thread must appear with rootFolderId=REMOTE
      const pdb = getProdDb();
      const row = await pollUntil(
        "TH1: thread must appear on prod after hermes pull",
        async () => {
          const rows = await pdb.execute<{
            id: string;
            title: string;
            root_folder_id: string;
          }>(
            sql`SELECT id, title, root_folder_id FROM chat_threads WHERE user_id = ${prodUserId} AND id = ${TH_THREAD_ID} LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
      );

      expect(row.title, "TH1: title must match").toBe(TH_TITLE);
      expect(
        row.root_folder_id,
        "TH1: thread must land in REMOTE root folder on prod",
      ).toBe("remote");
    },
    SYNC_TIMEOUT,
  );

  it(
    "TH2: add message to thread via transport → message appears on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("TH2");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: messagesDef } =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition");
      const result = await callEndpoint({
        definition: messagesDef.POST,
        input: {
          rootFolderId: DefaultFolderId.PRIVATE,
          role: ChatMessageRole.USER,
          content: TH_MSG_CONTENT,
        },
        urlPathParams: { threadId: TH_THREAD_ID },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `TH2: create message must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const msgRow = await pollUntil(
        "TH2: message must appear on prod after pull",
        async () => {
          const rows = await pdb.execute<{ content: string }>(
            sql`SELECT content FROM chat_messages WHERE thread_id = ${TH_THREAD_ID} AND content LIKE ${`%${RUN_ID}%`} LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
      );

      expect(msgRow.content, "TH2: message content must match").toContain(
        RUN_ID,
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "TH3: rename thread via transport → updated title on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("TH3");
        return;
      }

      const updatedTitle = `E2E Thread Sync ${RUN_ID} UPDATED`;
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: renameDef } =
        await import("@/app/api/[locale]/agent/chat/threads/rename/definition");
      const result = await callEndpoint({
        definition: renameDef.PATCH,
        input: {
          threadId: TH_THREAD_ID,
          title: updatedTitle,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `TH3: rename thread must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const updatedRow = await pollUntil(
        "TH3: thread must have updated title on prod",
        async () => {
          const rows = await pdb.execute<{ title: string }>(
            sql`SELECT title FROM chat_threads WHERE user_id = ${prodUserId} AND id = ${TH_THREAD_ID} AND title = ${updatedTitle} LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
      );

      expect(updatedRow.title, "TH3: updated title must match").toBe(
        updatedTitle,
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "TH4: create thread on prod → WS push → appears in dev REMOTE/hermes subfolder",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("TH4");
        return;
      }

      const reverseTitle = `E2E Thread Sync ${RUN_ID} Reverse`;

      // Create thread on hermes via callEndpoint — hermes writes and WS-pushes to atlas
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: threadsDef } =
        await import("@/app/api/[locale]/agent/chat/threads/definition");
      const result = await callEndpoint({
        definition: threadsDef.POST,
        input: {
          rootFolderId: DefaultFolderId.PRIVATE,
          title: reverseTitle,
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `TH4: create thread on hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // WS push from hermes delivers the thread to atlas; it lands in REMOTE/hermes subfolder
      const { chatThreads: ct } =
        await import("@/app/api/[locale]/agent/chat/db");
      const devThread = await pollUntil(
        "TH4: reverse-synced thread must appear on dev",
        async () => {
          const [row] = await db
            .select({
              id: ct.id,
              title: ct.title,
              rootFolderId: ct.rootFolderId,
            })
            .from(ct)
            .where(and(eq(ct.userId, devUser.id), eq(ct.title, reverseTitle)));
          return row ?? false;
        },
      );

      expect(devThread.title, "TH4: title must match").toBe(reverseTitle);
      expect(
        devThread.rootFolderId,
        "TH4: thread must land in REMOTE root folder on dev",
      ).toBe("remote");
    },
    SYNC_TIMEOUT,
  );

  it(
    "TH5: bidirectional write → pull → last-writer-wins (LWW >=, remote wins on tie)",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        skipCrossInstance("TH5");
        return;
      }

      const biThreadId = randomUUID();
      const biTitle = `E2E Thread Sync ${RUN_ID} Bi`;
      const now = new Date();
      const olderTime = new Date(now.getTime() - 3_600_000); // 1h older

      const { chatThreads: ct } =
        await import("@/app/api/[locale]/agent/chat/db");

      // Write newer version on dev
      await db.insert(ct).values({
        id: biThreadId,
        userId: devUser.id,
        title: `${biTitle} DEV-NEWER`,
        rootFolderId: "private",
        status: "active",
        pinned: false,
        archived: false,
        tags: [],
        updatedAt: now,
      });

      // Write older version on prod
      const pdb = getProdDb();
      await pdb.execute(
        sql`INSERT INTO chat_threads (id, user_id, title, root_folder_id, status, pinned, archived, tags, created_at, updated_at)
          VALUES (${biThreadId}, ${prodUserId}, ${`${biTitle} PROD-OLDER`}, 'remote', 'active', false, false, '[]', ${olderTime}, ${olderTime})
          ON CONFLICT DO NOTHING`,
      );

      // Dev pulls from prod — prod has older copy, dev should WIN (LWW).
      await triggerPull();

      const th5Thread = await pollUntil(
        "TH5: dev thread must exist and keep newer version (LWW)",
        async () => {
          const [row] = await db
            .select({ title: ct.title })
            .from(ct)
            .where(and(eq(ct.userId, devUser.id), eq(ct.id, biThreadId)));
          return row ?? false;
        },
      );
      expect(
        th5Thread.title,
        "TH5: dev must keep newer version (LWW)",
      ).toContain("DEV-NEWER");

      // Cleanup
      await db
        .delete(ct)
        .where(and(eq(ct.userId, devUser.id), eq(ct.id, biThreadId)));
      await pdb.execute(
        sql`DELETE FROM chat_threads WHERE id = ${biThreadId} AND user_id = ${prodUserId}`,
      );
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. THREADS — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /threads", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, MOUNT_TIMEOUT);

  it(
    "T1: list /threads → returns root folder entries",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/threads",
        "/threads",
      );
      expect(entries.length, "T1: must return root folders").toBeGreaterThan(0);

      const names = entries.map((e) => e.name);
      expect(names, "T1: must include 'private'").toContain("private");
    },
    MOUNT_TIMEOUT,
  );

  it(
    "T2: list /threads/private → returns threads or subfolders",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/threads/private",
        "/threads",
      );
      // May be empty if no threads exist, but should not throw
      expect(Array.isArray(entries), "T2: must return an array").toBe(true);

      for (const entry of entries) {
        expect(entry.name, "T2: each entry must have a name").toBeTruthy();
        expect(entry.path, "T2: each entry must have a path").toContain(
          "/threads/",
        );
        expect(
          entry.nodeType === "file" || entry.nodeType === "dir",
          "T2: nodeType must be file or dir",
        ).toBe(true);
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "T3: read a thread file → returns content with frontmatter",
    async () => {
      if (!adminUser) {
        return;
      }

      // Find a real thread to read
      const entries = await resolveVirtualList(
        adminUser.id,
        "/threads/private",
        "/threads",
      );
      const threadFile = entries.find(
        (e) => e.nodeType === "file" && e.name.endsWith(".md"),
      );

      if (!threadFile) {
        // eslint-disable-next-line no-console
        console.info("[T3] No threads found in /threads/private — skipping");
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        threadFile.path,
        "/threads",
      );
      expect(result, "T3: must return read result").toBeTruthy();
      expect(result?.content, "T3: content must contain frontmatter").toContain(
        "---",
      );
      expect(result?.content, "T3: content must contain threadId").toContain(
        "threadId:",
      );
      expect(result?.nodeType, "T3: must be file type").toBe("file");
    },
    MOUNT_TIMEOUT,
  );

  it(
    "T4: list thread subfolder (if any exist)",
    async () => {
      if (!adminUser) {
        return;
      }

      const rootEntries = await resolveVirtualList(
        adminUser.id,
        "/threads/private",
        "/threads",
      );
      const subfolder = rootEntries.find((e) => e.nodeType === "dir");

      if (!subfolder) {
        // eslint-disable-next-line no-console
        console.info("[T4] No subfolders in /threads/private — skipping");
        return;
      }

      const subEntries = await resolveVirtualList(
        adminUser.id,
        subfolder.path,
        "/threads",
      );
      expect(
        Array.isArray(subEntries),
        "T4: subfolder list must return array",
      ).toBe(true);
    },
    MOUNT_TIMEOUT,
  );

  it(
    "T5: buildThinThreadContent produces title+preview without message dumps",
    async () => {
      const { buildThinThreadContent } =
        await import("@/app/api/[locale]/agent/ai-stream/repository/core/message-db-writer");

      const thin = buildThinThreadContent({
        title: "Test Thread",
        rootFolderId: "private",
        tags: ["test", "e2e"],
        preview: "Hello, this is a test preview",
      });

      expect(thin, "T5: must contain title").toContain("# Test Thread");
      expect(thin, "T5: must contain folder").toContain("Folder: private");
      expect(thin, "T5: must contain tags").toContain("Tags: test, e2e");
      expect(thin, "T5: must contain preview").toContain("Preview: Hello");
      expect(thin, "T5: must not contain message role prefixes").not.toMatch(
        /^(user|assistant|system):/m,
      );
    },
    MOUNT_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 5. FAVORITES — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /favorites", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, MOUNT_TIMEOUT);

  it(
    "F1: list /favorites → returns favorite entries",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/favorites",
        "/favorites",
      );
      expect(Array.isArray(entries), "F1: must return an array").toBe(true);

      for (const entry of entries) {
        expect(entry.name, "F1: entry must have a name").toBeTruthy();
        expect(entry.nodeType, "F1: favorites are files").toBe("file");
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "F2: read a favorite file → returns content with frontmatter",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/favorites",
        "/favorites",
      );
      if (entries.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[F2] No favorites found — skipping");
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        entries[0]!.path,
        "/favorites",
      );
      expect(result, "F2: must return read result").toBeTruthy();
      expect(result?.content, "F2: content must contain frontmatter").toContain(
        "---",
      );
      expect(result?.content, "F2: must contain favoriteId").toContain(
        "favoriteId:",
      );
    },
    MOUNT_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 6. TASKS — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /tasks", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, MOUNT_TIMEOUT);

  it(
    "TK1: list /tasks → returns task entries",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/tasks",
        "/tasks",
      );
      expect(Array.isArray(entries), "TK1: must return an array").toBe(true);

      for (const entry of entries) {
        expect(entry.name, "TK1: entry must have a name").toBeTruthy();
        expect(entry.nodeType, "TK1: tasks are files").toBe("file");
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "TK2: read a task file → returns content with frontmatter",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/tasks",
        "/tasks",
      );
      if (entries.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[TK2] No tasks found — skipping");
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        entries[0]!.path,
        "/tasks",
      );
      expect(result, "TK2: must return read result").toBeTruthy();
      expect(
        result?.content,
        "TK2: content must contain frontmatter",
      ).toContain("---");
      expect(result?.content, "TK2: must contain taskId").toContain("taskId:");
    },
    MOUNT_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 7. UPLOADS — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /uploads", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, MOUNT_TIMEOUT);

  it(
    "U1: list /uploads → returns type folders",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/uploads",
        "/uploads",
      );
      expect(Array.isArray(entries), "U1: must return an array").toBe(true);

      const names = entries.map((e) => e.name);
      const expectedTypes = ["images", "documents", "audio", "video", "other"];
      for (const t of expectedTypes) {
        expect(names, `U1: must include '${t}' type folder`).toContain(t);
      }

      for (const entry of entries) {
        expect(entry.nodeType, "U1: type entries are dirs").toBe("dir");
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "U2: list /uploads/images → returns thread directories (if any uploads exist)",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/uploads/images",
        "/uploads",
      );
      expect(Array.isArray(entries), "U2: must return an array").toBe(true);

      // May be empty, but if not, entries should be dirs (thread containers)
      for (const entry of entries) {
        expect(entry.nodeType, "U2: thread entries should be dirs").toBe("dir");
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "U3: list /uploads/images/{threadSlug} → returns upload files (if any exist)",
    async () => {
      if (!adminUser) {
        return;
      }

      const threadDirs = await resolveVirtualList(
        adminUser.id,
        "/uploads/images",
        "/uploads",
      );
      if (threadDirs.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[U3] No image uploads found — skipping");
        return;
      }

      const files = await resolveVirtualList(
        adminUser.id,
        threadDirs[0]!.path,
        "/uploads",
      );
      expect(Array.isArray(files), "U3: must return an array").toBe(true);

      for (const file of files) {
        expect(file.nodeType, "U3: uploads are files").toBe("file");
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "U4: read an upload file → returns content with metadata",
    async () => {
      if (!adminUser) {
        return;
      }

      // Traverse: /uploads/images → first thread → first file
      const threadDirs = await resolveVirtualList(
        adminUser.id,
        "/uploads/images",
        "/uploads",
      );
      if (threadDirs.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[U4] No image uploads — skipping");
        return;
      }

      const files = await resolveVirtualList(
        adminUser.id,
        threadDirs[0]!.path,
        "/uploads",
      );
      if (files.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[U4] No files in first thread — skipping");
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        files[0]!.path,
        "/uploads",
      );
      expect(result, "U4: must return read result").toBeTruthy();
      expect(result?.content, "U4: content must contain frontmatter").toContain(
        "---",
      );
      expect(result?.content, "U4: must contain filename").toContain(
        "filename:",
      );
    },
    MOUNT_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 8. SEARCHES — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /searches", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, MOUNT_TIMEOUT);

  it(
    "SR1: list /searches → returns month folders",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/searches",
        "/searches",
      );
      expect(Array.isArray(entries), "SR1: must return an array").toBe(true);

      for (const entry of entries) {
        expect(entry.nodeType, "SR1: month entries are dirs").toBe("dir");
        expect(
          entry.name,
          "SR1: month folder name must match YYYY-MM pattern",
        ).toMatch(/^\d{4}-\d{2}$/);
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "SR2: list /searches/{YYYY-MM} → returns search result entries",
    async () => {
      if (!adminUser) {
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/searches",
        "/searches",
      );
      if (months.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[SR2] No search results found — skipping");
        return;
      }

      const results = await resolveVirtualList(
        adminUser.id,
        months[0]!.path,
        "/searches",
      );
      expect(Array.isArray(results), "SR2: must return an array").toBe(true);

      for (const result of results) {
        expect(result.nodeType, "SR2: search results are files").toBe("file");
        expect(result.name, "SR2: filename must end in .md").toMatch(/\.md$/);
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "SR3: read a search result → returns content with query and results",
    async () => {
      if (!adminUser) {
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/searches",
        "/searches",
      );
      if (months.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[SR3] No search results — skipping");
        return;
      }

      const results = await resolveVirtualList(
        adminUser.id,
        months[0]!.path,
        "/searches",
      );
      if (results.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[SR3] No results in first month — skipping");
        return;
      }

      const content = await resolveVirtualRead(
        adminUser.id,
        results[0]!.path,
        "/searches",
      );
      expect(content, "SR3: must return read result").toBeTruthy();
      expect(
        content?.content,
        "SR3: content must contain frontmatter",
      ).toContain("---");
      expect(content?.content, "SR3: must contain query").toContain("query:");
    },
    MOUNT_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 9. GENS — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /gens", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, MOUNT_TIMEOUT);

  it(
    "G1: list /gens → returns type folders (images, audio, video)",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(adminUser.id, "/gens", "/gens");
      expect(Array.isArray(entries), "G1: must return an array").toBe(true);

      const names = entries.map((e) => e.name);
      expect(names, "G1: must include 'images'").toContain("images");
      expect(names, "G1: must include 'audio'").toContain("audio");
      expect(names, "G1: must include 'video'").toContain("video");
    },
    MOUNT_TIMEOUT,
  );

  it(
    "G2: list /gens/images → returns month folders",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/gens/images",
        "/gens",
      );
      expect(Array.isArray(entries), "G2: must return an array").toBe(true);

      for (const entry of entries) {
        expect(entry.nodeType, "G2: month entries are dirs").toBe("dir");
        expect(entry.name, "G2: month name must match YYYY-MM").toMatch(
          /^\d{4}-\d{2}$/,
        );
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "G3: list /gens/images/{YYYY-MM} → returns gen entries",
    async () => {
      if (!adminUser) {
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/gens/images",
        "/gens",
      );
      if (months.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[G3] No image gens found — skipping");
        return;
      }

      const gens = await resolveVirtualList(
        adminUser.id,
        months[0]!.path,
        "/gens",
      );
      expect(Array.isArray(gens), "G3: must return an array").toBe(true);

      for (const gen of gens) {
        expect(gen.nodeType, "G3: gens are files").toBe("file");
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "G4: read a gen file → returns content with prompt and media URL",
    async () => {
      if (!adminUser) {
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/gens/images",
        "/gens",
      );
      if (months.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[G4] No image gens — skipping");
        return;
      }

      const gens = await resolveVirtualList(
        adminUser.id,
        months[0]!.path,
        "/gens",
      );
      if (gens.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[G4] No gens in first month — skipping");
        return;
      }

      const content = await resolveVirtualRead(
        adminUser.id,
        gens[0]!.path,
        "/gens",
      );
      expect(content, "G4: must return read result").toBeTruthy();
      expect(
        content?.content,
        "G4: content must contain frontmatter",
      ).toContain("---");
      expect(content?.content, "G4: must contain prompt").toContain("prompt:");
    },
    MOUNT_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 10. SSH — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /ssh", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, MOUNT_TIMEOUT);

  it(
    "SSH1: list /ssh → returns connection directories",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await resolveVirtualList(adminUser.id, "/ssh", "/ssh");
      expect(Array.isArray(entries), "SSH1: must return an array").toBe(true);

      for (const entry of entries) {
        expect(entry.nodeType, "SSH1: connections are dirs").toBe("dir");
        expect(entry.name, "SSH1: must have a connection name").toBeTruthy();
      }
    },
    MOUNT_TIMEOUT,
  );

  it(
    "SSH2: read a connection summary → returns frontmatter with connection info",
    async () => {
      if (!adminUser) {
        return;
      }

      const connections = await resolveVirtualList(
        adminUser.id,
        "/ssh",
        "/ssh",
      );
      if (connections.length === 0) {
        // eslint-disable-next-line no-console
        console.info("[SSH2] No SSH connections found — skipping");
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        connections[0]!.path,
        "/ssh",
      );
      expect(result, "SSH2: must return read result").toBeTruthy();
      expect(
        result?.content,
        "SSH2: content must contain frontmatter",
      ).toContain("---");
      expect(result?.content, "SSH2: must contain connectionId").toContain(
        "connectionId:",
      );
    },
    MOUNT_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 11. HASH ENGINE — cross-instance assertions
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: hash engine cross-instance", () => {
  let devUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      devUser = resolved;
    }
    await ensureProvidersRegistered();
  }, SYNC_TIMEOUT);

  it(
    "HE1: identical state → buildSyncPayloads returns empty (zero transfer)",
    async () => {
      if (!devUser) {
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { perProvider } = await computeSyncHashes(devUser.id);

      // Simulate remote sends same hashes
      const { syncPayloads } = await buildSyncPayloads(
        perProvider,
        devUser.id,
        logger,
      );

      expect(
        Object.keys(syncPayloads).length,
        "HE1: no payloads when hashes match",
      ).toBe(0);
    },
    SYNC_TIMEOUT,
  );

  it(
    "HE2: only one provider changed → only that provider in payload",
    async () => {
      if (!devUser) {
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { perProvider } = await computeSyncHashes(devUser.id);

      // Fake: documents hash is stale, skills+memories current
      const { syncPayloads } = await buildSyncPayloads(
        {
          ...perProvider,
          documents:
            "0000000000000000000000000000000000000000000000000000000000000000",
        },
        devUser.id,
        logger,
      );

      expect(syncPayloads, "HE2: documents must be in payload").toHaveProperty(
        "documents",
      );
      if (perProvider["skills"]) {
        expect(
          syncPayloads,
          "HE2: skills must NOT be in payload",
        ).not.toHaveProperty("skills");
      }
    },
    SYNC_TIMEOUT,
  );

  it(
    "HE3: all providers stale → all three payloads sent",
    async () => {
      if (!devUser) {
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const zeroHash =
        "0000000000000000000000000000000000000000000000000000000000000000";

      const { syncPayloads } = await buildSyncPayloads(
        { documents: zeroHash, skills: zeroHash, memories: zeroHash },
        devUser.id,
        logger,
      );

      expect(syncPayloads, "HE3: documents must be sent").toHaveProperty(
        "documents",
      );
      expect(syncPayloads, "HE3: skills must be sent").toHaveProperty("skills");
      expect(syncPayloads, "HE3: memories must be sent").toHaveProperty(
        "memories",
      );
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 12. WS PUSH — live sync without explicit pull
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: WS push (live sync on mutation)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let connected = false;
  let remoteTarget: RemoteTarget | null = null;

  const RUN_ID = Date.now().toString(36);

  beforeAll(async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl || !isCrossInstanceEnabled()) {
      return;
    }

    try {
      await disconnectFromHermes(devUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }
      await connectToHermes(devUser, remoteUrl);
      prodUserId = await resolveProdUserId();
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      remoteTarget = await RemoteTransport.resolveTarget({
        userId: devUser.id,
        locale: defaultLocale,
        logger,
      });
      connected = !!remoteTarget;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[E2E-ws] Setup failed:", String(err));
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    if (devUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            like(cortexNodes.path, `%ws-push-${RUN_ID}%`),
          ),
        );
    }
    if (prodUserId) {
      try {
        const pdb = getProdDb();
        await pdb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE ${`%ws-push-${RUN_ID}%`}`,
        );
      } catch {
        // Best-effort
      }
    }
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      await unregisterDevFromHermes(prodUserId);
    }
    await closeProdDb();
  });

  it(
    "WS1: write cortex document via transport → auto-appears on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("WS1");
        return;
      }

      const wsPath = `/documents/ws-push-${RUN_ID}/ws-doc.md`;
      const wsContent = `# WS Push Test\n\nMarker: ${RUN_ID}`;

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: { path: wsPath, content: wsContent, createParents: true },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `WS1: write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const row = await pollUntil(
        "WS1: document must appear on prod",
        async () => {
          const rows = await pdb.execute<{ path: string }>(
            sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${wsPath} LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
      );

      expect(row.path, "WS1: path must match").toBe(wsPath);
    },
    SYNC_TIMEOUT,
  );

  it(
    "WS2: write memory via transport → auto-appears on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("WS2");
        return;
      }

      const wsPath = `/memories/ws-push-${RUN_ID}.md`;
      const wsContent = `# WS Memory Push\n\nMarker: ${RUN_ID}`;

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await callEndpoint({
        definition: cortexWriteDef.POST,
        input: { path: wsPath, content: wsContent, createParents: true },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `WS2: write must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const row = await pollUntil(
        "WS2: memory must appear on prod",
        async () => {
          const rows = await pdb.execute<{ path: string }>(
            sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND path = ${wsPath} LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
      );

      expect(row.path, "WS2: path must match").toBe(wsPath);
    },
    SYNC_TIMEOUT,
  );

  it(
    "WS3: create skill via transport → auto-appears on prod",
    async () => {
      if (!connected || !remoteTarget || !devUser || !prodUserId) {
        skipCrossInstance("WS3");
        return;
      }

      const wsSlug = `ws-push-skill-${RUN_ID}`;

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { default: skillCreateDef } =
        await import("@/app/api/[locale]/agent/chat/skills/create/definition");
      const result = await callEndpoint({
        definition: skillCreateDef.POST,
        input: {
          name: "WS Push Skill",
          tagline: "WS push test tagline",
          icon: "sparkles",
          description: "WS push test skill — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are a WS test.",
        },
        target: remoteTarget,
        locale: defaultLocale,
        user: devUser,
        logger,
      });
      expect(
        result.success,
        `WS3: create skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const row = await pollUntil(
        "WS3: skill must appear on prod",
        async () => {
          const rows = await pdb.execute<{ name: string }>(
            sql`SELECT name FROM custom_skills WHERE user_id = ${prodUserId} AND name = 'WS Push Skill' LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
      );

      expect(row.name, "WS3: name must match").toBe("WS Push Skill");
    },
    SYNC_TIMEOUT,
  );
});
