/**
 * AI Stream Integration — Remote Chat Root: Reverse-WS transport
 *
 * Threads live in REMOTE -> hermes -> tests -> <testCaseName>. The REMOTE
 * folder routes by default: the AI loop runs ON HERMES, events mirror back
 * and duplicate the thread locally. The tests are the regular suite — same
 * prompts, same assertions; only the folder (and therefore the loop
 * location) differs.
 *
 * Transport: transportMode='reverse-ws', isDefault=false
 * (only the REMOTE folder routes to hermes — deterministic by folder ancestry).
 *
 * Full T-suite via describeStreamSuite with remoteInstanceId='hermes'.
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev               (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev       (hermes, port 3002)
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { getOrCreateFolder } from "../../testing/headless-test-runner";
import {
  connectToHermesLocalAi,
  disconnectFromHermesLocalAi,
  ensureRemoteUserCredits,
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveProdAdminToken,
  resolveProdUserId,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

let _prodUserId: string | null = null;
let _localFolderId: string | null = null;

async function setup(testUser: JwtPrivatePayloadType): Promise<void> {
  await connectToHermesLocalAi(testUser, _remoteUrl ?? "http://localhost:3002");

  // Threads live in REMOTE → <instanceId>; route-base nests tests/<case> inside.
  _localFolderId = await getOrCreateFolder(
    testUser,
    DefaultFolderId.REMOTE,
    HERMES_INSTANCE_ID,
    null,
  );

  _prodUserId = await resolveProdUserId();
  const remoteAdminToken = await resolveProdAdminToken(
    _remoteUrl ?? "http://localhost:3002",
  );
  await ensureRemoteUserCredits(
    _remoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _prodUserId,
    20000,
  );
}

async function teardown(testUser: JwtPrivatePayloadType): Promise<void> {
  await disconnectFromHermesLocalAi(
    testUser,
    _remoteUrl ?? "http://localhost:3002",
  );
  if (_prodUserId) {
    await unregisterDevFromHermes(_prodUserId);
  }
  _prodUserId = null;
  _localFolderId = null;
}

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream — remote chat root reverse-WS (${_remoteUrl}, REMOTE/hermes, AI on hermes)`,
    cachePrefix: "remote-chat-root-",
    // REMOTE-folder semantics: loop, tools and system prompt all come from
    // the remote instance — the thread merely starts locally and mirrors back.
    systemPromptInstanceId: HERMES_INSTANCE_ID,
    get rootFolderIdOverride() {
      return DefaultFolderId.REMOTE;
    },
    get subFolderIdOverride() {
      return _localFolderId ?? undefined;
    },
    setup,
    teardown,
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "remote-chat-root (reverse-WS)",
    "hermes not running — start: vibe --hermes dev",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "remote-chat-root (reverse-WS)",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
