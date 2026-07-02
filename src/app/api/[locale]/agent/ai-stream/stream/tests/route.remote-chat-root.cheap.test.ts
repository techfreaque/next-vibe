/**
 * AI Stream Integration — Remote Chat Root (CHEAP): reverse-WS transport
 *
 * Same suite as route.remote-chat-root (AI loop on hermes, REMOTE/hermes folder
 * routing, events mirror back to atlas) but in cheapMode: media-gen steps swap to
 * cortex/tool-help equivalents, so no media-provider fixtures are needed. Still
 * exercises every callback mode + folder placement + the BACKGROUND-landing path
 * across the reverse-WS relay. The RCR-1..4 bidirectional folder assertions live
 * in route.remote-chat-root (full); this cheap file is the fast callback/folder
 * pass to get green first.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import {
  failSuitePrerequisites,
  isHermesInFixtureMode,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { makeReverseWsSetup } from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

// Reverse-WS connection + REMOTE/hermes subfolder on atlas (threads start
// there) + remote credit top-up (20000cr) + mirrored teardown.
const hooks = makeReverseWsSetup(_remoteUrl, { createRemoteFolder: true });

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream — remote chat root reverse-WS (cheap) (${_remoteUrl}, REMOTE/hermes → atlas, AI on hermes)`,
    cachePrefix: "unbottled-relay-cheap-",
    expectRelayTransport: "reverse-ws",
    cheapMode: true,
    // Tools and system prompt ALWAYS come from the client (options on the
    // ai-stream) — the executor runs the loop but identifies the CALLER.
    assertSystemPromptFromLocal: true,
    assertRelayRan: true,
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
    "remote-chat-root (reverse-WS, cheap)",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "remote-chat-root (reverse-WS, cheap)",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
