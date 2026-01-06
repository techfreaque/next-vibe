import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../logger/endpoint";
import type { Platform } from "../../types/platform";

/**
 * Authentication context passed to platform handlers
 */
export interface AuthContext {
  platform: Platform;
  token?: string;
  jwtPayload?: JwtPayloadType;
  locale: CountryLanguage;
}

/**
 * Session data structure for CLI/MCP platforms
 */
export interface SessionData {
  token: string;
  userId: string;
  leadId: string;
  expiresAt: string;
  createdAt: string;
}

/**
 * Base Authentication Handler
 * Platform-specific storage handlers ONLY
 *
 * ARCHITECTURE:
 * - Platform handlers: ONLY handle storage (cookies, session files, AsyncStorage)
 * - AuthRepository: Contains ALL authentication business logic
 *
 * Platform implementations:
 * - Web: Uses Next.js cookies for session storage
 * - CLI/MCP: Uses .vibe.session file for JWT storage
 * - Native: Uses AsyncStorage for session storage
 *
 * All business logic (user/lead management, token verification, authentication flows)
 * is in @/app/api/[locale]/user/auth/repository.ts
 */
export abstract class BaseAuthHandler {
  /**
   * Get authentication token from platform-specific storage
   * Web: Reads from cookies and Authorization header
   * CLI/MCP: Reads from .vibe.session file and Authorization header
   * Native: Reads from AsyncStorage
   */
  abstract getStoredAuthToken(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<string | undefined>;

  /**
   * Store authentication token in platform-specific storage
   * Web: Sets HTTP-only cookies
   * CLI/MCP: Writes to .vibe.session file
   * Native: Writes to AsyncStorage
   * @param rememberMe - If true, session cookie lasts 30 days; if false, session-only (browser session)
   */
  abstract storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
    rememberMe?: boolean,
  ): Promise<ResponseType<void>>;

  /**
   * Clear authentication token from platform-specific storage
   * Web: Clears cookies
   * CLI/MCP: Deletes .vibe.session file
   * Native: Clears AsyncStorage
   */
  abstract clearAuthToken(logger: EndpointLogger): Promise<ResponseType<void>>;
}
