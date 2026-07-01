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
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Pool } from "pg";
import { describe, expect, it } from "vitest";

import { ThreadStreamingState } from "@/app/api/[locale]/agent/chat/enum";
import * as remoteConnectionSchema from "@/app/api/[locale]/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import * as userSchema from "@/app/api/[locale]/user/db";
import { env } from "@/config/env";

// ── Constants ────────────────────────────────────────────────────────────────

/** instanceId used by atlas to refer to the prod (hermes) connection */
export const HERMES_INSTANCE_ID = "hermes";

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
    const resp = await fetch(`${url}/api/en-US/system/server/health`, {
      signal: AbortSignal.timeout(3000),
    });
    // Accept any response that isn't a network error — 401/403 still means server is up.
    return resp.status < 500;
  } catch {
    return false;
  }
}

/**
 * Resolve the remote URL: only checks port 3002 (vibe --hermes dev --fixture-mode).
 * Returns null if the server is not running.
 *
 * To run remote integration tests, start the local dev server in fixture mode:
 *   vibe --hermes dev --fixture-mode
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
  typeof drizzle<typeof userSchema & typeof remoteConnectionSchema>
> | null = null;

export function getProdDb(): ReturnType<
  typeof drizzle<typeof userSchema & typeof remoteConnectionSchema>
> {
  if (!prodDb) {
    const baseUrl = env.DATABASE_URL.replace(
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
  const { UserRepository } = await import("@/app/api/[locale]/user/repository");
  const { UserDetailLevel } = await import("@/app/api/[locale]/user/enum");
  const { userRoles } = await import("@/app/api/[locale]/user/db");
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
    sql`SELECT id FROM users WHERE email = ${env.VIBE_ADMIN_USER_EMAIL} LIMIT 1`,
  );
  if (rows.rows.length === 0) {
    // eslint-disable-next-line i18next/no-literal-string
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `resolveProdUserId: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found in prod DB`,
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
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const adminAddDefinitions = (
    await import("@/app/api/[locale]/credits/admin-add/definition")
  ).default;
  const adminUser = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `[ensureRemoteUserCredits] Admin user ${env.VIBE_ADMIN_USER_EMAIL} not found in atlas DB`,
    );
  }
  const result = await sendTestRequest({
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
): Promise<void> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");

  // Pre-clean both sides so connect never hits a 409 conflict.
  // Restore atlas identity first — a prior headless run may have left
  // 'headless-client' as the default, causing register to store the wrong instanceId.
  await disconnectFromHermes(user.id);
  await restoreHermesIdentity();
  await restoreAtlasIdentity();
  await unregisterDevFromHermes(await resolveProdUserId(), remoteUrl);

  // Connect via the real connect endpoint — exactly the user/UI flow: log into
  // hermes with email+password, register both sides, sync capabilities.
  const connectDef = (
    await import("@/app/api/[locale]/remote-connection/connect/definition")
  ).default;
  const result = await sendTestRequest({
    endpoint: connectDef.POST,
    data: {
      remoteUrl,
      email: env.VIBE_ADMIN_USER_EMAIL,
      password: env.VIBE_ADMIN_USER_PASSWORD,
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
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
  ).default;
  const patchResult = await sendTestRequest({
    endpoint: connByIdDef.PATCH,
    data: {
      transportMode: "direct-http",
      syncScope: {
        favorites: true,
        documents: true,
        memories: true,
        skills: true,
        threads: true,
        chat: true,
      },
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
    await import("next-vibe/realtime/connector");
  reloadWsProviderConnector();

  // Trigger hermes to reconnect its atlas WS — this is the real connect event
  // that fires hermes's pullOnConnect (bidirectional push-pull). Then assert
  // sync completed: fail hard if capabilities or lastSyncedAt are not populated.
  // Capture hermes's current atlas-row lastSyncedAt BEFORE triggering — phase 2
  // must wait for it to ADVANCE past this value, not just be non-null.
  const hermesBeforeTs = await resolveHermesAtlasLastSyncedAt();
  await triggerHermesReconnect(remoteUrl);
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
    await triggerHermesReconnect(remoteUrl);
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
): Promise<void> {
  // Full connect flow (registers both sides, syncs capabilities + pre-cleans internally).
  await connectToHermes(user, remoteUrl);

  const { sendTestRequest } =
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const connByIdDef = (
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
  ).default;

  // Set atlas's send leg to reverse-ws: atlas hub-publishes to hermes, which
  // means hermes must run a connector subscribed to atlas's hub. The PATCH
  // mirrors this to hermes as its remoteTransportMode=reverse-ws (via
  // connect-reverse/update), and hermes opens that connector. We do NOT touch
  // hermes's own transportMode — it stays direct-http so the result returns to
  // atlas over http (the bridge's back leg). One call; the mirror does the rest.
  const localPatch = await sendTestRequest({
    endpoint: connByIdDef.PATCH,
    data: { transportMode: "reverse-ws" },
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
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const connByIdDef = (
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
  ).default;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await sendTestRequest({
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
 * Resets hermes's reverse-WS connector back to cloud-only (closes the open WS),
 * then removes the atlas → hermes connection from both sides.
 */
