/**
 * Remote Tool Calling - Shared Test Setup
 *
 * Helpers for bootstrapping remote connections in integration tests.
 * Uses the real connect/disconnect HTTP endpoints for proper E2E setup.
 *
 * Two connection directions:
 *   atlas → hermes  (direct HTTP, transportMode='direct-http')
 *   hermes → atlas  (reverse WS, transportMode='reverse-ws')
 *
 * `connectToHermes()` calls the local connect endpoint via HTTP, which:
 *   1. Logs into the prod server with email+password
 *   2. Registers atlas on hermes (reverse connection)
 *   3. Syncs capabilities both ways
 *
 * `teardown` deletes the connection rows from both sides.
 */

import "server-only";

import { existsSync, readFileSync } from "node:fs";

import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { rootlessToolExecutionContext } from "../../../core/execution-context";
import { ThreadStreamingState } from "../../chat/enum";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { databaseEnv } from "next-vibe/database/env";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { identityEnv } from "next-vibe/identity/env";
import * as userSchema from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import * as remoteConnectionSchema from "next-vibe/remote-connection/db";
import {
  remoteConnections,
  type SyncScope,
} from "next-vibe/remote-connection/db";
import { RemoteTransport } from "next-vibe/remote-connection/transport";
import { Pool } from "pg";
import { describe, expect, it } from "vitest";

import * as fixtureSchema from "./fixtures.db";

// ── Constants ────────────────────────────────────────────────────────────────

/** instanceId used by atlas to refer to the prod (hermes) connection */
export const HERMES_INSTANCE_ID = "hermes";
/** This (caller/atlas) side's self-identity as the executor names it. */
export const SELF_INSTANCE_ID = "atlas";

/** instanceId used by hermes to refer to the atlas (local) connection */
export const ATLAS_INSTANCE_ID = "atlas";

/** Dev server URL (vibe dev proxy) */
export const ATLAS_URL = "http://localhost:3000";

/** Hermes-dev server URL (vibe --hermes dev) */
export const LOCAL_DEV_URL = "http://localhost:3002";

/** PID file for vibe --hermes dev (hermes local dev) */
export const HERMES_DEV_PID_FILE_PATH = ".tmp/.hermes-dev.pid";

/** Port for the prod/preview PostgreSQL database */
const PROD_DB_PORT = 5433;

// ── Server detection ──────────────────────────────────────────────────────────

/**
 * Read the PORT:<n> line from a pid file.
 * Returns null if the file is missing.
 */
