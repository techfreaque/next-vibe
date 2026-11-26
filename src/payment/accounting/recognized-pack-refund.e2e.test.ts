import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { userRoles } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountingPeriods, accountNodes, journalEntries, journalEntryLines } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType, LineType, PeriodStatus } from "@/chart-of-accounts/enum";
import { postAtlas, prepareAtlasCompany, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies } from "@/companies/db";
import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import { paymentInvoices, paymentTransactions } from "../db";
import { PaymentProvider, PaymentStatus } from "../enum";
import { paymentAccountingEvidence, paymentAccountingOffers, paymentAccountingPostings, paymentAccountingRecognitionPolicies, paymentAccountingRecognitions } from "./db";
import definition from "./definition";
import { scopedTranslation } from "./i18n";
import { recognizeProcessorRevenue } from "./recognition/repository";
import { reconcileProcessorEvidence } from "./repository";

describe("Verified full refunds of partly consumed credit packs", () => {
  const e2e = useE2E("payment/recognized-pack-refund");

  e2e.it("reverses native liability, historic revenue and VAT in the refund period", async (fixture) => {
    const { baseUrl, page, cleanup } = fixture;
    const locale = "en-US";
    const { t } = scopedTranslation.scopedT(locale);
    const logger = createEndpointLogger(false, locale);
    const account = await createTestUser(fixture.uniqueEmail("pack-refund"));
    expect(account.success).toBe(true);
    if (!account.success) return;
    const user = {
      ...account.data.user,
      roles: [UserPermissionRole.ADMIN, ...account.data.user.roles],
    };
    cleanup(async () => deleteTestUser(user.id));
    await db.insert(userRoles).values({ userId: user.id, role: UserPermissionRole.ADMIN });

    const { companyId } = await prepareAtlasCompany(fixture, "Fixture pack merchant", user);
    const { companyId: otherCompanyId, headers } = await prepareAtlasCompany(fixture, "Other fixture merchant", user);
    const product = randomUUID();
    const mapping = randomUUID();
    const payment = randomUUID();
    const originalPeriod = randomUUID();
    const refundPeriod = randomUUID();
    const sale = randomUUID();
    const refund = randomUUID();
    const partial = randomUUID();
    const pack = randomUUID();
    const clawbackId = randomUUID();
    const receivable = randomUUID();
    const clearing = randomUUID();
    const liability = randomUUID();
    const vat = randomUUID();
    const firstRevenue = randomUUID();
    const secondRevenue = randomUUID();
    const merchant = `test:fixture-${mapping}`;
    const intent = `pi_fixture_${payment}`;
    const checkout = `cs_fixture_${payment}`;

    cleanup(async () => {
      const salePostings = await db.select({ id: paymentAccountingPostings.id }).from(paymentAccountingPostings)
        .where(eq(paymentAccountingPostings.companyId, companyId));
      if (salePostings.length) {
        await db.delete(paymentAccountingRecognitions).where(inArray(paymentAccountingRecognitions.postingId, salePostings.map(({ id }) => id)));
      }
      await db.delete(paymentAccountingRecognitionPolicies).where(eq(paymentAccountingRecognitionPolicies.mappingId, mapping));
      await db.delete(paymentAccountingPostings).where(eq(paymentAccountingPostings.companyId, companyId));
      await db.delete(paymentAccountingOffers).where(eq(paymentAccountingOffers.id, mapping));
      await db.delete(paymentInvoices).where(eq(paymentInvoices.companyId, companyId));
      await db.delete(paymentAccountingEvidence).where(eq(paymentAccountingEvidence.merchantId, merchant));
      await db.delete(catalogProducts).where(eq(catalogProducts.id, product));
    });
    await db.update(companies).set({ currency: "PLN" }).where(inArray(companies.id, [companyId, otherCompanyId]));
    await db.insert(accountingPeriods).values([
      { id: originalPeriod, companyId, name: "October 2026", startDate: new Date("2026-10-01"), endDate: new Date("2026-10-31") },
      { id: refundPeriod, companyId, name: "November 2026", startDate: new Date("2026-11-01"), endDate: new Date("2026-11-30"), status: PeriodStatus.CLOSED },
    ]);
    await db.insert(accountNodes).values([
      { id: receivable, companyId, name: "Fixture receivables", code: "1100", type: AccountType.ASSET, subtype: AccountSubtype.ACCOUNTS_RECEIVABLE },
      { id: clearing, companyId, name: "Fixture processor clearing", code: "1200", type: AccountType.ASSET, subtype: AccountSubtype.CURRENT_ASSET },
      { id: liability, companyId, name: "Fixture credit liability", code: "2400", type: AccountType.LIABILITY, subtype: AccountSubtype.ACCRUED_LIABILITY },
      { id: vat, companyId, name: "Fixture VAT payable", code: "2200", type: AccountType.LIABILITY, subtype: AccountSubtype.VAT_PAYABLE },
      { id: firstRevenue, companyId, name: "Fixture October revenue A", code: "4010", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SERVICE },
      { id: secondRevenue, companyId, name: "Fixture October revenue B", code: "4020", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SERVICE },
    ]);
    await db.insert(catalogProducts).values({
      id: product, companyId, ownerUserId: user.id, name: "Fixture credit pack", sku: "FIX-REFUND-PACK",
      type: ProductType.DIGITAL, basePrice: 10, currency: "PLN", defaultTaxRate: 0.23,
    });
    await db.insert(paymentTransactions).values({
      id: payment, userId: user.id, currency: "PLN", amount: "12.30", status: PaymentStatus.SUCCEEDED,
      provider: PaymentProvider.STRIPE, providerPaymentIntentId: intent, providerSessionId: checkout,
      metadata: { type: "credit_pack" },
    });
    await db.insert(paymentAccountingOffers).values({
      id: mapping, companyId, productId: product, provider: PaymentProvider.STRIPE, merchantId: merchant,
      offerId: "fixture-full-pack", currency: "PLN", recognition: "deferred", active: true,
      considerationAccountId: liability, receivableAccountId: receivable, clearingAccountId: clearing,
      vatAccountId: vat,
    });
    const sources = {
      provider: PaymentProvider.STRIPE,
      merchantId: merchant,
      paymentIntentId: intent,
      currency: "PLN",
    };
    await db.insert(paymentAccountingEvidence).values({
      ...sources, id: sale, sourceKind: "sale", externalId: intent, checkoutId: checkout,
      offerId: "fixture-full-pack", grossMinor: 1230, taxMinor: 230,
      sourceDate: new Date("2026-10-01T10:00:00.000Z"),
    });
    const replySchema = z.object({
      success: z.literal(true),
      data: definition.POST.responseSchema,
    });
    const reconcile = async (id: string, dryRun: boolean, scope = companyId) => {
      const result = await postAtlas(fixture, "payment/accounting", {
        companyId: scope,
        evidenceIds: id,
        dryRun,
      });
      expect(result.ok).toBe(true);
      return replySchema.parse(await result.json()).data.results[0];
    };
    const originalSale = await reconcileProcessorEvidence(companyId, sale, false, user.id, logger, locale);
    expect(originalSale).toMatchObject({ success: true, data: { results: [{ status: "posted" }] } });

    const [wallet] = await db.insert(creditWallets).values({ userId: user.id, balance: 6, freeCreditsRemaining: 0 })
      .onConflictDoUpdate({ target: creditWallets.userId, set: { balance: 6 } }).returning({ id: creditWallets.id });
    expect(wallet?.id).toBeTruthy();
    if (!wallet) return;
    await db.insert(creditPacks).values({
      id: pack, walletId: wallet.id, type: CreditPackType.PERMANENT, originalAmount: 10, remaining: 6,
      metadata: { sessionId: checkout },
    });
    await db.insert(creditTransactions).values([
      { packId: pack, walletId: wallet.id, amount: 10, balanceAfter: 10, type: CreditTransactionType.PURCHASE, metadata: { sessionId: checkout }, createdAt: new Date("2026-10-01T10:00:00.000Z") },
      { packId: pack, walletId: wallet.id, amount: -1, balanceAfter: 9, type: CreditTransactionType.USAGE, createdAt: new Date("2026-10-04T11:00:00.000Z") },
      { packId: pack, walletId: wallet.id, amount: -3, balanceAfter: 6, type: CreditTransactionType.USAGE, createdAt: new Date("2026-10-16T11:00:00.000Z") },
    ]);
    await db.insert(paymentAccountingRecognitionPolicies).values([
      { mappingId: mapping, effectiveFrom: "2026-10-01", revenueAccountId: firstRevenue },
      { mappingId: mapping, effectiveFrom: "2026-10-15", revenueAccountId: secondRevenue },
    ]);
    const recognized = await recognizeProcessorRevenue(
      {
        companyId,
        evidenceId: sale,
        dryRun: false,
        recognizeExpiry: false,
        recognizeServicePeriods: false,
      },
      user.id,
      logger,
      locale,
      t,
    );
    expect(recognized).toMatchObject({
      success: true,
      data: { result: { status: "recognitionPosted", entries: 2, netMinor: 400 } },
    });
    await db.update(creditPacks).set({ remaining: 0 }).where(eq(creditPacks.id, pack));
    await db.update(creditWallets).set({ balance: 0 }).where(eq(creditWallets.id, wallet.id));
    await db.insert(creditTransactions).values({
      id: clawbackId, packId: pack, walletId: wallet.id, amount: -6, balanceAfter: 0, type: CreditTransactionType.REFUND,
      createdAt: new Date("2026-11-04T11:01:00.000Z"),
      metadata: { reason: "payment_refund", originalTransactionId: payment, revokedCredits: 10, unrecoveredCredits: 4 },
    });
    await db.update(paymentTransactions).set({ status: PaymentStatus.REFUNDED }).where(eq(paymentTransactions.id, payment));
    await db.update(accountingPeriods).set({ status: PeriodStatus.CLOSED }).where(eq(accountingPeriods.id, originalPeriod));

    await db.insert(paymentAccountingEvidence).values([
      { ...sources, id: partial, sourceKind: "refund", externalId: `re_partial_${payment}`, grossMinor: 230, sourceDate: new Date("2026-11-04T10:00:00.000Z") },
      { ...sources, id: refund, sourceKind: "refund", externalId: `re_full_${payment}`, grossMinor: 1230, sourceDate: new Date("2026-11-04T11:00:00.000Z") },
    ]);
    expect(await reconcile(partial, false)).toMatchObject({ status: "deferredRefundNeedsReview" });
    expect(await reconcile(refund, true)).toMatchObject({ status: "deferredRefundNeedsReview" });
    await db.delete(paymentAccountingEvidence).where(eq(paymentAccountingEvidence.id, partial));
    const revoke = { reason: "payment_refund", originalTransactionId: payment, revokedCredits: 10 };
    await db.update(creditTransactions).set({ metadata: { ...revoke, unrecoveredCredits: 3 } })
      .where(eq(creditTransactions.id, clawbackId));
    expect(await reconcile(refund, false)).toMatchObject({ status: "deferredRefundNeedsReview" });
    await db.update(creditTransactions).set({ metadata: { ...revoke, unrecoveredCredits: 4 } })
      .where(eq(creditTransactions.id, clawbackId));
    expect(await reconcile(refund, false, otherCompanyId)).toMatchObject({ status: "missingEvidence" });
    expect(await reconcile(refund, false)).toMatchObject({ status: "periodClosed" });
    await db.update(accountingPeriods).set({ status: PeriodStatus.OPEN }).where(eq(accountingPeriods.id, refundPeriod));
    expect(await reconcile(refund, true)).toMatchObject({
      status: "ready", currency: "PLN", grossMinor: 1230, taxMinor: 230,
      recognizedMinor: 400, remainingLiabilityMinor: 600,
    });
    expect((await db.select().from(paymentAccountingPostings).where(eq(paymentAccountingPostings.companyId, companyId))).length).toBe(1);
    const posted = await reconcile(refund, false);
    expect(posted).toMatchObject({ status: "posted" });
    if (!posted?.journalEntryId) return;
    expect(await reconcile(refund, false)).toMatchObject({ status: "alreadyPosted", journalEntryId: posted.journalEntryId });
    const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, posted.journalEntryId));
    expect(entry).toMatchObject({ companyId, periodId: refundPeriod });
    const lines = await db.select().from(journalEntryLines).where(eq(journalEntryLines.journalEntryId, posted.journalEntryId));
    expect(lines.map(({ accountId, type, amount, currency }) => ({ accountId, type, amount, currency }))).toEqual(expect.arrayContaining([
      { accountId: clearing, type: LineType.CREDIT, amount: 12.3, currency: "PLN" },
      { accountId: liability, type: LineType.DEBIT, amount: 6, currency: "PLN" },
      { accountId: firstRevenue, type: LineType.DEBIT, amount: 1, currency: "PLN" },
      { accountId: secondRevenue, type: LineType.DEBIT, amount: 3, currency: "PLN" },
      { accountId: vat, type: LineType.DEBIT, amount: 2.3, currency: "PLN" },
    ]));
    expect(lines).toHaveLength(5);

    const origin = new URL(baseUrl).origin;
    const entryPath = `/api/${locale}/chart-of-accounts/journal/${posted.journalEntryId}/get`;
    await page.route((target) => target.origin === origin && target.pathname === entryPath, async (route) => {
      if (route.request().method() !== "GET") {
        await route.fallback();
        return;
      }
      await route.continue({ headers: { ...route.request().headers(), authorization: headers.authorization } });
    });
    const query = new URLSearchParams({ "arg.companyId": companyId, "arg.evidenceIds": refund });
    await page.goto(`${baseUrl}/${locale}/tools/processor-accounting-reconcile?${query}`, { waitUntil: "domcontentloaded" });
    const previewOnly = page.getByRole("checkbox", { name: t("dryRun"), exact: true });
    await previewOnly.waitFor();
    expect(await previewOnly.isChecked()).toBe(true);
    await previewOnly.uncheck();
    await previewOnly.check();
    const submitted = page.waitForResponse((response) => response.request().method() === "POST" &&
      new URL(response.url()).pathname === `/api/${locale}/payment/accounting`);
    await page.getByRole("button", { name: t("submit"), exact: true }).last().click();
    expect((await submitted).ok()).toBe(true);
    const journal = page.getByRole("button", { name: t("openJournal"), exact: true });
    await journal.waitFor();
    if (process.env["PACK_REFUND_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "payments", "verified-pack-refund-reconcile-en");
    }
    await journal.click();
    await page.getByRole("button", { name: "4010 Fixture October revenue A", exact: true }).waitFor();
    await page.getByRole("button", { name: "4020 Fixture October revenue B", exact: true }).waitFor();
    if (process.env["PACK_REFUND_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "payments", "verified-pack-refund-journal-en");
    }
  });
});
