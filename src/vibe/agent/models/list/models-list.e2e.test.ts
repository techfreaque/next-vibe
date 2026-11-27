/**
 * E2E: model browser tool page — real browser against the running server.
 * Static catalogue (no provider calls), so no fixtures.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { IntelligenceLevel } from "../../skills/enum";
import modelsListEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = modelsListEndpoints.GET;

describe("E2E: model browser", () => {
  const e2e = useE2E("vibe/agent/models/list");
  const { t } = scopedTranslation.scopedT(defaultLocale);

  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`filters the admin catalog in ${locale}`, async (fixture) => {
      const { page } = fixture;
      const { t: label } = scopedTranslation.scopedT(locale);
      await authAtlas(fixture, await resolveTestAdminUser());
      await fixture.goto("/tools/models", locale);
      const types = page.getByRole("combobox", {
        name: label("get.fields.modelType.label"),
        exact: true,
      });
      await types.click();
      const filtered = await fixture.capture(endpoint, () =>
        page
          .getByRole("option", {
            name: label("enums.modelType.image"),
            exact: true,
          })
          .click(),
      );
      expect(filtered.response.success).toBe(true);
      if (!filtered.response.success) {
        return;
      }
      const { models, totalCount } = filtered.response.data;
      expect(models.length).toBeGreaterThan(0);
      expect(models.every(({ type }) => type === "image")).toBe(true);
      await page
        .getByText(
          label("get.browser.statsLabel", {
            matched: models.length,
            total: totalCount,
          }),
        )
        .waitFor();
      await saveAdminReviewScreenshots(page, "models", locale);
      const clear = page.getByRole("button", {
        name: label("get.browser.clearFilters"),
        exact: true,
      });
      await clear.click();
      await page
        .getByText(
          label("get.browser.statsLabel", {
            matched: totalCount,
            total: totalCount,
          }),
          { exact: true },
        )
        .waitFor();
      expect(await page.getByRole("tab").count()).toBeGreaterThan(1);
    });
  }

  e2e.it(
    "lists every model type on load, then narrows to image models",
    async ({ open, page }) => {
      const form = await open(endpoint);
      const loaded = await form.firstCall();
      expect(
        loaded.response.success,
        JSON.stringify(loaded.response).slice(0, 500),
      ).toBe(true);
      if (!loaded.response.success) return;
      const allTypes = new Set(loaded.response.data.models.map((m) => m.type));
      expect(allTypes.size).toBeGreaterThan(1);
      // No raw validation error on first paint
      expect(await form.alert.count()).toBe(0);

      await form.fill({ modelType: "image" });
      const result = await form.submit();
      expect(result.sent).toBe(true);
      if (!result.sent) return;
      expect(result.response.success).toBe(true);
      if (!result.response.success) return;
      const { models, totalCount } = result.response.data;
      expect(models.length).toBeGreaterThan(0);
      expect(models.every((m) => m.type === "image")).toBe(true);

      // Stats line + a rendered card for the first image model
      await page
        .getByText(
          t("get.browser.statsLabel", {
            matched: models.length,
            total: totalCount,
          }),
        )
        .waitFor({ state: "visible" });
      await page
        .getByText(models[0].name, { exact: true })
        .first()
        .waitFor({ state: "visible" });
    },
  );

  e2e.it(
    "shows the empty state when no model matches the search",
    async ({ open, page }) => {
      const form = await open(endpoint);
      await form.firstCall();
      await form.fill({
        intelligence: IntelligenceLevel.BRILLIANT,
        query: "e2e-no-such-model-zzz",
      });
      const result = await form.submit();
      expect(result.sent).toBe(true);
      if (!result.sent) return;
      expect(result.response.success).toBe(true);
      if (!result.response.success) return;
      expect(result.response.data.models).toEqual([]);
      await page
        .getByText(t("get.browser.emptyTitle"), { exact: true })
        .first()
        .waitFor({ state: "visible" });
    },
  );
});
