import "server-only";

import { mkdir } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { pathToAliasMap } from "@/generated/endpoints/alias-map";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { scopedTranslation as financeCopy } from "@/finance/i18n";
import { scopedTranslation as userListCopy } from "@/users/list/i18n";

import { paymentInvoiceLines, paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import { scopedTranslation } from "./i18n";

const fixtures = [
  {
    locale: "en-GLOBAL",
    company: "Linden Studio",
    customer: "North Coast Books",
    item: "Catalogue design",
  },
  {
    locale: "de-DE",
    company: "Lindenatelier",
    customer: "Buchhandlung an der Küste",
    item: "Kataloggestaltung",
  },
  {
    locale: "sk-SK",
    company: "Ateliér Lipa",
    customer: "Kníhkupectvo pri rieke",
    item: "Návrh katalógu",
  },
] as const;

describe("E2E: invoice draft save and retry", () => {
  const e2e = useE2E("payment/invoice/create");

  for (const { locale, company, customer, item } of fixtures) {
    e2e.it(
      `${locale}: retains a populated draft after save failure and retries successfully`,
      async ({ page, cleanup, uniqueEmail, loginAs, baseUrl }) => {
        const companyId = crypto.randomUUID();
        const marker = companyId.slice(0, 6);
        const companyName = `${company} ${marker}`;
        const customerName = `${customer} ${marker}`;
        let ownerId: string | undefined;
        let customerId: string | undefined;
        cleanup(async () => {
          // Deleting drafts cascades to their lines.
          await db
            .delete(paymentInvoices)
            .where(eq(paymentInvoices.companyId, companyId));
          await db
            .delete(companyMembers)
            .where(eq(companyMembers.companyId, companyId));
          await db.delete(companies).where(eq(companies.id, companyId));
          if (customerId) await deleteTestUser(customerId);
          if (ownerId) await deleteTestUser(ownerId);
        });

        const owner = await createTestUser(uniqueEmail("invoice-draft-owner"));
        expect(owner.success).toBe(true);
        if (!owner.success) return;
        ownerId = owner.data.user.id;
        const buyer = await createTestUser(
          uniqueEmail("invoice-draft-buyer"),
          customerName,
        );
        expect(buyer.success).toBe(true);
        if (!buyer.success) return;
        customerId = buyer.data.user.id;
        await db
          .insert(userRoles)
          .values({ userId: ownerId, role: UserRole.ADMIN });
        const identity = {
          ...owner.data.user,
          roles: [...owner.data.user.roles, UserRole.ADMIN],
        };
        await loginAs(identity);
        const session = await createTestSessionToken(identity);
        expect(session.success).toBe(true);
        if (!session.success) return;
        await db.insert(companies).values({
          id: companyId,
          ownerUserId: ownerId,
          name: companyName,
          type: CompanyType.B2B,
          currency: "EUR",
        });
        await db.insert(companyMembers).values({
          companyId,
          userId: ownerId,
          role: CompanyMemberRole.OWNER,
        });

        const { t } = scopedTranslation.scopedT(locale);
        const { t: tFinance } = financeCopy.scopedT(locale);
        const { t: tUsers } = userListCopy.scopedT(locale);
        const createPath = `/api/${locale}/payment/invoice/create`;
        let releaseFailure: (() => void) | undefined;
        const firstSave = new Promise<void>((resolve) => {
          releaseFailure = resolve;
        });
        cleanup(async () => releaseFailure?.());
        let submissions = 0;
        const headers = { authorization: `Bearer ${session.data}` };
        await page.route(`${baseUrl}/**`, async (route) => {
          const request = route.request();
          if (
            new URL(request.url()).pathname === createPath &&
            request.method() === "POST"
          ) {
            submissions += 1;
            if (submissions === 1) {
              await firstSave;
              await route.fulfill({
                status: 503,
                json: {
                  success: false,
                  errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                  message: "Synthetic transient outage",
                },
              });
              return;
            }
          }
          await route.continue({
            headers: { ...request.headers(), ...headers },
          });
        });
        const output = "scratchpad/erp/shots/v2/invoice-draft-save";
        await mkdir(output, { recursive: true });
        await page.addInitScript(() =>
          localStorage.setItem("theme_v2", "system"),
        );
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({
          colorScheme: "light",
          reducedMotion: "reduce",
        });
        await page.goto(
          `${baseUrl}/${locale}/tools/${pathToAliasMap.payment_invoice_create_POST}`,
        );
        const switcher = page.locator("#erp-company-switch");
        await switcher.click();
        await page.getByRole("menuitemradio").filter({ hasText: companyName }).click();
        await page
          .getByRole("button", {
            name: tFinance("documents.chooseCustomer"),
            exact: true,
          })
          .click();
        await page
          .getByRole("dialog")
          .getByRole("textbox", {
            name: tUsers("get.fields.search.label"),
            exact: true,
          })
          .fill(customerName);
        await page
          .getByRole("dialog")
          .getByText(customerName, { exact: true })
          .filter({ visible: true })
          .click();

        await page
          .getByRole("button", { name: t("post.widget.addItem"), exact: true })
          .click();
        const description = page.getByRole("textbox", {
          name: t("post.widget.item"),
          exact: true,
        });
        await description.fill(item);
        await page
          .getByLabel(t("post.widget.quantity"), { exact: true })
          .fill("2");
        await page
          .getByLabel(t("post.widget.unitPrice"), { exact: true })
          .fill("45");
        await description.focus();
        const summary = page.getByText(t("post.widget.summary"), {
          exact: true,
        });
        const total = page
          .getByText(formatMoney(90, "EUR", locale), { exact: true })
          .last();
        await total.waitFor();

        const capture = async (state: string): Promise<void> => {
          for (const colorScheme of ["light", "dark"] as const) {
            await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
            await page.setViewportSize({ width: 1440, height: 960 });
            await page.screenshot({
              path: `${output}/${locale}-${state}-desktop-${colorScheme}.png`,
              fullPage: true,
            });
            await page.setViewportSize({ width: 390, height: 844 });
            await page.screenshot({
              path: `${output}/${locale}-${state}-phone-${colorScheme}.png`,
              fullPage: true,
            });
            await summary.scrollIntoViewIfNeeded();
            await total.scrollIntoViewIfNeeded();
            await page.screenshot({
              path: `${output}/${locale}-${state}-phone-totals-${colorScheme}.png`,
            });
          }
        };
        await capture("ready");
        const save = page.getByRole("button", {
          name: t("post.widget.submit"),
          exact: true,
        });
        try {
          await save.click();
          await page
            .locator('[aria-live="polite"]')
            .filter({ hasText: t("post.widget.saving") })
            .waitFor();
          expect(
            await page
              .getByRole("button", {
                name: t("post.widget.saving"),
                exact: true,
              })
              .isDisabled(),
          ).toBe(true);
          await capture("saving");
        } finally {
          releaseFailure?.();
        }
        const retry = page.getByRole("button", {
          name: t("post.widget.retrySave"),
          exact: true,
        });
        await retry.waitFor();
        await page
          .getByText(t("post.widget.saveFailed"), { exact: true })
          .waitFor();
        expect(await description.inputValue()).toBe(item);
        expect(await description.isEditable()).toBe(true);
        await capture("save-error");
        const saved = page.waitForResponse(
          (response) =>
            response.ok() &&
            new URL(response.url()).pathname === createPath &&
            response.request().method() === "POST",
        );
        await retry.click();
        expect((await saved).ok()).toBe(true);
        expect(submissions).toBe(2);
        const invoices = await db
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        expect(invoices).toHaveLength(1);
        const invoice = invoices[0];
        if (!invoice) return;
        expect(invoice).toMatchObject({
          amount: "90.00",
          currency: "EUR",
          status: InvoiceStatus.DRAFT,
          metadata: { customerId },
        });
        const lines = await db
          .select()
          .from(paymentInvoiceLines)
          .where(eq(paymentInvoiceLines.invoiceId, invoice.id));
        expect(lines).toHaveLength(1);
        expect(lines[0]?.description).toBe(item);
        await saveAdminViewMatrix(
          page,
          "invoice-draft-save",
          locale + "-saved",
          async () => {
            await page
              .getByText(
                t("post.widget.draftSavedNumber", {
                  number: invoice.invoiceSequenceNumber ?? 0,
                }),
                { exact: true },
              )
              .waitFor();
            await page
              .getByText(customerName, { exact: true })
              .filter({ visible: true })
              .first()
              .waitFor();
            await page
              .getByRole("button", {
                name: t("post.widget.viewButton"),
                exact: true,
              })
              .waitFor();
            await page
              .getByText(formatMoney(90, "EUR", locale), { exact: true })
              .filter({ visible: true })
              .first()
              .waitFor();
          },
        );
      },
    );
  }
});
