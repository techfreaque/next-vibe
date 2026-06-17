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

import { installFetchCache } from "../../ai-stream/testing/fetch-cache";
installFetchCache();

import { eq } from "drizzle-orm";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  ATLAS_INSTANCE_ID,
  HERMES_INSTANCE_ID,
  LOCAL_DEV_URL,
} from "../../ai-stream/testing/remote-setup";
import { describeCodingAgentSuite } from "./coding-agent-base.test";

let _prodUserId: string | null = null;
let _prodAdminToken: string | null = null;

async function setupDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    resolveProdUserId,
    resolveProdAdminToken,
    triggerPull,
  } = await import("../../ai-stream/testing/remote-setup");

  await disconnectFromHermes(testUser.id);
  await connectToHermes(testUser);
  await triggerPull();

  _prodUserId = await resolveProdUserId();
  _prodAdminToken = await resolveProdAdminToken();
}

async function teardownDirectConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes, closeProdDb } =
    await import("../../ai-stream/testing/remote-setup");

  // Disable forceSystemProvider on hermes before disconnecting (best-effort)
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
          body: JSON.stringify({ forceSystemProvider: false }),
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

/**
 * Fallback pulse for direct mode: fires only when the direct HTTP call failed and
 * execute-tool fell back to the queue path (thread in 'waiting').
 * Uses WS connector on hermes-dev 3002 — same as queue test.
 */
async function runDirectPulse(threadId: string): Promise<void> {
  if (!_prodAdminToken) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "runDirectPulse: no prod admin token - setupDirectConnection not called?",
    );
  }

  const patchResp = await fetch(
    `${LOCAL_DEV_URL}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${_prodAdminToken}`,
      },
      body: JSON.stringify({ forceSystemProvider: true }),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!patchResp.ok) {
    const body = await patchResp.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `runDirectPulse: PATCH forceSystemProvider failed ${String(patchResp.status)}: ${body}`,
    );
  }

  const deadline = Date.now() + 60_000;
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
    `runDirectPulse: thread ${threadId} still in 'waiting' after 60s`,
  );
}

describeCodingAgentSuite({
  label:
    "Coding Agent Integration - Direct (atlas 3000 → hermes-dev 3002, transportMode='direct-http')",
  cachePrefix: "ca-direct-",
  remoteInstanceId: HERMES_INSTANCE_ID,
  setup: setupDirectConnection,
  teardown: teardownDirectConnection,
  pulse: runDirectPulse,
  isDirect: true,
});
