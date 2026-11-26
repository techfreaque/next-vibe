import "server-only";

import { randomUUID } from "node:crypto";

import { and, asc, desc, eq, inArray, or } from "drizzle-orm";
import type { EndpointLogger } from "next-vibe/logger/types";

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
} from "@/chart-of-accounts/shared/ledger-write";

import {
  paymentAccountingEvidence,
  type paymentAccountingOffers,
  type paymentAccountingPostings,
  paymentAccountingRecognitionPolicies,
  paymentAccountingServiceRecognitions,
} from "../db";
import { recognitionMinor } from "../recognition-rules";
import type { RecognitionResult } from "./repository";

const dayMs = 86_400_000;
const maxDays = 30;

type Policy = typeof paymentAccountingRecognitionPolicies.$inferSelect;
type EntryAccount = typeof accountNodes.$inferSelect;

function utcDay(ms: number): number {
  return Math.floor(ms / dayMs) * dayMs;
}

export async function runServicePeriodRecognition(
  tx: LedgerTransaction,
  params: {
    evidence: typeof paymentAccountingEvidence.$inferSelect;
    sale: typeof paymentAccountingPostings.$inferSelect;
    offer: typeof paymentAccountingOffers.$inferSelect;
    paymentIntent: string;
    dryRun: boolean;
    userId: string;
    logger: EndpointLogger;
  },
): Promise<RecognitionResult> {
  const { evidence, sale, offer, paymentIntent, dryRun, userId, logger } =
    params;
  const { companyId, currency } = sale;
  const { servicePeriodStart, servicePeriodEnd, serviceNetMinor } = evidence;
  if (evidence.servicePeriodConflict) {
    return { status: "recognitionServiceConflict" };
  }
  if (
    !servicePeriodStart ||
    !servicePeriodEnd ||
    serviceNetMinor === null ||
    serviceNetMinor <= 0 ||
    serviceNetMinor !== sale.netMinor ||
    evidence.grossMinor !== sale.grossMinor ||
    evidence.currency !== currency ||
    evidence.taxMinor !== sale.taxMinor ||
    servicePeriodStart >= servicePeriodEnd
  ) {
    return { status: "recognitionSubscriptionReview" };
  }

  const sources = paymentAccountingEvidence;
  const [refund] = await tx
    .select({ id: sources.id })
    .from(sources)
    .where(
      and(
        eq(sources.provider, sale.provider),
        eq(sources.merchantId, sale.merchantId),
        eq(sources.sourceKind, "refund"),
        or(
          eq(sources.paymentIntentId, paymentIntent),
          eq(sources.invoiceReference, sale.externalId),
        ),
      ),
    )
    .limit(1);
  if (refund) {
    return { status: "recognitionEvidenceMissing" };
  }

  const records = paymentAccountingServiceRecognitions;
  const prior = await tx
    .select({
      id: records.id,
      from: records.serviceFrom,
      through: records.serviceThrough,
      net: records.netMinor,
      journalId: journalEntries.id,
      journalStatus: journalEntries.status,
    })
    .from(records)
    .leftJoin(
      journalEntries,
      and(
        eq(records.journalEntryId, journalEntries.id),
        eq(journalEntries.companyId, companyId),
        eq(journalEntries.sourceId, records.id),
        eq(journalEntries.sourceType, JournalSourceType.REVENUE_RECOGNITION),
      ),
    )
    .where(eq(records.postingId, sale.id))
    .orderBy(asc(records.serviceThrough));
  const start = servicePeriodStart.getTime();
  const finish = servicePeriodEnd.getTime();
  const duration = BigInt(finish - start);
  let through = start;
  let recognized = 0;
  for (const record of prior) {
    const end = record.through.getTime();
    const expected = recognitionMinor(
      serviceNetMinor,
      duration,
      BigInt(through - start),
      recognized,
      BigInt(end - through),
    );
    if (
      record.from.getTime() !== through ||
      expected !== record.net ||
      (record.net > 0 &&
        (!record.journalId ||
          record.journalStatus !== JournalEntryStatus.POSTED))
    ) {
      return { status: "recognitionEvidenceMissing" };
    }
    through = end;
    recognized += record.net;
  }

  const cutoff = Math.min(utcDay(Date.now()), finish);
  if (through >= cutoff) {
    return { status: "recognitionCurrent" };
  }
  const policiesTable = paymentAccountingRecognitionPolicies;
  const policies = await tx
    .select()
    .from(policiesTable)
    .where(eq(policiesTable.mappingId, sale.mappingId))
    .orderBy(desc(policiesTable.effectiveFrom));
  const accounts = await tx
    .select()
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.companyId, companyId),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
        inArray(accountNodes.id, [
          offer.considerationAccountId,
          ...policies.map(({ revenueAccountId }) => revenueAccountId),
        ]),
      ),
    );
  const liability = accounts.find(
    ({ id }) => id === offer.considerationAccountId,
  );
  if (liability?.type !== AccountType.LIABILITY) {
    return { status: "recognitionInvalidAccounts" };
  }

  const plans: {
    from: number;
    through: number;
    date: Date;
    minor: number;
    policy: Policy;
    revenue: EntryAccount;
  }[] = [];
  while (through < cutoff && plans.length < maxDays) {
    const end = Math.min(utcDay(through) + dayMs, cutoff);
    const date = new Date(
      Math.max(utcDay(through), utcDay(sale.sourceDate.getTime())),
    );
    const day = date.toISOString().slice(0, 10);
    const policy = policies.find(({ effectiveFrom }) => effectiveFrom <= day);
    if (!policy?.recognizeServicePeriods) {
      return { status: "recognitionPolicyMissing" };
    }
    const revenue = accounts.find(({ id }) => id === policy.revenueAccountId);
    if (revenue?.type !== AccountType.REVENUE) {
      return { status: "recognitionInvalidAccounts" };
    }
    if (!(await findOpenPeriod(tx, companyId, date))) {
      return { status: "recognitionPeriodClosed" };
    }

    const minor = recognitionMinor(
      serviceNetMinor,
      duration,
      BigInt(through - start),
      recognized,
      BigInt(end - through),
    );
    if (minor === undefined) {
      return { status: "recognitionEvidenceMissing" };
    }
    plans.push({ from: through, through: end, date, minor, policy, revenue });
    recognized += minor;
    through = end;
  }

  const result = {
    currency,
    entries: plans.length,
    netMinor: plans.reduce((total, plan) => total + plan.minor, 0),
  };
  if (dryRun) {
    return { ...result, status: "recognitionPreview" };
  }

  for (const plan of plans) {
    const id = randomUUID();
    const journalEntryId =
      plan.minor > 0
        ? await postJournalEntry(
            {
              companyId,
              date: plan.date,
              description: sale.externalId,
              sourceType: JournalSourceType.REVENUE_RECOGNITION,
              sourceId: id,
              lines: [
                {
                  accountNodeId: liability.id,
                  subtype: liability.subtype,
                  type: LineType.DEBIT,
                  amount: plan.minor / 100,
                  currency,
                },
                {
                  accountNodeId: plan.revenue.id,
                  subtype: plan.revenue.subtype,
                  type: LineType.CREDIT,
                  amount: plan.minor / 100,
                  currency,
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
      id,
      postingId: sale.id,
      policyId: plan.policy.id,
      sourceDate: plan.date,
      serviceFrom: new Date(plan.from),
      serviceThrough: new Date(plan.through),
      netMinor: plan.minor,
      journalEntryId,
    });
  }
  return { ...result, status: "recognitionPosted" };
}
