/**
 * CLI User Factory
 * Consolidated CLI user creation logic
 * Eliminates 5+ duplicate implementations across the codebase
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  UserPermissionRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
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
  leadId: string,
  roles: UserRoleValue[],
): InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> {
  return {
    isPublic: false,
    id: userId,
    leadId,
    roles,
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
  roles: (typeof UserPermissionRole.ADMIN)[];
} {
  return {
    id: DEFAULT_CLI_USER_ID,
    leadId: DEFAULT_CLI_USER_ID,
    isPublic: false,
    roles: [UserPermissionRole.ADMIN],
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
): Promise<ResponseType<JwtPayloadType>> {
  // Step 1: Check for existing session from .vibe.session file
  try {
    const { readSessionFile } = await import("./session-file");
    const sessionResult = await readSessionFile(logger);

    if (sessionResult.success && sessionResult.data) {
      // Verify the token is still valid
      const { AuthRepository } =
        await import("@/app/api/[locale]/user/auth/repository");
      const verifyResult = await AuthRepository.verifyJwt(
        sessionResult.data.token,
        logger,
      );

      if (verifyResult.success && verifyResult.data) {
        return {
          success: true,
          data: createCliUserFromDb(
            verifyResult.data.id,
            verifyResult.data.leadId,
            verifyResult.data.roles,
          ),
        };
      }
    }
  } catch (error) {
    // Session check failed, continue to email auth
  }

  // Check VIBE_CLI_USER_EMAIL environment variable
  const cliUserEmail = getCliUserEmail();

  // If VIBE_CLI_USER_EMAIL is not set, return public user
  if (!cliUserEmail) {
    // Create a public user with a new lead directly from database
    // We can't use getLeadIdFromDb() here because it tries to access cookies
    try {
      const { getLanguageAndCountryFromLocale } =
        await import("@/i18n/core/language-utils");
      const { language, country } = getLanguageAndCountryFromLocale(locale);
      const { db } = await import("@/app/api/[locale]/system/db");
      const { leads } = await import("@/app/api/[locale]/leads/db");
      const { LeadStatus, LeadSource } =
        await import("@/app/api/[locale]/leads/enum");

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

      logger.debug(
        `[CLI AUTH] Created public lead for CLI (leadId: ${newLead.id})`,
      );

      return {
        success: true,
        data: {
          isPublic: true,
          leadId: newLead.id,
        } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
      };
    } catch (error) {
      logger.error(
        `[CLI AUTH] Failed to create public lead for CLI: ${parseError(error).message}`,
      );

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

  // Email is set, authenticate from database
  try {
    const { AuthRepository } =
      await import("@/app/api/[locale]/user/auth/repository");

    const authResult = await AuthRepository.authenticateUserByEmail(
      cliUserEmail,
      locale,
      logger,
    );

    if (authResult.success && authResult.data) {
      const user = authResult.data;
      return {
        success: true,
        data: createCliUserFromDb(user.id, user.leadId, user.roles),
      };
    }

    // User not found in database - this is expected for CLI_AUTH_BYPASS routes
    return {
      success: false,
      message: "app.api.system.unifiedInterface.cli.auth.errors.userNotFound",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
      messageParams: {
        email: cliUserEmail,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "app.api.system.unifiedInterface.cli.auth.errors.databaseError",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parseError(error).message,
      },
    };
  }
}
