/**
 * Signup Repository
 * Handles user registration and email checking with EndpointLogger pattern
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { hashPassword } from "next-vibe/identity/auth/password";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { scopedTranslation as leadsScopedTranslation } from "next-vibe/identity/lead/i18n";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { UserRolesRepository } from "next-vibe/identity/roles/repository";
import { SessionRepository } from "next-vibe/identity/session/repository";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";
import type { NextRequest } from "next-vibe/ui/lib/request";

import { recordAntiFarmingEvent } from "@/credits/anti-farming/events";
import { ipSubnetKey } from "@/credits/anti-farming/ip";
import { signupSubnetLimitHit } from "@/credits/anti-farming/signup-limit";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/env/constants";

import { safeCallbackPath } from "../login/callback-url";
import { sendSignupChallenge } from "./confirmation-mail";
import { type PendingSignup, pendingSignups } from "./db";
import type {
  SignupPatchRequestOutput,
  SignupPatchResponseOutput,
  SignupPostRequestOutput,
  SignupPostResponseOutput,
} from "./definition";
import { signupDomainStatus } from "./disposable-mx";
import { findUserByNormalizedEmail } from "./email-guard";
import {
  emailDomain,
  isDisposableEmail,
  normalizeEmailForUniqueness,
} from "./email-identity";
import type { SignupT } from "./i18n";
import { scopedTranslation as signupScopedTranslation } from "./i18n";
import {
  consumeSignupChallenge,
  issueSignupChallenge,
  pendingStatus,
} from "./pending";

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
    deliver = sendSignupChallenge,
    checkDomain = signupDomainStatus,
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

      logger.debug("Starting signup", { email, platform });

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

      const checked = await SignupRepository.validateAddress(
        email,
        locale,
        logger,
        t,
        request,
        checkDomain,
      );
      if (!checked.success) {
        return checked;
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

      // Per-subnet signup rate limit (scripted account farms on one network)
      const limitedSubnet = await signupSubnetLimitHit(
        SignupRepository.requestIp(request),
      );
      if (limitedSubnet) {
        logger.info("Signup blocked: subnet signup limit", {
          subnet: limitedSubnet,
          emailDomain: emailDomain(email),
        });
        await recordAntiFarmingEvent(
          {
            kind: "subnet_signup_limit",
            emailDomain: emailDomain(email),
            subnet: limitedSubnet,
          },
          logger,
        );
        return fail({
          message: t("errors.subnetSignupLimit.detail"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const issued = await issueSignupChallenge(
        {
          email,
          privateName,
          publicName,
          passwordHash: await hashPassword(password),
          subscribeToNewsletter,
          referralCode: trimmedReferralCode,
          leadId: user.leadId,
          supportedSkillId: data.supportedSkillId,
          localFavorites: data.localFavorites,
          signupIp: SignupRepository.requestIp(request),
          locale,
          callbackUrl: safeCallbackPath(data.callbackUrl),
        },
        null,
        SignupRepository.requestIp(request),
        logger,
        t,
        deliver,
      );
      if (!issued.success) {
        return issued;
      }
      return success({
        pendingId: issued.data.id,
        message: pendingStatus(issued.data, t).message,
      });
    } catch (error) {
      logger.error("Pending signup failed", {
        errorType: parseError(error).name,
      });
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async validateAddress(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: SignupT,
    request: NextRequest | undefined,
    checkDomain = signupDomainStatus,
  ): Promise<ResponseType<void>> {
    // Throwaway inboxes never get an account (free-credit farming).
    // Listed domains first, then the MX host (rotating temp-mail domains).
    const disposableByDomain = isDisposableEmail(email);
    const domain = emailDomain(email);
    const status = disposableByDomain
      ? "disposable"
      : domain
        ? await checkDomain(domain)
        : "undeliverable";
    if (status === "disposable") {
      logger.info("Signup blocked: disposable email", {
        emailDomain: emailDomain(email),
        by: disposableByDomain ? "domain" : "mx",
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

    if (status === "undeliverable") {
      return fail({
        message: t("confirmation.domain"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    return success();
  }

  static async confirmation(
    data: SignupPatchRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    platform: Platform,
    t: SignupT,
    request: NextRequest | undefined,
    deliver = sendSignupChallenge,
  ): Promise<ResponseType<SignupPatchResponseOutput>> {
    try {
      if (data.token || data.code) {
        const claim = await consumeSignupChallenge(data, user.leadId, t);
        if (!claim.success) {
          logger.warn("Signup confirmation challenge rejected", {
            challengeType: data.token ? "link" : "code",
            hasPendingId: Boolean(data.pendingId),
            errorKey: claim.errorType.errorKey,
            status: claim.errorType.errorCode,
          });
          return claim;
        }
        return await SignupRepository.finishSignup(
          claim.data.pending,
          claim.data.userId,
          logger,
          platform,
          t,
        );
      }
      if (!data.pendingId) {
        logger.warn(
          "Signup confirmation requested without a pending signup id",
          {
            resend: Boolean(data.resend),
            changeEmail: Boolean(data.newEmail),
          },
        );
        return fail({
          message: t("confirmation.expired"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const [row] = await db
        .select()
        .from(pendingSignups)
        .where(
          and(
            eq(pendingSignups.id, data.pendingId),
            eq(pendingSignups.leadId, user.leadId),
          ),
        );
      if (!row) {
        // Check only existence so diagnostics distinguish a stale signup from
        // a browser whose lead changed. Preserve the same public response.
        const existing = await db
          .select({ id: pendingSignups.id })
          .from(pendingSignups)
          .where(eq(pendingSignups.id, data.pendingId))
          .limit(1)
          .catch(() => null);
        logger.warn("Signup confirmation has no pending signup for this lead", {
          resend: Boolean(data.resend),
          changeEmail: Boolean(data.newEmail),
          pendingLookup:
            existing === null
              ? "diagnostic-unavailable"
              : existing.length > 0
                ? "different-lead"
                : "missing-pending-row",
        });
        return fail({
          message: t("confirmation.expired"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!data.newEmail && !data.resend) {
        return success(pendingStatus(row, t));
      }
      if (data.newEmail && data.newEmail !== row.email) {
        const checked = await SignupRepository.validateAddress(
          data.newEmail,
          locale,
          logger,
          t,
          request,
        );
        if (!checked.success) {
          return checked;
        }
      }
      const issued = await issueSignupChallenge(
        { ...row, email: data.newEmail ?? row.email },
        row,
        SignupRepository.requestIp(request),
        logger,
        t,
        deliver,
      );
      return issued.success ? success(pendingStatus(issued.data, t)) : issued;
    } catch (error) {
      logger.error("Signup confirmation failed", {
        errorType: parseError(error).name,
      });
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async finishSignup(
    data: PendingSignup,
    userId: string,
    logger: EndpointLogger,
    platform: Platform,
    t: SignupT,
  ): Promise<ResponseType<SignupPatchResponseOutput>> {
    const {
      email,
      leadId,
      locale,
      subscribeToNewsletter,
      referralCode: trimmedReferralCode,
    } = data;
    await SignupRepository.handleLeadConversion(
      email,
      leadId,
      userId,
      locale,
      logger,
    );
    const { LeadAuthRepository } =
      await import("next-vibe/identity/lead/device-auth");

    // A guest who already confirmed the uncensored-model consent keeps it.
    const { UncensoredConsentRepository } =
      await import("next-vibe/agent/models/uncensored-consent/repository");
    await UncensoredConsentRepository.carryLeadConsentToUser(
      leadId,
      userId,
      logger,
    );

    // Growth funnel: the user inherits the lead's first/last-touch attribution
    const { GrowthJourneyRepository } =
      await import("@/leads/growth/repository");
    await GrowthJourneyRepository.attachUser(leadId, userId, logger);

    // Link referral code if provided manually in form
    const { ReferralRepository } = await import("../../../referral/repository");
    if (trimmedReferralCode) {
      logger.debug("Linking manual referral code to lead", {
        referralCode: trimmedReferralCode,
        leadId: leadId,
      });
      const referralLink = await ReferralRepository.linkReferralToLead(
        leadId,
        trimmedReferralCode,
        logger,
        locale,
      );
      if (!referralLink.success) {
        // Code was valid moments ago — this is an infrastructure failure.
        logger.error("Failed to link referral code during signup", {
          userId: userId,
          leadId: leadId,
          referralCode: trimmedReferralCode,
          error: referralLink.message,
        });
      }
    }

    // Resolve skillCreatorUserId from lead.skillId (if it's a UUID → look up customSkills owner)
    let skillCreatorUserId: string | null = null;
    try {
      const { db: dbInstance } = await import("next-vibe/database");
      const { leads: leadsTable } = await import("next-vibe/identity/lead/db");
      const { eq: eqFn } = await import("drizzle-orm");
      const [leadRow] = await dbInstance
        .select({ skillId: leadsTable.skillId })
        .from(leadsTable)
        .where(eqFn(leadsTable.id, leadId))
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
      userId,
      leadId,
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
      leadId,
      logger,
    );
    // The account and its lead link have committed together. The pool derives
    // from those links on every balance read if this eager merge fails.
    const mergeLeadIds = [leadId, ...linkedLeadIds];
    let mergeResult = await CreditRepository.mergePendingLeadWallets(
      userId,
      mergeLeadIds,
      logger,
      creditsT,
      locale,
    );
    if (!mergeResult.success) {
      mergeResult = await CreditRepository.mergePendingLeadWallets(
        userId,
        mergeLeadIds,
        logger,
        creditsT,
        locale,
      );
    }
    if (!mergeResult.success) {
      logger.error("Failed to merge lead wallets during signup", {
        userId: userId,
        leadId: leadId,
        leadIds: mergeLeadIds,
        error: mergeResult.message,
      });
    }

    // Get primary leadId for user
    const leadIdResult = await LeadAuthRepository.getAuthenticatedUserLeadId(
      userId,
      leadId,
      locale,
      logger,
    );

    // Fetch user roles from DB to include in JWT
    const rolesResult = await UserRolesRepository.getUserRoles(
      userId,
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
          userId: userId,
        },
      );
    }

    if (subscribeToNewsletter) {
      await SignupRepository.subscribeToNewsletterAtSignup(
        email,
        { id: userId, leadId: leadIdResult.leadId, roles },
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
          id: userId,
          isPublic: false as const,
          roles,
          leadId: leadIdResult.leadId,
        };
        const { isCompanionSkillId } =
          await import("next-vibe/agent/skills/favorites/default-companion");
        const { parseSkillId } = await import("next-vibe/agent/chat/slugify");
        // Sequential, companions first (stable sort keeps the guest's order
        // otherwise): createFavorite adds the default companion on a
        // non-companion favorite only when no companion is stored yet, so a
        // migrated set without one gets it exactly once and a set with one
        // never gets a duplicate.
        const orderedFavorites = data.localFavorites.toSorted(
          (a, b) =>
            Number(!isCompanionSkillId(parseSkillId(a.skillId).skillId)) -
            Number(!isCompanionSkillId(parseSkillId(b.skillId).skillId)),
        );
        for (const fav of orderedFavorites) {
          await FavoritesCreateRepository.createFavorite(
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
          );
        }
        logger.debug("Local favorites migrated", {
          userId: userId,
          count: data.localFavorites.length,
        });
      } catch (favErr) {
        // Never block signup due to favorites migration failure
        logger.warn("Failed to migrate local favorites during signup", {
          userId: userId,
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
          userId: userId,
          error: String(skillErr),
        });
      }
    }

    // Create JWT payload with roles
    const tokenPayload: JwtPrivatePayloadType = {
      id: userId,
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
        userId: userId,
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
        userId: userId,
        token: tokenResponse.data,
        expiresAt,
      };
      const sessionResult = await SessionRepository.create(sessionData, locale);
      if (!sessionResult.success) {
        logger.error("Failed to create session after signup", {
          userId: userId,
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
        userId,
        leadIdResult.leadId,
        platform,
        logger,
        locale,
      );
      if (!storeResult.success) {
        logger.error("Error storing auth token after signup", {
          userId: userId,
          error: storeResult.message,
        });
        return fail({
          message: t("errors.autoLoginFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: storeResult,
        });
      }
      logger.debug("Auth token stored successfully after signup", {
        userId: userId,
      });
    }

    return success({
      message: t("confirmation.done"),
      address: email,
      redirectTo: safeCallbackPath(data.callbackUrl) ?? `/${locale}`,
    });
  }

  /**
   * Apply the saved newsletter opt-in to the address just confirmed.
   * Its credit allowance uses the existing verified subscription rules.
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
      const { NewsletterConfirmRepository } =
        await import("@/newsletter/confirm/repository");
      await NewsletterConfirmRepository.confirmForVerifiedAccount(
        { userId: account.id, email, linkIssuedAt: new Date() },
        logger,
      );
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
  private static requestIp(request: NextRequest | undefined): string | null {
    return (
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request?.headers.get("x-real-ip")?.trim() ||
      null
    );
  }

  private static requestSubnet(
    request: NextRequest | undefined,
  ): string | null {
    return ipSubnetKey(SignupRepository.requestIp(request));
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
        { email, userId, completeSignup: true },
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
