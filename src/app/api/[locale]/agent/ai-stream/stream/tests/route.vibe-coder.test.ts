/**
 * AI Stream Integration - Vibe-Coder Skill (Direct, hermes 3001)
 *
 * Tests that when `codingAgent = "next-vibe-coder"` is set in chat settings,
 * Thea correctly delegates coding tasks using `ai-run` with the `vibe-coder` skill.
 *
 * This test is an improvement loop driver:
 * - Deliberately asserts on high-level behavior (correct tool used, skill invoked)
 * - Failure messages carry enough context to know exactly what to fix in prompt fragments
 * - Run it, read the failure, fix the fragment, repeat until green
 *
 * Setup mirrors route.direct.test.ts:
 *   1. connectToHermes → registers atlas on hermes, syncs capabilities
 *   2. triggerPull → populates capabilities before tests run
 *   3. Override admin user's codingAgent setting to "next-vibe-coder"
 *   4. Create a stable vibe-coder favorite for the test user
 *   5. Run test steps
 *   6. Restore original codingAgent setting in afterAll
 */

import "server-only";

// AI SDK v2→v3 compat mode warning - provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import { chatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import {
  ContentLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { eq } from "drizzle-orm";

import { env } from "@/config/env";
import { ChatModelId } from "../../models";
import { setFetchCacheContext } from "../../testing/fetch-cache";
import { getOrCreateFolder, resolveUser, runTestStream } from "../../testing/headless-test-runner";

const VIBE_CODER_FAVORITE_ID = "00000000-0000-4010-a000-000000000001";

let _prodUserId: string | null = null;
let _savedCodingAgent: "claude-code" | "open-code" | "next-vibe-coder" | null =
  null;

