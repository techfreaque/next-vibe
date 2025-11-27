/**
 * CLI User Factory
 * Consolidated CLI user creation logic
 * Eliminates 5+ duplicate implementations across the codebase
 */

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Default CLI user configuration
 */
const DEFAULT_CLI_USER_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Get CLI user email from environment
 * Returns null if VIBE_CLI_USER_EMAIL is not set
 */
export function getCliUserEmail(): string | null {
  return env.VIBE_CLI_USER_EMAIL ?? null;
}

/**
 * Create a default CLI user payload for auth bypass scenarios
 * Used for commands that don't require authenticated user (e.g., seed, dev)
 */
export function createDefaultCliUser(): InferJwtPayloadTypeFromRoles<
  readonly UserRoleValue[]
> {
  return {
    isPublic: false,
    id: DEFAULT_CLI_USER_ID,
    leadId: DEFAULT_CLI_USER_ID,
  } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
}

/**
 * Create a public CLI user payload
 * Used when VIBE_CLI_USER_EMAIL is not configured
 */
export function createPublicCliUser(): InferJwtPayloadTypeFromRoles<
  readonly UserRoleValue[]
> {
  return {
    isPublic: true,
    leadId: DEFAULT_CLI_USER_ID,
  } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
}

/**
 * Create a CLI user from database user data
 */
function createCliUserFromDb(
  userId: string,
  leadId?: string | null,
): InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> {
  return {
    isPublic: false,
    id: userId,
    leadId: leadId || userId,
  } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
}

/**
 * Create a mock user for testing/development
 * Used in tasks, generators, and other system operations
 */
export function createMockUser(): {
  id: string;
  leadId: string;
  isPublic: false;
} {
  return {
    id: DEFAULT_CLI_USER_ID,
    leadId: DEFAULT_CLI_USER_ID,
    isPublic: false,
  };
}

/**
 * Get CLI user with proper authentication flow:
 * 1. Check for session user (from .vibe.session file)
 * 2. Check VIBE_CLI_USER_EMAIL from .env and authenticate from DB
 * 3. If VIBE_CLI_USER_EMAIL is empty → return public user
 * 4. If email is set but not found in DB → return error
 *
 * @param logger - Logger instance for debugging
 * @param locale - Locale for database queries
 * @returns ResponseType with CLI user payload or error
 */
export async function getCliUser(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<
  ResponseType<InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>>
> {
  // Step 1: Check for existing session from .vibe.session file
  try {
    const { readSessionFile } = await import("./session-file");
    const sessionResult = await readSessionFile(logger);

    if (sessionResult.success && sessionResult.data) {
      logger.debug("Found existing CLI session", {
        userId: sessionResult.data.userId,
        leadId: sessionResult.data.leadId,
      });

      // Verify the token is still valid
      const { authRepository } = await import("@/app/api/[locale]/v1/core/user/auth/repository");
      const verifyResult = await authRepository.verifyJwt(sessionResult.data.token, logger);

      if (verifyResult.success && verifyResult.data) {
        logger.debug("Session token is valid, using session user");
        return {
          success: true,
          data: createCliUserFromDb(verifyResult.data.id, verifyResult.data.leadId),
        };
      } else {
        logger.debug("Session token is invalid or expired, falling back to email auth");
      }
    }
  } catch (error) {
    logger.debug("No valid session found, falling back to email auth", {
      error: parseError(error).message,
    });
  }

  // Step 2: Check VIBE_CLI_USER_EMAIL environment variable
  const cliUserEmail = getCliUserEmail();

  // Step 3: If VIBE_CLI_USER_EMAIL is not set, return public user
  if (!cliUserEmail) {
    logger.debug("CLI user email not configured, using public user", {
      envVar: "VIBE_CLI_USER_EMAIL",
    });

    // Create a public user with a new lead directly from database
    // We can't use getLeadIdFromDb() here because it tries to access cookies
    try {
      const { getLanguageAndCountryFromLocale } = await import("@/i18n/core/language-utils");
      const { language, country } = getLanguageAndCountryFromLocale(locale);
      const { db } = await import("@/app/api/[locale]/v1/core/system/db");
      const { leads } = await import("@/app/api/[locale]/v1/core/leads/db");
      const { LeadStatus, LeadSource } = await import("@/app/api/[locale]/v1/core/leads/enum");

      const [newLead] = await db
        .insert(leads)
        .values({
          email: null,
          businessName: "",
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
          country,
          language,
        })
        .returning();

      logger.debug("Created public lead for CLI", { leadId: newLead.id });

      return {
        success: true,
        data: {
          isPublic: true,
          leadId: newLead.id,
        } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
      };
    } catch (error) {
      logger.error("Failed to create public lead for CLI", {
        error: parseError(error).message,
      });

      // Fallback to default ID if database fails
      return {
        success: true,
        data: {
          isPublic: true,
          leadId: DEFAULT_CLI_USER_ID,
        } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
      };
    }
  }

  // Step 4: Email is set, authenticate from database
  logger.debug("Getting CLI user from database", { email: cliUserEmail });

  try {
    const { authRepository } =
      await import("@/app/api/[locale]/v1/core/user/auth/repository");

    const authResult = await authRepository.authenticateUserByEmail(
      cliUserEmail,
      locale,
      logger,
    );

    if (authResult.success && authResult.data) {
      const user = authResult.data;

      logger.debug("CLI user found in database", {
        id: user.id,
        leadId: user.leadId,
      });

      return {
        success: true,
        data: createCliUserFromDb(user.id, user.leadId),
      };
    }

    // User not found in database - this is an ERROR
    logger.error("CLI user not found in database", {
      email: cliUserEmail,
    });

    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedInterface.cli.auth.errors.userNotFound",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
      messageParams: {
        email: cliUserEmail,
      },
    };
  } catch (error) {
    // Database error
    logger.error("Error getting CLI user from database", {
      error: parseError(error).message,
      email: cliUserEmail,
    });

    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedInterface.cli.auth.errors.databaseError",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parseError(error).message,
      },
    };
  }
}
