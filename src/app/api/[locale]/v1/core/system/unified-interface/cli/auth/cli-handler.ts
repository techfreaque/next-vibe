import { jwtVerify, SignJWT } from "jose";
import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/config/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/types";
import { createPublicUser } from "@/app/api/[locale]/v1/core/user/auth/helpers";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  type AuthContext,
  BaseAuthHandler,
  type SessionData,
} from "../../shared/server-only/auth/base-auth-handler";
import {
  deleteSessionFile,
  readSessionFile,
  writeSessionFile,
} from "./session-file";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

/**
 * CLI/MCP Authentication Handler
 *
 * Authentication strategy:
 * 1. Check for existing JWT token in Authorization header or .vibe.session file
 * 2. If no token found, check VIBE_CLI_USER_EMAIL environment variable
 * 3. If VIBE_CLI_USER_EMAIL is set, authenticate user by email from database
 * 4. If VIBE_CLI_USER_EMAIL is not set, fall back to public user with lead ID
 * 5. Store JWT in .vibe.session file for authenticated users
 */
export class CliAuthHandler extends BaseAuthHandler {
  private secretKey: Uint8Array;

  constructor() {
    super();
    this.secretKey = new TextEncoder().encode(env.JWT_SECRET_KEY);
  }

  /**
   * Authenticate user for CLI/MCP platforms
   */
  async authenticate(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPayloadType>> {
    try {
      logger.debug("CLI/MCP authentication started", {
        platform: context.platform,
        hasToken: !!context.token,
        hasJwtPayload: !!context.jwtPayload,
        hasRequest: !!context.request,
      });

      // If JWT payload provided directly, use it
      if (context.jwtPayload) {
        if (context.jwtPayload.isPublic) {
          return fail({
            message:
              "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.publicPayloadNotSupported",
            errorType: ErrorResponseTypes.UNAUTHORIZED,
          });
        }
        return success(context.jwtPayload);
      }

      // Check Authorization header first
      let token: string | undefined;
      if (context.request) {
        const authHeader = context.request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.substring(7); // Remove "Bearer " prefix
          logger.debug("Found auth token in Authorization header");
          const verifyResult = await this.verifyToken(token, logger);
          if (verifyResult.success) {
            return success(verifyResult.data);
          }
        }
      }

      // Fall back to session file if no Authorization header
      const sessionResult = await readSessionFile(logger);
      if (sessionResult.success) {
        logger.debug("Found auth token in session file");
        const verifyResult = await this.verifyToken(
          sessionResult.data.token,
          logger,
        );
        if (verifyResult.success) {
          return success(verifyResult.data);
        }
      }

      // Try to authenticate with VIBE_CLI_USER_EMAIL
      const cliUserEmail = this.getCliUserEmail();
      if (cliUserEmail) {
        const userResult = await this.authenticateByEmail(
          cliUserEmail,
          context.locale,
          logger,
        );
        if (userResult.success) {
          return success(userResult.data);
        }
      }

      // Fall back to public user
      const leadId = await authRepository.getLeadIdFromDb(
        undefined,
        context.locale,
        logger,
      );
      return success(createPublicUser(leadId || ""));
    } catch (error) {
      logger.error("CLI/MCP authentication failed", parseError(error));
      const leadId = await authRepository.getLeadIdFromDb(
        undefined,
        context.locale,
        logger,
      );
      return success(createPublicUser(leadId || ""));
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug("Verifying JWT token");

      const { payload } = await jwtVerify(token, this.secretKey);

      // Validate payload structure
      if (
        !payload.id ||
        typeof payload.id !== "string" ||
        !payload.leadId ||
        typeof payload.leadId !== "string"
      ) {
        return fail({
          message:
            "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.invalidTokenPayload",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      return success({
        isPublic: false,
        id: payload.id,
        leadId: payload.leadId,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("JWT verification failed", parsedError);
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.invalidToken",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Sign JWT token
   */
  async signToken(
    payload: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Signing JWT token", { userId: payload.id });

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS}s`)
        .sign(this.secretKey);

      return success(token);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("JWT signing failed", parsedError);
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.signingFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Validate session
   */
  async validateSession(
    token: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    const verifyResult = await this.verifyToken(token, logger);
    if (!verifyResult.success) {
      return null;
    }

    if (verifyResult.data.id !== userId) {
      logger.error("Token user ID mismatch", {
        tokenUserId: verifyResult.data.id,
        expectedUserId: userId,
      });
      return null;
    }

    return verifyResult.data;
  }

  /**
   * Store authentication token in .vibe.session file
   */
  async storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    const expiresAt = new Date(
      Date.now() + AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS * 1000,
    );

    const sessionData: SessionData = {
      token,
      userId,
      leadId,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    return await writeSessionFile(sessionData, logger);
  }

  /**
   * Clear authentication token by deleting .vibe.session file
   */
  async clearAuthToken(logger: EndpointLogger): Promise<ResponseType<void>> {
    return await deleteSessionFile(logger);
  }

  /**
   * Get stored authentication token from .vibe.session file
   */
  async getStoredAuthToken(
    logger: EndpointLogger,
  ): Promise<string | undefined> {
    const sessionResult = await readSessionFile(logger);
    if (sessionResult.success) {
      return sessionResult.data.token;
    }
    return undefined;
  }

  /**
   * Get CLI user email from environment
   */
  private getCliUserEmail(): string | null {
    return env.VIBE_CLI_USER_EMAIL || null;
  }

  /**
   * Authenticate user by email
   * Delegates to authRepository for business logic
   */
  private async authenticateByEmail(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // Import dynamically to avoid circular dependencies
    const { authRepository } =
      await import("@/app/api/[locale]/v1/core/user/auth/repository");
    return authRepository.authenticateUserByEmail(email, locale, logger);
  }
}

/**
 * Singleton instance
 */
export const cliAuthHandler = new CliAuthHandler();
