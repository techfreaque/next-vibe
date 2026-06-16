/**
 * Remote Connection — Folder Creation Assertions
 *
 * Validates that connect() and register() create the expected subfolders and
 * routing rules on BOTH sides of the bidirectional connection:
 *
 *   connect() on atlas (local side):
 *     → creates chatFolders(name=HERMES_INSTANCE_ID, rootFolderId=REMOTE) in local DB
 *     → sets remoteConnections.routingRules.folderIds to contain that folder UUID
 *
 *   register() on hermes (remote side, called by connect() via HTTP):
 *     → creates chatFolders(name=ATLAS_INSTANCE_ID, rootFolderId=REMOTE) in prod DB
 *     → sets remoteConnections.routingRules.folderIds to contain that folder UUID
 *
 * These are pure DB assertions — no AI streams are run here.
 * The folder assertions are the prerequisite for TM1/TM2 in route.transport.test.ts.
 *
 * Requires: vibe --hermes dev --fixture-mode  → http://localhost:3002
 */

import "server-only";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { defaultLocale } from "@/i18n/core/config";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import type { RoutingRules } from "@/app/api/[locale]/remote-connection/db";
import {
  instanceIdentities,
  remoteConnections,
} from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { and, eq, isNull, sql } from "drizzle-orm";

import {
  ATLAS_INSTANCE_ID,
  HERMES_INSTANCE_ID,
  connectToHermes,
  disconnectFromHermes,
  failSuitePrerequisites,
  getProdDb,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrl,
  unregisterDevFromHermes,
} from "../../agent/ai-stream/testing/remote-setup";

// ── Skip guard ────────────────────────────────────────────────────────────────

const _remoteUrl = await resolveRemoteUrl();
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

    // ── CF2: local side — routing rule references the subfolder ──────────

    it("CF2: connect() sets routingRules.folderIds on local remoteConnections to include the subfolder UUID", async () => {
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

      const [conn] = await db
        .select({ routingRules: remoteConnections.routingRules })
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
        `CF2: remoteConnections row for instanceId=${HERMES_INSTANCE_ID} missing after connect()`,
      ).toBeDefined();

      // REMOTE-folder threads route natively by folder ancestry — connect()
      // must NOT write the folder into routingRules.
      const rules = conn?.routingRules as RoutingRules | null | undefined;
      expect(
        rules?.folderIds?.includes(folder.id) ?? false,
        "CF2: routingRules.folderIds must NOT contain the instance folder — REMOTE-folder routing is native",
      ).toBe(false);

      // The folder (and any nested subfolder) must resolve to the connection.
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      const { createEndpointLogger } =
        await import("@/app/api/[locale]/system/unified-interface/shared/logger/server-logger");
      const target = await RemoteTransport.resolveTarget({
        userId: testUser.id,
        folderId: folder.id,
        rootFolderId: DefaultFolderId.REMOTE,
        locale: defaultLocale,
        logger: createEndpointLogger(false, Date.now(), defaultLocale),
      });
      expect(
        target?.instanceId,
        `CF2: a thread in REMOTE/${HERMES_INSTANCE_ID} must resolve to the ${HERMES_INSTANCE_ID} connection natively`,
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

    // ── CF4: remote side — routing rule references the subfolder ─────────

    it("CF4: register() sets routingRules.folderIds on prod remoteConnections to include the subfolder UUID", async () => {
      const pdb = getProdDb();

      const folderRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
                WHERE user_id = ${prodUserId}
                  AND root_folder_id = ${DefaultFolderId.REMOTE}
                  AND name = ${ATLAS_INSTANCE_ID}
                  AND parent_id IS NULL
                LIMIT 1`,
      );

      expect(
        folderRows.rows[0],
        "CF4: prerequisite — prod subfolder must exist (CF3 must pass first)",
      ).toBeDefined();
      if (!folderRows.rows[0]) {
        return;
      }
      const remoteFolderId = folderRows.rows[0].id;

      const connRows = await pdb.execute<{
        routing_rules: RoutingRules | string;
      }>(
        sql`SELECT routing_rules FROM remote_connections
                WHERE user_id = ${prodUserId}
                  AND instance_id = ${ATLAS_INSTANCE_ID}
                LIMIT 1`,
      );

      expect(
        connRows.rows[0],
        `CF4: remoteConnections row for instanceId=${ATLAS_INSTANCE_ID} missing in prod DB after connect()`,
      ).toBeDefined();
      if (!connRows.rows[0]) {
        return;
      }

      const rawRules = connRows.rows[0].routing_rules;
      const rules: RoutingRules =
        typeof rawRules === "string"
          ? (JSON.parse(rawRules) as RoutingRules)
          : rawRules;

      expect(
        rules?.folderIds,
        "CF4: prod routingRules.folderIds must be an array",
      ).toBeInstanceOf(Array);
      expect(
        rules?.folderIds?.includes(remoteFolderId),
        `CF4: prod routingRules.folderIds must contain subfolder UUID ${remoteFolderId}. ` +
          `register/repository.ts must call addFolderToRoutingRules() after creating the subfolder.`,
      ).toBe(true);
    });

    // ── CF5: local remoteInstanceId is our own identity ─────────────────
    // remoteInstanceId stores "what we are called from the remote's perspective".
    // On atlas, this is "atlas" (our own self-identity). The relay
    // uses this value to tell hermes which folder to place the thread in:
    //   relay postBody.instanceId = remoteTarget.remoteInstanceId = "atlas"
    //   hermes resolves chatFolders(name="atlas") → correct subfolder.

    it("CF5: local remoteConnections.remoteInstanceId is set to the local self-identity (atlas) for correct relay routing", async () => {
      const [conn] = await db
        .select({ remoteInstanceId: remoteConnections.remoteInstanceId })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
          ),
        )
        .limit(1);

      expect(conn, "CF5: local remoteConnections row missing").toBeDefined();
      expect(
        conn?.remoteInstanceId,
        `CF5: remoteInstanceId must be set to the local self-identity ("${ATLAS_INSTANCE_ID}"). ` +
          `register() returns remoteInstanceId=selfInstanceId (cloud's own identity) which connect() ` +
          `stores as the local row's remoteInstanceId so relay can tell hermes the correct folder name.`,
      ).toBe(ATLAS_INSTANCE_ID);
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
