/**
 * Chart of Accounts — Journal List Repository
 */

import "server-only";

import { and, asc, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { journalEntries, journalEntryLines } from "../../db";
import {
  JournalEntryStatusDB,
  JournalSourceTypeDB,
  LineType,
} from "../../enum";
import { scopedTranslation } from "../../i18n";
import type {
  CoaJournalListRequestOutput,
  CoaJournalListResponseOutput,
} from "./definition";

export class CoaJournalListRepository {
  static async listEntries(
    data: CoaJournalListRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CoaJournalListResponseOutput>> {
    try {
      let companyIds: string[];

      if (data.companyId) {
        // Verify VIEWER+ company membership for the specific company
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          data.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
        companyIds = [data.companyId];
      } else {
        // No companyId — return data across all companies user is member of
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );
        companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ entries: [], totalCount: 0 });
        }
      }

      const conditions =
        companyIds.length === 1
          ? [eq(journalEntries.companyId, companyIds[0] as string)]
          : [inArray(journalEntries.companyId, companyIds)];

      if (data.periodId) {
        conditions.push(eq(journalEntries.periodId, data.periodId));
      }
      if (
        data.status &&
        (JournalEntryStatusDB as readonly string[]).includes(data.status)
      ) {
        const status = data.status as (typeof JournalEntryStatusDB)[number];
        conditions.push(eq(journalEntries.status, status));
      }
      if (
        data.sourceType &&
        (JournalSourceTypeDB as readonly string[]).includes(data.sourceType)
      ) {
        const sourceType =
          data.sourceType as (typeof JournalSourceTypeDB)[number];
        conditions.push(eq(journalEntries.sourceType, sourceType));
      }
      if (data.dateFrom) {
        conditions.push(gte(journalEntries.date, new Date(data.dateFrom)));
      }
      if (data.dateTo) {
        conditions.push(lte(journalEntries.date, new Date(data.dateTo)));
      }

      const where = and(...conditions);

      const [{ value: totalCount }] = await db
        .select({ value: count() })
        .from(journalEntries)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select({
          entry: journalEntries,
          companyName: companies.name,
        })
        .from(journalEntries)
        .leftJoin(companies, eq(companies.id, journalEntries.companyId))
        .where(where)
        .orderBy(
          desc(journalEntries.date),
          desc(journalEntries.entryNumber),
          desc(journalEntries.id),
        )
        .limit(pageSize)
        .offset(offset);

      const amounts =
        rows.length > 0
          ? await db
              .select({
                entryId: journalEntryLines.journalEntryId,
                currency: journalEntryLines.currency,
                amount: sql<number>`sum(${journalEntryLines.amount})::float8`,
              })
              .from(journalEntryLines)
              .where(
                and(
                  inArray(
                    journalEntryLines.journalEntryId,
                    rows.map(({ entry }) => entry.id),
                  ),
                  eq(journalEntryLines.type, LineType.DEBIT),
                ),
              )
              .groupBy(
                journalEntryLines.journalEntryId,
                journalEntryLines.currency,
              )
              .orderBy(asc(journalEntryLines.currency))
          : [];
      const totalsByEntry = new Map<
        string,
        { currency: string; amount: number }[]
      >();
      for (const { entryId, currency, amount } of amounts) {
        const totals = totalsByEntry.get(entryId) ?? [];
        totals.push({ currency, amount });
        totalsByEntry.set(entryId, totals);
      }

      return success({
        entries: rows.map(({ entry: r, companyName }) => ({
          id: r.id,
          entryNumber: r.entryNumber,
          date: r.date,
          description: r.description,
          status: r.status,
          sourceType: r.sourceType,
          postedAt: r.postedAt ?? null,
          companyId: r.companyId,
          companyName: companyName ?? null,
          debitTotals: totalsByEntry.get(r.id) ?? [],
        })),
        totalCount: totalCount ?? 0,
      });
    } catch (error) {
      logger.error("Error listing journal entries", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
