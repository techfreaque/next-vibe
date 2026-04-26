/**
 * Skill Creator End-to-End Test Suite
 *
 * Tests the full delegation chain end-to-end:
 *   SC1 - Delegation flow: Thea receives request → delegates to skill-creator via ai-run
 *         → skill-creator calls tool-help to get schemas → creates skill + favorite in one shot
 *   SC2 - Verify skill: correct fields, icon, category, model selection returned by getSkillById
 *   SC3 - Verify favorite: appears in getFavorites list, correct skillId, model resolves correctly
 *
 * The outer layer (Thea) tests real delegation. The inner layer (skill-creator sub-agent)
 * tests that tool-help → skill-create → favorite-create works without retries or schema confusion.
 *
 * Cleanup: test skills/favorites from PREVIOUS runs are deleted BEFORE each run (not after),
 * so you can always inspect the most recent run's data in the app.
 *
 * Cache: fixtures/http-cache/skill-creator-{test-name}/
 * Cache bust: delete fixtures/http-cache/skill-creator-{test-name}/
 */

import "server-only";

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { beforeAll, describe, expect, it } from "vitest";

import { and, eq, ilike } from "drizzle-orm";

import { resolveFavorite } from "@/app/api/[locale]/agent/ai-stream/repository/headless";
import { setFetchCacheContext } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import {
  fetchThreadMessages,
  runTestStream,
  toolResultRecord,
} from "@/app/api/[locale]/agent/ai-stream/testing/headless-test-runner";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { scopedTranslation as favoritesScopedTranslation } from "@/app/api/[locale]/agent/chat/favorites/i18n";
import { ChatFavoritesRepository } from "@/app/api/[locale]/agent/chat/favorites/repository";
import { customSkills } from "@/app/api/[locale]/agent/chat/skills/db";
import {
  ContentLevel,
  IntelligenceLevel,
  SkillCategory,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { SkillsRepository } from "@/app/api/[locale]/agent/chat/skills/repository";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

// ── Constants ─────────────────────────────────────────────────────────────────

const TEST_TIMEOUT = 180_000;

/**
 * The skill the AI will create. Fully specified so we can assert exact values.
 * Prefix is unique enough to identify test-created skills for cleanup.
 */
const TEST_SKILL_NAME = "Test Chef Bot";
const TEST_SKILL_NAME_LIKE = "Test Chef%"; // prefix used for cleanup query
const TEST_SKILL_CATEGORY_EXPECTED = SkillCategory.ASSISTANT;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return {
    isPublic: false,
    id: user.id,
    leadId: link.leadId,
    roles,
  };
}

/**
 * Delete any test skills (and cascade-delete their favorites) created by this
 * user whose name matches the test prefix. Called BEFORE each run so you can
 * always inspect the latest run's data in the app - but don't accumulate garbage.
 */
async function cleanupPreviousTestRuns(userId: string): Promise<void> {
  // Find all test-created skills for this user
  const staleSkills = await db
    .select({ id: customSkills.id })
    .from(customSkills)
    .where(
      and(
        eq(customSkills.userId, userId),
        ilike(customSkills.name, TEST_SKILL_NAME_LIKE),
      ),
    );

  if (staleSkills.length === 0) {
    return;
  }

  const staleIds = staleSkills.map((s) => s.id);

  // Delete favorites referencing these skills first (no FK cascade on skillId)
  for (const id of staleIds) {
    await db
      .delete(chatFavorites)
      .where(
        and(eq(chatFavorites.userId, userId), eq(chatFavorites.skillId, id)),
      );
  }

  // Also delete favorites with slug-based skillId references (from slug-returning create)
  await db
    .delete(chatFavorites)
    .where(
      and(
        eq(chatFavorites.userId, userId),
        ilike(chatFavorites.skillId, "test-chef%"),
      ),
    );

  // Delete skills (FK cascade deletes votes/reports)
  for (const id of staleIds) {
    await db
      .delete(customSkills)
      .where(and(eq(customSkills.id, id), eq(customSkills.userId, userId)));
  }
}

// ── Module-level helpers ──────────────────────────────────────────────────────

type ThreadMessage = Awaited<ReturnType<typeof fetchThreadMessages>>[0];

/**
 * Resolve the effective tool name from a thread message.
 * When skill-creator uses execute-tool (pinned), the actual tool name is
 * in args.toolName. Direct calls use toolCall.toolName directly.
 */
