/**
 * Endpoint to Metadata Converter
 * Shared conversion logic for all platforms
 * Eliminates duplication across MCP, AI, CLI converters
 * Pure logic - no server dependencies
 */

import { z } from "zod";

/**
 * Convert Zod schema to JSON Schema
 * z.toJSONSchema automatically handles transforms and refinements
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function zodSchemaToJsonSchema(schema: z.ZodTypeAny): any {
  try {
    // z.toJSONSchema automatically strips transforms and refinements
    // No manual stripping needed
    return z.toJSONSchema(schema, {
      target: "draft-7",
    });
  } catch {
    return {
      type: "object",
    };
  }
}
