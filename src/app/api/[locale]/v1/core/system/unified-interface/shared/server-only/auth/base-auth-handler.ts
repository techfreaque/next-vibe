import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../logger/endpoint";
import type { Platform } from "../../types/platform";

/**
 * Platform types for authentication
 * @deprecated Use Platform enum from config instead
 */
export type AuthPlatform = Platform;

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
 * Authentication result
 */
export interface AuthResult<T extends JwtPayloadType = JwtPayloadType> {
  success: boolean;
  user: T;
  error?: string;
}

/**
 * Lead identifier for tracking
 */
export interface LeadIdentifier {
  leadId: string;
  userId?: string;
  isPublic: boolean;
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
 * All platform-specific auth handlers must extend this class
 *
 * Platform implementations:
 * - Web: Uses Next.js cookies for session storage
 * - CLI/MCP: Uses .vibe.session file for JWT storage
 * - Native: Uses AsyncStorage for session storage
 *
 * ARCHITECTURE NOTE:
 * This class should ONLY contain platform-specific infrastructure methods.
 * All business logic (user/lead management) has been moved to domain repositories:
 * - @/app/api/[locale]/v1/core/user/auth/helpers.ts
 * - @/app/api/[locale]/v1/core/user/auth/lead-manager.ts
 * - @/app/api/[locale]/v1/core/user/auth/validators.ts
 * - @/app/api/[locale]/v1/core/leads/auth/helpers.ts
 */
export abstract class BaseAuthHandler {
  /**
   * Authenticate user based on context
   * Each platform implements its own authentication logic
   */
  abstract authenticate(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPayloadType>>;

  /**
   * Verify JWT token
   * Platform-specific implementation (same JWT library, different storage)
   */
  abstract verifyToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>>;

  /**
   * Sign JWT token
   * Platform-specific implementation (same JWT library, different storage)
   */
  abstract signToken(
    payload: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Validate session (platform-specific)
   * Web: Validates against database sessions
   * CLI/MCP: Validates JWT and checks .vibe.session file
   * Native: Validates JWT and checks AsyncStorage
   */
  abstract validateSession(
    token: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null>;

  /**
   * Store authentication token (platform-specific)
   * Web: Sets HTTP-only cookies
   * CLI/MCP: Writes to .vibe.session file
   * Native: Writes to AsyncStorage
   */
  abstract storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  /**
   * Clear authentication token (platform-specific)
   * Web: Clears cookies
   * CLI/MCP: Deletes .vibe.session file
   * Native: Clears AsyncStorage
   */
  abstract clearAuthToken(logger: EndpointLogger): Promise<ResponseType<void>>;

  /**
   * Get stored authentication token (platform-specific)
   * Web: Reads from cookies
   * CLI/MCP: Reads from .vibe.session file
   * Native: Reads from AsyncStorage
   */
  abstract getStoredAuthToken(
    logger: EndpointLogger,
  ): Promise<string | undefined>;

  /**
   * Helper: Check if user has required roles
   * Pure utility function for role checking
   */
  protected hasRequiredRoles(
    userRoles: UserRoleValue[],
    requiredRoles: readonly UserRoleValue[],
  ): boolean {
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
