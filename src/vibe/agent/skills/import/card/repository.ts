/**
 * Character Card Import Repository
 * Turns an uploaded Tavern-format character card into a skill the caller owns.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { SkillImportPlatform } from "../enum";
import { scopedTranslation as importScopedTranslation } from "../i18n";
import { importSourceKey } from "../parsers";
import { SkillImportRepository, storeAvatarBytes } from "../repository";
import type {
  SkillCardImportPostRequestOutput,
  SkillCardImportPostResponseOutput,
} from "./definition";
import type { SkillCardImportT } from "./i18n";
import { cardToCharacter, decodeCard } from "./parser";
import { validatePngAvatar } from "./png";
import { consumeCardImportRateLimit } from "./rate-limit";

const inFlight = new Set<string>();

export class SkillCardImportRepository {
  static async importCard(
    data: SkillCardImportPostRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: SkillCardImportT,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<SkillCardImportPostResponseOutput>> {
    const userId = user.isPublic ? null : user.id;
    if (!userId) {
      return fail({
        message: t("post.errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      // Count invalid and repeated attempts before decoding or touching storage.
      const limit = await consumeCardImportRateLimit(userId);
      if (!limit) {
        return fail({
          message: t("post.errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      if (!limit.allowed) {
        return fail({
          message: t("post.errors.rateLimited", {
            seconds: limit.retryAfterSeconds,
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      const decoded = decodeCard(data.card);
      if (!decoded.ok) {
        return fail({
          message: t(
            decoded.reason === "tooLarge"
              ? "post.card.validation.tooLarge"
              : decoded.reason === "noCard"
                ? "post.errors.noCardInPng"
                : "post.errors.invalidCard",
          ),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const character = cardToCharacter(decoded.card.data);
      if (!character) {
        return fail({
          message: t("post.errors.invalidCard"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const key = importSourceKey(
        SkillImportPlatform.CHARACTER_CARD,
        character.sourceId,
      );

      const existing = await SkillImportRepository.findExisting(
        userId,
        [key],
        [],
      );
      if (existing) {
        return success(
          SkillImportRepository.existingResponse(existing, {
            platform: SkillImportPlatform.CHARACTER_CARD,
            sourceUrl: "",
          }),
        );
      }

      const lockKey = `${userId}:${key}`;
      if (inFlight.has(lockKey)) {
        return fail({
          message: t("post.errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      inFlight.add(lockKey);
      try {
        const avatar = decoded.card.image
          ? await validatePngAvatar(decoded.card.image)
          : null;
        const avatarUrl = avatar
          ? await storeAvatarBytes(avatar, "image/png", userId, logger)
          : null;
        const { t: importT } = importScopedTranslation.scopedT(locale);

        const created = await SkillImportRepository.createImportedSkill({
          character,
          key,
          visibility: data.visibility,
          avatarUrl,
          fallbackTagline: importT("post.result.cardCreditUnknown"),
          user,
          userId,
          logger,
          locale,
          toolExecutionContext,
        });
        if (created.success) {
          logger.info("Character card imported", {
            format: decoded.card.format,
            skillId: created.data.id,
          });
        }
        return created;
      } finally {
        inFlight.delete(lockKey);
      }
    } catch (error) {
      logger.error("Character card import failed", parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
