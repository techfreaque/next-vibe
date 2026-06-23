/**
 * Chart of Accounts — Account Get Repository
 * Retrieves a single account node by ID, verifying company membership
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { accountNodes } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { CoaAccountGetResponseOutput } from "./definition";

export class CoaAccountGetRepository {
  static async getAccount(
    accountId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CoaAccountGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [account] = await db
        .select()
        .from(accountNodes)
        .where(eq(accountNodes.id, accountId))
        .limit(1);

      if (!account) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership (VIEWER role sufficient)
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        account.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );

      if (!authResult.success) {
        return authResult;
      }

      return success({
        result: {
          id: account.id,
          companyId: account.companyId,
          code: account.code,
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          parentId: account.parentId ?? null,
          isPostable: account.isPostable,
          isActive: account.isActive,
          isSystem: account.isSystem,
          description: account.description ?? null,
          sortOrder: account.sortOrder,
        },
      });
    } catch (error) {
      logger.error("Error getting account", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
