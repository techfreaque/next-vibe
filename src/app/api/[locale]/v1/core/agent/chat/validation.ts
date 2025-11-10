/**
 * Chat Validation Utilities
 * Shared validation logic for chat operations
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * Validate that thread is not incognito
 * Incognito threads should never be accessed on the server
 */
export function validateNotIncognito(
  rootFolderId: DefaultFolderId,
  locale: CountryLanguage,
  errorKeyPrefix: string,
): ResponseType<never> | null {
  if (rootFolderId === "incognito") {
    return fail({
      message: `${errorKeyPrefix}.errors.forbidden.title` as TranslationKey,
      errorType: ErrorResponseTypes.FORBIDDEN,
      messageParams: {
        message: simpleT(locale).t(
          `${errorKeyPrefix}.errors.forbidden.incognitoNotAllowed` as TranslationKey,
        ),
      },
    });
  }
  return null;
}

/**
 * Validate user has ID (not public user)
 */
export function validateUserHasId(
  userId: string | undefined,
  titleKey: TranslationKey,
): ResponseType<never> | null {
  if (!userId) {
    return fail({
      message: titleKey,
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }
  return null;
}

/**
 * Validate entity exists
 */
export function validateExists<T>(
  entity: T | undefined | null,
  titleKey: TranslationKey,
  messageKey: TranslationKey,
): ResponseType<never> | null {
  if (!entity) {
    return fail({
      message: titleKey,
      errorType: ErrorResponseTypes.NOT_FOUND,
      messageParams: {
        error: messageKey,
      },
    });
  }
  return null;
}

/**
 * Validate circular reference
 */
export function validateNoCircularReference(
  id: string,
  parentId: string | null | undefined,
  titleKey: TranslationKey,
  messageKey: TranslationKey,
): ResponseType<never> | null {
  if (parentId === id) {
    return fail({
      message: titleKey,
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
      messageParams: {
        error: messageKey,
      },
    });
  }
  return null;
}
