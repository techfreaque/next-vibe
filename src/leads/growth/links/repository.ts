/**
 * Campaign Links - Repository
 * Server-only.
 */

import "server-only";

import { and, desc, eq, or, sql } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { referralCodes } from "@/referral/db";

import {
  buildCampaignUrl,
  normalizeChannelKey,
  normalizeDestinationPath,
} from "../attribution";
import { growthCampaignLinks, growthJourneys } from "../db";
import type { GrowthT } from "../i18n";
import type {
  CampaignLinkCreateRequestOutput,
  CampaignLinkCreateResponseOutput,
  CampaignLinksGetResponseOutput,
} from "./definition";

export class CampaignLinksRepository {
  /**
   * All links, newest first. A journey counts for a link when the link was
   * its first or its last touch.
   */
  static async list(
    logger: EndpointLogger,
    t: GrowthT,
  ): Promise<ResponseType<CampaignLinksGetResponseOutput>> {
    try {
      const rows = await db
        .select({
          id: growthCampaignLinks.id,
          name: growthCampaignLinks.name,
          source: growthCampaignLinks.source,
          medium: growthCampaignLinks.medium,
          campaign: growthCampaignLinks.campaign,
          content: growthCampaignLinks.content,
          term: growthCampaignLinks.term,
          destinationPath: growthCampaignLinks.destinationPath,
          refCode: growthCampaignLinks.refCode,
          visits: growthCampaignLinks.visits,
          signups: sql<number>`count(${growthJourneys.id}) filter (where ${growthJourneys.signedUpAt} is not null)::int`,
          paid: sql<number>`count(${growthJourneys.id}) filter (where ${growthJourneys.firstPaidAt} is not null)::int`,
        })
        .from(growthCampaignLinks)
        .leftJoin(
          growthJourneys,
          or(
            eq(growthJourneys.firstLinkId, growthCampaignLinks.id),
            eq(growthJourneys.lastLinkId, growthCampaignLinks.id),
          ),
        )
        .groupBy(growthCampaignLinks.id)
        .orderBy(desc(growthCampaignLinks.createdAt));

      return success({
        links: rows.map((row) => ({
          ...row,
          url: buildCampaignUrl(coreEnv.NEXT_PUBLIC_APP_URL, row),
        })),
      });
    } catch (error) {
      logger.error("Failed to list campaign links", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async create(
    data: CampaignLinkCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: GrowthT,
  ): Promise<ResponseType<CampaignLinkCreateResponseOutput>> {
    try {
      const destinationPath = normalizeDestinationPath(data.destinationPath);
      if (!destinationPath) {
        return fail({
          message: t("errors.invalidDestination"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const refCode = data.refCode?.trim() || null;
      if (refCode) {
        const [code] = await db
          .select({ id: referralCodes.id })
          .from(referralCodes)
          .where(
            and(
              eq(referralCodes.code, refCode),
              eq(referralCodes.isActive, true),
            ),
          )
          .limit(1);
        if (!code) {
          return fail({
            message: t("errors.invalidRefCode", { code: refCode }),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      const [link] = await db
        .insert(growthCampaignLinks)
        .values({
          name: data.name,
          source: normalizeChannelKey(data.source),
          medium: normalizeChannelKey(data.medium),
          campaign: data.campaign,
          content: data.content?.trim() || null,
          term: data.term?.trim() || null,
          destinationPath,
          refCode,
          createdByUserId: user.isPublic ? null : user.id,
        })
        .returning();

      if (!link) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("Campaign link created", {
        linkId: link.id,
        source: link.source,
      });

      return success({
        id: link.id,
        url: buildCampaignUrl(coreEnv.NEXT_PUBLIC_APP_URL, link),
      });
    } catch (error) {
      logger.error("Failed to create campaign link", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
