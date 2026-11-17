/**
 * Verify-email repository.
 * - token present: verify (public, idempotent) and flip users.emailVerified,
 *   or, for an email-change link, swap the pending address in
 * - no token: resend request for the logged-in user (the mail is sent by the
 *   route's email template; this only reports state)
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { findUserByNormalizedEmail } from "../signup/email-guard";
import type {
  VerifyEmailPostRequestOutput,
  VerifyEmailPostResponseOutput,
} from "./definition";
import type { VerifyEmailT } from "./i18n";
import {
  getTokenIssuedAt,
  isValidVerificationToken,
  peekTokenUserId,
} from "./token";

export class VerifyEmailRepository {
  static async handle(
    data: VerifyEmailPostRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VerifyEmailT,
  ): Promise<ResponseType<VerifyEmailPostResponseOutput>> {
    try {
      if (data.token) {
        return await VerifyEmailRepository.verify(data.token, logger, t);
      }
      if (user.isPublic) {
        return fail({
          message: t("errors.needLogin"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const [row] = await db
        .select({ email: users.email, verified: users.emailVerified })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      if (!row) {
        return fail({
          message: t("errors.userNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      return success({
        verified: row.verified,
        email: row.email,
        message: row.verified
          ? t("success.alreadyVerified")
          : t("success.sent"),
      });
    } catch (error) {
      logger.error("Email verification failed", parseError(error));
      return fail({
        message: t("errors.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async verify(
    token: string,
    logger: EndpointLogger,
    t: VerifyEmailT,
  ): Promise<ResponseType<VerifyEmailPostResponseOutput>> {
    const claimedId = peekTokenUserId(token);
    const invalid = (): ResponseType<VerifyEmailPostResponseOutput> =>
      fail({
        message: t("errors.invalidToken"),
        errorType: ErrorResponseTypes.INVALID_TOKEN_ERROR,
      });
    if (!claimedId || !/^[0-9a-f-]{36}$/i.test(claimedId)) {
      return invalid();
    }
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        verified: users.emailVerified,
        pendingEmail: users.pendingEmail,
      })
      .from(users)
      .where(eq(users.id, claimedId))
      .limit(1);
    if (!row) {
      return invalid();
    }
    if (!isValidVerificationToken(token, row.id, row.email)) {
      const { pendingEmail } = row;
      if (
        pendingEmail &&
        isValidVerificationToken(
          token,
          row.id,
          pendingEmail,
          Date.now(),
          "email-change",
        )
      ) {
        return await VerifyEmailRepository.completeEmailChange(
          { id: row.id, oldEmail: row.email, newEmail: pendingEmail },
          logger,
          t,
        );
      }
      return invalid();
    }
    if (!row.verified) {
      await db
        .update(users)
        .set({ emailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, row.id));
      logger.debug("Email verified", { userId: row.id });
    }
    // Newsletter ticked at signup: this link is its double opt-in too
    const linkIssuedAt = getTokenIssuedAt(token);
    if (linkIssuedAt) {
      const { NewsletterConfirmRepository } =
        await import("@/newsletter/confirm/repository");
      await NewsletterConfirmRepository.confirmForVerifiedAccount(
        { userId: row.id, email: row.email, linkIssuedAt },
        logger,
      );
    }
    return success({
      verified: true,
      email: row.email,
      message: row.verified
        ? t("success.alreadyVerified")
        : t("success.verified"),
    });
  }

  /**
   * The link mailed to the pending address was clicked: that inbox is proven,
   * so it becomes the account email (verified). The address is re-checked:
   * another account may have claimed it since the change was requested.
   */
  static async completeEmailChange(
    change: { id: string; oldEmail: string; newEmail: string },
    logger: EndpointLogger,
    t: VerifyEmailT,
  ): Promise<ResponseType<VerifyEmailPostResponseOutput>> {
    const { id, oldEmail, newEmail } = change;
    if (await findUserByNormalizedEmail(newEmail, id)) {
      await db
        .update(users)
        .set({ pendingEmail: null, updatedAt: new Date() })
        .where(eq(users.id, id));
      logger.info("Email change dropped: address taken meanwhile", {
        userId: id,
      });
      return fail({
        message: t("errors.emailTaken"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    const updated = await db
      .update(users)
      .set({
        email: newEmail,
        pendingEmail: null,
        emailVerified: true,
        updatedAt: new Date(),
      })
      // Only while this exact change is still the pending one
      .where(and(eq(users.id, id), eq(users.pendingEmail, newEmail)))
      .returning({ id: users.id });
    if (updated.length === 0) {
      return fail({
        message: t("errors.invalidToken"),
        errorType: ErrorResponseTypes.INVALID_TOKEN_ERROR,
      });
    }
    // Move the account's own lead that carries the old address. A lead row
    // that already owns the new one (leads_email_unique) wins; non-fatal.
    await db
      .update(leads)
      .set({ email: newEmail, updatedAt: new Date() })
      .where(
        and(
          eq(leads.email, oldEmail),
          inArray(
            leads.id,
            db
              .select({ id: userLeadLinks.leadId })
              .from(userLeadLinks)
              .where(eq(userLeadLinks.userId, id)),
          ),
        ),
      )
      .catch((leadUpdateErr) => {
        const msg = parseError(leadUpdateErr).message;
        if (msg.includes("leads_email_unique")) {
          logger.warn("Lead email update skipped: address owned by a lead", {
            userId: id,
          });
        } else {
          logger.error("Failed to cascade email change to lead", {
            userId: id,
            error: msg,
          });
        }
      });
    logger.info("Email change completed", { userId: id });
    return success({
      verified: true,
      emailChanged: true,
      email: newEmail,
      message: t("success.emailChanged", { email: newEmail }),
    });
  }
}
