/**
 * E2E: model browser tool page — real browser against the running server.
 * Static catalogue (no provider calls), so no fixtures.
 */

import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { IntelligenceLevel } from "../../skills/enum";
import modelsListEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = modelsListEndpoints.GET;

describe("E2E: model browser", () => {
  const e2e = useE2E("vibe/agent/models/list");
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("lists every model type on load, then narrows to image models", async ({ open, page }) => {
    const form = await open(endpoint);
    const loaded = await form.firstCall();
    expect(loaded.response.success, JSON.stringify(loaded.response).slice(0, 500)).toBe(true);
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
      .getByText(t("get.browser.statsLabel", { matched: models.length, total: totalCount }))
      .waitFor({ state: "visible" });
    await page.getByText(models[0].name, { exact: true }).first().waitFor({ state: "visible" });
  });

  e2e.it("shows the empty state when no model matches the search", async ({ open, page }) => {
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
    await page.getByText(t("get.browser.noModels")).first().waitFor({ state: "visible" });
  });
});
