import { mkdir } from "node:fs/promises";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Locator } from "playwright";
import { describe, expect } from "vitest";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import journalApi from "@/chart-of-accounts/journal/[entryId]/get/definition";
import ledgerApi from "@/chart-of-accounts/ledger/[accountId]/definition";
import agingApi from "@/chart-of-accounts/reports/receivables-aging/definition";
import {
  authAtlas,
  getAtlasFixture,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import onboarding from "@/companies/[companyId]/onboard/definition";
import { scopedTranslation as phoneCopy } from "next-vibe/ui/i18n";
import companyCreate from "@/companies/create/definition";
import { companies } from "@/companies/db";
import { CompanyType } from "@/companies/enum";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus, ManualPaymentMethod } from "@/payment/enum";

import invoiceApi from "../[invoiceId]/get/definition";
import paymentApi from "../[invoiceId]/record-payment/definition";
import issueApi from "../[invoiceId]/send/definition";
import invoiceCreate from "../create/definition";

const directory = "scratchpad/erp/shots/v2/invoice-journey";

describe("Fresh-company first invoice browser journey", () => {
  const e2e = useE2E("payment/invoice/noob-journey");
  e2e.it(
    "sets up books, issues a draft, receives bank and cash, and explains the ledger",
    async (fixtures) => {
      const { page, cleanup, uniqueEmail, capture, open } = fixtures;
      const email = uniqueEmail("first-invoice-owner");
      const companyName = `First Invoice Studio ${crypto.randomUUID().slice(0, 8)}`;
      cleanup(async () => {
        const [owner] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email));
        if (!owner) return;
        const [company] = await db
          .select({ id: companies.id })
          .from(companies)
          .where(
            and(
              eq(companies.ownerUserId, owner.id),
              eq(companies.name, companyName),
            ),
          );
        if (company) {
          await db.transaction(async (tx) => {
            await tx
              .delete(paymentInvoices)
              .where(eq(paymentInvoices.companyId, company.id));
            await tx
              .delete(journalEntries)
              .where(eq(journalEntries.companyId, company.id));
            await tx
              .delete(accountingPeriods)
              .where(eq(accountingPeriods.companyId, company.id));
            await tx
              .delete(accountNodes)
              .where(eq(accountNodes.companyId, company.id));
            await tx.delete(companies).where(eq(companies.id, company.id));
          });
          expect(
            await db
              .select({ id: companies.id })
              .from(companies)
              .where(eq(companies.id, company.id)),
          ).toEqual([]);
        }
        await deleteTestUser(owner.id);
      });
      const owner = await createTestUser(email);
      expect(owner.success).toBe(true);
      if (!owner.success) return;
      await db
        .insert(userRoles)
        .values({ userId: owner.data.user.id, role: UserRole.ADMIN })
        .onConflictDoNothing();
      const headers = await authAtlas(fixtures, {
        ...owner.data.user,
        roles: [UserRole.ADMIN],
      });
      await mkdir(directory, { recursive: true });
      await page.setViewportSize({ width: 1440, height: 900 });
      const shot = (name: string): Promise<Buffer> =>
        page.screenshot({ path: `${directory}/${name}.png`, fullPage: true });

      const { t: companyT } =
        companyCreate.POST.scopedTranslation.scopedT(E2E_LOCALE);
      const { t: onboardT } =
        onboarding.POST.scopedTranslation.scopedT(E2E_LOCALE);
      const { t: createT } =
        invoiceCreate.POST.scopedTranslation.scopedT(E2E_LOCALE);
      const { t: invoiceT } =
        invoiceApi.GET.scopedTranslation.scopedT(E2E_LOCALE);
      const { t: issueT } = issueApi.POST.scopedTranslation.scopedT(E2E_LOCALE);
      const { t: paymentT } =
        paymentApi.POST.scopedTranslation.scopedT(E2E_LOCALE);
      const { t: agingT } = agingApi.GET.scopedTranslation.scopedT(E2E_LOCALE);
      const companyForm = await open(companyCreate.POST);
      await companyForm.fill({
        details: {
          name: companyName,
          type: CompanyType.B2B,
          country: "DE",
          currency: "EUR",
          email: undefined,
          phone: undefined,
          website: undefined,
        },
      });
      const callingCode = page.getByRole("combobox", {
        name: phoneCopy
          .scopedT(E2E_LOCALE)
          .t("common.callingCode", { prefix: "+1" }),
        exact: true,
      });
      await callingCode.click();
      await page.getByRole("option", { name: /\+421/u }).click();
      await page
        .getByRole("textbox", {
          name: companyT("post.phone.label"),
          exact: true,
        })
        .fill("900123456");
      const create = await capture(companyCreate.POST, () =>
        page
          .getByRole("button", { name: companyT("post.title"), exact: true })
          .last()
          .click(),
      );
      expect(create.response.success).toBe(true);
      if (!create.response.success) return;
      const companyId = create.response.data.result.id;
      expect(
        await db
          .select({ phone: companies.phone })
          .from(companies)
          .where(eq(companies.id, companyId)),
      ).toEqual([{ phone: "+421 900123456" }]);
      await page
        .getByRole("button", {
          name: companyT("post.widget.setupAccounting"),
          exact: true,
        })
        .click();
      await page
        .getByRole("checkbox", {
          name: onboardT("post.period.open"),
          exact: true,
        })
        .check();
      const setup = await capture(onboarding.POST, () =>
        page
          .getByRole("button", {
            name: onboardT("post.widget.submit"),
            exact: true,
          })
          .click(),
      );
      expect(setup.response).toMatchObject({
        success: true,
        data: { companyIdOut: companyId, periodCreated: true },
      });
      await page
        .getByText(onboardT("post.success.title"), { exact: true })
        .waitFor();
      await shot("01-accounting-ready");

      await page
        .getByText(onboardT("post.widget.invoice"), { exact: true })
        .click();
      const line = page.getByRole("textbox", {
        name: createT("post.widget.item"),
        exact: true,
      });
      if (!(await line.isVisible())) {
        await page
          .getByRole("button", {
            name: createT("post.widget.addItem"),
            exact: true,
          })
          .click();
      }
      await line.fill("Synthetic consulting session");
      await page
        .getByLabel(createT("post.widget.unitPrice"), { exact: true })
        .fill("120");
      const drafted = await capture(invoiceCreate.POST, () =>
        page
          .getByRole("button", {
            name: createT("post.widget.submit"),
            exact: true,
          })
          .click(),
      );
      expect(drafted.response).toMatchObject({
        success: true,
        data: {
          invoice: { companyId, currency: "EUR", status: InvoiceStatus.DRAFT },
        },
      });
      if (!drafted.response.success) return;
      const invoiceId = drafted.response.data.invoice.id;
      const viewed = await capture(invoiceApi.GET, () =>
        page
          .getByRole("button", {
            name: createT("post.widget.viewButton"),
            exact: true,
          })
          .click(),
      );
      expect(viewed.response).toMatchObject({
        success: true,
        data: { status: InvoiceStatus.DRAFT },
      });
      await page
        .getByRole("button", {
          name: invoiceT("widget.issueInvoice"),
          exact: true,
        })
        .click();
      await page
        .getByRole("button", { name: issueT("widget.submit"), exact: true })
        .waitFor();
      await shot("02-issue-confirmation");
      const issued = await capture(issueApi.POST, () =>
        page
          .getByRole("button", { name: issueT("widget.submit"), exact: true })
          .click(),
      );
      expect(issued.response.success).toBe(true);
      if (!issued.response.success) return;
      const viewUrl = issued.response.data.viewUrl;
      expect(Boolean(viewUrl)).toBe(true);
      if (!viewUrl) return;
      expect(new URL(viewUrl).pathname).toBe(`/invoice/${invoiceId}`);
      expect(Boolean(new URL(viewUrl).searchParams.get("token"))).toBe(true);
      const signedLink = page.getByText(viewUrl, { exact: true });
      await signedLink.waitFor();
      await fixtures.context.grantPermissions([
        "clipboard-read",
        "clipboard-write",
      ]);
      await page
        .getByRole("button", { name: issueT("widget.copy"), exact: true })
        .click();
      await page
        .getByRole("button", { name: issueT("widget.copied"), exact: true })
        .waitFor();
      await page.screenshot({
        path: `${directory}/02b-issued-link.png`,
        fullPage: true,
        mask: [signedLink],
        maskColor: "#364152",
      });
      await page
        .getByRole("button", { name: issueT("widget.back"), exact: true })
        .last()
        .click();

      const inspectInvoice = () =>
        db
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.id, invoiceId));
      const [openInvoice] = await inspectInvoice();
      expect(openInvoice).toMatchObject({
        status: InvoiceStatus.OPEN,
        invoiceNumber: "INV-1",
      });
      const invoiceNumber = openInvoice?.invoiceNumber;
      const invoiceEntryId = openInvoice?.journalEntryId;
      expect(Boolean(invoiceNumber && invoiceEntryId)).toBe(true);
      if (!invoiceNumber || !invoiceEntryId) return;

      const api = `${fixtures.baseUrl}/api/${E2E_LOCALE}`;
      const agingParams = { companyId, currency: "EUR" };
      const agingRequest = () =>
        getAtlasFixture(
          `${api}/chart-of-accounts/reports/receivables-aging`,
          agingParams,
          headers,
        );
      const firstAging = await agingRequest();
      expect(firstAging.ok).toBe(true);
      expect(await firstAging.json()).toMatchObject({
        success: true,
        data: { totalsTotal: 120 },
      });
      const retry = page
        .getByRole("button", { name: "Try again", exact: true })
        .last();
      const waitForInvoice = async (ready: Locator): Promise<void> => {
        await ready.or(retry).first().waitFor();
        if (!(await ready.isVisible()) && (await retry.isVisible())) {
          // Atlas lead-pool saturation returns a transient 503 with Retry-After: 5.
          await new Promise<void>((resolve) => setTimeout(resolve, 5_000));
          await retry.click();
          await ready.waitFor();
        }
      };
      const paymentAction = page
        .getByRole("button", {
          name: invoiceT("widget.recordPayment"),
          exact: true,
        })
        .last();
      const paidStatus = page
        .getByText(invoiceT("widget.status.paid"), { exact: true })
        .last();
      const invoicePath = `/tools/payment-invoice-get?arg.invoiceId=${invoiceId}`;
      const record = async (
        amount: string,
        method:
          | typeof ManualPaymentMethod.BANK_TRANSFER
          | typeof ManualPaymentMethod.CASH,
      ): Promise<void> => {
        await waitForInvoice(paymentAction);
        await page
          .getByRole("button", {
            name: invoiceT("widget.recordPayment"),
            exact: true,
          })
          .last()
          .click();
        await page
          .getByLabel(paymentT("amount.label"), { exact: true })
          .fill(amount);
        await page
          .getByRole("combobox", {
            name: paymentT("method.label"),
            exact: true,
          })
          .click();
        await page
          .getByRole("option", {
            name: paymentT(
              method === ManualPaymentMethod.CASH
                ? "enums.manualPaymentMethod.cash"
                : "enums.manualPaymentMethod.bankTransfer",
            ),
            exact: true,
          })
          .click();
        const saved = await capture(paymentApi.POST, () =>
          page
            .getByRole("button", {
              name: paymentT("widget.submit"),
              exact: true,
            })
            .click(),
        );
        expect(saved.response.success).toBe(true);
      };
      await record("40", ManualPaymentMethod.BANK_TRANSFER);
      const partial = await agingRequest();
      expect(await partial.json()).toMatchObject({
        success: true,
        data: { totalsTotal: 80, reportCompanyId: companyId },
      });

      await open(agingApi.GET, {
        query: agingParams,
        ready: () =>
          page
            .getByRole("button", {
              name: agingT("reports.widget.run"),
              exact: true,
            })
            .last()
            .waitFor(),
      });
      const aging = await capture(agingApi.GET, () =>
        page
          .getByRole("button", {
            name: agingT("reports.widget.run"),
            exact: true,
          })
          .last()
          .click(),
      );
      expect(aging.response).toMatchObject({
        success: true,
        data: { totalsTotal: 80, reportCompanyId: companyId },
      });
      const groupedInvoice = page.getByRole("button", {
        name: invoiceNumber,
        exact: true,
      });
      await groupedInvoice.click();
      const agingInvoice = page
        .getByText(invoiceNumber, { exact: true })
        .filter({ visible: true })
        .last();
      await agingInvoice.waitFor();
      await shot("03-partial-aging");
      const drilldown = await capture(invoiceApi.GET, () =>
        agingInvoice.click(),
      );
      expect(drilldown.response).toMatchObject({
        success: true,
        data: { amountDue: 80 },
      });

      await record("80", ManualPaymentMethod.CASH);
      const [paid] = await inspectInvoice();
      expect(paid).toMatchObject({ status: InvoiceStatus.PAID });
      const emptyAging = await agingRequest();
      expect(await emptyAging.json()).toMatchObject({
        success: true,
        data: { totalsTotal: 0 },
      });

      const audit = await db
        .select({
          id: journalEntries.id,
          source: journalEntries.sourceType,
          status: journalEntries.status,
          type: journalEntryLines.type,
          amount: journalEntryLines.amount,
          account: accountNodes.subtype,
          accountId: journalEntryLines.accountId,
        })
        .from(journalEntries)
        .innerJoin(
          journalEntryLines,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .innerJoin(
          accountNodes,
          eq(accountNodes.id, journalEntryLines.accountId),
        )
        .where(eq(journalEntries.companyId, companyId));
      expect(audit).toHaveLength(6);
      expect(
        audit.every(({ status }) => status === JournalEntryStatus.POSTED),
      ).toBe(true);
      expect(audit).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: invoiceEntryId,
            source: JournalSourceType.AR_INVOICE,
            type: LineType.DEBIT,
            amount: 120,
            account: AccountSubtype.ACCOUNTS_RECEIVABLE,
          }),
          expect.objectContaining({
            source: JournalSourceType.AR_PAYMENT,
            type: LineType.DEBIT,
            amount: 40,
            account: AccountSubtype.BANK,
          }),
          expect.objectContaining({
            source: JournalSourceType.AR_PAYMENT,
            type: LineType.DEBIT,
            amount: 80,
            account: AccountSubtype.CASH,
          }),
        ]),
      );
      await waitForInvoice(paidStatus);
      await shot("04-paid-receipts");
      const journal = await capture(journalApi.GET, () =>
        page
          .getByRole("button", {
            name: invoiceT("widget.viewJournalEntry"),
            exact: true,
          })
          .click(),
      );
      expect(journal.response.success).toBe(true);
      await page
        .getByText(`AR invoice: ${invoiceNumber}`, { exact: true })
        .last()
        .waitFor();
      await shot("05-audit-journal");
      if (!journal.response.success) return;
      const receivable = audit.find(
        ({ source, account }) =>
          source === JournalSourceType.AR_INVOICE &&
          account === AccountSubtype.ACCOUNTS_RECEIVABLE,
      );
      const accountLink = journal.response.data.result.lines.find(
        ({ accountId }) => accountId === receivable?.accountId,
      );
      expect(accountLink).toBeDefined();
      if (!accountLink) return;
      const accountLabel =
        [accountLink.accountCode, accountLink.accountName]
          .filter(Boolean)
          .join(" ") || accountLink.accountId;
      const ledger = await capture(ledgerApi.GET, () =>
        page.getByRole("button", { name: accountLabel, exact: true }).click(),
      );
      expect(ledger.response.success).toBe(true);
      if (!ledger.response.success) return;
      expect(ledger.response.data.totalCount).toBe(3);
      const ledgerLines = ledger.response.data.lines;
      const postedInvoice = ledgerLines.find(
        ({ entryId }) => entryId === invoiceEntryId,
      );
      expect(postedInvoice?.amount).toBe(120);
      if (!postedInvoice) return;
      expect(
        ledgerLines.some(
          ({ amount, type }) => amount === 40 && type === LineType.CREDIT,
        ),
      ).toBe(true);
      expect(
        ledgerLines.some(
          ({ amount, type }) => amount === 80 && type === LineType.CREDIT,
        ),
      ).toBe(true);
      expect(
        ledgerLines.some(({ runningBalance }) => runningBalance === 0),
      ).toBe(true);
      await page
        .getByRole("button", {
          name: postedInvoice.description ?? postedInvoice.entryNumber,
          exact: true,
        })
        .waitFor();
      await shot("06-receivables-ledger");
      await page.setViewportSize({ width: 390, height: 844 });
      await fixtures.gotoReady(invoicePath, () => waitForInvoice(paidStatus));
      await shot("07-paid-phone");
    },
    180_000,
  );
});
