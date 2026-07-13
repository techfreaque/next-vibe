/**
 * Chart of Accounts — Account Deactivate Repository
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { accountNodes, journalEntryLines } from "../../../db";
import type { CoaAccountDeactivateRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaAccountDeactivateRepository {
  static async deactivateAccount(
    data: CoaAccountDeactivateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ deactivated: boolean }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      const [existing] = await db
        .select()
        .from(accountNodes)
        .where(eq(accountNodes.id, data.accountId))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ADMIN+ membership using the account's companyId
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        existing.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      if (existing.isSystem) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Check for any journal entry lines referencing this account
      const lineCount = await db
        .select({ id: journalEntryLines.id })
        .from(journalEntryLines)
        .where(eq(journalEntryLines.accountId, data.accountId))
        .limit(1);

      if (lineCount.length > 0) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      await db
        .update(accountNodes)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(accountNodes.id, data.accountId));

      logger.info("Account deactivated", { accountId: data.accountId });

      return success({ deactivated: true });
    } catch (error) {
      logger.error("Error deactivating account", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
