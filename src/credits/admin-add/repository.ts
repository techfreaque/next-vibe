/**
 * Admin Add Credits Repository
 * Handles adding credit packs to user accounts (admin only)
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
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import type {
  AdminAddCreditsPostRequestOutput,
  AdminAddCreditsPostResponseOutput,
  GrantRecipientGetResponseOutput,
} from "./definition";

export class AdminAddCreditsRepository {
  static async getRecipient(
    targetUserId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<GrantRecipientGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [recipient] = await db
        .select({
          id: users.id,
          email: users.email,
          leadId: userLeadLinks.leadId,
        })
        .from(users)
        .leftJoin(userLeadLinks, eq(userLeadLinks.userId, users.id))
        .where(eq(users.id, targetUserId))
        .limit(1);

      if (!recipient) {
        return fail({
          message: t("adminAdd.post.errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!recipient.leadId) {
        return fail({
          message: t("adminAdd.recipient.noLinkedDevice"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ id: recipient.id, email: recipient.email });
    } catch (error) {
      logger.error(
        "Failed to verify credit grant recipient",
        parseError(error),
        {
          targetUserId,
        },
      );
      return fail({
        message: t("adminAdd.recipient.loadFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async addCredits(
    data: AdminAddCreditsPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AdminAddCreditsPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const recipient = await AdminAddCreditsRepository.getRecipient(
      data.targetUserId,
      logger,
      locale,
    );
    if (!recipient.success) {
      return recipient;
    }

    const result = await CreditRepository.addUserCredits(
      recipient.data.id,
      data.amount,
      "bonus",
      logger,
      t,
    );
    if (!result.success) {
      return result;
    }
    return success({
      recipientId: recipient.data.id,
      message: t("repository.bonusCreditsAdded", { amount: data.amount }),
    });
  }
}
