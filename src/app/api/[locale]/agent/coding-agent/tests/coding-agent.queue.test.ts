/**
 * Coding Agent Integration - Cloud-Only Transport (UNAVAILABLE path)
 *
 * Tests that transportMode='cloud-only' returns an immediate UNAVAILABLE error —
 * no cron task is created, no 'waiting' state is entered.
 *
 * Cloud-only is the passive inbound mode: the remote instance has no token that
 * can be dialled. Tool dispatch is not supported → execute-tool fails immediately
 * with EXTERNAL_SERVICE_ERROR. The AI receives the error inline and proceeds.
 *
 * This verifies the fail-fast contract: no task queue fallback, no retry.
 */

import "server-only";

import { installFetchCache } from "../../ai-stream/testing/fetch-cache";
installFetchCache();

import { and, eq } from "drizzle-orm";

import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { describeCodingAgentSuite } from "./coding-agent-base.test";

const HERMES_INSTANCE_ID = "hermes";
/** instanceId used by hermes to refer to atlas */
const ATLAS_INSTANCE_ID = "atlas";
/** Local dev server URL (hermes, vibe --hermes dev) */
const LOCAL_DEV_URL = "http://localhost:3002";

let _prodAdminToken: string | null = null;
let _prodUserId: string | null = null;

async function setupCloudOnlyConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    resolveProdUserId,
    resolveProdAdminToken,
  } = await import("../../ai-stream/testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into prod, register atlas on hermes, sync capabilities
  await connectToHermes(testUser, LOCAL_DEV_URL);

  _prodUserId = await resolveProdUserId();
  _prodAdminToken = await resolveProdAdminToken(LOCAL_DEV_URL);

  // Force cloud-only transport: no token dialling, tool dispatch returns UNAVAILABLE immediately.
  // transportMode='cloud-only' is the passive inbound mode — no task queue fallback.
  await db
    .update(remoteConnections)
    .set({ transportMode: "cloud-only" })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

async function teardownCloudOnlyConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes, closeProdDb } =
    await import("../../ai-stream/testing/remote-setup");

  // Reset transportMode on hermes before disconnecting (best-effort).
  if (_prodAdminToken) {
    try {
      await fetch(
        `${LOCAL_DEV_URL}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${_prodAdminToken}`,
          },
          body: JSON.stringify({ transportMode: "cloud-only" }),
          signal: AbortSignal.timeout(5_000),
        },
      );
    } catch {
      /* best-effort */
    }
  }

  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_prodUserId) {
    tasks.push(unregisterDevFromHermes(_prodUserId));
  }
  await Promise.all(tasks);
  await closeProdDb();
  _prodUserId = null;
  _prodAdminToken = null;
}

describeCodingAgentSuite({
  label:
    "Coding Agent Integration - Cloud-Only (UNAVAILABLE: no task queue fallback)",
  cachePrefix: "ca-cloud-only-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupCloudOnlyConnection,
  teardown: teardownCloudOnlyConnection,
  // No pulse: cloud-only returns UNAVAILABLE inline — thread never enters 'waiting'.
  pulse: undefined,
  // isDirect: cloud-only fails fast (inline error), same as direct-http in terms of
  // response shape (no deferred waiting state).
  isDirect: true,
});
