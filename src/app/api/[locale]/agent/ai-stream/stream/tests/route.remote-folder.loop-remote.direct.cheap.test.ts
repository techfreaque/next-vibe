/**
 * CHEAP variant: media-gen steps swap to cortex/tool-help equivalents —
 * every callback mode and folder/placement assertion still runs.
 *
 * Remote Folder — LOOP ON REMOTE (direct-HTTP).
 *
 * Same contract as the reverse-WS file over the direct-http leg: thread in
 * REMOTE/hermes/tests/<case>, loop on hermes, system prompt + tools from the
 * remote (self-instance-id → hermes), remote billed per turn, transport
 * attested direct-http, placement asserted per case on both sides.
 */

import "server-only";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import {
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { makeDirectSetup } from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

const hooks = makeDirectSetup(_remoteUrl, { createRemoteFolder: true });

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `Remote Folder — loop on REMOTE (cheap, direct-HTTP, ${_remoteUrl})`,
    cachePrefix: "rf-loop-remote-direct-cheap-",
    cheapMode: true,
    systemPromptInstanceId: HERMES_INSTANCE_ID,
    expectRelayTransport: "direct-http",
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
    "route.remote-folder.loop-remote.direct.cheap",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "route.remote-folder.loop-remote.direct.cheap",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
