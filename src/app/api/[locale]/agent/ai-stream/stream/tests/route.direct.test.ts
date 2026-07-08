/**
 * AI Stream Integration - Direct tools-remote (hermes 3002,
 * transportMode='direct-http')
 *
 * Matrix cell: direct-http × loop-LOCAL × tools-REMOTE (full, real media).
 * The AI loop runs on atlas; EVERY tool call routes through
 * execute-tool(instanceId='hermes') over direct-http. (A plain connectToHermes
 * connection sets no routing flags — resolveTarget only relays on explicit
 * instanceId or a REMOTE folder — so the loop genuinely stays local.)
 *
 * Setup is E2E: connectToHermes logs into remote (3002), registers atlas, syncs caps.
 * transportMode='direct-http' is the default after connectToHermes (same machine).
 */

import "server-only";

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
    label: `AI Stream Integration - Direct tools-remote (${_resolvedRemoteUrl}, loop LOCAL, tools via execute-tool→hermes over direct-http)`,
    cachePrefix: "direct-",
    // Loop runs locally; every tool executes on hermes via the execute-tool
    // meta-tool (prompt wrapping + remote-call assertions key off this).
    remoteInstanceId: HERMES_INSTANCE_ID,
    assertSystemPromptFromLocal: true,
    setup: hooks.setup,
    teardown: hooks.teardown,
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
