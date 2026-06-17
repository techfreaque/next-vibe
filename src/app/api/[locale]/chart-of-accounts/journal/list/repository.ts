/**
 * Chart of Accounts — Journal List Repository
 */

import "server-only";

import { and, count, eq, gte, inArray, lte } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { journalEntries } from "../../db";
import { JournalEntryStatusDB, JournalSourceTypeDB } from "../../enum";
import { scopedTranslation } from "../../i18n";
import type { CoaJournalListRequestOutput } from "./definition";

export class CoaJournalListRepository {
  static async listEntries(
    data: CoaJournalListRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      entries: Array<{
        id: string;
        entryNumber: string;
        date: string;
        description: string;
        status: string;
        sourceType: string;
        postedAt: string | null;
      }>;
      totalCount: number;
    }>
  > {
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
        .select()
        .from(journalEntries)
        .where(where)
        .orderBy(journalEntries.date)
        .limit(pageSize)
        .offset(offset);

      return success({
        entries: rows.map((r) => ({
          id: r.id,
          entryNumber: r.entryNumber,
          date: r.date.toISOString(),
          description: r.description,
          status: r.status,
          sourceType: r.sourceType,
          postedAt: r.postedAt?.toISOString() ?? null,
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
