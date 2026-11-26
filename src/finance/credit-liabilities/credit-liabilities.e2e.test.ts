import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { formatMoneyAmount } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  authAtlas,
  getAtlasFixture,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import {
  paymentAccountingOffers,
  paymentAccountingPostings,
  paymentAccountingRecognitionPolicies,
  paymentAccountingRecognitions,
} from "@/payment/accounting/db";
import { paymentTransactions } from "@/payment/db";
import { PaymentProvider, PaymentStatus } from "@/payment/enum";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import endpoint from "./definition";
import { scopedTranslation } from "./i18n";

describe("Booked credit pack liabilities", () => {
  const e2e = useE2E("finance/credit-liabilities");
  e2e.it(
    "reconciles attributed posted credits without mixing account movements or currencies",
    async (fixtures) => {
      const userIds: string[] = [];
      fixtures.cleanup(async () => {
        for (const id of userIds) await deleteTestUser(id);
      });
      const foreign = await createTestUser(
        fixtures.uniqueEmail("credit-foreign"),
      );
      if (foreign.success) userIds.push(foreign.data.user.id);
      const owner = await createTestUser(fixtures.uniqueEmail("credit-owner"));
      if (owner.success) userIds.push(owner.data.user.id);
      expect([foreign.success, owner.success]).toEqual([true, true]);
      if (!owner.success || !foreign.success) return;
      await db
        .insert(userRoles)
        .values(userIds.map((id) => ({ userId: id, role: UserRole.ADMIN })));
      const foreignHeaders = await authAtlas(fixtures, {
        ...foreign.data.user,
        roles: [UserRole.ADMIN],
      });
      const companyName = "Fixture Credit Ledger and Customer Services";
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        companyName,
        { ...owner.data.user, roles: [UserRole.ADMIN] },
      );

      const merchant = randomUUID();
      const productId = randomUUID();
      const periodId = randomUUID();
      const liabilityId = randomUUID();
      const clearingId = randomUUID();
      const eurOffer = randomUUID();
      const usdOffer = randomUUID();
      const recognitionPolicy = randomUUID();
      const usdRecognitionPolicy = randomUUID();
      const eurTransaction = randomUUID();
      const usdTransaction = randomUUID();
      const serviceTransaction = randomUUID();
      const eurPosting = randomUUID();
      const usdPosting = randomUUID();
      const saleEur = randomUUID();
      const saleUsd = randomUUID();
      const foreignLine = randomUUID();
      const refund = randomUUID();
      const reversal = randomUUID();
      const usage = randomUUID();
      const usageUsd = randomUUID();
      const service = randomUUID();
      const generic = randomUUID();
      const future = randomUUID();
      const postings = [eurPosting, usdPosting];
      fixtures.cleanup(async () => {
        await db
          .delete(paymentAccountingRecognitions)
          .where(inArray(paymentAccountingRecognitions.postingId, postings));
        await db
          .delete(paymentAccountingRecognitionPolicies)
          .where(
            inArray(paymentAccountingRecognitionPolicies.id, [
              recognitionPolicy,
              usdRecognitionPolicy,
            ]),
          );
        await db
          .delete(paymentAccountingPostings)
          .where(eq(paymentAccountingPostings.companyId, companyId));
        await db
          .delete(paymentAccountingOffers)
          .where(eq(paymentAccountingOffers.companyId, companyId));
        await db
          .delete(catalogProducts)
          .where(eq(catalogProducts.id, productId));
        await db
          .delete(paymentTransactions)
          .where(
            inArray(paymentTransactions.id, [
              eurTransaction,
              usdTransaction,
              serviceTransaction,
            ]),
          );
        expect(
          await db
            .select({ id: paymentAccountingPostings.id })
            .from(paymentAccountingPostings)
            .where(eq(paymentAccountingPostings.companyId, companyId)),
        ).toEqual([]);
      });

      const past = new Date("2025-11-10T00:00:00Z");
      const distant = new Date("2070-01-01T00:00:00Z");
      await db.insert(accountingPeriods).values({
        companyId,
        id: periodId,
        name: "Credits fixture",
        startDate: past,
        endDate: distant,
      });
      await db.insert(accountNodes).values([
        {
          companyId,
          id: liabilityId,
          code: "2300",
          name: "Deferred paid credits",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCRUED_LIABILITY,
        },
        {
          companyId,
          id: clearingId,
          code: "1100",
          name: "Credit settlements",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
      ]);
      await db.insert(catalogProducts).values({
        id: productId,
        ownerUserId: userId,
        companyId,
        name: "Fixture credit pack",
        type: ProductType.DIGITAL,
      });
      await db.insert(paymentAccountingOffers).values(
        [
          { id: eurOffer, currency: "EUR" },
          { id: usdOffer, currency: "USD" },
        ].map(
          ({ id, currency }): typeof paymentAccountingOffers.$inferInsert => ({
            id,
            companyId,
            productId,
            provider: PaymentProvider.STRIPE,
            merchantId: merchant,
            offerId: id,
            currency,
            recognition: "deferred",
            receivableAccountId: clearingId,
            clearingAccountId: clearingId,
            considerationAccountId: liabilityId,
          }),
        ),
      );
      await db.insert(paymentAccountingRecognitionPolicies).values([
        {
          id: recognitionPolicy,
          mappingId: eurOffer,
          effectiveFrom: "2025-11-10",
          revenueAccountId: clearingId,
        },
        {
          id: usdRecognitionPolicy,
          mappingId: usdOffer,
          effectiveFrom: "2025-11-10",
          revenueAccountId: clearingId,
        },
      ]);
      await db.insert(paymentTransactions).values([
        {
          id: eurTransaction,
          userId,
          amount: "100.00",
          currency: "EUR",
          status: PaymentStatus.SUCCEEDED,
          metadata: { type: "credit_pack" },
        },
        {
          id: usdTransaction,
          userId,
          amount: "7.50",
          currency: "USD",
          status: PaymentStatus.SUCCEEDED,
          metadata: { type: "credit_pack" },
        },
        {
          id: serviceTransaction,
          userId,
          amount: "40.00",
          currency: "EUR",
          status: PaymentStatus.SUCCEEDED,
          metadata: { type: "subscription" },
        },
      ]);
      const legs = [
        { id: saleEur, amount: 100, currency: "EUR", inflow: true },
        { id: saleUsd, amount: 7.5, currency: "USD", inflow: true },
        { id: usage, amount: 15, currency: "EUR", inflow: false },
        { id: usageUsd, amount: 10, currency: "USD", inflow: false },
        { id: refund, amount: 20, currency: "EUR", inflow: false },
        { id: reversal, amount: 20, currency: "EUR", inflow: true },
        { id: generic, amount: 500, currency: "EUR", inflow: true },
        { id: service, amount: 40, currency: "EUR", inflow: true },
        { id: foreignLine, amount: 3, currency: "PLN", inflow: true },
        { id: future, amount: 10, currency: "EUR", inflow: false },
      ];
      await db.insert(journalEntries).values(
        legs.map(({ id }, index) => ({
          id,
          companyId,
          periodId,
          entryNumber: `CREDIT-${index}`,
          description: "Credit fixture",
          date: id === future ? distant : past,
          status: JournalEntryStatus.POSTED,
          reversalOfId: id === reversal ? refund : null,
        })),
      );
      await db.insert(journalEntryLines).values(
        legs.flatMap(({ id, amount, currency, inflow }) => [
          {
            journalEntryId: id,
            accountId: liabilityId,
            amount,
            currency,
            type: inflow ? LineType.CREDIT : LineType.DEBIT,
            description: id === generic ? "Other invoice liability" : null,
          },
          {
            journalEntryId: id,
            accountId: clearingId,
            amount,
            currency,
            type: inflow ? LineType.DEBIT : LineType.CREDIT,
          },
        ]),
      );
      const post = {
        companyId,
        provider: PaymentProvider.STRIPE,
        merchantId: merchant,
        sourceDate: past,
        taxMinor: 0,
        evidenceDigest: merchant,
      };
      await db.insert(paymentAccountingPostings).values([
        {
          ...post,
          id: eurPosting,
          mappingId: eurOffer,
          transactionId: eurTransaction,
          journalEntryId: saleEur,
          sourceKind: "sale",
          externalId: saleEur,
          currency: "EUR",
          grossMinor: 10000,
          netMinor: 10000,
        },
        {
          ...post,
          id: usdPosting,
          mappingId: usdOffer,
          transactionId: usdTransaction,
          journalEntryId: saleUsd,
          sourceKind: "sale",
          externalId: saleUsd,
          currency: "USD",
          grossMinor: 750,
          netMinor: 750,
        },
        {
          ...post,
          mappingId: eurOffer,
          transactionId: eurTransaction,
          journalEntryId: refund,
          sourceKind: "refund",
          externalId: refund,
          currency: "EUR",
          grossMinor: -2000,
          netMinor: -2000,
        },
        {
          ...post,
          mappingId: eurOffer,
          transactionId: serviceTransaction,
          journalEntryId: service,
          sourceKind: "sale",
          externalId: service,
          currency: "EUR",
          grossMinor: 4000,
          netMinor: 4000,
        },
      ]);
      await db.insert(paymentAccountingRecognitions).values([
        {
          postingId: eurPosting,
          policyId: recognitionPolicy,
          creditTransactionId: randomUUID(),
          creditsAtomic: "10000",
          netMinor: 700,
          journalEntryId: usage,
          sourceDate: past,
        },
        {
          postingId: eurPosting,
          policyId: recognitionPolicy,
          creditTransactionId: randomUUID(),
          creditsAtomic: "10000",
          netMinor: 800,
          journalEntryId: usage,
          sourceDate: past,
        },
        {
          postingId: eurPosting,
          policyId: recognitionPolicy,
          creditTransactionId: randomUUID(),
          creditsAtomic: "10000",
          netMinor: 1000,
          journalEntryId: future,
          sourceDate: distant,
        },
        {
          postingId: usdPosting,
          policyId: usdRecognitionPolicy,
          creditTransactionId: randomUUID(),
          creditsAtomic: "10000",
          netMinor: 1000,
          journalEntryId: usageUsd,
          sourceDate: past,
        },
      ]);
      const url = `${fixtures.baseUrl}/api/${E2E_LOCALE}/finance/credit-liabilities`;
      const request = async (
        requestHeaders: Record<string, string>,
      ): Promise<Response> => {
        try {
          return await getAtlasFixture(url, { companyId }, requestHeaders);
        } catch (error) {
          expect(error instanceof Error ? error.name : undefined).toBe(
            "TimeoutError",
          );
          return await getAtlasFixture(url, { companyId }, requestHeaders);
        }
      };
      expect((await request(foreignHeaders)).status).toBe(403);
      const report = await request(headers);
      expect(report.status).toBe(200);
      expect(
        z
          .object({
            success: z.literal(true),
            data: endpoint.GET.responseSchema,
          })
          .parse(await report.json()).data.balances,
      ).toEqual([
        {
          accountId: liabilityId,
          accountCode: "2300",
          accountName: "Deferred paid credits",
          currency: "EUR",
          amount: "85.0000",
        },
        {
          accountId: liabilityId,
          accountCode: "2300",
          accountName: "Deferred paid credits",
          currency: "USD",
          amount: "-2.5000",
        },
      ]);

      await fixtures.page.route(
        (url) =>
          /\/api\/[^/]+\/(?:finance\/credit-liabilities|inventory\/dashboard|chart-of-accounts\/ledger\/[^/]+)$/.test(
            url.pathname,
          ),
        async (route) => {
          await route.continue({
            headers: {
              ...route.request().headers(),
              authorization: headers.authorization,
            },
          });
        },
      );
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const nav = fixtures.page
        .getByRole("button", { name: t("title"), exact: true })
        .last();
      await fixtures.gotoReady(
        `/tools/inventory-dashboard?arg.companyId=${companyId}`,
        () => nav.waitFor(),
      );
      await fixtures.page
        .getByRole("button", { name: t("supplierLink"), exact: true })
        .last()
        .waitFor();
      await nav.click();
      const opensLedger = fixtures.page
        .getByRole("button", {
          name: "2300 Deferred paid credits",
          exact: true,
        })
        .filter({ visible: true })
        .first();
      await opensLedger.waitFor();
      await fixtures.page.setViewportSize({ width: 390, height: 844 });
      await fixtures.page
        .getByText(companyName, { exact: true })
        .filter({ visible: true })
        .last()
        .waitFor();
      await fixtures.page
        .getByText(t("amount"), { exact: true })
        .filter({ visible: true })
        .last()
        .waitFor();
      expect(
        await fixtures.page
          .getByText(formatMoneyAmount(85, E2E_LOCALE), { exact: true })
          .filter({ visible: true })
          .count(),
      ).toBe(1);
      expect(
        await fixtures.page
          .getByText(formatMoneyAmount(-2.5, E2E_LOCALE), { exact: true })
          .filter({ visible: true })
          .count(),
      ).toBe(1);
      await opensLedger.click();
      await fixtures.page
        .getByText("Other invoice liability", { exact: true })
        .first()
        .waitFor();
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t: localized } = scopedTranslation.scopedT(locale);
        await fixtures.page.goto(
          `${fixtures.baseUrl}/${locale}/tools/finance-credit-liabilities?arg.companyId=${companyId}`,
          { waitUntil: "domcontentloaded" },
        );
        await fixtures.page
          .getByText(companyName, { exact: true })
          .filter({ visible: true })
          .last()
          .waitFor();
        await fixtures.page
          .getByText(localized("amount"), { exact: true })
          .filter({ visible: true })
          .last()
          .waitFor();
        await saveAdminViewMatrix(
          fixtures.page,
          "credit-liabilities",
          `credit-liabilities-fixture-${locale.slice(0, 2)}`,
        );
        if (locale === "en-US") {
          const name = new RegExp(companyName);
          for (const width of [1440, 390]) {
            await fixtures.page.setViewportSize({ width, height: 900 });
            const trigger = fixtures.page
              .getByRole("button", { name })
              .filter({ visible: true })
              .first();
            await trigger.click();
            const selected = fixtures.page
              .getByRole("menuitemradio", { name })
              .filter({ visible: true })
              .first();
            await selected.waitFor();
            expect(await selected.getAttribute("aria-checked")).toBe("true");
            await fixtures.page.keyboard.press("Escape");
            await selected.waitFor({ state: "hidden" });
          }
        }
      }
    },
  );
});
