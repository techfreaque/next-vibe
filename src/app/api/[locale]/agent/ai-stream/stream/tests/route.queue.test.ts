/**
 * AI Stream Integration - Queue (NAT: hermes pulls from hermes-dev)
 *
 * Simulates a non-publicly-accessible local instance (NAT mode). Tool calls go
 * via execute-tool(instanceId='hermes') with isDirectlyAccessible=false:
 *
 *   1. execute-tool creates a cron task in hermes-dev's DB (targetInstance='hermes')
 *   2. Stream aborts → thread enters 'waiting' state
 *   3. cfg.pulse() calls triggerHermesPulse() → hermes (3001) runs its pulse cycle:
 *        - TaskSyncRepository.pullFromRemote pulls tasks from hermes-dev
 *        - Pulse picks up the task (targetInstance='hermes'), executes it locally
 *        - handleTaskCompletion POSTs /report back to hermes-dev (fire-and-forget)
 *      Then triggerLocalPulse() polls for resume-stream task + runs hermes-dev's pulse.
 *   4. hermes-dev's local pulse executes resume-stream → revival fires synchronously
 *   5. Revival stream runs to completion → thread returns to 'idle'
 *   6. Test re-fetches messages - tool result backfilled, AI response present
 *
 * Setup is E2E: connectToHermes establishes both directions + syncs capabilities.
 * isDirectlyAccessible is forced to false after connect to enable queue path.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { remoteConnections } from "@/app/api/[locale]/user/remote-connection/db";
import { and, eq } from "drizzle-orm";
import { describeStreamSuite } from "./route-base.test";

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
  } = await import("../../testing/remote-setup");

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
    await import("../../testing/remote-setup");

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
 *   triggerLocalPulse finds the pending remote execute-tool task in hermes-dev's
 *   DB, simulates hermes completing it via handleTaskCompletion with directResumeUser,
 *   which fires revival directly in-process with the fetch-cache interceptor active.
 *
 * Note: triggerHermesPulse is called first for E2E coverage (ensures the task-sync
 * pull path is exercised). It may return pulled=0 if hermes's automated cron already
 * pulled the task, which is fine — triggerLocalPulse does not depend on hermes
 * executing the task.
 */
async function runQueuePulse(threadId: string): Promise<void> {
  if (!_prodAdminToken) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "runQueuePulse: no prod admin token - setupQueueConnection not called?",
    );
  }

  const { triggerHermesPull, triggerLocalPulse } =
    await import("../../testing/remote-setup");

  // Step 1: trigger hermes (3001) pull cycle for E2E coverage.
  // Only the pull is called (not pulse/execute) to avoid a race condition:
  // if hermes executes the tasks via pulse/execute AND triggerLocalPulse also
  // executes them in-process, both call handleTaskCompletion → double-revival.
  // The pull path is sufficient to verify the task-sync pull flow.
  await triggerHermesPull(_prodAdminToken);

  // Step 2: simulate task completion + fire revival in-process (fetch-cache active).
  // Does not depend on hermes actually executing the task.
  await triggerLocalPulse(threadId);
}

describeStreamSuite({
  label: "AI Stream Integration - Queue (NAT: hermes pulls from hermes-dev)",
  cachePrefix: "queue-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupQueueConnection,
  teardown: teardownQueueConnection,
  pulse: runQueuePulse,
});
