/**
 * Error Serialization Utilities
 * Centralized utilities for handling MessageResponseType serialization/deserialization
 */

import type { MessageResponseType } from "@/app/api/[locale]/shared/types/response.schema";

/**
 * Serialize MessageResponseType to JSON string for storage/transmission
 */
export function serializeError(error: MessageResponseType): string {
  return JSON.stringify(error);
}
