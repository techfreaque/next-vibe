/**
 * AI Stream Integration — Remote Chat Root: Reverse-WS transport
 *
 * Threads live in:
 *   Local (atlas):  REMOTE → hermes → tests → unbottled-relay → <testCaseName>
 *   Remote (hermes): own DB — thread mirrored from relay (same threadId, threadMirrorMode='both')
 *
 * The REMOTE folder routes by default: the AI loop runs ON HERMES, events mirror
 * back and duplicate the thread locally under REMOTE/hermes. The suite is the
 * regular T-suite — same prompts, same assertions — with two extras:
 *   T-RELAY — hermes wallet decreased (proves loop ran on hermes)
 *   T-SYS   — AI reports hermes instance ID (proves system prompt from hermes)
 *
 * Both sides are asserted after T-RELAY: local thread in REMOTE/hermes, hermes
 * thread in its own DB (same threadId, threadMirrorMode='both').
 *
 * Transport: transportMode='reverse-ws', routing by REMOTE folder ancestry.
 * Only REMOTE/hermes threads route to hermes — no isDefault / routing rules.
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev                        (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev --fixture-mode (hermes, port 3002)
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { sql } from "drizzle-orm";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { getOrCreateFolder } from "../../testing/headless-test-runner";
import {
  ATLAS_INSTANCE_ID,
  connectToHermesLocalAi,
  disconnectFromHermesLocalAi,
  ensureRemoteUserCredits,
  failSuitePrerequisites,
  getProdDb,
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

/**
 * UUID of the REMOTE/hermes subfolder on atlas — threads start here.
 * Resolved in setup() after connectToHermesLocalAi creates the folder.
 */
let _localFolderId: string | null = null;

/**
 * UUID of the folder in hermes's DB where relayed threads land.
 * Hermes stores threads under its own REMOTE/atlas subfolder when
 * threadMirrorMode='both' (ws-provider/stream creates it on first use).
 * Polled from the hermes prod DB in setup() after a warm-up stream.
 */
let _hermesThreadFolderId: string | null = null;

let _prodUserId: string | null = null;

async function setup(testUser: JwtPrivatePayloadType): Promise<void> {
  await connectToHermesLocalAi(testUser, _remoteUrl ?? "http://localhost:3002");

  // Create REMOTE/hermes subfolder on atlas — threads go here.
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

  // Resolve the hermes-side thread folder: hermes places threads in its own
  // REMOTE/<atlas-instanceId> subfolder (created by ws-provider/stream on first use).
  // Poll the hermes prod DB for this folder — it exists after connect() registers atlas.
  const pdb = getProdDb();
  const rows = await pdb.execute<{ id: string }>(
    sql`SELECT id FROM chat_folders
          WHERE user_id = ${_prodUserId}
            AND root_folder_id = ${DefaultFolderId.REMOTE}
            AND name = ${ATLAS_INSTANCE_ID}
            AND parent_id IS NULL
          LIMIT 1`,
  );
  _hermesThreadFolderId = rows.rows[0]?.id ?? null;
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
  _hermesThreadFolderId = null;
}

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream — remote chat root reverse-WS (${_remoteUrl}, REMOTE/hermes → atlas, AI on hermes)`,
    // cachePrefix drives the per-suite subfolder name: tests/unbottled-relay
    cachePrefix: "unbottled-relay-",
    // REMOTE-folder semantics: loop, tools and system prompt all live on hermes.
    systemPromptInstanceId: HERMES_INSTANCE_ID,
    // T-RELAY: hermes wallet must decrease + thread must exist in hermes DB.
    assertRelayRan: true,
    get hermesThreadFolderId() {
      return _hermesThreadFolderId ?? undefined;
    },
    // Threads go into REMOTE/hermes/tests/unbottled-relay on atlas.
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
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "remote-chat-root (reverse-WS)",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
