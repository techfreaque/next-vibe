/**
 * CLI User Factory
 * Consolidated CLI user creation logic
 * Eliminates 5+ duplicate implementations across the codebase
 */

import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Default CLI user configuration
 */
const DEFAULT_CLI_USER_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Get CLI user email from environment or use default
 */
export function getCliUserEmail(): string {
  return env.VIBE_CLI_USER_EMAIL ?? DEFAULT_CLI_USER_ID;
}

/**
 * Create a default CLI user payload
 * Used as fallback when database user doesn't exist (e.g., before seeds)
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
 * Create a CLI user from database user data
 */
export function createCliUserFromDb(
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
 * Get CLI user from database with fallback to default
 * This is the main function to use for CLI authentication
 *
 * @param logger - Logger instance for debugging
 * @param locale - Locale for database queries
 * @returns CLI user payload
 */
export async function getCliUser(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>> {
  try {
    const cliUserEmail = getCliUserEmail();

    logger.debug("Getting CLI user from database", { email: cliUserEmail });

    const userResponse = await userRepository.getUserByEmail(
      cliUserEmail,
      UserDetailLevel.COMPLETE,
      locale,
      logger,
    );

    if (userResponse.success && userResponse.data) {
      const user = userResponse.data;

      logger.debug("CLI user found in database", {
        id: user.id,
        email: user.email,
      });

      return createCliUserFromDb(user.id, user.leadId ?? undefined);
    }

    // Fallback to default CLI user when database user doesn't exist
    logger.debug("CLI user not found in database, using default CLI user", {
      email: cliUserEmail,
    });

    return createDefaultCliUser();
  } catch (error) {
    // Fallback to default CLI user on any error
    logger.debug("Error getting CLI user from database, using default", {
      error: error instanceof Error ? error.message : String(error),
    });

    return createDefaultCliUser();
  }
}

/**
 * Get CLI user synchronously (for contexts where async is not available)
 * Returns default CLI user immediately
 *
 * @returns Default CLI user payload
 */
export function getCliUserSync(): InferJwtPayloadTypeFromRoles<
  readonly UserRoleValue[]
> {
  return createDefaultCliUser();
}

/**
 * Check if a command needs database access
 * Some commands (like seed, typecheck, lint) should use fallback auth
 *
 * @param command - Command string to check
 * @returns True if command needs fallback authentication
 */
export function needsFallbackAuth(command: string): boolean {
  const noDbCommands = [
    "seed",
    "typecheck",
    "tc",
    "lint",
    "l",
    "check",
    "c",
    "vibe-check",
  ] as const;

  return noDbCommands.some((cmd) => command.includes(cmd));
}

/**
 * Get CLI user with smart fallback based on command
 * Uses fallback auth for commands that don't need database
 *
 * @param command - Command being executed
 * @param logger - Logger instance
 * @param locale - Locale for database queries
 * @returns CLI user payload
 */
export async function getCliUserForCommand(
  command: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>> {
  if (needsFallbackAuth(command)) {
    logger.debug("Using fallback CLI authentication for command", { command });
    return createDefaultCliUser();
  }

  return await getCliUser(logger, locale);
}
