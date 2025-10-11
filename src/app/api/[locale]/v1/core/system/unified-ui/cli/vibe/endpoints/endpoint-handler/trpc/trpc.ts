/**
 * tRPC Server Setup
 * Initializes tRPC with context and creates base procedures
 * Integrates with existing next-vibe authentication and error handling
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
// debugLogger removed - using comments instead
import { ZodError } from "zod";

import type { UserRoleValue } from "../../../../../../../user/user-roles/enum";
import { UserRole } from "../../../../../../../user/user-roles/enum";
import type { EndpointLogger } from "../logger";
import { createEndpointLogger } from "../logger/endpoint-logger";
import type { TRPCContext } from "./trpc-context";

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
      message: "error.unauthorized" as string,
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
export function requireRoles<TRoles extends readonly (typeof UserRoleValue)[]>(
  roles: TRoles,
  logger: EndpointLogger,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return middleware(async ({ ctx, next }) => {
    if (!ctx.user || ctx.user.isPublic) {
      logger.error("tRPC: Role check failed - user not authenticated", {
        requiredRoles: roles,
      });
      // eslint-disable-next-line no-restricted-syntax
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "error.unauthorized",
      });
    }

    // Check if user has any of the required roles
    const hasRequiredRole = roles.some((role) => ctx.userRoles.includes(role));

    if (!hasRequiredRole) {
      logger.error("tRPC: Role check failed - insufficient permissions", {
        requiredRoles: roles,
        userRoles: ctx.userRoles,
      });
      // eslint-disable-next-line no-restricted-syntax
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "error.forbidden" as string,
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
 * Admin procedure - requires admin role
 */
export const adminProcedure = authenticatedProcedure.use(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  requireRoles(
    [UserRole.ADMIN],
    createEndpointLogger(false, Date.now(), "en-GLOBAL"),
  ),
);

/**
 * Customer procedure - requires customer role or higher
 */
export const customerProcedure = authenticatedProcedure.use(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  requireRoles(
    [UserRole.CUSTOMER, UserRole.ADMIN],
    createEndpointLogger(false, Date.now(), "en-GLOBAL"),
  ),
);

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
