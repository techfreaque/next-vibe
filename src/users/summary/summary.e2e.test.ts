import { scopedTranslation as catalogTranslation } from "next-vibe/help-tool/i18n";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import list from "../list/definition";
import { AccountStateFilter, UsersAudience } from "../list/enum";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("Users workspace overview", () => {
  const e2e = useE2E("users/workspace-summary");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      `opens the verified customer cohort from the ${locale} workspace`,
      async (fixtures) => {
        const { page, baseUrl } = fixtures;
        const auth = await authAtlas(fixtures, await resolveTestAdminUser());
        const origin = new URL(baseUrl).origin;
        await page.route(
          (url) =>
            url.origin === origin &&
            url.pathname.startsWith(`/api/${locale}/users/`),
          (route) =>
            route.continue({
              headers: {
                ...route.request().headers(),
                authorization: auth.authorization,
              },
            }),
        );
        const { t } = scopedTranslation.scopedT(locale);
        const waitSummary = () =>
          page.waitForResponse(
            (r) => new URL(r.url()).pathname === `/api/${locale}/users/summary`,
            { timeout: 75_000 },
          );
        const [first] = await Promise.all([
          waitSummary(),
          fixtures.goto("/tools?cat=usersDirectory", locale),
        ]);
        let response = first;
        for (
          let attempt = 0;
          [500, 503, 504].includes(response.status()) && attempt < 2;
          attempt++
        ) {
          const retry = page
            .getByRole("button", {
              name: catalogTranslation.scopedT(locale).t("catalog.retry"),
              exact: true,
            })
            .filter({ visible: true })
            .last();
          await retry.waitFor();
          await Bun.sleep(5000);
          [response] = await Promise.all([waitSummary(), retry.click()]);
        }
        expect(response.status()).toBe(200);
        const {
          data: { summary },
        } = z
          .object({
            success: z.literal(true),
            data: definition.GET.responseSchema,
          })
          .parse(await response.json());
        const metric = (name: string) =>
          summary.kpis.find((k) => k.label === name)?.value;
        expect(summary.kpis).toHaveLength(4);
        expect(metric("accounts")).toBe(
          (metric("verified") ?? 0) + (metric("unverified") ?? 0),
        );
        const attention = summary.attention.at(0);
        if (attention) {
          const review = page
            .getByRole("button", {
              name: t("reviewUnverified", { count: attention.count }),
              exact: true,
            })
            .filter({ visible: true });
          await review.waitFor();
          await page.setViewportSize({ width: 390, height: 844 });
          const box = await review.boundingBox();
          expect(box && box.x >= 0 && box.x + box.width <= 390).toBe(true);
        }
        const verified = page
          .getByRole("button")
          .filter({ has: page.getByText(t("verified"), { exact: true }) })
          .last();
        await verified.waitFor();
        const [directory] = await Promise.all([
          page.waitForResponse((r) => {
            const u = new URL(r.url());
            return (
              u.pathname === `/api/${locale}/users/list` &&
              u.searchParams.get("requiredState") ===
                AccountStateFilter.VERIFIED &&
              u.searchParams.get("audience") === UsersAudience.HUMANS
            );
          }),
          verified.click(),
        ]);
        expect(directory.status()).toBe(200);
        const { data } = z
          .object({ success: z.literal(true), data: list.GET.responseSchema })
          .parse(await directory.json());
        expect(data.summary?.totalCount).toBe(metric("verified"));
        await page.waitForURL("**/tools/users-list**");
        const preview = definition.GET.examples.responses.default;
        await page.route(
          (url) =>
            url.origin === origin &&
            url.pathname === `/api/${locale}/users/summary`,
          (route) => route.fulfill({ json: { success: true, data: preview } }),
        );
        await fixtures.goto("/tools?cat=usersDirectory", locale);
        await page
          .getByRole("button", {
            name: t("reviewUnverified", { count: 3 }),
            exact: true,
          })
          .filter({ visible: true })
          .waitFor();
        await saveAdminViewMatrix(
          page,
          "usersDirectory",
          `users-summary-verified-${locale.split("-")[0]}`,
        );
      },
    );
  }
});
