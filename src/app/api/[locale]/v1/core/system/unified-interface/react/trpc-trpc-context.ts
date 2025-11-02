/**
 * tRPC Context System
 * Provides context for tRPC procedures including authentication, locale, and request metadata
 * Integrates with existing next-vibe authentication and locale systems
 */
import { TRPCError } from "@trpc/server";
import type { NextRequest } from "next/server";
import { validateData } from "next-vibe/shared/utils";
import { z } from "zod";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/leads/types";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type {
  CountryLanguage,
  CountryLanguageValues,
} from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import { createEndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { InferJwtPayloadTypeFromRoles } from "./trpc-types";

/**
 * tRPC Context Interface
 * Contains all the data needed for tRPC procedures to work with existing next-vibe systems
 */
export interface TRPCContext<
  TUrlParams,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> {
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue> | null;

  /** Current locale extracted from URL */
  locale: CountryLanguage;

  /** Translation function for the current locale */
  t: TFunction;

  /** Original Next.js request object */
  request: NextRequest;

  /** URL parameters extracted from the request path */
  urlPathParams: TUrlParams;

  /** User roles for authorization (empty array if not authenticated) */
  userRoles: TUserRoleValue;

  /** Endpoint logger for this request */
  logger: EndpointLogger;
}

/**
 * Create tRPC context from Next.js request
 * Extracts locale from URL path, authenticates user, and sets up translation
 */
export async function createTRPCContext<
  TUrlParams,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
>(opts: {
  req: NextRequest;
  urlPathParams?: TUrlParams;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<TRPCContext<TUrlParams, TUserRoleValue>> {
  const { req, urlPathParams = {} } = opts;

  // Extract locale from URL path
  // Expected format: /api/[locale]/trpc/[...trpc]
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);

  // Find locale in path (should be after 'api')
  const apiIndex = pathSegments.indexOf("api");
  const localeSegment =
    apiIndex >= 0 && apiIndex + 1 < pathSegments.length
      ? pathSegments[apiIndex + 1]
      : defaultLocale;

  // Validate and set locale
  const localeValidation = validateData(
    localeSegment as keyof typeof CountryLanguageValues,
    z.string(),
    opts.logger,
  );
  const locale = localeValidation.success
    ? localeValidation.data
    : defaultLocale;

  // Get translation function for locale
  const { t } = simpleT(opts.locale);

  opts.logger.debug(`tRPC context created for locale: ${locale}`, {
    url: req.url,
    pathSegments,
    extractedLocale: localeSegment,
    validatedLocale: locale,
  });

  // Authenticate user using the existing auth system
  // Use getAuthMinimalUser which properly handles PUBLIC role with leadId creation
  let user: JwtPayloadType;
  let userRoles: TUserRoleValue = [] as never as TUserRoleValue;

  try {
    // Try to get authenticated user first
    const authResult = await authRepository.getCurrentUser(
      { platform: "trpc", request: req, locale: opts.locale },
      opts.logger,
    );

    if (authResult.success && authResult.data) {
      // User is authenticated
      user = authResult.data;

      // Get user roles if authenticated
      if (!user.isPublic && user.id) {
        // Check for customer role
        const authenticatedUser = await authRepository.getAuthMinimalUser(
          [UserRole.CUSTOMER],
          { platform: "trpc", request: req, locale: opts.locale },
          opts.logger,
        );
        if (authenticatedUser && !authenticatedUser.isPublic) {
          userRoles = [UserRole.CUSTOMER] as never as TUserRoleValue;

          // Check for admin role
          const adminUser = await authRepository.getAuthMinimalUser(
            [UserRole.ADMIN],
            { platform: "trpc", request: req, locale: opts.locale },
            opts.logger,
          );
          if (adminUser && !adminUser.isPublic) {
            (userRoles as unknown as Array<typeof UserRoleValue>).push(UserRole.ADMIN);
          }
        }
      }
    } else {
      // Authentication failed - get public user with proper leadId
      user = await authRepository.getAuthMinimalUser(
        [UserRole.PUBLIC],
        { platform: "trpc", request: req, locale: opts.locale },
        opts.logger,
      );
      userRoles = [UserRole.PUBLIC] as never as TUserRoleValue;
    }
  } catch (error) {
    // Authentication failed - get public user with proper leadId
    opts.logger.error("tRPC context: Authentication failed", {
      error: parseError(error),
    });
    user = await authRepository.getAuthMinimalUser(
      [UserRole.PUBLIC],
      { platform: "trpc", request: req, locale: opts.locale },
      opts.logger,
    );
    userRoles = [UserRole.PUBLIC] as never as TUserRoleValue;
  }

  return {
    user: user as InferJwtPayloadTypeFromRoles<TUserRoleValue>,
    locale: locale as CountryLanguage,
    t,
    request: req,
    urlPathParams: urlPathParams as TUrlParams,
    userRoles: userRoles as never as TUserRoleValue,
    logger: opts.logger,
  };
}

/**
 * Create authenticated tRPC context
 * Throws an error if user is not authenticated
 */
export async function createAuthenticatedTRPCContext(opts: {
  req: NextRequest;
  urlPathParams?: Record<string, string>;
  requiredRoles?: readonly (typeof UserRoleValue)[];
  locale: CountryLanguage;
}): Promise<
  TRPCContext<Record<string, string>, readonly (typeof UserRoleValue)[]> & {
    user: JwtPayloadType;
  }
> {
  const logger = createEndpointLogger(false, Date.now(), opts.locale);
  const context = await createTRPCContext({
    ...opts,
    logger,
    locale: opts.locale,
  });

  if (!context.user) {
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- tRPC framework requires throwing TRPCError for authentication failures
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "app.error.unauthorized",
    });
  }

  // Check roles if specified
  if (opts.requiredRoles && opts.requiredRoles.length > 0) {
    const hasRequiredRole = opts.requiredRoles.some((role) =>
      context.userRoles.includes(role),
    );

    if (!hasRequiredRole) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- tRPC framework requires throwing TRPCError for authorization failures
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "error.forbidden",
      });
    }
  }

  return {
    ...context,
    user: context.user,
  };
}

/**
 * Helper to extract URL parameters from tRPC path
 * Handles dynamic routes like /users/[id] by mapping them to the actual values
 */
export function extractUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};

  // This is a simplified implementation
  // In practice, you might need more sophisticated path matching
  // based on your actual route structure

  return params;
}
