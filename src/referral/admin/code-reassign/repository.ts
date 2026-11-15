/**
 * Referral Code Reassign - Repository
 * Moves a referral code to another owner:
 * - referral_codes.owner_user_id → new owner
 * - user_referrals of that code → referrer becomes the new owner, so the
 *   commission chain pays the new owner from now on. A row whose referred user
 *   IS the new owner stays with the previous owner (no self-referral).
 * - growth_campaign_links carrying the code that the previous owner created
 *   move with it, so the new owner sees them under their tracked links. Links
 *   are keyed by the code string, so every link keeps working either way.
 * - referral_earnings, lead_referrals, payouts: untouched (history stays).
 * Audit: a private user note on both accounts plus an info log line.
 * Server-only.
 */

import "server-only";

import { and, count, eq, ne, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { userNotes, users } from "next-vibe/identity/user/db";
import { UserNoteType } from "next-vibe/identity/user/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { growthCampaignLinks } from "@/leads/growth/db";

import { referralCodes, userReferrals } from "../../db";
import type {
  ReferralCodeReassignRequestOutput,
  ReferralCodeReassignResponseOutput,
} from "./definition";
import type { ReferralCodeReassignT } from "./i18n";

interface UserRef {
  id: string;
  email: string;
}

async function findUser(target: string): Promise<UserRef | undefined> {
  const isId = z.uuid().safeParse(target).success;
  const [row] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(
      isId
        ? eq(users.id, target)
        : sql`lower(${users.email}) = ${target.toLowerCase()}`,
    )
    .limit(1);
  return row;
}

export class ReferralCodeReassignRepository {
  static async reassign(
    data: ReferralCodeReassignRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ReferralCodeReassignT,
  ): Promise<ResponseType<ReferralCodeReassignResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const adminUserId = user.id;
    const dryRun = data.dryRun ?? true;

    try {
      const [code] = await db
        .select({
          id: referralCodes.id,
          code: referralCodes.code,
          ownerUserId: referralCodes.ownerUserId,
          ownerEmail: users.email,
        })
        .from(referralCodes)
        .innerJoin(users, eq(users.id, referralCodes.ownerUserId))
        .where(eq(referralCodes.code, data.code))
        .limit(1);
      if (!code) {
        return fail({
          message: t("errors.codeNotFound", { code: data.code }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const target = await findUser(data.targetUser);
      if (!target) {
        return fail({
          message: t("errors.userNotFound", { target: data.targetUser }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Codes are globally unique: "target already owns this slug" means the
      // target is already the owner.
      if (target.id === code.ownerUserId) {
        return fail({
          message: t("errors.alreadyOwner", {
            target: target.email,
            code: code.code,
          }),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const movableReferrals = and(
        eq(userReferrals.referralCodeId, code.id),
        ne(userReferrals.referredUserId, target.id),
      );
      const selfReferral = and(
        eq(userReferrals.referralCodeId, code.id),
        eq(userReferrals.referredUserId, target.id),
      );
      const ownedLinks = and(
        eq(growthCampaignLinks.refCode, code.code),
        eq(growthCampaignLinks.createdByUserId, code.ownerUserId),
      );

      const [[referralCount], [selfCount], [ownedLinkCount], [linkCount]] =
        await Promise.all([
          db.select({ n: count() }).from(userReferrals).where(movableReferrals),
          db.select({ n: count() }).from(userReferrals).where(selfReferral),
          db.select({ n: count() }).from(growthCampaignLinks).where(ownedLinks),
          db
            .select({ n: count() })
            .from(growthCampaignLinks)
            .where(eq(growthCampaignLinks.refCode, code.code)),
        ]);

      const result: ReferralCodeReassignResponseOutput = {
        dryRunApplied: dryRun,
        reassignedCode: code.code,
        fromUserId: code.ownerUserId,
        fromEmail: code.ownerEmail,
        toUserId: target.id,
        toEmail: target.email,
        referralsMoved: referralCount?.n ?? 0,
        selfReferralsKept: selfCount?.n ?? 0,
        linksMoved: ownedLinkCount?.n ?? 0,
        linksTotal: linkCount?.n ?? 0,
      };

      if (dryRun) {
        return success(result);
      }

      const [admin] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, adminUserId))
        .limit(1);
      const at = new Date();

      const moved = await db.transaction(async (tx) => {
        const now = new Date();
        const [updatedCode] = await tx
          .update(referralCodes)
          .set({ ownerUserId: target.id, updatedAt: now })
          .where(
            and(
              eq(referralCodes.id, code.id),
              // Lost a race with another reassign: change nothing.
              eq(referralCodes.ownerUserId, code.ownerUserId),
            ),
          )
          .returning({ id: referralCodes.id });
        if (!updatedCode) {
          return undefined;
        }
        const referrals = await tx
          .update(userReferrals)
          .set({ referrerUserId: target.id })
          .where(movableReferrals)
          .returning({ id: userReferrals.id });
        const links = await tx
          .update(growthCampaignLinks)
          .set({ createdByUserId: target.id, updatedAt: now })
          .where(ownedLinks)
          .returning({ id: growthCampaignLinks.id });

        const note = t("post.note", {
          code: code.code,
          from: code.ownerEmail,
          to: target.email,
          admin: admin?.email ?? adminUserId,
          at: at.toISOString(),
          referrals: referrals.length,
          links: links.length,
        });
        await tx.insert(userNotes).values([
          {
            userId: code.ownerUserId,
            authorUserId: adminUserId,
            type: UserNoteType.NOTE,
            content: note,
            isPrivate: true,
          },
          {
            userId: target.id,
            authorUserId: adminUserId,
            type: UserNoteType.NOTE,
            content: note,
            isPrivate: true,
          },
        ]);
        return { referrals: referrals.length, links: links.length };
      });

      if (!moved) {
        return fail({
          message: t("errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      logger.info("Referral code reassigned", {
        code: code.code,
        codeId: code.id,
        fromUserId: code.ownerUserId,
        toUserId: target.id,
        byUserId: adminUserId,
        at: at.toISOString(),
        referralsMoved: moved.referrals,
        linksMoved: moved.links,
      });

      return success({
        ...result,
        referralsMoved: moved.referrals,
        linksMoved: moved.links,
      });
    } catch (error) {
      logger.error("Failed to reassign referral code", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
