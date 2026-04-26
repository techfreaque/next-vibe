/**
 * Coding Agent Integration - Queue (hermes-dev 3000 → hermes 3001, NAT mode)
 *
 * Simulates a non-publicly-accessible local instance (NAT mode). Coding-agent
 * calls go via execute-tool(instanceId='hermes') with isDirectlyAccessible=false:
 *
 *   1. execute-tool creates a cron task in hermes-dev's DB (targetInstance='hermes')
 *   2. Stream aborts → thread enters 'waiting' state
 *   3. cfg.pulse() calls triggerHermesPull() for E2E coverage (hermes 3001 pulls tasks),
 *      then triggerLocalPulse() simulates task completion + fires revival in-process
 *      (fetch-cache interceptor active → fixtures apply to the revival stream too)
 *   4. Revival stream runs to completion → thread returns to 'idle'
 *   5. Test re-fetches messages - tool result backfilled, AI response present
 *
 * Setup is E2E: connectToHermes establishes both directions + syncs capabilities.
 * isDirectlyAccessible is forced to false after connect to enable queue path.
 */

import "server-only";

import { installFetchCache } from "../../ai-stream/testing/fetch-cache";
installFetchCache();

import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { remoteConnections } from "@/app/api/[locale]/user/remote-connection/db";
import { and, eq } from "drizzle-orm";
import { describeCodingAgentSuite } from "./coding-agent-base.test";

const HERMES_INSTANCE_ID = "hermes";

let _prodUserId: string | null = null;
let _prodAdminToken: string | null = null;

async function setupQueueConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    resolveProdUserId,
    resolveProdAdminToken,
    triggerPull,
  } = await import("../../ai-stream/testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into prod, register hermes-dev on hermes, sync capabilities
  await connectToHermes(testUser);

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _prodUserId = await resolveProdUserId();
  _prodAdminToken = await resolveProdAdminToken();

  // Force queue path: isDirectlyAccessible=false → execute-tool uses task-queue not direct HTTP
  await db
    .update(remoteConnections)
    .set({ isDirectlyAccessible: false })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

async function teardownQueueConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes, closeProdDb } =
    await import("../../ai-stream/testing/remote-setup");

  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_prodUserId) {
    tasks.push(unregisterDevFromHermes(_prodUserId));
  }
  await Promise.all(tasks);
  await closeProdDb();
  _prodUserId = null;
  _prodAdminToken = null;
}

/**
 * Queue revival simulation:
 *   triggerHermesPull for E2E coverage (hermes pulls tasks from hermes-dev).
 *   triggerLocalPulse finds the pending remote execute-tool task in hermes-dev's
 *   DB, simulates hermes completing it via handleTaskCompletion with directResumeUser,
 *   which fires revival directly in-process with the fetch-cache interceptor active.
 */
async function runQueuePulse(threadId: string): Promise<void> {
  if (!_prodAdminToken) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "runQueuePulse: no prod admin token - setupQueueConnection not called?",
    );
  }

  const { triggerHermesPull, triggerLocalPulse } =
    await import("../../ai-stream/testing/remote-setup");

  // Step 1: trigger hermes (3001) pull cycle for E2E coverage.
  // Only pull (not execute) to avoid double-revival race condition.
  await triggerHermesPull(_prodAdminToken);

  // Step 2: simulate task completion + fire revival in-process (fetch-cache active).
  await triggerLocalPulse(threadId);
}

describeCodingAgentSuite({
  label:
    "Coding Agent Integration - Queue (hermes-dev 3000 → hermes 3001, NAT mode)",
  cachePrefix: "ca-queue-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupQueueConnection,
  teardown: teardownQueueConnection,
  pulse: runQueuePulse,
  isDirect: false,
});
