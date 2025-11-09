"use client";

/**
 * Auth Client Repository
 * Provides a unified interface for all client-side authentication-related operations
 *
 * This repository centralizes all client-side authentication functionality:
 * - Authentication status flag storage and retrieval
 * - Authentication status checking
 *
 * Note: We only store a status flag to indicate if there's an httpOnly cookie present.
 * The actual token is handled server-side for security.
 *
 * All methods return ResponseType<T> for consistent error handling
 */

import { AUTH_STATUS_COOKIE_NAME } from "@/config/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@/app/api/[locale]/v1/core/system/unified-interface/react/storage-cookie-client";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { envClient } from "@/config/env-client";

/**
 * Auth Client Repository Interface
 * Provides all client-side authentication-related functionality in a single interface
 */
export interface AuthClientRepository {
  /**
   * Sets the authentication status flag (indicates httpOnly cookie is present)
   * @param logger - Optional logger for debugging
   * @returns ResponseType indicating success or failure
   */
  setAuthStatus(logger: EndpointLogger): ResponseType<void>;

  /**
   * Removes the authentication status flag
   * @param logger - Optional logger for debugging
   * @returns ResponseType indicating success or failure
   */
  removeAuthStatus(logger: EndpointLogger): ResponseType<void>;

  /**
   * Checks if the user has authentication status (indicates httpOnly cookie might be present)
   * @param logger - Optional logger for debugging
   * @returns ResponseType with boolean indicating authentication status
   */
  hasAuthStatus(logger: EndpointLogger): ResponseType<boolean>;
}

/**
 * Auth Client Repository Implementation
 */
export class AuthClientRepositoryImpl implements AuthClientRepository {
  /**
   * Sets the authentication status flag to indicate httpOnly cookie is present
   * @param logger - Optional logger for debugging
   * @returns ResponseType indicating success or failure
   */
  setAuthStatus(logger: EndpointLogger): ResponseType<void> {
    try {
      if (envClient.platform.isServer) {
        logger.error("setAuthStatus cannot be called on the server");
        return createErrorResponse(
          "app.api.v1.core.user.auth.authClient.errors.status_save_failed",
          ErrorResponseTypes.AUTH_ERROR,
        );
      }

      logger.debug("Setting auth status cookie", {
        cookieName: AUTH_STATUS_COOKIE_NAME,
        isServer: envClient.platform.isServer,
        hasDocument: typeof document !== "undefined",
      });
      setCookie(AUTH_STATUS_COOKIE_NAME, "1");

      return success(undefined);
    } catch (error) {
      logger.error("Error setting auth status", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.auth.authClient.errors.status_save_failed",
        ErrorResponseTypes.AUTH_ERROR,
        { error: String(error) },
      );
    }
  }

  /**
   * Removes the authentication status flag
   * @param logger - Optional logger for debugging
   * @returns ResponseType indicating success or failure
   */
  removeAuthStatus(logger: EndpointLogger): ResponseType<void> {
    try {
      if (envClient.platform.isServer) {
        logger.error("removeAuthStatus cannot be called on the server");
        return createErrorResponse(
          "app.api.v1.core.user.auth.authClient.errors.status_remove_failed",
          ErrorResponseTypes.AUTH_ERROR,
        );
      }
      deleteCookie(AUTH_STATUS_COOKIE_NAME);

      return success(undefined);
    } catch (error) {
      logger.error("Error removing auth status", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.auth.authClient.errors.status_remove_failed",
        ErrorResponseTypes.AUTH_ERROR,
        { error: String(error) },
      );
    }
  }

  /**
   * Checks if the user has authentication status flag set
   * This indicates that an httpOnly cookie might be present and we should attempt authenticated calls
   * @param logger - Optional logger for debugging
   * @returns ResponseType with boolean indicating authentication status
   */
  hasAuthStatus(logger: EndpointLogger): ResponseType<boolean> {
    try {
      if (envClient.platform.isServer) {
        logger.error("hasAuthStatus cannot be called on the server");
        return createErrorResponse(
          "app.api.v1.core.user.auth.authClient.errors.status_check_failed",
          ErrorResponseTypes.AUTH_ERROR,
        );
      }

      const status = getCookie(AUTH_STATUS_COOKIE_NAME);
      const hasStatus = status !== null && status !== undefined;

      logger.debug("Checking auth status cookie", {
        cookieName: AUTH_STATUS_COOKIE_NAME,
        cookieValue: status,
        hasStatus,
      });

      return success(hasStatus);
    } catch (error) {
      logger.error("Error in hasAuthStatus", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.auth.authClient.errors.status_check_failed",
        ErrorResponseTypes.AUTH_ERROR,
        { error: String(error) },
      );
    }
  }
}

/**
 * Singleton Repository Instance
 *
 * We export a singleton instance of the repository to ensure that:
 * 1. Only one instance exists throughout the application
 * 2. The instance is lazily created when first imported
 * 3. All consumers use the same instance
 */
export const authClientRepository = new AuthClientRepositoryImpl();
