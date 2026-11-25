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

  const issue = validateJournalLines(lines, company.currency ?? "EUR");
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

  const accountConditions = lines.flatMap((line) =>
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
  for (const [sortOrder, line] of lines.entries()) {
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
