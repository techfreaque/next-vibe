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
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  getOrCreateFolder,
  resolveUserAndToken,
  runTestStream,
} from "@/app/api/[locale]/agent/ai-stream/testing/headless-test-runner";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import type { FavoriteConfig } from "@/app/api/[locale]/agent/chat/favorites/db";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import {
  instanceIdentities,
  remoteConnections,
} from "@/app/api/[locale]/remote-connection/db";
import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

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
const logger = createEndpointLogger(false, Date.now(), defaultLocale);

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
    .where(
      and(
        eq(instanceIdentities.userId, user.id),
        eq(instanceIdentities.isDefault, true),
      ),
    )
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
    isDefault: true, // makes getLocalInstanceId() return "headless-client"
  });

  // Register headless-client → atlas connection with a real JWT token.
  // remoteInstanceId=COMPUTER_NAME: atlas ws-provider uses this to store the thread
  // under BACKGROUND/headless-client and to find the peer connection row.
  const upsertResult = await RemoteConnectionRepository.upsertRemoteConnection({
    userId: user.id,
    instanceId: COMPUTER_NAME,
    remoteInstanceId: COMPUTER_NAME,
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
  //   toolSource=local     — tools + system prompt built locally (client's identity)
  //   threadMirrorMode=cloud — thread canonical copy on cloud (atlas ws-provider side)
  await db
    .update(remoteConnections)
    .set({
      threadMirrorMode: "cloud",
      loopLocation: "server",
      toolSource: "local",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(remoteConnections.userId, user.id),
        eq(remoteConnections.instanceId, COMPUTER_NAME),
        eq(remoteConnections.isReverseEntry, false),
      ),
    );
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
      isDefault: true,
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
  it("registers connection with correct mode settings including remoteInstanceId", async () => {
    const [conn] = await db
      .select({
        instanceId: remoteConnections.instanceId,
        remoteInstanceId: remoteConnections.remoteInstanceId,
        transportMode: remoteConnections.transportMode,
        threadMirrorMode: remoteConnections.threadMirrorMode,
        loopLocation: remoteConnections.loopLocation,
        toolSource: remoteConnections.toolSource,
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
    // remoteInstanceId makes the relay body carry the client's identity so the
    // ws-provider stores the thread as BACKGROUND/headless-client and the AI's
    // system prompt contains "Instance ID: headless-client".
    expect(conn?.remoteInstanceId, "remoteInstanceId must equal COMPUTER_NAME").toBe(COMPUTER_NAME);
    expect(conn?.transportMode).toBe("reverse-ws");
    expect(conn?.loopLocation, "loopLocation=server routes AI loop through relay").toBe("server");
    expect(conn?.toolSource, "toolSource=local means atlas builds system prompt with client identity").toBe("local");
    expect(conn?.threadMirrorMode, "cloud mirror: canonical thread on ws-provider side").toBe("cloud");
    expect(conn?.remoteUrl).toBe(ATLAS_URL);
  });

  it("selfInstanceId reported by remote-connection/list is headless-client", async () => {
    const listDef = (await import("@/app/api/[locale]/remote-connection/list/definition")).default;
    const result = await sendTestRequest({
      endpoint: listDef.GET,
      data: undefined,
      user,
    });
    expect(result.success, result.success ? "" : String(result.message)).toBe(true);
    // getLocalInstanceId() returns the isDefault=true row — must be headless-client
    // since beforeAll set it. This is the exact value injected into the AI system prompt.
    expect(result.data?.selfInstanceId, "selfInstanceId must be headless-client").toBe(COMPUTER_NAME);
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
  it("system prompt built for relay contains headless-client identity and not atlas", async () => {
    // Call the debug endpoint locally — this runs buildSystemPrompt() with the
    // current user's default identity (headless-client, set in beforeAll).
    // This is the exact system prompt that gets sent in the relay body.
    const systemPromptDebugDef = (
      await import("@/app/api/[locale]/agent/ai-stream/system-prompt/debug/definition")
    ).default;
    const debugResult = await sendTestRequest({
      endpoint: systemPromptDebugDef.GET,
      data: { rootFolderId: DefaultFolderId.BACKGROUND },
      user,
    });
    expect(
      debugResult.success,
      debugResult.success ? "" : String(debugResult.message),
    ).toBe(true);

    const systemPrompt =
      typeof debugResult.data?.systemPrompt === "string"
        ? debugResult.data.systemPrompt
        : "";
    expect(systemPrompt, "system prompt must not be empty").not.toBe("");

    // Must declare the client's identity — the exact line injected by loadRemoteInstancesData()
    expect(
      systemPrompt,
      `system prompt must contain "**Instance ID:** ${COMPUTER_NAME}" — got:\n${systemPrompt.slice(0, 500)}`,
    ).toContain(`**Instance ID:** ${COMPUTER_NAME}`);

    // The self-identity line must NOT say atlas — that would mean getLocalInstanceId()
    // returned the wrong value. "atlas" may appear elsewhere (known instances list) but
    // the "**Instance ID:**" line must point to COMPUTER_NAME only.
    const instanceIdLine = systemPrompt
      .split("\n")
      .find((l) => l.includes("**Instance ID:**"));
    expect(
      instanceIdLine,
      `"**Instance ID:**" line must exist in system prompt`,
    ).toBeDefined();
    expect(
      instanceIdLine,
      `"**Instance ID:**" line must not contain "atlas" — got: "${instanceIdLine}"`,
    ).not.toMatch(/\batlas\b/i);
  });

  it("AI stream via REMOTE folder succeeds and returns messages", async () => {
    const subFolderId = await getTestFolder("stream-check");

    const { result, messages } = await runTestStream({
      prompt: "Reply with exactly: OK",
      user,
      rootFolderId: DefaultFolderId.REMOTE,
      subFolderId,
      favoriteConfig: TEST_FAVORITE,
    });

    expect(result.success, result.success ? "" : result.message).toBe(true);

    const userMsgs = messages.filter((m) => !m.isAI && m.role === "user");
    expect(userMsgs.length, "must have at least 1 user message in thread").toBeGreaterThan(0);

    const aiReplies = messages.filter((m) => m.isAI && m.role === "assistant" && m.content);
    expect(aiReplies.length, "must have at least 1 assistant message with content").toBeGreaterThan(0);
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

    const threadId = result.data?.threadId;
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
    expect(localRow?.rootFolderId, "thread must be in REMOTE root, not BACKGROUND").toBe(DefaultFolderId.REMOTE);
    expect(localRow?.folderId, "thread must be in the test subfolder").toBe(subFolderId);

    // Only one thread row with this ID — relay must not have created a duplicate
    const allRows = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    expect(allRows.length, "thread must not be duplicated in local DB").toBe(1);

    // Thread must have messages (user + assistant) — proves relay completed
    expect(messages.length, "thread must contain messages after relay").toBeGreaterThan(1);
    const assistantMsgs = messages.filter((m) => m.isAI && m.role === "assistant");
    expect(assistantMsgs.length, "must have at least 1 assistant message").toBeGreaterThan(0);
  }, 90_000);

  it("atlas log has no new errors or warnings", () => {
    let logContent: string;
    try {
      logContent = readFileSync(".tmp/.atlas.log", "utf8");
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") {
        // oxlint-disable-next-line restricted-syntax -- dev server must be running for these tests
        throw new Error(
          "atlas log file .tmp/.atlas.log not found — dev server must be running (vibe dev)", { cause: e },
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
