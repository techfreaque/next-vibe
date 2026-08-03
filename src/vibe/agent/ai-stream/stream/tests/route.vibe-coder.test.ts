/**
 * AI Stream Integration - Vibe-Coder Skill (Direct, hermes-dev 3002)
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
 *   2. Override admin user's codingAgent setting to "next-vibe-coder"
 *   3. Create a stable vibe-coder favorite for the test user
 *   4. Run test steps
 *   5. Restore original codingAgent setting in afterAll
 */

import "server-only";

// AI SDK v2→v3 compat mode warning - provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

import { eq } from "drizzle-orm";
import { DefaultFolderId } from "../../../../core/execution-context";
import { chatSettings } from "../../../chat/settings/db";
import {
  ContentLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../../../skills/enum";
import { chatFavorites } from "../../../skills/favorites/db";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { identityEnv } from "next-vibe/identity/env";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ChatModelId } from "../../models";
import { seedCaseThread } from "../../testing/fixture-seed";
import {
  getOrCreateFolder,
  resolveUser,
  runTestStream,
  toolResultRecord,
} from "../../testing/headless-test-runner";

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
    } = await import("../../testing/remote-setup");

    const resolved = await resolveUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `Admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(
        `Admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
      );
    }
    testUser = resolved;

    // ── Create PRIVATE/tests/vibe-coder subfolder ──
    const testsParentId = await getOrCreateFolder(
      testUser,
      DefaultFolderId.PRIVATE,
      "tests",
    );
    vibeCoderFolderId = await getOrCreateFolder(
      testUser,
      DefaultFolderId.PRIVATE,
      "vibe-coder",
      testsParentId,
    );

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

    _prodUserId = await resolveProdUserId();
    const remoteAdminToken = await resolveProdAdminToken();
    // Only the hermes-side mapped user (_prodUserId) needs remote credits —
    // hermes executes atlas's calls as that user. testUser exists only in the
    // atlas DB; crediting it on hermes would hit the users FK and 404.
    await ensureRemoteUserCredits(
      "http://localhost:3002",
      remoteAdminToken,
      _prodUserId,
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
    const { threadId: fixtureThreadId, toolExecutionContext: fixtureCtx } =
      await seedCaseThread("vibe-coder-vc1");

    const { result, messages } = await runTestStream({
      user: testUser,
      prompt: `[VC1 vibe-coder-delegation] You need to do a small coding task: find out the name of the current working directory on this system. Delegate this task using the correct tool for coding work. End with STEP_OK once the result is back, or FAILED: <reason> if you didn't use the correct delegation tool or something went wrong.`,
      favoriteId: VIBE_CODER_FAVORITE_ID,
      rootFolderId: DefaultFolderId.PRIVATE,
      subFolderId: vibeCoderFolderId,
      // Two-level agent chain (Thea → ai-run sub-agent incl. a 30s shell-exec
      // window) legitimately takes 2-4 min on a live first recording.
      settleTimeoutMs: 240_000,
      threadId: fixtureThreadId,
      toolExecutionContext: fixtureCtx,
    });

    expect(
      result.success,
      `VC1 stream failed: ${!result.success ? result.message : ""}`,
    ).toBe(true);
    if (!result.success) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`VC1: ${result.message ?? "unexpected failure"}`);
    }

    // Strip <think>...</think> blocks before assertions - AI reasoning may contain
    // the words "FAILED" or "STEP_OK" while narrating the instructions, not as outcomes.
    const aiContent = (result.data.lastAiMessageContent ?? "").replaceAll(
      /<think>[\s\S]*?<\/think>/g,
      "",
    );

    // ── Assert ai-run was called ──
    // Thea may call ai-run directly OR route it through execute-tool
    // (toolName="execute-tool", args.toolName="ai-run", args.input=<ai-run args>).
    // Both are the same delegation — accept either shape.
    const toolMessages = messages.filter((m) => m.role === "tool");
    const toolNames = toolMessages
      .map((m) => {
        const name = m.toolCall?.toolName ?? "";
        const inner = toolResultRecord(m.toolCall?.args)?.["toolName"];
        return name === "execute-tool" && typeof inner === "string"
          ? `execute-tool→${inner}`
          : name;
      })
      .filter(Boolean);

    // Use the LAST matching call: a model may first attempt ai-run with bad
    // args (validation error), then retry correctly — the final call is the
    // delegation that actually ran.
    const aiRunMsg = toolMessages.findLast(
      (m) =>
        m.toolCall?.toolName === "ai-run" ||
        (m.toolCall?.toolName === "execute-tool" &&
          toolResultRecord(m.toolCall.args)?.["toolName"] === "ai-run"),
    );

    expect(
      aiRunMsg,
      `VC1: Expected Thea to call \`ai-run\` for coding delegation, but tool calls were: [${toolNames.join(", ")}].\n\nAI response:\n${aiContent}\n\nFix: update codingAgentSettingFragment in chat/settings/system-prompt.ts to clearly instruct Thea to use ai-run(skill="vibe-coder") when codingAgent=next-vibe-coder.`,
    ).toBeDefined();

    // ── Assert ai-run was called with vibe-coder skill ──
    if (aiRunMsg) {
      const outerArgs = toolResultRecord(aiRunMsg.toolCall?.args);
      // execute-tool wraps the target tool's args under `input`
      const argsRecord =
        aiRunMsg.toolCall?.toolName === "execute-tool"
          ? (toolResultRecord(outerArgs?.["input"]) ?? outerArgs)
          : outerArgs;
      const toolArgs: WidgetData = argsRecord;

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
  }, 360_000);

  // ── VC2: vibe-coder skill has SSH awareness ───────────────────────────────
  it("VC2: vibe-coder skill has ssh-exec available and provides SSH guidance when no connections exist", async () => {
    const { threadId: fixtureThreadId, toolExecutionContext: fixtureCtx } =
      await seedCaseThread("vibe-coder-vc2");

    const { result, messages } = await runTestStream({
      user: testUser,
      prompt: `[VC2 ssh-awareness] Using the vibe-coder skill directly: check what SSH connections are available using the appropriate tool. If there are no SSH connections, explain what the user needs to do and what the difference is between SSH connections and remote instances. End with STEP_OK if you found the answer (even if no connections exist), or FAILED: <reason> if you couldn't determine the SSH connection status.`,
      favoriteId: VIBE_CODER_FAVORITE_ID,
      rootFolderId: DefaultFolderId.PRIVATE,
      subFolderId: vibeCoderFolderId,
      threadId: fixtureThreadId,
      toolExecutionContext: fixtureCtx,
    });

    expect(
      result.success,
      `VC2 stream failed: ${!result.success ? result.message : ""}`,
    ).toBe(true);
    if (!result.success) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`VC2: ${result.message ?? "unexpected failure"}`);
    }

    // Strip <think>...</think> blocks before assertions - AI reasoning may contain
    // the words "FAILED" or "STEP_OK" while narrating the instructions, not as outcomes.
    const aiContent = (result.data.lastAiMessageContent ?? "").replaceAll(
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
