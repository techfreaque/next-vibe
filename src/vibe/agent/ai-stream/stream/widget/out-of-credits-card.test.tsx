/**
 * One card per refusal reason: the daily free limit never stacks on the
 * wallet's "not enough credits" card, and a lighter model is offered only
 * when one fits what is left today.
 */

import { describe, expect, it, mock } from "bun:test";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { AllowanceRefusal } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";
import { renderToStaticMarkup } from "react-dom/server";
import * as widgetContextModule from "next-vibe/unified-ui/_shared/use-widget-context";
import * as availabilityStoreModule from "next-vibe/agent/env-availability-store";
import * as navigationModule from "next-vibe/ui/hooks/use-navigation";
import * as creditOffersModule from "@/subscription/create/credit-offers";
import * as creditHooksModule from "@/credits/hooks";
import * as subscriptionHooksModule from "@/subscription/hooks";
import * as newsletterHooksModule from "@/newsletter/credit-bonus/hooks";

import type { AiStreamTranslationKey } from "../i18n";

const ALL: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: true,
  voice: true,
  braveSearch: true,
  kagiSearch: true,
  anySearch: true,
  uncensoredAI: true,
  freedomGPT: true,
  gabAI: true,
  veniceAI: true,
  nanoGPT: true,
  scrappey: true,
  openAiImages: true,
  openAiStt: true,
  replicate: true,
  falAi: true,
  modelsLab: true,
  edenAiStt: true,
  deepgram: true,
  openAiTts: true,
  edenAiTts: true,
  elevenlabs: true,
  unbottledSystem: false,
  unbottledForce: false,
};

const logger = createEndpointLogger(false, defaultLocale);
const member = {
  id: "fixture-user",
  leadId: "fixture-lead",
  roles: [],
  isPublic: false as const,
};

const widgetContext = { ...widgetContextModule };
const availabilityStore = { ...availabilityStoreModule };
const navigation = { ...navigationModule };
const creditOffers = { ...creditOffersModule };
const creditHooks = { ...creditHooksModule };
const subscriptionHooks = { ...subscriptionHooksModule };
const newsletterHooks = { ...newsletterHooksModule };

void mock.module("next-vibe/unified-ui/_shared/use-widget-context", () => ({
  ...widgetContext,
  useWidgetUser: () => member,
  useWidgetLogger: () => logger,
}));
void mock.module("next-vibe/agent/env-availability-store", () => ({
  ...availabilityStore,
  useProviderAvailability: () => ALL,
}));
void mock.module("next-vibe/ui/hooks/use-navigation", () => ({
  ...navigation,
  usePathname: () => "/en-GLOBAL/threads/private",
}));
void mock.module("@/subscription/create/credit-offers", () => ({
  ...creditOffers,
  CreditOffers: () => <div data-testid="credit-offers" />,
}));
void mock.module("@/credits/hooks", () => ({
  ...creditHooks,
  useFreeCreditsStatus: () => undefined,
  useCreditsTotal: () => 37.02,
}));
void mock.module("@/subscription/hooks", () => ({
  ...subscriptionHooks,
  useSubscription: () => ({ read: { data: undefined } }),
}));
void mock.module("@/newsletter/credit-bonus/hooks", () => ({
  ...newsletterHooks,
  useNewsletterCreditBonus: () => ({
    data: undefined,
    claim: () => Promise.resolve({ kind: "done" }),
    isClaiming: false,
  }),
}));

const resetsAt = new Date(Date.now() + 5 * 3_600_000).toISOString();

async function render(
  allowance: AllowanceRefusal | undefined,
  isGuest = false,
): Promise<string> {
  const { OutOfCreditsCard } = await import("./out-of-credits-card");
  return renderToStaticMarkup(
    <OutOfCreditsCard
      locale={defaultLocale}
      isGuest={isGuest}
      variant="composer"
      allowance={allowance}
      balance={37.02}
      currentModelId="kimi-k3"
      onDismiss={(): void => undefined}
    />,
  );
}

/** Translated copy as React escapes it in static markup. */
async function texts(): Promise<(key: AiStreamTranslationKey) => string> {
  const { scopedTranslation } = await import("../i18n");
  const { t } = scopedTranslation.scopedT(defaultLocale);
  return (key) => t(key).replaceAll("'", "&#x27;");
}

describe("OutOfCreditsCard per refusal reason", () => {
  it("daily limit (caller): one card, why, kept credits, plan tiles, no wallet copy", async () => {
    const t = await texts();
    const markup = await render({ scope: "caller", remaining: 0, resetsAt });
    expect(markup).toContain('data-testid="daily-limit-card"');
    expect(markup).toContain(t("outOfCredits.dailyLimit.title"));
    expect(markup).toContain(t("outOfCredits.dailyLimit.whyCaller"));
    expect(markup).toContain("37.02");
    expect(markup).toContain('data-testid="credit-offers"');
    // Nothing fits 0 credits left: no lighter-model offer.
    expect(markup).not.toContain('data-testid="daily-limit-lighter"');
    expect(markup).not.toContain(t("outOfCredits.member.shortTitle"));
  });

  it("daily limit (pool) with room left offers a lighter model", async () => {
    const t = await texts();
    const markup = await render({ scope: "pool", remaining: 5, resetsAt });
    expect(markup).toContain(t("outOfCredits.dailyLimit.whyPool"));
    expect(markup).toContain('data-testid="daily-limit-lighter"');
    expect(markup).toContain(t("outOfCredits.dailyLimit.pickLighter"));
  });

  it("daily limit for a guest points to an account, not plan tiles", async () => {
    const markup = await render(
      { scope: "caller", remaining: 0, resetsAt },
      true,
    );
    expect(markup).toContain("/user/signup?callbackUrl=");
    expect(markup).not.toContain('data-testid="credit-offers"');
  });

  it("reply in flight gets its own short card", async () => {
    const t = await texts();
    const markup = await render({ scope: "inFlight", remaining: 0, resetsAt });
    expect(markup).toContain(t("outOfCredits.inFlight.title"));
    expect(markup).not.toContain('data-testid="credit-offers"');
    expect(markup).not.toContain('data-testid="daily-limit-card"');
  });

  it("wallet short of credits keeps its own card without the server banner", async () => {
    const t = await texts();
    const markup = await render(undefined);
    expect(markup).toContain(t("outOfCredits.member.shortTitle"));
    expect(markup).not.toContain('data-testid="daily-limit-card"');
  });
});

describe("daily limit helpers", () => {
  it("names the reset in the viewer's clock and how far away it is", async () => {
    const { describeReset } = await import("./daily-limit");
    const now = new Date("2026-11-27T19:00:00.000Z");
    const reset = describeReset("2026-11-28T00:00:00.000Z", "en-US", now);
    expect(reset.relative).toBe("in 5 hours");
    const soon = describeReset("2026-11-27T19:20:00.000Z", "en-US", now);
    expect(soon.relative).toBe("in 20 minutes");
  });

  it("suggests the strongest model that fits, none when nothing does", async () => {
    const { findLighterModel } = await import("./daily-limit");
    const none = findLighterModel({
      remaining: -1,
      currentModelId: undefined,
      user: member,
      availability: ALL,
    });
    expect(none).toBeNull();
    const fit = findLighterModel({
      remaining: 5,
      currentModelId: undefined,
      user: member,
      availability: ALL,
    });
    expect(fit).not.toBeNull();
    expect(fit?.cost ?? Infinity).toBeLessThanOrEqual(5);
  });
});
