/**
 * Company Member Update Role Repository
 * Only OWNER can change member roles
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
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { companyMembers } from "../../../../db";
import type { CompanyMemberRoleDB } from "../../../../enum";
import { CompanyMemberRole } from "../../../../enum";
import { scopedTranslation } from "../../../../i18n";
import { CompanyAuthRepository } from "../../../../repository";
import type { UpdateRoleRequestOutput } from "./definition";

export class UpdateRoleRepository {
  static async updateRole(
    companyId: string,
    memberId: string,
    callerId: string,
    data: UpdateRoleRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: { memberId: string; role: (typeof CompanyMemberRoleDB)[number] };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    // Only OWNER can change roles
    const authResult = await CompanyAuthRepository.requireMember(
      callerId,
      companyId,
      CompanyMemberRole.OWNER,
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      const [updated] = await db
        .update(companyMembers)
        .set({ role: data.role, updatedAt: new Date() })
        .where(
          and(
            eq(companyMembers.id, memberId),
            eq(companyMembers.companyId, companyId),
          ),
        )
        .returning({
          id: companyMembers.id,
          role: companyMembers.role,
        });

      if (!updated) {
        return fail({
          message: t("updateRole.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ result: { memberId: updated.id, role: updated.role } });
    } catch (error) {
      logger.error("Error updating member role", parseError(error));
      return fail({
        message: t("updateRole.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
