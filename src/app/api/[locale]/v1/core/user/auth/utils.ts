/**
 * Auth Utilities
 * Helper functions for authentication in server components
 */
import "server-only";

import { redirect } from "next/navigation";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CompleteUserType } from "../definition";
import { UserDetailLevel } from "../enum";
import { userRepository } from "../repository";
import { UserRole } from "../user-roles/enum";
import { authRepository } from "./repository";

/**
 * Require an authenticated admin user
 * Redirects to login if not authenticated or not an admin
 */
export async function requireAdminUser(
  locale: CountryLanguage,
  redirectPath?: string,
): Promise<CompleteUserType> {
  const logger = createEndpointLogger(false, Date.now(), locale);

  try {
    // Check authentication and role
    const minimalUser = await authRepository.getAuthMinimalUser<
      [typeof UserRole.ADMIN]
    >([UserRole.ADMIN], { platform: "next", locale }, logger);

    // Check if user is public (not authenticated)
    if (minimalUser.isPublic) {
      redirect(
        `/${locale}/login?redirect=${encodeURIComponent(redirectPath || `/${locale}/admin`)}`,
      );
    }

    // Fetch complete user details
    const userResult = await userRepository.getUserById(
      minimalUser.id,
      UserDetailLevel.COMPLETE,
      logger,
    );

    if (!userResult.success) {
      redirect(
        `/${locale}/login?redirect=${encodeURIComponent(redirectPath || `/${locale}/admin`)}`,
      );
    }

    return userResult.data;
  } catch (error) {
    logger.error("Error in requireAdminUser", error);
    redirect(
      `/${locale}/login?redirect=${encodeURIComponent(redirectPath || `/${locale}/admin`)}`,
    );
  }
}

/**
 * Require an authenticated user (any role)
 * Redirects to login if not authenticated
 */
export async function requireUser(
  locale: CountryLanguage,
  redirectPath?: string,
): Promise<CompleteUserType> {
  const logger = createEndpointLogger(false, Date.now(), locale);

  try {
    // Check authentication (any authenticated user)
    const minimalUser = await authRepository.getAuthMinimalUser<[]>(
      [],
      { platform: "next", locale },
      logger,
    );

    // Check if user is public (not authenticated)
    if (minimalUser.isPublic) {
      redirect(
        `/${locale}/login?redirect=${encodeURIComponent(redirectPath || `/${locale}`)}`,
      );
    }

    // Fetch complete user details
    const userResult = await userRepository.getUserById(
      minimalUser.id,
      UserDetailLevel.COMPLETE,
      logger,
    );

    if (!userResult.success) {
      redirect(
        `/${locale}/login?redirect=${encodeURIComponent(redirectPath || `/${locale}`)}`,
      );
    }

    return userResult.data;
  } catch (error) {
    logger.error("Error in requireUser", error);
    redirect(
      `/${locale}/login?redirect=${encodeURIComponent(redirectPath || `/${locale}`)}`,
    );
  }
}
