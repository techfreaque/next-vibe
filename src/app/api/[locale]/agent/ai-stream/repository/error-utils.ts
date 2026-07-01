/**
 * Error Serialization Utilities
 * Centralized utilities for handling ErrorResponseType serialization/deserialization
 */

import type { ErrorResponseType } from "next-vibe/core/route/response.schema";

/**
 * Serialize ErrorResponseType to JSON string for storage/transmission
 */
export function serializeError(error: ErrorResponseType): string {
  return JSON.stringify(error);
}

/**
 * Deserialize JSON string back to ErrorResponseType
 */
export function deserializeError(serialized: string): ErrorResponseType {
  return JSON.parse(serialized) as ErrorResponseType;
}