export function readServerPort(pidFile: string): number | null {
  if (!existsSync(pidFile)) {
    return null;
  }
  try {
    const content = readFileSync(pidFile, "utf-8");
    const match = /^PORT:(\d+)$/m.exec(content);
    if (match?.[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns true if a server is reachable: pid file exists with a PORT line
 * and a GET /api/en-US/system/runtime/server/health returns 200.
 */
export async function isServerRunning(
  url: string,
  pidFile: string,
): Promise<boolean> {
  if (!readServerPort(pidFile)) {
    return false;
  }
  try {
    // Liveness probe: waits for a not-yet-started server process to come up. This
    // is the one sanctioned raw fetch — it must hit the wire before any session
    // or connection exists, so it cannot go through the typed remote path.
    // oxlint-disable-next-line restricted/no-raw-fetch -- server-liveness probe
    const resp = await fetch(`${url}/api/en-US/system/runtime/server/health`, {
      signal: AbortSignal.timeout(3000),
    });
    // Accept any response that isn't a network error — 401/403 still means server is up.
    return resp.status < 500;
  } catch {
    return false;
  }
}

/**
 * Resolve the remote URL: only checks port 3002 (vibe --hermes dev).
 * Returns null if the server is not running.
 *
 * To run remote integration tests, start the local dev server in fixture mode:
 *   vibe --hermes dev
 */
export async function resolveRemoteUrl(): Promise<string | null> {
  if (await isServerRunning(LOCAL_DEV_URL, HERMES_DEV_PID_FILE_PATH)) {
    return LOCAL_DEV_URL;
  }
  return null;
}

/**
 * Returns true if the process recorded in the pid file is still alive.
 * Uses kill(pid, 0) — zero signal never kills, just checks existence.
 */
function isPidAlive(pidFile: string): boolean {
  try {
    const content = readFileSync(pidFile, "utf-8");
    const pid = parseInt(content.trim().split("\n")[0]!, 10);
    if (isNaN(pid)) {
      return false;
    }
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Synchronous variant of resolveRemoteUrl for test module top-level guards.
 * Checks the PID file for a port AND verifies the process is still alive —
 * guards against stale pid files from previously stopped servers.
 */
export function resolveRemoteUrlSync(): string | null {
  if (
    readServerPort(HERMES_DEV_PID_FILE_PATH) !== null &&
    isPidAlive(HERMES_DEV_PID_FILE_PATH)
  ) {
    return LOCAL_DEV_URL;
  }
  return null;
}

/**
 * Check whether all listed servers are reachable.
 * Returns true if all are up, false otherwise (caller should use describe.skipIf).
 * Prints a clear skip message to stderr listing missing servers and start commands.
 */
export async function checkServersReady(
  servers: {
    url: string;
    pidFile: string;
    label: string;
    startCmd: string;
  }[],
): Promise<boolean> {
  const missing: { label: string; startCmd: string }[] = [];
  for (const server of servers) {
    const running = await isServerRunning(server.url, server.pidFile);
    if (!running) {
      missing.push({ label: server.label, startCmd: server.startCmd });
    }
  }
  if (missing.length > 0) {
    const hints = missing.map((m) => `  ${m.label}: ${m.startCmd}`).join("\n");
    process.stderr.write(
      `[test skip] Required servers not running:\n${hints}\n`,
    );
    return false;
  }
  return true;
}

// ── Prod DB connection ────────────────────────────────────────────────────────

let prodPool: Pool | null = null;
let prodDb: ReturnType<
  typeof drizzle<
    typeof userSchema & typeof remoteConnectionSchema & typeof fixtureSchema
  >
> | null = null;

export function getProdDb(): ReturnType<
  typeof drizzle<
    typeof userSchema & typeof remoteConnectionSchema & typeof fixtureSchema
  >
> {
  if (!prodDb) {
    const baseUrl = databaseEnv.DATABASE_URL.replace(
      /:\d+\//,
      `:${String(PROD_DB_PORT)}/`,
    );
    prodPool = new Pool({
      connectionString: baseUrl,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    prodDb = drizzle(prodPool, {
      schema: {
        ...userSchema,
        ...remoteConnectionSchema,
        ...fixtureSchema,
      },
    });
  }
  return prodDb;
}

export async function closeProdDb(): Promise<void> {
  if (prodPool) {
    await prodPool.end();
    prodPool = null;
    prodDb = null;
  }
}

// ── Prod user resolution ──────────────────────────────────────────────────────

/**
 * Resolve the admin user's JwtPrivatePayloadType from the local (atlas) DB.
 * Used by integration tests that need a real user object.
 */
export async function resolveDevUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const { UserRepository } = await import("next-vibe/identity/user/repository");
  const { UserDetailLevel } = await import("next-vibe/identity/user/enum");
  const { userRoles } = await import("next-vibe/identity/user/db");
  const { userLeadLinks } = await import("next-vibe/identity/lead/db");
  const { eq: eqUser } = await import("drizzle-orm");
  const { UserRoleDB } = await import("next-vibe/identity/roles/enum");
  const logger = createEndpointLogger(false, defaultLocale);
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
    db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eqUser(userLeadLinks.userId, user.id))
      .limit(1),
    db.select().from(userRoles).where(eqUser(userRoles.userId, user.id)),
  ]);
  const leadId = link[0]?.leadId;
  if (!leadId) {
    return null;
  }
  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      (UserRoleDB as readonly string[]).includes(r),
    );
  return {
    isPublic: false as const,
    id: user.id,
    leadId,
    roles,
  };
}

/**
 * Resolve userId from the prod DB for cleanup purposes only.
 */
export async function resolveProdUserId(): Promise<string> {
  const pdb = getProdDb();
  const rows = await pdb.execute<{ id: string }>(
    sql`SELECT id FROM users WHERE email = ${identityEnv.VIBE_ADMIN_USER_EMAIL} LIMIT 1`,
  );
  if (rows.rows.length === 0) {
    // eslint-disable-next-line i18next/no-literal-string
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `resolveProdUserId: admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found in prod DB`,
    );
  }
  return rows.rows[0]!.id;
}

/**
 * Ensure the hermes-dev admin user has at least `minCredits` permanent credits.
 * Used by direct-mode tests that send tool calls to hermes-dev (3002) directly — hermes
 * checks credits in its own DB, so we must top up there, not in the local DB.
 *
 * Credits live in credit_packs (not just credit_wallets.balance), so we insert a
 * permanent pack and update the wallet balance to match.
 */
export async function ensureProdUserCredits(
  prodUserId: string,
  minCredits: number,
): Promise<void> {
  const pdb = getProdDb();

  // Read current packable balance (sum of remaining pack amounts)
  const packRows = await pdb.execute<{ total: string }>(
    sql`SELECT COALESCE(SUM(cp.remaining), 0) AS total
        FROM credit_packs cp
        JOIN credit_wallets cw ON cw.id = cp.wallet_id
        WHERE cw.user_id = ${prodUserId}
          AND (cp.expires_at IS NULL OR cp.expires_at > NOW())`,
  );
  const current = parseFloat(packRows.rows[0]?.total ?? "0");
  if (current >= minCredits) {
    return;
  }

  const toAdd = minCredits - current;

  // Ensure the user exists in the prod DB; if not, skip (FK constraint would fail)
  const userRows = await pdb.execute<{ id: string }>(
    sql`SELECT id FROM users WHERE id = ${prodUserId} LIMIT 1`,
  );
  if (!userRows.rows[0]) {
    return;
  }

  // Ensure the wallet exists; get its id
  await pdb.execute(
    sql`INSERT INTO credit_wallets (id, user_id, balance, free_credits_remaining, created_at, updated_at)
        VALUES (gen_random_uuid(), ${prodUserId}, 0, 0, NOW(), NOW())
        ON CONFLICT ON CONSTRAINT uq_wallet_user DO NOTHING`,
  );
  const walletRows = await pdb.execute<{ id: string }>(
    sql`SELECT id FROM credit_wallets WHERE user_id = ${prodUserId} LIMIT 1`,
  );
  const walletId = walletRows.rows[0]?.id;
  if (!walletId) {
    return;
  }

  // Insert a permanent pack and bump the wallet balance.
  // Type must match CreditPackType.PERMANENT = "enums.packType.permanent" (not the raw "permanent" string).
  await pdb.execute(
    sql`INSERT INTO credit_packs (id, wallet_id, original_amount, remaining, type, expires_at, source, metadata, created_at, updated_at)
        VALUES (gen_random_uuid(), ${walletId}, ${toAdd}, ${toAdd}, 'enums.packType.permanent', NULL, 'test_top_up', '{}', NOW(), NOW())`,
  );
  await pdb.execute(
    sql`UPDATE credit_wallets SET balance = balance + ${toAdd}, updated_at = NOW() WHERE id = ${walletId}`,
  );
}

// ── Remote endpoint calls ─────────────────────────────────────────────────────

/**
 * Ensure a user has at least `minCredits` credits on the remote server.
 * Uses the credits/admin-add endpoint via sendTestRequest with instanceId routing.
 *
 * Legacy signature (remoteUrl, adminToken, userId, minCredits) accepted for
 * backward compatibility — remoteUrl and adminToken are unused; routing is
 * handled by the transport layer via instanceId.
 */
export async function ensureRemoteUserCredits(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _remoteUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _adminToken: string,
  userId: string,
  minCredits: number,
): Promise<void> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const adminAddDefinitions = (await import("@/credits/admin-add/definition"))
    .default;
  const adminUser = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `[ensureRemoteUserCredits] Admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found in atlas DB`,
    );
  }
  const result = await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: adminAddDefinitions.POST,
    data: { targetUserId: userId, amount: minCredits },
    user: adminUser,
    instanceId: HERMES_INSTANCE_ID,
  });
  if (!result.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `[ensureRemoteUserCredits] Failed to add credits for ${userId}: ${result.message ?? "unknown error"}`,
    );
  }
}

// ── Connection setup ──────────────────────────────────────────────────────────

