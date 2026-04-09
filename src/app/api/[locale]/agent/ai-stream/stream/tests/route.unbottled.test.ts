/**
 * AI Stream Integration - UNBOTTLED Self-Relay Mode
 *
 * Runs the exact same test suite as direct mode, but all AI inference is
 * routed through the UNBOTTLED provider path:
 *
 *   1. providerOverride=UNBOTTLED set on every runStream call
 *   2. stream-setup picks the cheapest UNBOTTLED variant of whatever model
 *      the skill/favorite resolves (chat + image/music/video gen)
 *   3. UNBOTTLED_CLOUD_CREDENTIALS set to point at the local dev server
 *   4. executeUnbottledStream detects self-relay (remoteUrl === localUrl)
 *   5. executeSelfRelay strips the providerOverride, calls runHeadlessAiStream
 *      with the underlying provider restored
 *   6. Same AI calls go out → same fixtures hit as direct tests
 *
 * No tool prefix needed - tools execute locally, same as direct mode.
 * Uses cachePrefix: "direct-" to reuse the same fixture files.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { env } from "@/config/env";
import { describeStreamSuite } from "./route-base.test";

// Module-level saved credentials - setup/teardown called inside describe scope
let savedCredentials: string | undefined;

async function setupUnbottled(): Promise<void> {
  const { resolveLocalAdminSession } =
    await import("@/app/api/[locale]/agent/models/model-prices/providers/local-session-helper");

  const session = await resolveLocalAdminSession(env.NEXT_PUBLIC_APP_URL);
  if (!session) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "setupUnbottled: resolveLocalAdminSession failed - admin user missing?",
    );
  }

  // Point UNBOTTLED credentials at ourselves → triggers self-relay path
  savedCredentials = agentEnv.UNBOTTLED_CLOUD_CREDENTIALS;
  Object.assign(agentEnv, {
    UNBOTTLED_CLOUD_CREDENTIALS: `${session.leadId}:${session.token}:${session.remoteUrl}`,
  });
}

async function teardownUnbottled(): Promise<void> {
  Object.assign(agentEnv, { UNBOTTLED_CLOUD_CREDENTIALS: savedCredentials });
}

describeStreamSuite({
  label: "AI Stream Integration - UNBOTTLED Self-Relay",
  cachePrefix: "direct-",
  providerOverride: ApiProvider.UNBOTTLED,
  setup: setupUnbottled,
  teardown: teardownUnbottled,
});
