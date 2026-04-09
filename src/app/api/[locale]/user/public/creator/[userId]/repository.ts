/**
 * Public Creator Profile Repository
 */

import "server-only";

import { count, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { customSkills } from "@/app/api/[locale]/agent/chat/skills/db";
import { referralCodes } from "@/app/api/[locale]/referral/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CreatorGetRequestOutput,
  CreatorGetResponseOutput,
} from "./definition";
import type { CreatorT } from "./i18n";

export class CreatorProfileRepository {
  static async getCreatorProfile(
    data: CreatorGetRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: CreatorT,
  ): Promise<ResponseType<CreatorGetResponseOutput>> {
    try {
      const { userId } = data;
      logger.debug("Getting creator profile", { userId });

      const results = await db.select().from(users).where(eq(users.id, userId));

      if (results.length === 0) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
        });
      }

      const user = results[0];

      // Count public skills owned by this user
      const skillCountResult = await db
        .select({ count: count() })
        .from(customSkills)
        .where(eq(customSkills.userId, userId));

      const skillCount = skillCountResult[0]?.count ?? 0;

      // Get referral code if any
      const referralResult = await db
        .select({ code: referralCodes.code })
        .from(referralCodes)
        .where(eq(referralCodes.ownerUserId, userId))
        .limit(1);

      const referralCode = referralResult[0]?.code ?? null;

      logger.debug("Creator profile retrieved", { userId, skillCount });

      return success({
        userId,
        publicName: user.publicName,
        avatarUrl: user.avatarUrl ?? null,
        bio: user.bio ?? null,
        websiteUrl: user.websiteUrl ?? null,
        twitterUrl: user.twitterUrl ?? null,
        youtubeUrl: user.youtubeUrl ?? null,
        instagramUrl: user.instagramUrl ?? null,
        tiktokUrl: user.tiktokUrl ?? null,
        githubUrl: user.githubUrl ?? null,
        discordUrl: user.discordUrl ?? null,
        creatorAccentColor: user.creatorAccentColor ?? null,
        creatorHeaderImageUrl: user.creatorHeaderImageUrl ?? null,
        skillCount,
        referralCode,
      });
    } catch (error) {
      logger.error("Error getting creator profile", parseError(error));
      return fail({
        message: t("get.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