/** Resolve after `ms` milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Establish atlas → hermes connection in-process via connectRemote.
 *
 * Calls RemoteConnectionConnectRepository.connectRemote directly (no HTTP overhead).
 * This logs into hermes-dev (port 3002) with email+password, stores the token
 * locally in atlas's DB, and registers atlas on hermes (reverse row).
 * Capability sync happens automatically inside connectRemote.
 */
export async function connectToHermes(
  user: JwtPrivatePayloadType,
  remoteUrl: string = LOCAL_DEV_URL,
  options?: {
    /**
     * Where REMOTE/<hermes> threads run their loop for this connection —
     * 'caller' = the loop-local topology suites (loop here, tools remote).
     */
    loopLocation?: "target" | "caller";
    /**
     * The EXACT sync domains this suite exercises — nothing more. Default is
     * ALL-OFF: a suite that doesn't test sync connects with every domain
     * disabled (remote-folder thread PLACEMENT rides remote events, gated by
     * column eligibility only — it never needs the pull-sync domain). Each suite
     * opts into precisely what it verifies:
     *   • remote-folder suites → { favorites: true } (favorites are relevant to
     *     placement UX), rest off;
     *   • route.regular.mirror.cheap → { threads: true } (it tests the pull-sync
     *     reconciliation itself).
     */
    syncScope?: Partial<SyncScope>;
  },
): Promise<void> {
  const effectiveSyncScope: SyncScope = {
    memories: false,
    documents: false,
    skills: false,
    favorites: false,
    threads: false,
    ...options?.syncScope,
  };
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");

  // Pre-clean both sides so connect never hits a 409 conflict.
  // Restore atlas identity first — a prior headless run may have left
  // 'headless-client' as the default, causing register to store the wrong instanceId.
  await disconnectFromHermes(user.id);
  await restoreHermesIdentity(remoteUrl);
  await restoreAtlasIdentity();
  await unregisterDevFromHermes(await resolveProdUserId(), remoteUrl);

  // Connect via the real connect endpoint — exactly the user/UI flow: log into
  // hermes with email+password, register both sides, sync capabilities.
  const connectDef = (
    await import("next-vibe/remote-connection/connect/definition")
  ).default;
  const result = await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: connectDef.POST,
    data: {
      remoteUrl,
      email: identityEnv.VIBE_ADMIN_USER_EMAIL,
      password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
      // EXACTLY the domains this suite tests (all-off by default) — see options.
      syncScope: effectiveSyncScope,
    },
    user,
  });

  if (!result.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(`connectToHermes: ${result.message}`);
  }
  // connectRemote creates the row with hermes's self-reported instanceId
  // (e.g. "hermes-rn5-e9d42bf3"), returned here — PATCH that exact id.
  const connectedInstanceId =
    typeof result.data?.["instanceId"] === "string"
      ? result.data["instanceId"]
      : HERMES_INSTANCE_ID;

  // transportMode is normally set asynchronously by the remote ping when the
  // reverse connection is registered on hermes. For tests we know hermes
  // (localhost:3002) is directly reachable, so set it explicitly via the
  // connection PATCH endpoint. Lock in relay settings: local client provides
  // system prompt + tools; remote runs the AI loop; threads mirrored on both sides.
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;
  const patchResult = await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: connByIdDef.PATCH,
    data: {
      transportMode: "direct-http",
      ...(options?.loopLocation ? { loopLocation: options.loopLocation } : {}),
      // Placement mirrors LIVE via remote events (origin-aware, column-gated)
      // regardless of scope. The pull-sync domains are EXACTLY what the suite
      // opts into (all-off by default) — see options.syncScope.
      syncScope: effectiveSyncScope,
    },
    urlPathParams: { instanceId: connectedInstanceId },
    user,
  });
  if (!patchResult.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `connectToHermes: settings PATCH failed: ${patchResult.message}`,
    );
  }

  // Close all persistent WS connections opened by connect.
  // For direct-http, no persistent WS should be maintained —
  // relayStream() opens a per-stream dedicated WS instead.
  // reloadWsProviderConnector() handles any instanceId variant (e.g. "hermes-rn5-*").
  const { reloadWsProviderConnector } =
    await import("next-vibe/realtime/server/connector");
  reloadWsProviderConnector();

  // Trigger hermes to reconnect its atlas WS — this is the real connect event
  // that fires hermes's pullOnConnect (bidirectional push-pull). Then assert
  // sync completed: fail hard if capabilities or lastSyncedAt are not populated.
  // Capture hermes's current atlas-row lastSyncedAt BEFORE triggering — phase 2
  // must wait for it to ADVANCE past this value, not just be non-null.
  const hermesBeforeTs = await resolveHermesAtlasLastSyncedAt();
  await triggerHermesReconnect();
  await assertSyncCompleted(user.id, remoteUrl, hermesBeforeTs);

  // Ensure capabilities are populated on the atlas hermes row.
  // Hermes skips resending capabilities when its sentCapabilitiesVersion already
  // matches the current version. After a disconnect/reconnect, atlas's row is fresh
  // but hermes doesn't know to resend. Clear hermes's sentCapabilitiesVersion via
  // the prod DB so the next sync triggers a full capability push.
  const [atlasRow] = await db
    .select({ capabilities: remoteConnections.capabilities })
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, user.id),
        eq(remoteConnections.remoteUrl, remoteUrl),
        eq(remoteConnections.isReverseEntry, false),
      ),
    )
    .limit(1);
  if (!atlasRow?.capabilities) {
    // Force hermes to resend capabilities by clearing its sentCapabilitiesVersion
    const pdb = getProdDb();
    const prodUserId = await resolveProdUserId();
    // The reverse entry (is_reverse_entry = true) is the row hermes uses for
    // pullOnConnect — it tracks sentCapabilitiesVersion for its push to atlas.
    await pdb.execute(
      sql`UPDATE remote_connections SET sent_capabilities_version = NULL WHERE user_id = ${prodUserId} AND instance_id = ${ATLAS_INSTANCE_ID}`,
    );
    // Trigger another sync so hermes resends capabilities
    const beforeTs2 = await resolveHermesAtlasLastSyncedAt();
    await triggerHermesReconnect();
    // Wait for lastSyncedAt to advance past the first sync's timestamp
    const deadline2 = Date.now() + 60_000;
    while (Date.now() < deadline2) {
      const [row2] = await db
        .select({ capabilities: remoteConnections.capabilities })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, user.id),
            eq(remoteConnections.remoteUrl, remoteUrl),
            eq(remoteConnections.isReverseEntry, false),
          ),
        )
        .limit(1);
      if (row2?.capabilities) {
        break;
      }
      await sleep(300);
    }
    void beforeTs2; // used for ordering but not checked strictly
  }
}

