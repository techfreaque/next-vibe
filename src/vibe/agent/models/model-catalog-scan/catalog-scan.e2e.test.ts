import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("E2E: model catalog scan", () => {
  const e2e = useE2E("models/model-catalog-scan");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(
      `opens the report and runs a scan with email disabled in ${locale}`,
      async (fixture) => {
        const { page } = fixture;
        const { t } = scopedTranslation.scopedT(locale);
        const saved = definition.GET.responseSchema.parse(
          definition.GET.examples.responses?.default,
        );
        const { history, ...report } = saved;
        const current = {
          ...report,
          skipped: false,
          scan: report.scan ? { ...report.scan, emailedTo: [] } : null,
        };

        // Replay the catalog snapshot so the UI test never contacts providers or sends email.
        await page.route(
          `**/api/${locale}/vibe/agent/models/model-catalog-scan*`,
          (route) =>
            route.fulfill({
              json: {
                success: true,
                data:
                  route.request().method() === "POST"
                    ? current
                    : { ...report, history },
              },
            }),
        );
        await authAtlas(fixture, await resolveTestAdminUser());
        await fixture.goto("/tools/model-catalog-scan", locale);
        await page
          .getByRole("heading", { name: t("get.title"), exact: true })
          .waitFor();
        await page
          .getByText(t("widget.metrics.newModels"), { exact: true })
          .waitFor();
        const reportRoot = page.locator("#admin-tool-model-catalog-scan");
        for (const section of [
          t("widget.sections.newModels"),
          t("widget.sections.priceChanges"),
          t("widget.sections.missing"),
          t("widget.sections.deprecations"),
          t("widget.sections.sources"),
        ]) {
          const disclosure = reportRoot.getByRole("button", {
            name: `${section} (1)`,
            exact: true,
          });
          const wasOpen = await disclosure.getAttribute("aria-expanded");
          await disclosure.click();
          expect(await disclosure.getAttribute("aria-expanded")).toBe(
            wasOpen === "true" ? "false" : "true",
          );
          await disclosure.click();
        }
        await saveAdminReviewScreenshots(page, "model-catalog-scan", locale);

        await page
          .getByRole("button", { name: t("widget.runNow"), exact: true })
          .click();
        const force = page.getByLabel(t("post.fields.force.label"), {
          exact: true,
        });
        const sendEmail = page.getByLabel(t("post.fields.sendEmail.label"), {
          exact: true,
        });
        await force.setChecked(true);
        await sendEmail.setChecked(false);
        const [request] = await Promise.all([
          page.waitForRequest(
            (candidate) =>
              candidate.method() === "POST" &&
              new URL(candidate.url()).pathname ===
                `/api/${locale}/${definition.POST.path.join("/")}`,
          ),
          page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
        ]);
        expect(request.postDataJSON()).toMatchObject({
          force: true,
          sendEmail: false,
        });
        await page
          .locator("#admin-tool-model-catalog-scan-run")
          .getByText(t("widget.metrics.newModels"), { exact: true })
          .filter({ visible: true })
          .waitFor();
        await page
          .getByText(t("widget.notEmailed"), { exact: true })
          .filter({ visible: true })
          .waitFor();
        await saveAdminReviewScreenshots(
          page,
          "model-catalog-scan-run",
          locale,
        );
      },
    );
  }
});
