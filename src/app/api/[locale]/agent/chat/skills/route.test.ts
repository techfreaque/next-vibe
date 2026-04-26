/**
 * Skills Test Suite — Endpoint Validation + CRUD Integration
 *
 * Part A: Auto-generated tests for all skill endpoints (schema, auth, examples).
 * Part B: Sequential CRUD integration tests using the admin user.
 *         Creates a skill, reads/updates/publishes/votes/reports/moderates/deletes it.
 *         All IDs in responses must be slugs, never UUIDs.
 */

// Testing infrastructure - test descriptions are for developers, not end users

import { and, eq, like } from "drizzle-orm";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import { testEndpoint } from "@/app/api/[locale]/system/check/testing/testing-suite";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";

import { customSkills } from "./db";
import { isUuid } from "../slugify";
import { SkillCategory, ModelSelectionType, IntelligenceLevel, SkillStatus, SkillSourceFilter } from "./enum";
import { ChatModelId } from "../../ai-stream/models";

// ── Definition imports ───────────────────────────────────────────────────────

import skillsListEndpoint from "./definition";
import skillCreateEndpoint from "./create/definition";
import skillSingleEndpoint from "./[id]/definition";
import skillPublishEndpoint from "./[id]/publish/definition";
import skillVoteEndpoint from "./[id]/vote/definition";
import skillReportEndpoint from "./[id]/report/definition";
import skillModerationEndpoint from "./moderation/definition";

// ── Part A: Auto-generated endpoint tests ────────────────────────────────────

testEndpoint(skillsListEndpoint.GET);
testEndpoint(skillCreateEndpoint.POST);
testEndpoint(skillSingleEndpoint.GET);
testEndpoint(skillSingleEndpoint.PATCH);
testEndpoint(skillSingleEndpoint.DELETE);
testEndpoint(skillPublishEndpoint.PATCH);
testEndpoint(skillVoteEndpoint.POST);
testEndpoint(skillReportEndpoint.POST);
testEndpoint(skillModerationEndpoint.GET);
testEndpoint(skillModerationEndpoint.PATCH);

// ── Part B: CRUD Integration Tests ───────────────────────────────────────────

const TEST_TIMEOUT = 60_000;
const TEST_SKILL_NAME = "Test Skill Route Suite";

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

/** Assert a string is a slug (lowercase, dashes, digits — never a UUID). */
function expectSlug(value: string, label: string): void {
  expect(isUuid(value), `${label} should not be a UUID: ${value}`).toBe(false);
  expect(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(value),
    `${label} should be a valid slug: ${value}`,
  ).toBe(true);
}

