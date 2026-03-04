import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../shared/logger/endpoint";
import {
  type AuthContext,
  BaseAuthHandler,
} from "../../shared/server-only/auth/base-auth-handler";
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
   * @param rememberMe - 30 days if true, 7 days if false
   */
  async storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    rememberMe = true,
  ): Promise<ResponseType<void>> {
    const sessionDurationDays = rememberMe ? 30 : 7;
    const expiresAt = new Date(
      Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000,
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
