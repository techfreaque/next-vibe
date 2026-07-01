/**
 * AP Bill List Repository
 */

import "server-only";

import { and, count, desc, eq, inArray } from "drizzle-orm";
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

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { paymentBills } from "../../db";
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
      let companyCondition;

      if (data.companyId) {
        // Verify company membership (VIEWER+) for specific company
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
        companyCondition = eq(paymentBills.companyId, data.companyId);
      } else {
        // No company filter — scope to all companies the user belongs to
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
          return success({ totalCount: 0, bills: [] });
        }
        companyCondition = inArray(paymentBills.companyId, companyIds);
      }

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const conditions = [companyCondition];
      if (data.status) {
        conditions.push(eq(paymentBills.status, data.status));
      }

      const whereClause = and(...conditions);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(paymentBills)
        .where(whereClause);

      const rows = await db
        .select({
          id: paymentBills.id,
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
        .where(whereClause)
        .orderBy(desc(paymentBills.billDate))
        .limit(pageSize)
        .offset(offset);

      return success({
        totalCount: total ?? 0,
        bills: rows,
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