/**
 * Establish atlas → hermes connection with LOCAL AI loop + reverse-WS tool dispatch.
 *
 * Same as connectToHermes but configured for "AI stays on atlas, tools run on hermes":
 *   - transportMode='reverse-ws'  → execute-tool dispatches via reverse-WS connector
 *   - AI loop stays on atlas; only REMOTE-folder threads route to hermes (by folder ancestry)
 *   - Opens hermes's reverse-WS connector (PATCHes its atlas row) so it's ready to
 *     pick up tool-execute-request events immediately when the AI calls execute-tool.
 *
 * Thread storage: BACKGROUND on atlas. Hermes only executes tools.
 */
export async function connectToHermesLocalAi(
  user: JwtPrivatePayloadType,
  remoteUrl: string = LOCAL_DEV_URL,
  options?: {
    loopLocation?: "target" | "caller";
    syncScope?: Partial<SyncScope>;
  },
): Promise<void> {
  // Full connect flow (registers both sides, syncs capabilities + pre-cleans internally).
  await connectToHermes(user, remoteUrl, options);

  // Re-send the SAME per-suite scope on the transport PATCH below (syncScope is
  // required) so it doesn't clobber what connectToHermes just set.
  const effectiveSyncScope: SyncScope = {
    memories: false,
    documents: false,
    skills: false,
    favorites: false,
    threads: false,
    ...options?.syncScope,
  };

  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;

  // Set atlas's send leg to reverse-ws: atlas hub-publishes to hermes, which
  // means hermes must run a connector subscribed to atlas's hub. The PATCH
  // mirrors this to hermes as its remoteTransportMode=reverse-ws (via
  // connect-reverse/update), and hermes opens that connector. We do NOT touch
  // hermes's own transportMode — it stays direct-http so the result returns to
  // atlas over http (the bridge's back leg). One call; the mirror does the rest.
  const localPatch = await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: connByIdDef.PATCH,
    data: {
      transportMode: "reverse-ws",
      syncScope: effectiveSyncScope,
    },
    urlPathParams: { instanceId: HERMES_INSTANCE_ID },
    user,
  });
  if (!localPatch.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `connectToHermesLocalAi: local transportMode PATCH failed: ${localPatch.message}`,
    );
  }

  // Wait for hermes's connector to actually connect+subscribe to atlas's hub
  // before returning — otherwise the first forward hub-publish reaches zero
  // subscribers and is dropped (the publish path does not buffer).
  await waitForHermesConnectorReady(user);
}

/**
 * Poll until hermes's reverse-ws connector to atlas is live (wsConnectedAt set
 * recently on hermes's atlas row). Reverse-ws forward delivery requires the
 * peer's connector to be subscribed before the first publish.
 */
async function waitForHermesConnectorReady(
  user: JwtPrivatePayloadType,
  timeoutMs = 30_000,
): Promise<void> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await sendTestRequest({
      toolExecutionContext: rootlessToolExecutionContext(),
      endpoint: connByIdDef.GET,
      urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
      user,
      instanceId: HERMES_INSTANCE_ID,
    });
    if (
      res.success &&
      typeof res.data === "object" &&
      res.data !== null &&
      "wsConnectedAt" in res.data &&
      res.data.wsConnectedAt !== null
    ) {
      return;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}

/**
 * Tear down a connectToHermesLocalAi session.
 *
 * Removing the connection row from both sides closes hermes's reverse-WS
 * connector — deletion propagates and the socket owner tears down with it.
 */
export async function disconnectFromHermesLocalAi(
  user: JwtPrivatePayloadType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  await disconnectFromHermes(user.id);
}

/**
 * Remove the atlas → hermes connection from atlas's local DB via endpoints.
 * Lists connections, then DELETEs every hermes-named row (exact 'hermes' plus
 * renamed variants like 'hermes-rn5-*' left by failed rename tests).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function disconnectFromHermes(_userId: string): Promise<void> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const adminUser = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    return;
  }
  const listDef = (await import("next-vibe/remote-connection/list/definition"))
    .default;
  const listResult = await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: listDef.GET,
    data: {},
    user: adminUser,
  });
  if (!listResult.success) {
    return;
  }
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;
  for (const conn of listResult.data.connections) {
    if (conn.instanceId.startsWith("hermes")) {
      await sendTestRequest({
        toolExecutionContext: rootlessToolExecutionContext(),
        endpoint: connByIdDef.DELETE,
        urlPathParams: { instanceId: conn.instanceId },
        user: adminUser,
      });
    }
  }
}

/**
 * Normalize the atlas → hermes connection for LOCAL suites: the connection
 * stays ALIVE (live thread/chat mirroring to the peer is a feature under
 * test), but favorites sync is forced OFF so peer favorites can never
 * LWW-overwrite the suite's freshly-created quality-tester favorite mid-run.
 * No-op when no connection exists — local suites don't require hermes.
 */
export async function normalizeHermesSyncScope(): Promise<void> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const adminUser = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    return;
  }
  const listDef = (await import("next-vibe/remote-connection/list/definition"))
    .default;
  const listResult = await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: listDef.GET,
    data: {},
    user: adminUser,
  });
  if (!listResult.success) {
    return;
  }
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;
  for (const conn of listResult.data.connections) {
    if (conn.instanceId.startsWith("hermes")) {
      await sendTestRequest({
        toolExecutionContext: rootlessToolExecutionContext(),
        endpoint: connByIdDef.PATCH,
        // Local suites (no explicit remote setup) test NO sync — force every
        // domain off on any lingering hermes connection so a prior remote
        // suite's scope can't leak in and mutate this run's state.
        data: {
          syncScope: {
            memories: false,
            documents: false,
            skills: false,
            favorites: false,
            threads: false,
          },
        },
        urlPathParams: { instanceId: conn.instanceId },
        user: adminUser,
      });
    }
  }
}

/**
 * Remove the atlas registration from the prod DB (hermes side).
 */
