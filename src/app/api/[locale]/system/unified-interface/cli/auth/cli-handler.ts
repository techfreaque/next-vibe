import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "../../shared/logger/endpoint";
import {
  type AuthContext,
  BaseAuthHandler,
  type SessionData,
} from "../../shared/server-only/auth/base-auth-handler";
import { deleteSessionFile, readSessionFile, writeSessionFile } from "./session-file";

/**
 * CLI/MCP Authentication Handler
 * Handles platform-specific storage for CLI/MCP (session files)
 * All authentication business logic is in AuthRepository
 */
export class CliAuthHandler extends BaseAuthHandler {
  /**
   * Get authentication token from CLI/MCP storage
   * Checks: Authorization header → .vibe.session file
   */
  async getStoredAuthToken(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Request not used in CLI auth
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<string | undefined> {
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
   * @param rememberMe - If true, session lasts 30 days; if false, 7 days
   */
  async storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
    rememberMe = true, // Default to true (30 days)
  ): Promise<ResponseType<void>> {
    // Set session duration based on rememberMe flag
    // Remember me: 30 days, Regular session: 7 days
    const sessionDurationDays = rememberMe ? 30 : 7;
    const sessionDurationSeconds = sessionDurationDays * 24 * 60 * 60;

    const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);

    const sessionData: SessionData = {
      token,
      userId,
      leadId,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    logger.debug("Storing CLI session", {
      userId,
      leadId,
      rememberMe,
      sessionType: rememberMe ? "persistent (30 days)" : "regular (7 days)",
    });
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
