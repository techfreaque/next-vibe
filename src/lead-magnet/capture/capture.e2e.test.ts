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
import { scopedTranslation as skillsTranslation } from "next-vibe/agent/skills/i18n";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { db } from "../../vibe/database";
import { leadMagnetCaptures, leadMagnetConfigs } from "../db";
import captureEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = captureEndpoints.POST;
const { t } = scopedTranslation.scopedT("en-GLOBAL");

interface CreatorFixture {
  creatorId: string;
  skillId: string;
  skillSlug: string;
  /** The card's submit label: the creator's custom text or the default */
  buttonText: string;
}

/** A disposable creator with no external forwarding destination. */
async function createCreatorSkill(
  cleanup: (fn: () => Promise<void>) => void,
): Promise<CreatorFixture> {
  let creatorId: string | undefined;
  cleanup(async () => {
    if (creatorId) {
      await deleteTestUser(creatorId);
    }
  });
  const created = await createTestUser(
    `capture-creator-${randomUUID()}@example.test`,
    "River Mitchell",
  );
  expect(created.success).toBe(true);
  if (!created.success) {
    return {
      creatorId: "",
      skillId: "",
      skillSlug: "",
      buttonText: t("form.send"),
    };
  }
  creatorId = created.data.user.id;
  await db.insert(leadMagnetConfigs).values({
    userId: creatorId,
    provider: "PLATFORM_EMAIL",
    credentials: {},
    isActive: true,
  });

  const skillSlug = `e2e-lead-magnet-${randomUUID()}`;
  const [skill] = await db
    .insert(customSkills)
    .values({
      userId: creatorId,
      slug: skillSlug,
      name: "Studio writing kit",
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
    skillSlug,
    buttonText: t("form.send"),
  };
}

async function removeCaptures(email: string): Promise<void> {
  await db
    .delete(leadMagnetCaptures)
    .where(eq(leadMagnetCaptures.email, email));
}

/**
 * The card is hand-built (it lives inside its host page's own form), so there
 * is no per-card hydration marker. Wait for React to attach input handlers
 * before filling the fields.
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
  await page.waitForFunction(
    (placeholder) =>
      Array.from(document.querySelectorAll("input")).some(
        (input) =>
          input.placeholder === placeholder &&
          Object.getOwnPropertyNames(input).some((key) =>
            key.startsWith("__reactProps"),
          ),
      ),
    t("form.emailPlaceholder"),
    { timeout: E2E_HYDRATION_TIMEOUT_MS },
  );
  await nameInput.fill(firstName);
  await emailInput.fill(email);
  return { emailInput, button };
}

describe("E2E: lead magnet capture", () => {
  const e2e = useE2E("lead-magnet/capture");

  e2e.it(
    "subscribes from the operator form with a named skill",
    async (fixture) => {
      const locale = "en-US";
      const { page } = fixture;
      const { t: captureT } = scopedTranslation.scopedT(locale);
      const { t: skillsT } = skillsTranslation.scopedT(locale);
      const { skillId, skillSlug } = await createCreatorSkill(fixture.cleanup);
      const email = fixture.uniqueEmail("operator-capture");
      fixture.cleanup(() => removeCaptures(email));
      await authAtlas(fixture, await resolveTestAdminUser());
      await fixture.goto("/tools/lead-magnet/capture/POST", locale);
      await page.locator('button[name="skillId"]').click();
      const picker = page.getByRole("dialog");
      await picker
        .getByPlaceholder(skillsT("get.search.placeholder"))
        .fill("Studio writing kit");
      await picker
        .getByText("Studio writing kit", { exact: true })
        .first()
        .click();
      await picker.waitFor({ state: "hidden" });
      await page
        .getByLabel(captureT("submit.fields.firstName.label"), { exact: true })
        .fill("River");
      await page
        .getByLabel(captureT("submit.fields.email.label"), { exact: true })
        .fill(email);
      await saveAdminReviewScreenshots(
        page,
        "lead-magnet_capture_POST",
        locale,
      );
      const result = await fixture.capture(endpoint, () =>
        page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
      );
      expect(result.requestBody).toEqual({
        skillId: skillSlug,
        firstName: "River",
        email,
      });
      expect(result.response).toMatchObject({
        success: true,
        data: { captured: true },
      });
      const signup = page.getByRole("link", {
        name: captureT("form.signUp"),
        exact: true,
      });
      await signup.waitFor();
      const [row] = await db
        .select()
        .from(leadMagnetCaptures)
        .where(eq(leadMagnetCaptures.email, email));
      expect(row).toMatchObject({ skillId, firstName: "River" });
      await fixture.context.clearCookies();
      await signup.click();
      await page.waitForURL((url) => url.pathname.endsWith("/user/signup"));
      expect(new URL(page.url()).searchParams.get("skillId")).toBe(skillId);
    },
  );

  e2e.it(
    "captures a visitor's email on the skill landing page",
    async ({ goto, page, capture, uniqueEmail, cleanup }) => {
      const { skillId, skillSlug, buttonText } = await createCreatorSkill(cleanup);
      const email = uniqueEmail("lead-magnet");
      cleanup(() => removeCaptures(email));

      await goto(`/skill/${skillId}`);
      const { emailInput, button } = await fillCard(
        page,
        buttonText,
        "E2E",
        email,
      );
      expect(await button.isEnabled()).toBe(true);

      const call = await capture(endpoint, async () => {
        await emailInput.press("Enter");
      });
      expect(call.requestBody).toEqual({
        skillId: skillSlug,
        firstName: "E2E",
        email,
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);

      await page.getByText(t("form.doneHeading")).waitFor({ state: "visible" });
      const rows = await db
        .select({ skillId: leadMagnetCaptures.skillId })
        .from(leadMagnetCaptures)
        .where(eq(leadMagnetCaptures.email, email));
      expect(rows).toEqual([{ skillId }]);
    },
  );

  e2e.it(
    "marks malformed email and clears the warning for a valid address",
    async ({ goto, page, cleanup }) => {
      const { skillId, buttonText } = await createCreatorSkill(cleanup);

      await goto(`/skill/${skillId}`);
      const { emailInput } = await fillCard(
        page,
        buttonText,
        "E2E",
        "not-an-email",
      );
      await emailInput.press("Enter");
      await emailInput.and(page.locator('[aria-invalid="true"]')).waitFor();
      await emailInput.fill("valid@example.com");
      await emailInput.and(page.locator('[aria-invalid="false"]')).waitFor();
    },
  );

  e2e.it(
    "captures from the creator profile",
    async ({ goto, page, capture, uniqueEmail, cleanup }) => {
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
    },
  );

  e2e.it(
    "rejects an unknown skill with a visible alert",
    async ({ open, uniqueEmail }) => {
      const form = await open(endpoint, { query: { skillId: randomUUID() } });
      // oxlint-disable-next-line unicorn/no-array-fill-with-reference-type -- EndpointForm fills controls from a structured value.
      await form.fill({
        firstName: "E2E",
        email: uniqueEmail("lead-magnet-unknown"),
      });

      const result = await form.submit();
      expect(result.sent).toBe(true);
      if (!result.sent) {
        return;
      }
      expect(result.response.success).toBe(false);
      await form.alert.waitFor({ state: "visible" });
    },
  );

  e2e.it("blocks a malformed email before sending", async ({ open }) => {
    const form = await open(endpoint, { query: { skillId: randomUUID() } });
    // oxlint-disable-next-line unicorn/no-array-fill-with-reference-type -- EndpointForm fills controls from a structured value.
    await form.fill({
      firstName: "E2E",
      email: "not-an-email",
    });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) {
      return;
    }
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });
});
