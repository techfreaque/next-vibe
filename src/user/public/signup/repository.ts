/**
 * Signup Repository
 * Handles user registration and email checking with EndpointLogger pattern
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { scopedTranslation as leadsScopedTranslation } from "next-vibe/identity/lead/i18n";
import {
  isUserPermissionRole,
  UserPermissionRole,
  UserRole,
  type UserRoleValue,
} from "next-vibe/identity/roles/enum";
import { UserRolesRepository } from "next-vibe/identity/roles/repository";
import { SessionRepository } from "next-vibe/identity/session/repository";
import type { NewUser } from "next-vibe/identity/user/db";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { StandardUserType } from "next-vibe/identity/user/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";
import type { NextRequest } from "next-vibe/ui/lib/request";

import { recordAntiFarmingEvent } from "@/credits/anti-farming/events";
import { ipSubnetKey } from "@/credits/anti-farming/ip";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/env/constants";

import type {
  SignupPostRequestOutput,
  SignupPostResponseOutput,
} from "./definition";
import { findUserByNormalizedEmail } from "./email-guard";
import {
  emailDomain,
  isDisposableEmail,
  normalizeEmailForUniqueness,
} from "./email-identity";
import type { SignupT } from "./i18n";
import { scopedTranslation as signupScopedTranslation } from "./i18n";

/**
 * Signup repository
 */
