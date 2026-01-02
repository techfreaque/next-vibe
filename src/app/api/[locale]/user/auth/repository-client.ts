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

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { platform } from "@/config/env-client";

// Storage key for auth token
const AUTH_TOKEN_STORAGE_KEY = "auth_token";

/**
 * Auth Client Repository Interface
 * Provides all client-side authentication-related functionality in a single interface
 */
export interface AuthClientRepository {
  /**
   * Stores the JWT token using platform-agnostic storage (next-vibe-ui)
   * For web, uses localStorage
   * For React Native, uses AsyncStorage automatically
   * @param token - The JWT token to store
   * @param logger - Optional logger for debugging
   * @returns Promise<ResponseType> indicating success or failure
   */
  setAuthToken(token: string, logger: EndpointLogger): Promise<ResponseType<void>>;

  /**
   * Retrieves the stored JWT token using platform-agnostic storage (next-vibe-ui)
   * For web, retrieves from localStorage
   * For React Native, retrieves from AsyncStorage automatically
   * @param logger - Optional logger for debugging
   * @returns Promise<ResponseType> with the token or undefined
   */
  getAuthToken(logger: EndpointLogger): Promise<ResponseType<string | undefined>>;

  /**
   * Removes the stored JWT token using platform-agnostic storage (next-vibe-ui)
   * For web, removes from localStorage
   * For React Native, removes from AsyncStorage automatically
   * @param logger - Optional logger for debugging
   * @returns Promise<ResponseType> indicating success or failure
   */
  removeAuthToken(logger: EndpointLogger): Promise<ResponseType<void>>;
}

/**
 * Auth Client Repository Implementation
 */
export class AuthClientRepositoryImpl implements AuthClientRepository {
  /**
   * Stores the JWT token using platform-agnostic storage
   * For web, uses localStorage (tokens can also be in httpOnly cookies)
   * For React Native, uses AsyncStorage automatically via next-vibe-ui
   */
  async setAuthToken(token: string, logger: EndpointLogger): Promise<ResponseType<void>> {
    try {
      if (platform.isServer) {
        logger.error("setAuthToken cannot be called on the server");
        return fail({
          message: "app.api.user.auth.authClient.errors.token_save_failed",
          errorType: ErrorResponseTypes.AUTH_ERROR,
        });
      }

      // Use platform-agnostic storage (localStorage for web, AsyncStorage for React Native)
      await storage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      logger.debug("Auth token stored successfully", {
        platform: platform.isReactNative ? "React Native" : "Web",
      });

      return success();
    } catch (error) {
      logger.error("Error setting auth token", parseError(error));
      return fail({
        message: "app.api.user.auth.authClient.errors.token_save_failed",
        errorType: ErrorResponseTypes.AUTH_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Retrieves the stored JWT token using platform-agnostic storage
   * For web, retrieves from localStorage
   * For React Native, retrieves from AsyncStorage automatically via next-vibe-ui
   */
  async getAuthToken(logger: EndpointLogger): Promise<ResponseType<string | undefined>> {
    try {
      if (platform.isServer) {
        logger.error("getAuthToken cannot be called on the server");
        return fail({
          message: "app.api.user.auth.authClient.errors.token_get_failed",
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
        message: "app.api.user.auth.authClient.errors.token_get_failed",
        errorType: ErrorResponseTypes.AUTH_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Removes the stored JWT token using platform-agnostic storage
   * For web, removes from localStorage
   * For React Native, removes from AsyncStorage automatically via next-vibe-ui
   */
  async removeAuthToken(logger: EndpointLogger): Promise<ResponseType<void>> {
    try {
      if (platform.isServer) {
        logger.error("removeAuthToken cannot be called on the server");
        return fail({
          message: "app.api.user.auth.authClient.errors.token_remove_failed",
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
        message: "app.api.user.auth.authClient.errors.token_remove_failed",
        errorType: ErrorResponseTypes.AUTH_ERROR,
        messageParams: { error: String(error) },
      });
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
