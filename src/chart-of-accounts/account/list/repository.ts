/**
 * Chart of Accounts — Account List Repository
 */

import "server-only";

import { and, count, eq, inArray } from "drizzle-orm";
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

import { accountNodes } from "../../db";
import type { CoaAccountListRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaAccountListRepository {
  static async listAccounts(
    data: CoaAccountListRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      total: number;
      accounts: Array<{
        id: string;
        code: string;
        name: string;
        type: string;
        subtype: string;
        parentId: string | null;
        isPostable: boolean;
        isActive: boolean;
        isSystem: boolean;
        description: string | null;
        sortOrder: number;
        companyId: string;
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
          return success({ total: 0, accounts: [] });
        }
      }

      const where =
        companyIds.length === 1
          ? eq(accountNodes.companyId, companyIds[0] as string)
          : inArray(accountNodes.companyId, companyIds);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(accountNodes)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 100;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select()
        .from(accountNodes)
        .where(where)
        .orderBy(accountNodes.sortOrder)
        .limit(pageSize)
        .offset(offset);

      return success({
        total: total ?? 0,
        accounts: rows.map((r) => ({
          id: r.id,
          code: r.code,
          name: r.name,
          type: r.type,
          subtype: r.subtype,
          parentId: r.parentId ?? null,
          isPostable: r.isPostable,
          isActive: r.isActive,
          isSystem: r.isSystem,
          description: r.description ?? null,
          sortOrder: r.sortOrder,
          companyId: r.companyId,
        })),
      });
    } catch (error) {
      logger.error("Error listing accounts", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
