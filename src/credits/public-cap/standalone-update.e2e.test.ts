import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("E2E: update the free-tier cap", () => {
  const e2e = useE2E("credits/public-cap");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(
      `loads the saved limits and submits an exact amount in ${locale}`,
      async (fixture) => {
        const { page } = fixture;
        const { t } = scopedTranslation.scopedT(locale);
        const current = definition.GET.responseSchema.parse(
          definition.GET.examples.responses?.default,
        );
        const fixtureCap = 734;
        const updatedCap = 737;
        const message = t("repository.capUpdated", { capAmount: updatedCap });

        // The free-tier cap is shared with every Atlas visitor. Keep this browser's changes isolated.
        await page.route(
          `**/api/${locale}/credits/public-cap*`,
          async (route) => {
            if (route.request().method() === "POST") {
              await route.fulfill({
                json: { success: true, data: { message } },
              });
              return;
            }
            await route.fulfill({
              json: {
                success: true,
                data: { ...current, capAmount: fixtureCap },
              },
            });
          },
        );
        await authAtlas(fixture, await resolveTestAdminUser());
        await fixture.goto("/tools/credits/public-cap/POST", locale);
        const cap = page.getByLabel(t("post.capAmount.label"), { exact: true });
        await cap.waitFor();
        expect(await cap.inputValue()).toBe(String(fixtureCap));
        expect(
          await page
            .getByLabel(t("post.perLeadCap.label"), { exact: true })
            .inputValue(),
        ).toBe(String(current.perLeadCap));
        await cap.fill(String(updatedCap));
        await saveAdminReviewScreenshots(
          page,
          "credits_public-cap_POST",
          locale,
        );
        const saved = await fixture.capture(definition.POST, () =>
          page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
        );
        expect(saved.response.success).toBe(true);
        expect(saved.requestBody).toMatchObject({ capAmount: updatedCap });
        await page.getByText(message, { exact: true }).waitFor();
      },
    );
  }
});
