/**
 * Chart of Accounts — Account Update Repository
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

import { accountNodes } from "../../../db";
import type { CoaAccountUpdateRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaAccountUpdateRepository {
  static async updateAccount(
    data: CoaAccountUpdateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ updated: boolean }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      const [existing] = await db
        .select()
        .from(accountNodes)
        .where(eq(accountNodes.id, data.accountId))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("patch.errors.notFound.title"),
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

      const updates: Partial<{
        name: string;
        description: string;
        sortOrder: number;
        updatedAt: Date;
      }> = { updatedAt: new Date() };

      if (data.name !== undefined) {
        updates.name = data.name;
      }
      if (data.description !== undefined) {
        updates.description = data.description;
      }
      if (data.sortOrder !== undefined) {
        updates.sortOrder = data.sortOrder;
      }

      await db
        .update(accountNodes)
        .set(updates)
        .where(eq(accountNodes.id, data.accountId));

      logger.info("Account updated", { accountId: data.accountId });

      return success({ updated: true });
    } catch (error) {
      logger.error("Error updating account", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
