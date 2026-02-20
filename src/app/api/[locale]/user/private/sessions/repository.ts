/**
 * Session Management Repository
 * Allows users to list, create named sessions, and revoke sessions by ID.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { sessions } from "../session/db";
import type { SessionDeleteResponseOutput } from "./[id]/definition";
import type {
  SessionsGetResponseOutput,
  SessionsPostResponseOutput,
} from "./definition";

export class SessionManagementRepository {
  /**
   * List all active sessions for the authenticated user.
   * Never returns the token value itself.
   */
  static async list(
    user: JwtPrivatePayloadType,
    currentToken: string | undefined,
    logger: EndpointLogger,
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
          createdAt: row.createdAt.toISOString(),
          expiresAt: row.expiresAt.toISOString(),
          isCurrentSession: !!currentToken && row.token === currentToken,
        })),
      });
    } catch (error) {
      logger.error("Failed to list sessions", parseError(error));
      return fail({
        message: "app.api.user.private.sessions.create.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Create a named session token for the authenticated user.
   * Returns the raw JWT once — not stored elsewhere.
   */
  static async create(
    user: JwtPrivatePayloadType,
    name: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SessionsPostResponseOutput>> {
    try {
      const payload: JwtPrivatePayloadType = {
        isPublic: false,
        id: user.id,
        leadId: user.leadId,
        roles: [UserPermissionRole.CUSTOMER],
      };

      const tokenResult = await AuthRepository.signJwt(payload, logger);
      if (!tokenResult.success) {
        return tokenResult;
      }

      const token = tokenResult.data;
      // 90-day expiry (same as AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS)
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

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
        message: "app.api.user.private.sessions.create.response.message",
      });
    } catch (error) {
      logger.error("Failed to create named session", parseError(error));
      return fail({
        message: "app.api.user.private.sessions.create.errors.server.title",
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
  ): Promise<ResponseType<SessionDeleteResponseOutput>> {
    try {
      const deleted = await db
        .delete(sessions)
        .where(and(eq(sessions.id, sessionId), eq(sessions.userId, user.id)))
        .returning({ id: sessions.id });

      if (deleted.length === 0) {
        return fail({
          message: "app.api.user.private.sessions.revoke.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { sessionId },
        });
      }

      logger.info("Session revoked", { userId: user.id, sessionId });

      return success({
        message: "app.api.user.private.sessions.revoke.response.message",
      });
    } catch (error) {
      logger.error("Failed to revoke session", parseError(error));
      return fail({
        message: "app.api.user.private.sessions.create.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
