/**
 * Company Member Remove Repository
 * Removes a member. Cannot remove the last OWNER.
 */

import { and, count, eq } from "drizzle-orm";
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
