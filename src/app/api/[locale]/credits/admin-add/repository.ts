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
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { users } from "@/app/api/[locale]/user/db";

import { scopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import type {
  AdminAddCreditsPostRequestOutput,
  AdminAddCreditsPostResponseOutput,
} from "./definition";

export class AdminAddCreditsRepository {
  static async addCredits(
    data: AdminAddCreditsPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AdminAddCreditsPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    // Verify the target user exists BEFORE touching wallets — otherwise wallet
    // creation dies on the users FK and surfaces as an opaque 500 ("Failed to
    // create wallet") instead of the honest NOT_FOUND.
    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, data.targetUserId))
      .limit(1);
    if (!targetUser) {
      return fail({
        message: t("adminAdd.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const result = await CreditRepository.addCredits(
      { userId: data.targetUserId, leadId: data.targetUserId },
      data.amount,
      "bonus",
      logger,
      t,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      message: `Successfully added ${data.amount} bonus credits`,
    });
  }
}
