/**
 * Next.js Request Parser
 * Extracts raw data from Next.js requests WITHOUT validation
 * Validation is handled by genericHandler
 */

import "server-only";

import type { NextRequest } from "next/server";

import { parseError } from "../../../shared/utils";
import type { EndpointLogger } from "../shared/logger/endpoint";

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
 * Also handles bracket notation for arrays: status[0]=a&status[1]=b => { status: ["a", "b"] }
 * Example: ?user.name=John&user.age=30 => { user: { name: "John", age: "30" } }
 * Example: ?filters={"status":"active"} => { filters: { status: "active" } }
 */
export function parseSearchParams(searchParams: URLSearchParams): ParsedObject {
  const result: ParsedObject = {};

  for (const [key, value] of searchParams.entries()) {
    // Handle bracket notation for arrays: name[0], name[1], etc.
    const bracketMatch = /^([^[]+)\[(\d+)\]$/.exec(key);
    if (bracketMatch) {
      const arrayKey = bracketMatch[1];
      const index = parseInt(bracketMatch[2], 10);
      if (arrayKey) {
        if (!(arrayKey in result)) {
          result[arrayKey] = [];
        }
        const arr = result[arrayKey] as ParsedValue[];
        arr[index] = tryParseValue(value);
      }
    } else if (key.includes(".")) {
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

      const lastPart = parts.at(-1);
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
 * Handles multiple values with same key as arrays (e.g., multiple attachments)
 */
function parseFormData(
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, @typescript-eslint/no-explicit-any -- Infrastructure: FormData type compatibility between Next.js and web standards
  formData: any,
): Record<
  string,
  | string
  | number
  | boolean
  | null
  | File
  | File[]
  | Record<string, string | number | boolean | null | File>
> {
  const result: Record<
    string,
    | string
    | number
    | boolean
    | null
    | File
    | File[]
    | Record<string, string | number | boolean | null | File>
  > = {};

  // First pass: collect all values for each key
  const keyValues: Map<string, Array<string | File>> = new Map();
  for (const [key, value] of formData.entries()) {
    if (!keyValues.has(key)) {
      keyValues.set(key, []);
    }
    keyValues.get(key)!.push(value);
  }

  // Second pass: process values
  for (const [key, values] of keyValues.entries()) {
    // Determine if this should be an array or single value
    // Keep as array only if all values are Files (to satisfy type system)
    const allFiles = values.every((v) => v instanceof File);

    let value: string | File | File[];
    if (key === "attachments" || (allFiles && values.length > 1)) {
      value = values.filter((v): v is File => v instanceof File);
    } else {
      value = values[0];
    }

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
        | File[]
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

      const lastPart = parts.at(-1);
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
 * Merged value type - extends ParsedValue to include File and File[]
 */
type MergedValue =
  | string
  | number
  | boolean
  | null
  | File
  | File[]
  | MergedObject
  | readonly MergedValue[];
interface MergedObject {
  [key: string]: MergedValue;
}

/**
 * Deep merge two objects, with source values overwriting target values
 * Used to merge file fields into JSON data
 */
function deepMerge(target: MergedObject, source: MergedObject): MergedObject {
  const result: MergedObject = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      !(sourceValue instanceof File) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue) &&
      !(targetValue instanceof File)
    ) {
      // Recursively merge nested objects
      result[key] = deepMerge(
        targetValue as MergedObject,
        sourceValue as MergedObject,
      );
    } else {
      // Overwrite with source value
      result[key] = sourceValue;
    }
  }

  return result;
}

/**
 * Extract request body from Next.js request
 * Handles both JSON and multipart/form-data
 * Also handles mixed FormData with JSON "data" field plus file fields
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
    | File[]
    | Record<string, string | number | boolean | null | File>
  >
> {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle multipart/form-data (file uploads)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Check if there's a "data" field with JSON (mixed FormData + JSON pattern)
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, @typescript-eslint/no-explicit-any -- Infrastructure: FormData type compatibility
      const dataField = (formData as any).get("data") as string | File | null;
      if (dataField && typeof dataField === "string") {
        // Parse the JSON data field
        const jsonData = JSON.parse(dataField) as MergedObject;

        // Parse remaining FormData fields (files with dot notation)
        const fileFields = parseFormData(formData);
        // Remove the "data" field from fileFields since we already parsed it
        delete fileFields["data"];

        // Merge JSON data with file fields (files override null placeholders)
        const merged = deepMerge(jsonData, fileFields);

        logger.debug("Parsed mixed FormData + JSON request", {
          jsonDataKeys: Object.keys(jsonData),
          fileFieldKeys: Object.keys(fileFields),
          mergedKeys: Object.keys(merged),
        });

        return merged as Record<
          string,
          | string
          | number
          | boolean
          | null
          | File
          | File[]
          | Record<string, string | number | boolean | null | File>
        >;
      }

      // Standard FormData parsing (dot notation only)
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
