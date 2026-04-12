/**
 * Skills Seeds
 * Test skill data for dev environment - used to test creator page and skill page layouts
 */

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";
import { users } from "@/app/api/[locale]/user/db";

import {
  ModelSelectionType,
  SkillCategory,
  SkillOwnershipType,
  SkillStatus,
  SkillType,
  SkillTrustLevel,
} from "./enum";
import { customSkills, type NewCustomSkill } from "./db";
import { generateSlug, ensureUniqueSlug } from "../slugify";

export const priority = 40;

const TEST_SKILL_MARKER = "[TEST SKILL]";

/**
 * Test skills seeded for the admin user to test creator/skill page layouts
 */
const TEST_SKILLS: Omit<NewCustomSkill, "userId">[] = [
  {
    name: `${TEST_SKILL_MARKER} Layout Preview Bot`,
    tagline: "A test skill. Ignore this. It exists to test the UI.",
    description:
      "This is a placeholder skill seeded for development. It exists purely to test how the creator profile page and skill detail page render user-created skills. Nothing to see here.",
    icon: "test-tube",
    category: SkillCategory.ASSISTANT,
    skillType: SkillType.PERSONA,
    ownershipType: SkillOwnershipType.PUBLIC,
    status: SkillStatus.PUBLISHED,
    trustLevel: SkillTrustLevel.COMMUNITY,
    voteCount: 42,
    reportCount: 0,
    modelSelection: {
      selectionType: ModelSelectionType.FILTERS,
    },
    systemPrompt:
      "You are a test skill. If someone is chatting with you, something has gone wrong. Apologize and redirect them to a real skill.",
    longContent: `# Layout Preview Bot

> **This is a test skill.** It was seeded by the dev environment to test the skill detail page layout.

## What this tests

- Long content rendering (markdown)
- Heading hierarchy
- Code blocks
- Lists

## Sample code block

\`\`\`typescript
const testSkill = { name: "Layout Preview Bot", status: "just vibing" };
\`\`\`

## Features tested

- Vote counter display
- Creator profile link
- Category badge
- Published timestamp
- Status indicators

---

*If you're seeing this in production, something has gone very wrong.*`,
    publishedAt: new Date("2026-01-15T10:00:00Z"),
    changeNote: "Initial test publish",
    createdAt: new Date("2026-01-10T08:00:00Z"),
    updatedAt: new Date("2026-01-15T10:00:00Z"),
  },
  {
    name: `${TEST_SKILL_MARKER} Minimal Draft`,
    tagline: "Bare minimum skill. Checking draft state rendering.",
    description:
      "A draft skill with minimal fields filled in. Tests how the creator page renders unpublished skills.",
    icon: "pencil",
    category: SkillCategory.WRITING,
    skillType: SkillType.SPECIALIST,
    ownershipType: SkillOwnershipType.USER,
    status: SkillStatus.DRAFT,
    trustLevel: SkillTrustLevel.COMMUNITY,
    voteCount: 0,
    reportCount: 0,
    modelSelection: {
      selectionType: ModelSelectionType.FILTERS,
    },
    createdAt: new Date("2026-02-01T12:00:00Z"),
    updatedAt: new Date("2026-02-01T12:00:00Z"),
  },
  {
    name: `${TEST_SKILL_MARKER} High-Vote Published`,
    tagline: "Popular test skill. Verify verified badge threshold.",
    description:
      "A published test skill with a high vote count to test the VERIFIED trust level badge and anything that changes visually based on popularity.",
    icon: "trophy",
    category: SkillCategory.CODING,
    skillType: SkillType.SPECIALIST,
    ownershipType: SkillOwnershipType.PUBLIC,
    status: SkillStatus.PUBLISHED,
    trustLevel: SkillTrustLevel.VERIFIED,
    voteCount: 999,
    reportCount: 2,
    modelSelection: {
      selectionType: ModelSelectionType.FILTERS,
    },
    systemPrompt: "You are a highly rated test skill. Very impressive.",
    longContent: `# High-Vote Skill

This skill has 999 votes. Test that the verified badge renders correctly, vote counts are formatted, and nothing breaks at large numbers.`,
    publishedAt: new Date("2025-12-01T09:00:00Z"),
    changeNote: "v2 - added more test",
    createdAt: new Date("2025-11-20T08:00:00Z"),
    updatedAt: new Date("2025-12-01T09:00:00Z"),
  },
  {
    name: `${TEST_SKILL_MARKER} Unlisted Skill`,
    tagline: "Unlisted. Visible only via direct link.",
    description:
      "Tests the UNLISTED status - should not appear in public skill listings but should be accessible via direct URL.",
    icon: "eye-off",
    category: SkillCategory.ANALYSIS,
    skillType: SkillType.TOOL_BUNDLE,
    ownershipType: SkillOwnershipType.PUBLIC,
    status: SkillStatus.UNLISTED,
    trustLevel: SkillTrustLevel.COMMUNITY,
    voteCount: 7,
    reportCount: 0,
    modelSelection: {
      selectionType: ModelSelectionType.FILTERS,
    },
    systemPrompt: "You are an unlisted test skill.",
    publishedAt: new Date("2026-03-01T14:00:00Z"),
    createdAt: new Date("2026-02-20T10:00:00Z"),
    updatedAt: new Date("2026-03-01T14:00:00Z"),
  },
];

export async function dev(logger: EndpointLogger): Promise<void> {
  try {
    // Find the admin user (index 0 = first dev seed user)
    const adminEmail = env.VIBE_ADMIN_USER_EMAIL;
    if (!adminEmail) {
      logger.warn("VIBE_ADMIN_USER_EMAIL not set, skipping skill seeds");
      return;
    }

    const adminResults = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (adminResults.length === 0) {
      logger.warn(
        `Admin user (${adminEmail}) not found, skipping skill seeds. Run user seeds first.`,
      );
      return;
    }

    const adminId = adminResults[0].id;

    // Collect existing slugs to ensure uniqueness across all seeds
    const existingSlugsResult = await db
      .select({ slug: customSkills.slug })
      .from(customSkills);
    const usedSlugs = existingSlugsResult.map((r) => r.slug);

    for (const skillData of TEST_SKILLS) {
      try {
        const existing = await db
          .select({ id: customSkills.id })
          .from(customSkills)
          .where(eq(customSkills.name, skillData.name))
          .limit(1);

        if (existing.length > 0) {
          logger.debug(
            `Test skill "${skillData.name}" already exists, skipping`,
          );
          continue;
        }

        const baseSlug = generateSlug(skillData.name) || "test-skill";
        const slug = ensureUniqueSlug(baseSlug, usedSlugs);
        usedSlugs.push(slug);

        await db.insert(customSkills).values({
          ...skillData,
          slug,
          userId: adminId,
        });

        logger.info(`Created test skill: ${skillData.name} (slug: ${slug})`);
      } catch (error) {
        logger.error(
          `Failed to create test skill "${skillData.name}": ${String(error)}`,
        );
      }
    }
  } catch (error) {
    logger.error(`Skills seed failed: ${String(error)}`);
  }
}

export async function test(): Promise<void> {
  // No test seeds needed - test suite creates its own fixtures
}

export async function prod(): Promise<void> {
  // Never seed test skills in production
}
