/**
 * Referral Code Bonus - Repository
 * Sets referral_codes.subscription_bonus_credits for one code (case-insensitive
 * match). The bonus itself is granted by ReferralRepository
 * .grantSubscriptionSignupBonus when a referred user's first paid plan starts.
 * Server-only.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { referralCodes } from "../../db";
import type {
  ReferralCodeBonusRequestOutput,
  ReferralCodeBonusResponseOutput,
} from "./definition";
import type { ReferralCodeBonusT } from "./i18n";

export class ReferralCodeBonusRepository {
  static async setBonus(
    data: ReferralCodeBonusRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ReferralCodeBonusT,
  ): Promise<ResponseType<ReferralCodeBonusResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const [code] = await db
        .select({
          id: referralCodes.id,
          code: referralCodes.code,
          bonus: referralCodes.subscriptionBonusCredits,
          ownerEmail: users.email,
        })
        .from(referralCodes)
        .innerJoin(users, eq(referralCodes.ownerUserId, users.id))
        .where(sql`lower(${referralCodes.code}) = ${data.code.toLowerCase()}`)
        .limit(1);

      if (!code) {
        return fail({
          message: t("errors.codeNotFound", { code: data.code }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await db
        .update(referralCodes)
        .set({
          subscriptionBonusCredits: data.bonusCredits,
          updatedAt: new Date(),
        })
        .where(eq(referralCodes.id, code.id));

      logger.info("Referral code subscription bonus set", {
        code: code.code,
        previous: code.bonus,
        bonusCredits: data.bonusCredits,
        adminUserId: user.id,
      });

      return success({
        updatedCode: code.code,
        ownerEmail: code.ownerEmail,
        previousBonusCredits: code.bonus,
        subscriptionBonusCredits: data.bonusCredits,
      });
    } catch (error) {
      logger.error("Failed to set referral code bonus", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
