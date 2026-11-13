/**
 * E2E: lead magnet capture — the email card a creator's active lead magnet puts
 * on their skill landing page (/skill/[id]) and creator profile (/creator/[id]),
 * plus the /tools form for the rejection paths.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { customSkills } from "next-vibe/agent/skills/db";
import {
  SkillCategory,
  SkillOwnershipType,
  SkillStatus,
} from "next-vibe/agent/skills/enum";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { db } from "../../vibe/database";
import { leadMagnetCaptures, leadMagnetConfigs } from "../db";
import { LeadMagnetProviderDB } from "../enum";
import captureEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = captureEndpoints.POST;
const { t } = scopedTranslation.scopedT("en-GLOBAL");

interface CreatorFixture {
  creatorId: string;
  skillId: string;
  /** The card's submit label: the creator's custom text or the default */
  buttonText: string;
}

/** A published skill owned by the admin, whose lead magnet is active. */
async function createCreatorSkill(
  cleanup: (fn: () => Promise<void>) => void,
): Promise<CreatorFixture> {
  const admin = await resolveTestAdminUser();
  const creatorId = admin.id;

  const [existing] = await db
    .select({
      id: leadMagnetConfigs.id,
      isActive: leadMagnetConfigs.isActive,
      buttonText: leadMagnetConfigs.buttonText,
    })
    .from(leadMagnetConfigs)
    .where(eq(leadMagnetConfigs.userId, creatorId))
    .limit(1);
  if (!existing) {
    // No notify address → PLATFORM_EMAIL forwards nowhere: no external call
    const [created] = await db
      .insert(leadMagnetConfigs)
      .values({
        userId: creatorId,
        provider: "PLATFORM_EMAIL" satisfies (typeof LeadMagnetProviderDB)[number],
        credentials: {},
        isActive: true,
      })
      .returning({ id: leadMagnetConfigs.id });
    cleanup(async () => {
      await db
        .delete(leadMagnetConfigs)
        .where(eq(leadMagnetConfigs.id, created.id));
    });
  } else if (!existing.isActive) {
    await db
      .update(leadMagnetConfigs)
      .set({ isActive: true })
      .where(eq(leadMagnetConfigs.id, existing.id));
    cleanup(async () => {
      await db
        .update(leadMagnetConfigs)
        .set({ isActive: false })
        .where(eq(leadMagnetConfigs.id, existing.id));
    });
  }

  const [skill] = await db
    .insert(customSkills)
    .values({
      userId: creatorId,
      slug: `e2e-lead-magnet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: "E2E Lead Magnet Skill",
      description: "Skill used by the lead magnet E2E suite",
      tagline: "E2E lead magnet",
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
  return {
    creatorId,
    skillId: skill.id,
    buttonText: existing?.buttonText ?? t("form.send"),
  };
}

async function removeCaptures(email: string): Promise<void> {
  await db.delete(leadMagnetCaptures).where(eq(leadMagnetCaptures.email, email));
}

/**
 * The card is hand-built (it lives inside its host page's own form), so there
 * is no per-card hydration marker: type once the page settles and prove React
 * owns the inputs by the submit button turning enabled.
 */
async function fillCard(
  page: Page,
  buttonText: string,
  firstName: string,
  email: string,
): Promise<{ emailInput: Locator; button: Locator }> {
  await page.waitForLoadState("load");
  const nameInput = page.getByPlaceholder(t("form.namePlaceholder"));
  const emailInput = page.getByPlaceholder(t("form.emailPlaceholder"));
  const button = page.getByRole("button", { name: buttonText });
  // Typing into SSR markup before hydration leaves React state empty (the DOM
  // shows text, the button stays disabled). Retype until React has it: a
  // valid name + email is exactly what enables the button.
  // A dev-server HMR reload can kill hydration outright: reload once if stuck.
  const deadline = Date.now() + E2E_HYDRATION_TIMEOUT_MS;
  let reloadAt = Date.now() + E2E_HYDRATION_TIMEOUT_MS / 2;
  while (Date.now() < deadline) {
    await nameInput.fill(firstName);
    await emailInput.fill("probe@example.com");
    if (await button.isEnabled()) {
      break;
    }
    if (Date.now() > reloadAt) {
      reloadAt = Number.POSITIVE_INFINITY;
      await page.reload({ waitUntil: "load" });
    }
    await page.waitForTimeout(500);
  }
  expect(await button.isEnabled(), "lead capture card never hydrated").toBe(true);
  await emailInput.fill(email);
  return { emailInput, button };
}

describe("E2E: lead magnet capture", () => {
  const e2e = useE2E("lead-magnet/capture");

  e2e.it("captures a visitor's email on the skill landing page", async ({ goto, page, capture, uniqueEmail, cleanup }) => {
    const { skillId, buttonText } = await createCreatorSkill(cleanup);
    const email = uniqueEmail("lead-magnet");
    cleanup(() => removeCaptures(email));

    await goto(`/skill/${skillId}`);
    const { emailInput, button } = await fillCard(page, buttonText, "E2E", email);
    expect(await button.isEnabled()).toBe(true);

    const call = await capture(endpoint, async () => {
      await emailInput.press("Enter");
    });
    expect(call.requestBody).toEqual({ skillId, firstName: "E2E", email });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);

    await page.getByText(t("form.doneHeading")).waitFor({ state: "visible" });
    const rows = await db
      .select({ skillId: leadMagnetCaptures.skillId })
      .from(leadMagnetCaptures)
      .where(eq(leadMagnetCaptures.email, email));
    expect(rows).toEqual([{ skillId }]);
  });

  e2e.it("keeps the button disabled until the email is valid", async ({ goto, page, cleanup }) => {
    const { skillId, buttonText } = await createCreatorSkill(cleanup);

    await goto(`/skill/${skillId}`);
    const { emailInput, button } = await fillCard(page, buttonText, "E2E", "not-an-email");
    expect(await button.isDisabled()).toBe(true);
    await emailInput.fill("valid@example.com");
    expect(await button.isDisabled()).toBe(false);
  });

  e2e.it("captures from the creator profile", async ({ goto, page, capture, uniqueEmail, cleanup }) => {
    const { creatorId, buttonText } = await createCreatorSkill(cleanup);
    const email = uniqueEmail("lead-magnet-creator");
    cleanup(() => removeCaptures(email));

    await goto(`/creator/${creatorId}`);
    const { button } = await fillCard(page, buttonText, "E2E", email);

    const call = await capture(endpoint, async () => {
      await button.click();
    });
    expect(call.requestBody).toMatchObject({ firstName: "E2E", email });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    await page.getByText(t("form.doneHeading")).waitFor({ state: "visible" });
  });

  e2e.it("rejects an unknown skill with a visible alert", async ({ open, uniqueEmail }) => {
    const form = await open(endpoint);
    await form.fill({
      skillId: randomUUID(),
      firstName: "E2E",
      email: uniqueEmail("lead-magnet-unknown"),
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
  });

  e2e.it("blocks a malformed email before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({
      skillId: randomUUID(),
      firstName: "E2E",
      email: "not-an-email",
    });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });
});
