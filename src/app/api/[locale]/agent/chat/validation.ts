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

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * Validate that thread is not incognito
 * Incognito threads should never be accessed on the server
 */
export function validateNotIncognito(
  rootFolderId: DefaultFolderId,
  forbiddenMessage: TranslationKey,
): ResponseType<never> | null {
  if (rootFolderId === DefaultFolderId.INCOGNITO) {
    return fail({
      message: forbiddenMessage,
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }
  return null;
}
