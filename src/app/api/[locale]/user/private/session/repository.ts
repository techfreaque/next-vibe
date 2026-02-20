/**
 * Session repository implementation
 * Manages user sessions
 */

import "server-only";

import { eq, lt, or } from "drizzle-orm";
import { cookies } from "next/headers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { DbId } from "@/app/api/[locale]/system/db/types";
import { AUTH_TOKEN_COOKIE_NAME } from "@/config/constants";

import type { NewSession, Session } from "./db";
import { sessions } from "./db";
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
  static async findByToken(token: string): Promise<ResponseType<Session>> {
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
        message: "app.api.user.private.session.errors.session_not_found",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { token },
      });
    } catch (error) {
      // Note: Logger not available for internal session methods
      return fail({
        message: "app.api.user.private.session.errors.session_lookup_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          token,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Delete expired sessions
   * @returns Success or error response
   */
  static async deleteExpired(): Promise<ResponseType<void>> {
    try {
      // Note: Logger not available for internal cleanup methods

      const now = new Date();
      await db.delete(sessions).where(
        or(
          eq(sessions.expiresAt, new Date(0)),
          // Use lt (less than) function instead of < operator
          lt(sessions.expiresAt, now),
        ),
      );

      return success();
    } catch (error) {
      // Note: Logger not available for internal cleanup methods
      return fail({
        message:
          "app.api.user.private.session.errors.expired_sessions_delete_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          error: parseError(error).message,
        },
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
          message: "app.api.user.private.session.errors.session_not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { token },
        });
      }

      // Session extended successfully

      return success();
    } catch (error) {
      // Note: Logger not available for internal session methods
      return fail({
        message: "app.api.user.private.session.errors.session_lookup_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          token,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Create a new session
   * @param data - The session data
   * @returns Created session or error response
   */
  static async create(data: NewSession): Promise<ResponseType<Session>> {
    try {
      // Note: Logger not available for internal session methods

      const results = await db.insert(sessions).values(data).returning();

      if (results.length === 0) {
        return fail({
          message:
            "app.api.user.private.session.errors.session_creation_failed",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { userId: data.userId, operation: "create" },
        });
      }

      return success(results[0]);
    } catch (error) {
      // Note: Logger not available for internal session methods
      return fail({
        message:
          "app.api.user.private.session.errors.session_creation_database_error",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          userId: data.userId,
          operation: "create",
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Delete sessions by user ID
   * @param userId - The user ID
   * @returns Success or error response
   */
  static async deleteByUserId(userId: DbId): Promise<ResponseType<void>> {
    try {
      // Note: Logger not available for internal session methods

      await db.delete(sessions).where(eq(sessions.userId, userId));

      return success();
    } catch (error) {
      // Note: Logger not available for internal session methods
      return fail({
        message:
          "app.api.user.private.session.errors.user_sessions_delete_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          userId,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Get the current session from cookies
   * @returns Session data if valid, error if not
   */
  static async getCurrentSession(): Promise<
    ResponseType<{ userId: string; expiresAt: Date; token: string }>
  > {
    try {
      // Get the current session token from cookies
      const cookiesStore = await cookies();
      const token = cookiesStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

      if (!token) {
        return fail({
          message: "app.api.user.private.session.errors.session_not_found",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: { reason: SessionErrorReason.NO_TOKEN_IN_COOKIES },
        });
      }

      // Find the current session
      const sessionResponse = await SessionRepository.findByToken(token);
      if (!sessionResponse.success) {
        return sessionResponse;
      }

      const session = sessionResponse.data;
      const now = new Date();

      // Check if session is expired
      if (session.expiresAt <= now) {
        return fail({
          message: "app.api.user.private.session.errors.expired",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: { expiresAt: session.expiresAt.toISOString() },
        });
      }

      return success({
        userId: session.userId,
        expiresAt: session.expiresAt,
        token,
      });
    } catch (error) {
      // Note: Logger not available for internal session methods
      return fail({
        message: "app.api.user.private.session.errors.session_lookup_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
}
