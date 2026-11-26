import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { and, eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { EndpointErrorTypes } from "next-vibe/core/definition/enums";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { scopedTranslation as hookTranslation } from "next-vibe/unified-ui/hooks/i18n";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Locator, Page, Route } from "playwright";
import { describe, expect } from "vitest";

import {
  getAtlasFixture,
  prepareAtlasCompany,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companyMembers } from "@/companies/db";
import transferGet from "@/inventory/transfer/[transferId]/get/definition";
import { paymentInvoices } from "@/payment/db";
import invoiceGet from "@/payment/invoice/[invoiceId]/get/definition";

import { scopedTranslation } from "./i18n";

async function openRecord(page: Page, url: URL): Promise<void> {
  let response = await page.goto(url.toString(), {
    waitUntil: "domcontentloaded",
  });
  for (let retry = 0; response?.status() === 503 && retry < 3; retry++) {
    await Bun.sleep(5000);
    response = await page.reload({ waitUntil: "domcontentloaded" });
  }
  expect(response?.status()).toBe(200);
}

async function capture(
  page: Page,
  name: string,
  locale: string,
): Promise<void> {
  if (process.env["ADMIN_RECORD_ERROR_SHOTS"] !== "1") {
    return;
  }
  const directory = "scratchpad/erp/shots/v2/record-recovery";
  await mkdir(directory, { recursive: true });
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["phone", 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.screenshot({
      path: `${directory}/${name}-${locale}-${device}.png`,
      animations: "disabled",
    });
  }
}

async function waitForRecordError(
  page: Page,
  expected: Locator,
  retry: Locator,
  path: string,
): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt++) {
    await expected.or(retry).first().waitFor();
    if (await expected.isVisible()) {
      return;
    }
    const response = page.waitForResponse((reply) =>
      new URL(reply.url()).pathname.endsWith(path),
    );
    await retry.click();
    await response;
  }
  await expected.waitFor();
}

describe("Admin record recovery", () => {
  const e2e = useE2E("admin-record-recovery");

  e2e.it(
    "returns from forbidden and missing records and retries a transient error",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E Restricted Invoice Company",
      );
      const invoiceId = randomUUID();
      const transferId = randomUUID();
      fixtures.cleanup(async () => {
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.id, invoiceId));
      });
      await db.insert(paymentInvoices).values({
        id: invoiceId,
        companyId,
        userId,
        providerInvoiceId: invoiceId,
        invoiceNumber: "E2E-RESTRICTED-001",
        amount: "10.00",
        currency: "EUR",
      });
      await db
        .delete(companyMembers)
        .where(
          and(
            eq(companyMembers.companyId, companyId),
            eq(companyMembers.userId, userId),
          ),
        );

      const invoicePath = `payment/invoice/${invoiceId}/get`;
      const transferPath = `inventory/transfer/${transferId}/get`;
      expect(
        (
          await getAtlasFixture(
            `${baseUrl}/api/en-US/${invoicePath}`,
            {},
            headers,
          )
        ).status,
      ).toBe(403);
      expect(
        (
          await getAtlasFixture(
            `${baseUrl}/api/en-US/${transferPath}`,
            {},
            headers,
          )
        ).status,
      ).toBe(404);

      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const invoiceT = invoiceGet.GET.scopedTranslation.scopedT(locale).t;
        const transferT = transferGet.GET.scopedTranslation.scopedT(locale).t;
        const invoiceUrl = new URL(
          `/${locale}/tools/${endpointToUrlSegment(invoiceGet.GET)}`,
          baseUrl,
        );
        invoiceUrl.searchParams.set("arg.invoiceId", invoiceId);
        const transferUrl = new URL(
          `/${locale}/tools/${endpointToUrlSegment(transferGet.GET)}`,
          baseUrl,
        );
        transferUrl.searchParams.set("arg.transferId", transferId);
        const backLabel = t("admin.recordBackTo", { section: "{{section}}" })
          .split("{{section}}")[0]
          .trim();
        const back = page
          .getByRole("button")
          .filter({ hasText: backLabel.trim() });
        const retry = page.getByRole("button", {
          name: t("catalog.retry"),
          exact: true,
        });

        await openRecord(page, invoiceUrl);
        await waitForRecordError(
          page,
          page.getByText(t("admin.recordAccessDenied"), { exact: true }),
          retry,
          invoicePath,
        );
        await page
          .getByText(
            invoiceT(
              invoiceGet.GET.errorTypes[EndpointErrorTypes.FORBIDDEN]
                .description,
            ),
            { exact: true },
          )
          .waitFor();
        expect(await retry.count()).toBe(0);
        await capture(page, "invoice-forbidden", locale);
        await back.click();
        await page.waitForURL((url) =>
          url.pathname.endsWith("/tools/payment-invoice-list"),
        );

        if (locale === "en-US") {
          await page.route(
            `**/api/${locale}/${transferPath}*`,
            (route) =>
              route.fulfill({
                status: 503,
                json: {
                  success: false,
                  message: "E2E transient record error",
                  errorType: {
                    ...ErrorResponseTypes.UNKNOWN_ERROR,
                    errorCode: 503,
                  },
                },
              }),
            { times: 1 },
          );
        }
        let stalledRead: Route | undefined;
        if (locale === "de-DE") {
          await page.route(`**/api/${locale}/${transferPath}*`, (route) => {
            if (!stalledRead) {
              stalledRead = route;
              return;
            }
            return route.continue({
              headers: { ...route.request().headers(), ...headers },
            });
          });
        }
        await openRecord(page, transferUrl);
        if (locale === "de-DE") {
          await page
            .getByText(
              hookTranslation
                .scopedT(locale)
                .t("apiUtils.errors.recordTimeout"),
              { exact: true },
            )
            .waitFor();
          await stalledRead?.abort().catch(() => undefined);
          await capture(page, "transfer-timeout", locale);
        }
        if (locale !== "sk-SK") {
          await retry.waitFor();
          const returned = page.waitForResponse((reply) =>
            new URL(reply.url()).pathname.endsWith(transferPath),
          );
          await retry.click();
          expect((await returned).status()).toBeGreaterThanOrEqual(400);
        }
        await waitForRecordError(
          page,
          page.getByText(
            transferT(
              transferGet.GET.errorTypes[EndpointErrorTypes.NOT_FOUND].title,
            ),
            { exact: true },
          ),
          retry,
          transferPath,
        );
        expect(await retry.count()).toBe(0);
        await capture(page, "transfer-missing", locale);
        await back.click();
        await page.waitForURL((url) =>
          url.pathname.endsWith("/tools/inventory-transfers"),
        );
      }
    },
  );
});
