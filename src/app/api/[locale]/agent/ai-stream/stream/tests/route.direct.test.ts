/**
 * AI Stream Integration - Direct (hermes 3001, isDirectlyAccessible=true)
 *
 * Simulates a publicly accessible remote instance. Tool calls go via
 * execute-tool(instanceId='hermes') with isDirectlyAccessible=true:
 *
 *   1. execute-tool resolves connection → isDirectlyAccessible=true
 *   2. RouteExecuteRepository.executeRemoteDirect() POSTs to hermes (3001)
 *   3. Hermes executes the tool locally and returns the result inline
 *   4. Stream continues with the tool result - no pulse needed
 *
 * Setup is E2E: connectToHermes logs into prod, registers hermes-dev, syncs caps.
 * triggerPull() ensures capabilities are populated before any test runs.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { describeStreamSuite } from "./route-base.test";

const HERMES_INSTANCE_ID = "hermes";

let _prodUserId: string | null = null;

async function setupDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    ensureProdUserCredits,
    resolveProdUserId,
    triggerPull,
  } = await import("../../testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into prod, register hermes-dev on hermes, sync capabilities
  await connectToHermes(testUser);

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _prodUserId = await resolveProdUserId();

  // Direct-mode tests POST tool calls to hermes (3001) which checks credits in its own DB.
  // Both the hermes admin AND the local test user identity may be used (shared JWT secret
  // means local JWTs are valid on hermes). All test steps share a single credit pool on
  // hermes (no per-step pinBalance), so the budget must cover every tool execution:
  // video gen (~300cr), music gen (~100cr), image gen (~200cr each x4), plus margin.
  await ensureProdUserCredits(_prodUserId, 5000);
  await ensureProdUserCredits(testUser.id, 5000);

  // isDirectlyAccessible=true is the default after connectToHermes (same machine)
}

async function teardownDirectConnection(
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
}

describeStreamSuite({
  label:
    "AI Stream Integration - Direct (hermes 3001, isDirectlyAccessible=true)",
  cachePrefix: "direct-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupDirectConnection,
  teardown: teardownDirectConnection,
  // No pulse - direct HTTP returns synchronously
});
