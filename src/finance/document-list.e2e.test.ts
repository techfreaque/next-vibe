import "server-only";

import { eq } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";
import { scopedTranslation as invoiceCopy } from "@/payment/invoice/list/i18n";

import { scopedTranslation as documentCopy } from "./i18n";

describe("E2E: mobile invoice list recovery and navigation", () => {
  const e2e = useE2E("finance/document-list");

  for (const locale of ["en-GLOBAL", "de-DE", "sk-SK"] as const) {
    e2e.it(
      `${locale}: retries a filtered list, reaches the last status, and opens the selected invoice`,
      async ({ page, cleanup, uniqueEmail, loginAs, baseUrl }) => {
        const companyId = crypto.randomUUID();
        const invoiceId = crypto.randomUUID();
        const reference = `E2E-${invoiceId.slice(0, 8)}`;
        let userId: string | undefined;
        cleanup(async () => {
          await db
            .delete(paymentInvoices)
            .where(eq(paymentInvoices.id, invoiceId));
          await db
            .delete(companyMembers)
            .where(eq(companyMembers.companyId, companyId));
          await db.delete(companies).where(eq(companies.id, companyId));
          if (userId) await deleteTestUser(userId);
        });

        const account = await createTestUser(uniqueEmail("document-list"));
        expect(account.success).toBe(true);
        if (!account.success) return;
        userId = account.data.user.id;
        await db.insert(userRoles).values({ userId, role: UserRole.ADMIN });
        const identity = {
          ...account.data.user,
          roles: [...account.data.user.roles, UserRole.ADMIN],
        };
        await loginAs(identity);
        const session = await createTestSessionToken(identity);
        expect(session.success).toBe(true);
        if (!session.success) return;
        await db.insert(companies).values({
          id: companyId,
          name: `Fixture ${reference}`,
          type: CompanyType.B2B,
          ownerUserId: userId,
          currency: "EUR",
        });
        await db.insert(companyMembers).values({
          companyId,
          userId,
          role: CompanyMemberRole.OWNER,
        });
        await db.insert(paymentInvoices).values({
          id: invoiceId,
          companyId,
          userId,
          providerInvoiceId: `manual-${invoiceId}`,
          invoiceNumber: reference,
          amount: "19.60",
          currency: "EUR",
          status: InvoiceStatus.OPEN,
        });

        const { t } = documentCopy.scopedT(locale);
        const { t: tInvoice } = invoiceCopy.scopedT(locale);
        const listPath = `/api/${locale}/payment/invoice/list`;
        const detailPath = `/api/${locale}/payment/invoice/${invoiceId}/get`;
        let injectFailure = false;
        let failures = 0;
        await page.route(`${baseUrl}/**`, async (route) => {
          const request = route.request();
          const url = new URL(request.url());
          if (
            injectFailure &&
            url.pathname === listPath &&
            url.searchParams.get("search") === reference
          ) {
            failures += 1;
            await route.fulfill({
              status: 503,
              json: {
                success: false,
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                message: "Synthetic transient outage",
              },
            });
          } else {
            await route.continue({
              headers: {
                ...request.headers(),
                authorization: `Bearer ${session.data}`,
              },
            });
          }
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(
          `${baseUrl}/${locale}/tools/payment-invoice-list?companyId=${companyId}`,
        );
        const row = page
          .getByRole("button")
          .filter({ hasText: reference })
          .filter({
            hasText: t("documents.openAction"),
          });
        await row.waitFor();
        await page
          .getByText(
            t("documents.pageSingle", { page: 1, pages: 1, total: 1 }),
            { exact: true },
          )
          .waitFor();

        const filterLabel = tInvoice("widget.filters");
        const activeLabel = t("documents.activeFilters", {
          label: filterLabel,
        });
        await page
          .getByRole("button", { name: filterLabel, exact: true })
          .or(page.getByRole("button", { name: activeLabel, exact: true }))
          .click();
        injectFailure = true;
        await page
          .getByRole("textbox", { name: tInvoice("search.label") })
          .fill(reference);
        const retry = page.getByRole("button", {
          name: t("documents.retry"),
          exact: true,
        });
        await retry.waitFor();
        expect(failures).toBeGreaterThan(0);
        await page
          .getByRole("button", { name: activeLabel, exact: true })
          .waitFor();
        injectFailure = false;
        const retried = page.waitForResponse((response) => {
          const url = new URL(response.url());
          return (
            response.ok() &&
            url.pathname === listPath &&
            url.searchParams.get("search") === reference
          );
        });
        await retry.click();
        await retried;
        await row.waitFor();

        const status = page.getByRole("combobox", {
          name: t("documents.status"),
          exact: true,
        });
        const finalStatus = tInvoice(InvoiceStatus.UNCOLLECTIBLE);
        await status.click();
        const filtered = page.waitForResponse((response) => {
          const url = new URL(response.url());
          return (
            response.ok() &&
            url.pathname === listPath &&
            url.searchParams.get("status") === InvoiceStatus.UNCOLLECTIBLE
          );
        });
        await page
          .getByRole("option", { name: finalStatus, exact: true })
          .click();
        await filtered;
        expect(await status.textContent()).toContain(finalStatus);
        await page
          .getByText(t("documents.emptyTitle"), { exact: true })
          .waitFor();
        const clear = page.getByRole("button", {
          name: t("documents.clear"),
          exact: true,
        });
        await clear.click();
        await row.waitFor();

        const opened = page.waitForResponse(
          (response) =>
            response.ok() && new URL(response.url()).pathname === detailPath,
        );
        await row.click();
        expect((await opened).ok()).toBe(true);
      },
    );
  }
});
