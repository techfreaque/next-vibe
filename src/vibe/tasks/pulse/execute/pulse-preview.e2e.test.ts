import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";

describe("Pulse preview on Atlas", () => {
  const e2e = useE2E("pulse/preview");

  e2e.it("submits a dry run for a synthetic task alias", async (fixture) => {
    const { page } = fixture;
    const locale = "en-US";
    const alias = "database-sync";
    const path = /\/api\/[^/]+\/vibe\/tasks\/pulse\/execute$/u;
    const { t } = scopedTranslation.scopedT(locale);
    const saved = definitions.POST.responseSchema.parse(
      definitions.POST.examples.responses?.basic,
    );
    await page.route((url) => path.test(url.pathname), async (route) => {
      const body = route.request().postData();
      const parsed = definitions.POST.requestSchema.safeParse(body ? JSON.parse(body) : {});
      if (
        route.request().method() !== "POST" ||
        !parsed.success ||
        parsed.data.dryRun !== true ||
        parsed.data.force !== false ||
        parsed.data.taskNames?.length !== 1 ||
        parsed.data.taskNames[0] !== alias
      ) {
        await route.fulfill({ status: 400 });
        return;
      }
      await route.fulfill({
        json: {
          success: true,
          data: { ...saved, results: [], tasksExecuted: 0 },
        },
      });
    });
    await authAtlas(fixture, await resolveTestAdminUser());
    await fixture.goto("/tools/pulse-execute", locale);
    const tool = page.locator("#admin-tool-pulse-execute");
    const dryRun = tool.getByRole("checkbox", { name: t("post.fields.dryRun.label") });
    await dryRun.check();
    const taskAlias = tool.getByRole("textbox", { name: t("post.fields.taskNames.label") });
    await taskAlias.fill(alias);
    await taskAlias.press("Enter");
    await tool.getByText(alias, { exact: true }).waitFor();
    expect(await dryRun.isChecked()).toBe(true);
    const [response] = await Promise.all([
      page.waitForResponse((reply) => (
        path.test(new URL(reply.url()).pathname) &&
        reply.request().method() === "POST"
      )),
      tool.getByTestId("endpoint-submit").click(),
    ]);
    expect(response.ok()).toBe(true);
    await tool.getByText(t("post.response.dryRunSuccess"), { exact: true }).waitFor();
    await saveAdminReviewScreenshots(page, "pulse-execute", locale);
  });
});
