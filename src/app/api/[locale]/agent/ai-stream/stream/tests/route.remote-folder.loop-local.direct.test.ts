/**
 * Remote Folder — LOOP ON CALLER, tools from remote (direct-HTTP).
 *
 * Same contract as the reverse-WS loop-local file over the direct-http leg:
 * thread in REMOTE/hermes/tests/<case>, loop forced local ("self" sentinel),
 * system prompt + tools from the remote, self-instance-id → hermes, local
 * wallet billed, placement asserted per case on both sides.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

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
    label: `Remote Folder — loop on CALLER, tools from remote (direct-HTTP, ${_remoteUrl})`,
    cachePrefix: "rf-loop-local-direct-",
    systemPromptInstanceId: HERMES_INSTANCE_ID,
    remoteInstanceId: HERMES_INSTANCE_ID,
    forceLocalLoop: true,
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
    "route.remote-folder.loop-local.direct",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "route.remote-folder.loop-local.direct",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
