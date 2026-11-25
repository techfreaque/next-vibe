/**
 * Skill Export Repository
 * Builds a Character Card V2 file from any skill the caller can open.
 */

import "server-only";

import { coreEnv } from "next-vibe/core/env";
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

import { parseSkillId } from "../../../chat/slugify";
import { NO_SKILL_ID } from "../../constants";
import { SkillOwnershipType } from "../../enum";
import { scopedTranslation as skillLabelsScopedTranslation } from "../../labels/i18n";
import { SkillsRepository } from "../../repository";
import { buildCharacterCard, cardFileName } from "./card";
import type { SkillExportGetResponseOutput } from "./definition";
import type { SkillExportT } from "./i18n";

export class SkillExportRepository {
  static async exportCard(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: SkillExportT,
  ): Promise<ResponseType<SkillExportGetResponseOutput>> {
    const { skillId } = parseSkillId(urlPathParams.id);
    const isBuiltIn =
      SkillsRepository.listPublicDefaultSkillIds().includes(skillId);
    if (skillId === NO_SKILL_ID) {
      return fail({
        message: t("get.errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // The skill loader filters custom rows by owner or public visibility.
    const loaded = await SkillsRepository.getSkillById(
      { id: skillId },
      user,
      logger,
      locale,
    );
    if (!loaded.success) {
      return fail({
        message: t("get.errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const skill = loaded.data;
    // Built-in skills that are not public (admin tools) stay unexported.
    if (
      !skill.name ||
      (skill.skillOwnership === SkillOwnershipType.SYSTEM
        ? !isBuiltIn
        : !skill.isPublic && skill.skillOwnership !== SkillOwnershipType.USER)
    ) {
      return fail({
        message: t("get.errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    try {
      const { t: labelsT } = skillLabelsScopedTranslation.scopedT(locale);
      const baseUrl = coreEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
      const isOpenToAll = skill.isPublic || isBuiltIn;
      const skillUrl = isOpenToAll
        ? `${baseUrl}/${locale}/skill/${encodeURIComponent(skillId)}`
        : null;

      const card = buildCharacterCard(
        {
          name: skill.name,
          tagline: skill.tagline,
          description: skill.description,
          systemPrompt: skill.systemPrompt,
          categoryLabel: labelsT(skill.category),
          creatorName:
            skill.importedFrom?.creatorName ??
            (skill.isPublic ? skill.creatorProfile?.publicName : null) ??
            null,
          skillUrl,
        },
        skillUrl ? t("get.card.skillPage", { url: skillUrl }) : null,
      );

      logger.info("Skill exported as character card", {
        skillId,
        ownership: skill.skillOwnership,
      });

      return success(
        {
          name: skill.name,
          fileName: cardFileName(skill.name, skillId),
          card: JSON.stringify(card, null, 2),
        },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    } catch (error) {
      logger.error("Skill card export failed", {
        ...parseError(error),
        skillId,
      });
      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
