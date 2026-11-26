import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { ExportFormat } from "next-vibe/identity/lead/enum";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Locator } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as reportsTranslation } from "@/chart-of-accounts/i18n";
import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import leadCreateDefinition from "@/leads/create/definition";
import { scopedTranslation as leadCreateTranslation } from "@/leads/create/i18n";
import exportDefinition from "@/leads/export/definition";
import { scopedTranslation as exportTranslation } from "@/leads/export/i18n";

async function labelTarget(control: Locator): Promise<string> {
  const { id, label, count } = await control.evaluate((node) => {
    const label =
      node instanceof HTMLButtonElement || node instanceof HTMLInputElement
        ? node.labels?.item(0)?.htmlFor
        : undefined;
    return {
      id: node.id,
      label,
      count: document.querySelectorAll(`#${CSS.escape(node.id)}`).length,
    };
  });
  expect(id).toBeTruthy();
  expect(label).toBe(id);
  expect(count).toBe(1);
  return id;
}

describe("Accessible administration form fields", () => {
  const e2e = useE2E("admin-form-accessibility");

  e2e.it(
    "focuses a required select when submission is blocked",
    async (fixtures) => {
      const { page } = fixtures;
      const { t } = leadCreateTranslation.scopedT(E2E_LOCALE);
      const source = page.getByRole("combobox", {
        name: t("post.source.label"),
        exact: true,
      });
      await fixtures.open(leadCreateDefinition.POST, {
        ready: () => source.waitFor(),
      });
      await page
        .getByRole("textbox", { name: t("post.email.label") })
        .fill(fixtures.uniqueEmail("accessible-lead"));
      await page
        .getByRole("textbox", { name: t("post.businessName.label") })
        .fill("E2E Accessible Lead");
      await page
        .getByRole("button", { name: t("post.submitButton.label") })
        .click();
      await source.and(page.locator('[aria-invalid="true"]')).waitFor();
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        await labelTarget(source),
      );
    },
  );

  e2e.it(
    "focuses labeled filters and submits their keyboard-selected values",
    async (fixtures) => {
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "E2E Accessible Forms",
      );
      const { page } = fixtures;
      const { t: reportT } = reportsTranslation.scopedT(E2E_LOCALE);
      const { t: exportT } = exportTranslation.scopedT(E2E_LOCALE);
      const search = fixtures.uniqueEmail("accessible-export");
      await page.route(
        "**/api/**/chart-of-accounts/reports/receivables-aging**",
        async (route) => {
          if (
            new URL(route.request().url()).searchParams.get("companyId") !==
            companyId
          ) {
            await route.abort();
            return;
          }
          await route.continue();
        },
      );
      await page.route("**/api/**/leads/export**", async (route) => {
        if (
          new URL(route.request().url()).searchParams.get("search") !== search
        ) {
          await route.abort();
          return;
        }
        await route.continue();
      });

      const reportFilter = page.getByRole("textbox", {
        name: reportT("receivablesAging.asOfDate.label"),
        exact: true,
      });
      const reportSwitcher = page.getByRole("combobox", {
        name: reportT("reports.switchReport"),
        exact: true,
      });
      const reportQuery = new URLSearchParams({ "arg.companyId": companyId });
      await fixtures.gotoReady(
        `/tools/coa-receivables-aging?${reportQuery}`,
        () => reportFilter.waitFor(),
      );
      await reportSwitcher.waitFor();
      const dateId = await labelTarget(reportFilter);
      await page.locator(`label[for="${dateId}"]`).click();
      expect(
        await reportFilter.evaluate((node) => node === document.activeElement),
      ).toBe(true);
      const asOfDate = "2026-03-25";
      const reportRequest = page.waitForRequest((request) => {
        const url = new URL(request.url());
        return (
          url.pathname.endsWith("/reports/receivables-aging") &&
          url.searchParams.get("asOfDate") === asOfDate &&
          url.searchParams.get("companyId") === companyId
        );
      });
      await reportFilter.fill(asOfDate);
      await reportFilter.press("Tab");
      await page
        .getByRole("button", {
          name: reportT("reports.widget.run"),
          exact: true,
        })
        .click();
      expect(
        new URL((await reportRequest).url()).searchParams.get("asOfDate"),
      ).toBe(asOfDate);

      await page.setViewportSize({ width: 390, height: 844 });
      const format = page.getByRole("combobox", {
        name: exportT("get.format.label"),
        exact: true,
      });
      const exportQuery = new URLSearchParams({ "arg.search": search });
      const exportTool = endpointToUrlSegment(exportDefinition.GET);
      await fixtures.gotoReady(`/tools/${exportTool}?${exportQuery}`, () =>
        format.waitFor(),
      );
      const formatId = await labelTarget(format);
      await format.focus();
      expect(
        await format.evaluate((node) => node === document.activeElement),
      ).toBe(true);
      await format.press("Enter");
      await page
        .getByRole("option", {
          name: exportT("enums.exportFormat.xlsx"),
          exact: true,
        })
        .press("Enter");
      await format
        .getByText(exportT("enums.exportFormat.xlsx"), { exact: true })
        .waitFor();
      expect(await labelTarget(format)).toBe(formatId);
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        formatId,
      );
      await format.click();
      await page
        .getByRole("option", {
          name: exportT("enums.exportFormat.xlsx"),
          exact: true,
        })
        .click();
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        formatId,
      );
      expect(await format.textContent()).toContain(
        exportT("enums.exportFormat.xlsx"),
      );
      const exportRequest = page.waitForResponse((reply) => {
        const url = new URL(reply.url());
        return (
          url.pathname.endsWith("/leads/export") &&
          url.searchParams.get("format") === ExportFormat.XLSX &&
          url.searchParams.get("search") === search
        );
      });
      await page
        .getByRole("button", {
          name: exportT("widget.prepareFile"),
          exact: true,
        })
        .click();
      expect((await exportRequest).ok()).toBe(true);
      await page
        .getByText(exportT("widget.noMatchingRecords"), { exact: true })
        .waitFor();
    },
  );
});
