/**
 * Company Members List Repository
 */

import { and, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { companyMembers } from "../../../db";
import type { CompanyMemberRoleDB } from "../../../enum";
import { CompanyAuthRepository } from "../../../repository";
import { scopedTranslation } from "./i18n";

export class MembersListRepository {
  static async listMembers(
    companyId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      members: Array<{
        id: string;
        userId: string;
        email: string | null;
        name: string | null;
        role: (typeof CompanyMemberRoleDB)[number];
        isActive: boolean;
        joinedAt: Date;
      }>;
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    const authResult = await CompanyAuthRepository.requireMember(
      userId,
      companyId,
      null,
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      const rows = await db
        .select({
          id: companyMembers.id,
          userId: companyMembers.userId,
          email: users.email,
          name: users.publicName,
          role: companyMembers.role,
          isActive: companyMembers.isActive,
          joinedAt: companyMembers.joinedAt,
        })
        .from(companyMembers)
        .innerJoin(users, eq(companyMembers.userId, users.id))
        .where(
          and(
            eq(companyMembers.companyId, companyId),
            eq(companyMembers.isActive, true),
          ),
        );

      return success({ members: rows });
    } catch (error) {
      logger.error("Error listing company members", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
