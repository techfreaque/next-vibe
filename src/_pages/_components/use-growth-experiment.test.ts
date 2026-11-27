import { describe, expect, it } from "bun:test";
import { ModelUtility } from "next-vibe/agent/models/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { FREE_CREDIT_SIGNED_IN_TOTAL } from "@/products/constants";

import { modelStarterPrompt } from "../models/_shared/model-format";
import { scopedTranslation as pricingTranslation } from "../subscription/i18n";
import {
  pickGrowthVariant,
  pricingGuestVariant,
} from "./use-growth-experiment";

describe("growth experiment assignment", () => {
  it("keeps a model starter assignment and treats unknown values as unassigned", () => {
    expect(pickGrowthVariant("control", 0.9)).toBe("control");
    expect(pickGrowthVariant("treatment", 0.1)).toBe("treatment");
    expect(pickGrowthVariant(null, 0.499)).toBe("control");
    expect(pickGrowthVariant("invalid", 0.5)).toBe("treatment");
  });

  it("buckets pricing guests by lead and skips leadless and signed-in visitors", () => {
    const guest = {
      isPublic: true,
      leadId: "10000000-0000-4000-8000-000000000001",
      roles: [UserPermissionRole.PUBLIC],
    } satisfies Parameters<typeof pricingGuestVariant>[0];
    expect(pricingGuestVariant(guest)).toBe("treatment");
    expect(pricingGuestVariant(guest)).toBe("treatment");
    expect(
      pricingGuestVariant({
        ...guest,
        leadId: "10000000-0000-4000-8000-000000000002",
      }),
    ).toBe("control");
    expect(
      pricingGuestVariant({
        ...guest,
        leadId: "00000000-0000-0000-0000-000000000000",
      }),
    ).toBeNull();
    expect(
      pricingGuestVariant({
        isPublic: false,
        leadId: guest.leadId,
        id: "20000000-0000-4000-8000-000000000001",
        roles: [UserPermissionRole.CUSTOMER],
      }),
    ).toBeNull();
  });
});

describe("growth experiment copy", () => {
  it("ships distinct starter and pricing copy for all eight site languages", () => {
    const locales = [
      "en-US", "de-DE", "pl-PL", "es-ES", "fr-FR", "it-IT", "sk-SK", "hi-IN",
    ] satisfies CountryLanguage[];
    const prompts = new Set<string>();
    const offers = new Set<string>();
    for (const locale of locales) {
      const { t } = pricingTranslation.scopedT(locale);
      const offer = t("subscription.overview.guestOffer.description", {
        count: FREE_CREDIT_SIGNED_IN_TOTAL,
      });
      expect(offer).toContain(String(FREE_CREDIT_SIGNED_IN_TOTAL));
      expect(offer).not.toContain("{{");
      expect(t("subscription.overview.guestOffer.action").length).toBeGreaterThan(0);
      offers.add(offer);
      prompts.add(modelStarterPrompt(locale, [ModelUtility.CODING]));
    }
    expect(offers.size).toBe(locales.length);
    expect(prompts.size).toBe(locales.length);
  });
});
