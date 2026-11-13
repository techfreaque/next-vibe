/**
 * Referral Links - Repository
 * The caller's own tracked links. Funnel numbers come from growth journeys
 * (a journey counts for a link when the link was its first or last touch);
 * earnings are the caller's own commissions from the users those journeys
 * belong to. Server-only.
 */

import "server-only";

import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
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

import {
  buildCampaignUrl,
  normalizeDestinationPath,
} from "@/leads/growth/attribution";
import { growthCampaignLinks, growthJourneys } from "@/leads/growth/db";

import { referralCodes, referralEarnings } from "../db";
import { ReferralEarningStatus } from "../enum";
import { REFERRAL_LINK_DEFAULT_MEDIUM } from "./constants";
import type {
  ReferralLinkCreateRequestOutput,
  ReferralLinkCreateResponseOutput,
  ReferralLinksGetResponseOutput,
} from "./definition";
import type { ReferralLinksT } from "./i18n";

/**
 * UTM-safe slug for user-typed values: "YouTube review, Nov" becomes
 * "youtube-review-nov". Falls back when nothing usable is left.
 */
function toUtmSlug(input: string, fallback: string): string {
  const slug = input
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 100);
  return slug.length > 0 ? slug : fallback;
}

export class ReferralLinksRepository {
  static async list(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ReferralLinksT,
  ): Promise<ResponseType<ReferralLinksGetResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const links = await db
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
          createdAt: growthCampaignLinks.createdAt,
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
        .where(eq(growthCampaignLinks.createdByUserId, user.id))
        .groupBy(growthCampaignLinks.id)
        .orderBy(desc(growthCampaignLinks.createdAt));

      const linkIds = links.map((link) => link.id);
      const earnings =
        linkIds.length === 0
          ? []
          : await db
              .select({
                linkId: growthCampaignLinks.id,
                earnedCents: sql<number>`coalesce(sum(${referralEarnings.amountCents}) filter (where ${referralEarnings.status} = ${ReferralEarningStatus.CONFIRMED}), 0)::int`,
                pendingCents: sql<number>`coalesce(sum(${referralEarnings.amountCents}) filter (where ${referralEarnings.status} = ${ReferralEarningStatus.PENDING}), 0)::int`,
              })
              .from(growthCampaignLinks)
              .innerJoin(
                growthJourneys,
                or(
                  eq(growthJourneys.firstLinkId, growthCampaignLinks.id),
                  eq(growthJourneys.lastLinkId, growthCampaignLinks.id),
                ),
              )
              .innerJoin(
                referralEarnings,
                and(
                  eq(referralEarnings.sourceUserId, growthJourneys.userId),
                  eq(referralEarnings.earnerUserId, user.id),
                ),
              )
              .where(inArray(growthCampaignLinks.id, linkIds))
              .groupBy(growthCampaignLinks.id);

      const earningsByLink = new Map(earnings.map((row) => [row.linkId, row]));

      return success({
        links: links.map((link) => {
          const earned = earningsByLink.get(link.id);
          return {
            id: link.id,
            name: link.name,
            source: link.source,
            medium: link.medium,
            campaign: link.campaign,
            destinationPath: link.destinationPath,
            refCode: link.refCode,
            url: buildCampaignUrl(coreEnv.NEXT_PUBLIC_APP_URL, link),
            visits: link.visits,
            signups: link.signups,
            paid: link.paid,
            earnedCents: earned?.earnedCents ?? 0,
            pendingCents: earned?.pendingCents ?? 0,
            createdAt: link.createdAt.toISOString(),
          };
        }),
      });
    } catch (error) {
      logger.error("Failed to list referral links", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async create(
    data: ReferralLinkCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ReferralLinksT,
  ): Promise<ResponseType<ReferralLinkCreateResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const destinationPath = normalizeDestinationPath(data.destinationPath);
      if (!destinationPath) {
        return fail({
          message: t("errors.invalidDestination"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Only the caller's own active codes. Empty = first active code.
      const requested = data.code?.trim() || null;
      const [code] = await db
        .select({ code: referralCodes.code })
        .from(referralCodes)
        .where(
          and(
            eq(referralCodes.ownerUserId, user.id),
            eq(referralCodes.isActive, true),
            requested ? eq(referralCodes.code, requested) : undefined,
          ),
        )
        .orderBy(asc(referralCodes.createdAt))
        .limit(1);
      if (!code) {
        return fail({
          message: requested
            ? t("errors.notYourCode", { code: requested })
            : t("errors.noCode"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const medium = toUtmSlug(data.medium ?? "", REFERRAL_LINK_DEFAULT_MEDIUM);
      const campaign = toUtmSlug(
        data.campaign?.trim() || data.name,
        REFERRAL_LINK_DEFAULT_MEDIUM,
      );

      const [link] = await db
        .insert(growthCampaignLinks)
        .values({
          name: data.name,
          source: toUtmSlug(data.source, REFERRAL_LINK_DEFAULT_MEDIUM),
          medium,
          campaign,
          content: null,
          term: null,
          destinationPath,
          refCode: code.code,
          createdByUserId: user.id,
        })
        .returning();

      if (!link) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("Referral link created", {
        linkId: link.id,
        source: link.source,
      });

      return success({
        id: link.id,
        url: buildCampaignUrl(coreEnv.NEXT_PUBLIC_APP_URL, link),
        refCode: code.code,
      });
    } catch (error) {
      logger.error("Failed to create referral link", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
