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
import { Pool } from "pg";
import { describe, expect, it } from "vitest";

import * as remoteConnectionSchema from "@/app/api/[locale]/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import * as userSchema from "@/app/api/[locale]/user/db";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

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
 * and a GET /api/en-US/system/server/health returns 200.
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
 * Synchronous variant of resolveRemoteUrl for test module top-level guards.
 * Checks only the PID file (no HTTP health check) — sufficient for deciding
 * whether to register describe() blocks at collection time.
 */
export function resolveRemoteUrlSync(): string | null {
  if (readServerPort(HERMES_DEV_PID_FILE_PATH) !== null) {
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
  const { userLeadLinks } = await import("@/app/api/[locale]/leads/db");
  const { eq: eqUser } = await import("drizzle-orm");
  const { UserRoleDB } =
    await import("@/app/api/[locale]/user/user-roles/enum");
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
 * Call a real endpoint on the remote server using an admin JWT.
 * Minimal helper — only call what you need, don't expand scope.
 *
 * @param remoteUrl - base URL of the remote (e.g. "http://localhost:3002")
 * @param adminToken - admin JWT obtained via resolveProdAdminToken(remoteUrl)
 * @param path - endpoint path segments, e.g. ["credits", "admin-add"]
 * @param body - JSON body to POST
 * @returns parsed response body
 */
interface RemoteEndpointResponse {
  success: boolean;
  data?: Record<string, string | number | boolean | null>;
  message?: string;
}

export async function callRemoteEndpoint(
  remoteUrl: string,
  adminToken: string,
  path: string[],
  body: Record<string, string | number | boolean | null>,
  method: "POST" | "PATCH" = "POST",
): Promise<RemoteEndpointResponse> {
  const url = `${remoteUrl}/api/en-US/${path.join("/")}`;
  const resp = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line i18next/no-literal-string
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  const text = await resp.text();
  try {
    return JSON.parse(text) as RemoteEndpointResponse;
  } catch {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `callRemoteEndpoint ${url}: HTTP ${String(resp.status)}, non-JSON: ${text.slice(0, 200)}`,
    );
  }
}

/**
 * Ensure a user has at least `minCredits` credits on the remote server.
 * Uses the credits/admin-add endpoint — works for any remote host and DB.
 *
 * Call this instead of ensureProdUserCredits when the userId comes from the
 * local dev DB and may not exist in the remote's DB yet.
 */
export async function ensureRemoteUserCredits(
  remoteUrl: string,
  adminToken: string,
  userId: string,
  minCredits: number,
): Promise<void> {
  const result = await callRemoteEndpoint(
    remoteUrl,
    adminToken,
    ["credits", "admin-add"],
    { targetUserId: userId, amount: minCredits },
  );
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.warn(
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
 * Returns true if the connectRemote failure is transient (server overloaded, timeout).
 * These errors are safe to retry after a short wait.
 */
function isConnectTransientFailure(msg: string | undefined): boolean {
  if (!msg) {
    return false;
  }
  return (
    msg.includes("Connection Failed") ||
    msg.includes("Remote Server Error") ||
    msg.includes("network") ||
    msg.includes("Network") ||
    msg.toLowerCase().includes("timeout") ||
    msg.toLowerCase().includes("fetch")
  );
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
  const { RemoteConnectionConnectRepository } =
    await import("@/app/api/[locale]/remote-connection/connect/repository");
  const { scopedTranslation } =
    await import("@/app/api/[locale]/remote-connection/connect/i18n");
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  // connectRemote pings the remote server; if it's temporarily slow (e.g. after
  // handling many test requests), the 10s ping timeout fires. Retry once after a
  // short delay to give the server time to recover.
  let result = await RemoteConnectionConnectRepository.connectRemote(
    {
      remoteUrl,
      email: env.VIBE_ADMIN_USER_EMAIL,
      password: env.VIBE_ADMIN_USER_PASSWORD,
    },
    user,
    logger,
    t,
    defaultLocale,
  );

  // Transient failure: wait and retry — Vite dev server may be momentarily busy.
  // connectRemote returns "Connection Failed" when the remote ping times out (AbortSignal).
  // connectRemote returns "Remote Server Error" when the registration HTTP call times out.
  if (!result.success && isConnectTransientFailure(result.message)) {
    // eslint-disable-next-line no-console
    console.log(
      "[connectToHermes] Transient error — waiting 15s before retry:",
      result.message,
    );
    await sleep(15000);
    result = await RemoteConnectionConnectRepository.connectRemote(
      {
        remoteUrl,
        email: env.VIBE_ADMIN_USER_EMAIL,
        password: env.VIBE_ADMIN_USER_PASSWORD,
      },
      user,
      logger,
      t,
      defaultLocale,
    );
    // Second retry if still failing
    if (!result.success && isConnectTransientFailure(result.message)) {
      // eslint-disable-next-line no-console
      console.log(
        "[connectToHermes] Still failing — waiting 15s for second retry:",
        result.message,
      );
      await sleep(15000);
      result = await RemoteConnectionConnectRepository.connectRemote(
        {
          remoteUrl,
          email: env.VIBE_ADMIN_USER_EMAIL,
          password: env.VIBE_ADMIN_USER_PASSWORD,
        },
        user,
        logger,
        t,
        defaultLocale,
      );
    }
  }

  if (!result.success) {
    // "Already Connected" means one or both sides still have a stale registration row.
    // Clean both sides and retry so they are in sync.
    if (result.message?.includes("Already Connected")) {
      // eslint-disable-next-line no-console
      console.log(
        "[connectToHermes] Already Connected - cleaning both sides and retrying",
      );

      // Delete local hermes row on atlas.
      await disconnectFromHermes(user.id);

      // Delete atlas's registration on hermes (remote side).
      // Use broad delete (no user filter) to catch any leftover registrations.
      const pdb = getProdDb();
      await pdb.execute(
        sql`DELETE FROM remote_connections WHERE instance_id = ${ATLAS_INSTANCE_ID}`,
      );

      // Also fix self-identity if it got set to atlas by a previous register call
      await pdb.execute(
        sql`UPDATE instance_identities SET instance_id = 'hermes' WHERE instance_id = ${ATLAS_INSTANCE_ID}`,
      );

      // Retry connect
      const retry = await RemoteConnectionConnectRepository.connectRemote(
        {
          remoteUrl,
          email: env.VIBE_ADMIN_USER_EMAIL,
          password: env.VIBE_ADMIN_USER_PASSWORD,
        },
        user,
        logger,
        t,
        defaultLocale,
      );
      if (!retry.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(`connectToHermes retry: ${retry.message}`);
      }
      return;
    }
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(`connectToHermes: ${result.message}`);
  }

  // transportMode is normally set asynchronously by the remote ping when the
  // reverse connection is registered on hermes. For tests we know hermes
  // (localhost:3002) is directly reachable, so set it explicitly here.
  // Lock in relay settings: local client provides system prompt + tools;
  // remote runs the AI loop; threads mirrored on both sides.
  // REMOTE-folder threads route natively by folder ancestry — no DB setting needed.
  //
  // Use remoteUrl as the WHERE key because connectRemote creates the row with hermes's
  // self-reported instanceId (e.g. "hermes-rn5-e9d42bf3"), not the constant "hermes".
  await db
    .update(remoteConnections)
    .set({
      transportMode: "direct-http",
      loopLocation: "server",
      toolSource: "local",
      threadMirrorMode: "both",
      // Enable full sync scope so WS push events for all providers reach this instance
      syncScope: {
        favorites: true,
        documents: true,
        memories: true,
        skills: true,
        threads: true,
      },
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(remoteConnections.userId, user.id),
        eq(remoteConnections.remoteUrl, remoteUrl),
        eq(remoteConnections.isReverseEntry, false),
      ),
    );

  // Close all persistent WS connections opened by connectRemote().
  // For direct-http, no persistent WS should be maintained —
  // relayStream() opens a per-stream dedicated WS instead.
  // reloadWsProviderConnector() handles any instanceId variant (e.g. "hermes-rn5-*").
  const { reloadWsProviderConnector } =
    await import("@/app/api/[locale]/remote-connection/connector");
  reloadWsProviderConnector();

  // Trigger hermes to reconnect its atlas WS — this is the real connect event
  // that fires hermes's pullOnConnect (bidirectional push-pull). Then assert
  // sync completed: fail hard if capabilities or lastSyncedAt are not populated.
  const hermesAdminToken = await resolveProdAdminToken(remoteUrl);
  // Capture hermes's current atlas-row lastSyncedAt BEFORE triggering — phase 2
  // must wait for it to ADVANCE past this value, not just be non-null.
  const hermesBeforeTs = await resolveHermesAtlasLastSyncedAt();
  await triggerHermesReconnect(hermesAdminToken, remoteUrl);
  await assertSyncCompleted(user.id, remoteUrl, hermesBeforeTs);
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
  // Idempotent: clean up any leftover connection before reconnecting.
  await disconnectFromHermes(user.id);
  // Full connect flow (registers both sides, syncs capabilities).
  await connectToHermes(user, remoteUrl);

  // Override the connection settings set by connectToHermes:
  //   transportMode=reverse-ws → traffic rides the reverse-WS connector
  //   REMOTE-folder threads route to hermes by folder ancestry — deterministic, no DB setting
  await db
    .update(remoteConnections)
    .set({
      transportMode: "reverse-ws",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(remoteConnections.userId, user.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );

  // Open the reverse-WS connector on hermes so it's ready to handle
  // tool-execute-request events dispatched by execute-tool(instanceId='hermes').
  // PATCHing hermes's atlas row to transportMode=reverse-ws triggers openConnection()
  // on hermes, which subscribes to system/tool-dispatch/{userId}.
  const hermesAdminToken = await resolveProdAdminToken(remoteUrl);
  await callRemoteEndpoint(
    remoteUrl,
    hermesAdminToken,
    ["remote-connection", ATLAS_INSTANCE_ID],
    { transportMode: "reverse-ws" },
    "PATCH",
  );
}

/**
 * Tear down a connectToHermesLocalAi session.
 *
 * Resets hermes's reverse-WS connector back to cloud-only (closes the open WS),
 * then removes the atlas → hermes connection from both sides.
 */
export async function disconnectFromHermesLocalAi(
  user: JwtPrivatePayloadType,
  remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  // Best-effort: reset hermes's atlas row so its WS connector closes cleanly.
  try {
    const hermesAdminToken = await resolveProdAdminToken(remoteUrl);
    await callRemoteEndpoint(
      remoteUrl,
      hermesAdminToken,
      ["remote-connection", ATLAS_INSTANCE_ID],
      { transportMode: "cloud-only" },
      "PATCH",
    );
  } catch {
    /* best-effort */
  }
  await disconnectFromHermes(user.id);
}

/**
 * Remove the atlas → hermes connection from atlas's local DB.
 */
export async function disconnectFromHermes(userId: string): Promise<void> {
  // Delete exact 'hermes' row plus any renamed variants (e.g. 'hermes-rn5-*')
  // left behind by failed rename tests.
  await db.execute(
    sql`DELETE FROM remote_connections WHERE user_id = ${userId} AND instance_id LIKE ${"hermes%"}`,
  );
}

/**
 * Remove the atlas registration from the prod DB (hermes side).
 */
export async function unregisterDevFromHermes(
  prodUserId: string,
): Promise<void> {
  const pdb = getProdDb();
  // Delete exact 'atlas' row plus any renamed variants (e.g. 'atlas-rn2-*')
  // left behind by failed rename tests.
  await pdb.execute(
    sql`DELETE FROM remote_connections WHERE user_id = ${prodUserId} AND instance_id LIKE ${"atlas%"}`,
  );
}

/**
 * Restore hermes's own instanceIdentity to the canonical 'hermes' name.
 * RN5 tests rename hermes's identity — if they fail mid-test the identity stays
 * as the renamed value (e.g. 'hermes-rn5-*'). Call this before connecting so
 * connectRemote gets the correct remoteInstanceId back from hermes.
 */
export async function restoreHermesIdentity(): Promise<void> {
  const pdb = getProdDb();
  await pdb.execute(
    sql`UPDATE instance_identities SET instance_id = ${HERMES_INSTANCE_ID}, updated_at = NOW()
        WHERE is_default = true AND instance_id != ${HERMES_INSTANCE_ID}`,
  );
}

// ── Hermes reconnect trigger ──────────────────────────────────────────────────

/**
 * PATCH hermes's atlas connection with reconnectNow=true.
 * Hermes calls restartConnection("atlas") → WS opens → pullOnConnect fires.
 * This is a real connect event, not a manual pull shortcut.
 */
async function triggerHermesReconnect(
  adminToken: string,
  remoteUrl: string,
): Promise<void> {
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

  // Phase 1: wait for atlas's hermes row to have lastSyncedAt + capabilities
  // (set by atlas when hermes's pullOnConnect POSTs to /sync)
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
    if (row?.lastSyncedAt && row.capabilities && row.capabilities.length > 0) {
      break;
    }
    await sleep(200);
  }

  if (Date.now() >= deadline) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "[connectToHermes] Sync did not complete within 120s — lastSyncedAt or capabilities not populated after hermes reconnect",
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
  adminToken: string,
  remoteUrl: string = LOCAL_DEV_URL,
): Promise<void> {
  const beforeTs = await resolveHermesAtlasLastSyncedAt();
  await triggerHermesReconnect(adminToken, remoteUrl);
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
  return readServerPort(pidFile) !== null;
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
  const { cronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
  const { CronTaskStatus } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/enum");

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
  ).toBe("idle");
}

/**
 * Assert that no cron tasks remain enabled for a thread (all consumed).
 */
export async function assertNoOrphanPendingTasks(
  threadId: string,
): Promise<void> {
  const { cronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");

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
