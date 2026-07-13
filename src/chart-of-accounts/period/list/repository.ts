/**
 * Chart of Accounts — Period List Repository
 */

import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
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

import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { accountingPeriods } from "../../db";
import type { CoaPeriodListRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaPeriodListRepository {
  static async listPeriods(
    data: CoaPeriodListRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      periods: Array<{
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        status: string;
        closedAt: Date | null;
      }>;
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
          return success({ periods: [] });
        }
      }

      const where =
        companyIds.length === 1
          ? eq(accountingPeriods.companyId, companyIds[0] as string)
          : inArray(accountingPeriods.companyId, companyIds);

      const rows = await db
        .select()
        .from(accountingPeriods)
        .where(where)
        .orderBy(desc(accountingPeriods.startDate));

      return success({
        periods: rows.map((r) => ({
          id: r.id,
          name: r.name,
          startDate: r.startDate,
          endDate: r.endDate,
          status: r.status,
          closedAt: r.closedAt ?? null,
        })),
      });
    } catch (error) {
      logger.error("Error listing periods", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