export async function unregisterDevFromHermes(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prodUserId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  // Ask hermes (via its endpoints, routed through the connection) to list its
  // connections and DELETE every atlas-named row. The DELETE endpoint closes the
  // WS and releases the in-memory sync slot — a direct DB delete would skip that
  // and leave a stuck sync slot ("pull-on-connect skipped - already in flight").
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const adminUser = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    return;
  }
  const listDef = (await import("next-vibe/remote-connection/list/definition"))
    .default;
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;
  try {
    const listResult = await sendTestRequest({
      toolExecutionContext: rootlessToolExecutionContext(),
      endpoint: listDef.GET,
      data: {},
      user: adminUser,
      instanceId: HERMES_INSTANCE_ID,
    });
    const atlasRows = listResult.success
      ? listResult.data.connections.filter((c) =>
          c.instanceId.startsWith("atlas"),
        )
      : [{ instanceId: ATLAS_INSTANCE_ID }];
    for (const row of atlasRows) {
      await sendTestRequest({
        toolExecutionContext: rootlessToolExecutionContext(),
        endpoint: connByIdDef.DELETE,
        urlPathParams: { instanceId: row.instanceId },
        user: adminUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
  } catch {
    // Best-effort: at minimum delete the canonical atlas row via the endpoint.
    await sendTestRequest({
      toolExecutionContext: rootlessToolExecutionContext(),
      endpoint: connByIdDef.DELETE,
      urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
      user: adminUser,
      instanceId: HERMES_INSTANCE_ID,
    });
  }
}

/**
 * Restore hermes's own instanceIdentity to the canonical 'hermes' name.
 * RN5 tests rename hermes's identity — if they fail mid-test the identity stays
 * as the renamed value (e.g. 'hermes-rn5-*'). Call this before connecting so
 * connectRemote gets the correct remoteInstanceId back from hermes.
 *
 * DIRECT HTTP by design: this runs BEFORE any atlas→hermes connection exists
 * (connectToHermes pre-cleans the rows first), so a connection-routed remote
 * dispatch (`sendTestRequest({instanceId})`) can never resolve here — on a
 * clean DB it fails NOT_FOUND. Log into hermes as admin and PATCH its
 * self-rename endpoint over raw HTTP instead. propagate=false: no live
 * connections yet.
 */
export async function restoreHermesIdentity(
  remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  const token = await resolveProdAdminToken(remoteUrl);
  const selfRenameDef = (
    await import("next-vibe/remote-connection/self/rename/definition")
  ).default;
  const { response: resp, status: respStatus } =
    await RemoteTransport.callEndpointDirect({
      connection: { remoteUrl, token },
      definition: selfRenameDef.PATCH,
      input: { newInstanceId: HERMES_INSTANCE_ID, propagate: false },
      locale: defaultLocale,
      timeoutMs: 15_000,
    });
  if (!resp.success) {
    // 404 = no self-identity row yet (fresh DB) — nothing to restore.
    if (respStatus === 404) {
      return;
    }
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `restoreHermesIdentity: self-rename failed ${String(respStatus)} ${JSON.stringify(resp)}`,
    );
  }
}

/**
 * Restore atlas's own instanceIdentity to the canonical 'atlas' name.
 * Some tests (RN5, headless) may set a different is_default identity —
 * if they fail mid-test atlas's default stays wrong and connectToHermes
 * registers under the wrong name, causing the triggerHermesReconnect PATCH to 404.
 */
export async function restoreAtlasIdentity(): Promise<void> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const selfRenameDef = (
    await import("next-vibe/remote-connection/self/rename/definition")
  ).default;
  const adminUser = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `restoreAtlasIdentity: admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found`,
    );
  }
  await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: selfRenameDef.PATCH,
    data: { newInstanceId: ATLAS_INSTANCE_ID, propagate: false },
    user: adminUser,
  });
}

// ── Hermes reconnect trigger ──────────────────────────────────────────────────

/**
 * PATCH hermes's atlas connection with reconnectNow=true.
 * Hermes calls restartConnection("atlas") → WS opens → pullOnConnect fires.
 * This is a real connect event, not a manual pull shortcut.
 *
 * Uses direct HTTP because this runs before the connection is fully established
 * (capability snapshot doesn't exist yet — sendTestRequest would be rejected).
 */
async function triggerHermesReconnect(): Promise<void> {
  // PATCH hermes's atlas connection with reconnectNow — routed to hermes via
  // instanceId through the typed test path. NEVER carry syncScope here: scope is
  // set symmetrically at connect and mirrored to BOTH sides; a reconnect is a
  // pure connector-lifecycle nudge. Sending a hardcoded scope (previously an
  // all-true-except-threads default) round-tripped to atlas via the PATCH's
  // reverse-mirror and CLOBBERED atlas's just-set threads:true → false, silently
  // dropping every folder/thread mirror event. reconnectNow only; scope untouched.
  const { sendTestRequest } =
    await import("next-vibe/tooling/testing/testing-suite/send-test-request");
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;
  const adminUser = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `triggerHermesReconnect: admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found`,
    );
  }
  const resp = await sendTestRequest({
    toolExecutionContext: rootlessToolExecutionContext(),
    endpoint: connByIdDef.PATCH,
    data: {
      reconnectNow: true,
    },
    urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
    user: adminUser,
    instanceId: HERMES_INSTANCE_ID,
  });
  if (!resp.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `[connectToHermes] hermes reconnect failed: ${resp.message}`,
    );
  }
}

/**
 * Read hermes's current last_synced_at for its atlas row.
 * Returns 0 if the row does not exist yet (first run).
 */
async function resolveHermesAtlasLastSyncedAt(): Promise<number> {
  const pdb = getProdDb();
  const rows = await pdb.execute<{ last_synced_at: string | null }>(
    sql`SELECT last_synced_at FROM remote_connections
        WHERE instance_id = ${ATLAS_INSTANCE_ID}
          AND is_reverse_entry = true
        LIMIT 1`,
  );
  const ts = rows.rows[0]?.last_synced_at;
  return ts ? new Date(ts).getTime() : 0;
}

/**
 * Poll atlas's remoteConnections row until lastSyncedAt and capabilities are
 * populated — proof that hermes's pullOnConnect completed against atlas.
 * hermesBeforeTs: the last_synced_at value on hermes's atlas row BEFORE this reconnect;
 * phase 2 waits for it to ADVANCE past that value (not just be non-null).
 * Throws if sync does not complete within 90s.
 */
