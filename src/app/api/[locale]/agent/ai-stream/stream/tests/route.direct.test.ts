/**
 * AI Stream Integration - Direct (hermes 3001, transportMode='direct-http')
 *
 * Simulates a publicly accessible remote instance. Tool calls go via
 * execute-tool(instanceId='hermes') with transportMode='direct-http':
 *
 *   1. execute-tool resolves connection → transportMode='direct-http'
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
import { resolveRemoteUrl } from "../../testing/remote-setup";

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
  // _resolvedRemoteUrl is guaranteed non-null (module-level hard fail above)
  await connectToHermes(testUser, _resolvedRemoteUrl);

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _prodUserId = await resolveProdUserId();

  // Direct-mode tests POST tool calls to hermes using the stored remote admin token.
  // Credits are deducted on the remote DB for the remote admin user (_prodUserId).
  // Ensure the remote admin wallet is funded via direct DB access (same preview DB 5433).
  await ensureProdUserCredits(_prodUserId, 20000);

  // transportMode='direct-http' is the default after connectToHermes (same machine)
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

const _resolvedRemoteUrl = await resolveRemoteUrl();
if (!_resolvedRemoteUrl) {
  // oxlint-disable-next-line restricted-syntax -- intentional hard fail: server required
  throw new Error(
    "AI Stream Integration - Direct: no remote server reachable.\n" +
      "Start one of:\n" +
      "  vibe start        → http://localhost:3001\n" +
      "  vibe --local dev  → http://localhost:3002",
  );
}

describeStreamSuite({
  label: `AI Stream Integration - Direct (${_resolvedRemoteUrl}, transportMode='direct-http')`,
  cachePrefix: "direct-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupDirectConnection,
  teardown: teardownDirectConnection,
  // No pulse - direct HTTP returns synchronously
  // T4 (music + video gen) skipped: external media API calls run on remote server
  // where FetchCache cannot intercept them, causing real API timeouts.
  // T4 skip also covers T11c-T11f (image-to-video and image-to-image tests that
  // similarly call generate_video/generate_image via execute-tool on the remote).
  // T6 (wakeUp) skipped: goroutine calls remote image gen (live API) which FetchCache
  // cannot intercept on the remote server, making revival timing unpredictable.
  // T7 (approve) skipped: T7a creates pending tool messages, T7b confirmed execution calls
  // remote image gen (live API). Skipping both avoids branch violations in assertNoOrphans.
  // T11 skipped: T5c (execute-tool-direct) leaves role=tool messages in thread history.
  // Gemini rejects these via OpenRouter: "#/definitions/__schema0 in function_response.response
  // does not match display_name in function_response.parts." Gemini function_response format
  // is incompatible with execute-tool result messages accumulated in direct-http conversation.
  skipTests: ["T4", "T6", "T7", "T11"],
});
