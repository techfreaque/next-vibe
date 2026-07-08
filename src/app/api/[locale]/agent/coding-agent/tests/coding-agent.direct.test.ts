/**
 * Coding Agent Integration - Direct (atlas 3000 → hermes-dev 3002, transportMode='direct-http')
 *
 * Simulates a publicly accessible remote instance. Coding-agent calls go via
 * execute-tool(instanceId='hermes') with transportMode='direct-http':
 *
 *   WAIT/END_LOOP: blocking direct HTTP → result inline, no queue, no waiting state.
 *   DETACH/WAKE_UP: fire-and-forget goroutine → result async via handleTaskCompletion.
 *
 * Setup is E2E: connectToHermes logs into hermes-dev, registers atlas, syncs caps.
 * transportMode='direct-http' is the default after connectToHermes (same machine).
 *
 * pulse is provided as a fallback: if hermes-dev (3002) is unreachable, execute-tool
 * falls back to the task-queue path and the thread enters 'waiting'. The pulse handles
 * that case via the WS connector without breaking the test.
 * When hermes-dev is reachable, the thread never enters 'waiting' for WAIT/END_LOOP and
 * pulse is never called.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";

import { rootlessStreamContext } from "@/app/api/[locale]/agent/chat/config";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import favoritesCreateDefinitions from "@/app/api/[locale]/agent/skills/favorites/create/definition";
import favoritesDefinitions from "@/app/api/[locale]/agent/skills/favorites/definition";
import remoteConnectionByIdDefinitions from "@/app/api/[locale]/remote-connection/[instanceId]/definition";

import {
  ATLAS_INSTANCE_ID,
  HERMES_INSTANCE_ID,
} from "../../ai-stream/testing/remote-setup";
import { describeCodingAgentSuite } from "./coding-agent-base.test";

let _testUser: JwtPrivatePayloadType | null = null;
let _prodUserId: string | null = null;

async function setupDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    resolveProdUserId,
    restoreHermesIdentity,
    restoreAtlasIdentity,
  } = await import("../../ai-stream/testing/remote-setup");

  _testUser = testUser;
  await disconnectFromHermes(testUser.id);
  await restoreHermesIdentity();
  await restoreAtlasIdentity();
  await connectToHermes(testUser);

  _prodUserId = await resolveProdUserId();

  // Ensure the test favorite exists on hermes — hermes's AI loop resolves favorites
  // from its own DB (not atlas's). Only create if none exists yet.
  const hermesListResp = await sendTestRequest({
    fixtureContext: undefined,
    endpoint: favoritesDefinitions.GET,
    data: {},
    user: testUser,
    instanceId: HERMES_INSTANCE_ID,
  });
  const hermesFavs = hermesListResp.success
    ? (hermesListResp.data?.favorites as { skillId?: string }[] | undefined)
    : undefined;
  const alreadyHas = hermesFavs?.some((f) => f.skillId === "quality-tester");
  if (!alreadyHas) {
    await sendTestRequest({
      fixtureContext: undefined,
      endpoint: favoritesCreateDefinitions.POST,
      data: { skillId: "quality-tester" },
      user: testUser,
      instanceId: HERMES_INSTANCE_ID,
    });
  }
}

async function teardownDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes, closeProdDb } =
    await import("../../ai-stream/testing/remote-setup");

  // Disable forceSystemProvider on hermes before disconnecting (best-effort)
  try {
    await sendTestRequest({
      fixtureContext: undefined,
      endpoint: remoteConnectionByIdDefinitions.PATCH,
      urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
      data: { forceSystemProvider: false },
      user: testUser,
      instanceId: HERMES_INSTANCE_ID,
    });
  } catch {
    /* best-effort */
  }

  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_prodUserId) {
    tasks.push(unregisterDevFromHermes(_prodUserId));
  }
  await Promise.all(tasks);
  await closeProdDb();
  _prodUserId = null;
  _testUser = null;
}

/**
 * Wait for a thread in 'waiting' state to auto-revive.
 *
 * In direct-http transport, WAKE_UP tasks revive automatically when the
 * goroutine on hermes completes and calls back via completePendingCall →
 * handleTaskCompletion. No external trigger is needed — just wait.
 *
 * For WAIT/END_LOOP that fell back to the queue path (network failure), the
 * revival also arrives via the same callback path once hermes completes.
 */
async function runDirectPulse(
  threadId: string,
): Promise<void> {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    const [thread] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (thread && thread.streamingState !== "waiting") {
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `runDirectPulse: thread ${threadId} still in 'waiting' after 120s — goroutine did not complete`,
  );
}

describeCodingAgentSuite({
  label:
    "Coding Agent Integration - Direct (atlas 3000 → hermes-dev 3002, transportMode='direct-http')",
  cachePrefix: "ca-direct-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupDirectConnection,
  teardown: teardownDirectConnection,
  pulse: (threadId) => {
    if (!_testUser) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
      throw new Error(
        "runDirectPulse: testUser not set — setupDirectConnection not called?",
      );
    }
    return runDirectPulse(threadId);
  },
  isDirect: true,
});
