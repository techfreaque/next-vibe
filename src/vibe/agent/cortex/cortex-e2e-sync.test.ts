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
 * Read-only mount tests (sections 4-10) run in-process, no extra servers needed.
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, like, sql } from "drizzle-orm";
import { DEFAULT_CHAT_MODEL_SELECTION } from "../ai-stream/constants";
import { ChatModelId } from "../ai-stream/models";
import {
  ATLAS_INSTANCE_ID,
  closeProdDb,
  getProdDb,
  HERMES_INSTANCE_ID,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrl,
  triggerHermesPull,
} from "../ai-stream/testing/remote-setup";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { ChatMessageRole, ThreadStatus } from "../chat/enum";
import { SkillCategory } from "../skills/enum";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { identityEnv } from "next-vibe/identity/env";
import { createEndpointLogger } from "next-vibe/logger/server";
import remoteConnectionDefinitions from "next-vibe/remote-connection/[instanceId]/definition";
import remoteConnectDefinitions from "next-vibe/remote-connection/connect/definition";
import {
  remoteConnections,
  type SyncScope,
} from "next-vibe/remote-connection/db";
import {
  buildSyncPayloads,
  collectCursors,
  ensureProvidersRegistered,
} from "next-vibe/remote-connection/sync/provider";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "./db";
import { CortexNodeType } from "./enum";
import { resolveVirtualList, resolveVirtualRead } from "./mounts/resolver";

// ── Constants ─────────────────────────────────────────────────────────────────

const SYNC_TIMEOUT = 60_000;
const SETUP_TIMEOUT = 180_000;
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

// ══════════════════════════════════════════════════════════════════════════════
// 1. DOCUMENTS — synced via "documents" provider
// ══════════════════════════════════════════════════════════════════════════════

