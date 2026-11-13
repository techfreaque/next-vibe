/**
 * E2E: the money path, as a first-time guest walks it.
 * - lands on a fresh chat with the guest free allowance on screen
 * - first message runs on the default skill + its default variant, the answer
 *   streams in, and the cost comes off the free allowance (DB + sidebar)
 * - switching to the Uncensored variant from the composer's selector changes
 *   the skill variant + model the next message is sent with
 *
 * Paid: every AI call records once to
 * src/generated/ai-fixtures/http-cache/e2e-agent-guest-chat--<test>/
 * and replays on every run after.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { BrowserContext, Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { formatSkillId } from "../../chat/slugify";
import { scopedTranslation as threadsWidgetScopedTranslation } from "../../chat/threads/widget/i18n";
import { COMPANION_SKILLS, type SkillVariant } from "../../skills/config";
import { ModelSelectionType } from "../../skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "../../skills/i18n";
import {
  sendThroughDevRestart,
  until,
  waitVisibleThroughDevReload,
} from "../testing/e2e-chat";
import { createE2EFreeGuest } from "../testing/e2e-credit-user";
import streamEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
import { TOUR_SKIPPED_KEY } from "./widget/chat-ui/welcome-tour/tour-config";

const endpoint = streamEndpoints.POST;
/** Where a guest lands: /threads redirects a visitor to a fresh incognito chat. */
const GUEST_CHAT_PATH = "/threads/incognito/new";
/** "pong" never appears in the question, so finding it proves the AI replied. */
const PING_PROMPT =
  "Which table-tennis word answers 'ping'? Reply with that single word only, lowercase.";
/** "blue" never appears in the question either. */
const SKY_PROMPT =
  "What colour is a clear daytime sky? Reply with that single word only, lowercase.";

/** A loaded dev server can take a while to answer the stream POST. */
const SEND_TIMEOUT_MS = 150_000;
/** Two streamed turns on a shared dev server: more than the 120s default. */
const TEST_TIMEOUT_MS = 300_000;

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: tSkills } = skillsScopedTranslation.scopedT(defaultLocale);
const { t: tThreads } = threadsWidgetScopedTranslation.scopedT(defaultLocale);
const { t: tCredits } = creditsScopedTranslation.scopedT(defaultLocale);

/** The skill a guest gets without choosing: the first companion. */
const DEFAULT_SKILL = COMPANION_SKILLS[0];

function findVariant(
  pick: (variant: SkillVariant) => boolean,
): SkillVariant | undefined {
  return DEFAULT_SKILL?.variants.find(pick);
}

const DEFAULT_VARIANT = findVariant((v) => v.isDefault === true);
const UNCENSORED_VARIANT = findVariant((v) => v.id === "uncensored");

/** The model a variant pins (every companion variant is a MANUAL pick). */
function pinnedModel(variant: SkillVariant | undefined): string | undefined {
  const selection = variant?.modelSelection;
  return selection?.selectionType === ModelSelectionType.MANUAL
    ? selection.manualModelId
    : undefined;
}

/** Composer model/character selector button. */
function selectorTrigger(page: Page): Locator {
  return page.locator('button[data-tour][aria-haspopup="dialog"]').first();
}

/** Browse as a brand-new guest that owns only the guest free allowance. */
async function becomeFreeGuest(
  context: BrowserContext,
  baseUrl: string,
  cleanup: E2EFixtures["cleanup"],
  tag: string,
): Promise<string> {
  const guest = await createE2EFreeGuest(tag);
  cleanup(guest.remove);
  await context.addCookies([
    {
      name: LEAD_ID_COOKIE_NAME,
      value: guest.leadId,
      url: baseUrl,
      httpOnly: true,
    },
  ]);
  // A returning-visitor nicety only: the tour overlay would swallow clicks
  await context.addInitScript((key: string) => {
    localStorage.setItem(key, "true");
  }, TOUR_SKIPPED_KEY);
  return guest.leadId;
}

/** Open the guest chat and return the composer once it accepts input. */
async function openGuestChat(
  page: Page,
  gotoReady: E2EFixtures["gotoReady"],
): Promise<Locator> {
  const composer = page.locator('[data-hydrated] textarea[name="prompt"]');
  await gotoReady(GUEST_CHAT_PATH, async () => {
    // Character + model pair renders client-only: a reliable hydration signal
    await selectorTrigger(page)
      .locator("span.truncate + span")
      .first()
      .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS });
    await composer.waitFor({
      state: "visible",
      timeout: E2E_HYDRATION_TIMEOUT_MS,
    });
  });
  await until("composer enabled", () => composer.isEnabled());
  return composer;
}

async function leadBalance(leadId: string): Promise<number> {
  const balance = await CreditRepository.getLeadBalance(
    leadId,
    logger,
    tCredits,
    defaultLocale,
  );
  expect(balance.success, JSON.stringify(balance)).toBe(true);
  return balance.success ? balance.data : Number.NaN;
}

/**
 * What the sidebar's credits bar says on hover ("20 credits"). The tooltip
 * stays open while hovered and re-renders live, so polling it is cheap.
 */
async function sidebarBalanceText(page: Page): Promise<string> {
  await page
    .getByText(tThreads("components.credits.label"), { exact: true })
    .first()
    .hover();
  const tooltip = page.getByRole("tooltip").first();
  await tooltip.waitFor({ state: "visible" });
  return (await tooltip.innerText()).trim();
}

/** The sidebar's rendering of a balance (two decimals, floored). */
function balanceLabel(total: number): string {
  return total === 1
    ? tThreads("components.credits.credit", { count: 1 })
    : tThreads("components.credits.credits", {
        count: `${Math.floor(total * 100) / 100}`,
      });
}

