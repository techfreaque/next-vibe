/**
 * AI Stream Integration - Direct (CHEAP) — hermes 3002, transportMode='direct-http'
 *
 * Same suite as route.direct (AI loop on hermes via direct-http relay) but in
 * cheapMode: media-gen steps swap to cortex/tool-help equivalents producing the
 * same observable thread shape, so no media-provider fixtures are needed. Still
 * exercises every callback mode + folder placement across the relay. Get this
 * green first; route.direct (full) records the real media fixtures.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";

import {
  failSuitePrerequisites,
  isHermesInFixtureMode,
  resolveRemoteUrlSync,
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
  } = await import("../../testing/remote-setup");

  await disconnectFromHermes(testUser.id);
  await connectToHermes(
    testUser,
    _resolvedRemoteUrl ?? "http://localhost:3002",
  );

  _prodUserId = await resolveProdUserId();

  const remoteAdminToken = await resolveProdAdminToken(
    _resolvedRemoteUrl ?? "http://localhost:3002",
  );
  await ensureRemoteUserCredits(
    _resolvedRemoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _prodUserId,
    20000,
  );
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

const _resolvedRemoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

if (_resolvedRemoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream Integration - Direct (cheap) (${_resolvedRemoteUrl}, transportMode='direct-http')`,
    cachePrefix: "direct-cheap-",
    cheapMode: true,
    assertSystemPromptFromLocal: true,
    setup: setupDirectConnection,
    teardown: teardownDirectConnection,
  });
} else if (!_resolvedRemoteUrl) {
  failSuitePrerequisites(
    "AI Stream Integration - Direct (cheap)",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "AI Stream Integration - Direct (cheap)",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