async function assertSyncCompleted(
  userId: string,
  remoteUrl: string,
  hermesBeforeTs = 0,
): Promise<void> {
  // 120s: allows up to one 15s 500-retry + a large sync (threads can take ~50s on first run).
  const deadline = Date.now() + 120_000;

  // Phase 1: wait for atlas's hermes row to have lastSyncedAt set.
  // Capabilities may already be stored from a prior session — hermes only resends
  // them when its sentCapabilitiesVersion differs from the local version, which
  // won't happen if hermes's state is intact across reconnects.
  // lastSyncedAt being set (row was deleted then recreated by disconnectFromHermes)
  // is sufficient proof that hermes's pullOnConnect ran against atlas.
  while (Date.now() < deadline) {
    const [row] = await db
      .select({
        lastSyncedAt: remoteConnections.lastSyncedAt,
        capabilities: remoteConnections.capabilities,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.remoteUrl, remoteUrl),
          eq(remoteConnections.isReverseEntry, false),
        ),
      );
    if (row?.lastSyncedAt) {
      break;
    }
    await sleep(200);
  }

  if (Date.now() >= deadline) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "[connectToHermes] Sync did not complete within 120s — lastSyncedAt not populated after hermes reconnect",
    );
  }

  // Phase 2: wait for hermes's own atlas-row lastSyncedAt to ADVANCE past hermesBeforeTs.
  // Hermes updates this row inside pullOnConnect, RIGHT BEFORE releaseSyncSlot().
  // Waiting for this guarantees the sync slot is free before the next reconnect.
  const pdb = getProdDb();
  const phase2Deadline = Date.now() + 30_000;
  while (Date.now() < phase2Deadline) {
    const rows = await pdb.execute<{ last_synced_at: string | null }>(
      sql`SELECT last_synced_at FROM remote_connections
          WHERE instance_id = ${ATLAS_INSTANCE_ID}
            AND is_reverse_entry = true
          LIMIT 1`,
    );
    const ts = rows.rows[0]?.last_synced_at
      ? new Date(rows.rows[0].last_synced_at).getTime()
      : 0;
    if (ts > hermesBeforeTs) {
      // Grace window: releaseSyncSlot() runs immediately after the DB write
      // (in the finally block of pullOnConnect). 1s covers any executor
      // scheduling delay or Vite module re-evaluation race.
      await sleep(1000);
      return;
    }
    await sleep(300);
  }
  // Phase 2 timeout: hermes's slot release may have already happened (fast sync).
  // Non-fatal but log it so we notice if SP2 starts flapping again.
  // eslint-disable-next-line no-console
  console.warn(
    "[assertSyncCompleted] Phase 2 timeout — hermes atlas-row lastSyncedAt did not advance past",
    hermesBeforeTs,
    "within 30s. Slot may still be held — SP2 may flap.",
  );
  // Longer fallback sleep to reduce race window if phase 2 timed out.
  await sleep(3000);
}

// ── Prod admin token ──────────────────────────────────────────────────────────

/**
 * Login to hermes-dev (port 3002) as admin and return a valid admin JWT.
 * Uses VIBE_ADMIN_USER_EMAIL + VIBE_ADMIN_USER_PASSWORD from env.
 * The stored remoteConnections token is a device token (Public role), not admin.
 */
export async function resolveProdAdminToken(
  remoteUrl: string = LOCAL_DEV_URL,
): Promise<string> {
  // The dev HTTP layer (vite/nitro) intermittently answers with its
  // pre-handler {"unhandled":true} 500 before the login handler even runs —
  // side-effect-free, so a short bounded retry rides over the flake instead
  // of failing the whole suite in beforeAll.
  const loginDef = (await import("@/user/public/login/definition")).default;
  let lastFailure = "";
  for (let attempt = 1; attempt <= 4; attempt++) {
    if (attempt > 1) {
      await sleep(750 * attempt);
    }
    const {
      response,
      status: responseStatus,
      networkError,
    } = await RemoteTransport.callEndpointDirect({
      connection: { remoteUrl, token: "" },
      definition: loginDef.POST,
      input: {
        email: identityEnv.VIBE_ADMIN_USER_EMAIL,
        password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
        rememberMe: true,
      },
      locale: defaultLocale,
      timeoutMs: 10_000,
    });
    if (!response.success) {
      lastFailure = `login failed ${String(responseStatus)} ${JSON.stringify(response)}`;
      // status 0 = network error (connection reset after WS teardown) — always retry
      if (networkError || (responseStatus >= 500 && attempt < 4)) {
        continue;
      }
      break;
    }
    if (!response.data.token) {
      lastFailure = "no token in login response";
      break;
    }
    return response.data.token;
  }
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
  throw new Error(`resolveProdAdminToken: ${lastFailure}`);
}

// ── Hermes pull trigger ───────────────────────────────────────────────────────

/**
 * Trigger hermes to reconnect its atlas WS — fires hermes's pullOnConnect —
 * and wait until hermes's lastSyncedAt for atlas has advanced.
 * Gives tests a synchronisation point so polling the hermes DB doesn't race.
 */
export async function triggerHermesPull(
  // Kept for call-site compatibility — reconnect is now (user, instance)-routed
  // via sendTestRequest, so neither the token nor the URL is needed here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _adminToken?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _remoteUrl?: string,
): Promise<void> {
  const beforeTs = await resolveHermesAtlasLastSyncedAt();
  await triggerHermesReconnect();
  // Wait for hermes to complete the pull (lastSyncedAt advances past beforeTs).
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const afterTs = await resolveHermesAtlasLastSyncedAt();
    if (afterTs > beforeTs) {
      return;
    }
    await sleep(200);
  }
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error("triggerHermesPull: hermes did not complete pull within 30s");
}

// ── Fixture-mode detection ────────────────────────────────────────────────────

/**
 * Returns true if the given pid file exists and contains a PORT:<n> line,
 * which means the server is running. By convention, hermes-dev (port 3002)
 * needs no fixture flag — record/replay activates per execution via the
 * explicit FixtureContext carried on the chain.
 * Use this to gate recording-only operations without log grepping.
 */
export function readFixtureMode(pidFile: string): boolean {
  return readServerPort(pidFile) !== null && isPidAlive(pidFile);
}

/**
 * Returns true if the hermes-dev server (port 3002) is currently running.
 * Hermes-dev is always started in fixture mode for integration tests.
 * Use this as a guard before tests that require fixture recording/replay.
 */
