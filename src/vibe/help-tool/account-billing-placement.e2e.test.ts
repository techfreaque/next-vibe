import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  authAtlas,
  getAtlasFixture,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import subscriptionDefinition from "@/subscription/definition";
import { scopedTranslation as subscriptionLocale } from "@/subscription/i18n";
import { category as accountSettings } from "@/user/private/account-settings/category";

import definition from "./definition";

const catalog = z.object({
  success: z.literal(true),
  data: definition.GET.responseSchema,
});

describe("My account billing placement", () => {
  const e2e = useE2E("account/billing-placement");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      `finds the personal subscription under Billing in ${locale}`,
      async (fixture) => {
        const { page, baseUrl } = fixture;
        const auth = await authAtlas(fixture, await resolveTestAdminUser());
        const origin = new URL(baseUrl).origin;
        const catalogUrl = new URL(`/api/${locale}/vibe/help-tool`, baseUrl);
        const response = await getAtlasFixture(catalogUrl.href, {}, auth);
        expect(response.status).toBe(200);
        const { data } = catalog.parse(await response.json());
        for (const tool of [
          "payment_GET",
          "payment_POST",
          "payment_checkout_POST",
          "payment_portal_POST",
          "subscription_GET",
          "subscription_create_POST",
          "subscription-update",
          "subscription-cancel",
        ]) {
          expect(data.adminCatalogDestinations?.[tool]).toEqual({
            category: "accountSettings",
            subCategory: "billing",
          });
        }
        for (const tool of [
          "payment-processor",
          "processor-accounting",
          "subscription-admin-list",
          "subscription_company_companyId_list_GET",
        ]) {
          const operational = data.adminCatalogDestinations?.[tool];
          expect(operational).toBeDefined();
          expect(operational?.category).not.toBe("accountSettings");
        }
        const { t } = subscriptionLocale.scopedT(locale);
        const actorTitle = t("get.titleShort");
        const accountLanding =
          data.adminCategoryLandings?.accountSettings?.destinations ?? [];
        expect(accountLanding.some(({ title }) => title === actorTitle)).toBe(
          true,
        );
        expect(
          data.adminCategoryLandings?.payments?.destinations.some(
            ({ title }) => title === actorTitle,
          ),
        ).toBe(false);

        await page.route(
          (url) =>
            url.origin === origin &&
            [
              `/api/${locale}/vibe/help-tool`,
              `/api/${locale}/subscription`,
            ].includes(url.pathname),
          async (route) => {
            if (route.request().method() !== "GET") {
              await route.fallback();
              return;
            }
            await route.continue({
              headers: {
                ...route.request().headers(),
                authorization: auth.authorization,
              },
            });
          },
        );

        await fixture.goto("/tools?cat=accountSettings&sub=billing", locale);
        await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
        const billing = accountSettings.subcategories?.billing?.label[locale];
        expect(billing).toBeDefined();
        if (!billing) return;
        const billingTab = page.getByRole("button", {
          name: billing,
          exact: true,
        });
        await billingTab.waitFor({ timeout: 55_000 });
        expect(await billingTab.getAttribute("aria-pressed")).toBe("true");
        expect(
          await billingTab
            .locator("xpath=..")
            .getByRole("button", { name: "", exact: true })
            .count(),
        ).toBe(0);
        const subscription = page
          .getByRole("button")
          .filter({ has: page.getByText(actorTitle, { exact: true }) })
          .filter({ visible: true })
          .last();
        await subscription.waitFor();
        if (process.env["ACCOUNT_BILLING_SHOTS"] === "1") {
          await saveAdminViewMatrix(page, "accountSettings", `account-billing-normal-${locale.slice(0, 2)}`);
        }
        const [subscriptionResponse] = await Promise.all([
          page.waitForResponse(
            (reply) =>
              reply.request().method() === "GET" &&
              new URL(reply.url()).pathname === `/api/${locale}/subscription`,
            { timeout: 40_000 },
          ),
          subscription.click(),
        ]);
        expect(subscriptionResponse.status()).toBe(200);
        await page.waitForURL((url) =>
          url.pathname.endsWith(`/tools/${endpointToUrlSegment(subscriptionDefinition.GET)}`),
        );
      },
      120_000,
    );
  }
});
