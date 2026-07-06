/**
 * Headless Client Integration Tests
 *
 * The headless client connects outbound to atlas (the cloud). Atlas routes AI
 * streams targeting REMOTE/headless-client/... back to the connection via the
 * ws-provider, which runs the AI loop as "headless-client". The client's identity
 * is visible in the AI's system prompt (Instance ID: headless-client).
 *
 * Assertions:
 *   - Connection registers as "headless-client" with correct mode settings
 *   - Thread folder remote/headless-client/tests/<case> is created
 *   - AI stream routed via REMOTE folder succeeds
 *   - AI reports its own instance ID as "headless-client" (not atlas)
 *   - System prompt lists "headless-client" as the connected instance
 *   - Thread stored under REMOTE folder (relay copy) — not duplicated locally
 *   - Atlas log stays clean (no new errors/warnings)
 */

import "server-only";

import { readFileSync } from "node:fs";

import { and, eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  getOrCreateFolder,
  resolveUserAndToken,
  runTestStream,
} from "@/app/api/[locale]/agent/ai-stream/testing/headless-test-runner";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/skills/constants";
import { ModelSelectionType } from "@/app/api/[locale]/agent/skills/enum";
import type { FavoriteConfig } from "@/app/api/[locale]/agent/skills/favorites/db";
import {
  instanceIdentities,
  remoteConnections,
} from "@/app/api/[locale]/remote-connection/db";
import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";
import { env } from "@/config/env";

// ─── Constants ───────────────────────────────────────────────────────────────

const ATLAS_URL = "http://localhost:3000";
const COMPUTER_NAME = "headless-client"; // fixed dev name, matches repository.ts

const TEST_FAVORITE: FavoriteConfig = {
  id: "headless-test-fav",
  skillId: NO_SKILL_ID,
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ChatModelId.CLAUDE_HAIKU_4_5,
  },
  voiceModelSelection: null,
  sttModelSelection: null,
  imageVisionModelSelection: null,
  videoVisionModelSelection: null,
  audioVisionModelSelection: null,
  imageGenModelSelection: null,
  musicGenModelSelection: null,
  videoGenModelSelection: null,
  availableTools: null,
  pinnedTools: null,
  deniedTools: null,
  compactTrigger: null,
  promptAppend: null,
  memoryLimit: null,
};

// ─── State ───────────────────────────────────────────────────────────────────

let user: JwtPrivatePayloadType;
let logLineCountBefore: number;
let previousDefaultInstanceId: string | undefined;
const logger = createEndpointLogger(false, defaultLocale);

// ─── Setup / Teardown ────────────────────────────────────────────────────────

beforeAll(async () => {
  const resolved = await resolveUserAndToken(env.VIBE_ADMIN_USER_EMAIL);
  if (!resolved) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "headless-client tests: could not resolve admin user — check VIBE_ADMIN_USER_EMAIL",
    );
  }
  user = resolved.user;
  const jwtToken = resolved.token;

  // Snapshot atlas log line count to detect new errors introduced by the test
  try {
    const logContent = readFileSync(".tmp/.atlas.log", "utf8");
    logLineCountBefore = logContent.split("\n").length;
  } catch {
    logLineCountBefore = 0;
  }

  // Save the user's current default instance identity so we can restore it in afterAll
  const [existingDefault] = await db
    .select({ instanceId: instanceIdentities.instanceId })
    .from(instanceIdentities)
    .where(and(eq(instanceIdentities.userId, user.id)))
    .limit(1);
  previousDefaultInstanceId = existingDefault?.instanceId;

  // Ensure sufficient credits for AI stream calls during this test suite
  const creditsDefinition = (
    await import("@/app/api/[locale]/credits/admin-add/definition")
  ).default;
  await sendTestRequest({
    endpoint: creditsDefinition.POST,
    data: { targetUserId: user.id, amount: 100 },
    user,
  });

  // Set "headless-client" as the default identity for this user.
  // getLocalInstanceId() returns this → AI system prompt shows "Instance ID: headless-client"
  // when the ws-provider runs the AI loop on behalf of this connection.
  await RemoteConnectionRepository.upsertInstanceIdentity({
    userId: user.id,
    instanceId: COMPUTER_NAME,
  });

  // Register headless-client → atlas connection with a real JWT token.
  const upsertResult = await RemoteConnectionRepository.upsertRemoteConnection({
    userId: user.id,
    instanceId: COMPUTER_NAME,
    remoteUrl: ATLAS_URL,
    token: jwtToken,
    leadId: user.leadId,
    transportMode: "reverse-ws",
    isReverseEntry: false,
    logger,
  });
  if (!upsertResult.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `headless-client tests: failed to upsert connection: ${upsertResult.message}`,
    );
  }

  // Connection mode:
  //   loopLocation=server  — relay to the connection (headless-client runs the AI loop)
  // Connection-level threadMirrorMode/loopLocation/toolSource were write-only
  // dead config and are gone: loop location is a per-thread/per-stream
  // property (loopInstanceId), tools + prompt are always client-owned.
}, 30_000);

