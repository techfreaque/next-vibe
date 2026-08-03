import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  type AuthContext,
  BaseAuthHandler,
} from "../../../identity/auth/base-auth-handler";
import type { EndpointLogger } from "../../../logger/types";

import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/env/constants";

import {
  deleteSessionFile,
  readSessionFile,
  writeSessionFile,
} from "./session-file";

/**
 * CLI/MCP Authentication Handler
 * Handles platform-specific storage for CLI/MCP via .vibe.session file.
 * All authentication business logic is in AuthRepository.
 */
export class CliAuthHandler extends BaseAuthHandler {
  /**
   * Get authentication token from CLI/MCP storage.
   * Checks: Authorization header → .vibe.session file
   */
  async getStoredAuthToken(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<string | undefined> {
    if (context.request) {
      const authHeader = context.request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        logger.debug("Found auth token in Authorization header");
        return authHeader.slice(7);
      }
    }

    const sessionResult = await readSessionFile(logger, context.locale);
    if (sessionResult.success) {
      logger.debug("Found auth token in session file");
      return sessionResult.data.token;
    }

    return undefined;
  }

  /**
   * Store authentication token in .vibe.session file.
   */
  async storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const expiresAt = new Date(
      Date.now() + AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS * 1000,
    );

    return writeSessionFile(
      {
        token,
        userId,
        leadId,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      },
      logger,
      locale,
    );
  }

  /**
   * Clear authentication token by deleting .vibe.session file.
   */
  async clearAuthToken(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    return deleteSessionFile(logger, locale);
  }
}

export const cliAuthHandler = new CliAuthHandler();