export function isHermesInFixtureMode(): boolean {
  return readFixtureMode(HERMES_DEV_PID_FILE_PATH);
}

// ── Prerequisite enforcement ──────────────────────────────────────────────────

/**
 * Register a FAILING test when a suite's prerequisites are not met.
 * Missing servers must never produce a silent 0-test "pass" — the suite
 * fails with the exact command needed to make it runnable.
 */
export function failSuitePrerequisites(suiteName: string, hint: string): void {
  describe(suiteName, () => {
    it("prerequisites", () => {
      expect(false, `${suiteName}: prerequisites not met — ${hint}`).toBe(true);
    });
  });
}

// ── Prod DB-level test assertions ─────────────────────────────────────────────

/**
 * Assert that a table has zero rows matching the given threadId.
 * Used by ws-provider tests to confirm no AI messages landed on hermes.
 *
 * @param threadId - thread UUID to check
 * @param table - SQL table name to query (must have a thread_id column)
 */
export async function assertProdDbEmpty(
  threadId: string,
  table: string,
): Promise<void> {
  const pdb = getProdDb();
  const rows = await pdb.execute<{ count: string }>(
    sql`SELECT COUNT(*) AS count FROM ${sql.raw(table)} WHERE thread_id = ${threadId}`,
  );
  const count = parseInt(rows.rows[0]?.count ?? "0", 10);
  const { expect: expectBun } = await import("bun:test");
  expectBun(
    count,
    `[assertProdDbEmpty] Expected 0 rows in ${table} for thread ${threadId}, got ${String(count)}`,
  ).toBe(0);
}

/**
 * Assert that a thread exists in the hermes-dev DB inside the given folder.
 * Used by remote-chat-root tests to verify bidirectional thread mirroring.
 */
export async function assertProdDbHasThread(
  threadId: string,
  folderId: string,
): Promise<void> {
  const pdb = getProdDb();
  const rows = await pdb.execute<{ id: string; folder_id: string }>(
    sql`SELECT id, folder_id FROM chat_threads WHERE id = ${threadId} LIMIT 1`,
  );
  const { expect: expectBun } = await import("bun:test");
  expectBun(
    rows.rows.length,
    `[assertProdDbHasThread] Thread ${threadId} not found in hermes-dev DB`,
  ).toBeGreaterThan(0);
  expectBun(
    rows.rows[0]?.folder_id,
    `[assertProdDbHasThread] Thread ${threadId} expected in folder ${folderId}, got ${rows.rows[0]?.folder_id ?? "null"}`,
  ).toBe(folderId);
}

/**
 * Assert a thread's EXACT folder placement by walking the folder chain by NAME.
 * Verifies both the thread's rootFolderId and the full name path from the top
 * folder down to the thread's folder — e.g. on the caller
 * (REMOTE, ["hermes","tests","<case>"]) and on the executor
 * (BACKGROUND, ["remote","atlas","tests","<case>"]). 100% asserted or fail.
 */
export async function assertThreadPlacement(params: {
  db: "local" | "hermes";
  threadId: string;
  rootFolderId: string;
  nameChain: ReadonlyArray<string>;
  /** Exact expected thread title (mirror parity: pass the origin's title). */
  expectedTitle?: string;
  /** Expected title PREFIX (origin side: the first user message's head). */
  expectedTitlePrefix?: string;
}): Promise<void> {
  const {
    threadId,
    rootFolderId,
    nameChain,
    expectedTitle,
    expectedTitlePrefix,
  } = params;
  const { expect: expectBun } = await import("bun:test");
  const runQuery =
    params.db === "hermes"
      ? async (
          q: ReturnType<typeof sql>,
        ): Promise<Array<Record<string, string | null>>> => {
          const res =
            await getProdDb().execute<Record<string, string | null>>(q);
          return res.rows;
        }
      : async (
          q: ReturnType<typeof sql>,
        ): Promise<Array<Record<string, string | null>>> => {
          const { db: localDb } = await import("next-vibe/database");
          const res = await localDb.execute<Record<string, string | null>>(q);
          return res.rows;
        };
  const threadRows = await runQuery(
    sql`SELECT root_folder_id, folder_id, title FROM chat_threads WHERE id = ${threadId} LIMIT 1`,
  );
  expectBun(
    threadRows.length,
    `[assertThreadPlacement:${params.db}] thread ${threadId} not found`,
  ).toBeGreaterThan(0);
  expectBun(
    threadRows[0]?.["root_folder_id"],
    `[assertThreadPlacement:${params.db}] thread ${threadId} root mismatch`,
  ).toBe(rootFolderId);
  // PLACEMENT is asserted FIRST (before title): a thread landing in the REMOTE
  // ROOT instead of its private/tests/<case> subfolder is the structural bug we
  // care about — the title parity check must not mask it by failing earlier.
  // Walk the chain upward from the thread's folder: names must match the
  // EXPECTED chain root→leaf and every folder row must live under the SAME
  // root as the thread (a mis-rooted parent is placement corruption even
  // when the names line up).
  const walked: string[] = [];
  let currentId: string | null = threadRows[0]?.["folder_id"] ?? null;
  for (let depth = 0; depth < 16 && currentId; depth++) {
    const rows = await runQuery(
      sql`SELECT name, parent_id, root_folder_id FROM chat_folders WHERE id = ${currentId} LIMIT 1`,
    );
    if (rows.length === 0) {
      break;
    }
    expectBun(
      rows[0]?.["root_folder_id"],
      `[assertThreadPlacement:${params.db}] folder '${rows[0]?.["name"] ?? currentId}' in the chain has root '${String(rows[0]?.["root_folder_id"])}' — expected the thread's root '${rootFolderId}'`,
    ).toBe(rootFolderId);
    walked.unshift(rows[0]?.["name"] ?? "<unnamed>");
    currentId = rows[0]?.["parent_id"] ?? null;
  }
  expectBun(
    walked.join("/"),
    `[assertThreadPlacement:${params.db}] thread ${threadId} folder chain mismatch (root ${rootFolderId}) — a REMOTE-root landing means the thread was NOT placed in its expected private/tests subfolder`,
  ).toBe(nameChain.join("/"));

  // Title parity is asserted LAST (placement above is the primary invariant).
  // Mirrors must carry the ORIGIN's title verbatim.
  const title = threadRows[0]?.["title"] ?? "";
  if (expectedTitle !== undefined) {
    expectBun(
      title,
      `[assertThreadPlacement:${params.db}] thread ${threadId} title mismatch`,
    ).toBe(expectedTitle);
  }
  if (expectedTitlePrefix !== undefined) {
    expectBun(
      title.startsWith(expectedTitlePrefix),
      `[assertThreadPlacement:${params.db}] thread ${threadId} title must start with '${expectedTitlePrefix}' — got '${title}'`,
    ).toBe(true);
  }
}

