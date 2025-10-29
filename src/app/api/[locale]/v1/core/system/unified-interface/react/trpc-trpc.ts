/**
 * tRPC Server Setup
 * Initializes tRPC with context and creates base procedures
 * Integrates with existing next-vibe authentication and error handling
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { ZodError } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { TRPCContext } from "./trpc-trpc-context";

/**
 * Initialize tRPC with context
 */
const t = initTRPC
  .context<
    TRPCContext<Record<string, string>, readonly (typeof UserRoleValue)[]>
  >()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.format() : null,
        },
      };
    },
  });

/**
 * Export router and procedure builders
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Base procedure - no authentication required
 * Can be used for public endpoints
 */
export const publicProcedure = t.procedure;

/**
 * Authentication middleware
 * Ensures user is authenticated before proceeding
 */
const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.isPublic) {
    // Debug: Authentication required but user not authenticated
    // eslint-disable-next-line no-restricted-syntax
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "app.error.unauthorized",
    });
  }

  return await next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type narrowing - user is now guaranteed to be authenticated
    },
  });
});

/**
 * Authenticated procedure - requires authentication
 * Use this for endpoints that need a logged-in user
 */
export const authenticatedProcedure = publicProcedure.use(isAuthenticated);

/**
 * Role-based authorization middleware factory
 * Creates middleware that checks for specific user roles
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function requireRoles<TRoles extends readonly (typeof UserRoleValue)[]>(
  roles: TRoles,
  logger: EndpointLogger,
) {
  return middleware(async ({ ctx, next }) => {
    if (!ctx.user || ctx.user.isPublic) {
      logger.error("tRPC: Role check failed - user not authenticated", {
        requiredRoles: Array.from(roles),
      });
      // eslint-disable-next-line no-restricted-syntax
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "app.error.unauthorized",
      });
    }

    // Check if user has any of the required roles
    const hasRequiredRole = roles.some((role) => ctx.userRoles.includes(role));

    if (!hasRequiredRole) {
      logger.error("tRPC: Role check failed - insufficient permissions", {
        requiredRoles: Array.from(roles),
        userRoles: Array.from(ctx.userRoles),
      });
      // eslint-disable-next-line no-restricted-syntax
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "error.forbidden",
      });
    }

    return await next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}

/**
 * Admin procedure factory - requires admin role
 * Call with logger from context: adminProcedure(ctx.logger)
 */
export function createAdminProcedure(
  logger: EndpointLogger,
): ReturnType<typeof authenticatedProcedure.use> {
  return authenticatedProcedure.use(requireRoles([UserRole.ADMIN], logger));
}

/**
 * Customer procedure factory - requires customer role or higher
 * Call with logger from context: customerProcedure(ctx.logger)
 */
export function createCustomerProcedure(
  logger: EndpointLogger,
): ReturnType<typeof authenticatedProcedure.use> {
  return authenticatedProcedure.use(
    requireRoles([UserRole.CUSTOMER, UserRole.ADMIN], logger),
  );
}

/**
 * Helper to convert next-vibe error types to tRPC errors
 */
export function convertToTRPCError(
  errorType: (typeof ErrorResponseTypes)[keyof typeof ErrorResponseTypes],
  message: string,
): TRPCError {
  switch (errorType) {
    case ErrorResponseTypes.UNAUTHORIZED:
      return new TRPCError({ code: "UNAUTHORIZED", message });
    case ErrorResponseTypes.FORBIDDEN:
      return new TRPCError({ code: "FORBIDDEN", message });
    case ErrorResponseTypes.NOT_FOUND:
      return new TRPCError({ code: "NOT_FOUND", message });
    case ErrorResponseTypes.VALIDATION_ERROR:
    case ErrorResponseTypes.INVALID_REQUEST_ERROR:
      return new TRPCError({ code: "BAD_REQUEST", message });
    case ErrorResponseTypes.CONFLICT:
      return new TRPCError({ code: "CONFLICT", message });
    case ErrorResponseTypes.INTERNAL_ERROR:
    default:
      return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
  }
}

/**
 * Helper to handle next-vibe response types in tRPC procedures
 * Converts error responses to tRPC errors and returns success data
 */
export function handleNextVibeResponse<T>(response: {
  success: boolean;
  data?: T;
  message?: string;
  errorType?: (typeof ErrorResponseTypes)[keyof typeof ErrorResponseTypes];
}): T {
  if (!response.success) {
    const errorType = response.errorType || ErrorResponseTypes.INTERNAL_ERROR;
    const message = response.message || errorType.errorKey;
    // eslint-disable-next-line no-restricted-syntax
    throw convertToTRPCError(errorType, message);
  }

  if (response.data === undefined) {
    // eslint-disable-next-line no-restricted-syntax
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: ErrorResponseTypes.NO_RESPONSE_DATA.errorKey,
    });
  }

  return response.data;
}
