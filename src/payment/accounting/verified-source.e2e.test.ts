import "server-only";

import { mkdir } from "node:fs/promises";
import { createHmac } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import type { z } from "zod";

import {
  accountNodes,
  accountingPeriods,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";
import { supplierEvidenceRecords } from "@/finance/supplier-evidence/db";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";
import { purchasingVendors } from "@/purchasing/db";

import { postAtlasFixture } from "./atlas-test-http";
import {
  paymentBills,
  paymentInvoices,
  paymentTransactions,
  paymentWebhooks,
} from "../db";
import {
  CheckoutMode,
  InvoiceStatus,
  PaymentProvider,
  PaymentStatus,
} from "../enum";
import { paymentEnv } from "../env";
import {
  paymentAccountingEvidence,
  paymentAccountingOffers,
  paymentAccountingPostings,
  paymentAccountingRecognitionPolicies,
  paymentAccountingRecognitions,
  paymentAccountingServiceRecognitions,
} from "./db";
import { merchantCredentialId } from "./evidence";
import { scopedTranslation } from "./i18n";

function signStripeFixture(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  return `t=${timestamp},v1=${digest}`;
}

describe("E2E: processor accounting source", () => {
  const e2e = useE2E("payment/accounting/verified-source");

  e2e.it(
    "stages exact signed Stripe fee evidence once and rejects unsigned delivery",
    async ({ cleanup, baseUrl }) => {
      const secret = paymentEnv.STRIPE_WEBHOOK_SECRET;
      expect(Boolean(secret && paymentEnv.STRIPE_SECRET_KEY)).toBe(true);
      if (!secret || !paymentEnv.STRIPE_SECRET_KEY) return;

      const key = crypto.randomUUID().replaceAll("-", "");
      const eventId = `evt_erp${key}`;
      const balanceId = `txn_erp${key}`;
      const accountId = `acct_erp${key}`;
      cleanup(async () => {
        await db
          .delete(paymentAccountingEvidence)
          .where(eq(paymentAccountingEvidence.externalId, balanceId));
        await db
          .delete(paymentWebhooks)
          .where(eq(paymentWebhooks.providerEventId, eventId));
      });

      const created = Math.floor(Date.now() / 1000);
      const payload = JSON.stringify({
        id: eventId,
        object: "event",
        account: accountId,
        created,
        livemode: false,
        type: "charge.updated",
        data: {
          object: {
            id: `ch_erp${key}`,
            object: "charge",
            paid: true,
            captured: true,
            payment_intent: `pi_erp${key}`,
            currency: "eur",
            amount_captured: 600,
            balance_transaction: {
              id: balanceId,
              amount: 600,
              net: 581,
              fee: 19,
              currency: "eur",
              created,
            },
          },
        },
      });
      const path = `${baseUrl}/api/${defaultLocale}/payment/providers/stripe/webhook`;
      const readStaged = () =>
        db
          .select()
          .from(paymentAccountingEvidence)
          .where(eq(paymentAccountingEvidence.externalId, balanceId));
      const rejected = await postAtlasFixture(path, {
        data: payload,
        headers: { "content-type": "application/json" },
      });
      expect(rejected.status).toBe(400);
      expect(await readStaged()).toHaveLength(0);

      const signature = signStripeFixture(payload, secret);
      const request = {
        data: payload,
        headers: {
          "content-type": "application/json",
          "stripe-signature": signature,
        },
      };
      expect((await postAtlasFixture(path, request)).status).toBe(200);
      expect((await postAtlasFixture(path, request)).status).toBe(200);
      const staged = await readStaged();
      expect(staged).toHaveLength(1);
      expect(staged[0]).toMatchObject({
        merchantId: `test:${accountId}`,
        sourceKind: "fee",
        currency: "EUR",
        grossMinor: 600,
        feeMinor: 19,
        taxMinor: null,
      });
    },
  );

  e2e.it(
    "configures a product and books a signed sale, refund and repeat",
    async ({ page, cleanup, uniqueEmail, loginAs, baseUrl }) => {
      const secret = paymentEnv.STRIPE_WEBHOOK_SECRET;
      expect(Boolean(secret && paymentEnv.STRIPE_SECRET_KEY)).toBe(true);
      if (!secret || !paymentEnv.STRIPE_SECRET_KEY) return;

      const key = crypto.randomUUID().replaceAll("-", "");
      const companyId = crypto.randomUUID();
      const productId = crypto.randomUUID();
      const receivableAccountId = crypto.randomUUID();
      const clearingAccountId = crypto.randomUUID();
      const considerationAccountId = crypto.randomUUID();
      const expenseAccountId = crypto.randomUUID();
      const liabilityId = crypto.randomUUID();
      const vendorId = crypto.randomUUID();
      const account = `acct_erp${key}`;
      const merchantId = `test:${account}`;
      const sessionId = `cs_erp${key}`;
      const offerId = `price_erp${key}`;
      const intentId = `pi_erp${key}`;
      const refundId = `re_erp${key}`;
      const saleEventId = `evt_sale${key}`;
      const refundEventId = `evt_refund${key}`;
      const feeEventId = `evt_fee${key}`;
      const packEventId = `evt_pack${key}`;
      const serviceEventIds: string[] = [];
      const balanceId = `txn_fee${key}`;
      let userId: string | undefined;
      cleanup(async () => {
        const offers = await db
          .select({ id: paymentAccountingOffers.id })
          .from(paymentAccountingOffers)
          .where(eq(paymentAccountingOffers.companyId, companyId));
        const currentPostings = await db
          .select({ id: paymentAccountingPostings.id })
          .from(paymentAccountingPostings)
          .where(eq(paymentAccountingPostings.companyId, companyId));
        if (currentPostings.length) {
          await db.delete(paymentAccountingServiceRecognitions).where(
            inArray(
              paymentAccountingServiceRecognitions.postingId,
              currentPostings.map(({ id }) => id),
            ),
          );
          await db.delete(paymentAccountingRecognitions).where(
            inArray(
              paymentAccountingRecognitions.postingId,
              currentPostings.map(({ id }) => id),
            ),
          );
        }
        if (offers.length) {
          await db.delete(paymentAccountingRecognitionPolicies).where(
            inArray(
              paymentAccountingRecognitionPolicies.mappingId,
              offers.map(({ id }) => id),
            ),
          );
        }
        await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(paymentAccountingPostings)
          .where(eq(paymentAccountingPostings.companyId, companyId));
        await db
          .delete(paymentAccountingEvidence)
          .where(eq(paymentAccountingEvidence.merchantId, merchantId));
        await db
          .delete(paymentWebhooks)
          .where(
            inArray(paymentWebhooks.providerEventId, [
              saleEventId,
              refundEventId,
              feeEventId,
              packEventId,
              ...serviceEventIds,
            ]),
          );
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        await db
          .delete(journalEntries)
          .where(eq(journalEntries.companyId, companyId));
        await db
          .delete(paymentAccountingOffers)
          .where(eq(paymentAccountingOffers.companyId, companyId));
        await db
          .delete(catalogProducts)
          .where(eq(catalogProducts.id, productId));
        await db
          .delete(accountNodes)
          .where(eq(accountNodes.companyId, companyId));
        await db
          .delete(accountingPeriods)
          .where(eq(accountingPeriods.companyId, companyId));
        await db.delete(companies).where(eq(companies.id, companyId));
        if (userId) await deleteTestUser(userId);
      });
      const user = await createTestUser(uniqueEmail("accounting"));
      expect(user.success).toBe(true);
      if (!user.success) return;
      userId = user.data.user.id;
      await db.insert(userRoles).values({ userId, role: UserRole.ADMIN });
      const identity = {
        ...user.data.user,
        roles: [...user.data.user.roles, UserRole.ADMIN],
      };
      await loginAs(identity);
      const session = await createTestSessionToken(identity);
      expect(session.success).toBe(true);
      if (!session.success) return;
      const auth = { authorization: `Bearer ${session.data}` };
      await db.insert(companies).values({
        id: companyId,
        name: "Processor fixture",
        type: CompanyType.B2B,
        ownerUserId: userId,
        currency: "EUR",
      });
      await db.insert(companyMembers).values({
        companyId,
        userId,
        role: CompanyMemberRole.OWNER,
      });
      await db.insert(catalogProducts).values({
        id: productId,
        companyId,
        ownerUserId: userId,
        name: "Fixture service",
        sku: offerId,
        type: ProductType.SERVICE,
        currency: "EUR",
      });
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: "Fixture processor" });
      await db.insert(accountNodes).values([
        {
          id: liabilityId,
          companyId,
          name: "Fixture deferred revenue",
          code: "2900",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCRUED_LIABILITY,
        },
        {
          id: expenseAccountId,
          companyId,
          name: "Fixture fee expense",
          code: "6100",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: receivableAccountId,
          companyId,
          name: "Fixture receivable",
          code: "1100",
          type: AccountType.ASSET,
          subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
        },
        {
          id: clearingAccountId,
          companyId,
          name: "Fixture clearing",
          code: "1200",
          type: AccountType.ASSET,
          subtype: AccountSubtype.CURRENT_ASSET,
        },
        {
          id: considerationAccountId,
          companyId,
          name: "Fixture sales",
          code: "4000",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SERVICE,
        },
      ]);
      const now = Date.now();
      const utcDay = 86_400_000;
      await db.insert(accountingPeriods).values({
        companyId,
        name: "Fixture period",
        startDate: new Date(now - utcDay),
        endDate: new Date(now + utcDay),
      });
      await db.insert(paymentTransactions).values({
        userId,
        providerSessionId: sessionId,
        currency: "EUR",
        amount: "6.00",
        metadata: { type: "accounting_fixture" },
      });

      const prefix = `${baseUrl}/api/${defaultLocale}/payment`;
      const map = await postAtlasFixture(`${prefix}/accounting/mapping`, {
        headers: auth,
        data: {
          companyId,
          productId,
          provider: PaymentProvider.STRIPE,
          merchantId,
          offerId,
          currency: "EUR",
          recognition: "immediate",
          receivableAccountId,
          clearingAccountId,
          considerationAccountId,
        },
      });
      expect(map.ok).toBe(true);
      if (process.env["ERP_SALES_VISUALS"] === "1") {
        const proofDir = "scratchpad/erp/shots/v2/sales";
        await mkdir(proofDir, { recursive: true });
        await page.route(`${baseUrl}/**`, async (route) => {
          await route.continue({
            headers: { ...route.request().headers(), ...auth },
          });
        });
        await page.addInitScript(() => {
          localStorage.setItem("theme_v2", "system");
        });
        const { t } = scopedTranslation.scopedT(defaultLocale);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.emulateMedia({
          colorScheme: "light",
          reducedMotion: "reduce",
        });
        await page.goto(
          `${baseUrl}/${defaultLocale}/tools/products-catalog-list?companyId=${companyId}`,
        );
        await page
          .getByText("Fixture service", { exact: true })
          .last()
          .waitFor();
        await page.screenshot({
          path: `${proofDir}/catalog-desktop-light.png`,
        });
        await page.goto(
          `${baseUrl}/${defaultLocale}/tools/processor-accounting?companyId=${companyId}`,
        );
        await page
          .getByRole("button", { name: t("configure"), exact: true })
          .click();
        await page.locator('[data-field="productId"]').waitFor();
        await page.goto(
          `${baseUrl}/${defaultLocale}/tools/processor-accounting-map?companyId=${companyId}`,
        );
        await page.locator('[data-field="productId"] button').last().click();
        await page
          .getByRole("option", { name: "Fixture service", exact: true })
          .click();
        await page
          .getByText("Fixture service", { exact: true })
          .last()
          .waitFor();

        await page
          .locator('[data-field="receivableAccountId"] button')
          .last()
          .click();
        await page
          .getByRole("option", { name: "Fixture receivable", exact: true })
          .click();
        await page
          .getByText("Fixture receivable", { exact: true })
          .last()
          .waitFor();

        await page.getByRole("listbox").waitFor({ state: "hidden" });
        await page.screenshot({
          path: `${proofDir}/mapping-desktop-light.png`,
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ colorScheme: "dark" });
        await page.screenshot({ path: `${proofDir}/mapping-phone-dark.png` });
      }
      const created = Math.floor(now / 1000);
      const deliver = (
        id: string,
        type: string,
        object: z.infer<ReturnType<typeof z.json>>,
      ) => {
        const payload = JSON.stringify({
          id,
          object: "event",
          created,
          livemode: false,
          account,
          type,
          data: { object },
        });
        return postAtlasFixture(`${prefix}/providers/stripe/webhook`, {
          data: payload,
          headers: {
            "content-type": "application/json",
            "stripe-signature": signStripeFixture(payload, secret),
          },
        });
      };
      const sale = {
        id: sessionId,
        object: "checkout.session",
        mode: "payment",
        payment_status: "paid",
        amount_total: 600,
        currency: "eur",
        payment_intent: intentId,
        total_details: { amount_tax: 0 },
        metadata: { providerPriceId: offerId, type: "accounting_fixture" },
      };
      expect(
        (await deliver(saleEventId, "checkout.session.completed", sale)).ok,
      ).toBe(true);
      expect(
        (await deliver(saleEventId, "checkout.session.completed", sale)).ok,
      ).toBe(true);
      const postings = () =>
        db
          .select()
          .from(paymentAccountingPostings)
          .where(eq(paymentAccountingPostings.companyId, companyId));
      const [posted] = await postings();
      expect(posted).toMatchObject({
        sourceKind: "sale",
        grossMinor: 600,
        taxMinor: 0,
      });
      if (!posted?.invoiceId || !posted.receiptEntryId) return;
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, posted.invoiceId));
      expect(invoice).toMatchObject({
        status: InvoiceStatus.PAID,
        amount: "6.00",
        journalEntryId: posted.journalEntryId,
      });
      const [receipt] = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, posted.receiptEntryId));
      expect(receipt).toMatchObject({
        status: JournalEntryStatus.POSTED,
        sourceId: posted.invoiceId,
      });
      const receiptLines = await db
        .select()
        .from(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, posted.receiptEntryId));
      expect(receiptLines).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            accountId: receivableAccountId,
            amount: 6,
            type: LineType.CREDIT,
          }),
          expect.objectContaining({
            accountId: clearingAccountId,
            amount: 6,
            type: LineType.DEBIT,
          }),
        ]),
      );
      const refund = {
        id: refundId,
        object: "refund",
        created,
        status: "succeeded",
        amount: 210,
        currency: "eur",
        payment_intent: intentId,
      };
      expect((await deliver(refundEventId, "refund.created", refund)).ok).toBe(
        true,
      );
      expect((await deliver(refundEventId, "refund.created", refund)).ok).toBe(
        true,
      );
      expect(await postings()).toHaveLength(2);
      const [evidence] = await db
        .select()
        .from(paymentAccountingEvidence)
        .where(eq(paymentAccountingEvidence.externalId, refundId));
      expect(evidence?.id).toBeDefined();
      if (!evidence) return;
      const retry = await postAtlasFixture(`${prefix}/accounting`, {
        headers: auth,
        data: { companyId, evidenceIds: evidence.id, dryRun: false },
      });
      expect(retry.ok).toBe(true);
      expect(await retry.json()).toMatchObject({
        success: true,
        data: { results: [{ status: "alreadyPosted" }] },
      });
      expect(await postings()).toHaveLength(2);

      expect(
        (
          await deliver(feeEventId, "charge.updated", {
            id: `ch_erp${key}`,
            object: "charge",
            paid: true,
            captured: true,
            amount_captured: 600,
            payment_intent: intentId,
            currency: "eur",
            balance_transaction: {
              id: balanceId,
              amount: 600,
              fee: 19,
              net: 581,
              created,
              currency: "eur",
            },
          })
        ).ok,
      ).toBe(true);
      const [fee] = await db
        .select()
        .from(paymentAccountingEvidence)
        .where(eq(paymentAccountingEvidence.externalId, balanceId));
      expect(fee?.feeMinor).toBe(19);
      if (!fee) return;
      const feeRequest = {
        companyId,
        vendorId,
        operation: "processorFee",
        externalReference: fee.id,
        invoiceReference: `FEE-${key}`,
        taxAmount: "0.00",
        debitAccountId: expenseAccountId,
        dryRun: false,
      };
      const supplierPath = `${baseUrl}/api/${defaultLocale}/finance/supplier-evidence`;
      expect(
        (
          await postAtlasFixture(supplierPath, {
            headers: auth,
            data: feeRequest,
          })
        ).ok,
      ).toBe(true);
      expect(
        (
          await postAtlasFixture(supplierPath, {
            headers: auth,
            data: feeRequest,
          })
        ).ok,
      ).toBe(true);
      const feeBills = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.companyId, companyId));
      expect(feeBills).toHaveLength(1);
      expect(feeBills[0]).toMatchObject({
        total: 0.19,
        taxAmount: 0,
        currency: "EUR",
      });
      const feeReview = await postAtlasFixture(`${prefix}/accounting`, {
        headers: auth,
        data: { companyId, evidenceIds: fee.id, dryRun: true },
      });
      expect(feeReview.ok).toBe(true);
      expect(await feeReview.json()).toMatchObject({
        success: true,
        data: {
          results: [{ status: "feeBillLinked", billId: feeBills[0]?.id }],
        },
      });
      expect(await postings()).toHaveLength(2);

      const packOfferId = `price_pack${key}`;
      const packCheckoutId = `cs_pack${key}`;
      const packIntentId = `pi_pack${key}`;
      expect(
        (
          await postAtlasFixture(`${prefix}/accounting/mapping`, {
            headers: auth,
            data: {
              companyId,
              productId,
              provider: PaymentProvider.STRIPE,
              merchantId,
              offerId: packOfferId,
              currency: "EUR",
              recognition: "deferred",
              receivableAccountId,
              clearingAccountId,
              considerationAccountId: liabilityId,
            },
          })
        ).ok,
      ).toBe(true);
      await db.insert(paymentTransactions).values({
        userId,
        providerSessionId: packCheckoutId,
        amount: "1.00",
        currency: "EUR",
        metadata: { type: "credit_pack" },
      });
      expect(
        (
          await deliver(packEventId, "checkout.session.completed", {
            ...sale,
            id: packCheckoutId,
            payment_intent: packIntentId,
            amount_total: 100,
            metadata: {
              providerPriceId: packOfferId,
              type: "accounting_fixture",
            },
          })
        ).ok,
      ).toBe(true);
      const [packEvidence] = await db
        .select()
        .from(paymentAccountingEvidence)
        .where(eq(paymentAccountingEvidence.externalId, packIntentId));
      const deferredSale = (await postings()).find(
        ({ externalId }) => externalId === packIntentId,
      );
      expect(deferredSale?.grossMinor).toBe(100);
      expect(packEvidence?.id).toBeDefined();
      if (!deferredSale || !packEvidence) return;
      const [originalWallet] = await db
        .select()
        .from(creditWallets)
        .where(eq(creditWallets.userId, userId));
      const walletId = originalWallet?.id ?? crypto.randomUUID();
      if (!originalWallet)
        await db.insert(creditWallets).values({ id: walletId, userId });
      const packId = crypto.randomUUID();
      const expiresAt = new Date(now + 1000);
      await db.insert(creditPacks).values({
        id: packId,
        walletId,
        originalAmount: 3,
        remaining: 0,
        expiresAt,
        type: CreditPackType.PERMANENT,
        metadata: { sessionId: packCheckoutId },
      });
      await db.insert(creditTransactions).values([
        {
          packId,
          walletId,
          amount: -1,
          balanceAfter: 2,
          type: CreditTransactionType.USAGE,
          createdAt: new Date(now),
        },
        {
          packId,
          walletId,
          amount: -2,
          balanceAfter: 0,
          type: CreditTransactionType.EXPIRY,
          createdAt: new Date(now + 2000),
        },
      ]);
      const recognitionPath = `${prefix}/accounting/recognition`;
      const recognition = { companyId, evidenceId: packEvidence.id };
      const policy = await postAtlasFixture(recognitionPath, {
        headers: auth,
        data: {
          ...recognition,
          effectiveFrom: new Date(now).toISOString().slice(0, 10),
          recognizeExpiry: true,
          revenueAccountId: considerationAccountId,
          dryRun: false,
        },
      });
      expect(policy.ok).toBe(true);
      expect(await policy.json()).toMatchObject({
        success: true,
        data: { result: { status: "recognitionPolicySaved" } },
      });
      const review = await postAtlasFixture(recognitionPath, {
        headers: auth,
        data: { ...recognition, dryRun: true },
      });
      expect(review.ok).toBe(true);
      expect(await review.json()).toMatchObject({
        success: true,
        data: {
          result: { status: "recognitionPreview", entries: 2, netMinor: 100 },
        },
      });
      const recognized = await postAtlasFixture(recognitionPath, {
        headers: auth,
        data: { ...recognition, dryRun: false },
      });
      expect(recognized.ok).toBe(true);
      expect(await recognized.json()).toMatchObject({
        success: true,
        data: {
          result: { status: "recognitionPosted", entries: 2, netMinor: 100 },
        },
      });
      const retryRecognition = await postAtlasFixture(recognitionPath, {
        headers: auth,
        data: { ...recognition, dryRun: false },
      });
      expect(retryRecognition.ok).toBe(true);
      expect(await retryRecognition.json()).toMatchObject({
        success: true,
        data: { result: { status: "recognitionCurrent" } },
      });
      const savedAllocations = await db
        .select()
        .from(paymentAccountingRecognitions)
        .where(eq(paymentAccountingRecognitions.postingId, deferredSale.id));
      expect(
        savedAllocations.map(({ netMinor }) => netMinor).toSorted(),
      ).toEqual([33, 67]);
      const releaseJournalIds = savedAllocations.flatMap(
        ({ journalEntryId }) => (journalEntryId ? [journalEntryId] : []),
      );
      expect(releaseJournalIds).toHaveLength(2);
      const releaseLines = await db
        .select()
        .from(journalEntryLines)
        .where(inArray(journalEntryLines.journalEntryId, releaseJournalIds));
      expect(
        releaseLines
          .filter(
            ({ accountId, type }) =>
              accountId === liabilityId && type === LineType.DEBIT,
          )
          .reduce((total, { amount }) => total + Math.round(amount * 100), 0),
      ).toBe(100);

      const subscriptionOfferId = `price_service${key}`;
      const serviceInvoiceId = `in_service${key}`;
      const serviceIntentId = `pi_service${key}`;
      const setup = await postAtlasFixture(`${prefix}/accounting/mapping`, {
        headers: auth,
        data: {
          companyId,
          productId,
          provider: PaymentProvider.STRIPE,
          merchantId,
          offerId: subscriptionOfferId,
          currency: "EUR",
          recognition: "deferred",
          receivableAccountId,
          clearingAccountId,
          considerationAccountId: liabilityId,
        },
      });
      expect(setup.ok).toBe(true);
      await db.insert(paymentTransactions).values({
        userId,
        providerInvoiceId: serviceInvoiceId,
        providerPaymentIntentId: serviceIntentId,
        amount: "1.01",
        currency: "EUR",
        mode: CheckoutMode.SUBSCRIPTION,
        status: PaymentStatus.SUCCEEDED,
        metadata: { type: "subscription" },
      });
      const midnight = Math.floor(now / utcDay) * utcDay;
      const start = Math.floor((midnight - 2.5 * utcDay) / 1000);
      const end = Math.floor((midnight - 0.5 * utcDay) / 1000);
      const line = {
        amount: 101,
        currency: "eur",
        period: { start, end },
        pricing: { price_details: { price: subscriptionOfferId } },
        parent: {
          type: "subscription_item_details",
          subscription_item_details: {
            proration: false,
            subscription: `sub_fixture${key}`,
          },
        },
      };
      const invoiceSource = {
        id: serviceInvoiceId,
        object: "invoice",
        status: "paid",
        billing_reason: "subscription_cycle",
        currency: "eur",
        total: 101,
        amount_due: 101,
        amount_paid: 101,
        amount_remaining: 0,
        total_excluding_tax: 101,
        starting_balance: 0,
        pre_payment_credit_notes_amount: 0,
        post_payment_credit_notes_amount: 0,
        status_transitions: { paid_at: start },
        total_taxes: [],
        lines: { has_more: false, data: [line] },
      };
      const deliverService = (
        suffix: string,
        type: string,
        object: z.infer<ReturnType<typeof z.json>>,
      ): Promise<Response> => {
        const id = `evt_service_${suffix}${key}`;
        serviceEventIds.push(id);
        return deliver(id, type, object);
      };
      await db
        .update(accountingPeriods)
        .set({ startDate: new Date(midnight - utcDay * 4) })
        .where(eq(accountingPeriods.companyId, companyId));
      expect(
        (await deliverService("paid", "invoice.paid", invoiceSource)).ok,
      ).toBe(true);
      const [serviceEvidence] = await db
        .select()
        .from(paymentAccountingEvidence)
        .where(eq(paymentAccountingEvidence.externalId, serviceInvoiceId));
      const serviceSale = (await postings()).find(
        ({ externalId }) => externalId === serviceInvoiceId,
      );
      expect(serviceEvidence?.serviceNetMinor).toBe(101);
      expect(serviceSale?.netMinor).toBe(101);
      if (!serviceEvidence || !serviceSale) return;

      const serviceRecognition = { companyId, evidenceId: serviceEvidence.id };
      const runService = async (dryRun: boolean): Promise<Response> => {
        const response = await postAtlasFixture(recognitionPath, {
          headers: auth,
          data: { ...serviceRecognition, dryRun },
        });
        expect(response.ok).toBe(true);
        return response;
      };
      const results = () =>
        db
          .select()
          .from(paymentAccountingServiceRecognitions)
          .where(
            eq(paymentAccountingServiceRecognitions.postingId, serviceSale.id),
          );
      expect(await (await runService(true)).json()).toMatchObject({
        data: { result: { status: "recognitionPolicyMissing" } },
      });
      const policyResponse = await postAtlasFixture(recognitionPath, {
        headers: auth,
        data: {
          ...serviceRecognition,
          effectiveFrom: new Date(start * 1000).toISOString().slice(0, 10),
          revenueAccountId: considerationAccountId,
          recognizeServicePeriods: true,
          dryRun: false,
        },
      });
      expect(await policyResponse.json()).toMatchObject({
        data: { result: { status: "recognitionPolicySaved" } },
      });
      await db
        .update(accountingPeriods)
        .set({ status: PeriodStatus.CLOSED })
        .where(eq(accountingPeriods.companyId, companyId));
      expect(await (await runService(false)).json()).toMatchObject({
        data: { result: { status: "recognitionPeriodClosed" } },
      });
      expect(await results()).toHaveLength(0);
      await db
        .update(accountingPeriods)
        .set({ status: PeriodStatus.OPEN })
        .where(eq(accountingPeriods.companyId, companyId));
      expect(await (await runService(true)).json()).toMatchObject({
        data: {
          result: { status: "recognitionPreview", netMinor: 101, entries: 3 },
        },
      });
      expect(await results()).toHaveLength(0);
      const runs = await Promise.all(
        [runService(false), runService(false)].map(async (response) =>
          (await response).json(),
        ),
      );
      expect(runs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: { result: { status: "recognitionCurrent" } },
          }),
          expect.objectContaining({
            data: {
              result: {
                status: "recognitionPosted",
                currency: "EUR",
                netMinor: 101,
                entries: 3,
              },
            },
          }),
        ]),
      );
      const released = await results();
      expect(released.map(({ netMinor }) => netMinor).toSorted()).toEqual([
        25, 25, 51,
      ]);
      const ids = released.flatMap(({ journalEntryId }) =>
        journalEntryId ? [journalEntryId] : [],
      );
      expect(ids).toHaveLength(3);
      const releases = await db
        .select()
        .from(journalEntries)
        .where(inArray(journalEntries.id, ids));
      expect(
        releases.every(
          ({ sourceType, status }) =>
            sourceType === JournalSourceType.REVENUE_RECOGNITION &&
            status === JournalEntryStatus.POSTED,
        ),
      ).toBe(true);

      const serviceRefund = {
        ...refund,
        id: `re_service${key}`,
        amount: 1,
        payment_intent: serviceIntentId,
      };
      expect(
        (await deliverService("refund", "refund.created", serviceRefund)).ok,
      ).toBe(true);
      expect(await (await runService(false)).json()).toMatchObject({
        data: { result: { status: "recognitionEvidenceMissing" } },
      });
      expect(
        (
          await deliverService("change", "invoice.payment_succeeded", {
            ...invoiceSource,
            lines: {
              has_more: false,
              data: [{ ...line, period: { start, end: end + 3600 } }],
            },
          })
        ).ok,
      ).toBe(true);
      expect(await (await runService(false)).json()).toMatchObject({
        data: { result: { status: "recognitionServiceConflict" } },
      });
      expect(await results()).toHaveLength(3);
    },
  );

  e2e.it(
    "stages a signed exact native NOWPayments sale without guessed tax or fee",
    async ({ cleanup, uniqueEmail, baseUrl }) => {
      const secret = paymentEnv.NOWPAYMENTS_IPN_SECRET;
      expect(Boolean(secret && paymentEnv.NOWPAYMENTS_API_KEY)).toBe(true);
      if (!secret || !paymentEnv.NOWPAYMENTS_API_KEY) return;
      const key = crypto.randomUUID().replaceAll("-", "");
      const invoiceReference = `invoice_erp${key}`;
      const externalId = `payment_erp${key}`;
      const offerId = `offer_erp${key}`;
      const providerEventId = `${externalId}_finished`;
      let userId: string | undefined;
      cleanup(async () => {
        await db
          .delete(paymentAccountingEvidence)
          .where(eq(paymentAccountingEvidence.externalId, externalId));
        await db
          .delete(paymentWebhooks)
          .where(eq(paymentWebhooks.providerEventId, providerEventId));
        if (userId) await deleteTestUser(userId);
      });
      const user = await createTestUser(uniqueEmail("processor-now"));
      expect(user.success).toBe(true);
      if (!user.success) return;
      userId = user.data.user.id;
      const metadata = { productId: offerId, type: "accounting_fixture" };
      await db.insert(paymentInvoices).values({
        userId,
        amount: "12.34",
        currency: "EUR",
        providerInvoiceId: invoiceReference,
        metadata,
      });
      await db.insert(paymentTransactions).values({
        userId,
        providerSessionId: invoiceReference,
        amount: "12.34",
        currency: "EUR",
        provider: PaymentProvider.NOWPAYMENTS,
        metadata,
      });
      const body = JSON.stringify({
        invoice_id: invoiceReference,
        payment_id: externalId,
        payment_status: "finished",
        order_id: `${userId}_${key}`,
        price_currency: "eur",
        pay_currency: "eur",
        outcome_currency: "eur",
        price_amount: 12.34,
        actually_paid: 12.34,
        outcome_amount: 12.02,
        updated_at: new Date().toISOString(),
      });
      const signature = createHmac("sha512", secret).update(body).digest("hex");
      const path = `${baseUrl}/api/${defaultLocale}/payment/providers/nowpayments/webhook`;
      const deliver = () =>
        postAtlasFixture(path, {
          data: body,
          headers: {
            "content-type": "application/json",
            "x-nowpayments-sig": signature,
          },
        });
      expect((await deliver()).ok).toBe(true);
      expect((await deliver()).ok).toBe(true);
      const staged = await db
        .select()
        .from(paymentAccountingEvidence)
        .where(eq(paymentAccountingEvidence.externalId, externalId));
      expect(staged).toHaveLength(1);
      expect(staged[0]).toMatchObject({
        merchantId: merchantCredentialId(secret),
        offerId,
        sourceKind: "sale",
        currency: "EUR",
        grossMinor: 1234,
        feeMinor: null,
        taxMinor: null,
      });
      const [payment] = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.providerSessionId, invoiceReference));
      expect(payment?.status).toBe(PaymentStatus.SUCCEEDED);
    },
  );
});