describe("Skills CRUD Integration", () => {
  let adminUser: JwtPrivatePayloadType;
  let createdSkillSlug: string;
  let createdSkillUuid: string | null = null;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    adminUser = resolved;

    // Clean up any leftover test skills from previous runs
    await db
      .delete(customSkills)
      .where(
        and(
          eq(customSkills.userId, adminUser.id),
          like(customSkills.name, `${TEST_SKILL_NAME}%`),
        ),
      );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    // Final cleanup
    await db
      .delete(customSkills)
      .where(
        and(
          eq(customSkills.userId, adminUser.id),
          like(customSkills.name, `${TEST_SKILL_NAME}%`),
        ),
      );
  });

  // Sequential suite: each test builds on the previous
  let suiteFailed = false;
  function fit(
    name: string,
    fn: () => Promise<void>,
    timeout?: number,
  ): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          return;
        }
        try {
          await fn();
        } catch (err) {
          suiteFailed = true;
          // oxlint-disable-next-line restricted-syntax
          throw err;
        }
      },
      timeout ?? TEST_TIMEOUT,
    );
  }

  // ── S1: Create a skill ──────────────────────────────────────────────────
  fit("S1: create skill returns slug-based id", async () => {
    const response = await sendTestRequest({
      endpoint: skillCreateEndpoint.POST,
      data: {
        name: TEST_SKILL_NAME,
        tagline: "Integration test skill for route suite",
        description: "This skill is created by the automated test suite to verify the full CRUD flow",
        icon: "test-tube",
        systemPrompt: "You are a test assistant. Always respond with 'test-ok'.",
        category: SkillCategory.CODING,
        isPublic: false,
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ChatModelId.GPT_5,
        },
      },
      user: adminUser,
    });

    expect(response.success, `Create failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.id).toBeTruthy();
    expectSlug(response.data.id, "created skill id");
    createdSkillSlug = response.data.id;
  });

  // ── S2: GET by slug ─────────────────────────────────────────────────────
  fit("S2: get skill by slug returns full detail", async () => {
    const response = await sendTestRequest({
      endpoint: skillSingleEndpoint.GET,
      urlPathParams: { id: createdSkillSlug },
      user: adminUser,
    });

    expect(response.success, `GET failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.name).toBe(TEST_SKILL_NAME);
    expect(response.data.category).toBe(SkillCategory.CODING);
    expect(response.data.systemPrompt).toContain("test-ok");
    expect(response.data.variants.length).toBeGreaterThanOrEqual(1);

    // No UUID exposure
    if (response.data.internalId) {
      // If internalId is returned (admin), capture it for UUID-lookup test
      createdSkillUuid = response.data.internalId;
    }
    if (response.data.creatorProfile) {
      expectSlug(response.data.creatorProfile.userId, "creatorProfile.userId");
    }
  });

  // ── S3: List skills — created skill appears ─────────────────────────────
  fit("S3: list skills includes created skill with slug IDs", async () => {
    const response = await sendTestRequest({
      endpoint: skillsListEndpoint.GET,
      data: { query: TEST_SKILL_NAME, sourceFilter: SkillSourceFilter.MY },
      user: adminUser,
    });

    expect(response.success, `List failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    // Find the created skill across all sections
    const allSkills = response.data.sections.flatMap((s) => s.skills);
    const found = allSkills.find((s) => s.name === TEST_SKILL_NAME);
    expect(found, "Created skill not found in list").toBeTruthy();
    if (!found) {
      return;
    }

    expectSlug(found.skillId, "listed skill.skillId");
    expect(found.skillId).toBe(createdSkillSlug);
    expect(found.category).toBe(SkillCategory.CODING);
  });

  // ── S4: Update skill ────────────────────────────────────────────────────
  fit("S4: update skill changes fields", async () => {
    const response = await sendTestRequest({
      endpoint: skillSingleEndpoint.PATCH,
      urlPathParams: { id: createdSkillSlug },
      data: {
        name: `${TEST_SKILL_NAME} Updated`,
        tagline: "Updated tagline for test",
        description: "Updated description for integration test",
        icon: "wrench",
        systemPrompt: "You are an updated test assistant.",
        category: SkillCategory.CODING,
        isPublic: false,
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
          },
        },
      },
      user: adminUser,
    });

    expect(response.success, `Update failed: ${response.message}`).toBe(true);
  });

  // ── S5: GET after update ────────────────────────────────────────────────
  fit("S5: get after update reflects changes", async () => {
    const response = await sendTestRequest({
      endpoint: skillSingleEndpoint.GET,
      urlPathParams: { id: createdSkillSlug },
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.name).toBe(`${TEST_SKILL_NAME} Updated`);
    expect(response.data.tagline).toBe("Updated tagline for test");
    expect(response.data.systemPrompt).toBe("You are an updated test assistant.");
  });

  // ── S6: Publish skill ──────────────────────────────────────────────────
  fit("S6: publish skill transitions to PUBLISHED", async () => {
    const response = await sendTestRequest({
      endpoint: skillPublishEndpoint.PATCH,
      urlPathParams: { id: createdSkillSlug },
      data: {
        status: SkillStatus.PUBLISHED,
        changeNote: "Publishing for test suite",
      },
      user: adminUser,
    });

    expect(response.success, `Publish failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.status_response).toBe(SkillStatus.PUBLISHED);
    expect(response.data.publishedAt).toBeTruthy();
  });

  // ── S7: List all skills — published skill visible ─────────────────────
  // Note: COMMUNITY filter excludes the current user's own skills,
  // so we use ALL to verify the published skill is accessible.
  fit("S7: published skill appears in all-skills listing", async () => {
    const updatedName = `${TEST_SKILL_NAME} Updated`;
    const response = await sendTestRequest({
      endpoint: skillsListEndpoint.GET,
      data: { sourceFilter: SkillSourceFilter.ALL, query: updatedName },
      user: adminUser,
    });

    expect(response.success, `All-skills list failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    const allSkills = response.data.sections.flatMap((s) => s.skills);
    const found = allSkills.find((s) => s.name === updatedName);
    expect(found, "Published skill not found in all-skills listing").toBeTruthy();
    if (found) {
      expectSlug(found.skillId, "community listed skill.skillId");
    }
  });

  // ── S8: Vote on skill ─────────────────────────────────────────────────
  fit("S8: vote on published skill records vote", async () => {
    const response = await sendTestRequest({
      endpoint: skillVoteEndpoint.POST,
      urlPathParams: { id: createdSkillSlug },
      user: adminUser,
    });

    expect(response.success, `Vote failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.voted).toBe(true);
    expect(response.data.voteCount).toBeGreaterThanOrEqual(1);
  });

  // ── S9: Vote again (toggle off) ───────────────────────────────────────
  fit("S9: second vote toggles off", async () => {
    const response = await sendTestRequest({
      endpoint: skillVoteEndpoint.POST,
      urlPathParams: { id: createdSkillSlug },
      user: adminUser,
    });

    expect(response.success, `Vote toggle failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.voted).toBe(false);
  });

  // ── S10: Report skill ─────────────────────────────────────────────────
  fit("S10: report skill creates report", async () => {
    const response = await sendTestRequest({
      endpoint: skillReportEndpoint.POST,
      urlPathParams: { id: createdSkillSlug },
      data: { reason: "Test report from route suite" },
      user: adminUser,
    });

    expect(response.success, `Report failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.reported).toBe(true);
    expect(response.data.reportCount).toBeGreaterThanOrEqual(1);
  });

  // ── S11: Moderation list ──────────────────────────────────────────────
  fit("S11: moderation list shows reported skill", async () => {
    const response = await sendTestRequest({
      endpoint: skillModerationEndpoint.GET,
      data: { minReports: 1 },
      user: adminUser,
    });

    expect(response.success, `Moderation list failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.skills.length).toBeGreaterThanOrEqual(1);
    const updatedName = `${TEST_SKILL_NAME} Updated`;
    const reported = response.data.skills.find(
      (s: Record<string, unknown>) => s.name === updatedName,
    );
    expect(reported, "Reported skill not found in moderation list").toBeTruthy();
    if (reported) {
      // Moderation uses internal UUIDs for id and ownerAuthorId
      expect(reported.reportCount).toBeGreaterThanOrEqual(1);
      // Capture the DB id for the moderation clear step
      createdSkillUuid = reported.id as string;
    }
  });

  // ── S12: Moderation clear report ───────────────────────────────────────
  fit("S12: moderation clears report", async () => {
    // Need the internal UUID for moderation endpoint (it uses DB IDs)
    let skillDbId = createdSkillUuid;
    if (!skillDbId) {
      // Fetch it from DB
      const [row] = await db
        .select({ id: customSkills.id })
        .from(customSkills)
        .where(eq(customSkills.slug, createdSkillSlug))
        .limit(1);
      skillDbId = row?.id ?? null;
    }
    expect(skillDbId, "Could not resolve skill DB id for moderation").toBeTruthy();
    if (!skillDbId) {
      return;
    }

    const response = await sendTestRequest({
      endpoint: skillModerationEndpoint.PATCH,
      data: { id: skillDbId, action: "clear" as const },
      user: adminUser,
    });

    expect(response.success, `Moderation clear failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.patchReportCount).toBe(0);
  });

  // ── S13: Unpublish skill ──────────────────────────────────────────────
  fit("S13: unpublish skill transitions to DRAFT", async () => {
    const response = await sendTestRequest({
      endpoint: skillPublishEndpoint.PATCH,
      urlPathParams: { id: createdSkillSlug },
      data: {
        status: SkillStatus.DRAFT,
        changeNote: "Unpublishing for test suite cleanup",
      },
      user: adminUser,
    });

    expect(response.success, `Unpublish failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.status_response).toBe(SkillStatus.DRAFT);
  });

  // ── S14: GET by UUID returns same as by slug ──────────────────────────
  fit("S14: get by UUID returns same result as by slug (backward compat)", async () => {
    if (!createdSkillUuid) {
      // Fetch UUID from DB
      const [row] = await db
        .select({ id: customSkills.id })
        .from(customSkills)
        .where(eq(customSkills.slug, createdSkillSlug))
        .limit(1);
      createdSkillUuid = row?.id ?? null;
    }
    if (!createdSkillUuid) {
      // Skip if we can't get the UUID (shouldn't happen)
      return;
    }

    const response = await sendTestRequest({
      endpoint: skillSingleEndpoint.GET,
      urlPathParams: { id: createdSkillUuid },
      user: adminUser,
    });

    expect(response.success, `GET by UUID failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    // Even when queried by UUID, the response should not leak UUIDs
    expect(response.data.name).toBe(`${TEST_SKILL_NAME} Updated`);
    if (response.data.creatorProfile) {
      expectSlug(response.data.creatorProfile.userId, "creatorProfile.userId via UUID lookup");
    }
  });

  // ── S15: Delete skill ─────────────────────────────────────────────────
  fit("S15: delete skill succeeds", async () => {
    const response = await sendTestRequest({
      endpoint: skillSingleEndpoint.DELETE,
      urlPathParams: { id: createdSkillSlug },
      user: adminUser,
    });

    expect(response.success, `Delete failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expect(response.data.name).toBe(`${TEST_SKILL_NAME} Updated`);
    expect(response.data.category).toBe(SkillCategory.CODING);
  });

  // ── S16: GET deleted skill → not found ─────────────────────────────────
  fit("S16: get deleted skill returns not found", async () => {
    const response = await sendTestRequest({
      endpoint: skillSingleEndpoint.GET,
      urlPathParams: { id: createdSkillSlug },
      user: adminUser,
    });

    expect(response.success).toBe(false);
    expect(response.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });
});
