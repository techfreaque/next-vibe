/**
 * Public Creator Profile Repository
 */

import "server-only";

import type { SkillVariantData } from "@/app/api/[locale]/agent/chat/skills/db";
import { and, eq, or, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";
import { getBestChatModel } from "@/app/api/[locale]/agent/ai-stream/models";
import { customSkills } from "@/app/api/[locale]/agent/chat/skills/db";
import {
  SkillOwnershipType,
  SkillStatus,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { formatSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import { getModelDisplayName } from "@/app/api/[locale]/agent/models/all-models";
import { modelProviders } from "@/app/api/[locale]/agent/models/models";
import { leadMagnetConfigs } from "@/app/api/[locale]/lead-magnet/db";
import { referralCodes } from "@/app/api/[locale]/referral/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CreatorGetResponseOutput } from "./definition";
import type { CreatorT } from "./i18n";

/** Resolve creatorId param - accepts UUID or creatorSlug */
async function resolveCreatorId(param: string): Promise<string | null> {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(param)) {
    return param;
  }
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(
      or(
        eq(users.creatorSlug, param),
        eq(sql`lower(replace(${users.publicName}, ' ', '-'))`, param),
      ),
    )
    .limit(1);
  return result[0]?.id ?? null;
}

export class CreatorProfileRepository {
  static async getCreatorProfile(
    urlPathParams: { userId: string },
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: CreatorT,
    viewer: JwtPayloadType,
  ): Promise<ResponseType<CreatorGetResponseOutput>> {
    try {
      const resolvedId = await resolveCreatorId(urlPathParams.userId);

      if (!resolvedId) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: urlPathParams.userId },
        });
      }

      const userId = resolvedId;
      logger.debug("Getting creator profile", { userId });

      const [userResults, skillRows, referralResult, configRows] =
        await Promise.all([
          db.select().from(users).where(eq(users.id, userId)),
          db
            .select({
              id: customSkills.id,
              name: customSkills.name,
              tagline: customSkills.tagline,
              description: customSkills.description,
              icon: customSkills.icon,
              category: customSkills.category,
              modelSelection: customSkills.modelSelection,
              ownershipType: customSkills.ownershipType,
              voteCount: customSkills.voteCount,
              trustLevel: customSkills.trustLevel,
              variants: customSkills.variants,
            })
            .from(customSkills)
            .where(
              and(
                eq(customSkills.userId, userId),
                eq(
                  customSkills.ownershipType,
                  SkillOwnershipType.PUBLIC as typeof SkillOwnershipType.PUBLIC,
                ),
                eq(customSkills.status, SkillStatus.PUBLISHED),
              ),
            ),
          db
            .select({ code: referralCodes.code })
            .from(referralCodes)
            .where(eq(referralCodes.ownerUserId, userId))
            .limit(1),
          db
            .select({
              headline: leadMagnetConfigs.headline,
              buttonText: leadMagnetConfigs.buttonText,
              isActive: leadMagnetConfigs.isActive,
            })
            .from(leadMagnetConfigs)
            .where(eq(leadMagnetConfigs.userId, userId))
            .limit(1),
        ]);

      if (userResults.length === 0) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
        });
      }

      const user = userResults[0];
      const { t: configT } = configScopedTranslation.scopedT(locale);
      const appName = configT("appName");

      // Enrich skills with model display info, expanding multi-variant skills
      const skills = skillRows.flatMap((row) => {
        const variants: SkillVariantData[] | null = row.variants;
        const expandedVariants =
          variants && variants.length > 1 ? variants : null;
        const rows = expandedVariants
          ? expandedVariants.map((variant) => ({
              modelSelection: variant.modelSelection,
              variantId: variant.id,
              variantName: variant.displayName ?? variant.id,
              isVariant: true,
              isDefault: variant.isDefault ?? false,
            }))
          : [
              {
                modelSelection: row.modelSelection,
                variantId: null,
                variantName: null,
                isVariant: false,
                isDefault: false,
              },
            ];
        return rows.map(
          ({
            modelSelection,
            variantId,
            variantName,
            isVariant,
            isDefault,
          }) => {
            const selection = modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION;
            const bestModel = getBestChatModel(selection, viewer);
            const modelId = bestModel?.id ?? null;
            const modelRow = bestModel
              ? {
                  modelIcon: bestModel.icon,
                  modelInfo: getModelDisplayName(bestModel, false),
                  modelProvider:
                    modelProviders[bestModel.provider]?.name ??
                    bestModel.provider,
                }
              : {
                  modelIcon: "sparkles" as const,
                  modelInfo: "Unknown Model",
                  modelProvider: "Unknown",
                };
            return {
              id: row.id,
              internalId: null,
              skillId: formatSkillId(row.id, variantId),
              category: row.category,
              icon: row.icon ?? "sparkles",
              modelId,
              name: row.name,
              description: row.description,
              tagline: row.tagline,
              ownershipType: row.ownershipType,
              voteCount: row.voteCount,
              trustLevel: row.trustLevel,
              variantId,
              variantName,
              isVariant,
              isDefault,
              ...modelRow,
            };
          },
        );
      });

      const referralCode = referralResult[0]?.code ?? null;
      const cfg = configRows[0];
      const leadMagnetHeadline = cfg?.isActive ? (cfg.headline ?? null) : null;
      const leadMagnetButtonText = cfg?.isActive
        ? (cfg.buttonText ?? null)
        : null;

      logger.debug("Creator profile retrieved", {
        userId,
        skillCount: skills.length,
      });

      return success({
        publicName: user.publicName,
        avatarUrl: user.avatarUrl ?? null,
        bio: user.bio ?? null,
        websiteUrl: user.websiteUrl ?? null,
        twitterUrl: user.twitterUrl ?? null,
        youtubeUrl: user.youtubeUrl ?? null,
        instagramUrl: user.instagramUrl ?? null,
        tiktokUrl: user.tiktokUrl ?? null,
        githubUrl: user.githubUrl ?? null,
        facebookUrl: user.facebookUrl ?? null,
        discordUrl: user.discordUrl ?? null,
        tribeUrl: user.tribeUrl ?? null,
        rumbleUrl: user.rumbleUrl ?? null,
        odyseeUrl: user.odyseeUrl ?? null,
        nostrUrl: user.nostrUrl ?? null,
        gabUrl: user.gabUrl ?? null,
        creatorAccentColor: user.creatorAccentColor ?? null,
        creatorHeaderImageUrl: user.creatorHeaderImageUrl ?? null,
        referralCode,
        appName,
        leadMagnetHeadline,
        leadMagnetButtonText,
        skills,
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