/** Type + send from the composer, returning the stream call it made. */
async function sendFromComposer(
  page: Page,
  composer: Locator,
  capture: E2EFixtures["capture"],
  prompt: string,
): Promise<Awaited<ReturnType<E2EFixtures["capture"]>>> {
  return capture(
    endpoint,
    async () => {
      await composer.fill(prompt);
      await page.getByTitle(t("actions.sendMessage"), { exact: true }).click();
    },
    SEND_TIMEOUT_MS,
  );
}

describe("E2E: guest chat money path", () => {
  const e2e = useE2E("agent/guest-chat", { fixtures: true });

  e2e.it(
    "default variant: free allowance shown, answer streams, cost deducted",
    async ({ page, context, baseUrl, gotoReady, capture, cleanup }) => {
      expect(DEFAULT_SKILL, "no companion skill").toBeDefined();
      expect(pinnedModel(DEFAULT_VARIANT), "no default variant").toBeDefined();
      const leadId = await becomeFreeGuest(
        context,
        baseUrl,
        cleanup,
        "default",
      );

      // A first-time guest starts on the full guest allowance — and sees it
      const startBalance = await leadBalance(leadId);
      expect(startBalance).toBe(FREE_CREDIT_ALLOWANCE.guest);

      const { composer, call } = await sendThroughDevRestart(
        baseUrl,
        async () => {
          const input = await openGuestChat(page, gotoReady);
          expect(await sidebarBalanceText(page)).toBe(
            balanceLabel(startBalance),
          );
          const sent = await sendFromComposer(
            page,
            input,
            capture,
            PING_PROMPT,
          );
          return { composer: input, call: sent };
        },
      );
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      // Nothing picked: the companion itself on its default variant's model
      expect(call.requestBody).toMatchObject({
        operation: "send",
        rootFolderId: "incognito",
        content: PING_PROMPT,
        skill: DEFAULT_SKILL?.id,
        model: pinnedModel(DEFAULT_VARIANT),
      });

      await until(
        "composer cleared",
        async () => (await composer.inputValue()) === "",
      );
      await waitVisibleThroughDevReload(
        page,
        page.getByText(/\bpong\b/i).first(),
      );

      // Billed from the free allowance: the balance drops, and the sidebar follows
      let endBalance = startBalance;
      await until("message billed", async () => {
        endBalance = await leadBalance(leadId);
        return endBalance < startBalance;
      });
      expect(endBalance).toBeGreaterThan(0);
      await until(
        "sidebar shows the new balance",
        async () => (await sidebarBalanceText(page)) === balanceLabel(endBalance),
      );
    },
    TEST_TIMEOUT_MS,
  );

  e2e.it(
    "uncensored variant picked in the composer selector is sent",
    async ({ page, context, baseUrl, gotoReady, capture, cleanup }) => {
      const uncensoredModel = pinnedModel(UNCENSORED_VARIANT);
      expect(uncensoredModel, "no uncensored variant").toBeDefined();
      expect(uncensoredModel).not.toBe(pinnedModel(DEFAULT_VARIANT));
      await becomeFreeGuest(context, baseUrl, cleanup, "uncensored");

      // First message on the default, like every guest
      const { composer, call: first } = await sendThroughDevRestart(
        baseUrl,
        async () => {
          const input = await openGuestChat(page, gotoReady);
          const sent = await sendFromComposer(
            page,
            input,
            capture,
            PING_PROMPT,
          );
          return { composer: input, call: sent };
        },
      );
      expect(first.response.success, JSON.stringify(first.response)).toBe(
        true,
      );
      expect(first.requestBody).toMatchObject({
        skill: DEFAULT_SKILL?.id,
        model: pinnedModel(DEFAULT_VARIANT),
      });
      await waitVisibleThroughDevReload(
        page,
        page.getByText(/\bpong\b/i).first(),
      );

      // Switch in the composer: selector → guest → one-screen setup → Uncensored
      await selectorTrigger(page).click();
      await page
        .getByRole("button", { name: t("onboarding.signin.continueAsGuest") })
        .click();
      await page
        .getByTestId("selector-setup")
        .getByRole("button", { name: t("onboarding.setup.start") })
        .click();
      const uncensoredLabel = UNCENSORED_VARIANT
        ? tSkills(UNCENSORED_VARIANT.variantName)
        : "";
      const uncensoredRow = page.locator("[data-favorite-row]").filter({
        has: page.getByText(uncensoredLabel, { exact: true }),
      });
      await uncensoredRow.first().waitFor();
      expect(await uncensoredRow.count()).toBe(1);
      // The row's select button (its drag handle is a role=button too)
      await uncensoredRow
        .getByRole("button")
        .filter({ has: page.getByText(uncensoredLabel, { exact: true }) })
        .click();
      await until(
        "uncensored row active",
        async () =>
          (await uncensoredRow
            .locator('[aria-current="true"]')
            .count()) === 1,
      );
      await page.keyboard.press("Escape");

      const second = await sendFromComposer(
        page,
        composer,
        capture,
        SKY_PROMPT,
      );
      expect(second.response.success, JSON.stringify(second.response)).toBe(
        true,
      );
      expect(second.requestBody).toMatchObject({
        operation: "send",
        rootFolderId: "incognito",
        content: SKY_PROMPT,
        skill: formatSkillId(DEFAULT_SKILL?.id ?? "", UNCENSORED_VARIANT?.id),
        model: uncensoredModel,
      });
      await waitVisibleThroughDevReload(
        page,
        page.getByText(/\bblue\b/i).first(),
      );
    },
    TEST_TIMEOUT_MS,
  );
});
