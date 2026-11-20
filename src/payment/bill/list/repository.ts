/**
 * AP Bill List Repository
 */

import "server-only";

import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyAuthRepository } from "@/companies/repository";
import { getDocumentCompanies } from "@/finance/document-company-scope";
import { documentPage, documentSearchPattern } from "@/finance/document-list";

import { paymentBills } from "../../db";
import { BillStatus } from "../../enum";
import type {
  BillListRequestOutput,
  BillListResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class BillListRepository {
  static async listBills(
    userId: string,
    data: BillListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (data.companyId) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          data.companyId,
          null,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
      }

      const selectedCompanies = await getDocumentCompanies(
        userId,
        data.companyId,
      );
      const companyNames = new Map(
        selectedCompanies.map((company) => [company.id, company.name]),
      );
      const hasFilters = Boolean(data.companyId || data.status || data.search);
      const pageSize = data.pageSize;
      if (companyNames.size === 0) {
        if (data.companyId) {
          return fail({
            message: t("get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        return success({
          totalCount: 0,
          bills: [],
          ...documentPage(0, data.page, pageSize),
          hasFilters,
          selectedCompanyId: null,
          selectedCompanyName: null,
        });
      }

      const pattern = data.search
        ? documentSearchPattern(data.search)
        : undefined;
      const where = and(
        inArray(paymentBills.companyId, [...companyNames.keys()]),
        data.status ? eq(paymentBills.status, data.status) : undefined,
        pattern
          ? or(
              ilike(paymentBills.billNumber, pattern),
              ilike(paymentBills.supplierName, pattern),
              ilike(sql`${paymentBills.id}::text`, pattern),
            )
          : undefined,
      );
      const [{ value: total }] = await db
        .select({ value: count() })
        .from(paymentBills)
        .where(where);
      const pagination = documentPage(total, data.page, pageSize);
      const offset = (pagination.currentPage - 1) * pageSize;

      const rows = await db
        .select({
          id: paymentBills.id,
          companyId: paymentBills.companyId,
          supplierName: paymentBills.supplierName,
          billNumber: paymentBills.billNumber,
          billDate: paymentBills.billDate,
          dueDate: paymentBills.dueDate,
          currency: paymentBills.currency,
          billTotal: paymentBills.total,
          status: paymentBills.status,
          createdAt: paymentBills.createdAt,
        })
        .from(paymentBills)
        .where(where)
        .orderBy(desc(paymentBills.billDate), paymentBills.id)
        .limit(pageSize)
        .offset(offset);

      const now = new Date();
      return success({
        totalCount: total,
        ...pagination,
        hasFilters,
        selectedCompanyId: data.companyId ?? null,
        selectedCompanyName: data.companyId
          ? (companyNames.get(data.companyId) ?? null)
          : null,
        bills: rows.map((row) => ({
          ...row,
          companyName: companyNames.get(row.companyId) ?? null,
          isOverdue:
            (row.status === BillStatus.RECEIVED ||
              row.status === BillStatus.APPROVED) &&
            row.dueDate !== null &&
            row.dueDate < now,
        })),
      });
    } catch (error) {
      logger.error("Failed to list AP bills", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
