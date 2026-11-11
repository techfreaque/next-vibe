/**
 * User By ID Repository Implementation
 * Business logic for CRUD operations on individual users
 */

import "server-only";

import { and, count, eq, lt, sum } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { UserRolesRepository } from "next-vibe/identity/roles/repository";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditTransactions, creditWallets } from "@/credits/db";
import {
  computeFreeAllowance,
  poolHasConfirmedNewsletter,
} from "@/credits/free-allowance";
import { referralCodes, referralEarnings, userReferrals } from "@/referral/db";
import { ReferralEarningStatus } from "@/referral/enum";
import { passwordResets } from "@/user/public/reset-password/db";
import { customSkills } from "@/vibe/agent/skills/db";
import { chatFavorites } from "@/vibe/agent/skills/favorites/db";

import type {
  UserDeleteResponseOutput,
  UserDeleteUrlParamsTypeOutput,
  UserGetResponseOutput,
  UserGetUrlParamsTypeOutput,
  UserPutRequestOutput,
  UserPutResponseOutput,
  UserPutUrlParamsTypeOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class UserByIdRepository {
  static async getUserById(
    urlPathParams: UserGetUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserGetResponseOutput>> {
    try {
      logger.debug("Getting user by ID", {
        id: urlPathParams.id,
        requestingUser: user.id,
      });

      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, urlPathParams.id))
        .limit(1);

      if (!foundUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.get.errors.notFound.detail", {
            userId: urlPathParams.id,
          }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.debug("User found successfully", { userId: foundUser.id });

      const [
        userRolesResponse,
        referralRecord,
        referralCountResult,
        earningsResult,
        walletResult,
        spendResult,
        favoritesResult,
        skillsResult,
        leadLinkResult,
      ] = await Promise.all([
        UserRolesRepository.findByUserId(foundUser.id, logger, locale),
        // Who referred this user
        db
          .select({
            referrerUserId: userReferrals.referrerUserId,
            code: referralCodes.code,
          })
          .from(userReferrals)
          .leftJoin(
            referralCodes,
            eq(userReferrals.referralCodeId, referralCodes.id),
          )
          .where(eq(userReferrals.referredUserId, foundUser.id))
          .limit(1),
        // How many users this user referred
        db
          .select({ cnt: count() })
          .from(userReferrals)
          .where(eq(userReferrals.referrerUserId, foundUser.id)),
        // Earnings for this user, split by status
        db
          .select({
            status: referralEarnings.status,
            total: sum(referralEarnings.amountCents),
          })
          .from(referralEarnings)
          .where(eq(referralEarnings.earnerUserId, foundUser.id))
          .groupBy(referralEarnings.status),
        // Paid credit balance (sum across this user's wallet(s))
        db
          .select({ total: sum(creditWallets.balance) })
          .from(creditWallets)
          .where(eq(creditWallets.userId, foundUser.id)),
        // Lifetime credits spent (sum of negative usage transactions)
        db
          .select({ total: sum(creditTransactions.amount) })
          .from(creditTransactions)
          .innerJoin(
            creditWallets,
            eq(creditTransactions.walletId, creditWallets.id),
          )
          .where(
            and(
              eq(creditWallets.userId, foundUser.id),
              lt(creditTransactions.amount, 0),
            ),
          ),
        // Favorites count
        db
          .select({ cnt: count() })
          .from(chatFavorites)
          .where(eq(chatFavorites.userId, foundUser.id)),
        // Custom skills count
        db
          .select({ cnt: count() })
          .from(customSkills)
          .where(eq(customSkills.userId, foundUser.id)),
        // Linked leads (for the free-allowance pool newsletter check)
        db
          .select({ leadId: userLeadLinks.leadId })
          .from(userLeadLinks)
          .where(eq(userLeadLinks.userId, foundUser.id)),
      ]);

      // Default to empty array if roles fetch fails
      const userRoles = userRolesResponse.success ? userRolesResponse.data : [];

      if (!userRolesResponse.success) {
        logger.warn("Failed to fetch user roles", {
          userId: foundUser.id,
          error: userRolesResponse.message,
        });
      }

      const referralBy = referralRecord[0] ?? null;
      const [firstReferralCount] = referralCountResult;
      const totalReferrals = Number(firstReferralCount?.cnt ?? 0);

      // Earnings split by status
      let confirmedEarnedCents = 0;
      let pendingEarnedCents = 0;
      for (const row of earningsResult) {
        const amount = Number(row.total ?? 0);
        if (row.status === ReferralEarningStatus.CONFIRMED) {
          confirmedEarnedCents += amount;
        } else if (row.status === ReferralEarningStatus.PENDING) {
          pendingEarnedCents += amount;
        }
      }
      // Total earned stays confirmed + pending (excludes canceled)
      const totalEarnedCents = confirmedEarnedCents + pendingEarnedCents;

      // Paid credit balance
      const [firstWallet] = walletResult;
      const creditBalance = Number(firstWallet?.total ?? 0);

      // Lifetime credits spent (stored negative, surfaced as positive)
      const [firstSpend] = spendResult;
      const lifetimeCreditsSpent = Math.abs(Number(firstSpend?.total ?? 0));

      // Favorites + skills counts
      const [firstFavorites] = favoritesResult;
      const favoritesCount = Number(firstFavorites?.cnt ?? 0);
      const [firstSkills] = skillsResult;
      const customSkillsCount = Number(firstSkills?.cnt ?? 0);

      // Free-allowance tier (user pool: lead 20 + user 50, +20 with newsletter)
      const leadIds = leadLinkResult.map((row) => row.leadId);
      const hasConfirmedNewsletter = await poolHasConfirmedNewsletter({
        userId: foundUser.id,
        leadIds,
      });
      const freeAllowance = computeFreeAllowance({
        isUserPool: true,
        hasConfirmedNewsletter,
      });

      return success({
        userProfile: {
          basicInfo: {
            id: foundUser.id,
            email: foundUser.email,
            privateName: foundUser.privateName,
            publicName: foundUser.publicName,
          },
        },
        accountStatus: {
          isActive: foundUser.isActive,
          emailVerified: foundUser.emailVerified,
          stripeCustomerId: foundUser.stripeCustomerId,
          userRoles: userRoles,
        },
        timestamps: {
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
        },
        referralInfo: {
          referredByUserId: referralBy?.referrerUserId ?? null,
          referredByCode: referralBy?.code ?? null,
          totalReferrals,
          totalEarnedCents,
          confirmedEarnedCents,
          pendingEarnedCents,
        },
        engagement: {
          creditBalance,
          freeAllowance,
          lifetimeCreditsSpent,
          favoritesCount,
          customSkillsCount,
          newsletterConsent: foundUser.marketingConsent,
          hasConfirmedNewsletter,
        },
        leadId: null,
        email: foundUser.email,
        privateName: foundUser.privateName,
        publicName: foundUser.publicName,
        emailVerified: foundUser.emailVerified,
        isActive: foundUser.isActive,
        stripeCustomerId: foundUser.stripeCustomerId,
        userRoles: userRoles,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
      });
    } catch (error) {
      logger.error("Error getting user by ID", parseError(error));
      const parsedError = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("id.get.errors.server.detail", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateUser(
    data: UserPutRequestOutput,
    urlPathParams: UserPutUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserPutResponseOutput>> {
    try {
      logger.debug("Updating user", {
        id: urlPathParams.id,
        requestingUser: user.id,
      });

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, urlPathParams.id))
        .limit(1);

      if (!existingUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.put.errors.notFound.detail", {
            userId: urlPathParams.id,
          }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Prepare update data
      const updateData: Partial<typeof users.$inferInsert> = {
        updatedBy: user.id,
      };

      // Handle flat field structure
      if (data.privateName !== undefined) {
        updateData.privateName = data.privateName;
      }
      if (data.publicName !== undefined) {
        updateData.publicName = data.publicName;
      }
      if (data.email !== undefined) {
        updateData.email = data.email;
      }
      if (data.isActive !== undefined) {
        updateData.isActive = data.isActive;
      }
      if (data.emailVerified !== undefined) {
        updateData.emailVerified = data.emailVerified;
      }
      if (data.isBanned !== undefined) {
        updateData.isBanned = data.isBanned;
      }
      if (data.bannedReason !== undefined) {
        updateData.bannedReason = data.bannedReason;
      }

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, urlPathParams.id))
        .returning();

      if (!updatedUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.put.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("User updated successfully", { userId: urlPathParams.id });

      const userRolesResponse = await UserRolesRepository.findByUserId(
        updatedUser.id,
        logger,
        locale,
      );

      // Default to empty array if roles fetch fails
      const userRoles = userRolesResponse.success ? userRolesResponse.data : [];

      if (!userRolesResponse.success) {
        logger.warn("Failed to fetch user roles", {
          userId: updatedUser.id,
          error: userRolesResponse.message,
        });
      }

      return success({
        id: updatedUser.id,
        leadId: null,
        email: updatedUser.email,
        privateName: updatedUser.privateName,
        publicName: updatedUser.publicName,
        emailVerified: updatedUser.emailVerified,
        isActive: updatedUser.isActive,
        isBanned: updatedUser.isBanned,
        bannedReason: updatedUser.bannedReason,
        stripeCustomerId: updatedUser.stripeCustomerId,
        userRoles: userRoles,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
    } catch (error) {
      logger.error("Error updating user", parseError(error));
      const parsedError = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("id.put.errors.server.detail", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async deleteUser(
    urlPathParams: UserDeleteUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserDeleteResponseOutput>> {
    try {
      logger.debug("Deleting user", {
        id: urlPathParams.id,
        requestingUser: user.id,
      });

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, urlPathParams.id))
        .limit(1);

      if (!existingUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.delete.errors.notFound.detail", {
            userId: urlPathParams.id,
          }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Nullify converted_user_id in leads to satisfy FK constraint
      await db
        .update(leads)
        .set({ convertedUserId: null })
        .where(eq(leads.convertedUserId, urlPathParams.id));

      // Pending password-reset tokens block the delete (FK, no cascade)
      await db
        .delete(passwordResets)
        .where(eq(passwordResets.userId, urlPathParams.id));

      // Delete user roles first to satisfy FK constraint
      await UserRolesRepository.deleteByUserId(
        urlPathParams.id,
        logger,
        locale,
      );

      // Delete user
      await db.delete(users).where(eq(users.id, urlPathParams.id));

      logger.debug("User deleted successfully", { userId: urlPathParams.id });

      return success({
        success: true,
        message: "User deleted successfully",
        deletedAt: new Date(),
      });
    } catch (error) {
      logger.error("Error deleting user", parseError(error));
      const parsedError = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("id.delete.errors.server.detail", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
