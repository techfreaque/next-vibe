/**
 * Company Member Invite Repository
 * Looks up user by email, adds them to the company
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
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { companyMembers } from "../../../db";
import type { CompanyMemberRoleDB } from "../../../enum";
import { CompanyAuthRepository } from "../../../repository";
import type { MemberInviteRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class MemberInviteRepository {
  static async inviteMember(
    companyId: string,
    callerId: string,
    data: MemberInviteRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        memberId: string;
        userId: string;
        role: (typeof CompanyMemberRoleDB)[number];
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    // Caller must be ADMIN or OWNER
    const authResult = await CompanyAuthRepository.requireMember(
      callerId,
      companyId,
      "ADMIN",
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      // Find user by email
      const [targetUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (!targetUser) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if already a member
      const [existing] = await db
        .select({ id: companyMembers.id })
        .from(companyMembers)
        .where(
          and(
            eq(companyMembers.companyId, companyId),
            eq(companyMembers.userId, targetUser.id),
          ),
        )
        .limit(1);

      if (existing) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const role = data.role;

      const [member] = await db
        .insert(companyMembers)
        .values({
          companyId,
          userId: targetUser.id,
          role,
          invitedByUserId: callerId,
        })
        .returning({
          id: companyMembers.id,
          userId: companyMembers.userId,
          role: companyMembers.role,
        });

      if (!member) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        result: {
          memberId: member.id,
          userId: member.userId,
          role: member.role,
        },
      });
    } catch (error) {
      logger.error("Error inviting company member", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
