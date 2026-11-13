/**
 * User Profile Repository
 * Handles user profile operations with proper interfaces and logger pattern
 */

import "server-only";

import { and, eq, inArray, or } from "drizzle-orm";
import { DEFAULT_CHAT_MODEL_SELECTION } from "next-vibe/agent/ai-stream/constants";
import { getBestChatModel } from "next-vibe/agent/ai-stream/models";
import { formatSkillId } from "next-vibe/agent/chat/slugify";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getModelDisplayName } from "next-vibe/agent/models/all-models";
import { modelProviders } from "next-vibe/agent/models/models";
import { customSkills } from "next-vibe/agent/skills/db";
import { SkillOwnershipType, SkillStatus } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { userRoles, users } from "next-vibe/identity/user/db";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import { contacts } from "../../../contact/db";
import { creditWallets } from "../../../credits/db";
import { growthJourneys } from "../../../leads/growth/db";
import { csvImportJobs, importBatches } from "../../../leads/import/db";
import { messengerAccounts } from "../../../messenger/accounts/db";
import { newsletterSubscriptions } from "../../../newsletter/db";
import { payoutRequests } from "../../../referral/db";
import { subscriptions } from "../../../subscription/db";
import { SubscriptionStatus } from "../../../subscription/enum";
import { SubscriptionRepository } from "../../../subscription/repository";
import { withTransaction } from "../../../vibe/database/utils/repository-helpers";
import { passwordResets } from "../../public/reset-password/db";
import { findUserByNormalizedEmail } from "../../public/signup/email-guard";
import type {
  MeDeleteResponseOutput,
  MeGetResponseOutput,
  MePostRequestOutput,
  MePostResponseOutput,
} from "./definition";
import type { MeT } from "./i18n";

