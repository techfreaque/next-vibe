import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Route } from "playwright";
import { describe, expect } from "vitest";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as chartTranslation } from "../dataflow/i18n";
import { scopedTranslation } from "./i18n";

describe("Cold tools navigation", () => {
  const e2e = useE2E("help-tool/cold-tool-recovery");
  e2e.it(
    "lets the admin retry a stalled definition without changing the requested tool",
    async (fixture) => {
      const { page } = fixture;
      await authAtlas(fixture, await resolveTestAdminUser());
      const locale = "sk-SK";
      const { t } = scopedTranslation.scopedT(locale);
      const url = "/tools/credits-purchased";
      const module =
        "**/src/credits/data-sources/credits-purchased/definition.ts*";
      const held = Promise.withResolvers<Route>();
      await page.route(module, (route) => held.resolve(route), { times: 1 });
      const navigated = page.goto(fixture.baseUrl + "/" + locale + url, {
        waitUntil: "commit",
      });
      expect((await navigated)?.ok()).toBe(true);
      const request = await held.promise;
      expect(request.request().resourceType()).toBe("script");
      await page
        .getByText(t("catalog.openError"), { exact: true })
        .waitFor({ timeout: 30_000 });
      await saveAdminViewMatrix(page, "analytics", "cold-tool-retry-sk");
      const retry = page
        .getByRole("button", { name: t("catalog.retry"), exact: true })
        .first();
      const [document] = await Promise.all([
        page.waitForResponse(
          (reply) =>
            reply.request().isNavigationRequest() &&
            new URL(reply.url()).pathname.endsWith(url),
        ),
        retry.click(),
      ]);
      await request.abort().catch(() => undefined);
      expect(document.ok()).toBe(true);
      await page
        .getByRole("combobox", {
          name: chartTranslation.scopedT(locale).t("dataSourceWidget.period"),
        })
        .waitFor();
      expect(new URL(page.url()).pathname).toBe("/" + locale + url);
    },
    100000,
  );
  e2e.it(
    "keeps the permitted workspaces usable during the returning home read",
    async (fixture) => {
      const { page } = fixture;
      await authAtlas(fixture, await resolveTestAdminUser());
      const locale = "en-US";
      const { t } = scopedTranslation.scopedT(locale);
      await fixture.goto("/tools?cat=ai", locale);
      await page
        .locator('#admin-tools-toolbar[data-admin-ready="true"]')
        .waitFor();
      const catalog = page.locator("#admin-catalog");
      const breadcrumb = catalog.getByRole("button", {
        name: t("admin.title"),
        exact: true,
      });
      await breadcrumb.waitFor();
      const held = Promise.withResolvers<Route>();
      await page.route(
        (url) => url.pathname.endsWith("/vibe/help-tool"),
        (route) => held.resolve(route),
        { times: 1 },
      );
      await breadcrumb.click();
      const request = await held.promise;
      expect(request.request().method()).toBe("GET");
      const workspaces = catalog.getByRole("heading", {
        name: t("admin.workspaces"),
        exact: true,
      });
      await workspaces.waitFor({ timeout: 5000 });
      const next = catalog.getByRole("button", { name: /Accounting/i }).first();
      await next.waitFor();
      await next.click();
      await request.continue().catch(() => undefined);
      await page.waitForURL(
        (url) => url.searchParams.get("cat") === "accounting",
      );
      await catalog
        .getByRole("heading", { name: "Accounting", exact: true })
        .waitFor();
    },
    90000,
  );
});
