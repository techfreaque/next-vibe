import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/config/constants";

import type { EndpointLogger } from "../../shared/logger/endpoint";
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

/**
 * CLI/MCP Authentication Handler
 * Handles platform-specific storage for CLI/MCP (session files)
 * All authentication business logic is in authRepository
 */
export class CliAuthHandler extends BaseAuthHandler {
  /**
   * Get authentication token from CLI/MCP storage
   * Checks: Authorization header → .vibe.session file
   */
  async getStoredAuthToken(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<string | undefined> {
    // Check Authorization header first
    if (context.request) {
      const authHeader = context.request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7); // Remove "Bearer " prefix
        logger.debug("Found auth token in Authorization header");
        return token;
      }
    }

    // Fall back to session file
    const sessionResult = await readSessionFile(logger);
    if (sessionResult.success) {
      logger.debug("Found auth token in session file");
      return sessionResult.data.token;
    }

    return undefined;
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
}

/**
 * Singleton instance
 */
export const cliAuthHandler = new CliAuthHandler();
