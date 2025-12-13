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
 * Parsed JSON value type - recursive type for any JSON-compatible structure
 */
type ParsedValue =
  | string
  | number
  | boolean
  | null
  | ParsedObject
  | readonly ParsedValue[];
// eslint-disable-next-line typescript-eslint/consistent-type-definitions
interface ParsedObject {
  [key: string]: ParsedValue;
}
type ParsedArray = readonly ParsedValue[];

/**
 * Try to parse a value as JSON or coerce to appropriate type
 * Handles JSON objects/arrays, booleans, and numbers
 */
function tryParseValue(value: string): ParsedValue {
  // Check if value looks like JSON (starts with { or [)
  if (
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith("[") && value.endsWith("]"))
  ) {
    try {
      return JSON.parse(value) as ParsedObject | ParsedArray;
    } catch {
      // If parsing fails, return original string
      return value;
    }
  }

  // Coerce boolean strings
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }

  // Coerce numeric strings (integers and floats)
  if (/^-?\d+$/.test(value)) {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  if (/^-?\d+\.\d+$/.test(value)) {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return value;
}

/**
 * Parse search params and convert dot notation to nested objects
 * Also handles JSON-stringified values for complex nested objects
 * Example: ?user.name=John&user.age=30 => { user: { name: "John", age: "30" } }
 * Example: ?filters={"status":"active"} => { filters: { status: "active" } }
 */
export function parseSearchParams(searchParams: URLSearchParams): ParsedObject {
  const result: ParsedObject = {};

  for (const [key, value] of searchParams.entries()) {
    if (key.includes(".")) {
      // Handle dot notation for nested objects
      const parts = key.split(".");
      let current: ParsedObject = result;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part) {
          if (!(part in current)) {
            current[part] = {};
          }
          current = current[part] as ParsedObject;
        }
      }

      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        current[lastPart] = tryParseValue(value);
      }
    } else {
      // Simple key-value pair - try to parse as appropriate type
      result[key] = tryParseValue(value);
    }
  }

  return result;
}

/**
 * Parse FormData and convert dot notation to nested objects
 * Example: fileUpload.file => { fileUpload: { file: File } }
 */
function parseFormData(
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, @typescript-eslint/no-explicit-any -- Infrastructure: FormData type compatibility between Next.js and web standards
  formData: any,
): Record<
  string,
  | string
  | number
  | boolean
  | null
  | File
  | Record<string, string | number | boolean | null | File>
> {
  const result: Record<
    string,
    | string
    | number
    | boolean
    | null
    | File
    | Record<string, string | number | boolean | null | File>
  > = {};

  for (const [key, value] of formData.entries()) {
    if (key.includes(".")) {
      // Handle dot notation for nested objects
      const parts = key.split(".");
      let current: Record<
        string,
        | string
        | number
        | boolean
        | null
        | File
        | Record<string, string | number | boolean | null | File>
      > = result;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part) {
          if (!(part in current)) {
            current[part] = {};
          }
          current = current[part] as Record<
            string,
            string | number | boolean | null | File
          >;
        }
      }

      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        // Keep File objects as-is, convert strings to appropriate types
        if (
          typeof value === "object" &&
          value !== null &&
          "name" in value &&
          "size" in value
        ) {
          current[lastPart] = value;
        } else {
          current[lastPart] = value;
        }
      }
    } else {
      // Simple key-value pair
      if (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        "size" in value
      ) {
        result[key] = value;
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Extract request body from Next.js request
 * Handles both JSON and multipart/form-data
 * Returns raw parsed data without validation
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
    | File
    | Record<string, string | number | boolean | null | File>
  >
> {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle multipart/form-data (file uploads)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return parseFormData(formData);
    }

    // Handle JSON
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
