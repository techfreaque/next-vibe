import { scopedTranslation as imageTranslation } from "next-vibe/agent/image-generation/i18n";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { scopedTranslation as contactTranslation } from "@/contact/i18n";
import { getPricingParams } from "@/products/repository-client";

import { scopedTranslation as pricingTranslation } from "./subscription/i18n";

describe("Public widgets without JavaScript", () => {
  const e2e = useE2E("public-widget-ssr");

  e2e.it("shows prices and form controls in the initial document", async ({
    context,
    page,
    goto,
  }) => {
    // Leave React's hidden streaming segments in place, as a no-JS visitor sees them.
    const session = await context.newCDPSession(page);
    await session.send("Emulation.setScriptExecutionDisabled", { value: true });

    await goto("/subscription/overview");
    const pricing = getPricingParams(E2E_LOCALE);
    const { t } = pricingTranslation.scopedT(E2E_LOCALE);
    const pack = t("subscription.overview.howItWorks.permanent.description", {
      packPrice: pricing.packPrice,
      packCredits: pricing.packCredits,
    });
    expect(await page.getByText(pack, { exact: true }).isVisible()).toBe(true);
    expect(await page.locator('[data-catalog="rows"]').isVisible()).toBe(true);

    await goto("/create/image");
    const image = imageTranslation.scopedT(E2E_LOCALE);
    const prompt = page.getByText(image.t("post.prompt.label"), { exact: true });
    expect(await prompt.isVisible()).toBe(true);

    const contact = contactTranslation.scopedT(E2E_LOCALE);
    for (const path of ["/help", "/story/framework", "/story/self-host"]) {
      await goto(path);
      const submit = page.getByTestId("endpoint-submit").filter({
        hasText: contact.t("form.submitButton.label"),
      });
      expect(await submit.isVisible(), path).toBe(true);
    }
  });
});