function effectiveToolName(m: ThreadMessage): string {
  const tc = m.toolCall;
  if (!tc) {
    return "";
  }
  if (
    tc.toolName === "execute-tool" &&
    tc.args &&
    typeof tc.args === "object" &&
    !Array.isArray(tc.args) &&
    typeof (tc.args as Record<string, string>)["toolName"] === "string"
  ) {
    return (tc.args as Record<string, string>)["toolName"];
  }
  return tc.toolName ?? "";
}

/**
 * Unwrap the execute-tool wrapper layer from a tool call result.
 * execute-tool nests the actual response as {result: <actual>}.
 */
function unwrapExecuteToolResult(
  raw: WidgetData | undefined,
): Record<string, WidgetData> | null {
  const outer = toolResultRecord(raw);
  if (!outer) {
    return null;
  }
  const inner = outer["result"];
  if (
    inner !== null &&
    inner !== undefined &&
    typeof inner === "object" &&
    !Array.isArray(inner)
  ) {
    return inner as Record<string, WidgetData>;
  }
  return outer;
}

// ── Test Suite ────────────────────────────────────────────────────────────────

describe("Skill Creator E2E", () => {
  let testUser: JwtPrivatePayloadType;

  /** Populated by SC1, used in SC2-SC3 */
  let createdSkillId: string | null = null;
  let createdFavoriteId: string | null = null;

  // ── Setup ────────────────────────────────────────────────────────────────

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;

    // Clean up any stale test data from previous runs BEFORE starting
    await cleanupPreviousTestRuns(testUser.id);
  }, TEST_TIMEOUT);

  // ── SC1: Delegation flow ──────────────────────────────────────────────────
  //
  // The outer AI (Thea default) receives the request and delegates to
  // skill-creator via ai-run. The skill-creator sub-agent must:
  //   1. Call tool-help to get skill-create + favorite-create schemas (one batch call)
  //   2. Call skill-create exactly once with no validation errors
  //   3. Call favorite-create exactly once immediately after
  // The test asserts the full chain: outer ai-run call + inner tool calls.

  it(
    "SC1: Thea delegates to skill-creator via ai-run → tool-help → skill-create → favorite-create (no retries)",
    async () => {
      setFetchCacheContext("skill-creator-sc1-create");

      /**
       * Prompt is sent to Thea (default skill). Thea should delegate to
       * skill-creator via ai-run. The sub-agent then runs the create flow.
       *
       * We instruct Thea explicitly to use skill-creator and evaluate
       * the full delegation chain for UX quality.
       */
      const prompt = `[TEST] Create a new skill for me with these parameters:
name: ${TEST_SKILL_NAME}
tagline: Cooks up anything you crave
description: A friendly sous-chef for everyday cooking questions
category: enums.category.assistant
icon: chef
systemPrompt: You are Chef Bot, a friendly cooking assistant. Answer cooking questions concisely and confidently.
modelSelection: filter-based, smart to brilliant intelligence, mainstream content only
isPublic: false

When done, end with [TEST:PASS] on success or [TEST:FAIL: <reason>] on failure.`;

      const { result, messages } = await runTestStream({
        prompt,
        user: testUser,
        skill: "thea",
      });

      // eslint-disable-next-line no-console
      console.log(
        "[SC1 DEBUG] result:",
        JSON.stringify({
          success: result.success,
          ...(result.success
            ? { threadId: result.data.threadId }
            : { message: (result as { message?: string }).message }),
        }),
      );
      // eslint-disable-next-line no-console
      console.log(
        "[SC1 DEBUG] Thea messages:",
        messages.map((m) => ({
          role: m.role,
          toolName: m.toolCall?.toolName,
          hasResult: !!m.toolCall?.result,
          content: (m.content ?? "").slice(0, 50),
        })),
      );

      expect(result.success, `Stream failed: ${JSON.stringify(result)}`).toBe(
        true,
      );
      if (!result.success) {
        return;
      }

      // ── Assert Thea called ai-run exactly once ──
      const toolMessages = messages.filter((m) => m.role === "tool");
      const aiRunCalls = toolMessages.filter(
        (m) => m.toolCall?.toolName === "ai-run",
      );
      expect(
        aiRunCalls.length,
        `Expected exactly 1 ai-run call from Thea, got ${String(aiRunCalls.length)}`,
      ).toBe(1);

      // ── Extract sub-agent thread ID from ai-run result ──
      const aiRunResult = toolResultRecord(aiRunCalls[0]?.toolCall?.result);
      // eslint-disable-next-line no-console
      console.log(
        "[SC1 DEBUG] ai-run result:",
        JSON.stringify(aiRunResult).slice(0, 200),
      );
      const subThreadId =
        typeof aiRunResult?.["threadId"] === "string"
          ? aiRunResult["threadId"]
          : null;

      expect(
        subThreadId,
        "ai-run result missing threadId - cannot inspect sub-agent thread",
      ).toBeTruthy();

      // ── Assert Thea did NOT call skill-create or favorite-create directly ──
      // Thea must delegate via ai-run, not attempt to create skills herself
      const theaToolNames = toolMessages.map((m) => m.toolCall?.toolName ?? "");
      expect(
        theaToolNames.includes("skill-create"),
        "Thea must NOT call skill-create directly - must delegate to skill-creator via ai-run",
      ).toBe(false);
      expect(
        theaToolNames.includes("favorite-create"),
        "Thea must NOT call favorite-create directly - must delegate to skill-creator via ai-run",
      ).toBe(false);

      // ── Fetch sub-agent thread and assert tool call sequence ──
      if (subThreadId) {
        const subMessages = await fetchThreadMessages(subThreadId);
        // eslint-disable-next-line no-console
        console.log(
          "[SC1 DEBUG] subAgent messages:",
          subMessages.map((m) => ({
            role: m.role,
            toolName: m.toolCall?.toolName,
            hasResult: !!m.toolCall?.result,
            resultPreview: JSON.stringify(m.toolCall?.result ?? null).slice(
              0,
              100,
            ),
            content: (m.content ?? "").slice(0, 50),
          })),
        );
        const subToolMessages = subMessages.filter((m) => m.role === "tool");
        const subToolNames = subToolMessages.map(effectiveToolName);

        // tool-help must be called before skill-create (schema-first discipline)
        const toolHelpCalls = subToolMessages.filter(
          (m) => effectiveToolName(m) === "tool-help",
        );
        expect(
          toolHelpCalls.length,
          `skill-creator must call tool-help at least once to get schemas, got ${String(toolHelpCalls.length)} calls`,
        ).toBeGreaterThan(0);

        // skill-create must be called exactly once (no retries)
        const skillCreateCalls = subToolMessages.filter(
          (m) => effectiveToolName(m) === "skill-create",
        );
        expect(
          skillCreateCalls.length,
          `Expected exactly 1 skill-create call in sub-agent (no retries), got ${String(skillCreateCalls.length)}`,
        ).toBe(1);

        // favorite-create must be called exactly once (no retries)
        const favoriteCreateCalls = subToolMessages.filter(
          (m) => effectiveToolName(m) === "favorite-create",
        );
        expect(
          favoriteCreateCalls.length,
          `Expected exactly 1 favorite-create call in sub-agent (no retries), got ${String(favoriteCreateCalls.length)}`,
        ).toBe(1);

        // tool-help must precede skill-create in the call sequence
        const firstToolHelpIdx = subToolNames.indexOf("tool-help");
        const firstSkillCreateIdx = subToolNames.indexOf("skill-create");
        const firstFavCreateIdx = subToolNames.indexOf("favorite-create");
        expect(
          firstToolHelpIdx < firstSkillCreateIdx,
          `tool-help (idx ${String(firstToolHelpIdx)}) must be called before skill-create (idx ${String(firstSkillCreateIdx)})`,
        ).toBe(true);
        expect(
          firstSkillCreateIdx < firstFavCreateIdx,
          `skill-create (idx ${String(firstSkillCreateIdx)}) must be called before favorite-create (idx ${String(firstFavCreateIdx)})`,
        ).toBe(true);

        // skill-create result must have no error field (no validation failures)
        const skillCreateResult = unwrapExecuteToolResult(
          skillCreateCalls[0]?.toolCall?.result,
        );
        expect(
          skillCreateResult?.["error"] ?? null,
          `skill-create returned an error: ${JSON.stringify(skillCreateResult?.["error"])}`,
        ).toBeNull();

        const skillId = skillCreateResult?.["id"];
        const favId = unwrapExecuteToolResult(
          favoriteCreateCalls[0]?.toolCall?.result,
        )?.["id"];

        expect(skillId, "skill-create result missing id field").toBeTruthy();
        expect(typeof skillId, "skill-create id must be a string").toBe(
          "string",
        );
        expect(favId, "favorite-create result missing id field").toBeTruthy();
        expect(typeof favId, "favorite-create id must be a string").toBe(
          "string",
        );

        if (typeof skillId === "string") {
          createdSkillId = skillId;
        }
        if (typeof favId === "string") {
          createdFavoriteId = favId;
        }
      }

      // ── Assert Thea's final message has [TEST:PASS] ──
      const aiMessages = messages.filter((m) => m.isAI && !m.toolCall);
      const lastAiMessage = aiMessages.at(-1);
      const content = lastAiMessage?.content ?? "";

      const hasFail = content.includes("[TEST:FAIL");
      if (hasFail) {
        const failMatch = /\[TEST:FAIL:?\s*(.*?)\]/.exec(content);
        const reason = failMatch?.[1]?.trim() ?? "unknown reason";
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
        throw new Error(
          `Delegation chain reported UX failure: ${reason}\n\nFull response:\n${content}`,
        );
      }

      expect(
        content.includes("[TEST:PASS]"),
        `Thea did not end with [TEST:PASS]. Final message:\n${content}`,
      ).toBe(true);

      expect(
        createdSkillId,
        "Could not extract skill ID from sub-agent tool result",
      ).toBeTruthy();
      expect(
        createdFavoriteId,
        "Could not extract favorite ID from sub-agent tool result",
      ).toBeTruthy();
    },
    TEST_TIMEOUT,
  );

  // ── SC2: Verify skill via getSkillById ───────────────────────────────────

  it(
    "SC2: getSkillById returns correct fields, icon, category, and model selection",
    async () => {
      expect(
        createdSkillId,
        "SC1 must pass first to populate createdSkillId",
      ).toBeTruthy();
      if (!createdSkillId) {
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const skillResult = await SkillsRepository.getSkillById(
        { id: createdSkillId },
        testUser,
        logger,
        defaultLocale,
      );

      expect(
        skillResult.success,
        `getSkillById failed: ${skillResult.success ? "" : JSON.stringify(skillResult)}`,
      ).toBe(true);
      if (!skillResult.success) {
        return;
      }

      const skill = skillResult.data;

      // Name must match exactly
      expect(skill.name, `Skill name should be "${TEST_SKILL_NAME}"`).toBe(
        TEST_SKILL_NAME,
      );

      // Name within length limit
      expect(
        (skill.name ?? "").length,
        `Skill name "${skill.name}" exceeds 30 chars`,
      ).toBeLessThanOrEqual(30);

      // Tagline - within 40 chars and non-empty
      expect(skill.tagline, "Skill tagline must be set").toBeTruthy();
      expect(
        (skill.tagline ?? "").length,
        `Tagline "${skill.tagline}" exceeds 40 chars`,
      ).toBeLessThanOrEqual(40);

      // Description - within 80 chars and non-empty
      expect(skill.description, "Skill description must be set").toBeTruthy();
      expect(
        (skill.description ?? "").length,
        `Description "${skill.description}" exceeds 80 chars`,
      ).toBeLessThanOrEqual(80);

      // Category must be the full i18n key (not stripped alias)
      expect(
        skill.category,
        `Category should be "${TEST_SKILL_CATEGORY_EXPECTED}", got "${skill.category}"`,
      ).toBe(TEST_SKILL_CATEGORY_EXPECTED);

      // Icon must be set (not null/empty)
      expect(skill.icon, "Skill icon must not be empty").toBeTruthy();

      // System prompt must exist
      expect(skill.systemPrompt, "Skill systemPrompt must be set").toBeTruthy();

      // modelSelection must exist with correct selectionType
      const variants = skill.variants;
      expect(variants, "Skill must have at least one variant").toBeTruthy();
      expect(
        (variants ?? []).length,
        "Skill must have at least one variant",
      ).toBeGreaterThan(0);

      const defaultVariant =
        (variants ?? []).find((v) => v.isDefault) ?? (variants ?? [])[0];
      expect(defaultVariant, "Skill must have a default variant").toBeTruthy();
      expect(
        defaultVariant?.modelSelection,
        "Default variant must have a modelSelection",
      ).toBeTruthy();
      expect(
        defaultVariant?.modelSelection?.selectionType,
        `Variant modelSelection.selectionType should be "enums.selectionType.filters", got "${String(defaultVariant?.modelSelection?.selectionType)}"`,
      ).toBe("enums.selectionType.filters");

      // Intelligence range: smart → brilliant (prompt said "smart to brilliant")
      const sel = defaultVariant?.modelSelection;
      expect(
        sel?.intelligenceRange?.min,
        `intelligenceRange.min should be "${IntelligenceLevel.SMART}", got "${String(sel?.intelligenceRange?.min)}"`,
      ).toBe(IntelligenceLevel.SMART);
      expect(
        sel?.intelligenceRange?.max,
        `intelligenceRange.max should be "${IntelligenceLevel.BRILLIANT}", got "${String(sel?.intelligenceRange?.max)}"`,
      ).toBe(IntelligenceLevel.BRILLIANT);

      // Content range: mainstream only (prompt said "mainstream content only")
      expect(
        sel?.contentRange?.min,
        `contentRange.min should be "${ContentLevel.MAINSTREAM}", got "${String(sel?.contentRange?.min)}"`,
      ).toBe(ContentLevel.MAINSTREAM);
      expect(
        sel?.contentRange?.max,
        `contentRange.max should be "${ContentLevel.MAINSTREAM}", got "${String(sel?.contentRange?.max)}"`,
      ).toBe(ContentLevel.MAINSTREAM);
    },
    TEST_TIMEOUT,
  );

  // ── SC3: Verify favorite + model resolution cascade ───────────────────────

  it(
    "SC3: favorite in getFavorites list with correct skillId + model resolves through cascade",
    async () => {
      expect(
        createdFavoriteId,
        "SC1 must pass first to populate createdFavoriteId",
      ).toBeTruthy();
      if (!createdFavoriteId) {
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { t } = favoritesScopedTranslation.scopedT(defaultLocale);

      // ── Verify favorite appears in getFavorites list ──
      const listResult = await ChatFavoritesRepository.getFavorites(
        testUser,
        logger,
        t,
        defaultLocale,
      );

      expect(
        listResult.success,
        `getFavorites failed: ${listResult.success ? "" : JSON.stringify(listResult)}`,
      ).toBe(true);
      if (!listResult.success) {
        return;
      }

      const favorites = listResult.data.favorites;
      const createdFav = favorites.find((f) => f.id === createdFavoriteId);

      expect(
        createdFav,
        `Favorite ${createdFavoriteId} not found in getFavorites list. All IDs: ${favorites.map((f) => f.id).join(", ")}`,
      ).toBeTruthy();
      if (!createdFav) {
        return;
      }

      // skillId must point to our created skill
      expect(
        createdFav.skillId,
        `Favorite skillId should be "${createdSkillId}", got "${createdFav.skillId}"`,
      ).toBe(createdSkillId);

      // Skill name must resolve (no raw i18n keys)
      expect(createdFav.name, "Favorite name must be set in list").toBeTruthy();
      const rawKeyPattern = /^enums\.[a-z]+\.[a-z]+$/;
      expect(
        rawKeyPattern.test(createdFav.name),
        `Favorite name is a raw i18n key: "${createdFav.name}"`,
      ).toBe(false);

      // ── Verify raw DB row has null modelSelection (inherits from skill) ──
      const [rawFav] = await db
        .select({ modelSelection: chatFavorites.modelSelection })
        .from(chatFavorites)
        .where(
          and(
            eq(chatFavorites.slug, createdFavoriteId),
            eq(chatFavorites.userId, testUser.id),
          ),
        )
        .limit(1);

      expect(rawFav, "Raw favorite row not found in DB").toBeTruthy();
      expect(
        rawFav?.modelSelection ?? null,
        `Favorite modelSelection must be null (inherit from skill), got: ${JSON.stringify(rawFav?.modelSelection)}`,
      ).toBeNull();

      // ── Verify model resolution cascade via resolveFavorite ──
      const resolved = await resolveFavorite(
        createdFavoriteId,
        testUser.id,
        testUser,
        logger,
        defaultLocale,
      );

      expect(
        resolved,
        `resolveFavorite returned null for ${createdFavoriteId} - cascade broken`,
      ).toBeTruthy();
      if (!resolved) {
        return;
      }

      expect(
        resolved.model,
        "Model resolution returned null - no model in filters range?",
      ).toBeTruthy();
      expect(typeof resolved.model, "Resolved model must be a string").toBe(
        "string",
      );
      // Model ID must look like a real model (e.g. "openai/gpt-4o", "anthropic/claude-3-5-sonnet")
      // not a raw enum key or garbage value
      expect(
        resolved.model.includes("/") || resolved.model.includes("-"),
        `Resolved model "${resolved.model}" doesn't look like a valid model ID (no / or -)`,
      ).toBe(true);

      expect(
        resolved.skill,
        `Resolved skill should be "${createdSkillId}", got "${resolved.skill}"`,
      ).toBe(createdSkillId);
    },
    TEST_TIMEOUT,
  );
});
