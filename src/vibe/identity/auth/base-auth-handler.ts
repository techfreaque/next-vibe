import "server-only";

import type { NextRequest } from "next-vibe/ui/lib/request";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import type { JwtPayloadType } from "./types";

/**
 * Authentication context passed to platform handlers
 */
export interface AuthContext {
  platform: Platform;
  request?: NextRequest;
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
 * is in next-vibe/identity/auth/repository.ts
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
   */
  abstract storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    rememberMe?: boolean,
  ): Promise<ResponseType<void>>;

  /**
   * Clear authentication token from platform-specific storage
   * Web: Clears cookies
   * CLI/MCP: Deletes .vibe.session file
   * Native: Clears AsyncStorage
   */
  abstract clearAuthToken(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>>;
}
