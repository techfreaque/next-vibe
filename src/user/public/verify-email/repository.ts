/**
 * Verify-email repository.
 * - token present: verify (public, idempotent) and flip users.emailVerified
 * - no token: resend request for the logged-in user (the mail is sent by the
 *   route's email template; this only reports state)
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import type {
  VerifyEmailPostRequestOutput,
  VerifyEmailPostResponseOutput,
} from "./definition";
import type { VerifyEmailT } from "./i18n";
import { isValidVerificationToken, peekTokenUserId } from "./token";

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
      })
      .from(users)
      .where(eq(users.id, claimedId))
      .limit(1);
    if (!row || !isValidVerificationToken(token, row.id, row.email)) {
      return invalid();
    }
    if (!row.verified) {
      await db
        .update(users)
        .set({ emailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, row.id));
      logger.debug("Email verified", { userId: row.id });
    }
    return success({
      verified: true,
      email: row.email,
      message: row.verified
        ? t("success.alreadyVerified")
        : t("success.verified"),
    });
  }
}
