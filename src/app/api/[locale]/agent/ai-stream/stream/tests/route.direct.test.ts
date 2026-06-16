/**
 * AI Stream Integration - Direct (hermes 3002, transportMode='direct-http')
 *
 * AI loop runs on hermes (loopLocation='server') via direct-http relay.
 * System prompt + tools are built locally (atlas) and sent in the relay POST.
 * Hermes runs the AI loop; tools execute directly on hermes (no execute-tool wrapper).
 * Thread mirrored locally under BACKGROUND root (threadMirrorMode='both').
 *
 * Setup is E2E: connectToHermes logs into remote (3002), registers atlas, syncs caps.
 * triggerPull() ensures capabilities are populated before any test runs.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  failSuitePrerequisites,
  isHermesInFixtureMode,
  resolveRemoteUrl,
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

let _prodUserId: string | null = null;

async function setupDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    ensureRemoteUserCredits,
    resolveProdAdminToken,
    resolveProdUserId,
    triggerPull,
  } = await import("../../testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into remote, register atlas, sync capabilities
  // _resolvedRemoteUrl is guaranteed non-null when the suite runs
  await connectToHermes(
    testUser,
    _resolvedRemoteUrl ?? "http://localhost:3002",
  );

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _prodUserId = await resolveProdUserId();

  // Top up credits on the remote via real endpoint — no direct DB writes
  const remoteAdminToken = await resolveProdAdminToken(
    _resolvedRemoteUrl ?? "http://localhost:3002",
  );
  await ensureRemoteUserCredits(
    _resolvedRemoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _prodUserId,
    20000,
  );

  // transportMode='direct-http' is the default after connectToHermes (same machine)
}

async function teardownDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes } =
    await import("../../testing/remote-setup");

  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_prodUserId) {
    tasks.push(unregisterDevFromHermes(_prodUserId));
  }
  await Promise.all(tasks);
  _prodUserId = null;
}

const _resolvedRemoteUrl = await resolveRemoteUrl();
const _isFixtureMode = isHermesInFixtureMode();

if (_resolvedRemoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream Integration - Direct (${_resolvedRemoteUrl}, transportMode='direct-http')`,
    cachePrefix: "direct-",
    // No remoteInstanceId: AI loop runs on hermes (loopLocation='server') via relay.
    // Tools execute locally on hermes — no execute-tool wrapper from the test side.
    // System prompt + tools are built on local client (atlas) and sent in relay POST.
    // Credits are deducted on hermes (remote) — not visible in local testUser balance.
    // assertSystemPromptFromLocal: system prompt built locally; AI must report local instance ID.
    assertSystemPromptFromLocal: true,
    setup: setupDirectConnection,
    teardown: teardownDirectConnection,
  });
} else if (!_resolvedRemoteUrl) {
  failSuitePrerequisites(
    "AI Stream Integration - Direct",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "AI Stream Integration - Direct",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
