import "server-only";

import { createHash } from "node:crypto";

import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import {
  findOpenPeriod,
  type LedgerTransaction,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";
import { nextCompanyInvoiceSequence } from "@/finance/document-number";
import { supplierEvidenceRecords } from "@/finance/supplier-evidence/db";
import { catalogProducts } from "@/products/db";
import { getCompanyTaxRegime } from "@/tax/regime/policy";

import {
  paymentInvoiceLines,
  paymentInvoices,
  paymentTransactions,
} from "../db";
import { CheckoutMode, InvoiceStatus, PaymentStatus } from "../enum";
import { paymentEnv } from "../env";
import {
  paymentAccountingEvidence,
  paymentAccountingOffers,
  paymentAccountingPostings,
  paymentAccountingRecognitions,
  paymentAccountingServiceRecognitions,
} from "./db";
import type definition from "./definition";
import { merchantCredentialId } from "./evidence";
import type { scopedTranslation } from "./i18n";
import {
  type RecognizedPackRefund,
  resolveRecognizedPackRefund,
} from "./recognized-pack-refund";
import { allocateVerifiedRefund } from "./refund-allocation";

type Offer = typeof paymentAccountingOffers.$inferSelect;
type Evidence = typeof paymentAccountingEvidence.$inferSelect;

export type SalesAccountingResult =
  | {
      status: "posted" | "alreadyPosted";
      invoiceId: string | null;
      journalEntryId: string;
    }
  | {
      status: "feeBillLinked";
      billId: string;
    }
  | {
      status: "ready";
      currency: string;
      grossMinor: number;
      netMinor: number;
      taxMinor: number;
      feeMinor: number | null;
      recognizedMinor?: number;
      remainingLiabilityMinor?: number;
    }
  | {
      status:
        | "forbidden"
        | "missingEvidence"
        | "missingMapping"
        | "unsupportedCurrency"
        | "unmatchedTransaction"
        | "unverifiedTax"
        | "invalidAccounts"
        | "periodClosed"
        | "unverifiedRefundAllocation"
        | "deferredRefundNeedsReview"
        | "feeNeedsBill"
        | "taxRegimeConflict"
        | "inconsistentEvidence"
        | "postingFailed";
      invoiceId?: string;
      creditsConsumed?: number;
      creditsGranted?: number;
      recognizedMinor?: number;
      remainingLiabilityMinor?: number;
      currency?: string;
    };

const prepaidOffer = z.object({
  type: z.enum(["credit_pack", "subscription"]),
});
const purchasedPack = z.object({ type: z.literal("credit_pack") });
const maximumInvoiceMinor = 9_999_999_999;

async function resolveAccounts(
  tx: LedgerTransaction,
  offer: Offer,
): Promise<
  | {
      receivable: typeof accountNodes.$inferSelect;
      clearing: typeof accountNodes.$inferSelect;
      consideration: typeof accountNodes.$inferSelect;
      vat: typeof accountNodes.$inferSelect | undefined;
      expense: typeof accountNodes.$inferSelect | undefined;
    }
  | undefined
> {
  const ids = [
    offer.receivableAccountId,
    offer.clearingAccountId,
    offer.considerationAccountId,
    offer.vatAccountId,
    offer.expenseAccountId,
  ].filter((id) => id !== null);
  if (ids.length !== new Set(ids).size) {
    return undefined;
  }
  const accounts = await tx
    .select()
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.companyId, offer.companyId),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
        inArray(accountNodes.id, ids),
      ),
    );
  const byId = new Map(accounts.map((account) => [account.id, account]));
  const receivable = byId.get(offer.receivableAccountId);
  const clearing = byId.get(offer.clearingAccountId);
  const consideration = byId.get(offer.considerationAccountId);
  const vat = offer.vatAccountId ? byId.get(offer.vatAccountId) : undefined;
  const expense = offer.expenseAccountId
    ? byId.get(offer.expenseAccountId)
    : undefined;
  if (
    receivable?.type !== AccountType.ASSET ||
    receivable.subtype !== AccountSubtype.ACCOUNTS_RECEIVABLE ||
    clearing?.type !== AccountType.ASSET ||
    clearing.subtype !== AccountSubtype.CURRENT_ASSET ||
    consideration?.type !==
      (offer.recognition === "deferred"
        ? AccountType.LIABILITY
        : AccountType.REVENUE) ||
    (offer.vatAccountId &&
      (vat?.type !== AccountType.LIABILITY ||
        vat.subtype !== AccountSubtype.VAT_PAYABLE)) ||
    (offer.expenseAccountId && expense?.type !== AccountType.EXPENSE)
  ) {
    return undefined;
  }
  return { receivable, clearing, consideration, vat, expense };
}