describe("AI Stream Integration - Vibe-Coder Skill (direct, next-vibe-coder setting)", () => {
  let testUser: JwtPrivatePayloadType;
  let vibeCoderFolderId: string;

  beforeAll(async () => {
    const {
      connectToHermes,
      disconnectFromHermes,
      ensureRemoteUserCredits,
      resolveProdAdminToken,
      resolveProdUserId,
      triggerPull,
    } = await import("../../testing/remote-setup");

    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `Admin user ${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;

    // ── Create BACKGROUND/tests/vibe-coder subfolder ──
    const testsParentId = await getOrCreateFolder(testUser, DefaultFolderId.BACKGROUND, "tests");
    vibeCoderFolderId = await getOrCreateFolder(testUser, DefaultFolderId.BACKGROUND, "vibe-coder", testsParentId);

    // ── Save current codingAgent setting ──
    const [existing] = await db
      .select({ codingAgent: chatSettings.codingAgent })
      .from(chatSettings)
      .where(eq(chatSettings.userId, testUser.id))
      .limit(1);
    _savedCodingAgent = existing?.codingAgent ?? null;

    // ── Override to next-vibe-coder ──
    await db
      .insert(chatSettings)
      .values({ userId: testUser.id, codingAgent: "next-vibe-coder" })
      .onConflictDoUpdate({
        target: chatSettings.userId,
        set: { codingAgent: "next-vibe-coder" },
      });

    // ── Create stable vibe-coder favorite ──
    await db
      .insert(chatFavorites)
      .values({
        id: VIBE_CODER_FAVORITE_ID,
        userId: testUser.id,
        slug: "test-vibe-coder",
        skillId: "vibe-coder",
        variantId: "budget",
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ChatModelId.KIMI_K2_6,
          sortBy: ModelSortField.INTELLIGENCE,
          sortDirection: ModelSortDirection.DESC,
          contentRange: { min: ContentLevel.OPEN, max: ContentLevel.OPEN },
        },
        position: 9997,
      })
      .onConflictDoUpdate({
        target: chatFavorites.id,
        set: {
          userId: testUser.id,
          skillId: "vibe-coder",
          variantId: "budget",
        },
      });

    // ── Connect to hermes (direct mode) ──
    await disconnectFromHermes(testUser.id);
    await connectToHermes(testUser);
    await triggerPull();

    _prodUserId = await resolveProdUserId();
    const remoteAdminToken = await resolveProdAdminToken();
    await ensureRemoteUserCredits(
      "http://localhost:3002",
      remoteAdminToken,
      _prodUserId,
      5000,
    );
    await ensureRemoteUserCredits(
      "http://localhost:3002",
      remoteAdminToken,
      testUser.id,
      5000,
    );
  }, 120_000);

  afterAll(async () => {
    const { disconnectFromHermes, unregisterDevFromHermes } =
      await import("../../testing/remote-setup");

    // ── Restore original codingAgent setting ──
    await db
      .update(chatSettings)
      .set({ codingAgent: _savedCodingAgent ?? null })
      .where(eq(chatSettings.userId, testUser.id));

    const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
    if (_prodUserId) {
      tasks.push(unregisterDevFromHermes(_prodUserId));
    }
    await Promise.all(tasks);
    _prodUserId = null;
  });

  // ── VC1: Thea uses ai-run with vibe-coder skill ──────────────────────────
  it("VC1: when codingAgent=next-vibe-coder, Thea delegates coding tasks via ai-run(skill=vibe-coder)", async () => {
    setFetchCacheContext("vibe-coder-vc1");

    const { result, messages } = await runTestStream({
      user: testUser,
      prompt: `[VC1 vibe-coder-delegation] You need to do a small coding task: find out what the current NODE_ENV is on this system. Delegate this task using the correct tool for coding work. End with STEP_OK once the result is back, or FAILED: <reason> if you didn't use the correct delegation tool or something went wrong.`,
      favoriteId: VIBE_CODER_FAVORITE_ID,
      rootFolderId: DefaultFolderId.BACKGROUND,
      subFolderId: vibeCoderFolderId,
    });

    expect(
      result.success,
      `VC1 stream failed: ${!result.success ? result.message : ""}`,
    ).toBe(true);
    if (!result.success) {
      return;
    }

    // Strip <think>...</think> blocks before assertions - AI reasoning may contain
    // the words "FAILED" or "STEP_OK" while narrating the instructions, not as outcomes.
    const aiContent = (result.data.lastAiMessageContent ?? "").replace(
      /<think>[\s\S]*?<\/think>/g,
      "",
    );

    // ── Assert ai-run was called ──
    const toolMessages = messages.filter((m) => m.role === "tool");
    const toolNames = toolMessages
      .map((m) => m.toolCall?.toolName ?? "")
      .filter(Boolean);

    const aiRunMsg = toolMessages.find(
      (m) => m.toolCall?.toolName === "ai-run",
    );

    expect(
      aiRunMsg,
      `VC1: Expected Thea to call \`ai-run\` for coding delegation, but tool calls were: [${toolNames.join(", ")}].\n\nAI response:\n${aiContent}\n\nFix: update codingAgentSettingFragment in chat/settings/system-prompt/prompt.ts to clearly instruct Thea to use ai-run(skill="vibe-coder") when codingAgent=next-vibe-coder.`,
    ).toBeDefined();

    // ── Assert ai-run was called with vibe-coder skill ──
    if (aiRunMsg) {
      const toolArgs: WidgetData = aiRunMsg.toolCall?.args;
      const argsRecord =
        toolArgs !== null &&
        toolArgs !== undefined &&
        typeof toolArgs === "object" &&
        !Array.isArray(toolArgs)
          ? (toolArgs as Record<string, WidgetData>)
          : null;

      const skillArg = argsRecord?.skill ?? argsRecord?.skillId;
      expect(
        skillArg,
        `VC1: ai-run was called but skill argument was "${String(skillArg)}" instead of "vibe-coder".\n\nFull tool args: ${JSON.stringify(toolArgs)}\n\nFix: codingAgentSettingFragment must specify skill="vibe-coder" in the call pattern.`,
      ).toBe("vibe-coder");

      const promptArg = argsRecord?.prompt;
      expect(
        typeof promptArg === "string" && promptArg.trim().length > 0,
        `VC1: ai-run was called with vibe-coder skill but prompt was empty.\n\nFull tool args: ${JSON.stringify(toolArgs)}\n\nFix: Thea must pass the full task description as the prompt.`,
      ).toBe(true);
    }

    // ── Assert final response contains STEP_OK ──
    expect(
      aiContent.includes("FAILED"),
      `VC1: AI response contains FAILED.\n\nReason:\n${aiContent}`,
    ).toBe(false);

    expect(
      aiContent.includes("STEP_OK"),
      `VC1: AI did not confirm STEP_OK.\n\nAI response:\n${aiContent}`,
    ).toBe(true);
  }, 180_000);

  // ── VC2: vibe-coder skill has SSH awareness ───────────────────────────────
  it("VC2: vibe-coder skill has ssh-exec available and provides SSH guidance when no connections exist", async () => {
    setFetchCacheContext("vibe-coder-vc2");

    const { result, messages } = await runTestStream({
      user: testUser,
      prompt: `[VC2 ssh-awareness] Using the vibe-coder skill directly: check what SSH connections are available using the appropriate tool. If there are no SSH connections, explain what the user needs to do and what the difference is between SSH connections and remote instances. End with STEP_OK if you found the answer (even if no connections exist), or FAILED: <reason> if you couldn't determine the SSH connection status.`,
      favoriteId: VIBE_CODER_FAVORITE_ID,
      rootFolderId: DefaultFolderId.BACKGROUND,
      subFolderId: vibeCoderFolderId,
    });

    expect(
      result.success,
      `VC2 stream failed: ${!result.success ? result.message : ""}`,
    ).toBe(true);
    if (!result.success) {
      return;
    }

    // Strip <think>...</think> blocks before assertions - AI reasoning may contain
    // the words "FAILED" or "STEP_OK" while narrating the instructions, not as outcomes.
    const aiContent = (result.data.lastAiMessageContent ?? "").replace(
      /<think>[\s\S]*?<\/think>/g,
      "",
    );

    // ── Assert SSH was addressed ──
    const toolMessages = messages.filter((m) => m.role === "tool");
    const toolNames = toolMessages
      .map((m) => m.toolCall?.toolName ?? "")
      .filter(Boolean);

    const sshToolCalled = toolNames.some((name) => name.includes("ssh"));
    const toolHelpCalled = toolNames.some((name) => name === "tool-help");
    const sshMentionedInResponse =
      aiContent.toLowerCase().includes("ssh") ||
      aiContent.toLowerCase().includes("connection");

    // The AI should either call an SSH tool, use tool-help to discover SSH, or at minimum address SSH in response
    expect(
      sshToolCalled || toolHelpCalled || sshMentionedInResponse,
      `VC2: Expected AI to call an SSH tool, tool-help, or at least mention SSH/connections in response.\n\nTools called: [${toolNames.join(", ")}]\n\nAI response:\n${aiContent}\n\nFix: ensure ssh-exec is in vibe-coder's availableTools and PROJECT_INSTRUCTIONS SSH section guides the AI to use it.`,
    ).toBe(true);

    // ── Assert STEP_OK ──
    expect(
      aiContent.includes("FAILED"),
      `VC2: AI response contains FAILED.\n\nReason:\n${aiContent}`,
    ).toBe(false);

    expect(
      aiContent.includes("STEP_OK"),
      `VC2: AI did not confirm STEP_OK.\n\nAI response:\n${aiContent}`,
    ).toBe(true);
  }, 180_000);
});
