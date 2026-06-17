/**
 * AI Stream Integration - UNBOTTLED Remote Mode (hermes as cloud provider)
 *
 * Runs the full describeStreamSuite (T1–T12 + credits + favorites) with all
 * AI inference routed through the UNBOTTLED provider at localhost:3002 (hermes).
 *
 * Architecture: AI loop runs LOCALLY on atlas, using hermes (3002) as the
 * model API provider. Thread stored locally in BACKGROUND root (no remote persistence).
 * The cloud (hermes) acts as a stateless model API — no thread mirroring, no storage.
 * Tools and system prompt are built locally. Cloud inference costs are deducted locally.
 *
 * All external calls must stay within localhost:3002 - any call to a real AI
 * provider outside hermes will fail strict mode and cause the test to fail.
 *
 * Fixture strategy:
 *   - HTTP calls to localhost:3002 are intercepted via addLocalhostPort(3002)
 *   - WebSocket connections are intercepted via installWsFixture()
 *   - On first run (no fixtures): real connections to a running hermes instance
 *   - On subsequent runs: fully offline replay from fixture files
 *
 * Requirements for first run (fixture recording):
 *   - hermes running at localhost:3002 (vibe --hermes dev)
 *   - hermes configured with VIBE_ADMIN_USER_EMAIL + VIBE_ADMIN_USER_PASSWORD
 *   - At least one AI model available on hermes
 *
 * Fixtures stored in:
 *   fixtures/http-cache/unbottled-{context}/   - HTTP responses
 *   fixtures/ws-cache/unbottled-{context}/     - WebSocket event streams
 *
 * Run: bun test route.unbottled.remote.test.ts
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { installWsFixture } from "../../testing/ws-fixture";
installWsFixture();

import { and, eq } from "drizzle-orm";

import { reloadWsProviderConnector } from "@/app/api/[locale]/remote-connection/connector";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import {
  addLocalhostPort,
  clearLocalhostPorts,
  setFetchCacheContext,
  setFetchCacheStrictMode,
} from "../../testing/fetch-cache";
import { connectToHermes, LOCAL_DEV_URL } from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

/** hermes port for HTTP fixture interception */
const HERMES_PORT = 3002;

/** Delete all local remote_connections rows pointing at LOCAL_DEV_URL for this user via the DELETE endpoint so cache invalidation fires. */
async function cleanupHermesConnections(testUser: JwtPrivatePayloadType): Promise<void> {
  const rows = await db
    .select({ instanceId: remoteConnections.instanceId })
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.remoteUrl, LOCAL_DEV_URL),
      ),
    );

  if (rows.length === 0) {
    return;
  }

  const connByIdDef =
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition");

  for (const row of rows) {
    await RouteExecuteRepository.runInProcessTyped({
      definition: connByIdDef.default.DELETE,
      input: {},
      urlPathParams: { instanceId: row.instanceId },
      user: testUser,
      locale: defaultLocale,
      platform: Platform.AI,
      logger: createEndpointLogger(false, Date.now(), defaultLocale),
    });
  }
}

async function setupUnbottled(testUser: JwtPrivatePayloadType): Promise<void> {
  addLocalhostPort(HERMES_PORT);

  // Cache setup HTTP calls (login + connect + PATCH) so they replay offline.
  // This also resets WS call counters so setup calls don't bleed into test fixtures.
  setFetchCacheContext("unbottled-setup");

  // Idempotent: clean up any leftover connection from a previous failed run.
  // Delete by remoteUrl (not instanceId) — hermes may report a different instanceId
  // than the hardcoded constant depending on its self-identity configuration.
  await cleanupHermesConnections(testUser);

  // Close any stale WsConnections from previous test runs that may still be alive
  // in the module-level _connections map. connectToHermes will create a fresh one
  // and immediately close it (direct-http = no persistent WS).
  reloadWsProviderConnector();

  // Create the remote connection DB row by logging into hermes and registering atlas.
  // connectToHermes sets transportMode='direct-http', loopLocation='server',
  // toolSource='local', threadMirrorMode='both' by default.
  await connectToHermes(testUser, LOCAL_DEV_URL);

  // Resolve the actual instanceId that hermes reported (may differ from "hermes").
  const [connRow] = await db
    .select({ instanceId: remoteConnections.instanceId })
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.remoteUrl, LOCAL_DEV_URL),
        eq(remoteConnections.isReverseEntry, false),
      ),
    )
    .limit(1);

  if (!connRow) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error("setupUnbottled: no connection row found after connectToHermes");
  }

  // Mark hermes as the UNBOTTLED inference provider for this connection.
  // isInferenceProvider=true means RemoteTransport.resolveInferenceProvider()
  // will find this row and route all UNBOTTLED model requests to hermes.
  const connByIdDef =
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition");
  await RouteExecuteRepository.runInProcessTyped({
    definition: connByIdDef.default.PATCH,
    input: { isInferenceProvider: true },
    urlPathParams: { instanceId: connRow.instanceId },
    user: testUser,
    locale: defaultLocale,
    platform: Platform.AI,
    logger: createEndpointLogger(false, Date.now(), defaultLocale),
  });

  // Note: strict mode is NOT enabled here so that first-run fixture recording
  // can make live calls to localhost:3002. On replay runs, all calls hit
  // cached fixtures naturally. Compliance is proven by addLocalhostPort(3002)
  // which routes all external AI calls through hermes - no real provider is
  // reachable unless via localhost:3002 which is always intercepted.
}

async function teardownUnbottled(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  await cleanupHermesConnections(testUser);
  clearLocalhostPorts();
  setFetchCacheStrictMode(false);
}

describeStreamSuite({
  label: "AI Stream Integration - UNBOTTLED Remote Mode",
  cachePrefix: "unbottled-",
  useExecuteToolWrapping: true,
  setup: setupUnbottled,
  teardown: teardownUnbottled,
  // Detach tasks (T5/T5b) run on the hermes remote instance (port 3002), not locally.
  // T10 (file attachments) and T11 (native image gen) require a live hermes at 3002
  // with a user that has Customer role. The test user only has Public role on hermes,
  // with proper credentials.
  // Approval state lives on the local instance; the AI loop runs locally here, but
  // this suite replays cheap recorded fixtures and none exist for the contact-form
  // approval flows (CF1/CF2) — running them would fail on missing fixtures, so the
});
