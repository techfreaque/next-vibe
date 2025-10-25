/**
 * Chat Validation Utilities
 * Shared validation logic for chat operations
 */

import "server-only";

import {
  createErrorResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Validate that thread is not incognito
 * Incognito threads should never be accessed on the server
 */
export function validateNotIncognito(
  rootFolderId: string,
  locale: CountryLanguage,
  errorKey: string,
): ResponseType<never> | null {
  if (rootFolderId === "incognito") {
    return createErrorResponse(
      `${errorKey}.errors.forbidden.title` as const,
      ErrorResponseTypes.FORBIDDEN,
      {
        message: simpleT(locale).t(
          `${errorKey}.errors.forbidden.incognitoNotAllowed`,
        ),
      },
    );
  }
  return null;
}

/**
 * Validate user has ID (not public user)
 */
export function validateUserHasId(
  userId: string | undefined,
  errorKey: string,
): ResponseType<never> | null {
  if (!userId) {
    return createErrorResponse(
      `${errorKey}.errors.unauthorized.title` as const,
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }
  return null;
}

/**
 * Validate entity exists
 */
export function validateExists<T>(
  entity: T | undefined | null,
  errorKey: string,
  entityType: string,
): ResponseType<never> | null {
  if (!entity) {
    // eslint-disable-next-line i18next/no-literal-string
    const errorMessage = `${errorKey}.errors.notFound.${entityType}NotFound`;
    return createErrorResponse(
      `${errorKey}.errors.notFound.title` as const,
      ErrorResponseTypes.NOT_FOUND,
      {
        error: errorMessage,
      },
    );
  }
  return null;
}

/**
 * Validate circular reference
 */
export function validateNoCircularReference(
  id: string,
  parentId: string | null | undefined,
  errorKey: string,
): ResponseType<never> | null {
  if (parentId === id) {
    return createErrorResponse(
      `${errorKey}.errors.validation.title` as const,
      ErrorResponseTypes.VALIDATION_ERROR,
      {
        error: `${errorKey}.errors.validation.circularReference`,
      },
    );
  }
  return null;
}
