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

import {
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { makeDirectSetup } from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _resolvedRemoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

// Idempotent E2E connection: disconnect leftovers → connectToHermes →
// resolveProdUserId → top up remote credits via real endpoint (20000cr) →
// mirrored teardown (disconnect + unregister).
const hooks = makeDirectSetup(_resolvedRemoteUrl);

if (_resolvedRemoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream Integration - Direct tools-remote (cheap) (${_resolvedRemoteUrl}, loop LOCAL, tools via execute-tool→hermes over direct-http)`,
    cachePrefix: "direct-cheap-",
    cheapMode: true,
    // Loop runs locally; every tool executes on hermes via the execute-tool
    // meta-tool (prompt wrapping + remote-call assertions key off this).
    remoteInstanceId: HERMES_INSTANCE_ID,
    assertSystemPromptFromLocal: true,
    setup: hooks.setup,
    teardown: hooks.teardown,
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
