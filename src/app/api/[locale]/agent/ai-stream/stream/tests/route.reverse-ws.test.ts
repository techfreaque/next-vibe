/**
 * AI Stream Integration - Reverse WS (NAT: WS reverse connector)
 *
 * Regular chat in the BACKGROUND folder: the AI loop runs on atlas and the
 * prompts ask it to call tools on the remote via
 * execute-tool(instanceId='hermes'). Hermes executes the tools over its
 * reverse-WS connector and delivers results back.
 *
 *   1. execute-tool broadcasts tool-execute-request on
 *      system/tool-dispatch/{userId} (fire-and-forget over WS).
 *      If hermes has no open WS connection yet, the event is lost.
 *      Thread enters 'waiting' state.
 *   2. runReverseWsPulse() PATCHes /user/remote-connection/atlas on hermes:
 *        - Sets transportMode='reverse-ws'
 *        - PATCH handler calls openConnection() which opens a persistent WS to atlas
 *        - On open: any pending tool-execute-request is re-broadcast (missed event recovery)
 *   3. Hermes WS connector receives tool-execute-request, executes the tool locally,
 *      replies inline on the socket (wait/endLoop) or POSTs /report (wakeUp/detach).
 *   4. /report → handleTaskCompletion → revival fires → thread returns to 'idle'.
 *
 * Setup forces transportMode='cloud-only' so the initial execute-tool call cannot
 * dispatch directly and the thread enters 'waiting'. The pulse then switches to
 * 'reverse-ws' which opens the connector and delivers the pending request.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { and, eq } from "drizzle-orm";
import {
  failSuitePrerequisites,
  isHermesInFixtureMode,
  resolveRemoteUrl,
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const HERMES_INSTANCE_ID = "hermes";
/** instanceId used by hermes to refer to atlas */
const ATLAS_INSTANCE_ID = "atlas";

/**
 * Resolved remote URL — set once before the suite runs.
 * Requires port 3002 (vibe --hermes dev --fixture-mode).
 */
let PROD_URL = "http://localhost:3002";

let _prodAdminToken: string | null = null;
let _prodUserId: string | null = null;

async function setupReverseWsConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermesLocalAi,
    resolveProdUserId,
    resolveProdAdminToken,
    triggerPull,
  } = await import("../../testing/remote-setup");

  // Local AI loop + remote tool execution: isDefault=false so nothing relays;
  // the AI dispatches tools explicitly via execute-tool(instanceId='hermes').
  // Includes idempotent disconnect of leftover connections.
  await connectToHermesLocalAi(testUser, PROD_URL);

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _prodUserId = await resolveProdUserId();
  _prodAdminToken = await resolveProdAdminToken(PROD_URL);

  // NAT simulation: close hermes's connector again and mark the local
  // transport cloud-only so the first execute-tool broadcast has no open WS
  // channel. The thread enters 'waiting'. runReverseWsPulse then PATCHes to
  // 'reverse-ws' which opens the connector and delivers the missed event.
  // cloud-only is an internal transport state (no public API) — set directly.
  await fetch(
    `${PROD_URL}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${_prodAdminToken}`,
      },
      body: JSON.stringify({ transportMode: "cloud-only" }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  await db
    .update(remoteConnections)
    .set({ transportMode: "cloud-only" as "reverse-ws" })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

async function teardownReverseWsConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes } =
    await import("../../testing/remote-setup");

  // Reset transportMode back to cloud-only on hermes before disconnecting (best-effort).
  // Per spec: closeConnection is called by PATCH handler when transportMode changes
  // away from reverse-ws.
  if (_prodAdminToken) {
    try {
      await fetch(
        `${PROD_URL}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
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
  _prodUserId = null;
  _prodAdminToken = null;
}

/**
 * Reverse WS connector revival:
 *   1. PATCH /user/remote-connection/atlas on hermes sets transportMode='reverse-ws'.
 *      The PATCH handler calls openConnection() on hermes:
 *        - Opens a persistent WS to atlas (localhost)
 *        - Subscribes to system/tool-dispatch/{userId}
 *        - On open: any queued tool-execute-request (missed while WS was down) is re-broadcast
 *   2. Hermes connector receives tool-execute-request, executes the tool locally,
 *      POSTs /report back to atlas.
 *   3. handleTaskCompletion → revival → thread exits 'waiting'.
 *
 * We poll chatThreads.streamingState for up to 60s after the PATCH.
 */
async function runReverseWsPulse(threadId: string): Promise<void> {
  if (!_prodAdminToken) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "runReverseWsPulse: no prod admin token - setupReverseWsConnection not called?",
    );
  }

  // PATCH transportMode='reverse-ws' on hermes's atlas row.
  // The PATCH handler calls openConnection() directly:
  //   - Opens WS to atlas, subscribes to system/tool-dispatch/{userId}
  //   - On open: any pending (missed) tool-execute-request is re-broadcast and executed
  const patchResp = await fetch(
    `${PROD_URL}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${_prodAdminToken}`,
      },
      body: JSON.stringify({ transportMode: "reverse-ws" }),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!patchResp.ok) {
    const body = await patchResp.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `runReverseWsPulse: PATCH transportMode failed ${String(patchResp.status)}: ${body}`,
    );
  }

  // eslint-disable-next-line no-console
  console.log("[runReverseWsPulse] transportMode=reverse-ws PATCH succeeded");

  // Poll chatThreads.streamingState until thread exits 'waiting'.
  // Hermes connector executes the tool and POSTs /report → handleTaskCompletion → revival.
  // Allow up to 60s for tool execution + revival to complete.
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const [thread] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (thread && thread.streamingState !== "waiting") {
      // eslint-disable-next-line no-console
      console.log(
        "[runReverseWsPulse] Thread exited waiting:",
        thread.streamingState,
      );
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 300);
    });
  }

  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `runReverseWsPulse: thread ${threadId} still in 'waiting' after 60s — WS connector did not deliver result`,
  );
}

const _resolvedRemoteUrl = await resolveRemoteUrl();
const _isFixtureMode = isHermesInFixtureMode();

if (_resolvedRemoteUrl && _isFixtureMode) {
  PROD_URL = _resolvedRemoteUrl;
  describeStreamSuite({
    label: `AI Stream Integration - Reverse WS (${_resolvedRemoteUrl}, NAT: WS reverse connector → hermes → /report)`,
    cachePrefix: "reverse-ws-",
    // Local AI loop; prompts instruct execute-tool(instanceId='hermes').
    // Tools execute on hermes via the WS reverse connector.
    // pulse: opens reverse-ws connector on hermes, which picks up and executes the pending tool call.
    remoteInstanceId: HERMES_INSTANCE_ID,
    setup: setupReverseWsConnection,
    teardown: teardownReverseWsConnection,
    pulse: runReverseWsPulse,
  });
} else if (!_resolvedRemoteUrl) {
  failSuitePrerequisites(
    "AI Stream Integration - Reverse WS",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "AI Stream Integration - Reverse WS",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