export class SalesAccountingRepository {
  static async saveOffer(
    userId: string,
    input: Omit<
      typeof paymentAccountingOffers.$inferInsert,
      "id" | "createdAt"
    >,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    | { status: "saved"; id: string }
    | {
        status:
          | "forbidden"
          | "invalidAccounts"
          | "missingProduct"
          | "unsupportedCurrency"
          | "conflict";
      }
  > {
    const access = await CompanyAuthRepository.requireMember(
      userId,
      input.companyId,
      CompanyMemberRole.ACCOUNTANT,
      logger,
      locale,
    );
    if (!access.success) {
      return { status: "forbidden" };
    }
    return db.transaction(async (tx) => {
      const company = await lockLedgerCompany(tx, input.companyId);
      if (!company || (company.currency ?? "EUR") !== input.currency) {
        return { status: "unsupportedCurrency" };
      }
      const [product] = await tx
        .select({
          id: catalogProducts.id,
          tax: catalogProducts.defaultTaxRate,
          sku: catalogProducts.sku,
        })
        .from(catalogProducts)
        .where(
          and(
            eq(catalogProducts.id, input.productId),
            eq(catalogProducts.companyId, input.companyId),
            eq(catalogProducts.isActive, true),
          ),
        );
      if (!product?.sku || (input.allowUnstatedZeroTax && product.tax !== 0)) {
        return { status: "missingProduct" };
      }
      const [mapping] = await tx
        .insert(paymentAccountingOffers)
        .values({ ...input, active: true })
        .onConflictDoNothing()
        .returning();
      if (!mapping) {
        return { status: "conflict" };
      }
      if (!(await resolveAccounts(tx, mapping))) {
        await tx
          .delete(paymentAccountingOffers)
          .where(eq(paymentAccountingOffers.id, mapping.id));
        return { status: "invalidAccounts" };
      }
      return { status: "saved", id: mapping.id };
    });
  }

  static async postConfigured(
    evidenceId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<SalesAccountingResult> {
    const [evidence] = await db
      .select()
      .from(paymentAccountingEvidence)
      .where(eq(paymentAccountingEvidence.id, evidenceId));
    if (!evidence) {
      return { status: "missingEvidence" };
    }
    if (evidence.sourceKind === "fee") {
      return { status: "feeNeedsBill" };
    }
    let companyId: string | undefined;
    if (evidence.sourceKind === "sale") {
      const [mapping] = await db
        .select({ companyId: paymentAccountingOffers.companyId })
        .from(paymentAccountingOffers)
        .where(
          and(
            eq(paymentAccountingOffers.active, true),
            eq(paymentAccountingOffers.provider, evidence.provider),
            eq(paymentAccountingOffers.merchantId, evidence.merchantId),
            eq(paymentAccountingOffers.offerId, evidence.offerId ?? ""),
            eq(paymentAccountingOffers.currency, evidence.currency),
          ),
        );
      companyId = mapping?.companyId;
    } else if (evidence.paymentIntentId) {
      const [original] = await db
        .select({ companyId: paymentAccountingPostings.companyId })
        .from(paymentAccountingPostings)
        .innerJoin(
          paymentTransactions,
          eq(paymentTransactions.id, paymentAccountingPostings.transactionId),
        )
        .where(
          and(
            eq(paymentAccountingPostings.sourceKind, "sale"),
            eq(paymentAccountingPostings.provider, evidence.provider),
            eq(paymentAccountingPostings.merchantId, evidence.merchantId),
            eq(paymentAccountingPostings.currency, evidence.currency),
            eq(
              paymentTransactions.providerPaymentIntentId,
              evidence.paymentIntentId,
            ),
          ),
        );
      companyId = original?.companyId;
    }
    if (!companyId) {
      return { status: "missingMapping" };
    }
    const [company] = await db
      .select({ owner: companies.ownerUserId })
      .from(companies)
      .where(eq(companies.id, companyId));
    if (!company?.owner) {
      return { status: "forbidden" };
    }
    return SalesAccountingRepository.reconcile(
      company.owner,
      companyId,
      evidenceId,
      false,
      logger,
      locale,
    );
  }

  static async list(
    userId: string,
    companyId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    { status: "forbidden" } | { status: "listed"; evidence: Evidence[] }
  > {
    const access = await CompanyAuthRepository.requireMember(
      userId,
      companyId,
      CompanyMemberRole.ACCOUNTANT,
      logger,
      locale,
    );
    if (!access.success) {
      return { status: "forbidden" };
    }
    const source = paymentAccountingEvidence;
    const mappings = paymentAccountingOffers;
    const postings = paymentAccountingPostings;
    const transactions = paymentTransactions;
    const evidence = await db
      .select()
      .from(source)
      .where(
        sql`
      ( ${source.sourceKind} = 'sale' and exists (
        select 1 from ${mappings}
        where ${mappings.companyId} = ${companyId}
          and ${mappings.active} = true
          and ${mappings.provider} = ${source.provider}
          and ${mappings.merchantId} = ${source.merchantId}
          and ${mappings.offerId} = ${source.offerId}
          and ${mappings.currency} = ${source.currency}
      )) or ( ${source.sourceKind} <> 'sale' and exists (
        select 1 from ${postings}
        inner join ${transactions} on ${transactions.id} = ${postings.transactionId}
        where ${postings.companyId} = ${companyId}
          and ${postings.sourceKind} = 'sale'
          and ${postings.provider} = ${source.provider}
          and ${postings.merchantId} = ${source.merchantId}
          and ${transactions.providerPaymentIntentId} = ${source.paymentIntentId}
      ))
    `,
      )
      .orderBy(desc(source.sourceDate), desc(source.id))
      .limit(50);
    return { status: "listed", evidence };
  }

  static async reconcile(
    userId: string,
    companyId: string,
    evidenceId: string,
    dryRun: boolean,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<SalesAccountingResult> {
    const access = await CompanyAuthRepository.requireMember(
      userId,
      companyId,
      CompanyMemberRole.ACCOUNTANT,
      logger,
      locale,
    );
    if (!access.success) {
      return { status: "forbidden" };
    }
    try {
      return await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, companyId);
        if (!company) {
          return { status: "forbidden" };
        }
        const [evidence] = await tx
          .select()
          .from(paymentAccountingEvidence)
          .where(eq(paymentAccountingEvidence.id, evidenceId))
          .for("update");
        if (!evidence) {
          return { status: "missingEvidence" };
        }
        const identity = and(
          eq(paymentAccountingPostings.provider, evidence.provider),
          eq(paymentAccountingPostings.merchantId, evidence.merchantId),
          eq(paymentAccountingPostings.sourceKind, evidence.sourceKind),
          eq(paymentAccountingPostings.externalId, evidence.externalId),
        );
        const [previous] = await tx
          .select()
          .from(paymentAccountingPostings)
          .where(identity);
        if (previous) {
          return previous.companyId === companyId
            ? {
                status: "alreadyPosted",
                invoiceId: previous.invoiceId,
                journalEntryId: previous.journalEntryId,
              }
            : { status: "missingEvidence" };
        }

        if (
          !evidence.checkoutId &&
          !evidence.invoiceReference &&
          !evidence.paymentIntentId
        ) {
          return { status: "unmatchedTransaction" };
        }
        const transactions = await tx
          .select()
          .from(paymentTransactions)
          .where(
            and(
              eq(paymentTransactions.provider, evidence.provider),
              or(
                evidence.checkoutId
                  ? eq(
                      paymentTransactions.providerSessionId,
                      evidence.checkoutId,
                    )
                  : undefined,
                evidence.invoiceReference
                  ? eq(
                      paymentTransactions.providerInvoiceId,
                      evidence.invoiceReference,
                    )
                  : undefined,
                evidence.paymentIntentId
                  ? eq(
                      paymentTransactions.providerPaymentIntentId,
                      evidence.paymentIntentId,
                    )
                  : undefined,
              ),
            ),
          )
          .limit(2);
        const [transaction] = transactions;
        if (
          !transaction ||
          transactions.length !== 1 ||
          ![PaymentStatus.SUCCEEDED, PaymentStatus.REFUNDED].some(
            (status) => status === transaction.status,
          )
        ) {
          return { status: "unmatchedTransaction" };
        }
        const [original] = await tx
          .select()
          .from(paymentAccountingPostings)
          .where(
            and(
              eq(paymentAccountingPostings.transactionId, transaction.id),
              eq(paymentAccountingPostings.sourceKind, "sale"),
            ),
          );
        if (
          original &&
          (original.companyId !== companyId ||
            original.merchantId !== evidence.merchantId ||
            original.currency !== evidence.currency)
        ) {
          return { status: "missingEvidence" };
        }
        if (evidence.sourceKind === "sale" && original) {
          if (
            evidence.grossMinor !== original.grossMinor ||
            (evidence.taxMinor !== null &&
              evidence.taxMinor !== original.taxMinor)
          ) {
            return { status: "inconsistentEvidence" };
          }
          return {
            status: "alreadyPosted",
            invoiceId: original.invoiceId,
            journalEntryId: original.journalEntryId,
          };
        }
        if (evidence.sourceKind !== "sale" && !original) {
          return { status: "unmatchedTransaction" };
        }

        const [offer] = await tx
          .select()
          .from(paymentAccountingOffers)
          .where(
            and(
              eq(paymentAccountingOffers.companyId, companyId),
              eq(paymentAccountingOffers.provider, evidence.provider),
              eq(paymentAccountingOffers.merchantId, evidence.merchantId),
              eq(paymentAccountingOffers.currency, evidence.currency),
              original
                ? eq(paymentAccountingOffers.id, original.mappingId)
                : eq(paymentAccountingOffers.offerId, evidence.offerId ?? ""),
              eq(paymentAccountingOffers.active, true),
            ),
          );
        if (!offer) {
          return { status: "missingMapping" };
        }
        if (
          (company.currency ?? "EUR") !== evidence.currency ||
          transaction.currency !== evidence.currency
        ) {
          return { status: "unsupportedCurrency" };
        }
        const [product] = await tx
          .select()
          .from(catalogProducts)
          .where(
            and(
              eq(catalogProducts.id, offer.productId),
              eq(catalogProducts.companyId, companyId),
              eq(catalogProducts.isActive, true),
            ),
          );
        if (!product?.sku) {
          return { status: "missingMapping" };
        }
        if (
          (transaction.mode === CheckoutMode.SUBSCRIPTION ||
            prepaidOffer.safeParse(transaction.metadata).success) &&
          offer.recognition !== "deferred"
        ) {
          return { status: "missingMapping" };
        }
        const transactionMinor = Math.round(Number(transaction.amount) * 100);
        if (
          !Number.isSafeInteger(evidence.grossMinor) ||
          evidence.grossMinor <= 0 ||
          evidence.grossMinor > maximumInvoiceMinor ||
          (evidence.sourceKind === "sale" &&
            evidence.grossMinor !== transactionMinor)
        ) {
          return { status: "inconsistentEvidence" };
        }
        if (evidence.sourceKind === "fee") {
          const [fee] = await tx
            .select({
              billId: supplierEvidenceRecords.billId,
              grossAmount: supplierEvidenceRecords.grossAmount,
            })
            .from(supplierEvidenceRecords)
            .where(
              and(
                eq(supplierEvidenceRecords.companyId, companyId),
                eq(supplierEvidenceRecords.sourceScope, "processor-fee"),
                eq(supplierEvidenceRecords.externalReference, evidence.id),
                eq(supplierEvidenceRecords.currency, evidence.currency),
              ),
            );
          return fee?.billId &&
            evidence.feeMinor !== null &&
            Number(fee.grossAmount) === evidence.feeMinor / 100
            ? { status: "feeBillLinked", billId: fee.billId }
            : { status: "feeNeedsBill" };
        }

        let deferredRefund: RecognizedPackRefund | undefined;
        let tax =
          evidence.taxMinor ??
          (offer.allowUnstatedZeroTax && product.defaultTaxRate === 0
            ? 0
            : undefined);
        if (evidence.sourceKind === "refund") {
          if (
            evidence.invoiceReference &&
            transaction.providerInvoiceId !== evidence.invoiceReference
          ) {
            return { status: "unverifiedRefundAllocation" };
          }
          if (offer.recognition === "deferred") {
            const [pack] =
              purchasedPack.safeParse(transaction.metadata).success &&
              transaction.providerSessionId
                ? await tx
                    .select({
                      granted: creditPacks.originalAmount,
                      remaining: creditPacks.remaining,
                      fullyClawedBack: sql<boolean>`(
                        select coalesce(sum(abs(${creditTransactions.amount})), 0)
                        from ${creditTransactions}
                        where ${creditTransactions.packId} = ${creditPacks.id}
                          and ${creditTransactions.walletId} = ${creditPacks.walletId}
                          and ${creditTransactions.type} = ${CreditTransactionType.REFUND}
                          and ${creditTransactions.amount} < 0
                          and ${creditTransactions.metadata}->>'reason' = 'payment_refund'
                          and ${creditTransactions.metadata}->>'originalTransactionId' = ${transaction.id}
                      ) = ${creditPacks.originalAmount}`,
                      consumed: sql<number>`coalesce((
                    select sum(abs(${creditTransactions.amount}))
                    from ${creditTransactions}
                    where ${creditTransactions.packId} = ${creditPacks.id}
                      and ${creditTransactions.type} = ${CreditTransactionType.USAGE}
                      and ${creditTransactions.amount} < 0
                  ), 0)`.mapWith(Number),
                    })
                    .from(creditPacks)
                    .innerJoin(
                      creditWallets,
                      eq(creditWallets.id, creditPacks.walletId),
                    )
                    .where(
                      and(
                        eq(creditWallets.userId, transaction.userId),
                        eq(creditPacks.type, CreditPackType.PERMANENT),
                        sql`${creditPacks.metadata}->>'sessionId' = ${transaction.providerSessionId}`,
                      ),
                    )
                : [];
            const [allocation] = original
              ? await tx
                  .select({
                    recognized:
                      sql<number>`coalesce(sum(${paymentAccountingRecognitions.netMinor}), 0)`.mapWith(
                        Number,
                      ),
                  })
                  .from(paymentAccountingRecognitions)
                  .where(
                    eq(paymentAccountingRecognitions.postingId, original.id),
                  )
              : [];
            const serviceRecords = paymentAccountingServiceRecognitions;
            const [serviceAllocation] = original
              ? await tx
                  .select({
                    recognized:
                      sql<number>`coalesce(sum(${serviceRecords.netMinor}), 0)`.mapWith(
                        Number,
                      ),
                  })
                  .from(serviceRecords)
                  .where(eq(serviceRecords.postingId, original.id))
              : [];
            const recognizedMinor =
              (allocation?.recognized ?? 0) +
              (serviceAllocation?.recognized ?? 0);
            const unusedAndRecovered =
              transaction.status === PaymentStatus.REFUNDED &&
              original?.grossMinor === evidence.grossMinor &&
              pack?.fullyClawedBack === true &&
              pack.remaining === 0 &&
              pack.consumed === 0 &&
              recognizedMinor === 0;
            if (
              !unusedAndRecovered &&
              original &&
              pack &&
              recognizedMinor > 0 &&
              !serviceAllocation?.recognized &&
              transaction.status === PaymentStatus.REFUNDED &&
              original.grossMinor === evidence.grossMinor
            ) {
              deferredRefund = await resolveRecognizedPackRefund(
                tx,
                original,
                offer,
                evidence,
                transaction,
              );
            }
            if (!unusedAndRecovered && !deferredRefund) {
              return {
                status: "deferredRefundNeedsReview",
                invoiceId: original?.invoiceId ?? undefined,
                creditsConsumed: pack?.consumed,
                creditsGranted: pack?.granted,
                recognizedMinor: original ? recognizedMinor : undefined,
                remainingLiabilityMinor: original
                  ? original.netMinor - recognizedMinor
                  : undefined,
                currency: evidence.currency,
              };
            }
          }
          if (!original?.invoiceId) {
            return { status: "unverifiedRefundAllocation" };
          }
          const refunds = await tx
            .select({
              invoiceId: paymentAccountingPostings.invoiceId,
              grossMinor: paymentAccountingPostings.grossMinor,
              taxMinor: paymentAccountingPostings.taxMinor,
            })
            .from(paymentAccountingPostings)
            .where(
              and(
                eq(paymentAccountingPostings.companyId, companyId),
                eq(paymentAccountingPostings.transactionId, transaction.id),
                eq(paymentAccountingPostings.sourceKind, "refund"),
              ),
            );
          const credits = await tx
            .select({ id: paymentInvoices.id })
            .from(paymentInvoices)
            .where(
              and(
                eq(paymentInvoices.companyId, companyId),
                sql`${paymentInvoices.metadata}->>'originalInvoiceId' = ${original.invoiceId}`,
              ),
            );
          if (
            credits.some(
              ({ id }) => !refunds.some(({ invoiceId }) => invoiceId === id),
            )
          ) {
            return { status: "unverifiedRefundAllocation" };
          }
          const used = refunds.reduce(
            (total, refund) => ({
              grossMinor: total.grossMinor + refund.grossMinor,
              taxMinor: total.taxMinor + refund.taxMinor,
            }),
            { grossMinor: 0, taxMinor: 0 },
          );
          const allocation = allocateVerifiedRefund(
            original,
            used,
            evidence.grossMinor,
            evidence.taxMinor,
          );
          if (!allocation) {
            return {
              status: "unverifiedRefundAllocation",
              invoiceId: original.invoiceId,
            };
          }
          tax = allocation.taxMinor;
        }

        if (
          tax === undefined ||
          !Number.isSafeInteger(tax) ||
          tax < 0 ||
          tax > evidence.grossMinor
        ) {
          return { status: "unverifiedTax" };
        }
        const regime = await getCompanyTaxRegime(
          tx,
          companyId,
          evidence.sourceDate,
        );
        if (evidence.sourceKind === "sale" && regime.exempt && tax > 0) {
          return { status: "taxRegimeConflict" };
        }
        const accounts = await resolveAccounts(tx, offer);
        if (!accounts || (tax > 0 && !accounts.vat)) {
          return { status: "invalidAccounts" };
        }
        if (!(await findOpenPeriod(tx, companyId, evidence.sourceDate))) {
          return { status: "periodClosed" };
        }
        const gross = evidence.grossMinor;
        const net = gross - tax;
        if (dryRun) {
          return {
            status: "ready",
            currency: evidence.currency,
            grossMinor: gross,
            netMinor: net,
            taxMinor: tax,
            feeMinor: evidence.feeMinor,
            ...(deferredRefund
              ? {
                  recognizedMinor: net - deferredRefund.liabilityMinor,
                  remainingLiabilityMinor: deferredRefund.liabilityMinor,
                }
              : {}),
          };
        }

        const line = (
          account: typeof accountNodes.$inferSelect,
          type: AutoPostLine["type"],
          amount: number,
        ): AutoPostLine => ({
          accountNodeId: account.id,
          subtype: account.subtype,
          type,
          amount: amount / 100,
          currency: evidence.currency,
        });
        const debit = (
          account: typeof accountNodes.$inferSelect,
          amount: number,
        ): AutoPostLine => line(account, LineType.DEBIT, amount);
        const credit = (
          account: typeof accountNodes.$inferSelect,
          amount: number,
        ): AutoPostLine => line(account, LineType.CREDIT, amount);
        const [customer] = await tx
          .select({
            privateName: users.privateName,
            publicName: users.publicName,
          })
          .from(users)
          .where(eq(users.id, transaction.userId));
        const customerName =
          customer?.privateName?.trim() || customer?.publicName?.trim();
        let receiptEntryId: string | null = null;
        const sequence = await nextCompanyInvoiceSequence(tx, companyId);
        const [invoice] = await tx
          .insert(paymentInvoices)
          .values({
            companyId,
            userId,
            providerInvoiceId: `accounting:${evidence.id}`,
            invoiceNumber: `${evidence.sourceKind === "refund" ? "CN" : "INV"}-${sequence}`,
            invoiceSequenceNumber: sequence,
            currency: transaction.currency,
            amount: (
              (evidence.sourceKind === "refund" ? -gross : gross) / 100
            ).toFixed(2),
            status:
              evidence.sourceKind === "refund"
                ? InvoiceStatus.OPEN
                : InvoiceStatus.PAID,
            ...(evidence.sourceKind === "sale"
              ? { paidAt: evidence.sourceDate }
              : {}),
            metadata: {
              customerId: transaction.userId,
              customerName,
              accountingEvidenceId: evidence.id,
              sourceDate: evidence.sourceDate.toISOString(),
              ...(evidence.sourceKind === "sale" &&
              regime.exempt &&
              regime.notice
                ? {
                    taxExemptionNotice: regime.notice,
                  }
                : {}),
              ...(evidence.sourceKind === "refund"
                ? { originalInvoiceId: original?.invoiceId }
                : {}),
            },
          })
          .returning({ id: paymentInvoices.id });
        if (!invoice) {
          return tx.rollback();
        }
        const invoiceId = invoice.id;
        const direction = evidence.sourceKind === "refund" ? -1 : 1;
        await tx.insert(paymentInvoiceLines).values({
          invoiceId,
          productId: product.id,
          description: product.name,
          quantity: 1,
          unitPrice: (net * direction) / 100,
          taxRate: net > 0 ? tax / net : 0,
          taxAmount: (tax * direction) / 100,
          lineTotal: (gross * direction) / 100,
        });
        const primaryLines: AutoPostLine[] = [];
        if (evidence.sourceKind === "refund") {
          primaryLines.push(credit(accounts.clearing, gross));
          const liability = deferredRefund?.liabilityMinor ?? net;
          if (liability > 0) {
            primaryLines.push(debit(accounts.consideration, liability));
          }
          for (const { account, minor } of deferredRefund?.revenue ?? []) {
            primaryLines.push(debit(account, minor));
          }
          if (tax > 0 && accounts.vat) {
            primaryLines.push(debit(accounts.vat, tax));
          }
        } else {
          primaryLines.push(debit(accounts.receivable, gross));
          if (net > 0) {
            primaryLines.push(credit(accounts.consideration, net));
          }
          if (tax > 0 && accounts.vat) {
            primaryLines.push(credit(accounts.vat, tax));
          }
        }
        const journalEntryId = await postJournalEntry(
          {
            companyId,
            date: evidence.sourceDate,
            description: `${product.name} (${evidence.externalId})`,
            sourceType: JournalSourceType.AR_INVOICE,
            sourceId: invoiceId,
            lines: primaryLines,
            logger,
            postedByUserId: userId,
          },
          tx,
        );
        if (!journalEntryId) {
          return tx.rollback();
        }

        await tx
          .update(paymentInvoices)
          .set({ journalEntryId })
          .where(eq(paymentInvoices.id, invoiceId));
        if (evidence.sourceKind === "sale") {
          receiptEntryId = await postJournalEntry(
            {
              companyId,
              date: evidence.sourceDate,
              description: `${product.name} (${evidence.externalId})`,
              sourceType: JournalSourceType.AR_PAYMENT,
              sourceId: invoiceId,
              lines: [
                debit(accounts.clearing, gross),
                credit(accounts.receivable, gross),
              ],
              logger,
              postedByUserId: userId,
            },
            tx,
          );
          if (!receiptEntryId) {
            return tx.rollback();
          }
        }
        const posting: typeof paymentAccountingPostings.$inferInsert = {
          companyId,
          mappingId: offer.id,
          transactionId: transaction.id,
          invoiceId,
          journalEntryId,
          receiptEntryId,
          provider: evidence.provider,
          merchantId: evidence.merchantId,
          sourceKind: evidence.sourceKind,
          externalId: evidence.externalId,
          currency: evidence.currency,
          grossMinor: gross,
          netMinor: net,
          taxMinor: tax,
          feeMinor: evidence.feeMinor,
          sourceDate: evidence.sourceDate,
          evidenceDigest: createHash("sha256")
            .update(JSON.stringify(evidence))
            .digest("hex"),
        };
        await tx.insert(paymentAccountingPostings).values(posting);
        return { status: "posted", invoiceId, journalEntryId };
      });
    } catch {
      logger.error("Payment accounting transaction failed");
      return { status: "postingFailed" };
    }
  }
}

export async function listProcessorEvidence(
  companyId: string,
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): Promise<ResponseType<(typeof definition.GET)["types"]["ResponseOutput"]>> {
  const listed = await SalesAccountingRepository.list(
    userId,
    companyId,
    logger,
    locale,
  );
  if (listed.status === "forbidden") {
    return fail({
      message: t("forbidden"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }
  const stripe = paymentEnv.STRIPE_WEBHOOK_SECRET
    ? merchantCredentialId(paymentEnv.STRIPE_WEBHOOK_SECRET)
    : undefined;
  return success({
    rows: listed.evidence,
    stripeTestMerchant: stripe ? `test:${stripe}` : undefined,
    stripeLiveMerchant: stripe ? `live:${stripe}` : undefined,
    nowMerchant: paymentEnv.NOWPAYMENTS_IPN_SECRET
      ? merchantCredentialId(paymentEnv.NOWPAYMENTS_IPN_SECRET)
      : undefined,
  });
}

export async function reconcileProcessorEvidence(
  companyId: string,
  evidenceIds: string,
  dryRun: boolean,
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<(typeof definition.POST)["types"]["ResponseOutput"]>> {
  const ids = [...new Set(evidenceIds.split(",").map((part) => part.trim()))];
  const results: Array<
    Awaited<ReturnType<typeof SalesAccountingRepository.reconcile>> & {
      id: string;
    }
  > = [];
  for (const id of ids) {
    const result = await SalesAccountingRepository.reconcile(
      userId,
      companyId,
      id,
      dryRun,
      logger,
      locale,
    );
    results.push({ id, ...result });
  }
  return success({ results });
}
