/**
 * Session Management Repository
 * Allows users to list, create named sessions, and revoke sessions by ID.
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
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sessions } from "next-vibe/identity/session/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/config/constants";

import type { SessionDeleteResponseOutput } from "./[id]/definition";
import type {
  SessionsGetResponseOutput,
  SessionsPostResponseOutput,
} from "./definition";
import type { PrivateSessionsT } from "./i18n";

export class SessionManagementRepository {
  private static async list(
    user: JwtPrivatePayloadType,
    currentToken: string | undefined,
    logger: EndpointLogger,
    t: PrivateSessionsT,
  ): Promise<ResponseType<SessionsGetResponseOutput>> {
    try {
      const rows = await db
        .select({
          id: sessions.id,
          name: sessions.name,
          createdAt: sessions.createdAt,
          expiresAt: sessions.expiresAt,
          token: sessions.token,
        })
        .from(sessions)
        .where(eq(sessions.userId, user.id));

      return success({
        sessions: rows.map((row) => ({
          id: row.id,
          name: row.name,
          createdAt: row.createdAt,
          expiresAt: row.expiresAt,
          isCurrentSession: !!currentToken && row.token === currentToken,
        })),
      });
    } catch (error) {
      logger.error("Failed to list sessions", parseError(error));
      return fail({
        message: t("create.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Create a named session token for the authenticated user.
   * Returns the raw JWT once - not stored elsewhere.
   */
  static async create(
    user: JwtPrivatePayloadType,
    name: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: PrivateSessionsT,
  ): Promise<ResponseType<SessionsPostResponseOutput>> {
    try {
      const payload: JwtPrivatePayloadType = {
        isPublic: false,
        id: user.id,
        leadId: user.leadId,
        roles: [UserPermissionRole.CUSTOMER],
      };

      const tokenResult = await AuthRepository.signJwt(payload, logger, locale);
      if (!tokenResult.success) {
        return tokenResult;
      }

      const token = tokenResult.data;
      const expiresAt = new Date(
        Date.now() + AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS * 1000,
      );

      const [row] = await db
        .insert(sessions)
        .values({ userId: user.id, token, name, expiresAt })
        .returning({ id: sessions.id });

      logger.info("Named session created", {
        userId: user.id,
        name,
        sessionId: row.id,
      });

      return success({
        token,
        id: row.id,
        sessionName: name,
        message: t("create.response.message"),
      });
    } catch (error) {
      logger.error("Failed to create named session", parseError(error));
      return fail({
        message: t("create.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Revoke a session by ID. Only the session owner can revoke it.
   */
  static async revoke(
    user: JwtPrivatePayloadType,
    sessionId: string,
    logger: EndpointLogger,
    t: PrivateSessionsT,
  ): Promise<ResponseType<SessionDeleteResponseOutput>> {
    try {
      const deleted = await db
        .delete(sessions)
        .where(and(eq(sessions.id, sessionId), eq(sessions.userId, user.id)))
        .returning({ id: sessions.id });

      if (deleted.length === 0) {
        return fail({
          message: t("revoke.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { sessionId },
        });
      }

      logger.info("Session revoked", { userId: user.id, sessionId });

      return success({
        message: t("revoke.response.message"),
      });
    } catch (error) {
      logger.error("Failed to revoke session", parseError(error));
      return fail({
        message: t("create.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Resolve current token from request headers or cookies, then list sessions.
   */
  static async listWithTokenResolution(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    request: Request | undefined,
    t: PrivateSessionsT,
  ): Promise<ResponseType<SessionsGetResponseOutput>> {
    const { cookies } = await import("next-vibe/ui/lib/headers");
    let currentToken: string | undefined;
    if (request) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        currentToken = authHeader.slice(7);
      }
    }
    if (!currentToken) {
      const { AUTH_TOKEN_COOKIE_NAME } = await import("@/config/constants");
      const cookieStore = await cookies();
      currentToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
    }
    return SessionManagementRepository.list(user, currentToken, logger, t);
  }
}
