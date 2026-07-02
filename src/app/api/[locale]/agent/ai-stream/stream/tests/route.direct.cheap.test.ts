/**
 * AI Stream Integration - Direct tools-remote (CHEAP) — hermes 3002,
 * transportMode='direct-http'.
 *
 * Matrix cell: direct-http × loop-LOCAL × tools-REMOTE.
 * The AI loop runs on atlas; EVERY tool call routes through
 * execute-tool(instanceId='hermes') over direct-http (remoteInstanceId drives
 * the prompt wrapping + assertions). cheapMode swaps media-gen steps for
 * cortex/tool-help equivalents with the same observable thread shape. All
 * callback modes exercised against the remote executor.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";

import {
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
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
