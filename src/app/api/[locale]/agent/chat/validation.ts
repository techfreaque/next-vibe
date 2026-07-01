/**
 * Chat Validation Utilities
 * Shared validation logic for chat operations
 */

import "server-only";

import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

/**
 * Validate that thread is not incognito
 * Incognito threads should never be accessed on the server
 */
export function validateNotIncognito(
  rootFolderId: DefaultFolderId,
  forbiddenMessage: TranslatedKeyType,
): ResponseType<never> | null {
  if (rootFolderId === DefaultFolderId.INCOGNITO) {
    return fail({
      message: forbiddenMessage,
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }
  return null;
}
