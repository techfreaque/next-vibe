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

/**
 * Deserialize JSON string back to MessageResponseType
 * Returns null if parsing fails
 */
export function deserializeError(
  errorString: string,
): MessageResponseType | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed = JSON.parse(errorString);

    // Validate structure
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof parsed.message === "string"
    ) {
      return parsed as MessageResponseType;
    }

    return null;
  } catch {
    return null;
  }
}