export class SignupRepository {
  /**
   * Register a new user
   * @param data - User registration data
   * @param user - User from JWT (public user for signup)
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns Success or error result
   */
  static async registerUser(
    data: SignupPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    platform: Platform,
    t: SignupT,
    request: NextRequest | undefined,
  ): Promise<ResponseType<SignupPostResponseOutput>> {
    try {
      // Extract fields from flat structure
      const email = data.email;
      const password = data.password;
      const confirmPassword = data.confirmPassword;
      const privateName = data.privateName;
      const publicName = data.publicName;
      const subscribeToNewsletter = data.subscribeToNewsletter ?? false;
      const referralCode = data.referralCode;

      logger.debug("Registering new user", { email });

      // Validate password match
      if (password !== confirmPassword) {
        logger.debug("Registration failed: Passwords do not match", {
          email,
        });
        return fail({
          message: t("fields.confirmPassword.validation.mismatch"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Throwaway inboxes never get an account (free-credit farming)
      if (isDisposableEmail(email)) {
        logger.info("Signup blocked: disposable email domain", {
          emailDomain: emailDomain(email),
        });
        await recordAntiFarmingEvent(
          {
            kind: "disposable_email",
            emailDomain: emailDomain(email),
            subnet: SignupRepository.requestSubnet(request),
          },
          logger,
        );
        return fail({
          message: t("errors.disposableEmail.detail"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Check if email already exists (alias-aware: gmail dots, +tags)
      const emailCheckResponse =
        await SignupRepository.checkEmailAvailabilityInternal(
          email,
          locale,
          logger,
        );
      if (!emailCheckResponse.success) {
        return emailCheckResponse;
      }
      if (emailCheckResponse.data) {
        // Same message as a plain duplicate: no account enumeration difference.
        // Only alias variants are farming signals; a re-typed email is not.
        if (
          emailCheckResponse.data.toLowerCase() !== email.trim().toLowerCase()
        ) {
          logger.info("Signup blocked: alias of an existing account email", {
            emailDomain: emailDomain(email),
          });
          await recordAntiFarmingEvent(
            {
              kind: "duplicate_email",
              emailDomain: emailDomain(email),
              subnet: SignupRepository.requestSubnet(request),
            },
            logger,
          );
        }
        return fail({
          message: t("errors.conflict.detail"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Reject a bad referral code BEFORE the account exists — the user can fix
      // or clear it. Silently dropping it would cost their referrer the credit.
      const trimmedReferralCode = referralCode?.trim();
      if (trimmedReferralCode) {
        const { ReferralRepository } =
          await import("../../../referral/repository");
        const codeCheck = await ReferralRepository.validateReferralCode(
          trimmedReferralCode,
          logger,
          locale,
        );
        if (
          !codeCheck.success &&
          codeCheck.errorType.errorCode !==
            ErrorResponseTypes.INTERNAL_ERROR.errorCode
        ) {
          return fail({
            message: t("fields.referralCode.validation.invalid"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      // Create the user account with extracted data
      const result = await SignupRepository.createUserInternal(
        { email, password, privateName, publicName, subscribeToNewsletter },
        user.leadId,
        locale,
        logger,
      );

      if (!result.success) {
        logger.debug("User registration failed", {
          message: result.message,
          errorType: result.errorType,
        });
        return result;
      }

      const userData = result.data;
      logger.debug("User registration completed successfully", {
        email,
        userId: userData.id,
        leadId: user.leadId,
      });

      // Auto-login: Create session and store auth token
      // Link leadId to user
      const { LeadAuthRepository } =
        await import("next-vibe/identity/lead/device-auth");
      // The link is what pools the pre-signup lead wallet into the user's
      // credits — retry once, then record loudly (account already exists).
      let leadLink = await LeadAuthRepository.linkLeadToUser(
        user.leadId,
        userData.id,
        logger,
      );
      if (!leadLink.success) {
        leadLink = await LeadAuthRepository.linkLeadToUser(
          user.leadId,
          userData.id,
          logger,
        );
      }
      if (!leadLink.success) {
        logger.error(
          "CRITICAL: lead not linked to new user — pre-signup credits not pooled, link manually",
          { userId: userData.id, leadId: user.leadId },
        );
      }

      // A guest who already confirmed the uncensored-model consent keeps it.
      const { UncensoredConsentRepository } =
        await import("next-vibe/agent/models/uncensored-consent/repository");
      await UncensoredConsentRepository.carryLeadConsentToUser(
        user.leadId,
        userData.id,
        logger,
      );

      // Growth funnel: the user inherits the lead's first/last-touch attribution
      const { GrowthJourneyRepository } =
        await import("@/leads/growth/repository");
      await GrowthJourneyRepository.attachUser(
        user.leadId,
        userData.id,
        logger,
      );

      // Link referral code if provided manually in form
      const { ReferralRepository } =
        await import("../../../referral/repository");
      if (trimmedReferralCode) {
        logger.debug("Linking manual referral code to lead", {
          referralCode: trimmedReferralCode,
          leadId: user.leadId,
        });
        const referralLink = await ReferralRepository.linkReferralToLead(
          user.leadId,
          trimmedReferralCode,
          logger,
          locale,
        );
        if (!referralLink.success) {
          // Code was valid moments ago — this is an infrastructure failure.
          logger.error("Failed to link referral code during signup", {
            userId: userData.id,
            leadId: user.leadId,
            referralCode: trimmedReferralCode,
            error: referralLink.message,
          });
        }
      }

      // Resolve skillCreatorUserId from lead.skillId (if it's a UUID → look up customSkills owner)
      let skillCreatorUserId: string | null = null;
      try {
        const { db: dbInstance } = await import("next-vibe/database");
        const { leads: leadsTable } =
          await import("next-vibe/identity/lead/db");
        const { eq: eqFn } = await import("drizzle-orm");
        const [leadRow] = await dbInstance
          .select({ skillId: leadsTable.skillId })
          .from(leadsTable)
          .where(eqFn(leadsTable.id, user.leadId))
          .limit(1);
        const skillId = leadRow?.skillId;
        if (skillId && /^[0-9a-f-]{36}$/i.test(skillId)) {
          // UUID skillId - look up the skill owner in customSkills
          const { customSkills } = await import("next-vibe/agent/skills/db");
          const [skill] = await dbInstance
            .select({ userId: customSkills.userId })
            .from(customSkills)
            .where(eqFn(customSkills.id, skillId))
            .limit(1);
          skillCreatorUserId = skill?.userId ?? null;
        }
        // If skillId is not a UUID (built-in skill), skillCreatorUserId stays null
      } catch (skillErr) {
        logger.warn("Failed to resolve skillCreatorUserId from lead.skillId", {
          error: String(skillErr),
        });
      }

      // Convert lead referral to user referral (Phase 2: make referral permanent)
      await ReferralRepository.convertLeadReferralToUser(
        userData.id,
        user.leadId,
        logger,
        locale,
        skillCreatorUserId,
      );

      // Merge lead wallet into user wallet immediately (not lazy)
      // This ensures user gets their pre-signup credits right away.
      // Also include all IP-linked leads so their shared pool collapses into the user.
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
      const { CreditRepository } = await import("@/credits/repository");
      const linkedLeadIds = await LeadAuthRepository.getLinkedLeadIds(
        user.leadId,
        logger,
      );
      // The pool is derived from userLeadLinks on every balance read, so a
      // failed eager merge self-heals on the next read/login as long as the
      // lead link above landed. Retry once; log with full context otherwise.
      const mergeLeadIds = [user.leadId, ...linkedLeadIds];
      let mergeResult = await CreditRepository.mergePendingLeadWallets(
        userData.id,
        mergeLeadIds,
        logger,
        creditsT,
        locale,
      );
      if (!mergeResult.success) {
        mergeResult = await CreditRepository.mergePendingLeadWallets(
          userData.id,
          mergeLeadIds,
          logger,
          creditsT,
          locale,
        );
      }
      if (!mergeResult.success) {
        logger.error("Failed to merge lead wallets during signup", {
          userId: userData.id,
          leadId: user.leadId,
          leadIds: mergeLeadIds,
          leadLinked: leadLink.success,
          error: mergeResult.message,
          action: leadLink.success
            ? "Self-heals on next balance read (pool derives from lead links)"
            : "Lead link missing too — pre-signup credits need a manual link",
        });
      }

      // Get primary leadId for user
      const leadIdResult = await LeadAuthRepository.getAuthenticatedUserLeadId(
        userData.id,
        user.leadId,
        locale,
        logger,
      );

      // Fetch user roles from DB to include in JWT
      const rolesResult = await UserRolesRepository.getUserRoles(
        userData.id,
        logger,
        locale,
      );
      // Default to CUSTOMER role if roles fetch fails
      const roles = rolesResult.success
        ? rolesResult.data
        : [UserPermissionRole.CUSTOMER];

      if (!rolesResult.success) {
        logger.warn(
          "Failed to fetch user roles for JWT after signup, using default CUSTOMER role",
          {
            userId: userData.id,
          },
        );
      }

      if (subscribeToNewsletter) {
        await SignupRepository.subscribeToNewsletterAtSignup(
          email,
          { id: userData.id, leadId: leadIdResult.leadId, roles },
          locale,
          logger,
        );
      }

      // Migrate local favorites from localStorage to DB (fire-and-forget, best-effort)
      if (data.localFavorites && data.localFavorites.length > 0) {
        try {
          const { FavoritesCreateRepository } =
            await import("next-vibe/agent/skills/favorites/create/repository");
          const { scopedTranslation: favoritesCreateScopedTranslation } =
            await import("next-vibe/agent/skills/favorites/create/i18n");
          const { t: favT } = favoritesCreateScopedTranslation.scopedT(locale);
          const userJwt: JwtPayloadType = {
            id: userData.id,
            isPublic: false as const,
            roles,
            leadId: leadIdResult.leadId,
          };
          await Promise.allSettled(
            data.localFavorites.map((fav) =>
              FavoritesCreateRepository.createFavorite(
                {
                  skillId: fav.skillId,
                  customVariantName: fav.customVariantName ?? null,
                  modelSelection: fav.modelSelection ?? null,
                  voiceModelSelection: fav.voiceModelSelection ?? null,
                },
                userJwt,
                logger,
                favT,
                locale,
              ),
            ),
          );
          logger.debug("Local favorites migrated", {
            userId: userData.id,
            count: data.localFavorites.length,
          });
        } catch (favErr) {
          // Never block signup due to favorites migration failure
          logger.warn("Failed to migrate local favorites during signup", {
            userId: userData.id,
            error: String(favErr),
          });
        }
      }

      // Apply chosen skill attribution with overwrite (last wins before signup)
      if (
        data.supportedSkillId &&
        /^[0-9a-f-]{36}$/i.test(data.supportedSkillId)
      ) {
        try {
          const { LeadsRepository } =
            await import("next-vibe/identity/lead/repository");
          await LeadsRepository.updateLeadSkillId(
            leadIdResult.leadId,
            data.supportedSkillId,
            true, // overwrite - user explicitly chose this creator
            logger,
          );
        } catch (skillErr) {
          logger.warn("Failed to apply supportedSkillId during signup", {
            userId: userData.id,
            error: String(skillErr),
          });
        }
      }

      // Create JWT payload with roles
      const tokenPayload: JwtPrivatePayloadType = {
        id: userData.id,
        leadId: leadIdResult.leadId,
        isPublic: false as const,
        roles,
      };

      // Sign JWT token
      const tokenResponse = await AuthRepository.signJwt(
        tokenPayload,
        logger,
        locale,
      );
      if (!tokenResponse.success) {
        // The account exists but the user is NOT signed in. Reporting success
        // would leave the client believing it is logged in — say so instead.
        logger.error("Failed to sign JWT token after signup", {
          userId: userData.id,
          error: tokenResponse.message,
        });
        return fail({
          message: t("errors.autoLoginFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: tokenResponse,
        });
      } else {
        const expiresAt = new Date(
          Date.now() + AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS * 1000,
        );
        const sessionData = {
          userId: userData.id,
          token: tokenResponse.data,
          expiresAt,
        };
        const sessionResult = await SessionRepository.create(
          sessionData,
          locale,
        );
        if (!sessionResult.success) {
          logger.error("Failed to create session after signup", {
            userId: userData.id,
            error: sessionResult.message,
          });
          return fail({
            message: t("errors.autoLoginFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            cause: sessionResult,
          });
        }

        // Store auth token using platform-specific handler
        const storeResult = await AuthRepository.storeAuthTokenForPlatform(
          tokenResponse.data,
          userData.id,
          leadIdResult.leadId,
          platform,
          logger,
          locale,
        );
        if (!storeResult.success) {
          logger.error("Error storing auth token after signup", {
            userId: userData.id,
            error: storeResult.message,
          });
          return fail({
            message: t("errors.autoLoginFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            cause: storeResult,
          });
        }
        logger.debug("Auth token stored successfully after signup", {
          userId: userData.id,
        });
      }

      // Return simple message response
      return success<SignupPostResponseOutput>({
        message: "Registration successful",
      });
    } catch (error) {
      logger.error("Registration error", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: t("errors.internal.title", {
          email: data.email ?? "unknown",
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Internal helper: Create a new user account
   * @param userInput - User registration data (extracted from form)
   * @param leadId - Lead ID from JWT payload
   * @param locale - User locale
   * @param logger - Logger instance
   * @param role - User role (default: CUSTOMER)
   * @returns Success or error result
   */
  private static async createUserInternal(
    userInput: {
      email: string;
      password: string;
      privateName: string;
      publicName: string;
      subscribeToNewsletter: boolean;
    },
    leadId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    role: UserRoleValue = UserRole.CUSTOMER,
  ): Promise<ResponseType<StandardUserType>> {
    try {
      const {
        email,
        password,
        privateName,
        publicName,
        subscribeToNewsletter,
      } = userInput;

      // Create user data object
      const userData: NewUser = {
        email,
        password,
        privateName,
        publicName,
        locale,
        marketingConsent: subscribeToNewsletter,
        isActive: true,
      };

      // Create new user with generated ID
      logger.debug("Creating new user", { email });

      const userResponse = await UserRepository.createWithHashedPassword(
        userData,
        logger,
        locale,
      );
      if (!userResponse.success) {
        return userResponse;
      }

      // Only assign permission roles to users, never platform markers
      // Platform markers (CLI_OFF, CLI_AUTH_BYPASS, etc.) are config-only markers
      if (isUserPermissionRole(role)) {
        await UserRolesRepository.addRole(
          {
            userId: userResponse.data.id,
            role,
          },
          logger,
          locale,
        );
      } else {
        logger.debug(
          "Skipping platform marker assignment - markers are never stored in database",
          {
            role,
          },
        );
      }

      // Note: Free credits are automatically created for the lead when it's first accessed
      // No need to manually add credits here - the pool tops up to the signed-in allowance on next balance read
      // from when it was created (in getOrCreateLeadByIp or getLeadBalance)

      logger.debug("User created successfully", {
        email,
        userId: userResponse.data.id,
        leadId,
      });

      // Link leadId to user (always happens during signup)
      await SignupRepository.handleLeadConversion(
        email,
        leadId,
        userResponse.data.id,
        locale,
        logger,
      );

      return success(userResponse.data);
    } catch (error) {
      logger.error("User creation error", parseError(error));
      const { t: errT } = signupScopedTranslation.scopedT(locale);
      return fail({
        message: errT("errors.internal.title", {
          email: userInput.email,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Newsletter ticked at signup: subscribe the account email through the
   * normal subscribe path (pending, unconfirmed). No separate confirm email:
   * the account verification email says its link confirms the newsletter too
   * (verify-email/email.tsx), and clicking it sets confirmedAt
   * (NewsletterConfirmRepository.confirmForVerifiedAccount). The newsletter bonus then
   * follows the usual rules (credits/free-allowance.ts): once per account.
   * Never blocks signup.
   */
  private static async subscribeToNewsletterAtSignup(
    email: string,
    account: { id: string; leadId: string; roles: JwtPayloadType["roles"] },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const { NewsletterSubscribeRepository } =
        await import("@/newsletter/subscribe/repository");
      const { scopedTranslation: subscribeScopedTranslation } =
        await import("@/newsletter/subscribe/i18n");
      const { t: subscribeT } = subscribeScopedTranslation.scopedT(locale);
      const subscribed = await NewsletterSubscribeRepository.subscribe(
        { email },
        {
          id: account.id,
          leadId: account.leadId,
          isPublic: false as const,
          roles: account.roles,
        },
        locale,
        logger,
        subscribeT,
      );
      if (!subscribed.success) {
        logger.error("Signup: newsletter opt-in could not be subscribed", {
          userId: account.id,
          error: subscribed.message,
        });
        return;
      }
      logger.debug("Signup: newsletter opt-in subscribed", {
        userId: account.id,
        subscriptionId: subscribed.data.subscriptionId,
        creditBonus: subscribed.data.creditBonus,
      });
    } catch (error) {
      logger.error("Signup: newsletter opt-in failed", {
        userId: account.id,
        error: parseError(error).message,
      });
    }
  }

  /** Client subnet key (IPv4 /24, IPv6 /64) from proxy headers, or null */
  private static requestSubnet(
    request: NextRequest | undefined,
  ): string | null {
    const ip =
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request?.headers.get("x-real-ip")?.trim();
    return ipSubnetKey(ip);
  }

  /**
   * Internal helper: Check if email (or an alias of it) is already registered
   * @param email - Email to check
   * @param logger - Logger instance
   * @returns The existing account's email when taken (exact or alias), else null
   */
  private static async checkEmailAvailabilityInternal(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string | null>> {
    try {
      const existing = await findUserByNormalizedEmail(email, null);
      if (existing) {
        logger.debug("Email taken (normalized match)", {
          normalized: normalizeEmailForUniqueness(email),
        });
      }
      return success(existing ? existing.email : null);
    } catch (error) {
      logger.error("Error checking email registration", parseError(error));
      const { t: checkErrT } = signupScopedTranslation.scopedT(locale);
      return fail({
        message: checkErrT("emailCheck.errors.internal.title", {
          error: parseError(error).message,
          email,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Handle lead conversion when user signs up
   * @param email - User email
   * @param leadId - Lead ID from tracking if available
   * @param userId - Created user ID
   * @param logger - Logger instance
   */
  private static async handleLeadConversion(
    email: string,
    leadId: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Converting lead during user signup", {
        leadId,
        email,
        userId,
      });

      // Convert lead with both email (for anonymous leads) and userId (for user relationship)
      const { t: leadsT } = leadsScopedTranslation.scopedT(locale);
      const { LeadsRepository } =
        await import("next-vibe/identity/lead/repository");
      const convertResult = await LeadsRepository.convertLead(
        leadId,
        { email, userId },
        logger,
        leadsT,
      );

      if (convertResult.success) {
        logger.debug("Lead conversion completed successfully", {
          leadId,
          email,
          userId,
          convertedLead: convertResult.data,
        });
      } else {
        logger.error("Lead conversion failed", {
          leadId,
          email,
          userId,
          error: convertResult.message,
          errorType: convertResult.errorType,
        });
      }
    } catch (error) {
      // Don't fail user registration if lead conversion fails
      logger.error("Lead conversion failed", {
        email,
        userId,
        leadId,
        error: parseError(error).message,
      });
    }
  }
}
