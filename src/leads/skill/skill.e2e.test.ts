/**
 * E2E: lead skill attribution (first touch).
 *  - Real trigger: a visitor quick-adds a skill variant on the skill page.
 *  - The /tools form makes the same call by hand.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { describe, expect } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import { customSkills } from "next-vibe/agent/skills/db";
import {
  SkillCategory,
  SkillOwnershipType,
  SkillStatus,
} from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import { leads } from "next-vibe/identity/lead/db";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";

import { db } from "../../vibe/database";
import leadSkillEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = leadSkillEndpoints.PATCH;
const { t } = scopedTranslation.scopedT("en-GLOBAL");
const skillsT = skillsScopedTranslation.scopedT("en-GLOBAL").t;

async function createSkill(
  cleanup: E2EFixtures["cleanup"],
): Promise<{ skillId: string; creatorId: string; name: string }> {
  const admin = await resolveTestAdminUser();
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  // Unique name: the creator page lists every skill the admin owns
  const name = `E2E Attribution Skill ${suffix}`;
  const [skill] = await db
    .insert(customSkills)
    .values({
      userId: admin.id,
      slug: `e2e-lead-skill-${suffix}`,
      name,
      description: "Skill used by the lead attribution E2E suite",
      tagline: "E2E attribution",
      icon: "sparkles",
      systemPrompt: "You are a test skill.",
      category: SkillCategory.ASSISTANT,
      ownershipType: SkillOwnershipType.PUBLIC,
      status: SkillStatus.PUBLISHED,
    })
    .returning({ id: customSkills.id });
  cleanup(async () => {
    await db.delete(customSkills).where(eq(customSkills.id, skill.id));
  });
  return { skillId: skill.id, creatorId: admin.id, name };
}

/** The visitor's lead, from the cookie the middleware issued to this browser. */
async function visitorLeadSkill(
  context: E2EFixtures["context"],
): Promise<string | null | undefined> {
  const cookie = (await context.cookies()).find(
    (c) => c.name === LEAD_ID_COOKIE_NAME,
  );
  expect(cookie, "visitor has no lead cookie").toBeTruthy();
  if (!cookie) return undefined;
  const [lead] = await db
    .select({ skillId: leads.skillId })
    .from(leads)
    .where(eq(leads.id, cookie.value));
  return lead?.skillId;
}

describe("E2E: lead skill attribution", () => {
  const e2e = useE2E("leads/skill");

  e2e.it("quick-adding a skill on a creator profile attributes it to the visitor", async ({ goto, page, context, capture, cleanup }) => {
    const { skillId, creatorId, name } = await createSkill(cleanup);

    await goto(`/creator/${creatorId}`);
    // Each skill renders as a hover card; its actions reveal on hover
    const card = page
      .locator('[class*="group/card"]')
      .filter({ hasText: name });
    const quickAdd = card.getByRole("button", {
      name: skillsT("get.card.actions.quick"),
      exact: true,
    });
    // The card is hand-built (no [data-hydrated] marker) and its actions are
    // CSS hover-revealed, so they show before React owns them: wait until the
    // button carries React's props, then hover the card open.
    await quickAdd.waitFor({ state: "attached", timeout: E2E_HYDRATION_TIMEOUT_MS });
    const hydrated = await quickAdd.evaluate(
      (el, timeoutMs) =>
        new Promise<boolean>((resolve) => {
          const deadline = Date.now() + timeoutMs;
          const check = (): void => {
            if (Object.keys(el).some((k) => k.startsWith("__reactProps"))) {
              resolve(true);
            } else if (Date.now() > deadline) {
              resolve(false);
            } else {
              setTimeout(check, 250);
            }
          };
          check();
        }),
      E2E_HYDRATION_TIMEOUT_MS,
    );
    expect(hydrated, "creator page never hydrated").toBe(true);
    await card.scrollIntoViewIfNeeded();
    await card.hover();

    const call = await capture(endpoint, async () => {
      await quickAdd.click();
    });
    expect(call.requestBody).toEqual({ skillId });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.success).toBe(true);
    expect(await visitorLeadSkill(context)).toBe(skillId);
  });

  e2e.it("attributes a skill entered in the form", async ({ open, page, context, cleanup }) => {
    const { skillId } = await createSkill(cleanup);

    const form = await open(endpoint);
    await form.fill({ skillId });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.success).toBe(true);

    await page.getByText(t("patch.success.title")).waitFor({ state: "visible" });
    expect(await visitorLeadSkill(context)).toBe(skillId);
  });

  e2e.it("blocks a malformed skill id before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ skillId: "not-a-uuid" });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["skillId"]);
  });
});
