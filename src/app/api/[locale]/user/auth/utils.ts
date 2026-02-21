/**
 * Auth Utilities
 * Helper functions for authentication in server components
 */
import "server-only";

import { parseError } from "next-vibe/shared/utils";
import { redirect } from "next-vibe-ui/lib/redirect";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserDetailLevel } from "../enum";
import { UserRepository } from "../repository";
import type { CompleteUserType } from "../types";
import { UserRole } from "../user-roles/enum";
import { AuthRepository } from "./repository";
import type { JwtPrivatePayloadType } from "./types";

/**
 * Require an authenticated admin user
 * Redirects to login if not authenticated or not an admin
 */
export async function requireAdminUser(
  locale: CountryLanguage,
  redirectPath?: string,
): Promise<JwtPrivatePayloadType> {
  const logger = createEndpointLogger(false, Date.now(), locale);

  try {
    // Check authentication and role
    const minimalUser = await AuthRepository.getAuthMinimalUser<
      [typeof UserRole.ADMIN]
    >([UserRole.ADMIN], { platform: Platform.NEXT_PAGE, locale }, logger);

    // Check if user is public (not authenticated)
    if (minimalUser.isPublic) {
      redirect(
        `/${locale}/user/login?callbackUrl=${encodeURIComponent(redirectPath || `/${locale}/admin`)}`,
      );
    }

    return minimalUser;
  } catch (error) {
    logger.error("Error in requireAdminUser", parseError(error));
    redirect(`/${locale}}`);
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
    const minimalUser = await AuthRepository.getAuthMinimalUser<[]>(
      [],
      { platform: Platform.NEXT_PAGE, locale },
      logger,
    );

    // Check if user is public (not authenticated)
    if (minimalUser.isPublic || !minimalUser.id) {
      redirect(
        `/${locale}/user/login?callbackUrl=${encodeURIComponent(redirectPath || `/${locale}`)}`,
      );
    }

    // Fetch complete user details
    const userResult = await UserRepository.getUserById(
      minimalUser.id ?? "",
      UserDetailLevel.COMPLETE,
      locale,
      logger,
    );

    if (!userResult.success) {
      redirect(
        `/${locale}/user/login?callbackUrl=${encodeURIComponent(redirectPath || `/${locale}`)}`,
      );
    }

    return userResult.data;
  } catch (error) {
    logger.error("Error in requireUser", parseError(error));
    redirect(
      `/${locale}/user/login?callbackUrl=${encodeURIComponent(redirectPath || `/${locale}`)}`,
    );
  }
}
