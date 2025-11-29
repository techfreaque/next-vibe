/**
 * Next.js Request Parser
 * Extracts raw data from Next.js requests WITHOUT validation
 * Validation is handled by genericHandler
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { EndpointLogger } from "../shared/logger/endpoint";
import { parseError } from "../../../shared/utils";

/**
 * Parse search params and convert dot notation to nested objects
 * Example: ?user.name=John&user.age=30 => { user: { name: "John", age: "30" } }
 */
export function parseSearchParams(
  searchParams: URLSearchParams,
): Record<string, string | Record<string, string>> {
  const result: Record<string, string | Record<string, string>> = {};

  for (const [key, value] of searchParams.entries()) {
    if (key.includes(".")) {
      // Handle dot notation for nested objects
      const parts = key.split(".");
      let current: Record<string, string | Record<string, string>> = result;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part) {
          if (!(part in current)) {
            current[part] = {};
          }
          current = current[part] as Record<string, string>;
        }
      }

      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        current[lastPart] = value;
      }
    } else {
      // Simple key-value pair
      result[key] = value;
    }
  }

  return result;
}

/**
 * Extract request body from Next.js request
 * Returns raw parsed JSON without validation
 */
export async function parseRequestBody(
  request: NextRequest,
  logger: EndpointLogger,
): Promise<
  Record<
    string,
    | string
    | number
    | boolean
    | null
    | Record<string, string | number | boolean | null>
  >
> {
  try {
    const bodyText = await request.text();

    // If body is empty or whitespace only, return empty object
    if (!bodyText || bodyText.trim() === "") {
      return {};
    }

    // Parse the JSON body
    const body = JSON.parse(bodyText) as Record<
      string,
      | string
      | number
      | boolean
      | null
      | Record<string, string | number | boolean | null>
    >;
    return body;
  } catch (error) {
    logger.error("Failed to parse request body", parseError(error));
    // If parsing fails, return empty object
    // genericHandler will handle validation errors
    return {};
  }
}
