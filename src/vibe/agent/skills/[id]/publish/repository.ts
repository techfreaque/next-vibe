/**
 * Skill Publish Repository
 * One-click publish/unpublish for custom skills
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler-realtime";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/core/emitter";

import { customSkills } from "../../db";
import type { SkillStatusValue } from "../../enum";
import { SkillOwnershipType, SkillStatus } from "../../enum";
import { SkillsRepository } from "../../repository";
import publishDefinitions, {
  type SkillPublishPatchResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class SkillPublishRepository {
  static async publish(
    urlPathParams: { id: string },
    data: { status: typeof SkillStatusValue; changeNote?: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    relayed = false,
  ): Promise<ResponseType<SkillPublishPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { id: skillId } = urlPathParams;
      if (!user.id) {
        return fail({
          message: t("patch.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Fetch the skill - resolve by UUID or slug
      const idCondition = SkillsRepository.resolveSkillIdCondition(skillId);
      const [skill] = await db
        .select({
          id: customSkills.id,
          slug: customSkills.slug,
          userId: customSkills.userId,
          ownershipType: customSkills.ownershipType,
          status: customSkills.status,
          publishedAt: customSkills.publishedAt,
        })
        .from(customSkills)
        .where(idCondition);

      if (!skill) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Only the owner can publish
      if (skill.userId !== user.id) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // System skills cannot be published via this endpoint
      if (skill.ownershipType === SkillOwnershipType.SYSTEM) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const newStatus = data.status;
      const isPublishing =
        newStatus === SkillStatus.PUBLISHED &&
        skill.status !== SkillStatus.PUBLISHED;
      const publishedAt = isPublishing
        ? new Date()
        : newStatus !== SkillStatus.PUBLISHED
          ? null
          : skill.publishedAt;

      await db
        .update(customSkills)
        .set({
          status: newStatus,
          ownershipType:
            newStatus === SkillStatus.PUBLISHED
              ? SkillOwnershipType.PUBLIC
              : SkillOwnershipType.USER,
          publishedAt,
          changeNote: data.changeNote ?? null,
          updatedAt: new Date(),
        })
        .where(eq(customSkills.id, skill.id))
        .returning();

      // Suppressed when applying a relayed publish (avoids re-relay ping-pong).
      if (!relayed) {
        // Publishing flips ownership (PUBLISHED → PUBLIC); deliver on the channel
        // matching the NEW visibility so viewers of a now-public skill get it.
        const channel = await SkillsRepository.emitChannelBySkillId(
          skill.slug ?? skill.id,
        );
        createEndpointEmitter(publishDefinitions.PATCH, logger, user, {
          urlPathParams: { id: skill.slug ?? skill.id },
          kindOverride: channel.kind,
        })("skill-updated", {
          responseData: { status_response: newStatus },
          requestData: { status: newStatus },
        });
      }

      return success({
        status_response: newStatus,
        publishedAt: publishedAt?.toISOString() ?? null,
      });
    } catch (error) {
      logger.error("SkillPublishRepository.publish failed", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Cross-instance applier for the publish `skill-updated` event: re-run publish
   * on this instance with the relayed status. Reuses publish so there is one path.
   */
  static async applyRemotePublish({
    requestData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof publishDefinitions.PATCH,
    "skill-updated"
  >): Promise<void> {
    const result = await this.publish(
      { id: urlPathParams.id },
      { status: requestData.status },
      user,
      logger,
      defaultLocale,
      true,
    );
    if (!result.success) {
      logger.error("Failed to apply remote publish", {
        message: result.message,
      });
      return;
    }
    const channel = await SkillsRepository.emitChannelBySkillId(
      urlPathParams.id,
    );
    createEndpointEmitter(publishDefinitions.PATCH, logger, user, {
      urlPathParams: { id: urlPathParams.id },
      kindOverride: channel.kind,
      fanOut: false,
    })("skill-updated", {
      requestData,
      responseData: result.data,
    });
  }
}
