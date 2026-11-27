import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import health from "./definition";
import { scopedTranslation } from "./i18n";

describe("Server health check on Atlas", () => {
  const e2e = useE2E("server-health-check");

  e2e.it("runs the selected checks and displays their health results", async (fixture) => {
    const { page, capture } = fixture;
    const locale = "en-US";
    const { t } = scopedTranslation.scopedT(locale);
    await authAtlas(fixture, await resolveTestAdminUser());
    await fixture.goto("/tools/health", locale);

    const tool = page.locator("#admin-tool-health");
    const healthChecks = tool.getByText(t("get.response.checks.title"), { exact: true });
    await healthChecks.waitFor();
    await saveAdminReviewScreenshots(page, "health", locale);

    await tool.getByRole("checkbox", { name: t("get.fields.includeDatabase.title") }).click();
    await tool.getByRole("checkbox", { name: t("get.fields.includeTasks.title") }).click();
    await tool.getByRole("checkbox", { name: t("get.fields.includeSystem.title") }).click();
    await tool.getByRole("checkbox", { name: t("get.fields.detailed.title") }).click();
    const runHealthCheck = tool.getByRole("button", { name: t("get.widget.refresh"), exact: true });
    const updated = await capture(health.GET, () => runHealthCheck.click());

    expect(updated.response.success).toBe(true);
    if (!updated.response.success) {
      return;
    }
    expect(updated.response.data.checks.map(({ name }) => name)).toEqual(["drain", "basic", "system"]);
    expect(updated.response.data.system.memory.total).toBeGreaterThan(0);
    await tool.getByText(t("get.response.system.cpu.loadAverage.title"), { exact: true }).waitFor();
    expect(await tool.getByText(t("get.response.database.title"), { exact: true }).count()).toBe(0);
    expect(await tool.getByText(t("get.response.tasks.title"), { exact: true }).count()).toBe(0);
  });
});
