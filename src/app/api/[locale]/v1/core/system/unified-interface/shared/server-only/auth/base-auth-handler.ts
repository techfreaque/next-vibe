import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../types/logger";

/**
 * Platform types for authentication
 */
export type AuthPlatform =
  | "next"
  | "trpc"
  | "cli"
  | "ai"
  | "mcp"
  | "web"
  | "mobile";

/**
 * Authentication context passed to platform handlers
 */
export interface AuthContext {
  platform: AuthPlatform;
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
   * Shared across all platforms
   */
  abstract verifyToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>>;

  /**
   * Sign JWT token
   * Shared across all platforms
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
   * Get lead ID from database
   * Shared across all platforms
   */
  abstract getLeadIdFromDb(
    userId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string | null>;

  /**
   * Get primary lead ID for user
   * Shared across all platforms
   */
  abstract getPrimaryLeadId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string | null>;

  /**
   * Get all lead IDs for user
   * Shared across all platforms
   */
  abstract getAllLeadIds(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string[]>;

  /**
   * Helper: Check if user has required roles
   */
  protected hasRequiredRoles(
    userRoles: string[],
    requiredRoles: readonly (typeof UserRoleValue)[],
  ): boolean {
    if (requiredRoles.includes("PUBLIC")) {
      return true;
    }
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  /**
   * Helper: Create public user payload
   */
  protected createPublicUser(leadId: string): JwtPayloadType {
    if (!leadId) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth infrastructure helper throws for invalid state
      throw new Error("leadId from DB required for public user");
    }
    return {
      leadId,
      isPublic: true,
    };
  }

  /**
   * Helper: Create private user payload
   */
  protected createPrivateUser(
    userId: string,
    leadId: string,
  ): JwtPrivatePayloadType {
    if (!leadId) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth infrastructure helper throws for invalid state
      throw new Error("leadId from DB required for private user");
    }
    if (!userId) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth infrastructure helper throws for invalid state
      throw new Error("userId required for private user");
    }
    return {
      id: userId,
      leadId,
      isPublic: false,
    };
  }

  /**
   * Helper: Validate user has lead ID
   */
  protected async validateUserLeadId(
    userId: string,
    leadId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    if (leadId) {
      return leadId;
    }
    logger.error("User missing leadId from DB", { userId });
    const dbLeadId = await this.getLeadIdFromDb(userId, locale, logger);
    if (!dbLeadId) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth infrastructure helper throws for failed lead ID retrieval
      throw new Error(`Failed to get or create lead ID for user ${userId}`);
    }
    return dbLeadId;
  }
}
