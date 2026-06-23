/**
 * Remote Connection — E2E Tool Execution Tests (instance identity proof)
 *
 * Proves that tool execution routed to hermes actually runs ON hermes:
 *   system-prompt-debug returns "**Instance ID:** hermes" in the system prompt.
 *
 * Tested for both transport modes:
 *   RC-EXECUTE-DIRECT: direct-http (connectToHermes)
 *   RC-EXECUTE-WS:     reverse-WS  (connectToHermesLocalAi)
 *
 * This file is guarded by resolveRemoteUrlSync() — if Hermes is not running,
 * the suite fails immediately (not silently skipped). Run: vibe --hermes dev
 */

import "server-only";

import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import systemPromptDebugDefinitions from "@/app/api/[locale]/agent/ai-stream/system-prompt/debug/definition";
import {
  closeProdDb,
  connectToHermes,
  connectToHermesLocalAi,
  disconnectFromHermes,
  disconnectFromHermesLocalAi,
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  LOCAL_DEV_URL,
  resolveDevUser,
  resolveRemoteUrlSync,
} from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

// ── Skip guard ────────────────────────────────────────────────────────────────

const _remoteUrl = resolveRemoteUrlSync();
if (!_remoteUrl) {
  failSuitePrerequisites(
    "Remote E2E tool execution tests",
    "remote server not running — start: vibe --hermes dev → http://localhost:3002",
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const RemoteResultSchema = z.object({ systemPrompt: z.string() });

function extractSystemPrompt(data: WidgetData): string {
  const parsed = RemoteResultSchema.safeParse(data);
  return parsed.success ? parsed.data.systemPrompt : "";
}

async function assertRunsOnHermes(user: JwtPrivatePayloadType, label: string): Promise<void> {
  const result = await RouteExecuteRepository.runInProcessTyped({
    definition: systemPromptDebugDefinitions.GET,
    instanceId: HERMES_INSTANCE_ID,
    user,
    locale: defaultLocale,
    input: { rootFolderId: DefaultFolderId.PRIVATE },
  });

  expect(
    result.success,
    `${label}: expected success, got: ${result.success ? "ok" : result.message}`,
  ).toBe(true);
  if (!result.success) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(`${label}: ${result.message}`);
  }

  const systemPrompt = extractSystemPrompt(result.data);
  expect(
    systemPrompt,
    `${label}: system prompt must contain "**Instance ID:** hermes" — tool executed locally instead of on hermes. Got: ${systemPrompt.slice(0, 200)}`,
  ).toContain("**Instance ID:** hermes");
}

// ── Shared state ──────────────────────────────────────────────────────────────

let testUser: JwtPrivatePayloadType;

beforeAll(async () => {
  const user = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
  if (!user) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      `Remote E2E: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found in local DB`,
    );
  }
  testUser = user;
}, 30_000);

// ── RC-EXECUTE-DIRECT: direct-http transport ──────────────────────────────────

describe("RC-EXECUTE-DIRECT: direct-http tool execution on hermes", () => {
  beforeAll(async () => {
    await connectToHermes(testUser, LOCAL_DEV_URL);
  }, 120_000);

  afterAll(async () => {
    await disconnectFromHermes(testUser.id);
    await closeProdDb();
  }, 30_000);

  it(
    "RC-DIRECT-1: runInProcessTyped routes to hermes and returns Instance ID: hermes",
    async () => {
      await assertRunsOnHermes(testUser, "RC-DIRECT-1");
    },
    60_000,
  );
});

// ── RC-EXECUTE-WS: reverse-WS transport ──────────────────────────────────────

describe("RC-EXECUTE-WS: reverse-WS tool execution on hermes", () => {
  beforeAll(async () => {
    await connectToHermesLocalAi(testUser, LOCAL_DEV_URL);
  }, 120_000);

  afterAll(async () => {
    await disconnectFromHermesLocalAi(testUser, LOCAL_DEV_URL);
    await closeProdDb();
  }, 30_000);

  it(
    "RC-WS-1: runInProcessTyped via reverse-WS returns Instance ID: hermes",
    async () => {
      await assertRunsOnHermes(testUser, "RC-WS-1");
    },
    60_000,
  );
});
