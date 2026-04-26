/**
 * Coding Agent Integration - Direct (hermes-dev 3000 → hermes 3001, isDirectlyAccessible=true)
 *
 * Simulates a publicly accessible remote instance. Coding-agent calls go via
 * execute-tool(instanceId='hermes') with isDirectlyAccessible=true:
 *
 *   WAIT/END_LOOP: blocking direct HTTP → result inline, no queue, no waiting state.
 *   DETACH/WAKE_UP: fire-and-forget goroutine → result async via handleTaskCompletion.
 *
 * Setup is E2E: connectToHermes logs into prod, registers hermes-dev, syncs caps.
 * isDirectlyAccessible=true is the default after connectToHermes (same machine).
 *
 * pulse is provided as a fallback: if hermes (3001) is unreachable, execute-tool falls
 * back to the task-queue path and the thread enters 'waiting'. The pulse handles that
 * case without breaking the test. When hermes is reachable, the thread never enters
 * 'waiting' for WAIT/END_LOOP and pulse is never called.
 */

import "server-only";

import { installFetchCache } from "../../ai-stream/testing/fetch-cache";
installFetchCache();

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { describeCodingAgentSuite } from "./coding-agent-base.test";

const HERMES_INSTANCE_ID = "hermes";

let _prodUserId: string | null = null;
let _prodAdminToken: string | null = null;

async function setupDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    resolveProdUserId,
    resolveProdAdminToken,
    triggerPull,
  } = await import("../../ai-stream/testing/remote-setup");

  await disconnectFromHermes(testUser.id);
  await connectToHermes(testUser);
  await triggerPull();

  _prodUserId = await resolveProdUserId();
  _prodAdminToken = await resolveProdAdminToken();
}

async function teardownDirectConnection(
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
 * Fallback pulse for direct mode: only fires when the direct HTTP call failed and
 * execute-tool fell back to the queue path (thread in 'waiting').
 * Uses triggerLocalPulse which simulates task completion in-process.
 */
async function runDirectPulse(threadId: string): Promise<void> {
  const { triggerHermesPull, triggerLocalPulse } =
    await import("../../ai-stream/testing/remote-setup");

  if (_prodAdminToken) {
    await triggerHermesPull(_prodAdminToken);
  }
  await triggerLocalPulse(threadId);
}

describeCodingAgentSuite({
  label:
    "Coding Agent Integration - Direct (hermes-dev 3000 → hermes 3001, isDirectlyAccessible=true)",
  cachePrefix: "ca-direct-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupDirectConnection,
  teardown: teardownDirectConnection,
  pulse: runDirectPulse,
  isDirect: true,
});
