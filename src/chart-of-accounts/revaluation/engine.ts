/**
 * Period-End Unrealized FX Revaluation Engine
 *
 * Revalues open foreign-currency monetary balances (AR, AP, Bank, Cash)
 * at period-end closing rates, booking unrealized FX gain/loss to
 * FINANCIAL_INCOME / FINANCIAL_EXPENSE in the company's functional currency.
 * Supports dryRun preview and optional next-day auto-reversal entry.
 */

import "server-only";

import { and, eq, inArray, lt, ne, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "@/companies/db";

import { accountNodes, journalEntries, journalEntryLines } from "../db";
import {
  AccountSubtype,
  JournalSourceType,
  ledgerEntryStatuses,
  LineType,
} from "../enum";
import { convertToFunctional, lookupExchangeRate } from "../exchange-rates/ecb";
import { type AutoPostLine, postJournalEntry } from "../shared/auto-post";
import { nextAccountingDay } from "../shared/journal-validation";

const MONETARY_REVALUATION_SUBTYPES = [
  AccountSubtype.ACCOUNTS_RECEIVABLE,
  AccountSubtype.ACCOUNTS_PAYABLE,
  AccountSubtype.BANK,
  AccountSubtype.CASH,
] as const;

export interface RevaluationLineItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  subtype: string;
  currency: string;
  foreignBalance: number;
  carryingFunctional: number;
  closingRate: number;
  revaluedFunctional: number;
  unrealizedGainLoss: number;
}

export interface RevaluationResult {
  companyId: string;
  functionalCurrency: string;
  asOfDate: string;
  dryRun: boolean;
  items: RevaluationLineItem[];
  totalUnrealizedGainLoss: number;
  missingRateCurrencies: string[];
  journalEntryId: string | null;
  reversalEntryId: string | null;
}

