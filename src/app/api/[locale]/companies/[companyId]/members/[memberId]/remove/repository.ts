/**
 * Company Member Remove Repository
 * Removes a member. Cannot remove the last OWNER.
 */

import { and, count, eq } from "drizzle-orm";
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
import { CompanyMemberRole } from "../../../../enum";
import { scopedTranslation } from "../../../../i18n";
import { CompanyAuthRepository } from "../../../../repository";

export class RemoveMemberRepository {
  static async removeMember(
    companyId: string,
    memberId: string,
    callerId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ removedMemberId: string }>> {
    const { t } = scopedTranslation.scopedT(locale);

    // Caller must be ADMIN or OWNER
    const authResult = await CompanyAuthRepository.requireMember(
      callerId,
      companyId,
      CompanyMemberRole.ADMIN,
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      // Find the target member
      const [target] = await db
        .select({
          id: companyMembers.id,
          userId: companyMembers.userId,
          role: companyMembers.role,
        })
        .from(companyMembers)
        .where(
          and(
            eq(companyMembers.id, memberId),
            eq(companyMembers.companyId, companyId),
          ),
        )
        .limit(1);

      if (!target) {
        return fail({
          message: t("removeMember.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Guard: cannot remove the last OWNER
      if (target.role === CompanyMemberRole.OWNER) {
        const [ownerCount] = await db
          .select({ cnt: count() })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.companyId, companyId),
              eq(companyMembers.role, CompanyMemberRole.OWNER),
              eq(companyMembers.isActive, true),
            ),
          );

        if ((ownerCount?.cnt ?? 0) <= 1) {
          return fail({
            message: t("removeMember.post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
      }

      await db
        .update(companyMembers)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(companyMembers.id, memberId));

      return success({ removedMemberId: memberId });
    } catch (error) {
      logger.error("Error removing company member", parseError(error));
      return fail({
        message: t("removeMember.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
