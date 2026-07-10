/**
 * AI Stream Integration - Direct tools-remote (CHEAP, REVERSE-WS) — hermes 3002,
 * transportMode='reverse-ws'.
 *
 * Matrix cell: reverse-ws × loop-LOCAL × tools-REMOTE — the reverse-ws twin of
 * route.direct.cheap. The AI loop runs on atlas; EVERY tool call routes through
 * execute-tool(instanceId='hermes'), but over the REVERSE-WS leg instead of a
 * synchronous HTTP POST: atlas emits the tool-execute-request as a bridge event
 * on its hub, and HERMES's connector (which it opened toward atlas at connect,
 * because atlas's send leg is reverse-ws) receives it, runs the tool, and posts
 * the result back. Exercises the exact same conversation as the direct suite —
 * so it shares the model fixtures — but proves the reverse-ws dispatch path.
 *
 * Separate cache folder + thread folder (via cachePrefix) so its fixtures and
 * seeded threads never collide with the direct-http suite.
 */

import "server-only";

import {
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { makeReverseWsSetup } from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _resolvedRemoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

// Reverse-ws E2E connection: connectToHermesLocalAi sets atlas's send leg to
// reverse-ws and waits for hermes's connector to atlas to go live, so the first
// tool-execute-request event has a subscriber.
const hooks = makeReverseWsSetup(_resolvedRemoteUrl);

if (_resolvedRemoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream Integration - Direct tools-remote (cheap, reverse-WS) (${_resolvedRemoteUrl}, loop LOCAL, tools via execute-tool→hermes over reverse-ws)`,
    cachePrefix: "direct-rws-cheap-",
    cheapMode: true,
    // Loop runs locally; every tool executes on hermes via the execute-tool
    // meta-tool — dispatched over the reverse-ws leg.
    remoteInstanceId: HERMES_INSTANCE_ID,
    assertSystemPromptFromLocal: true,
    expectRelayTransport: "reverse-ws",
    setup: hooks.setup,
    teardown: hooks.teardown,
  });
} else if (!_resolvedRemoteUrl) {
  failSuitePrerequisites(
    "AI Stream Integration - Direct (cheap, reverse-WS)",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "AI Stream Integration - Direct (cheap, reverse-WS)",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
