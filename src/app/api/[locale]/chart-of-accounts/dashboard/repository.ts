/**
 * Chart of Accounts — Accounting Dashboard Repository
 * Aggregates stats: open period, account count, draft count, posted-this-month count
 */

import "server-only";

import { and, count, eq, gte, lte } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { CountryLanguage } from "@/i18n/core/config";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
import { scopedTranslation } from "./i18n";
} from "../db";
import { JournalEntryStatus, PeriodStatus } from "../enum";
import type { AccountingDashboardRequestOutput } from "./definition";

interface DashboardData {
  currentPeriodId: string | null;
  currentPeriodName: string | null;
  currentPeriodStatus: string | null;
  currentPeriodStartDate: string | null;
  currentPeriodEndDate: string | null;
  accountCount: number;
  draftEntryCount: number;
  postedThisMonthCount: number;
  hasSetup: boolean;
  currency: string;
}

export class AccountingDashboardRepository {
  static async getDashboard(
    data: AccountingDashboardRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<DashboardData>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (!data.companyId) {
      return success({
        currentPeriodId: null,
        currentPeriodName: null,
        currentPeriodStatus: null,
        currentPeriodStartDate: null,
        currentPeriodEndDate: null,
        accountCount: 0,
        draftEntryCount: 0,
        postedThisMonthCount: 0,
        hasSetup: false,
        currency: "EUR",
      });
    }

    const authResult = await CompanyAuthRepository.requireMember(
      user.id,
      data.companyId,
      null,
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      // 1. Open period
      const openPeriods = await db
        .select({
          id: accountingPeriods.id,
          name: accountingPeriods.name,
          status: accountingPeriods.status,
          startDate: accountingPeriods.startDate,
          endDate: accountingPeriods.endDate,
        })
        .from(accountingPeriods)
        .where(
          and(
            eq(accountingPeriods.companyId, data.companyId),
            eq(accountingPeriods.status, PeriodStatus.OPEN),
          ),
        )
        .limit(1);

      const openPeriod = openPeriods[0] ?? null;

      // 2. Active account count
      const accountCountRows = await db
        .select({ cnt: count() })
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, data.companyId),
            eq(accountNodes.isActive, true),
          ),
        );
      const accountCount = accountCountRows[0]?.cnt ?? 0;

      // 3. Draft journal entries count
      const draftCountRows = await db
        .select({ cnt: count() })
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.companyId, data.companyId),
            eq(journalEntries.status, JournalEntryStatus.DRAFT),
          ),
        );
      const draftEntryCount = draftCountRows[0]?.cnt ?? 0;

      // 4. Posted entries this calendar month
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const postedCountRows = await db
        .select({ cnt: count() })
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.companyId, data.companyId),
            eq(journalEntries.status, JournalEntryStatus.POSTED),
            gte(journalEntries.date, monthStart),
            lte(journalEntries.date, monthEnd),
          ),
        );
      const postedThisMonthCount = postedCountRows[0]?.cnt ?? 0;

      // 5. Detect primary currency from first posted journal entry line
      const currencyRows = await db
        .select({ currency: journalEntryLines.currency })
        .from(journalEntryLines)
        .innerJoin(
          journalEntries,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .where(
          and(
            eq(journalEntries.companyId, data.companyId),
            eq(journalEntries.status, JournalEntryStatus.POSTED),
          ),
        )
        .limit(1);
      const currency = currencyRows[0]?.currency ?? "EUR";

      return success({
        currentPeriodId: openPeriod?.id ?? null,
        currentPeriodName: openPeriod?.name ?? null,
        currentPeriodStatus: openPeriod?.status ?? null,
        currentPeriodStartDate:
          openPeriod?.startDate?.toISOString().slice(0, 10) ?? null,
        currentPeriodEndDate:
          openPeriod?.endDate?.toISOString().slice(0, 10) ?? null,
        accountCount: Number(accountCount),
        draftEntryCount: Number(draftEntryCount),
        postedThisMonthCount: Number(postedThisMonthCount),
        hasSetup: Number(accountCount) > 0,
        currency,
      });
    } catch (error) {
      logger.error("Error loading accounting dashboard", parseError(error));
      return fail({
        message: t("dashboard.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
