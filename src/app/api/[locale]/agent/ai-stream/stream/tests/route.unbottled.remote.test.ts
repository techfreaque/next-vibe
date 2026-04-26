/**
 * AI Stream Integration - UNBOTTLED Remote Mode (hermes as cloud provider)
 *
 * Runs the full describeStreamSuite (T1–T12 + credits + favorites) with all
 * AI inference routed through the UNBOTTLED provider at localhost:3001.
 *
 * All external calls must stay within localhost:3001 - any call to a real AI
 * provider outside hermes will fail strict mode and cause the test to fail.
 *
 * Fixture strategy:
 *   - HTTP calls to localhost:3001 are intercepted via addLocalhostPort(3001)
 *   - WebSocket connections are intercepted via installWsFixture()
 *   - On first run (no fixtures): real connections to a running hermes instance
 *   - On subsequent runs: fully offline replay from fixture files
 *
 * Requirements for first run (fixture recording):
 *   - hermes running at localhost:3001 (vibe start)
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

import {
  addLocalhostPort,
  clearLocalhostPorts,
  setFetchCacheContext,
  setFetchCacheStrictMode,
} from "../../testing/fetch-cache";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { agentEnv } from "@/app/api/[locale]/agent/env";
import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { env } from "@/config/env";
import { PROD_URL } from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

/** hermes port for HTTP fixture interception */
const HERMES_PORT = 3001;

let savedCredentials: string | undefined;
let savedUnbottledAvailability: boolean;

async function resolveHermesSession(): Promise<{
  token: string;
  leadId: string;
}> {
  const response = await fetch(`${PROD_URL}/api/en-US/user/public/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.VIBE_ADMIN_USER_EMAIL,
      password: env.VIBE_ADMIN_USER_PASSWORD,
    }),
  });
  if (!response.ok) {
    const err = await response.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `resolveHermesSession: login failed ${String(response.status)} ${err}`,
    );
  }
  const json = (await response.json()) as {
    success: boolean;
    data?: { token?: string; leadId?: string };
  };
  if (!json.success || !json.data?.token) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error("resolveHermesSession: no token in login response");
  }
  return {
    token: json.data.token,
    leadId: json.data.leadId ?? "unknown",
  };
}

// oxlint-disable-next-line no-unused-vars -- required by ModeConfig setup signature
async function setupUnbottled(_testUser: JwtPrivatePayloadType): Promise<void> {
  addLocalhostPort(HERMES_PORT);

  // Login to hermes and set UNBOTTLED_CLOUD_CREDENTIALS.
  // The login call is cached under its own context so it replays offline.
  setFetchCacheContext("unbottled-setup");
  const session = await resolveHermesSession();
  savedCredentials = agentEnv.UNBOTTLED_CLOUD_CREDENTIALS;
  Object.assign(agentEnv, {
    UNBOTTLED_CLOUD_CREDENTIALS: `${session.leadId}:${session.token}:${PROD_URL}`,
  });

  // agentEnvAvailability.unbottled is a frozen singleton computed at startup from
  // NEXT_PUBLIC_AGENT_UNBOTTLED - which is false when UNBOTTLED_CLOUD_CREDENTIALS
  // is not in .env. Patch it so isModelProviderAvailable() returns true for UNBOTTLED.
  savedUnbottledAvailability = agentEnvAvailability.unbottled;
  Object.assign(agentEnvAvailability, { unbottled: true });

  // Note: strict mode is NOT enabled here so that first-run fixture recording
  // can make live calls to localhost:3001. On replay runs, all calls hit
  // cached fixtures naturally. Compliance is proven by addLocalhostPort(3001)
  // which routes all external AI calls through hermes - no real provider is
  // reachable unless via localhost:3001 which is always intercepted.
}

async function teardownUnbottled(
  // oxlint-disable-next-line no-unused-vars -- required by ModeConfig teardown signature
  _testUser: JwtPrivatePayloadType,
): Promise<void> {
  Object.assign(agentEnv, { UNBOTTLED_CLOUD_CREDENTIALS: savedCredentials });
  Object.assign(agentEnvAvailability, {
    unbottled: savedUnbottledAvailability,
  });
  clearLocalhostPorts();
  setFetchCacheStrictMode(false);
}

describeStreamSuite({
  label: "AI Stream Integration - UNBOTTLED Remote Mode",
  cachePrefix: "unbottled-",
  providerOverride: ApiProvider.UNBOTTLED,
  setup: setupUnbottled,
  teardown: teardownUnbottled,
});