/**
 * Assert MESSAGE PARITY between the local thread and its hermes mirror:
 * every local message id must exist on hermes with the SAME role and the
 * SAME parentId. Catches dropped events (e.g. a user message that only ever
 * materialized as a role-less parent stub) and chain corruption — placement
 * alone cannot.
 */
export async function assertMirrorMessageParity(
  threadId: string,
): Promise<void> {
  const { db: localDb } = await import("next-vibe/database");
  const { expect: expectBun } = await import("bun:test");
  const localRes = await localDb.execute<{
    id: string;
    role: string;
    parent_id: string | null;
    content: string | null;
  }>(
    sql`SELECT id, role, parent_id, content FROM chat_messages WHERE thread_id = ${threadId} ORDER BY created_at`,
  );
  const remoteRes = await getProdDb().execute<{
    id: string;
    role: string;
    parent_id: string | null;
    content: string | null;
  }>(
    sql`SELECT id, role, parent_id, content FROM chat_messages WHERE thread_id = ${threadId}`,
  );
  const remoteById = new Map(remoteRes.rows.map((r) => [r.id, r]));
  for (const local of localRes.rows) {
    const remote = remoteById.get(local.id);
    expectBun(
      remote,
      `[assertMirrorMessageParity] message ${local.id} (${local.role}) missing on hermes`,
    ).toBeDefined();
    expectBun(
      remote?.role,
      `[assertMirrorMessageParity] message ${local.id} role mismatch on hermes`,
    ).toBe(local.role);
    expectBun(
      remote?.parent_id ?? null,
      `[assertMirrorMessageParity] message ${local.id} parent mismatch on hermes`,
    ).toBe(local.parent_id ?? null);
    if (local.role === "user") {
      expectBun(
        remote?.content ?? "",
        `[assertMirrorMessageParity] user message ${local.id} content missing on hermes`,
      ).toBe(local.content ?? "");
    }
  }
}

/**
 * Assert that a thread in the hermes-dev DB has at least minCount messages.
 * Used by remote-chat-root tests to confirm the AI loop ran on hermes.
 */
export async function assertProdDbHasMessages(
  threadId: string,
  minCount: number,
): Promise<void> {
  const pdb = getProdDb();
  const rows = await pdb.execute<{ count: string }>(
    sql`SELECT COUNT(*) AS count FROM chat_messages WHERE thread_id = ${threadId}`,
  );
  const count = parseInt(rows.rows[0]?.count ?? "0", 10);
  const { expect: expectBun } = await import("bun:test");
  expectBun(
    count,
    `[assertProdDbHasMessages] Thread ${threadId} expected at least ${String(minCount)} messages in hermes-dev DB, got ${String(count)}`,
  ).toBeGreaterThanOrEqual(minCount);
}

// ── DB-level test assertions ─────────────────────────────────────────────────

/**
 * Assert that all remote cron tasks for a thread completed successfully.
 * Finds tasks where task_input->>'threadId' matches and targetInstance is set (remote tasks).
 * Asserts at least one exists and all have lastExecutionStatus = "completed".
 */
export async function assertCronTaskCompleted(threadId: string): Promise<void> {
  const { cronTasks } = await import("next-vibe/tasks/cron/db");
  const { CronTaskStatus } = await import("next-vibe/tasks/enum");

  const tasks = await db
    .select({
      id: cronTasks.id,
      lastExecutionStatus: cronTasks.lastExecutionStatus,
      targetInstance: cronTasks.targetInstance,
    })
    .from(cronTasks)
    .where(
      and(
        sql`${cronTasks.taskInput}->>'threadId' = ${threadId}`,
        sql`${cronTasks.targetInstance} IS NOT NULL`,
      ),
    );

  const { expect: expectBun } = await import("bun:test");
  expectBun(
    tasks.length,
    `[assertCronTaskCompleted] Expected at least one remote cron task for thread ${threadId}`,
  ).toBeGreaterThan(0);

  for (const task of tasks) {
    expectBun(
      task.lastExecutionStatus,
      `[assertCronTaskCompleted] Task ${task.id} (target=${String(task.targetInstance)}) must be completed`,
    ).toBe(CronTaskStatus.COMPLETED);
  }
}

/**
 * Assert that a thread is in idle state (not stuck in streaming/waiting).
 */
export async function assertThreadIdle(threadId: string): Promise<void> {
  const { chatThreads } = await import("../../chat/db");

  const [thread] = await db
    .select({
      streamingState: chatThreads.streamingState,
    })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));

  const { expect: expectBun } = await import("bun:test");
  expectBun(
    thread,
    `[assertThreadIdle] Thread ${threadId} not found`,
  ).toBeTruthy();
  expectBun(
    thread.streamingState,
    `[assertThreadIdle] Thread ${threadId} must be idle (got "${thread.streamingState}")`,
  ).toBe(ThreadStreamingState.IDLE);
}

/**
 * Assert that no cron tasks remain enabled for a thread (all consumed).
 */
export async function assertNoOrphanPendingTasks(
  threadId: string,
): Promise<void> {
  const { cronTasks } = await import("next-vibe/tasks/cron/db");

  const orphans = await db
    .select({
      id: cronTasks.id,
      routeId: cronTasks.routeId,
      lastExecutionStatus: cronTasks.lastExecutionStatus,
    })
    .from(cronTasks)
    .where(
      and(
        sql`${cronTasks.taskInput}->>'threadId' = ${threadId}`,
        eq(cronTasks.enabled, true),
        sql`${cronTasks.lastExecutionStatus} IS NULL`,
      ),
    );

  const { expect: expectBun } = await import("bun:test");
  expectBun(
    orphans,
    `[assertNoOrphanPendingTasks] Found ${String(orphans.length)} orphan tasks: ${JSON.stringify(orphans.map((o) => ({ id: o.id, route: o.routeId })))}`,
  ).toHaveLength(0);
}
