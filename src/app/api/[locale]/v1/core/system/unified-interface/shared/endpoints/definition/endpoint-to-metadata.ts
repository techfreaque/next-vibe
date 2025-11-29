/**
 * Endpoint to Metadata Converter
 * Shared conversion logic for all platforms
 * Eliminates duplication across MCP, AI, CLI converters
 * Pure logic - no server dependencies
 */

import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";

/**
 * JSON Schema type from zod-to-json-schema
 */
type JsonSchema = ReturnType<typeof zodToJsonSchema>;

/**
 * Convert Zod schema to JSON Schema
 * zodToJsonSchema automatically handles transforms and refinements
 */
export function zodSchemaToJsonSchema(schema: z.ZodTypeAny): JsonSchema {
  try {
    // zodToJsonSchema automatically strips transforms and refinements
    // No manual stripping needed
    return zodToJsonSchema(
      schema as unknown as Parameters<typeof zodToJsonSchema>[0],
      {
        target: "jsonSchema7",
        $refStrategy: "none",
      },
    );
  } catch {
    return {
      type: "object",
    };
  }
}
