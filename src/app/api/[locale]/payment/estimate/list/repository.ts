/**
 * Estimate List Repository
 * Lists estimates for a company with optional status filter and pagination
 */

import "server-only";

import { and, count, eq, inArray, type SQL, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentEstimateLines, paymentEstimates } from "../../db";
import type { EstimateStatusDB } from "../../enum";
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
      let companyFilter: SQL;
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
        companyFilter = eq(paymentEstimates.companyId, data.companyId);
      } else {
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );
        const companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ total: 0, estimates: [] });
        }
        companyFilter = inArray(paymentEstimates.companyId, companyIds);
      }

      const filters: SQL[] = [companyFilter];

      if (data.status) {
        filters.push(
          eq(
            paymentEstimates.status,
            data.status as (typeof EstimateStatusDB)[number],
          ),
        );
      }

      if (data.customerId) {
        filters.push(eq(paymentEstimates.customerId, data.customerId));
      }

      const whereClause = and(...filters);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(paymentEstimates)
        .where(whereClause);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select()
        .from(paymentEstimates)
        .where(whereClause)
        .orderBy(sql`${paymentEstimates.createdAt} DESC`)
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
              .where(
                sql`${paymentEstimateLines.estimateId} = ANY(${sql.raw(
                  `ARRAY[${estimateIds.map((id) => `'${id}'`).join(",")}]::uuid[]`,
                )})`,
              )
              .groupBy(paymentEstimateLines.estimateId)
          : [];

      const lineCountMap = new Map(
        lineCounts.map((lc) => [lc.estimateId, Number(lc.cnt)]),
      );

      logger.debug("Estimates listed", {
        companyId: data.companyId,
        total,
        page,
      });

      return success({
        total: Number(total),
        estimates: rows.map((e) => ({
          id: e.id,
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
