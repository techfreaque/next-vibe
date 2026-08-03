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

import { platform } from "../../core/env-client";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import type { AuthT } from "./i18n";
import type { EndpointLogger } from "../../logger/types";
import { storage } from "next-vibe/ui/lib/storage";

// Storage key for auth token
const AUTH_TOKEN_STORAGE_KEY = "auth_token";

/**
 * Auth Client Repository Implementation
 */
export class AuthClientRepository {
  /**
   * Retrieves the stored JWT token using platform-agnostic storage
   * For web, retrieves from localStorage
   * For React Native, retrieves from AsyncStorage automatically via next-vibe-ui
   */
  static async getAuthToken(
    logger: EndpointLogger,
    t: AuthT,
  ): Promise<ResponseType<string | undefined>> {
    try {
      if (platform.isServer) {
        logger.error("getAuthToken cannot be called on the server");

        return fail({
          message: t("authClient.errors.token_get_failed"),
          errorType: ErrorResponseTypes.AUTH_ERROR,
        });
      }

      // Use platform-agnostic storage (localStorage for web, AsyncStorage for React Native)
      const token = await storage.getItem(AUTH_TOKEN_STORAGE_KEY);
      logger.debug("Auth token retrieved", {
        hasToken: !!token,
        platform: platform.isReactNative ? "React Native" : "Web",
      });

      return success(token || undefined);
    } catch (error) {
      logger.error("Error getting auth token", parseError(error));

      return fail({
        message: t("authClient.errors.token_get_failed_detail", {
          error: String(error),
        }),
        errorType: ErrorResponseTypes.AUTH_ERROR,
      });
    }
  }

  /**
   * Removes the stored JWT token using platform-agnostic storage
   * For web, removes from localStorage
   * For React Native, removes from AsyncStorage automatically via next-vibe-ui
   */
  static async removeAuthToken(
    logger: EndpointLogger,
    t: AuthT,
  ): Promise<ResponseType<void>> {
    try {
      if (platform.isServer) {
        logger.error("removeAuthToken cannot be called on the server");

        return fail({
          message: t("authClient.errors.token_remove_failed"),
          errorType: ErrorResponseTypes.AUTH_ERROR,
        });
      }

      // Use platform-agnostic storage (localStorage for web, AsyncStorage for React Native)
      await storage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      logger.debug("Auth token removed successfully", {
        platform: platform.isReactNative ? "React Native" : "Web",
      });

      return success();
    } catch (error) {
      logger.error("Error removing auth token", parseError(error));

      return fail({
        message: t("authClient.errors.token_remove_failed_detail", {
          error: String(error),
        }),
        errorType: ErrorResponseTypes.AUTH_ERROR,
      });
    }
  }
}
