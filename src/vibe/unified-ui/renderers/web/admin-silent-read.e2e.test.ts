import "server-only";

import { eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import graphsDefinition from "next-vibe/dataflow/graphs/definition";
import { db } from "next-vibe/database";
import { scopedTranslation as helpCopy } from "next-vibe/help-tool/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as documentCopy } from "@/finance/i18n";
import invoiceDefinition from "@/payment/invoice/list/definition";
import subscriptionDefinition from "@/subscription/definition";
import { scopedTranslation as subscriptionCopy } from "@/subscription/i18n";

describe("E2E: silent authenticated admin GET feedback", () => {
  const e2e = useE2E("admin/silent-read");

  e2e.it(
    "announces a held request, retries a failed read and restores real subscription and graph views",
    async (fixtures) => {
      let userId: string | undefined;
      fixtures.cleanup(async () => {
        if (userId) await deleteTestUser(userId);
      });
      const user = await createTestUser(
        fixtures.uniqueEmail("silent-admin-read"),
      );
      expect(user.success).toBe(true);
      if (!user.success) return;
      userId = user.data.user.id;
      await db.insert(userRoles).values({ userId, role: UserRole.ADMIN });
      const identity = {
        ...user.data.user,
        roles: [...user.data.user.roles, UserRole.ADMIN],
      };
      const headers = await authAtlas(fixtures, identity);
      const { page, baseUrl } = fixtures;
      const { t } = helpCopy.scopedT(E2E_LOCALE);
      const { t: tSub } = subscriptionCopy.scopedT(E2E_LOCALE);
      const retryLabel = t("catalog.retry");
      const loadingLabel = t("aiTools.modal.loading");
      const browseLabel = t("catalog.browse");
      const outage = t("catalog.toolNotFound");
      const recovery = [
        {
          endpoint: subscriptionDefinition.GET,
          route: "/subscription",
          ready: tSub("noSubscription.title"),
        },
        {
          endpoint: graphsDefinition.GET,
          route: "/vibe/dataflow/graphs",
          ready: graphsDefinition.GET.scopedTranslation
            .scopedT(E2E_LOCALE)
            .t("list.container.title"),
        },
      ];
      let activeRoute = "";
      let release: (() => void) | undefined;
      let hold: Promise<void> | undefined;
      let injectFailure = false;
      let requests = 0;
      fixtures.cleanup(async () => release?.());
      await page.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.origin !== new URL(baseUrl).origin) {
          await route.abort();
          return;
        }
        if (
          injectFailure &&
          request.method() === "GET" &&
          url.pathname.startsWith("/api/") &&
          url.pathname.endsWith(activeRoute)
        ) {
          requests += 1;
          await hold;
          await route.fulfill({
            status: 503,
            json: fail({
              message: outage,
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            }),
          });
          return;
        }
        await route.continue({ headers: { ...request.headers(), ...headers } });
      });

      for (const entry of recovery) {
        activeRoute = entry.route;
        requests = 0;
        injectFailure = true;
        hold = new Promise<void>((resolve) => {
          release = resolve;
        });
        const alias = endpointToUrlSegment(entry.endpoint);
        const pane = page.locator(`[id="admin-tool-${alias}"]`);
        const requested = page.waitForRequest((request) => {
          const path = new URL(request.url()).pathname;
          return (
            request.method() === "GET" &&
            path.startsWith("/api/") &&
            path.endsWith(activeRoute)
          );
        });
        await Promise.all([
          page.goto(`${baseUrl}/${E2E_LOCALE}/tools/${alias}`, {
            waitUntil: "domcontentloaded",
          }),
          requested,
        ]);
        const loading = pane
          .locator('[aria-live="polite"]')
          .filter({ hasText: loadingLabel });
        await loading.waitFor();
        expect(requests).toBeGreaterThan(0);
        release?.();
        const error = pane.getByRole("alert").filter({ hasText: outage });
        await error.waitFor();
        const retry = error.getByRole("button", {
          name: retryLabel,
          exact: true,
        });
        await retry.waitFor();
        expect(
          await error
            .getByRole("button", { name: browseLabel, exact: true })
            .count(),
        ).toBe(1);
        injectFailure = false;
        const actual = page.waitForResponse(
          (response) =>
            response.ok() &&
            new URL(response.url()).pathname.startsWith("/api/") &&
            new URL(response.url()).pathname.endsWith(activeRoute),
        );
        await retry.click();
        expect((await actual).ok()).toBe(true);
        await error.waitFor({ state: "hidden" });
        await pane
          .getByText(entry.ready, { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
      }

      const { t: tDocuments } = documentCopy.scopedT(E2E_LOCALE);
      activeRoute = "/payment/invoice/list";
      injectFailure = true;
      const alias = endpointToUrlSegment(invoiceDefinition.GET);
      await page.goto(`${baseUrl}/${E2E_LOCALE}/tools/${alias}`, {
        waitUntil: "domcontentloaded",
      });
      const pane = page.locator(`[id="admin-tool-${alias}"]`);
      await pane
        .getByText(tDocuments("documents.loadFailed"), { exact: true })
        .waitFor();
      expect(
        await pane
          .getByRole("button", {
            name: tDocuments("documents.retry"),
            exact: true,
          })
          .count(),
      ).toBe(1);
      expect(await pane.getByText(outage, { exact: true }).count()).toBe(0);
    },
  );
});
