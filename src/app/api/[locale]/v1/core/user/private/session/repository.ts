/**
 * Session repository implementation
 * Manages user sessions
 */

import "server-only";

import { eq, lt, or } from "drizzle-orm";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME } from "next-vibe/shared/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import { createDefaultCliUser } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/auth/cli-user-factory";

import type { NewSession, Session } from "./db";
import { sessions } from "./db";
import { SessionErrorReason } from "./enum";

/**
 * Session repository interface
 */
export interface SessionRepository {
  /**
   * Find a session by token
   * @param token - The session token
   * @returns Session or error response
   */
  findByToken(token: string): Promise<ResponseType<Session>>;

  /**
   * Create a new session
   * @param data - The session data
   * @returns Created session or error response
   */
  create(data: NewSession): Promise<ResponseType<Session>>;

  /**
   * Extend an existing session's expiration time
   * @param token - The session token
   * @param newExpiresAt - The new expiration date
   * @returns Success or error response
   */
  extendSession(token: string, newExpiresAt: Date): Promise<ResponseType<void>>;

  /**
   * Delete expired sessions
   * @returns Success or error response
   */
  deleteExpired(): Promise<ResponseType<void>>;

  /**
   * Delete sessions by user ID
   * @param userId - The user ID
   * @returns Success or error response
   */
  deleteByUserId(userId: DbId): Promise<ResponseType<void>>;

  /**
   * Get the current session from cookies
   * @returns Session data if valid, error if not
   */
  getCurrentSession(): Promise<
    ResponseType<{ userId: string; expiresAt: Date; token: string }>
  >;
}

/**
 * Session repository implementation
 */
export class SessionRepositoryImpl implements SessionRepository {
  /**
   * Find a session by token
   * @param token - The session token
   * @returns Session or error response
   */
  async findByToken(token: string): Promise<ResponseType<Session>> {
    try {
      // Note: Logger not available for internal session methods

      // Handle CLI tokens - they don't need session validation
      // CLI tokens are JWTs that are self-contained and don't require database sessions
      if (token?.startsWith("eyJ")) {
        // This looks like a JWT token (starts with eyJ which is base64 for {"alg")
        // For CLI operations, we create a mock session that never expires
        const defaultCliUser = createDefaultCliUser();
        const mockSession: Session = {
          id: "cli-session-id",
          userId: defaultCliUser.id ?? "cli-user-id",
          token: token,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          createdAt: new Date(),
        };
        return createSuccessResponse(mockSession);
      }

      const results = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, token));

      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.user.private.session.errors.session_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { token },
        );
      }

      return createSuccessResponse(results[0]);
    } catch (error) {
      // Note: Logger not available for internal session methods
      return createErrorResponse(
        "app.api.v1.core.user.private.session.errors.session_lookup_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          token,
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Delete expired sessions
   * @returns Success or error response
   */
  async deleteExpired(): Promise<ResponseType<void>> {
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

      return createSuccessResponse(undefined);
    } catch (error) {
      // Note: Logger not available for internal cleanup methods
      return createErrorResponse(
        "app.api.v1.core.user.private.session.errors.expired_sessions_delete_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Extend an existing session's expiration time
   * @param token - The session token
   * @param newExpiresAt - The new expiration date
   * @returns Success or error response
   */
  async extendSession(
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
        return createErrorResponse(
          "app.api.v1.core.user.private.session.errors.session_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { token },
        );
      }

      // Session extended successfully

      return createSuccessResponse(undefined);
    } catch (error) {
      // Note: Logger not available for internal session methods
      return createErrorResponse(
        "app.api.v1.core.user.private.session.errors.session_lookup_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          token,
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Create a new session
   * @param data - The session data
   * @returns Created session or error response
   */
  async create(data: NewSession): Promise<ResponseType<Session>> {
    try {
      // Note: Logger not available for internal session methods

      const results = await db.insert(sessions).values(data).returning();

      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.user.private.session.errors.session_creation_failed",
          ErrorResponseTypes.DATABASE_ERROR,
          { userId: data.userId, operation: "create" },
        );
      }

      return createSuccessResponse(results[0]);
    } catch (error) {
      // Note: Logger not available for internal session methods
      return createErrorResponse(
        "app.api.v1.core.user.private.session.errors.session_creation_database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          userId: data.userId,
          operation: "create",
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Delete sessions by user ID
   * @param userId - The user ID
   * @returns Success or error response
   */
  async deleteByUserId(userId: DbId): Promise<ResponseType<void>> {
    try {
      // Note: Logger not available for internal session methods

      await db.delete(sessions).where(eq(sessions.userId, userId));

      return createSuccessResponse(undefined);
    } catch (error) {
      // Note: Logger not available for internal session methods
      return createErrorResponse(
        "app.api.v1.core.user.private.session.errors.user_sessions_delete_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          userId,
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Get the current session from cookies
   * @returns Session data if valid, error if not
   */
  async getCurrentSession(): Promise<
    ResponseType<{ userId: string; expiresAt: Date; token: string }>
  > {
    try {
      // Get the current session token from cookies
      const cookiesStore = await cookies();
      const token = cookiesStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

      if (!token) {
        return createErrorResponse(
          "app.api.v1.core.user.private.session.errors.session_not_found",
          ErrorResponseTypes.UNAUTHORIZED,
          { reason: SessionErrorReason.NO_TOKEN_IN_COOKIES },
        );
      }

      // Find the current session
      const sessionResponse = await this.findByToken(token);
      if (!sessionResponse.success) {
        return sessionResponse;
      }

      const session = sessionResponse.data;
      const now = new Date();

      // Check if session is expired
      if (session.expiresAt <= now) {
        return createErrorResponse(
          "app.api.v1.core.user.private.session.errors.expired",
          ErrorResponseTypes.UNAUTHORIZED,
          { expiresAt: session.expiresAt.toISOString() },
        );
      }

      return createSuccessResponse({
        userId: session.userId,
        expiresAt: session.expiresAt,
        token,
      });
    } catch (error) {
      // Note: Logger not available for internal session methods
      return createErrorResponse(
        "app.api.v1.core.user.private.session.errors.session_lookup_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: error instanceof Error ? error.message : String(error) },
      );
    }
  }
}

// Export singleton instance of the repository
export const sessionRepository = new SessionRepositoryImpl();