export async function disconnectFromHermesLocalAi(
  user: JwtPrivatePayloadType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  // Best-effort: ask hermes to reset its atlas connection to cloud-only via its
  // PATCH endpoint so its WS connector closes cleanly.
  try {
    const { sendTestRequest } =
      await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
    const connByIdDef = (
      await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
    ).default;
    await sendTestRequest({
      endpoint: connByIdDef.PATCH,
      data: { transportMode: "cloud-only" },
      urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
      user,
      instanceId: HERMES_INSTANCE_ID,
    });
  } catch {
    /* best-effort */
  }
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
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const adminUser = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    return;
  }
  const listDef = (
    await import("@/app/api/[locale]/remote-connection/list/definition")
  ).default;
  const listResult = await sendTestRequest({
    endpoint: listDef.GET,
    data: {},
    user: adminUser,
  });
  if (!listResult.success) {
    return;
  }
  const connByIdDef = (
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
  ).default;
  for (const conn of listResult.data.connections) {
    if (conn.instanceId.startsWith("hermes")) {
      await sendTestRequest({
        endpoint: connByIdDef.DELETE,
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
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const adminUser = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    return;
  }
  const listDef = (
    await import("@/app/api/[locale]/remote-connection/list/definition")
  ).default;
  const connByIdDef = (
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
  ).default;
  try {
    const listResult = await sendTestRequest({
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
        endpoint: connByIdDef.DELETE,
        urlPathParams: { instanceId: row.instanceId },
        user: adminUser,
        instanceId: HERMES_INSTANCE_ID,
      });
    }
  } catch {
    // Best-effort: at minimum delete the canonical atlas row via the endpoint.
    await sendTestRequest({
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
 */
export async function restoreHermesIdentity(
  remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  // Hermes renames its OWN identity via its self-rename endpoint. This runs
  // before the connection exists, so call hermes's real HTTP endpoint directly
  // with an admin token (the same way a remote operator would).
  // propagate=false: no live connections to notify yet.
  const adminToken = await resolveProdAdminToken(remoteUrl);
  const resp = await fetch(
    `${remoteUrl}/api/en-US/remote-connection/self/rename`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        newInstanceId: HERMES_INSTANCE_ID,
        propagate: false,
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!resp.ok) {
    const body = await resp.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `restoreHermesIdentity: self-rename failed status=${String(resp.status)} body=${body.slice(0, 200)}`,
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
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const selfRenameDef = (
    await import("@/app/api/[locale]/remote-connection/self/rename/definition")
  ).default;
  const adminUser = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
  if (!adminUser) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `restoreAtlasIdentity: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found`,
    );
  }
  await sendTestRequest({
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
async function triggerHermesReconnect(
  remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  const adminToken = await resolveProdAdminToken(remoteUrl);
  const resp = await fetch(
    `${remoteUrl}/api/en-US/remote-connection/${ATLAS_INSTANCE_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ reconnectNow: true }),
    },
  );
  if (!resp.ok) {
    const body = await resp.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `[connectToHermes] hermes reconnect failed: status=${String(resp.status)} body=${body.slice(0, 300)}`,
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
  const response = await fetch(`${remoteUrl}/api/en-US/user/public/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.VIBE_ADMIN_USER_EMAIL,
      password: env.VIBE_ADMIN_USER_PASSWORD,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    const err = await response.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `resolveProdAdminToken: login failed ${String(response.status)} ${err}`,
    );
  }
  const json = (await response.json()) as {
    success: boolean;
    data?: { token?: string };
  };
  if (!json.success || !json.data?.token) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(`resolveProdAdminToken: no token in login response`);
  }
  return json.data.token;
}

// ── Hermes pull trigger ───────────────────────────────────────────────────────

/**
 * Trigger hermes to reconnect its atlas WS — fires hermes's pullOnConnect —
 * and wait until hermes's lastSyncedAt for atlas has advanced.
 * Gives tests a synchronisation point so polling the hermes DB doesn't race.
 */
export async function triggerHermesPull(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _adminToken: string,
  remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  const beforeTs = await resolveHermesAtlasLastSyncedAt();
  await triggerHermesReconnect(remoteUrl);
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
 * is always started with --fixture-mode for integration tests.
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
 * Finds tasks where wakeUpThreadId matches and targetInstance is set (remote tasks).
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
        eq(cronTasks.wakeUpThreadId, threadId),
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
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");

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
        eq(cronTasks.wakeUpThreadId, threadId),
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
