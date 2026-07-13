/**
 * Remote Connection — Folder Creation Assertions
 *
 * Validates that connect() and register() create the expected subfolders on
 * BOTH sides of the bidirectional connection:
 *
 *   connect() on atlas (local side):
 *     → creates chatFolders(name=HERMES_INSTANCE_ID, rootFolderId=REMOTE) in local DB
 *     → REMOTE-folder routing is deterministic (no DB routing rule written)
 *
 *   register() on hermes (remote side, called by connect() via HTTP):
 *     → creates chatFolders(name=ATLAS_INSTANCE_ID, rootFolderId=REMOTE) in prod DB
 *     → REMOTE-folder routing is deterministic (no DB routing rule written)
 *
 * These are pure DB assertions — no AI streams are run here.
 * The folder assertions are the prerequisite for TM1/TM2 in route.transport.test.ts.
 *
 * Requires: vibe --hermes dev --fixture-mode  → http://localhost:3002
 */

import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "next-vibe/agent/chat/config";
import { chatFolders } from "next-vibe/agent/chat/db";
import { env } from "@/_old/config/env";

import {
  ATLAS_INSTANCE_ID,
  connectToHermes,
  disconnectFromHermes,
  failSuitePrerequisites,
  getProdDb,
  HERMES_INSTANCE_ID,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "../../agent/ai-stream/testing/remote-setup";
import { instanceIdentities, remoteConnections } from "../db";

// ── Skip guard ────────────────────────────────────────────────────────────────

const _remoteUrl = resolveRemoteUrlSync();
if (!_remoteUrl) {
  failSuitePrerequisites(
    "Remote Connect folder tests",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
}

// ── Test suite ────────────────────────────────────────────────────────────────

if (_remoteUrl) {
  describe(`Remote Connection — folder creation on connect/register (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let prodUserId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `Admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        return;
      }
      testUser = resolved;

      // Clean up any leftover connection from a previous run so we get a
      // fresh connect() call to assert against.
      await disconnectFromHermes(testUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }

      // Reset atlas's self-identity to ATLAS_INSTANCE_ID so assertions
      // match the constant regardless of what prior test runs set it to.
      await db
        .delete(instanceIdentities)
        .where(eq(instanceIdentities.userId, testUser.id));

      // E2E connect: logs in to hermes, registers atlas, creates subfolders.
      await connectToHermes(testUser, _remoteUrl!);

      prodUserId = await resolveProdUserId();
    }, 120_000);

    afterAll(async () => {
      const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
      if (prodUserId) {
        tasks.push(unregisterDevFromHermes(prodUserId));
      }
      await Promise.all(tasks);
    });

    // ── CF1: local side — remote/hermes subfolder ─────────────────────────

    it("CF1: connect() creates remote/hermes subfolder in local (atlas) DB", async () => {
      const [folder] = await db
        .select({ id: chatFolders.id, name: chatFolders.name })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, testUser.id),
            eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
            eq(chatFolders.name, HERMES_INSTANCE_ID),
            isNull(chatFolders.parentId),
          ),
        )
        .limit(1);

      expect(
        folder,
        `CF1: remote/${HERMES_INSTANCE_ID} subfolder missing in local DB after connect(). ` +
          `connect/repository.ts Step 6b must create it before returning.`,
      ).toBeDefined();
      if (!folder) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
        throw new Error(
          `CF1: remote/${HERMES_INSTANCE_ID} subfolder missing in local DB after connect() — cannot assert folder name`,
        );
      }
      expect(folder.name).toBe(HERMES_INSTANCE_ID);
    });

    // ── CF2: local side — REMOTE-folder routing resolves deterministically ────

    it("CF2: a thread in REMOTE/hermes resolves to the hermes connection without any DB routing rule", async () => {
      const [folder] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, testUser.id),
            eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
            eq(chatFolders.name, HERMES_INSTANCE_ID),
            isNull(chatFolders.parentId),
          ),
        )
        .limit(1);

      expect(
        folder,
        "CF2: prerequisite — subfolder must exist (CF1 must pass first)",
      ).toBeDefined();
      if (!folder) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
        throw new Error(
          "CF2: prerequisite failed — subfolder missing (CF1 must pass first) — cannot continue test",
        );
      }

      // Placement never routes: a thread created inside REMOTE/<instanceId>
      // gets its loop location STAMPED ONCE at creation (loop_instance_id);
      // routing then resolves purely from that explicit value.
      const { ThreadsRepository } =
        await import("next-vibe/agent/chat/threads/repository");
      const stampedLoop = await ThreadsRepository.deriveLoopInstanceFromFolder(
        folder.id,
      );
      expect(
        stampedLoop,
        `CF2: creating a thread in REMOTE/${HERMES_INSTANCE_ID} must stamp loopInstanceId=${HERMES_INSTANCE_ID}`,
      ).toBe(HERMES_INSTANCE_ID);

      const { ExecuteToolRouting } = await import(
        "next-vibe/remote-connection/routing"
      );
      const { createEndpointLogger } = await import("next-vibe/logger/server");
      const target = await ExecuteToolRouting.resolveTarget({
        userId: testUser.id,
        loopInstanceId: stampedLoop ?? undefined,
        locale: defaultLocale,
        logger: createEndpointLogger(false, defaultLocale),
      });
      expect(
        target?.instanceId,
        `CF2: loopInstanceId=${HERMES_INSTANCE_ID} must resolve to the ${HERMES_INSTANCE_ID} connection`,
      ).toBe(HERMES_INSTANCE_ID);
    });

    // ── CF3: remote side — remote/atlas subfolder ───────────────────

    it("CF3: register() creates remote/atlas subfolder in prod (hermes) DB", async () => {
      const pdb = getProdDb();
      const rows = await pdb.execute<{ id: string; name: string }>(
        sql`SELECT id, name FROM chat_folders
                WHERE user_id = ${prodUserId}
                  AND root_folder_id = ${DefaultFolderId.REMOTE}
                  AND name = ${ATLAS_INSTANCE_ID}
                  AND parent_id IS NULL
                LIMIT 1`,
      );

      expect(
        rows.rows[0],
        `CF3: remote/${ATLAS_INSTANCE_ID} subfolder missing in prod DB after connect(). ` +
          `register/repository.ts must create it (awaited, not fire-and-forget).`,
      ).toBeDefined();
      expect(rows.rows[0]?.name).toBe(ATLAS_INSTANCE_ID);
    });

    // ── CF4: remote side — connection row uses flat columns, no routing_rules ──

    it("CF4: prod remoteConnections row exists for this instance — routing is deterministic via REMOTE folder ancestry", async () => {
      const pdb = getProdDb();

      const connRows = await pdb.execute<{
        instance_id: string;
        transport_mode: string;
      }>(
        sql`SELECT instance_id, transport_mode FROM remote_connections
                WHERE user_id = ${prodUserId}
                  AND instance_id = ${ATLAS_INSTANCE_ID}
                LIMIT 1`,
      );

      expect(
        connRows.rows[0],
        `CF4: remoteConnections row for instanceId=${ATLAS_INSTANCE_ID} missing in prod DB after connect() — routing via REMOTE folder ancestry requires the row to exist`,
      ).toBeDefined();
    });


    // ── RC1: local-to-local registration ──────────────────────────────────
    // connect() calls register() on the remote. When both instances are
    // IS_CLOUD=false (dev-to-dev scenario), register() must NOT reject with 403.
    // Root fix: remove the IS_CLOUD gate in register/repository.ts.

    it("RC1: local-to-local connect — hermes registers atlas (non-cloud target) → connection row is active", async () => {
      const [conn] = await db
        .select({
          isActive: remoteConnections.isActive,
          transportMode: remoteConnections.transportMode,
        })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
          ),
        )
        .limit(1);

      expect(
        conn,
        "RC1: local remoteConnections row missing after connect() — " +
          "register/repository.ts IS_CLOUD gate must be removed so non-cloud targets accept registration.",
      ).toBeDefined();
      expect(
        conn?.isActive,
        "RC1: remoteConnections.isActive must be true after successful connect()",
      ).toBe(true);
    });

    // ── RC2: transportMode override ────────────────────────────────────────
    // connectToHermes() explicitly sets transportMode='direct-http' after connect
    // (see remote-setup.ts). The local row must store it.
    // The connect form's transportMode field must be visible (not hidden) so admins
    // can pass it directly — that is verified by RC3 (definition check) below.

    it("RC2: transportMode stored on local connection row after connect()", async () => {
      const [conn] = await db
        .select({ transportMode: remoteConnections.transportMode })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
          ),
        )
        .limit(1);

      expect(
        conn,
        "RC2: local remoteConnections row missing after connect()",
      ).toBeDefined();
      expect(
        conn?.transportMode,
        "RC2: transportMode must be 'direct-http' — connectToHermes() sets it explicitly after connect().",
      ).toBe("direct-http");
    });

    // ── RC3: transport is auto-negotiated — never user-set ─────────────────

    it("RC3: connect definition does NOT expose transportMode — transport is auto-negotiated", async () => {
      const definitions = await import("../connect/definition");
      const children = definitions.default.POST.fields.children;
      expect(
        "transportMode" in children,
        "RC3: transportMode must not be a connect request field — transport is auto-negotiated (reverse-ws preferred, direct-http when reachable)",
      ).toBe(false);
    });
  });
}
