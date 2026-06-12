/**
 * Chart of Accounts — Account Create Repository
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CountryLanguage } from "@/i18n/core/config";

import { accountNodes } from "../../db";
import type { CoaAccountCreateRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaAccountCreateRepository {
  static async createAccount(
    data: CoaAccountCreateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ id: string; code_out: string; name_out: string }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      // Verify ADMIN+ company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Check for code uniqueness
      const existing = await db
        .select({ id: accountNodes.id })
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, data.companyId),
            eq(accountNodes.code, data.code),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [inserted] = await db
        .insert(accountNodes)
        .values({
          companyId: data.companyId,
          code: data.code,
          name: data.name,
          type: data.type,
          subtype: data.subtype,
          parentId: data.parentId ?? null,
          isPostable: true,
          isActive: true,
          isSystem: false,
        })
        .returning({
          id: accountNodes.id,
          code: accountNodes.code,
          name: accountNodes.name,
        });

      logger.info("Account created", {
        companyId: data.companyId,
        code: data.code,
        id: inserted.id,
      });

      return success({
        id: inserted.id,
        code_out: inserted.code,
        name_out: inserted.name,
      });
    } catch (error) {
      logger.error("Error creating account", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
