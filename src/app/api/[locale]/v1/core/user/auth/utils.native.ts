/**
 * Auth Utilities - React Native Version
 * Stub implementations for authentication helpers in React Native
 *
 * Note: These are placeholder implementations. Proper React Native authentication
 * will be implemented in a future update using native-specific auth flows.
 */

import {
  fail,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { CompleteUserType } from "../types";

/**
 * Require an authenticated admin user - Native stub
 * TODO: Implement proper native authentication flow
 */
export async function requireAdminUser(
  locale: CountryLanguage,
  redirectPath?: string,
): Promise<ResponseType<CompleteUserType>> {
  // Stub implementation for React Native
  // In a real implementation, this would check native auth state
  return fail({
    message: "app.api.v1.core.user.auth.errors.not_implemented_native",
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
    messageParams: {
      context: "requireAdminUser",
      locale,
      redirectPath: redirectPath ?? "",
      message: "Proper native authentication not yet implemented",
    },
  });
}

/**
 * Require an authenticated user (any role) - Native stub
 * TODO: Implement proper native authentication flow
 */
export async function requireUser(
  locale: CountryLanguage,
  redirectPath?: string,
): Promise<ResponseType<CompleteUserType>> {
  // Stub implementation for React Native
  // In a real implementation, this would check native auth state
  return fail({
    message: "app.api.v1.core.user.auth.errors.not_implemented_native",
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
    messageParams: {
      context: "requireUser",
      locale,
      redirectPath: redirectPath ?? "",
      message: "Proper native authentication not yet implemented",
    },
  });
}
