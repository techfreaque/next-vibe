import { appendFile, mkdir, writeFile } from "node:fs/promises";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  getAtlasFixture,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { CATEGORY_REGISTRY } from "@/generated/categories/registry";

import { humanCategoryName } from "./admin-catalog-model";
import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { localizedLabel } from "./localized-label";

const catalog = z.object({
  success: z.literal(true),
  data: definitions.GET.responseSchema,
});

async function waitForCatalogControl(
  page: Page,
  control: Locator,
  retry: Locator,
): Promise<number> {
  for (let attempt = 0; attempt < 3; attempt++) {
    await control.or(retry).first().waitFor({ timeout: 40_000 });
    if (await control.isVisible()) {
      return attempt;
    }
    // Atlas advertises a five-second retry window when its database is busy.
    await Bun.sleep(5_000);
    if (await control.isVisible()) {
      return attempt;
    }
    if (await retry.isVisible()) {
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === "GET" &&
            new URL(response.url()).pathname.endsWith("/vibe/help-tool"),
          { timeout: 15_000 },
        ),
        retry.click({ timeout: 5_000 }),
      ]);
    }
  }
  await control.waitFor({ timeout: 40_000 });
  return 3;
}

describe("authorized admin category landings", () => {
  const e2e = useE2E("admin-category-landings");

  for (const [language, locale, width, height, theme] of [
    ["en", "en-GLOBAL", 1440, 900, "light"],
    ["de", "de-DE", 390, 844, "dark"],
    ["sk", "sk-SK", 390, 844, "light"],
  ] as const) {
    for (const cohort of [0, 1]) {
      e2e.it(
        `clicks permitted categories and returns home in ${language}, cohort ${cohort + 1}`,
        async (fixtures) => {
          const { page, baseUrl } = fixtures;
          const authorization = await authAtlas(
            fixtures,
            await resolveTestAdminUser(),
          );
          const catalogUrl = new URL(`/api/${locale}/vibe/help-tool`, baseUrl)
            .href;
          let response = await getAtlasFixture(catalogUrl, {}, authorization);
          for (
            let attempt = 0;
            attempt < 2 && response.status === 503;
            attempt++
          ) {
            await Bun.sleep(5_000);
            response = await getAtlasFixture(catalogUrl, {}, authorization);
          }
          expect(response.status).toBe(200);
          const { data } = catalog.parse(await response.json());
          const permitted = (data.webCategories ?? []).filter(
            ({ count }) => count > 0,
          );
          const landings = data.adminCategoryLandings ?? {};
          expect(permitted.length).toBeGreaterThan(0);

          const { t } = scopedTranslation.scopedT(locale);
          const homeTitle = String(t("admin.title"));
          const home = page.getByRole("heading", {
            level: 1,
            name: homeTitle,
            exact: true,
          });
          const homeFavorites = page.getByRole("heading", {
            name: String(t("catalog.favorites")),
            exact: true,
          });
          const loading = page
            .getByText(String(t("aiTools.modal.loading")), {
              exact: true,
            })
            .filter({ visible: true });
          const retry = page
            .getByRole("button", {
              name: String(t("catalog.retry")),
              exact: true,
            })
            .filter({ visible: true })
            .last();
          await page.route(/\/api\//, async (route) => {
            if (route.request().method() === "GET") {
              await route.continue();
              return;
            }
            await route.abort();
          });
          await page.setViewportSize({ width, height });
          await page.emulateMedia({ colorScheme: theme });
          await fixtures.goto("/tools", locale);
          await page
            .locator('#admin-tools-toolbar[data-admin-ready="true"]')
            .waitFor();
          await home.waitFor();
          await page.locator("html").evaluate((root, mode) => {
            root.classList.remove("light", "dark");
            root.classList.add(mode);
            root.style.colorScheme = mode;
          }, theme);

          const directory = ".tmp/admin-platform-v2/category-landings";
          await mkdir(directory, { recursive: true });
          const proofPath = `${directory}/${language}-${cohort + 1}.jsonl`;
          await writeFile(proofPath, "");
          const discovered = new Set(permitted.map(({ name }) => name));
          const unavailable = CATEGORY_REGISTRY.filter(
            ({ key }) => !discovered.has(key),
          ).map(({ key }) => key);
          await appendFile(
            proofPath,
            JSON.stringify({
              locale,
              width,
              theme,
              permitted: permitted.length,
              unavailable,
            }) + "\n",
          );

          for (const { name } of permitted.filter(
            (_, index) => index % 2 === cohort,
          )) {
            let retries = await waitForCatalogControl(
              page,
              homeFavorites,
              retry,
            );
            const category = CATEGORY_REGISTRY.find(({ key }) => key === name);
            const label = category
              ? (localizedLabel(category.labels, locale) ?? category.label)
              : humanCategoryName(name);
            const landing = landings[name];
            expect(landing, name).toBeDefined();
            if (!landing) {
              continue;
            }
            await appendFile(
              proofPath,
              JSON.stringify({ category: name, started: true }) + "\n",
            );
            const sidebar = page
              .locator("#platform-admin-navigation")
              .filter({ visible: true });
            if (!(await sidebar.isVisible())) {
              await page
                .getByRole("button", {
                  name: t("catalog.openSidebar"),
                  exact: true,
                })
                .click();
            }
            await sidebar
              .getByRole("button", { name: label, exact: true })
              .click();

            await page.waitForURL(
              (url) => url.searchParams.get("cat") === name,
              {
                timeout: 10_000,
              },
            );
            const heading = page.getByRole("heading", {
              level: 1,
              name: landing.heading ?? label,
              exact: true,
            });
            await heading.waitFor({ timeout: 10_000 });
            await loading.waitFor({ state: "hidden", timeout: 40_000 });
            const reportedDestinations = [
              ...new Set([
                ...(landing.contextualActions ? [] : landing.actions).map(
                  ({ title }) => title,
                ),
                ...landing.destinations.map(({ title }) => title),
              ]),
            ];
            for (const title of reportedDestinations) {
              retries += await waitForCatalogControl(
                page,
                page
                  .getByRole("button")
                  .filter({ has: page.getByText(title, { exact: true }) })
                  .or(page.getByRole("button", { name: title, exact: true }))
                  .filter({ visible: true })
                  .first(),
                retry,
              );
            }
            const advanced: string[] = [];
            for (const [key, count] of [
              ["automations", landing.automationCount],
              ["developer", landing.developerCount],
            ] as const) {
              if (!count) {
                continue;
              }
              const disclosure = page.getByRole("button", {
                name: `${String(t(`admin.${key}`))} (${count})`,
                exact: true,
              });
              retries += await waitForCatalogControl(page, disclosure, retry);
              expect(await disclosure.getAttribute("aria-expanded"), name).toBe(
                "false",
              );
              await disclosure.click();
              expect(await disclosure.getAttribute("aria-expanded"), name).toBe(
                "true",
              );
              if (key === "developer") {
                await page
                  .getByRole("button", {
                    name: String(t("admin.openDeveloper")),
                    exact: true,
                  })
                  .waitFor({ timeout: 10_000 });
              } else {
                for (const { title } of landing.automations) {
                  await page
                    .getByRole("button")
                    .filter({ has: page.getByText(title, { exact: true }) })
                    .or(page.getByRole("button", { name: title, exact: true }))
                    .filter({ visible: true })
                    .first()
                    .waitFor({ timeout: 10_000 });
                }
              }
              advanced.push(key);
            }
            await loading.waitFor({ state: "hidden", timeout: 40_000 });
            await page
              .locator("#admin-catalog")
              .getByRole("button", { name: t("erp.home"), exact: true })
              .click();
            await page.waitForURL((url) => !url.searchParams.has("cat"), {
              timeout: 10_000,
            });
            await home.waitFor({ timeout: 10_000 });
            retries += await waitForCatalogControl(page, homeFavorites, retry);
            await appendFile(
              proofPath,
              JSON.stringify({
                category: name,
                heading: label,
                destinations: reportedDestinations.length,
                advanced,
                retries,
                returnedHome: true,
              }) + "\n",
            );
          }
        },
        210_000,
      );
    }
  }
});