export async function runUnrealizedFxRevaluation(params: {
  companyId: string;
  asOfDate: string;
  dryRun: boolean;
  postReversalNextDay: boolean;
  userId: string;
  logger: EndpointLogger;
}): Promise<RevaluationResult | null> {
  const [company] = await db
    .select({ id: companies.id, currency: companies.currency })
    .from(companies)
    .where(eq(companies.id, params.companyId))
    .limit(1);
  if (!company) {
    return null;
  }

  const functionalCurrency = (company.currency ?? "EUR").toUpperCase();
  const asOf = new Date(`${params.asOfDate.slice(0, 10)}T00:00:00.000Z`);
  if (!Number.isFinite(asOf.getTime())) {
    return null;
  }

  // Group monetary accounts by (account, foreign currency) up to asOfDate
  const rows = await db
    .select({
      accountId: accountNodes.id,
      code: accountNodes.code,
      name: accountNodes.name,
      subtype: accountNodes.subtype,
      currency: journalEntryLines.currency,
      foreignUnits: sql<string>`(sum(case
        when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount}
        else -${journalEntryLines.amount}
      end) * 10000)::numeric(30, 0)`,
      functionalUnits: sql<string>`(sum(case
        when ${journalEntryLines.type} = ${LineType.DEBIT} then coalesce(${journalEntryLines.functionalAmount}, ${journalEntryLines.amount})
        else -coalesce(${journalEntryLines.functionalAmount}, ${journalEntryLines.amount})
      end) * 10000)::numeric(30, 0)`,
    })
    .from(journalEntryLines)
    .innerJoin(
      journalEntries,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .innerJoin(accountNodes, eq(journalEntryLines.accountId, accountNodes.id))
    .where(
      and(
        eq(journalEntries.companyId, company.id),
        eq(accountNodes.companyId, company.id),
        inArray(journalEntries.status, ledgerEntryStatuses),
        lt(journalEntries.date, nextAccountingDay(asOf)),
        inArray(accountNodes.subtype, [...MONETARY_REVALUATION_SUBTYPES]),
        ne(journalEntryLines.currency, functionalCurrency),
      ),
    )
    .groupBy(
      accountNodes.id,
      accountNodes.code,
      accountNodes.name,
      accountNodes.subtype,
      journalEntryLines.currency,
    );

  const items: RevaluationLineItem[] = [];
  const missingSet = new Set<string>();
  let totalDeltaUnits = BigInt(0);

  for (const row of rows) {
    const foreignUnits = BigInt(row.foreignUnits);
    if (foreignUnits === BigInt(0)) {
      continue;
    }
    const foreignBalance = Number(foreignUnits) / 10_000;
    const carryingUnits = BigInt(row.functionalUnits);
    const carryingFunctional = Number(carryingUnits) / 10_000;

    const resolved = await lookupExchangeRate(
      db,
      row.currency,
      functionalCurrency,
      asOf,
    );
    if (!resolved) {
      missingSet.add(row.currency);
      continue;
    }

    const revaluedFunctional = convertToFunctional(
      foreignBalance,
      resolved.rate,
    );
    const revaluedUnits = BigInt(Math.round(revaluedFunctional * 10_000));
    // Debit-normal net balance: higher debit balance = gain; higher credit (negative) liability = loss
    const deltaUnits = revaluedUnits - carryingUnits;
    if (deltaUnits === BigInt(0)) {
      continue;
    }
    totalDeltaUnits += deltaUnits;

    items.push({
      accountId: row.accountId,
      accountCode: row.code,
      accountName: row.name,
      subtype: row.subtype,
      currency: row.currency,
      foreignBalance,
      carryingFunctional,
      closingRate: resolved.rate,
      revaluedFunctional,
      unrealizedGainLoss: Number(deltaUnits) / 10_000,
    });
  }

  let journalEntryId: string | null = null;
  let reversalEntryId: string | null = null;

  if (!params.dryRun && items.length > 0) {
    const postLines: AutoPostLine[] = [];
    for (const item of items) {
      const absDelta = Math.abs(item.unrealizedGainLoss);
      const isGain = item.unrealizedGainLoss > 0;
      const acctSubtype =
        item.subtype === AccountSubtype.ACCOUNTS_PAYABLE
          ? AccountSubtype.ACCOUNTS_PAYABLE
          : item.subtype === AccountSubtype.ACCOUNTS_RECEIVABLE
            ? AccountSubtype.ACCOUNTS_RECEIVABLE
            : item.subtype === AccountSubtype.CASH
              ? AccountSubtype.CASH
              : AccountSubtype.BANK;

      postLines.push({
        accountNodeId: item.accountId,
        subtype: acctSubtype,
        type: isGain ? LineType.DEBIT : LineType.CREDIT,
        amount: absDelta,
        currency: functionalCurrency,
        functionalAmount: absDelta,
        functionalCurrency,
        exchangeRate: 1,
        description: `FX revaluation ${item.currency} @ ${item.closingRate}`,
      });
      postLines.push({
        subtype: isGain
          ? AccountSubtype.FINANCIAL_INCOME
          : AccountSubtype.FINANCIAL_EXPENSE,
        type: isGain ? LineType.CREDIT : LineType.DEBIT,
        amount: absDelta,
        currency: functionalCurrency,
        functionalAmount: absDelta,
        functionalCurrency,
        exchangeRate: 1,
        description: `Unrealized FX ${isGain ? "gain" : "loss"} (${item.currency})`,
      });
    }

    journalEntryId = await db.transaction((tx) =>
      postJournalEntry(
        {
          companyId: company.id,
          date: asOf,
          description: `Period-end FX revaluation (${params.asOfDate.slice(0, 10)})`,
          sourceType: JournalSourceType.MANUAL,
          sourceId: company.id,
          postedByUserId: params.userId,
          lines: postLines,
          logger: params.logger,
        },
        tx,
      ),
    );

    if (journalEntryId && params.postReversalNextDay) {
      const postedEntryId = journalEntryId;
      const nextDay = nextAccountingDay(asOf);
      const reverseLines: AutoPostLine[] = postLines.map((l) => ({
        ...l,
        type: l.type === LineType.DEBIT ? LineType.CREDIT : LineType.DEBIT,
        description: `Reversal: ${l.description ?? "FX revaluation"}`,
      }));
      reversalEntryId = await db.transaction((tx) =>
        postJournalEntry(
          {
            companyId: company.id,
            date: nextDay,
            description: `Auto-reversal FX revaluation (${params.asOfDate.slice(0, 10)})`,
            sourceType: JournalSourceType.MANUAL,
            sourceId: postedEntryId,
            postedByUserId: params.userId,
            lines: reverseLines,
            logger: params.logger,
          },
          tx,
        ),
      );
    }
  }

  return {
    companyId: company.id,
    functionalCurrency,
    asOfDate: params.asOfDate.slice(0, 10),
    dryRun: params.dryRun,
    items,
    totalUnrealizedGainLoss: Number(totalDeltaUnits) / 10_000,
    missingRateCurrencies: [...missingSet],
    journalEntryId,
    reversalEntryId,
  };
}