/** Fetch public skills for a user, enriched with model display info */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- inferred from complex mapped return
async function fetchUserSkills(userId: string, viewer: JwtPayloadType) {
  const viewerAvailability = await getEnvAvailability();
  const skillRows = await db
    .select({
      id: customSkills.id,
      name: customSkills.name,
      tagline: customSkills.tagline,
      description: customSkills.description,
      icon: customSkills.icon,
      category: customSkills.category,
      ownershipType: customSkills.ownershipType,
      voteCount: customSkills.voteCount,
      trustLevel: customSkills.trustLevel,
      variants: customSkills.variants,
    })
    .from(customSkills)
    .where(
      and(
        eq(customSkills.userId, userId),
        eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
        eq(customSkills.status, SkillStatus.PUBLISHED),
      ),
    );

  return skillRows.flatMap((row) => {
    const variants = row.variants ?? [];
    const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];
    const expandedVariants = variants.length > 1 ? variants : null;
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
            modelSelection: defaultVariant?.modelSelection ?? null,
            variantId: null,
            variantName: null,
            isVariant: false,
            isDefault: false,
          },
        ];
    return rows.map(
      ({ modelSelection, variantId, variantName, isVariant, isDefault }) => {
        const selection = modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION;
        const bestModel = getBestChatModel(
          selection,
          viewer,
          viewerAvailability,
        );
        const modelId = bestModel?.id ?? null;
        const modelRow = bestModel
          ? {
              modelIcon: bestModel.icon,
              modelInfo: getModelDisplayName(
                bestModel,
                false,
                viewerAvailability,
              ),
              modelProvider:
                modelProviders[bestModel.provider]?.name ?? bestModel.provider,
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
}

/** Image type from the leading base64 bytes (the file field sends bare base64). */
function sniffImageMime(base64: string): string {
  if (base64.startsWith("iVBORw0KGgo")) {
    return "image/png";
  }
  if (base64.startsWith("R0lGOD")) {
    return "image/gif";
  }
  if (base64.startsWith("UklGR")) {
    return "image/webp";
  }
  return "image/jpeg";
}

/**
 * User Profile Repository - Static class pattern
 */
export class UserProfileRepository {
  /**
   * Get current user profile or JWT payload
   * @param data - Request data (empty for GET)
   * @param user - User from JWT (public or private)
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns User profile data (full for private, JWT payload for public)
   */
  static async getProfile(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MeT,
  ): Promise<ResponseType<MeGetResponseOutput>> {
    try {
      if (!user.id || user.isPublic) {
        // A logged-out visitor hitting /me. The GET endpoint allows PUBLIC at
        // the role gate, so this 403 comes from here, not the permission
        // registry. Expected noise (the client probes /me on page load), so it
        // logs at debug - a logged-IN user reaching this branch would be a real
        // auth drop, which still surfaces because `user.isPublic` would be false.
        return fail({
          message: t("get.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          expected: true,
        });
      }
      const userId: string = user.id;
      logger.debug("Getting user profile", { userId });

      // Get complete user data
      const userResponse = await UserRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: t("get.errors.notFound.detail", { userId }),
          errorType: ErrorResponseTypes.NOT_FOUND,
          cause: userResponse,
        });
      }

      // Fetch user's public skills
      const skills = await fetchUserSkills(userId, user);

      logger.debug("Successfully retrieved user profile", {
        userId,
        skillCount: skills.length,
      });
      return success({
        ...userResponse.data,
        isPublic: false as const,
        skills,
      } as MeGetResponseOutput);
    } catch (error) {
      logger.error("Error getting user profile", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: t("get.errors.internal.detail", {
          error: parsedError.message,
          // Public visitors carry no user id; the lead id still identifies them.
          userId: user.id ?? user.leadId,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a user's profile
   * @param data - The user data to update
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with updated user information
   */
  static async updateProfile(
    data: MePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MeT,
  ): Promise<ResponseType<MePostResponseOutput>> {
    try {
      // Public users: sync lead locale only
      if (user.isPublic) {
        logger.debug("Syncing lead locale", { leadId: user.leadId, locale });
        const { language, country } = getLanguageAndCountryFromLocale(locale);
        await db
          .update(leads)
          .set({ language, country, updatedAt: new Date() })
          .where(eq(leads.id, user.leadId));
        const now = new Date().toISOString();
        return success<MePostResponseOutput>({
          response: {
            success: true,
            message: t("update.response.message"),
            id: user.leadId,
            leadId: user.leadId,
            isPublic: false as const,
            email: "",
            privateName: "",
            publicName: "",
            locale,
            isActive: true,
            emailVerified: false,
            requireTwoFactor: false,
            marketingConsent: false,
            userRoles: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            stripeCustomerId: null,
            skills: [],
            changesSummary: {
              totalChanges: 1,
              changedFields: ["locale"],
              verificationRequired: false,
              lastUpdated: now,
            },
            nextSteps: [t("update.success.nextSteps") as string],
          },
        });
      }

      if (!user.id) {
        return fail({
          message: t("update.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId: string = user.id;
      logger.debug("Updating user profile", { userId, data });

      // Check if user exists
      const userResponse = await UserRepository.getUserById<
        typeof UserDetailLevel.COMPLETE
      >(userId, UserDetailLevel.COMPLETE, locale, logger);
      if (!userResponse.success) {
        return fail({
          message: t("update.errors.notFound.detail", { userId }),
          errorType: ErrorResponseTypes.NOT_FOUND,
          cause: userResponse,
        });
      }

      const currentUser = userResponse.data;

      // Verify email is not taken by another user
      if (data.basicInfo?.email && data.basicInfo.email !== currentUser.email) {
        const emailExistsResponse = await UserRepository.emailExistsByOtherUser(
          data.basicInfo.email,
          userId,
          logger,
          locale,
        );
        // Alias-aware too (gmail dots, +tags): one inbox, one account
        const aliasOwner = await findUserByNormalizedEmail(
          data.basicInfo.email,
          userId,
        );

        if (
          (emailExistsResponse.success && emailExistsResponse.data) ||
          aliasOwner
        ) {
          return fail({
            message: t("update.errors.validation.emailTaken"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      // Flatten the nested data structure for database update
      // Always sync locale from URL path to keep user locale in sync
      const updateData: Partial<typeof users.$inferInsert> = {
        updatedAt: new Date(),
        locale,
      };

      // Flatten basicInfo fields
      if (data.basicInfo) {
        if (data.basicInfo.privateName !== undefined) {
          updateData.privateName = data.basicInfo.privateName;
        }
        if (data.basicInfo.publicName !== undefined) {
          updateData.publicName = data.basicInfo.publicName;
        }
        if (data.basicInfo.email !== undefined) {
          updateData.email = data.basicInfo.email;
        }
      }

      // Handle marketingConsent from privacySettings
      if (data.privacySettings?.marketingConsent !== undefined) {
        updateData.marketingConsent = data.privacySettings.marketingConsent;
      }

      // Handle profileInfo (creator fields + social links)
      if (data.profileInfo) {
        const p = data.profileInfo;
        if (p.creatorSlug !== undefined) {
          if (p.creatorSlug) {
            // Validate: lowercase alphanumeric + hyphens only
            const normalized = p.creatorSlug
              .toLowerCase()
              .replaceAll(/[^a-z0-9-]/g, "-")
              .replaceAll(/-{2,}/g, "-")
              .replaceAll(/^-|-$/g, "")
              .slice(0, 60);
            // Check uniqueness
            const existing = await db
              .select({ id: users.id })
              .from(users)
              .where(eq(users.creatorSlug, normalized))
              .limit(1);
            if (existing.length > 0 && existing[0].id !== userId) {
              return fail({
                message: t("update.errors.conflict.creatorSlugTaken"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
            updateData.creatorSlug = normalized;
          } else {
            updateData.creatorSlug = null;
          }
        }
        if (p.bio !== undefined) {
          updateData.bio = p.bio;
        }
        if (p.websiteUrl !== undefined) {
          updateData.websiteUrl = p.websiteUrl || null;
        }
        if (p.twitterUrl !== undefined) {
          updateData.twitterUrl = p.twitterUrl || null;
        }
        if (p.youtubeUrl !== undefined) {
          updateData.youtubeUrl = p.youtubeUrl || null;
        }
        if (p.instagramUrl !== undefined) {
          updateData.instagramUrl = p.instagramUrl || null;
        }
        if (p.tiktokUrl !== undefined) {
          updateData.tiktokUrl = p.tiktokUrl || null;
        }
        if (p.githubUrl !== undefined) {
          updateData.githubUrl = p.githubUrl || null;
        }
        if (p.facebookUrl !== undefined) {
          updateData.facebookUrl = p.facebookUrl || null;
        }
        if (p.discordUrl !== undefined) {
          updateData.discordUrl = p.discordUrl || null;
        }
        if (p.tribeUrl !== undefined) {
          updateData.tribeUrl = p.tribeUrl || null;
        }
        if (p.rumbleUrl !== undefined) {
          updateData.rumbleUrl = p.rumbleUrl || null;
        }
        if (p.odyseeUrl !== undefined) {
          updateData.odyseeUrl = p.odyseeUrl || null;
        }
        if (p.nostrUrl !== undefined) {
          updateData.nostrUrl = p.nostrUrl || null;
        }
        if (p.gabUrl !== undefined) {
          updateData.gabUrl = p.gabUrl || null;
        }
        if (p.creatorAccentColor !== undefined) {
          updateData.creatorAccentColor = p.creatorAccentColor;
        }
        if (p.creatorHeaderImageUrl !== undefined) {
          // File field sends raw base64 - wrap as data URL for storage
          if (
            p.creatorHeaderImageUrl &&
            !p.creatorHeaderImageUrl.startsWith("data:") &&
            !p.creatorHeaderImageUrl.startsWith("http")
          ) {
            updateData.creatorHeaderImageUrl = `data:${sniffImageMime(p.creatorHeaderImageUrl)};base64,${p.creatorHeaderImageUrl}`;
          } else {
            updateData.creatorHeaderImageUrl = p.creatorHeaderImageUrl || null;
          }
        }
      }

      // Update user in database
      await db.update(users).set(updateData).where(eq(users.id, userId));

      // Cascade email change to linked lead record.
      // Use onConflictDoNothing to handle the edge case where another lead row
      // already has the same email (leads_email_unique constraint). The users table
      // update already succeeded, so a conflict here is non-fatal - the lead email
      // stays as-is rather than crashing the whole request.
      if (updateData.email && currentUser.leadId) {
        await db
          .update(leads)
          .set({ email: updateData.email, updatedAt: new Date() })
          .where(eq(leads.id, currentUser.leadId))
          .catch((leadUpdateErr) => {
            const msg = parseError(leadUpdateErr).message;
            if (msg.includes("leads_email_unique")) {
              logger.warn(
                "Lead email update skipped - email already claimed by another lead",
                { leadId: currentUser.leadId, email: updateData.email },
              );
            } else {
              logger.error("Failed to cascade email to lead", {
                leadId: currentUser.leadId,
                error: msg,
              });
            }
          });
      }

      logger.debug("Successfully updated user profile", { userId });

      // Get the updated user data
      const updatedUserResponse = await UserRepository.getUserById<
        typeof UserDetailLevel.COMPLETE
      >(userId, UserDetailLevel.COMPLETE, locale, logger);
      if (!updatedUserResponse.success) {
        return fail({
          message: t("update.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: updatedUserResponse,
        });
      }

      // Create list of changed fields
      const changedFields = Object.keys(updateData).filter(
        (key) => key !== "updatedAt",
      );

      // Fetch user's public skills
      const skills = await fetchUserSkills(userId, user);

      // Return the correct response structure with flattened user fields
      return success({
        response: {
          success: true,
          message: t("update.response.message"),
          ...updatedUserResponse.data,
          leadId: updatedUserResponse.data.leadId ?? null,
          skills,
          changesSummary: {
            totalChanges: changedFields.length,
            changedFields: changedFields,
            verificationRequired: false,
            lastUpdated: new Date().toISOString(),
          },
          nextSteps: [t("update.success.nextSteps") as string],
        },
      });
    } catch (error) {
      logger.error("Error updating user profile", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: t("update.errors.internal.detail", {
          error: parsedError.message,
          // Public visitors carry no user id; the lead id still identifies them.
          userId: user.id ?? user.leadId,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a user account
   * @param data - Request data (empty for DELETE)
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with deletion status
   */
  static async deleteAccount(
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MeT,
  ): Promise<ResponseType<MeDeleteResponseOutput>> {
    try {
      if (!user.id) {
        return fail({
          message: t("delete.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId: string = user.id;
      logger.debug("Deleting user account", { userId });

      // Check if user exists
      const userResponse = await UserRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: t("delete.errors.notFound.detail", { userId }),
          errorType: ErrorResponseTypes.NOT_FOUND,
          cause: userResponse,
        });
      }

      // 1. Cancel billing FIRST. If that fails, abort: deleting the account
      //    while the provider keeps charging would bill a user who no longer
      //    exists and can no longer cancel.
      const [activeSubscription] = await db
        .select({
          id: subscriptions.id,
          status: subscriptions.status,
          providerSubscriptionId: subscriptions.providerSubscriptionId,
        })
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      const isBillable =
        activeSubscription?.providerSubscriptionId &&
        activeSubscription.status !== SubscriptionStatus.CANCELED &&
        activeSubscription.status !== SubscriptionStatus.INCOMPLETE_EXPIRED;
      if (isBillable) {
        const cancelResult = await SubscriptionRepository.cancelSubscription(
          { cancelAtPeriodEnd: false },
          userId,
          logger,
          locale,
        );
        if (!cancelResult.success) {
          logger.error(
            "Account deletion aborted: subscription could not be canceled",
            {
              userId,
              subscriptionId: activeSubscription.id,
              error: cancelResult.message,
            },
          );
          return fail({
            message: t("delete.errors.billingCancelFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            cause: cancelResult,
          });
        }
      }

      const userEmail = userResponse.data.email;

      // 2. All DB work in ONE transaction: either the account is fully gone
      //    or nothing changed.
      await withTransaction(logger, async (tx) => {
        // Erase PII from every lead tied to this person (linked devices, the
        // converted lead, any lead carrying their email). Rows stay as
        // anonymous aggregates; the unique email is freed.
        const linkedLeadRows = await tx
          .select({ leadId: userLeadLinks.leadId })
          .from(userLeadLinks)
          .where(eq(userLeadLinks.userId, userId));
        const linkedLeadIds = linkedLeadRows.map((r) => r.leadId);
        const leadConditions = [eq(leads.convertedUserId, userId)];
        if (linkedLeadIds.length > 0) {
          leadConditions.push(inArray(leads.id, linkedLeadIds));
        }
        if (userEmail) {
          leadConditions.push(eq(leads.email, userEmail));
        }
        await tx
          .update(leads)
          .set({
            email: null,
            businessName: "",
            contactName: null,
            phone: null,
            website: null,
            ipAddress: null,
            userAgent: null,
            notes: null,
            metadata: {},
            convertedUserId: null,
            updatedAt: new Date(),
          })
          .where(or(...leadConditions));

        // Attribution journeys of those leads keep channel + funnel timestamps
        // (aggregates) but lose the personal trail: user link, landing path,
        // ref codes.
        const journeyConditions = [eq(growthJourneys.userId, userId)];
        if (linkedLeadIds.length > 0) {
          journeyConditions.push(inArray(growthJourneys.leadId, linkedLeadIds));
        }
        await tx
          .update(growthJourneys)
          .set({
            userId: null,
            firstLandingPath: null,
            lastLandingPath: null,
            firstRefCode: null,
            lastRefCode: null,
            updatedAt: new Date(),
          })
          .where(or(...journeyConditions));

        // Contact-form messages carry name/email/free text: scrub, keep row.
        const contactConditions = [eq(contacts.userId, userId)];
        if (userEmail) {
          contactConditions.push(eq(contacts.email, userEmail));
        }
        await tx
          .update(contacts)
          .set({
            name: "",
            email: null,
            company: null,
            message: "",
            userId: null,
            updatedAt: new Date(),
          })
          .where(or(...contactConditions));

        // Newsletter rows are keyed by email — remove them outright.
        if (userEmail) {
          await tx
            .delete(newsletterSubscriptions)
            .where(eq(newsletterSubscriptions.email, userEmail));
        }

        // Handle FK constraints with ON DELETE no action before deleting the
        // user. user_roles: nullify assignedBy first so the delete doesn't
        // violate the self-referential FK on rows where assignedBy = userId.
        await tx
          .update(userRoles)
          .set({ assignedBy: null })
          .where(eq(userRoles.assignedBy, userId));
        await tx.delete(userRoles).where(eq(userRoles.userId, userId));

        // credit_wallets.userId is nullified (not deleted) so the wallet and
        // all credit transaction history are preserved as an audit record.
        await tx
          .delete(passwordResets)
          .where(eq(passwordResets.userId, userId));
        await tx
          .update(creditWallets)
          .set({ userId: null })
          .where(eq(creditWallets.userId, userId));
        await tx
          .delete(csvImportJobs)
          .where(eq(csvImportJobs.uploadedBy, userId));
        await tx
          .delete(importBatches)
          .where(eq(importBatches.uploadedBy, userId));
        await tx
          .update(messengerAccounts)
          .set({ createdBy: null })
          .where(eq(messengerAccounts.createdBy, userId));
        await tx
          .update(messengerAccounts)
          .set({ updatedBy: null })
          .where(eq(messengerAccounts.updatedBy, userId));
        await tx
          .update(payoutRequests)
          .set({ processedByUserId: null })
          .where(eq(payoutRequests.processedByUserId, userId));

        // Delete user — all remaining FK constraints use ON DELETE cascade.
        await tx.delete(users).where(eq(users.id, userId));
      });

      logger.debug("Successfully deleted user account", { userId });

      return success({
        exists: true,
      });
    } catch (error) {
      // Full detail goes to the log only — never raw DB/driver text to the user.
      logger.error("Error deleting user account", parseError(error), {
        userId: user.id,
      });
      return fail({
        message: t("delete.errors.internal.retry"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
