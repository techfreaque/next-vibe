/**
 * Estimate List Repository
 * Lists estimates for a company with optional status filter and pagination
 */

import "server-only";

import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
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
import { documentPage, documentSearchPattern } from "@/finance/document-list";

import { paymentEstimateLines, paymentEstimates } from "../../db";
import type {
  EstimateListRequestOutput,
  EstimateListResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class EstimateListRepository {
  static async listEstimates(
    userId: string,
    data: EstimateListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (data.companyId) {
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
      }

      const selectedCompanies = await getDocumentCompanies(
        userId,
        data.companyId,
      );
      const companyNames = new Map(
        selectedCompanies.map((company) => [company.id, company.name]),
      );
      const hasFilters = Boolean(
        data.companyId || data.status || data.search || data.customerId,
      );
      const pageSize = data.pageSize;
      if (companyNames.size === 0) {
        if (data.companyId) {
          return fail({
            message: t("get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        return success({
          total: 0,
          estimates: [],
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
        inArray(paymentEstimates.companyId, [...companyNames.keys()]),
        data.status ? eq(paymentEstimates.status, data.status) : undefined,
        data.customerId
          ? eq(paymentEstimates.customerId, data.customerId)
          : undefined,
        pattern
          ? or(
              ilike(paymentEstimates.estimateNumber, pattern),
              ilike(paymentEstimates.customerName, pattern),
              ilike(paymentEstimates.customerEmail, pattern),
              ilike(paymentEstimates.title, pattern),
              ilike(sql`${paymentEstimates.id}::text`, pattern),
            )
          : undefined,
      );
      const [{ value: total }] = await db
        .select({ value: count() })
        .from(paymentEstimates)
        .where(where);
      const pagination = documentPage(total, data.page, pageSize);
      const offset = (pagination.currentPage - 1) * pageSize;

      const rows = await db
        .select()
        .from(paymentEstimates)
        .where(where)
        .orderBy(desc(paymentEstimates.createdAt), paymentEstimates.id)
        .limit(pageSize)
        .offset(offset);

      // Get line counts for all estimates in this batch
      const estimateIds = rows.map((r) => r.id);
      const lineCounts =
        estimateIds.length > 0
          ? await db
              .select({
                estimateId: paymentEstimateLines.estimateId,
                cnt: count(),
              })
              .from(paymentEstimateLines)
              .where(inArray(paymentEstimateLines.estimateId, estimateIds))
              .groupBy(paymentEstimateLines.estimateId)
          : [];

      const lineCountMap = new Map(
        lineCounts.map((lc) => [lc.estimateId, Number(lc.cnt)]),
      );

      logger.debug("Estimates listed", {
        companyId: data.companyId,
        total,
        page: pagination.currentPage,
      });

      const selectedCompanyId =
        data.companyId ??
        (selectedCompanies.length === 1 ? selectedCompanies[0]?.id : undefined);
      return success({
        total,
        ...pagination,
        hasFilters,
        selectedCompanyId: selectedCompanyId ?? null,
        selectedCompanyName: selectedCompanyId
          ? (companyNames.get(selectedCompanyId) ?? null)
          : null,
        estimates: rows.map((e) => ({
          id: e.id,
          companyId: e.companyId,
          companyName: companyNames.get(e.companyId) ?? null,
          estimateNumber: e.estimateNumber,
          status: e.status,
          customerId: e.customerId ?? null,
          customerName: e.customerName ?? null,
          currency: e.currency,
          total: e.total,
          validUntil: e.validUntil ?? null,
          lineCount: lineCountMap.get(e.id) ?? 0,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        })),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to list estimates", { error: parsed.message });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
