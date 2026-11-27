import "server-only";

import { and, asc, eq, inArray, or } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
  type NewJournalEntryLine,
} from "../db";
import {
  type AccountSubtypeDB,
  JournalEntryStatus,
  type JournalSourceTypeDB,
  type LineTypeDB,
} from "../enum";
import { convertToFunctional, lookupExchangeRate } from "../exchange-rates/ecb";
import { validateJournalLines } from "./journal-validation";
import {
  findOpenPeriod,
  type LedgerTransaction,
  lockLedgerCompany,
  nextJournalEntryNumber,
} from "./ledger-write";

export interface AutoPostLine {
  subtype: (typeof AccountSubtypeDB)[number];
  fallbackSubtype?: (typeof AccountSubtypeDB)[number];
  type: (typeof LineTypeDB)[number];
  amount: number;
  currency: string;
  /** Optional precomputed functional-currency amount for multi-currency entries. */
  functionalAmount?: number;
  /** Optional functional currency code (defaults to company.currency). */
  functionalCurrency?: string;
  /** Optional exchange rate: 1 transactionCurrency = exchangeRate functionalCurrency. */
  exchangeRate?: number;
  description?: string;
  /** Select this active account instead of resolving by subtype. */
  accountNodeId?: string;
}

export interface AutoPostParams {
  companyId: string;
  date: Date;
  description: string;
  sourceType: (typeof JournalSourceTypeDB)[number];
  sourceId: string;
  lines: AutoPostLine[];
  logger: EndpointLogger;
  postedByUserId?: string;
}

/** Post inside the caller's transaction. Invalid inputs return null before any write. */
export async function postJournalEntry(
  params: AutoPostParams,
  tx: LedgerTransaction,
): Promise<string | null> {
  const {
    companyId,
    date,
    description,
    sourceType,
    sourceId,
    lines,
    postedByUserId,
  } = params;
  const company = await lockLedgerCompany(tx, companyId);
  if (!company || !Number.isFinite(date.getTime())) {
    return null;
  }

  const functionalCurrency = (company.currency ?? "EUR").toUpperCase();
  const hasForeignLine = lines.some(
    (l) => l.currency.toUpperCase() !== functionalCurrency,
  );

  const translatedLines: Array<
    AutoPostLine & {
      resolvedFunctionalAmount: number;
      resolvedFunctionalCurrency: string;
      resolvedExchangeRate: number;
    }
  > = [];

  for (const line of lines) {
    const lineCurrency = line.currency.toUpperCase();
    if (line.functionalAmount !== undefined) {
      translatedLines.push({
        ...line,
        currency: lineCurrency,
        resolvedFunctionalAmount: line.functionalAmount,
        resolvedFunctionalCurrency:
          line.functionalCurrency ?? functionalCurrency,
        resolvedExchangeRate:
          line.exchangeRate ??
          (line.amount > 0 ? line.functionalAmount / line.amount : 1),
      });
    } else if (lineCurrency === functionalCurrency) {
      translatedLines.push({
        ...line,
        currency: lineCurrency,
        resolvedFunctionalAmount: line.amount,
        resolvedFunctionalCurrency: functionalCurrency,
        resolvedExchangeRate: 1,
      });
    } else {
      const rate =
        line.exchangeRate ??
        (await lookupExchangeRate(tx, lineCurrency, functionalCurrency, date))
          ?.rate;
      if (!rate || !Number.isFinite(rate) || rate <= 0) {
        params.logger.warn("Missing exchange rate for foreign-currency entry", {
          companyId,
          sourceType,
          sourceId,
          fromCurrency: lineCurrency,
          toCurrency: functionalCurrency,
        });
        return null;
      }
      translatedLines.push({
        ...line,
        currency: lineCurrency,
        resolvedFunctionalAmount: convertToFunctional(line.amount, rate),
        resolvedFunctionalCurrency: functionalCurrency,
        resolvedExchangeRate: rate,
      });
    }
  }

  const issue = validateJournalLines(
    translatedLines.map((l) => ({
      type: l.type,
      amount: l.amount,
      currency: l.currency,
      functionalAmount: hasForeignLine ? l.resolvedFunctionalAmount : undefined,
    })),
    functionalCurrency,
  );
  if (issue) {
    params.logger.warn("Invalid automatic journal entry", {
      companyId,
      sourceType,
      sourceId,
      issue,
    });
    return null;
  }

  const period = await findOpenPeriod(tx, companyId, date);
  if (!period) {
    return null;
  }

  const accountConditions = translatedLines.flatMap((line) =>
    line.accountNodeId
      ? [eq(accountNodes.id, line.accountNodeId)]
      : [
          inArray(
            accountNodes.subtype,
            line.fallbackSubtype
              ? [line.subtype, line.fallbackSubtype]
              : [line.subtype],
          ),
        ],
  );
  const accounts = await tx
    .select({ id: accountNodes.id, subtype: accountNodes.subtype })
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.companyId, companyId),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
        or(...accountConditions),
      ),
    )
    .orderBy(asc(accountNodes.code), asc(accountNodes.id))
    .for("share");

  const resolvedLines: Omit<NewJournalEntryLine, "journalEntryId">[] = [];
  for (const [sortOrder, line] of translatedLines.entries()) {
    const account = line.accountNodeId
      ? accounts.find(({ id }) => id === line.accountNodeId)
      : (accounts.find(({ subtype }) => subtype === line.subtype) ??
        accounts.find(({ subtype }) => subtype === line.fallbackSubtype));
    if (!account) {
      return null;
    }
    resolvedLines.push({
      accountId: account.id,
      type: line.type,
      amount: line.amount,
      currency: line.currency,
      functionalAmount: line.resolvedFunctionalAmount,
      functionalCurrency: line.resolvedFunctionalCurrency,
      exchangeRate: line.resolvedExchangeRate,
      description: line.description ?? null,
      sortOrder,
    });
  }

  const entryNumber = await nextJournalEntryNumber(tx, companyId, date);
  const [entry] = await tx
    .insert(journalEntries)
    .values({
      companyId,
      periodId: period.id,
      entryNumber,
      date,
      description,
      status: JournalEntryStatus.POSTED,
      sourceType,
      sourceId,
      postedAt: new Date(),
      postedByUserId,
    })
    .returning({ id: journalEntries.id });
  if (!entry) {
    return null;
  }

  await tx
    .insert(journalEntryLines)
    .values(
      resolvedLines.map((line) => ({ ...line, journalEntryId: entry.id })),
    );
  return entry.id;
}

/** Best-effort posting for callers without an existing transaction. */
export async function autoPostJournalEntry(
  params: AutoPostParams,
): Promise<string | null> {
  try {
    return await db.transaction((tx) => postJournalEntry(params, tx));
  } catch (error) {
    params.logger.error(
      "Failed to post automatic journal entry",
      parseError(error),
    );
    return null;
  }
}
