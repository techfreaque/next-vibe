import "server-only";

import { and, asc, desc, eq, inArray, lte, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { accountNodes, journalEntries } from "@/chart-of-accounts/db";
import {
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { postJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import {
  findOpenPeriod,
  type LedgerTransaction,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";

import { paymentInvoices, paymentTransactions } from "../../db";
import { CheckoutMode, PaymentProvider, PaymentStatus } from "../../enum";
import {
  paymentAccountingEvidence,
  paymentAccountingOffers,
  paymentAccountingPostings,
  paymentAccountingRecognitionPolicies,
  paymentAccountingRecognitions,
  paymentAccountingServiceRecognitions,
} from "../db";
import type { scopedTranslation } from "../i18n";
import { creditAtoms, recognitionMinor } from "../recognition-rules";
import type definition from "./definition";
import { runServicePeriodRecognition } from "./service-period";

type Policy = typeof paymentAccountingRecognitionPolicies.$inferSelect;
type Status =
  | "recognitionPreview"
  | "recognitionPosted"
  | "recognitionCurrent"
  | "recognitionPolicySaved"
  | "recognitionPolicyConflict"
  | "recognitionPolicyMissing"
  | "recognitionEvidenceMissing"
  | "recognitionExpiryReview"
  | "recognitionSubscriptionReview"
  | "recognitionServiceConflict"
  | "recognitionInvalidAccounts"
  | "recognitionPeriodClosed"
  | "recognitionForbidden"
  | "recognitionFailed";

export interface RecognitionInput {
  companyId: string;
  evidenceId: string;
  dryRun: boolean;
  effectiveFrom?: string;
  revenueAccountId?: string;
  recognizeExpiry: boolean;
  recognizeServicePeriods: boolean;
}

export interface RecognitionResult {
  status: Status;
  currency?: string;
  entries?: number;
  netMinor?: number;
  pendingStatus?: Status;
}

const creditProduct = z.object({ type: z.literal("credit_pack") });
const maxMovements = 50;

async function savePolicy(
  tx: LedgerTransaction,
  input: RecognitionInput,
  mappingId: string,
): Promise<RecognitionResult> {
  const { companyId, effectiveFrom, revenueAccountId } = input;
  if (!effectiveFrom || !revenueAccountId) {
    return { status: "recognitionPolicyMissing" };
  }
  const [account] = await tx
    .select({ id: accountNodes.id })
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.id, revenueAccountId),
        eq(accountNodes.companyId, companyId),
        eq(accountNodes.type, AccountType.REVENUE),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
      ),
    );
  if (!account) {
    return { status: "recognitionInvalidAccounts" };
  }

  const policies = paymentAccountingRecognitionPolicies;
  const records = paymentAccountingRecognitions;
  const [overlap] = await tx
    .select({ id: records.id })
    .from(records)
    .innerJoin(policies, eq(records.policyId, policies.id))
    .where(
      and(
        eq(policies.mappingId, mappingId),
        sql`cast(${records.sourceDate} as date) >= ${effectiveFrom}::date`,
      ),
    )
    .limit(1);
  const serviceRecords = paymentAccountingServiceRecognitions;
  const [serviceOverlap] = await tx
    .select({ id: serviceRecords.id })
    .from(serviceRecords)
    .innerJoin(policies, eq(serviceRecords.policyId, policies.id))
    .where(
      and(
        eq(policies.mappingId, mappingId),
        sql`cast(${serviceRecords.sourceDate} as date) >= ${effectiveFrom}::date`,
      ),
    )
    .limit(1);
  const [existing] = await tx
    .select()
    .from(policies)
    .where(
      and(
        eq(policies.mappingId, mappingId),
        eq(policies.effectiveFrom, effectiveFrom),
      ),
    );
  if (
    existing?.revenueAccountId === revenueAccountId &&
    existing.recognizeExpiry === input.recognizeExpiry &&
    existing.recognizeServicePeriods === input.recognizeServicePeriods
  ) {
    return { status: "recognitionPolicySaved" };
  }
  if (overlap || serviceOverlap || existing) {
    return { status: "recognitionPolicyConflict" };
  }
  if (input.dryRun) {
    return { status: "recognitionPreview" };
  }

  await tx.insert(policies).values({
    mappingId,
    effectiveFrom,
    revenueAccountId,
    recognizeExpiry: input.recognizeExpiry,
    recognizeServicePeriods: input.recognizeServicePeriods,
  });
  return { status: "recognitionPolicySaved" };
}

export async function runRecognition(
  input: RecognitionInput,
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<RecognitionResult> {
  const { companyId, evidenceId, dryRun } = input;
  const access = await CompanyAuthRepository.requireMember(
    userId,
    companyId,
    CompanyMemberRole.ACCOUNTANT,
    logger,
    locale,
  );
  if (!access.success) {
    return { status: "recognitionForbidden" };
  }

  try {
    return await db.transaction(async (tx) => {
      const company = await lockLedgerCompany(tx, companyId);
      if (!company) {
        return { status: "recognitionForbidden" };
      }
      const source = paymentAccountingEvidence;
      const posting = paymentAccountingPostings;
      const offer = paymentAccountingOffers;
      const [original] = await tx
        .select({
          evidence: source,
          sale: posting,
          offer,
          transaction: paymentTransactions,
        })
        .from(source)
        .innerJoin(
          posting,
          and(
            eq(posting.provider, source.provider),
            eq(posting.merchantId, source.merchantId),
            eq(posting.externalId, source.externalId),
            eq(posting.sourceKind, source.sourceKind),
          ),
        )
        .innerJoin(offer, eq(offer.id, posting.mappingId))
        .innerJoin(
          paymentTransactions,
          eq(paymentTransactions.id, posting.transactionId),
        )
        .where(
          and(
            eq(source.id, evidenceId),
            eq(posting.companyId, companyId),
            eq(posting.sourceKind, "sale"),
            eq(offer.recognition, "deferred"),
          ),
        )
        .for("update", { of: source });
      if (!original || original.sale.currency !== (company.currency ?? "EUR")) {
        return { status: "recognitionEvidenceMissing" };
      }
      if (input.effectiveFrom || input.revenueAccountId) {
        return savePolicy(tx, input, original.offer.id);
      }

      const { sale, transaction } = original;
      if (
        transaction.status !== PaymentStatus.SUCCEEDED ||
        !sale.invoiceId ||
        !sale.receiptEntryId
      ) {
        return { status: "recognitionEvidenceMissing" };
      }
      const postings = await tx
        .select({ id: journalEntries.id })
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.companyId, companyId),
            eq(journalEntries.sourceId, sale.invoiceId),
            eq(journalEntries.status, JournalEntryStatus.POSTED),
            inArray(journalEntries.id, [
              sale.journalEntryId,
              sale.receiptEntryId,
            ]),
          ),
        );
      if (postings.length !== 2) {
        return { status: "recognitionEvidenceMissing" };
      }
      const [credit] = await tx
        .select({ id: paymentInvoices.id })
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.companyId, companyId),
            sql`${paymentInvoices.metadata}->>'originalInvoiceId' = ${sale.invoiceId}`,
          ),
        )
        .limit(1);
      if (credit) {
        return { status: "recognitionEvidenceMissing" };
      }

      if (transaction.mode === CheckoutMode.SUBSCRIPTION) {
        const { evidence, offer: deferredOffer } = original;
        if (
          transaction.provider !== PaymentProvider.STRIPE ||
          !transaction.providerPaymentIntentId ||
          transaction.providerInvoiceId !== evidence.invoiceReference
        ) {
          return { status: "recognitionSubscriptionReview" };
        }
        return runServicePeriodRecognition(tx, {
          evidence,
          sale,
          offer: deferredOffer,
          paymentIntent: transaction.providerPaymentIntentId,
          dryRun,
          userId,
          logger,
        });
      }
      if (
        !creditProduct.safeParse(transaction.metadata).success ||
        !transaction.providerSessionId
      ) {
        return { status: "recognitionSubscriptionReview" };
      }

      const [pack] = await tx
        .select({
          id: creditPacks.id,
          walletId: creditPacks.walletId,
          grant: sql<string>`cast(${creditPacks.originalAmount} as text)`,
          expiresAt: creditPacks.expiresAt,
        })
        .from(creditPacks)
        .innerJoin(creditWallets, eq(creditWallets.id, creditPacks.walletId))
        .where(
          and(
            eq(creditWallets.userId, transaction.userId),
            eq(creditPacks.type, CreditPackType.PERMANENT),
            sql`${creditPacks.metadata}->>'sessionId' = ${transaction.providerSessionId}`,
          ),
        );
      const grant = pack && creditAtoms(pack.grant);
      if (!pack || !grant) {
        return { status: "recognitionEvidenceMissing" };
      }

      const records = paymentAccountingRecognitions;
      const [prior] = await tx
        .select({
          atoms: sql<string>`cast(coalesce(sum(cast(${records.creditsAtomic} as numeric)), 0) as text)`,
          cents: sql<number>`coalesce(sum(${records.netMinor}), 0)`.mapWith(
            Number,
          ),
        })
        .from(records)
        .where(eq(records.postingId, sale.id));
      let releasedCredits = BigInt(prior?.atoms ?? "0");
      let releasedMinor = prior?.cents ?? 0;
      const movement = creditTransactions;
      const movements = await tx
        .select({
          id: movement.id,
          type: movement.type,
          date: movement.createdAt,
          journalEntryId: movement.journalEntryId,
          credits: sql<string>`cast(abs(${movement.amount}) as text)`,
        })
        .from(movement)
        .leftJoin(records, eq(records.creditTransactionId, movement.id))
        .where(
          and(
            eq(movement.walletId, pack.walletId),
            eq(movement.packId, pack.id),
            inArray(movement.type, [
              CreditTransactionType.USAGE,
              CreditTransactionType.EXPIRY,
            ]),
            sql`${movement.amount} < 0 and ${records.id} is null`,
          ),
        )
        .orderBy(asc(movement.createdAt), asc(movement.id))
        .limit(maxMovements);
      if (!movements.length) {
        return { status: "recognitionCurrent" };
      }
      const policies = paymentAccountingRecognitionPolicies;
      const plans: {
        sourceId: string;
        date: Date;
        policy: Policy;
        credits: bigint;
        minor: number;
      }[] = [];
      let issue: Status | undefined;
      for (const row of movements) {
        const credits = creditAtoms(row.credits);
        if (!credits || row.date < sale.sourceDate || row.journalEntryId) {
          issue = "recognitionEvidenceMissing";
          break;
        }
        const day = row.date.toISOString().slice(0, 10);
        const [policy] = await tx
          .select()
          .from(policies)
          .where(
            and(
              eq(policies.mappingId, sale.mappingId),
              lte(policies.effectiveFrom, day),
            ),
          )
          .orderBy(desc(policies.effectiveFrom))
          .limit(1);
        if (!policy) {
          issue = "recognitionPolicyMissing";
          break;
        }
        if (
          row.type === CreditTransactionType.EXPIRY &&
          (!policy.recognizeExpiry ||
            !pack.expiresAt ||
            pack.expiresAt > row.date)
        ) {
          issue = "recognitionExpiryReview";
          break;
        }
        const minor = recognitionMinor(
          sale.netMinor,
          grant,
          releasedCredits,
          releasedMinor,
          credits,
        );
        if (minor === undefined) {
          issue = "recognitionEvidenceMissing";
          break;
        }
        if (minor && !(await findOpenPeriod(tx, companyId, row.date))) {
          issue = "recognitionPeriodClosed";
          break;
        }
        plans.push({
          sourceId: row.id,
          date: row.date,
          policy,
          credits,
          minor,
        });
        releasedCredits += credits;
        releasedMinor += minor;
      }
      if (issue && !plans.length) {
        return { status: issue };
      }

      const activeAccounts = await tx
        .select()
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, companyId),
            eq(accountNodes.isActive, true),
            eq(accountNodes.isPostable, true),
            inArray(accountNodes.id, [
              original.offer.considerationAccountId,
              ...plans.map(({ policy }) => policy.revenueAccountId),
            ]),
          ),
        );
      const liability = activeAccounts.find(
        ({ id }) => id === original.offer.considerationAccountId,
      );
      if (
        liability?.type !== AccountType.LIABILITY ||
        plans.some(
          ({ policy }) =>
            !activeAccounts.some(
              ({ id, type }) =>
                id === policy.revenueAccountId && type === AccountType.REVENUE,
            ),
        )
      ) {
        return { status: "recognitionInvalidAccounts" };
      }

      const result = {
        currency: sale.currency,
        entries: plans.length,
        netMinor: releasedMinor - (prior?.cents ?? 0),
        pendingStatus: issue,
      };
      if (dryRun) {
        return { ...result, status: "recognitionPreview" };
      }

      for (const plan of plans) {
        const revenue = activeAccounts.find(
          ({ id }) => id === plan.policy.revenueAccountId,
        );
        if (!revenue) {
          return tx.rollback();
        }
        const journalEntryId =
          plan.minor > 0
            ? await postJournalEntry(
                {
                  companyId,
                  date: plan.date,
                  description: sale.externalId,
                  sourceType: JournalSourceType.CREDIT_TRANSACTION,
                  sourceId: plan.sourceId,
                  lines: [
                    {
                      accountNodeId: liability.id,
                      subtype: liability.subtype,
                      type: LineType.DEBIT,
                      amount: plan.minor / 100,
                      currency: sale.currency,
                    },
                    {
                      accountNodeId: revenue.id,
                      subtype: revenue.subtype,
                      type: LineType.CREDIT,
                      amount: plan.minor / 100,
                      currency: sale.currency,
                    },
                  ],
                  logger,
                  postedByUserId: userId,
                },
                tx,
              )
            : null;
        if (plan.minor > 0 && !journalEntryId) {
          return tx.rollback();
        }
        await tx.insert(records).values({
          postingId: sale.id,
          policyId: plan.policy.id,
          creditTransactionId: plan.sourceId,
          creditsAtomic: plan.credits.toString(),
          netMinor: plan.minor,
          journalEntryId,
          sourceDate: plan.date,
        });
      }
      return { ...result, status: "recognitionPosted" };
    });
  } catch {
    logger.error("Revenue recognition transaction failed");
    return { status: "recognitionFailed" };
  }
}

export async function recognizeProcessorRevenue(
  data: RecognitionInput,
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): Promise<ResponseType<(typeof definition.POST)["types"]["ResponseOutput"]>> {
  const result = await runRecognition(data, userId, logger, locale);
  if (result.status === "recognitionForbidden") {
    return fail({
      message: t("recognitionForbidden"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }
  return success({ result });
}
