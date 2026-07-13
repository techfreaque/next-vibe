/**
 * CHEAP variant: media-gen steps swap to cortex/tool-help equivalents —
 * every callback mode and folder/placement assertion still runs.
 *
 * Remote Folder — LOOP ON CALLER, tools from remote (reverse-WS).
 *
 * Threads live in the SAME REMOTE/hermes/tests/<case> folder, but every
 * stream forces loopInstanceId="self": the AI loop runs HERE while system
 * prompt + tools come FROM THE REMOTE (the setup fetches hermes's prompt
 * cross-instance; tool calls round-trip via execute-tool(instanceId=hermes)
 * over the reverse-ws leg — self-instance-id still reports hermes). The
 * LOCAL wallet is billed for the loop. Placement asserted per case on both
 * sides.
 */

import "server-only";

import { DefaultFolderId } from "next-vibe/agent/chat/config";

import {
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { makeReverseWsSetup } from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

const hooks = makeReverseWsSetup(_remoteUrl, {
  createRemoteFolder: true,
  // Loop-local topology: the CONNECTION setting keeps the loop here.
  loopLocation: "caller",
});

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `Remote Folder — loop on CALLER, tools from remote (cheap, reverse-WS, ${_remoteUrl})`,
    cachePrefix: "rf-loop-local-rws-cheap-",
    cheapMode: true,
    systemPromptInstanceId: HERMES_INSTANCE_ID,
    remoteInstanceId: HERMES_INSTANCE_ID,
    forceLocalLoop: true,
    expectRelayTransport: "reverse-ws",
    get rootFolderIdOverride() {
      return DefaultFolderId.REMOTE;
    },
    get subFolderIdOverride() {
      return hooks.getLocalFolderId() ?? undefined;
    },
    setup: hooks.setup,
    teardown: hooks.teardown,
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "route.remote-folder.loop-local.rws.cheap",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "route.remote-folder.loop-local.rws.cheap",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