afterAll(async () => {
  if (!user) {
    return;
  }

  // Remove connection row
  await db
    .delete(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, user.id),
        eq(remoteConnections.instanceId, COMPUTER_NAME),
      ),
    );

  // Remove headless-client identity record
  await db
    .delete(instanceIdentities)
    .where(
      and(
        eq(instanceIdentities.userId, user.id),
        eq(instanceIdentities.instanceId, COMPUTER_NAME),
      ),
    );

  // Restore previous default instance identity if there was one
  if (previousDefaultInstanceId) {
    await RemoteConnectionRepository.upsertInstanceIdentity({
      userId: user.id,
      instanceId: previousDefaultInstanceId,
    });
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getTestFolder(testCaseName: string): Promise<string> {
  const computerFolderId = await getOrCreateFolder(
    user,
    DefaultFolderId.REMOTE,
    COMPUTER_NAME,
    null,
  );
  const testsFolderId = await getOrCreateFolder(
    user,
    DefaultFolderId.REMOTE,
    "tests",
    computerFolderId,
  );
  return getOrCreateFolder(
    user,
    DefaultFolderId.REMOTE,
    testCaseName,
    testsFolderId,
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("headless-client connection registration", () => {
  it("registers connection with correct mode settings", async () => {
    const [conn] = await db
      .select({
        instanceId: remoteConnections.instanceId,
        transportMode: remoteConnections.transportMode,
        remoteUrl: remoteConnections.remoteUrl,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, COMPUTER_NAME),
          eq(remoteConnections.isReverseEntry, false),
        ),
      )
      .limit(1);

    expect(conn, "connection row must exist").toBeDefined();
    expect(conn?.instanceId).toBe(COMPUTER_NAME);
    expect(conn?.transportMode).toBe("reverse-ws");
    expect(conn?.remoteUrl).toBe(ATLAS_URL);
  });

  it("selfInstanceId reported by remote-connection/list is headless-client", async () => {
    const listDef = (
      await import("@/app/api/[locale]/remote-connection/list/definition")
    ).default;
    const result = await sendTestRequest({
      endpoint: listDef.GET,
      data: {},
      user,
    });
    expect(result.success, result.success ? "" : String(result.message)).toBe(
      true,
    );
    // getLocalInstanceId() returns the isDefault=true row — must be headless-client
    // since beforeAll set it. This is the exact value injected into the AI system prompt.
    expect(
      result.success ? result.data.selfInstanceId : undefined,
      "selfInstanceId must be headless-client",
    ).toBe(COMPUTER_NAME);
  });
});

describe("headless-client thread folder creation", () => {
  it("creates remote/headless-client/tests/<case> hierarchy", async () => {
    const subFolderId = await getTestFolder("folder-creation");
    expect(typeof subFolderId).toBe("string");
    expect(subFolderId.length).toBeGreaterThan(0);
  });

  it("getTestFolder is idempotent", async () => {
    const id1 = await getTestFolder("idempotent-check");
    const id2 = await getTestFolder("idempotent-check");
    expect(id1).toBe(id2);
  });
});

describe("headless-client AI stream via REMOTE folder", () => {
  it("AI stream through relay: system prompt has headless-client identity, not atlas", async () => {
    // End-to-end: run the AI through the REMOTE folder relay and ask it to output
    // its own System Context section verbatim. Assert on what it actually received —
    // not a local debug call, not prose parsing. The relay must have sent the system
    // prompt built with headless-client identity or this fails.
    const subFolderId = await getTestFolder("system-prompt-check");

    const { result, messages } = await runTestStream({
      prompt:
        "Output the entire '## System Context' section from your system prompt verbatim. " +
        "No commentary, no markdown changes — copy it exactly as-is.",
      user,
      rootFolderId: DefaultFolderId.REMOTE,
      subFolderId,
      favoriteConfig: TEST_FAVORITE,
    });

    expect(result.success, result.success ? "" : result.message).toBe(true);

    const aiReplies = messages.filter(
      (m) => m.isAI && m.role === "assistant" && m.content,
    );
    expect(
      aiReplies.length,
      "relay must produce at least 1 assistant message",
    ).toBeGreaterThan(0);

    const reply = aiReplies.at(-1)?.content ?? "";
    expect(reply, "assistant reply must not be empty").not.toBe("");

    // The AI copied its own system prompt — assert the identity line directly
    const instanceIdLine = reply
      .split("\n")
      .find((l) => l.includes("**Instance ID:**"));
    expect(
      instanceIdLine,
      `"**Instance ID:**" line not found in AI reply. Full reply:\n${reply}`,
    ).toBeDefined();
    expect(
      instanceIdLine,
      `Identity line must say "${COMPUTER_NAME}", got: "${instanceIdLine}"`,
    ).toContain(COMPUTER_NAME);
    expect(
      instanceIdLine,
      `Identity line must not contain "atlas" — relay sent wrong system prompt. Got: "${instanceIdLine}"`,
    ).not.toMatch(/\batlas\b/i);
  }, 90_000);

  it("thread stored in REMOTE folder, not duplicated", async () => {
    const subFolderId = await getTestFolder("storage-check");

    const { result, messages } = await runTestStream({
      prompt: "Reply with: STORED",
      user,
      rootFolderId: DefaultFolderId.REMOTE,
      subFolderId,
      favoriteConfig: TEST_FAVORITE,
    });

    expect(result.success, result.success ? "" : result.message).toBe(true);

    const threadId = result.success ? result.data.threadId : undefined;
    expect(threadId, "stream must return a threadId").toBeTruthy();
    if (!threadId) {
      // oxlint-disable-next-line restricted-syntax -- unreachable after expect, keeps TS happy
      throw new Error("threadId missing");
    }

    // Local relay copy must be in REMOTE root under the test subfolder
    const [localRow] = await db
      .select({
        rootFolderId: chatThreads.rootFolderId,
        folderId: chatThreads.folderId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    expect(localRow, "thread row must exist in local DB").toBeDefined();
    expect(
      localRow?.rootFolderId,
      "thread must be in REMOTE root, not BACKGROUND",
    ).toBe(DefaultFolderId.REMOTE);
    expect(localRow?.folderId, "thread must be in the test subfolder").toBe(
      subFolderId,
    );

    // Only one thread row with this ID — relay must not have created a duplicate
    const allRows = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    expect(allRows.length, "thread must not be duplicated in local DB").toBe(1);

    // Thread must have messages (user + assistant) — proves relay completed
    expect(
      messages.length,
      "thread must contain messages after relay",
    ).toBeGreaterThan(1);
    const assistantMsgs = messages.filter(
      (m) => m.isAI && m.role === "assistant",
    );
    expect(
      assistantMsgs.length,
      "must have at least 1 assistant message",
    ).toBeGreaterThan(0);
  }, 90_000);

  it("atlas log has no new errors or warnings", () => {
    let logContent: string;
    try {
      logContent = readFileSync(".tmp/.atlas.log", "utf8");
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") {
        // oxlint-disable-next-line restricted-syntax -- dev server must be running for these tests
        throw new Error(
          "atlas log file .tmp/.atlas.log not found — dev server must be running (vibe dev)",
          { cause: e },
        );
      }
      // oxlint-disable-next-line restricted-syntax -- re-throw unexpected read errors
      throw e;
    }
    const newLines = logContent.split("\n").slice(logLineCountBefore);
    const errorLines = newLines.filter(
      (l) => l.includes('"level":"error"') || l.includes('"level":"warn"'),
    );
    expect(
      errorLines,
      `New error/warn lines in atlas log:\n${errorLines.join("\n")}`,
    ).toHaveLength(0);
  });
});
