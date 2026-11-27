import { eq } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import {
  ExportFormat,
  LeadSource,
  LeadStatus,
  MimeType,
} from "next-vibe/identity/lead/enum";
import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { read } from "xlsx";
import { z } from "zod";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("Lead spreadsheet export", () => {
  const e2e = useE2E("leads/filtered-export");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(
      `downloads the selected lead as CSV and Excel in ${locale}`,
      async (fixtures) => {
        const { page } = fixtures;
        const id = crypto.randomUUID();
        const email = fixtures.uniqueEmail("export");
        const unmatched = fixtures.uniqueEmail("export-no-matches");
        fixtures.cleanup(async () => {
          await db.delete(leads).where(eq(leads.id, id));
        });
        const createdAt = new Date("2026-03-25T14:20:00.000Z");
        await db.insert(leads).values({
          id,
          email,
          businessName: "E2E Bookshop",
          contactName: "Mária, K.",
          phone: "012345",
          ipAddress: "192.0.2.44",
          userAgent: "E2E-Fixture-Browser",
          country: Countries.GLOBAL,
          language: Languages.EN,
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
          createdAt,
        });
        const auth = await authAtlas(fixtures, await resolveTestAdminUser());
        const http = atlasRequest(
          auth.authorization.slice("Bearer ".length),
          auth.cookie,
        );
        const t = scopedTranslation.scopedT(locale).t;
        let exports = 0;
        const releaseFailure = Promise.withResolvers<void>();
        await page.setViewportSize({ width: 390, height: 844 });
        await page.route("**/api/**/leads/export**", async (route) => {
          exports++;
          const url = new URL(route.request().url());
          const search = url.searchParams.get("search");
          if (search !== email && search !== unmatched) {
            await route.abort();
            return;
          }
          if (exports === 1) {
            await releaseFailure.promise;
            await route.fulfill({
              status: 503,
              json: {
                success: false,
                message: "E2E temporary export failure",
                errorType: {
                  ...ErrorResponseTypes.UNKNOWN_ERROR,
                  errorCode: 503,
                },
              },
            });
            return;
          }
          await route.continue();
        });
        const prepare = page.getByRole("button", {
          name: t("widget.prepareFile"),
          exact: true,
        });
        const query = new URLSearchParams({
          "arg.search": email,
          "arg.dateFrom": "2026-03-25",
          "arg.dateTo": "2026-03-25",
        });
        await fixtures.goto(`/tools/leads/export/GET?${query}`, locale);
        await prepare.waitFor();
        await saveAdminReviewScreenshots(page, "leads_export_GET", locale);
        expect(exports).toBe(0);
        const actionBounds = await prepare.boundingBox();
        expect(actionBounds && actionBounds.y + actionBounds.height <= 844).toBe(
          true,
        );
        const advanced = page.getByRole("button", {
          name: t("widget.advancedFilters"),
        });
        expect(await advanced.getAttribute("aria-expanded")).toBe("false");
        await advanced
          .getByText(t("widget.activeFilters", { count: "2" }), { exact: true })
          .waitFor();
        await advanced.press("Enter");
        expect(await advanced.getAttribute("aria-expanded")).toBe("true");
        await page.getByText(t("get.dateFrom.label"), { exact: true }).waitFor();
        await advanced.press("Enter");
        expect(await advanced.getAttribute("aria-expanded")).toBe("false");

        const failure = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname.endsWith("/leads/export") &&
            r.status() === 503,
        );
        try {
          await prepare.click();
          const generating = page.getByRole("button", {
            name: t("widget.generatingExport"),
            exact: true,
          });
          await generating.waitFor();
          expect(await generating.isDisabled()).toBe(true);
          expect(
            await page
              .getByRole("status")
              .filter({ hasText: t("widget.generatingExportHint") })
              .isVisible(),
          ).toBe(true);
        } finally {
          releaseFailure.resolve();
        }
        expect((await failure).status()).toBe(503);
        const retry = page.getByRole("button", {
          name: t("widget.retry"),
          exact: true,
        });
        await page.getByText(t("widget.exportFailed"), { exact: true }).waitFor();
        const [csv] = await Promise.all([
          page.waitForResponse((r) =>
            new URL(r.url()).pathname.endsWith("/leads/export"),
          ),
          retry.click(),
        ]);
        expect(csv.ok()).toBe(true);
        const payload = z
          .object({
            success: z.literal(true),
            data: definition.GET.responseSchema,
          })
          .parse(await csv.json());
        expect(payload.data.totalRecords).toBe(1);
        expect(payload.data.mimeType).toBe(MimeType.CSV);
        const downloadButton = page.getByRole("button", {
          name: t("widget.download"),
          exact: true,
        });
        await downloadButton.waitFor();
        expect(await downloadButton.count()).toBe(1);
        const fileSize = new Intl.NumberFormat(locale, {
          style: "unit",
          unit: "byte",
          unitDisplay: "long",
        }).format(Buffer.from(payload.data.fileContent, "base64").length);
        await page
          .getByText(t("widget.fileDetails", { count: "1", size: fileSize }), {
            exact: true,
          })
          .waitFor();
        const download = page.waitForEvent("download");
        await downloadButton.click();
        const file = await download;
        expect(file.suggestedFilename()).toMatch(/\.csv$/u);
        const stream = await file.createReadStream();
        const parts: Buffer[] = [];
        if (stream) {
          for await (const chunk of stream) {
            parts.push(Buffer.from(chunk));
          }
        }
        expect(Buffer.concat(parts).toString("utf8")).toContain(
          '"Mária, K.",012345',
        );
        expect(Buffer.concat(parts).toString("utf8")).not.toContain("192.0.2.44");
        expect(Buffer.concat(parts).toString("utf8")).not.toContain(
          "E2E-Fixture-Browser",
        );
        const excel = await http.get("/api/" + locale + "/leads/export", {
          params: {
            format: ExportFormat.XLSX,
            search: email,
            includeMetadata: "true",
            includeEngagementData: "false",
          },
        });
        const workbookBody = z
          .object({
            success: z.literal(true),
            data: definition.GET.responseSchema,
          })
          .parse(await excel.json());
        expect(workbookBody.data.totalRecords).toBe(1);
        expect(workbookBody.data.mimeType).toBe(MimeType.XLSX);
        const bytes = Buffer.from(workbookBody.data.fileContent, "base64");
        expect(bytes.subarray(0, 2).toString()).toBe("PK");
        const workbook = read(bytes, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        expect(sheet["C2"]?.v).toBe("Mária, K.");
        expect(sheet["D2"]?.v).toBe("012345");
        expect(sheet["M2"]?.v).toBe("192.0.2.44");
        expect(sheet["N2"]?.v).toBe("E2E-Fixture-Browser");
        expect(sheet["!ref"]).toBe("A1:S2");
        const excluded = await http.get("/api/" + locale + "/leads/export", {
          params: {
            format: ExportFormat.CSV,
            search: email,
            includeMetadata: "false",
          },
        });
        const excludedBody = z
          .object({
            success: z.literal(true),
            data: definition.GET.responseSchema,
          })
          .parse(await excluded.json());
        expect(
          Buffer.from(excludedBody.data.fileContent, "base64").toString("utf8"),
        ).not.toContain("192.0.2.44");

        await page
          .getByRole("textbox", { name: t("get.search.label"), exact: true })
          .fill(unmatched);
        const empty = page.waitForResponse((result) => {
          const url = new URL(result.url());
          return (
            url.pathname.endsWith("/leads/export") &&
            url.searchParams.get("search") === unmatched
          );
        });
        await prepare.click();
        expect((await empty).ok()).toBe(true);
        await page
          .getByText(t("widget.noMatchingRecords"), { exact: true })
          .waitFor();
        expect(await downloadButton.count()).toBe(0);
        await page
          .getByRole("button", { name: t("widget.changeFilters"), exact: true })
          .click();
        expect(await advanced.getAttribute("aria-expanded")).toBe("true");
        const search = page.getByRole("textbox", {
          name: t("get.search.label"),
          exact: true,
        });
        expect(await search.inputValue()).toBe(unmatched);
        expect(
          await search.evaluate((input) => input === document.activeElement),
        ).toBe(true);
      },
      120000,
    );
  }
});
