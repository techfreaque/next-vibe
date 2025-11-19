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
 * Get CLI user from database by email - STRICT mode
 * If VIBE_CLI_USER_EMAIL is not set, returns public user
 * If email is set but user doesn't exist, returns error
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
  const cliUserEmail = getCliUserEmail();

  // If VIBE_CLI_USER_EMAIL is not set, return public user
  if (!cliUserEmail) {
    logger.debug("CLI user email not configured, using public user", {
      envVar: "VIBE_CLI_USER_EMAIL",
    });

    return {
      success: true,
      data: createPublicCliUser(),
    };
  }

  logger.debug("Getting CLI user from database", { email: cliUserEmail });

  try {
    // Delegate to authRepository for business logic
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

    // User not found in database - this is an error
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
