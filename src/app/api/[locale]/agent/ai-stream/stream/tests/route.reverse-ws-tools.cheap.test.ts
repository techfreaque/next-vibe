/**
 * AI Stream Integration - Reverse-WS tools-remote (CHEAP) — hermes 3002.
 *
 * Matrix cell: reverse-ws × loop-LOCAL × tools-REMOTE.
 * The AI loop runs on atlas; EVERY tool call routes through
 * execute-tool(instanceId='hermes') dispatched over the reverse-WS event
 * transport (connectToHermesLocalAi sets atlas's send leg to reverse-ws and
 * opens hermes's connector — an always-connected reverse-WS peer, no NAT/pulse
 * simulation). cheapMode swaps media-gen steps for cortex/tool-help
 * equivalents with the same observable thread shape. All callback modes are
 * exercised against the remote executor over the event transport.
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
import { makeReverseWsSetup } from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _resolvedRemoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

// Idempotent E2E connection: disconnect leftovers → connectToHermesLocalAi →
// resolveProdUserId → top up remote credits via real endpoint (20000cr) →
// mirrored teardown (disconnect + unregister).
const hooks = makeReverseWsSetup(_resolvedRemoteUrl);

if (_resolvedRemoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream Integration - Reverse-WS tools-remote (cheap) (${_resolvedRemoteUrl}, loop LOCAL, tools via execute-tool→hermes over reverse-ws)`,
    cachePrefix: "rws-tools-cheap-",
    cheapMode: true,
    // Loop runs locally; every tool executes on hermes via the execute-tool
    // meta-tool dispatched over the reverse-WS event transport.
    remoteInstanceId: HERMES_INSTANCE_ID,
    assertSystemPromptFromLocal: true,
    setup: hooks.setup,
    teardown: hooks.teardown,
  });
} else if (!_resolvedRemoteUrl) {
  failSuitePrerequisites(
    "AI Stream Integration - Reverse-WS tools-remote (cheap)",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "AI Stream Integration - Reverse-WS tools-remote (cheap)",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
