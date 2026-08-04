/**
 * Session repository implementation
 * Manages user sessions
 */

import "server-only";

import { eq } from "drizzle-orm";
import { cookies } from "next-vibe/ui/lib/headers";

import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import type { NewSession, Session } from "./db";
import { sessions } from "./db";
import type { SessionT } from "./i18n";
import { scopedTranslation } from "./i18n";

interface CurrentSessionResult {
  userId: string;
  expiresAt: Date;
  token: string;
}

import { SessionErrorReason } from "./enum";

/**
 * Session repository implementation
 */
export class SessionRepository {
  /**
   * Find a session by token
   * @param token - The session token
   * @returns Session or error response
   */
  static async findByToken(
    token: string,
    t: SessionT,
  ): Promise<ResponseType<Session>> {
    try {
      // First, try to find the session in the database
      // This handles both regular sessions and JWT tokens stored during login
      const results = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, token));

      if (results.length > 0) {
        return success(results[0]);
      }

      // Token not found in database and not a JWT

      return fail({
        message: t("errors.session_not_found", { token }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    } catch (error) {
      // Note: Logger not available for internal session methods

      return fail({
        message: t("errors.session_lookup_failed", {
          token,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * Extend an existing session's expiration time
   * @param token - The session token
   * @param newExpiresAt - The new expiration date
   * @returns Success or error response
   */
  static async extendSession(
    token: string,
    newExpiresAt: Date,
    t: SessionT,
  ): Promise<ResponseType<void>> {
    try {
      // Note: Logger not available for internal session methods

      const result = await db
        .update(sessions)
        .set({ expiresAt: newExpiresAt })
        .where(eq(sessions.token, token))
        .returning();

      if (result.length === 0) {
        return fail({
          message: t("errors.session_not_found", { token }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Session extended successfully

      return success();
    } catch (error) {
      // Note: Logger not available for internal session methods

      return fail({
        message: t("errors.session_lookup_failed", {
          token,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * Create a new session
   * @param data - The session data
   * @returns Created session or error response
   */
  static async create(
    data: NewSession,
    locale: CountryLanguage,
  ): Promise<ResponseType<Session>> {
    try {
      // Note: Logger not available for internal session methods

      const results = await db.insert(sessions).values(data).returning();

      if (results.length === 0) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.session_creation_failed", {
            userId: data.userId,
          }),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
        });
      }

      return success(results[0]);
    } catch (error) {
      // Note: Logger not available for internal session methods
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.session_creation_database_error", {
          userId: data.userId,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * Delete a single session by its ID
   * @param sessionId - The session ID
   * @returns Success or error response
   */
  static async deleteById(
    sessionId: string,
    t: SessionT,
  ): Promise<ResponseType<void>> {
    try {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      return success();
    } catch (error) {
      return fail({
        // The param was named userId but always held a session id.
        message: t("errors.user_sessions_delete_failed", {
          sessionId,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * Get the current session from cookies
   * @returns Session data if valid, error if not
   */
  static async getCurrentSession(
    t: SessionT,
  ): Promise<ResponseType<CurrentSessionResult>> {
    try {
      // Get the current session token from cookies
      const cookiesStore = await cookies();
      const token = cookiesStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

      if (!token) {
        // session_not_found now reports a token; there is none here, so this
        // case gets its own key carrying the reason instead.
        return fail({
          message: t("errors.session_token_missing", {
            // The enum value is itself a translation key, so resolve it.
            reason: t(SessionErrorReason.NO_TOKEN_IN_COOKIES),
          }),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Find the current session
      const sessionResponse = await SessionRepository.findByToken(token, t);
      if (!sessionResponse.success) {
        return sessionResponse;
      }

      const session = sessionResponse.data;
      const now = new Date();

      // Check if session is expired
      if (session.expiresAt <= now) {
        return fail({
          message: t("errors.expired", {
            expiresAt: session.expiresAt.toISOString(),
          }),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      return success({
        userId: session.userId,
        expiresAt: session.expiresAt,
        token,
      });
    } catch (error) {
      // Note: Logger not available for internal session methods

      // No token in scope here, so session_lookup_failed (which reports one)
      // does not fit; this path gets its own key.
      return fail({
        message: t("errors.current_session_failed", {
          error: error instanceof Error ? error.message : String(error),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
