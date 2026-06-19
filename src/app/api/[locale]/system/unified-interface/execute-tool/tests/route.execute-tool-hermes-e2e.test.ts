/**
 * Remote Connection — End-to-End Tool Execution Tests
 *
 * Proves that tool execution routed to hermes actually runs ON hermes:
 *   - `system-prompt-debug` returns "**Instance ID:** hermes" in the system prompt
 *   - Both direct-http transport and reverse-WS transport are tested
 *
 * Uses the definition-driven `RouteExecuteRepository.runInProcessTyped` path —
 * the same central executor used by AI loops and the CLI.
 *
 * Requires: vibe --hermes dev --fixture-mode  → http://localhost:3002
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
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// When instanceId is set, runInProcessTyped goes through execute() which wraps
// the remote response as { result: <endpoint output> } for MCP/AI display.
const RemoteResultSchema = z.object({
  result: z.object({ systemPrompt: z.string() }),
});

function extractSystemPrompt(data: WidgetData): string {
  const parsed = RemoteResultSchema.safeParse(data);
  if (!parsed.success) {
    return "";
  }
  return parsed.data.result.systemPrompt;
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
      const result = await RouteExecuteRepository.runInProcessTyped({
        definition: systemPromptDebugDefinitions.GET,
        instanceId: HERMES_INSTANCE_ID,
        user: testUser,
        locale: defaultLocale,
        input: { rootFolderId: DefaultFolderId.PRIVATE },
      });

      expect(
        result.success,
        `Expected success but got: ${!result.success ? result.message : "ok"}`,
      ).toBe(true);
      if (!result.success) {
        return;
      }

      const systemPrompt = extractSystemPrompt(result.data);
      expect(
        systemPrompt,
        `System prompt must contain "**Instance ID:** hermes" — tool must execute ON hermes, not locally. Got: ${systemPrompt.slice(0, 200)}`,
      ).toContain("**Instance ID:** hermes");
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
      const result = await RouteExecuteRepository.runInProcessTyped({
        definition: systemPromptDebugDefinitions.GET,
        instanceId: HERMES_INSTANCE_ID,
        user: testUser,
        locale: defaultLocale,
        input: { rootFolderId: DefaultFolderId.PRIVATE },
      });

      expect(
        result.success,
        `Expected success but got: ${!result.success ? result.message : "ok"}`,
      ).toBe(true);
      if (!result.success) {
        return;
      }

      const systemPrompt = extractSystemPrompt(result.data);
      expect(
        systemPrompt,
        `System prompt must contain "**Instance ID:** hermes" — tool must execute ON hermes via reverse-WS. Got: ${systemPrompt.slice(0, 200)}`,
      ).toContain("**Instance ID:** hermes");
    },
    60_000,
  );
});
