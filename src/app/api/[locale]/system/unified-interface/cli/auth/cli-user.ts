/**
 * CLI User Factory
 * Consolidated CLI user creation logic
 * Eliminates 5+ duplicate implementations across the codebase
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserPermissionRole, type UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { cliEnv } from "../env";

/**
 * Default CLI user configuration
 */
const DEFAULT_CLI_USER_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Get CLI user email from environment
 * Returns null if VIBE_CLI_USER_EMAIL is not set
 */
export function getCliUserEmail(): string | null {
  return cliEnv.VIBE_CLI_USER_EMAIL ?? null;
}

/**
 * Create a default CLI user payload for auth bypass scenarios
 * Used for commands that don't require authenticated user (e.g., seed, dev)
 */
export function createDefaultCliUser(): InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> {
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
export function createPublicCliUser(): InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> {
  return {
    isPublic: true,
    leadId: DEFAULT_CLI_USER_ID,
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
): Promise<ResponseType<InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>>> {
  logger.debug(
    `[CLI AUTH] Starting authentication flow (locale: ${locale}, cwd: ${process.cwd()}, env: ${process.env.NODE_ENV})`,
  );

  // Step 1: Session verification removed - AuthRepository deleted

  // Step 2: Check VIBE_CLI_USER_EMAIL environment variable
  logger.debug("[CLI AUTH] Step 2: Checking VIBE_CLI_USER_EMAIL environment variable");
  const cliUserEmail = getCliUserEmail();

  logger.debug(
    `[CLI AUTH] VIBE_CLI_USER_EMAIL result (hasEmail: ${!!cliUserEmail}, email: ${cliUserEmail ? `${cliUserEmail.slice(0, 3)}***` : "null"}, envVarExists: ${"VIBE_CLI_USER_EMAIL" in process.env})`,
  );

  // Step 3: If VIBE_CLI_USER_EMAIL is not set, return public user
  if (!cliUserEmail) {
    logger.debug("[CLI AUTH] Step 3: CLI user email not configured, creating public user");

    // Minimal checker package: use default ID without lead creation
    logger.debug("Using default CLI user (minimal checker package)");
    return {
      success: true,
      data: {
        isPublic: true,
        leadId: DEFAULT_CLI_USER_ID,
      } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    };
  }

  // Step 4: Email authentication removed - AuthRepository deleted
  return {
    success: false,
    message: "app.api.system.unifiedInterface.cli.auth.errors.authNotAvailable",
    errorType: ErrorResponseTypes.UNAUTHORIZED,
  };
}
