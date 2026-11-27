import "server-only";

import { asc, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getDocumentCompanies } from "@/finance/document-company-scope";
import {
  companyPaymentSettings,
  recurringInvoiceSchedules,
} from "@/payment/db";

import { scopedTranslation } from "../i18n";
import type { RecurringListRequest, RecurringListResponse } from "./definition";

export class RecurringListRepository {
  static async listSchedules(
    userId: string,
    data: RecurringListRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RecurringListResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      let companyId = data.companyId;
      if (!companyId) {
        const companies = await getDocumentCompanies(userId);
        if (companies.length === 1) {
          companyId = companies[0].id;
        } else {
          return success({
            selectedCompanyId: null,
            companyEnabled: false,
            schedules: [],
          });
        }
      }
      const auth = await CompanyAuthRepository.requireMember(
        userId,
        companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!auth.success) {
        return auth;
      }
      const [settings] = await db
        .select({
          recurringInvoicesEnabled:
            companyPaymentSettings.recurringInvoicesEnabled,
        })
        .from(companyPaymentSettings)
        .where(eq(companyPaymentSettings.companyId, companyId))
        .limit(1);

      const rows = await db
        .select()
        .from(recurringInvoiceSchedules)
        .where(eq(recurringInvoiceSchedules.companyId, companyId))
        .orderBy(asc(recurringInvoiceSchedules.nextRunDate));

      return success({
        selectedCompanyId: companyId,
        companyEnabled: settings?.recurringInvoicesEnabled ?? false,
        schedules: rows.map((row) => {
          const totalEstimate = row.lineTemplates.reduce((sum, l) => {
            const net = l.quantity * l.unitPrice;
            return sum + net + net * l.taxRate;
          }, 0);
          return {
            id: row.id,
            companyId: row.companyId,
            title: row.title,
            customerName: row.customerName,
            customerEmail: row.customerEmail ?? null,
            frequency: row.frequency,
            nextRunDate: row.nextRunDate,
            endDate: row.endDate ?? null,
            dueDays: row.dueDays,
            currency: row.currency,
            totalEstimate: Math.round(totalEstimate * 100) / 100,
            isEnabled: row.isEnabled,
            autoIssue: row.autoIssue,
            autoSendEmail: row.autoSendEmail,
            lastRunAt: row.lastRunAt?.toISOString() ?? null,
            lastInvoiceId: row.lastInvoiceId ?? null,
          };
        }),
      });
    } catch (error) {
      logger.error("Failed to list recurring schedules", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
