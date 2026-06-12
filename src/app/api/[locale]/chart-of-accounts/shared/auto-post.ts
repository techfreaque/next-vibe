/**
 * Auto-posts a journal entry for a company.
 * Best-effort — never throws.
 * Returns journalEntryId if successful, null if company has no CoA configured or posting fails.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
  type NewJournalEntryLine,
} from "../db";
import type {
  AccountSubtypeDB,
  JournalSourceTypeDB,
  LineTypeDB,
} from "../enum";
import { JournalEntryStatus, PeriodStatus } from "../enum";

export interface AutoPostLine {
  /** Account subtype to resolve. Must be a valid AccountSubtype value. Ignored if accountNodeId is set. */
  subtype: (typeof AccountSubtypeDB)[number];
  type: (typeof LineTypeDB)[number];
  amount: number;
  currency: string;
  description?: string;
  /** When provided, skip subtype resolution and use this account node directly */
  accountNodeId?: string;
}

export interface AutoPostParams {
  companyId: string;
  date: Date;
  description: string;
  sourceType: (typeof JournalSourceTypeDB)[number];
  sourceId: string;
  lines: AutoPostLine[];
  logger?: EndpointLogger;
}

/**
 * Auto-posts a journal entry for a company. Best-effort — never throws.
 * Returns journalEntryId if successful, null if company has no CoA configured or posting fails.
 */
export async function autoPostJournalEntry(
  params: AutoPostParams,
): Promise<string | null> {
  const { logger } = params;
  try {
    const { companyId, date, description, sourceType, sourceId, lines } =
      params;

    // 1. Find open accounting period covering date
    const [period] = await db
      .select({ id: accountingPeriods.id })
      .from(accountingPeriods)
      .where(
        and(
          eq(accountingPeriods.companyId, companyId),
          eq(accountingPeriods.status, PeriodStatus.OPEN),
          sql`${accountingPeriods.startDate} <= ${date}`,
          sql`${accountingPeriods.endDate} >= ${date}`,
        ),
      )
      .limit(1);

    if (!period) {
      return null;
    }

    const periodId = period.id;

    // 2. Resolve accountNodeId for each line (skip if already provided)
    const resolvedLines: Array<
      Pick<
        NewJournalEntryLine,
        "accountId" | "type" | "amount" | "currency" | "description"
      >
    > = [];

    for (const line of lines) {
      if (line.accountNodeId) {
        resolvedLines.push({
          accountId: line.accountNodeId,
          type: line.type,
          amount: line.amount,
          currency: line.currency,
          description: line.description,
        });
        continue;
      }

      const [accountNode] = await db
        .select({ id: accountNodes.id })
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, companyId),
            eq(accountNodes.subtype, line.subtype),
            eq(accountNodes.isActive, true),
          ),
        )
        .limit(1);

      if (!accountNode) {
        // ANY required account node not found → silently return null
        return null;
      }

      resolvedLines.push({
        accountId: accountNode.id,
        type: line.type,
        amount: line.amount,
        currency: line.currency,
        description: line.description,
      });
    }

    // 3. Generate entry number: JE-{YYYYMMDD}-{randomHex6}
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const randomHex = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
    const entryNumber = `JE-${year}${month}${day}-${randomHex}`;

    // 4. INSERT journal entry (status POSTED)
    const now = new Date();
    const [entry] = await db
      .insert(journalEntries)
      .values({
        companyId,
        periodId,
        entryNumber,
        date,
        description,
        status: JournalEntryStatus.POSTED,
        sourceType,
        sourceId,
        postedAt: now,
      })
      .returning({ id: journalEntries.id });

    if (!entry) {
      return null;
    }

    // 5. INSERT all journal entry lines
    for (const [idx, line] of resolvedLines.entries()) {
      await db.insert(journalEntryLines).values({
        journalEntryId: entry.id,
        accountId: line.accountId,
        type: line.type,
        amount: line.amount,
        currency: line.currency,
        description: line.description ?? null,
        sortOrder: idx,
      });
    }

    return entry.id;
  } catch (error) {
    // Best-effort — log but never propagate
    logger?.error("[autoPostJournalEntry] Failed to post journal entry", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