describe("E2E Sync: documents provider (cross-instance CRUD)", () => {
  let devUser: JwtPrivatePayloadType;
  let remoteUrl: string | null = null;
  let prodUserId = "";
  let prodAdminToken = "";
  let connected = false;

  const RUN_ID = Date.now().toString(36);
  const D_ROOT_PATH = `/documents/e2e-sync-${RUN_ID}`;
  const D_FILE_PATH = `${D_ROOT_PATH}/test-doc.md`;
  const D_NESTED_PATH = `${D_ROOT_PATH}/subfolder/nested-doc.md`;
  const D_CONTENT = `# E2E Sync Document\n\nCreated for cross-instance sync test.\nMarker: ${RUN_ID}`;
  const D_NESTED_CONTENT = `# Nested Document\n\nSubfolder sync test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-doc] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-doc] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E-doc] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
      prodUserId = await resolveProdUserId();
      prodAdminToken = remoteUrl!;
      connected = true;
    } catch (err) {
      expect(false, `[E2E-doc] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "D1: create document via transport → verify on prod DB",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: { path: D_FILE_PATH, content: D_CONTENT, createParents: true },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: D_NESTED_PATH,
          content: D_NESTED_CONTENT,
          createParents: true,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const updatedContent = `${D_CONTENT}\n\n## Updated\n\nAdded by D3 test.`;
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: D_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D4] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
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

      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexDeleteDef.DELETE,
        data: { path: D_FILE_PATH, recursive: false },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D5] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const reverseSyncId = randomUUID();
      const reversePath = `${D_ROOT_PATH}/reverse-doc.md`;
      const reverseContent = `# Reverse Sync\n\nWritten on prod for dev to pull.\nMarker: ${reverseSyncId}`;

      // Write to hermes via runInProcessTyped — hermes writes to its DB and WS-pushes to atlas
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: reversePath,
          content: reverseContent,
          createParents: true,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
      });
      expect(
        result.success,
        `D5: write to hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Trigger hermes pull to push the new node from hermes to atlas.
      // Direct-http mode does not maintain a persistent WS from atlas to hermes,
      // so pull-on-reconnect is the sync mechanism for hermes→atlas data flow.
      await triggerHermesPull(prodAdminToken, remoteUrl!);

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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D6] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const biSyncId = randomUUID();
      const biPath = `${D_ROOT_PATH}/bidirectional.md`;

      // Step 1: Write "older" version to hermes via runInProcessTyped (gets current timestamp on hermes)
      const { default: cortexWriteDef } = await import("./write/definition");
      const hermesResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: biPath,
          content: "# Prod loses (older)",
          createParents: true,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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

  const RUN_ID = `rws-${Date.now().toString(36)}`;
  const D_ROOT_PATH = `/documents/e2e-sync-${RUN_ID}`;
  const D_FILE_PATH = `${D_ROOT_PATH}/test-doc.md`;
  const D_NESTED_PATH = `${D_ROOT_PATH}/subfolder/nested-doc.md`;
  const D_CONTENT = `# E2E Sync Document\n\nCreated for cross-instance sync test.\nMarker: ${RUN_ID}`;
  const D_NESTED_CONTENT = `# Nested Document\n\nSubfolder sync test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-doc-rws] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-doc-rws] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
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
      connected = true;
    } catch (err) {
      expect(false, `[E2E-doc-rws] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "D1: create document via transport → verify on prod DB",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: { path: D_FILE_PATH, content: D_CONTENT, createParents: true },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: D_NESTED_PATH,
          content: D_NESTED_CONTENT,
          createParents: true,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const updatedContent = `${D_CONTENT}\n\n## Updated\n\nAdded by D3-rws test.`;
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: D_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[D4] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
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

      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexDeleteDef.DELETE,
        data: { path: D_FILE_PATH, recursive: false },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
  let prodAdminToken = "";
  let connected = false;

  const RUN_ID = Date.now().toString(36);
  const M_FILE_PATH = `/memories/e2e-sync-${RUN_ID}.md`;
  const M_SUBFOLDER_PATH = `/memories/e2e-subfolder-${RUN_ID}/note.md`;
  const M_CONTENT = `# E2E Memory\n\nMemory sync test.\nMarker: ${RUN_ID}`;
  const M_SUB_CONTENT = `# Subfolder Memory\n\nNested memory test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-mem] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-mem] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
      prodUserId = await resolveProdUserId();
      prodAdminToken = remoteUrl!;
      connected = true;
    } catch (err) {
      expect(false, `[E2E-mem] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "M1: create memory via transport → verify on prod DB",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: { path: M_FILE_PATH, content: M_CONTENT, createParents: true },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: M_SUBFOLDER_PATH,
          content: M_SUB_CONTENT,
          createParents: true,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const updatedContent = `${M_CONTENT}\n\n## Updated by M3`;
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: M_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M4] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
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

      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexDeleteDef.DELETE,
        data: { path: M_FILE_PATH, recursive: false },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M5] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const reverseSyncId = randomUUID();
      const reversePath = `/memories/e2e-sync-reverse-${RUN_ID}.md`;
      const reverseContent = `# Reverse Memory\n\nMarker: ${reverseSyncId}`;

      // Write to hermes via runInProcessTyped — hermes writes to its DB and WS-pushes to atlas
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: reversePath,
          content: reverseContent,
          createParents: true,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
      });
      expect(
        result.success,
        `M5: write to hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Trigger hermes pull — direct-http mode has no persistent WS from atlas to hermes.
      await triggerHermesPull(prodAdminToken, remoteUrl!);

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
        expect(false, "[M6] devUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      await ensureProvidersRegistered();
      const cursorsBefore = await collectCursors(devUser.id);

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

      const cursorsAfter = await collectCursors(devUser.id);

      // Memories cursor must advance
      expect(
        JSON.stringify(cursorsBefore["memories"]),
        "M6: memories cursor must advance",
      ).not.toBe(JSON.stringify(cursorsAfter["memories"]));
      // Skills cursor must NOT change
      expect(
        JSON.stringify(cursorsBefore["skills"]),
        "M6: skills cursor must be unchanged",
      ).toBe(JSON.stringify(cursorsAfter["skills"]));

      // Build payloads with old memories cursor, current skills/documents cursor
      const logger = createEndpointLogger(false, defaultLocale);
      const { syncPayloads } = await buildSyncPayloads(
        {
          documents: cursorsAfter["documents"]!,
          skills: cursorsAfter["skills"]!,
          memories: cursorsBefore["memories"]!,
        },
        devUser.id,
        logger,
      );

      // memories has a record newer than the stale cursor → non-empty payload.
      expect(
        syncPayloads["memories"],
        "M6: memories must carry records",
      ).not.toBe("[]");
      // skills cursor current → empty payload (no transfer).
      expect(syncPayloads["skills"], "M6: skills must be empty").toBe("[]");

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

  const RUN_ID = `rws-${Date.now().toString(36)}`;
  const M_FILE_PATH = `/memories/e2e-sync-${RUN_ID}.md`;
  const M_SUBFOLDER_PATH = `/memories/e2e-subfolder-${RUN_ID}/note.md`;
  const M_CONTENT = `# E2E Memory\n\nMemory sync test.\nMarker: ${RUN_ID}`;
  const M_SUB_CONTENT = `# Subfolder Memory\n\nNested memory test.\nMarker: ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-mem-rws] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-mem-rws] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
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
      connected = true;
    } catch (err) {
      expect(false, `[E2E-mem-rws] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "M1: create memory via transport → verify on prod DB",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: { path: M_FILE_PATH, content: M_CONTENT, createParents: true },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: M_SUBFOLDER_PATH,
          content: M_SUB_CONTENT,
          createParents: true,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const updatedContent = `${M_CONTENT}\n\n## Updated by M3-rws`;
      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: {
          path: M_FILE_PATH,
          content: updatedContent,
          createParents: false,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[M4] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
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

      const { default: cortexDeleteDef } = await import("./delete/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexDeleteDef.DELETE,
        data: { path: M_FILE_PATH, recursive: false },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
  let prodAdminToken = "";
  let connected = false;
  let prodSkillId = "";

  const RUN_ID = Date.now().toString(36);
  const TEST_SKILL_SLUG = `e2e-sync-skill-${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-skill] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-skill] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
      prodUserId = await resolveProdUserId();
      prodAdminToken = remoteUrl!;
      connected = true;
    } catch (err) {
      expect(false, `[E2E-skill] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

  afterAll(async () => {
    // Clean dev custom skills
    if (devUser) {
      const { customSkills } = await import("../skills/db");
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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "S1: create custom skill via transport → verify on prod DB",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[S1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: skillCreateDef } =
        await import("../skills/create/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillCreateDef.POST,
        data: {
          name: "E2E Sync Skill",
          tagline: "E2E test tagline",
          icon: "sparkles",
          description: "Skill for E2E sync testing — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are an E2E test skill.",
          sttModelSelection: undefined,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId || !prodSkillId) {
        expect(
          false,
          `[S2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId} prodSkillId=${!!prodSkillId}`,
        ).toBe(true);
        return;
      }

      const { default: skillDef } =
        await import("../skills/[id]/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillDef.PATCH,
        data: {
          name: "E2E Sync Skill Updated",
          tagline: "E2E test tagline",
          icon: "sparkles",
          description: "Skill for E2E sync testing — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are an updated E2E test skill.",
        },
        urlPathParams: { id: prodSkillId },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId || !prodSkillId) {
        expect(
          false,
          `[S3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId} prodSkillId=${!!prodSkillId}`,
        ).toBe(true);
        return;
      }

      const { default: skillDef } =
        await import("../skills/[id]/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillDef.DELETE,
        urlPathParams: { id: prodSkillId },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[S4] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      // Create skill on hermes via runInProcessTyped — hermes writes and WS-pushes to atlas
      const { default: skillCreateDef } =
        await import("../skills/create/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillCreateDef.POST,
        data: {
          name: "Reverse Skill",
          tagline: "Reverse sync tagline",
          icon: "ai",
          description: "Reverse sync test skill for E2E",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are reverse.",
          sttModelSelection: undefined,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
      });
      expect(
        result.success,
        `S4: create skill on hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Trigger hermes pull — direct-http mode has no persistent WS from atlas to hermes.
      await triggerHermesPull(prodAdminToken, remoteUrl!);

      const { customSkills } = await import("../skills/db");
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
        expect(false, "[S5] devUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      await ensureProvidersRegistered();
      const cursorsBefore = await collectCursors(devUser.id);

      const { customSkills } = await import("../skills/db");
      const isoSlug = `${TEST_SKILL_SLUG}-isolation`;
      await db.insert(customSkills).values({
        id: randomUUID(),
        userId: devUser.id,
        name: "Isolation Skill",
        slug: isoSlug,
        description: "For isolation test",
        systemPrompt: "Isolation.",
        icon: "ai",
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

      const cursorsAfter = await collectCursors(devUser.id);

      expect(
        JSON.stringify(cursorsBefore["skills"]),
        "S5: skills cursor must advance",
      ).not.toBe(JSON.stringify(cursorsAfter["skills"]));
      expect(
        JSON.stringify(cursorsBefore["documents"]),
        "S5: documents cursor must be unchanged",
      ).toBe(JSON.stringify(cursorsAfter["documents"]));
      expect(
        JSON.stringify(cursorsBefore["memories"]),
        "S5: memories cursor must be unchanged",
      ).toBe(JSON.stringify(cursorsAfter["memories"]));

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
  let prodSkillId = "";

  const RUN_ID = `rws-${Date.now().toString(36)}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-skill-rws] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-skill-rws] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
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
      connected = true;
    } catch (err) {
      expect(false, `[E2E-skill-rws] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

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
      const { customSkills } = await import("../skills/db");
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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "S1: create custom skill via transport → verify on prod DB",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[S1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: skillCreateDef } =
        await import("../skills/create/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillCreateDef.POST,
        data: {
          name: "E2E Sync Skill RWS",
          tagline: "E2E test tagline",
          icon: "sparkles",
          description: "Skill for E2E sync testing — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are an E2E test skill (reverse-ws).",
          sttModelSelection: undefined,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId || !prodSkillId) {
        expect(
          false,
          `[S2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId} prodSkillId=${!!prodSkillId}`,
        ).toBe(true);
        return;
      }

      const { default: skillDef } =
        await import("../skills/[id]/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillDef.PATCH,
        data: {
          name: "E2E Sync Skill RWS Updated",
          tagline: "E2E test tagline",
          icon: "sparkles",
          description: "Skill for E2E sync testing — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are an updated E2E test skill (reverse-ws).",
        },
        urlPathParams: { id: prodSkillId },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
      });
      expect(
        result.success,
        `S2-rws: update skill must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      const pdb = getProdDb();
      const s2Row = await pollUntil(
        "S2-rws: updated skill must appear on prod",
        async () => {
          const r = await pdb.execute<{ name: string; system_prompt: string }>(
            sql`SELECT name, system_prompt FROM custom_skills WHERE user_id = ${prodUserId} AND id = ${prodSkillId} LIMIT 1`,
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
      if (!connected || !devUser || !prodUserId || !prodSkillId) {
        expect(
          false,
          `[S3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId} prodSkillId=${!!prodSkillId}`,
        ).toBe(true);
        return;
      }

      const { default: skillDef } =
        await import("../skills/[id]/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillDef.DELETE,
        urlPathParams: { id: prodSkillId },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
  let prodAdminToken = "";
  let connected = false;

  const RUN_ID = Date.now().toString(36);
  const TH_THREAD_ID = randomUUID();
  const TH_TITLE = `E2E Thread Sync ${RUN_ID}`;
  const TH_MSG_CONTENT = `Hello from thread sync test ${RUN_ID}`;

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-thread] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-thread] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
      prodUserId = await resolveProdUserId();
      prodAdminToken = remoteUrl!;
      connected = true;
    } catch (err) {
      expect(false, `[E2E-thread] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

  afterAll(async () => {
    // Clean dev threads + messages
    if (devUser) {
      const { chatThreads: ct, chatMessages: cm } =
        await import("../chat/db");
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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "TH1: create thread via transport → appears on prod with REMOTE root folder",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[TH1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: threadsDef } =
        await import("../chat/threads/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: threadsDef.POST,
        data: {
          id: TH_THREAD_ID,
          title: TH_TITLE,
          rootFolderId: DefaultFolderId.REMOTE,
          model: ChatModelId.GPT_5_4_NANO,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[TH2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: messagesDef } =
        await import("../chat/threads/[threadId]/messages/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: messagesDef.POST,
        data: {
          rootFolderId: DefaultFolderId.PRIVATE,
          role: ChatMessageRole.USER,
          content: TH_MSG_CONTENT,
        },
        urlPathParams: { threadId: TH_THREAD_ID },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[TH3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const updatedTitle = `E2E Thread Sync ${RUN_ID} UPDATED`;
      const { default: renameDef } =
        await import("../chat/threads/rename/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: renameDef.PATCH,
        data: {
          threadId: TH_THREAD_ID,
          title: updatedTitle,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[TH4] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const reverseTitle = `E2E Thread Sync ${RUN_ID} Reverse`;

      // Create thread on hermes via runInProcessTyped — hermes writes and WS-pushes to atlas
      const { default: threadsDef } =
        await import("../chat/threads/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: threadsDef.POST,
        data: {
          rootFolderId: DefaultFolderId.PRIVATE,
          title: reverseTitle,
          model: ChatModelId.GPT_5_4_NANO,
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
      });
      expect(
        result.success,
        `TH4: create thread on hermes must succeed — ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);

      // Trigger hermes pull — threads are pull-on-connect only (no persistent WS atlas→hermes).
      await triggerHermesPull(prodAdminToken, remoteUrl!);

      const { chatThreads: ct } = await import("../chat/db");
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
        expect(
          false,
          `[TH5] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const biThreadId = randomUUID();
      const biTitle = `E2E Thread Sync ${RUN_ID} Bi`;
      const now = new Date();
      const olderTime = new Date(now.getTime() - 3_600_000); // 1h older

      const { chatThreads: ct } = await import("../chat/db");

      // Write newer version on dev
      await db.insert(ct).values({
        id: biThreadId,
        userId: devUser.id,
        title: `${biTitle} DEV-NEWER`,
        rootFolderId: DefaultFolderId.PRIVATE,
        status: ThreadStatus.ACTIVE,
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

      // Trigger hermes to reconnect — fires pullOnConnect which bidirectionally syncs.
      // Dev wrote newer; prod has older — after sync, dev should WIN (LWW).
      await triggerHermesPull(prodAdminToken, remoteUrl!);

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

  it(
    "TH6: syncScope.threads=false → thread NOT synced on pull",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[TH6] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const th6ThreadId = randomUUID();
      const th6Title = `TH6 Scope Test ${RUN_ID}`;

      // 1. Disable threads sync on atlas's hermes connection row
      const scopeThreadsOff: SyncScope = {
        memories: true,
        documents: true,
        skills: true,
        favorites: true,
        threads: false,
      };
      await db
        .update(remoteConnections)
        .set({ syncScope: scopeThreadsOff, updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, devUser.id),
            eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
          ),
        );

      try {
        // 2. Write a unique thread directly into hermes prod DB
        const pdb = getProdDb();
        await pdb.execute(
          sql`INSERT INTO chat_threads (id, user_id, title, root_folder_id, status, pinned, archived, tags, created_at, updated_at)
            VALUES (${th6ThreadId}, ${prodUserId}, ${th6Title}, 'remote', 'active', false, false, '[]', NOW(), NOW())
            ON CONFLICT DO NOTHING`,
        );

        // 3. Trigger hermes reconnect — fires pullOnConnect
        await triggerHermesPull(prodAdminToken, remoteUrl!);

        // 4. Wait for any sync to complete
        await sleep(4000);

        // 5. Assert the thread does NOT appear on atlas
        const { chatThreads: ct } = await import("../chat/db");
        const rows = await db
          .select({ id: ct.id })
          .from(ct)
          .where(
            and(eq(ct.userId, devUser.id), like(ct.title, "TH6 Scope Test%")),
          );
        expect(
          rows.length,
          "TH6: thread must NOT appear on atlas when syncScope.threads=false",
        ).toBe(0);
      } finally {
        // 6. Restore syncScope.threads=true
        const scopeThreadsOn: SyncScope = {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: true,
        };
        await db
          .update(remoteConnections)
          .set({ syncScope: scopeThreadsOn, updatedAt: new Date() })
          .where(
            and(
              eq(remoteConnections.userId, devUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          );

        // 7. Cleanup: delete the thread from hermes DB
        try {
          const pdb = getProdDb();
          await pdb.execute(
            sql`DELETE FROM chat_threads WHERE id = ${th6ThreadId} AND user_id = ${prodUserId}`,
          );
        } catch {
          // Best-effort
        }
      }
    },
    SYNC_TIMEOUT,
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. THREADS — virtual mount hierarchy verification (in-process)
// ══════════════════════════════════════════════════════════════════════════════

describe("Mount hierarchy: /threads", () => {
  let adminUser: JwtPrivatePayloadType;

  // Fixtures: a root-level thread (for T3) and a subfolder with a thread (for T4),
  // both in the private root folder. Deterministic ids keyed by a unique token.
  // NOTE: the title token must NOT contain a UUID — the threads mount derives
  // the threadId from the filename via a UUID regex, and a UUID inside the
  // slugified title would shadow the real thread id appended after the slug.
  const MH_RUN_ID = Date.now().toString(36);
  const MH_ROOT_THREAD_ID = randomUUID();
  const MH_SUB_THREAD_ID = randomUUID();
  const MH_SUBFOLDER_ID = randomUUID();
  const MH_THREAD_TITLE = `Mount Threads Fixture ${MH_RUN_ID}`;
  const MH_SUBFOLDER_NAME = `mh-subfolder-${MH_RUN_ID}`;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    if (!adminUser) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }

    const { chatThreads: ct, chatFolders: cf } =
      await import("../chat/db");

    // Root-level thread in /threads/private (no folder) → surfaces as a file at
    // the private root, giving T3 a real thread to read.
    await db
      .insert(ct)
      .values({
        id: MH_ROOT_THREAD_ID,
        userId: adminUser.id,
        title: MH_THREAD_TITLE,
        rootFolderId: DefaultFolderId.PRIVATE,
        status: ThreadStatus.ACTIVE,
        defaultModel: ChatModelId.GPT_5_4_NANO,
        pinned: false,
        archived: false,
        tags: ["mount", "fixture"],
      })
      .onConflictDoNothing();

    // Subfolder under the private root → surfaces as a dir for T4.
    await db
      .insert(cf)
      .values({
        id: MH_SUBFOLDER_ID,
        userId: adminUser.id,
        rootFolderId: DefaultFolderId.PRIVATE,
        name: MH_SUBFOLDER_NAME,
        parentId: null,
        sortOrder: 0,
      })
      .onConflictDoNothing();

    // A thread inside the subfolder so listing the subfolder returns content.
    await db
      .insert(ct)
      .values({
        id: MH_SUB_THREAD_ID,
        userId: adminUser.id,
        title: `${MH_THREAD_TITLE} (sub)`,
        rootFolderId: DefaultFolderId.PRIVATE,
        folderId: MH_SUBFOLDER_ID,
        status: ThreadStatus.ACTIVE,
        defaultModel: ChatModelId.GPT_5_4_NANO,
        pinned: false,
        archived: false,
        tags: [],
      })
      .onConflictDoNothing();
  }, MOUNT_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    const { chatThreads: ct, chatFolders: cf } =
      await import("../chat/db");
    await db
      .delete(ct)
      .where(
        and(
          eq(ct.userId, adminUser.id),
          like(ct.title, `Mount Threads Fixture ${MH_RUN_ID}%`),
        ),
      );
    await db
      .delete(cf)
      .where(and(eq(cf.userId, adminUser.id), eq(cf.id, MH_SUBFOLDER_ID)));
  }, MOUNT_TIMEOUT);

  it(
    "T1: list /threads → returns root folder entries",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/threads",
        "/threads",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/threads/private",
        "/threads",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      // Find our fixture thread to read (beforeAll inserted it at the private root).
      const entries = await resolveVirtualList(
        adminUser.id,
        "/threads/private",
        "/threads",
        true,
      );
      const threadFile = entries.find(
        (e) =>
          e.nodeType === "file" &&
          e.name.endsWith(".md") &&
          e.name.includes(MH_ROOT_THREAD_ID),
      );

      expect(
        threadFile,
        "T3: fixture thread must be listed at /threads/private",
      ).toBeTruthy();
      if (!threadFile) {
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        threadFile.path,
        "/threads",
        true,
        defaultLocale,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const rootEntries = await resolveVirtualList(
        adminUser.id,
        "/threads/private",
        "/threads",
        true,
      );
      // beforeAll created a named subfolder; find it explicitly.
      const subfolder = rootEntries.find(
        (e) => e.nodeType === "dir" && e.name === MH_SUBFOLDER_NAME,
      );

      expect(
        subfolder,
        "T4: fixture subfolder must be listed at /threads/private",
      ).toBeTruthy();
      if (!subfolder) {
        return;
      }

      const subEntries = await resolveVirtualList(
        adminUser.id,
        subfolder.path,
        "/threads",
        true,
      );
      expect(
        Array.isArray(subEntries),
        "T4: subfolder list must return array",
      ).toBe(true);
      // The subfolder contains the fixture thread → must surface it as a file.
      const subThreadFile = subEntries.find(
        (e) => e.nodeType === "file" && e.name.includes(MH_SUB_THREAD_ID),
      );
      expect(
        subThreadFile,
        "T4: subfolder must list its thread file",
      ).toBeTruthy();
    },
    MOUNT_TIMEOUT,
  );

  it(
    "T5: buildThinThreadContent produces title+preview without message dumps",
    async () => {
      const { buildThinThreadContent } =
        await import("../ai-stream/repository/core/message-db-writer");

      const thin = buildThinThreadContent({
        title: "Test Thread",
        rootFolderId: "private",
        tags: ["test", "e2e"],
        description: "Hello, this is a test preview",
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

  const FAV_RUN_ID = randomUUID();
  const FAV_ID = randomUUID();
  const FAV_SLUG = `mh-favorite-${FAV_RUN_ID}`;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    if (!adminUser) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }

    const { chatFavorites } =
      await import("../skills/favorites/db");
    await db
      .insert(chatFavorites)
      .values({
        id: FAV_ID,
        slug: FAV_SLUG,
        userId: adminUser.id,
        skillId: "vibe-coder",
        variantId: "default",
        position: 0,
      })
      .onConflictDoNothing();
  }, MOUNT_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    const { chatFavorites } =
      await import("../skills/favorites/db");
    await db
      .delete(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, adminUser.id),
          eq(chatFavorites.id, FAV_ID),
        ),
      );
  }, MOUNT_TIMEOUT);

  it(
    "F1: list /favorites → returns favorite entries",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/favorites",
        "/favorites",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/favorites",
        "/favorites",
        true,
      );
      // beforeAll inserted a favorite with a unique slug → must be listed.
      const favEntry = entries.find((e) => e.name === `${FAV_SLUG}.md`);
      expect(favEntry, "F2: fixture favorite must be listed").toBeTruthy();
      if (!favEntry) {
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        favEntry.path,
        "/favorites",
        true,
        defaultLocale,
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

  const TK_RUN_ID = randomUUID();
  const TK_TASK_ID = `mh-task-${TK_RUN_ID}`;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    if (!adminUser) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }

    const { cronTasks } = await import("next-vibe/tasks/cron/db");
    const { CronTaskPriority, TaskCategory } =
      await import("next-vibe/tasks/enum");
    await db
      .insert(cronTasks)
      .values({
        id: TK_TASK_ID,
        shortId: TK_RUN_ID.slice(0, 8),
        routeId: "noop",
        displayName: `Mount Task Fixture ${TK_RUN_ID}`,
        description: "Fixture cron task for /tasks mount hierarchy test.",
        category: TaskCategory.SYSTEM,
        schedule: "0 0 * * *",
        priority: CronTaskPriority.LOW,
        enabled: false,
        userId: adminUser.id,
      })
      .onConflictDoNothing();
  }, MOUNT_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    const { cronTasks } = await import("next-vibe/tasks/cron/db");
    await db.delete(cronTasks).where(eq(cronTasks.id, TK_TASK_ID));
  }, MOUNT_TIMEOUT);

  it(
    "TK1: list /tasks → returns task entries",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/tasks",
        "/tasks",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/tasks",
        "/tasks",
        true,
      );
      // beforeAll inserted a cron task with a unique id → must be listed.
      const taskEntry = entries.find((e) => e.name === `${TK_TASK_ID}.md`);
      expect(taskEntry, "TK2: fixture task must be listed").toBeTruthy();
      if (!taskEntry) {
        return;
      }

      const result = await resolveVirtualRead(
        adminUser.id,
        taskEntry.path,
        "/tasks",
        true,
        defaultLocale,
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

  // Uploads derive from chatMessages.metadata.attachments. Create a thread +
  // a user message carrying an image attachment so /uploads/images has content.
  const UP_RUN_ID = randomUUID();
  const UP_THREAD_ID = randomUUID();
  const UP_MSG_ID = randomUUID();
  const UP_FILENAME = `mh-upload-${UP_RUN_ID}.png`;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    if (!adminUser) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }

    const { chatThreads: ct, chatMessages: cm } =
      await import("../chat/db");
    await db
      .insert(ct)
      .values({
        id: UP_THREAD_ID,
        userId: adminUser.id,
        title: `Mount Uploads Fixture ${UP_RUN_ID}`,
        rootFolderId: DefaultFolderId.PRIVATE,
        status: ThreadStatus.ACTIVE,
        pinned: false,
        archived: false,
        tags: [],
      })
      .onConflictDoNothing();
    await db
      .insert(cm)
      .values({
        id: UP_MSG_ID,
        threadId: UP_THREAD_ID,
        role: ChatMessageRole.USER,
        content: `Uploading an image ${UP_RUN_ID}`,
        metadata: {
          attachments: [
            {
              id: randomUUID(),
              url: `https://example.test/${UP_FILENAME}`,
              filename: UP_FILENAME,
              mimeType: "image/png",
              size: 1234,
            },
          ],
        },
      })
      .onConflictDoNothing();
  }, MOUNT_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    const { chatThreads: ct, chatMessages: cm } =
      await import("../chat/db");
    await db.delete(cm).where(eq(cm.threadId, UP_THREAD_ID));
    await db
      .delete(ct)
      .where(and(eq(ct.userId, adminUser.id), eq(ct.id, UP_THREAD_ID)));
  }, MOUNT_TIMEOUT);

  it(
    "U1: list /uploads → returns type folders",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/uploads",
        "/uploads",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/uploads/images",
        "/uploads",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const threadDirs = await resolveVirtualList(
        adminUser.id,
        "/uploads/images",
        "/uploads",
        true,
      );
      // beforeAll created an image attachment → its thread dir must be present.
      const fixtureDir = threadDirs.find((d) => d.path.includes(UP_THREAD_ID));
      expect(
        fixtureDir,
        "U3: fixture upload thread dir must be listed under /uploads/images",
      ).toBeTruthy();
      if (!fixtureDir) {
        return;
      }

      const files = await resolveVirtualList(
        adminUser.id,
        fixtureDir.path,
        "/uploads",
        true,
      );
      expect(Array.isArray(files), "U3: must return an array").toBe(true);
      expect(
        files.length,
        "U3: thread dir must list upload files",
      ).toBeGreaterThan(0);

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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      // Traverse: /uploads/images → fixture thread dir → fixture file
      const threadDirs = await resolveVirtualList(
        adminUser.id,
        "/uploads/images",
        "/uploads",
        true,
      );
      const fixtureDir = threadDirs.find((d) => d.path.includes(UP_THREAD_ID));
      expect(
        fixtureDir,
        "U4: fixture upload thread dir must be listed",
      ).toBeTruthy();
      if (!fixtureDir) {
        return;
      }

      const files = await resolveVirtualList(
        adminUser.id,
        fixtureDir.path,
        "/uploads",
        true,
      );
      expect(
        files.length,
        "U4: fixture thread dir must list its upload file",
      ).toBeGreaterThan(0);

      const result = await resolveVirtualRead(
        adminUser.id,
        files[0]!.path,
        "/uploads",
        true,
        defaultLocale,
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

  // Searches derive from tool messages with toolCall.toolName="web-search".
  const SR_RUN_ID = randomUUID();
  const SR_THREAD_ID = randomUUID();
  const SR_MSG_ID = randomUUID();
  const SR_QUERY = `mount fixture query ${SR_RUN_ID}`;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    if (!adminUser) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }

    const { chatThreads: ct, chatMessages: cm } =
      await import("../chat/db");
    await db
      .insert(ct)
      .values({
        id: SR_THREAD_ID,
        userId: adminUser.id,
        title: `Mount Searches Fixture ${SR_RUN_ID}`,
        rootFolderId: DefaultFolderId.PRIVATE,
        status: ThreadStatus.ACTIVE,
        pinned: false,
        archived: false,
        tags: [],
      })
      .onConflictDoNothing();
    await db
      .insert(cm)
      .values({
        id: SR_MSG_ID,
        threadId: SR_THREAD_ID,
        role: ChatMessageRole.TOOL,
        content: null,
        metadata: {
          toolCall: {
            toolCallId: randomUUID(),
            toolName: "web-search",
            args: { query: SR_QUERY },
            result: {
              usedProvider: "brave",
              output: "Fixture search answer.",
              results: [
                {
                  title: "Fixture Result",
                  url: "https://example.test/result",
                  snippet: "A fixture search result snippet.",
                },
              ],
            },
          },
        },
      })
      .onConflictDoNothing();
  }, MOUNT_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    const { chatThreads: ct, chatMessages: cm } =
      await import("../chat/db");
    await db.delete(cm).where(eq(cm.threadId, SR_THREAD_ID));
    await db
      .delete(ct)
      .where(and(eq(ct.userId, adminUser.id), eq(ct.id, SR_THREAD_ID)));
  }, MOUNT_TIMEOUT);

  it(
    "SR1: list /searches → returns month folders",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/searches",
        "/searches",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/searches",
        "/searches",
        true,
      );
      // beforeAll inserted a search → at least one month folder must exist.
      expect(
        months.length,
        "SR2: at least the fixture's month folder must exist",
      ).toBeGreaterThan(0);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthDir =
        months.find((m) => m.name === currentMonth) ?? months[0]!;

      const results = await resolveVirtualList(
        adminUser.id,
        monthDir.path,
        "/searches",
        true,
      );
      expect(Array.isArray(results), "SR2: must return an array").toBe(true);
      // The fixture search must be present in its month.
      const fixtureResult = results.find((r) => r.name.includes(SR_MSG_ID));
      expect(
        fixtureResult,
        "SR2: fixture search result must be listed in its month",
      ).toBeTruthy();

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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/searches",
        "/searches",
        true,
      );
      expect(
        months.length,
        "SR3: at least the fixture's month folder must exist",
      ).toBeGreaterThan(0);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthDir =
        months.find((m) => m.name === currentMonth) ?? months[0]!;

      const results = await resolveVirtualList(
        adminUser.id,
        monthDir.path,
        "/searches",
        true,
      );
      const fixtureResult = results.find((r) => r.name.includes(SR_MSG_ID));
      expect(
        fixtureResult,
        "SR3: fixture search result must be listed",
      ).toBeTruthy();
      if (!fixtureResult) {
        return;
      }

      const content = await resolveVirtualRead(
        adminUser.id,
        fixtureResult.path,
        "/searches",
        true,
        defaultLocale,
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

  // Gens derive from tool messages with toolName="generate_image".
  const GEN_RUN_ID = randomUUID();
  const GEN_THREAD_ID = randomUUID();
  const GEN_MSG_ID = randomUUID();
  const GEN_PROMPT = `mount fixture image prompt ${GEN_RUN_ID}`;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    if (!adminUser) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }

    const { chatThreads: ct, chatMessages: cm } =
      await import("../chat/db");
    await db
      .insert(ct)
      .values({
        id: GEN_THREAD_ID,
        userId: adminUser.id,
        title: `Mount Gens Fixture ${GEN_RUN_ID}`,
        rootFolderId: DefaultFolderId.PRIVATE,
        status: ThreadStatus.ACTIVE,
        pinned: false,
        archived: false,
        tags: [],
      })
      .onConflictDoNothing();
    await db
      .insert(cm)
      .values({
        id: GEN_MSG_ID,
        threadId: GEN_THREAD_ID,
        role: ChatMessageRole.TOOL,
        content: null,
        metadata: {
          toolCall: {
            toolCallId: randomUUID(),
            toolName: "generate_image",
            args: { prompt: GEN_PROMPT },
            status: "completed",
            result: {
              imageUrl: "https://example.test/fixture-image.png",
              creditCost: 1,
            },
          },
        },
      })
      .onConflictDoNothing();
  }, MOUNT_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    const { chatThreads: ct, chatMessages: cm } =
      await import("../chat/db");
    await db.delete(cm).where(eq(cm.threadId, GEN_THREAD_ID));
    await db
      .delete(ct)
      .where(and(eq(ct.userId, adminUser.id), eq(ct.id, GEN_THREAD_ID)));
  }, MOUNT_TIMEOUT);

  it(
    "G1: list /gens → returns type folders (images, audio, video)",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/gens",
        "/gens",
        true,
      );
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/gens/images",
        "/gens",
        true,
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/gens/images",
        "/gens",
        true,
      );
      // beforeAll inserted an image gen → at least one month folder must exist.
      expect(
        months.length,
        "G3: at least the fixture's month folder must exist",
      ).toBeGreaterThan(0);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthDir =
        months.find((m) => m.name === currentMonth) ?? months[0]!;

      const gens = await resolveVirtualList(
        adminUser.id,
        monthDir.path,
        "/gens",
        true,
      );
      expect(Array.isArray(gens), "G3: must return an array").toBe(true);
      const fixtureGen = gens.find((g) => g.name.includes(GEN_MSG_ID));
      expect(
        fixtureGen,
        "G3: fixture gen must be listed in its month",
      ).toBeTruthy();

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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const months = await resolveVirtualList(
        adminUser.id,
        "/gens/images",
        "/gens",
        true,
      );
      expect(
        months.length,
        "G4: at least the fixture's month folder must exist",
      ).toBeGreaterThan(0);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthDir =
        months.find((m) => m.name === currentMonth) ?? months[0]!;

      const gens = await resolveVirtualList(
        adminUser.id,
        monthDir.path,
        "/gens",
        true,
      );
      const fixtureGen = gens.find((g) => g.name.includes(GEN_MSG_ID));
      expect(fixtureGen, "G4: fixture gen must be listed").toBeTruthy();
      if (!fixtureGen) {
        return;
      }

      const content = await resolveVirtualRead(
        adminUser.id,
        fixtureGen.path,
        "/gens",
        true,
        defaultLocale,
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
    adminUser = await resolveTestAdminUser();
    if (!adminUser) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }
    // Guarantee the built-in "Local Machine" connection exists so SSH2 always
    // has a connection to read. ensureLocalConnection is idempotent.
    const { ensureLocalConnection } = await import("./mounts/ssh");
    await ensureLocalConnection(adminUser.id, true);
  }, MOUNT_TIMEOUT);

  it(
    "SSH1: list /ssh → returns connection directories",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const entries = await resolveVirtualList(
        adminUser.id,
        "/ssh",
        "/ssh",
        true,
      );
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
        expect(false, "adminUser not set — beforeAll must have failed").toBe(
          true,
        );
        return;
      }

      const connections = await resolveVirtualList(
        adminUser.id,
        "/ssh",
        "/ssh",
        true,
      );
      // beforeAll ensured the local-machine connection exists.
      expect(
        connections.length,
        "SSH2: at least the local-machine connection must be listed",
      ).toBeGreaterThan(0);

      const localConn =
        connections.find((c) => c.name === "local-machine") ?? connections[0]!;

      const result = await resolveVirtualRead(
        adminUser.id,
        localConn.path,
        "/ssh",
        true,
        defaultLocale,
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
    devUser = await resolveTestAdminUser();
    await ensureProvidersRegistered();
  }, SYNC_TIMEOUT);

  it(
    "HE1: identical state → buildSyncPayloads returns empty (zero transfer)",
    async () => {
      if (!devUser) {
        expect(
          false,
          "[HE1] devUser not set — beforeAll must have failed",
        ).toBe(true);
        return;
      }

      const logger = createEndpointLogger(false, defaultLocale);

      // First serialize from null → each provider's true high-water cursor.
      const first = await buildSyncPayloads({}, devUser.id, logger);
      // Echo those cursors back.
      const { syncPayloads } = await buildSyncPayloads(
        first.ourCursors,
        devUser.id,
        logger,
      );

      // Standard (updatedAt-gated) providers serve nothing at a current cursor.
      // threads is excluded: REMOTE-folder threads are owner-authoritative and
      // re-served unconditionally by design.
      for (const key of ["documents", "skills", "memories", "favorites"]) {
        expect(
          syncPayloads[key],
          `HE1: ${key} empty when cursor is current`,
        ).toBe("[]");
      }
    },
    SYNC_TIMEOUT,
  );

  it(
    "HE2: only one provider changed → only that provider transfers data",
    async () => {
      if (!devUser) {
        expect(
          false,
          "[HE2] devUser not set — beforeAll must have failed",
        ).toBe(true);
        return;
      }

      const logger = createEndpointLogger(false, defaultLocale);
      const cursors = await collectCursors(devUser.id);

      // Fake: documents cursor is stale (epoch), skills+memories current.
      const { syncPayloads } = await buildSyncPayloads(
        {
          ...cursors,
          documents: { updatedAt: new Date(0).toISOString() },
        },
        devUser.id,
        logger,
      );

      // documents stale → everything served (non-empty if any docs exist).
      expect(syncPayloads, "HE2: documents key present").toHaveProperty(
        "documents",
      );
      // skills cursor current → empty payload.
      expect(syncPayloads["skills"], "HE2: skills must be empty").toBe("[]");
    },
    SYNC_TIMEOUT,
  );

  it(
    "HE3: all providers stale → all three payloads keyed",
    async () => {
      if (!devUser) {
        expect(
          false,
          "[HE3] devUser not set — beforeAll must have failed",
        ).toBe(true);
        return;
      }

      const logger = createEndpointLogger(false, defaultLocale);
      const epoch = { updatedAt: new Date(0).toISOString() };

      const { syncPayloads } = await buildSyncPayloads(
        { documents: epoch, skills: epoch, memories: epoch },
        devUser.id,
        logger,
      );

      expect(syncPayloads, "HE3: documents must be keyed").toHaveProperty(
        "documents",
      );
      expect(syncPayloads, "HE3: skills must be keyed").toHaveProperty(
        "skills",
      );
      expect(syncPayloads, "HE3: memories must be keyed").toHaveProperty(
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

  const RUN_ID = Date.now().toString(36);

  beforeAll(async () => {
    const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      expect(
        false,
        `[E2E-ws] Dev user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      ).toBe(true);
      return;
    }
    devUser = resolved;

    remoteUrl = await resolveRemoteUrl();
    if (!remoteUrl) {
      expect(
        false,
        "[E2E-ws] No remote URL configured — connect Hermes before running",
      ).toBe(true);
      return;
    }

    try {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: remoteConnectionDefinitions.DELETE,
          urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
          user: devUser,
          instanceId: HERMES_INSTANCE_ID,
        });
      }
      const connectResult = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectDefinitions.POST,
        data: {
          remoteUrl: remoteUrl!,
          email: identityEnv.VIBE_ADMIN_USER_EMAIL,
          password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
          // Cortex e2e exercises memory/document mirroring — full sync scope.
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: true,
          },
        },
        user: devUser,
      });
      if (!connectResult.success) {
        expect(
          false,
          `[E2E] Connect failed: ${connectResult.message ?? "unknown"}`,
        ).toBe(true);
        return;
      }
      prodUserId = await resolveProdUserId();
      connected = true;
    } catch (err) {
      expect(false, `[E2E-ws] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, SETUP_TIMEOUT);

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
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: HERMES_INSTANCE_ID },
        user: devUser,
      });
    }
    if (prodUserId) {
      await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: remoteConnectionDefinitions.DELETE,
        urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
        user: devUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
    await closeProdDb();
  });

  it(
    "WS1: write cortex document via transport → auto-appears on prod",
    async () => {
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[WS1] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const wsPath = `/documents/ws-push-${RUN_ID}/ws-doc.md`;
      const wsContent = `# WS Push Test\n\nMarker: ${RUN_ID}`;

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: { path: wsPath, content: wsContent, createParents: true },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[WS2] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const wsPath = `/memories/ws-push-${RUN_ID}.md`;
      const wsContent = `# WS Memory Push\n\nMarker: ${RUN_ID}`;

      const { default: cortexWriteDef } = await import("./write/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: cortexWriteDef.POST,
        data: { path: wsPath, content: wsContent, createParents: true },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
      if (!connected || !devUser || !prodUserId) {
        expect(
          false,
          `[WS3] Setup failed: connected=${connected} devUser=${!!devUser} prodUserId=${!!prodUserId}`,
        ).toBe(true);
        return;
      }

      const { default: skillCreateDef } =
        await import("../skills/create/definition");
      const result = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: skillCreateDef.POST,
        data: {
          name: "WS Push Skill",
          tagline: "WS push test tagline",
          icon: "sparkles",
          description: "WS push test skill — at least 10 chars",
          category: SkillCategory.ASSISTANT,
          isPublic: false,
          systemPrompt: "You are a WS test.",
        },
        instanceId: HERMES_INSTANCE_ID,
        user: devUser,
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
