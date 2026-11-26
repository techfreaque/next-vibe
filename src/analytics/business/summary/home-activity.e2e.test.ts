import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as usageCopy } from "@/credits/analytics/usage/i18n";
import { scopedTranslation } from "../overview/i18n";
import definition from "./definition";

const responseSchema = z.object({
  success: z.literal(true),
  data: definition.GET.responseSchema,
});

describe("Admin home usage and recent activity", () => {
  const e2e = useE2E("analytics/admin-home-activity");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      "opens the costed usage report from the home in " + locale,
      async (fixture) => {
        const headers = await authAtlas(fixture, await resolveTestAdminUser());
        const http = atlasRequest(
          headers.authorization.slice("Bearer ".length),
        );
        const path =
          fixture.baseUrl + "/api/" + locale + "/analytics/business/summary";
        const summary = responseSchema.parse(
          await (await http.get(path, { params: { profile: "home" } })).json(),
        ).data.summary;
        expect(summary.kpis).toHaveLength(6);
        expect(
          summary.kpis.find(
            (row) => row.label === "platformSummary.valuationCost",
          )?.invertDelta,
        ).toBe(true);
        expect(
          summary.kpis
            .filter((row) => row.label.startsWith("platformSummary.valuation"))
            .map((row) => row.currency),
        ).toEqual(["USD", "USD"]);
        const activity = responseSchema.parse(
          await (
            await http.get(path, { params: { section: "activity" } })
          ).json(),
        ).data.summary;
        expect(activity.recent.map((row) => row.at)).toEqual(
          activity.recent
            .map((row) => row.at)
            .toSorted()
            .toReversed(),
        );
        for (const row of activity.recent) {
          expect(row.title).toBeUndefined();
          if (row.drill.alias === "revenue-report") {
            expect(row.detail?.kind).toBe("money");
          } else {
            expect(row.detail?.kind).toBe("name");
          }
          expect(row.drill.alias).toMatch(
            /^(users-list|revenue-report|cron-history)$/,
          );
          expect(new Date(row.at).getTime()).toBeGreaterThanOrEqual(
            new Date(activity.from).getTime(),
          );
        }
        const t = scopedTranslation.scopedT(locale).t;
        const { page } = fixture;
        await fixture.goto("/tools", locale);
        const recent = page.getByRole("heading", {
          name: t("platformSummary.recent"),
          exact: true,
        });
        await recent.waitFor({ timeout: 55000 });
        await page
          .getByText(t("platformSummary.valuationBasis"), { exact: true })
          .waitFor();
        const cost = page
          .getByRole("button", {
            name: new RegExp(t("platformSummary.valuationCost") + ".*USD"),
          })
          .filter({ visible: true })
          .first();
        await cost.waitFor({ timeout: 45000 });
        for (const event of activity.recent) {
          const detail = event.detail;
          if (detail)
            await recent
              .locator("..")
              .getByText(
                detail.kind === "money"
                  ? formatMoney(detail.amount, detail.currency, locale)
                  : detail.value,
                { exact: true },
              )
              .first()
              .waitFor();
        }
        if (activity.recent.length) {
          const label = activity.recent[0].label;
          if (label)
            await page
              .getByRole("button", { name: t(label), exact: true })
              .first()
              .waitFor();
        } else {
          await page
            .getByText(t("platformSummary.emptyActivity"), { exact: true })
            .waitFor();
        }
        await saveAdminViewMatrix(
          page,
          "workspace",
          "home-usage-activity-" + locale.slice(0, 2),
          async () => {
            await cost.waitFor();
            await recent.waitFor();
          },
        );
        await saveAdminViewMatrix(
          page,
          "workspace",
          "home-recent-" + locale.slice(0, 2),
          async () => {
            await recent.waitFor();
            await recent.evaluate((heading) =>
              heading.parentElement?.scrollIntoView({ block: "center" }),
            );
          },
        );
        await cost.click();
        await page
          .getByRole("heading", {
            name: usageCopy.scopedT(locale).t("get.title"),
            exact: true,
          })
          .first()
          .waitFor({ timeout: 45000 });
      },
      120000,
    );
  }
});
