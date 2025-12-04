/**
 * Error Handling Types
 * Shared types for error handling across all platforms
 */

/**
 * Primitive JSON values
 */
type JsonPrimitive = string | number | boolean | null;

/**
 * JSON-compatible object (record with JSON values)
 */
interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON-compatible array
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface JsonArray extends Array<JsonValue> {}

/**
 * Any valid JSON value
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
