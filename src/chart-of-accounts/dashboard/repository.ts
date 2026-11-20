/**
 * Chart of Accounts — Accounting Dashboard Repository
 * Aggregates stats: open period, account count, draft count, posted-this-month count
 */

import "server-only";

import { and, count, eq, gte, lte } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getDocumentCompanies } from "@/finance/document-company-scope";

import { accountingPeriods, accountNodes, journalEntries } from "../db";
import { JournalEntryStatus, PeriodStatus } from "../enum";
import type {
  AccountingDashboardRequestOutput,
  AccountingDashboardResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class AccountingDashboardRepository {
  static async getDashboard(
    data: AccountingDashboardRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<AccountingDashboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (!data.companyId) {
      return success({
        selectedCompanyId: null,
        selectedCompanyName: null,
        canConfigure: false,
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
      const [company] = await getDocumentCompanies(user.id, data.companyId);
      if (!company) {
        return fail({
          message: t("dashboard.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

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

      return success({
        selectedCompanyId: company.id,
        selectedCompanyName: company.name,
        canConfigure:
          authResult.data.role === CompanyMemberRole.ADMIN ||
          authResult.data.role === CompanyMemberRole.OWNER,
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
        currency: company.currency ?? "EUR",
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
