/**
 * Error Handling Types
 * Shared types for error handling across all platforms
 */

/**
 * Primitive JSON values
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON-compatible object (record with JSON values)
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON-compatible array
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface JsonArray extends Array<JsonValue> {}

/**
 * Any valid JSON value
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Error details type
 */
export type ErrorDetails = Record<string, JsonPrimitive>;

/**
 * Logger interface for error handling
 */
export interface ErrorLogger {
  error: (message: string, context?: ErrorDetails) => void;
}
