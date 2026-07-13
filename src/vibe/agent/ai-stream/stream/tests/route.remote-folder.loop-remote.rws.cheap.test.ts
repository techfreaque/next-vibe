/**
 * CHEAP variant: media-gen steps swap to cortex/tool-help equivalents —
 * every callback mode and folder/placement assertion still runs.
 *
 * Remote Folder — LOOP ON REMOTE (reverse-WS).
 *
 * Threads are created inside REMOTE/hermes/tests/<case>: the folder stamps
 * loop_instance_id at creation and the AI loop runs ON HERMES over the
 * reverse-ws leg. System prompt + tools come FROM THE REMOTE no matter what —
 * the executor uses its own identity, prompt and tool catalog, so
 * self-instance-id reports hermes. Loop location is asserted hard: a new
 * usage-deduction ledger row on hermes per turn, none locally, transport
 * attested reverse-ws. Placement asserted per case on both sides.
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

const hooks = makeReverseWsSetup(_remoteUrl, { createRemoteFolder: true });

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `Remote Folder — loop on REMOTE (cheap, reverse-WS, ${_remoteUrl})`,
    // SHARE the direct variant's fixture cache: the loop runs identically on the
    // remote — only the TRANSPORT (reverse-ws vs direct-http) differs, and the
    // fixture engine replays the model/media calls the loop makes regardless of
    // which leg carried the relay. One recording serves both suites.
    cachePrefix: "rf-loop-remote-cheap-",
    cheapMode: true,
    systemPromptInstanceId: HERMES_INSTANCE_ID,
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
    "route.remote-folder.loop-remote.rws.cheap",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "route.remote-folder.loop-remote.rws.cheap",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
