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
 * Post-processes to make fields with defaults optional (not required)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function zodSchemaToJsonSchema(schema: z.ZodTypeAny): any {
  try {
    // z.toJSONSchema automatically strips transforms and refinements
    // No manual stripping needed
    const jsonSchema = z.toJSONSchema(schema, {
      target: "draft-7",
    });

    // Post-process: Remove fields with default values from required array
    // Fields with defaults should be optional in tool schemas
    if (
      jsonSchema &&
      typeof jsonSchema === "object" &&
      jsonSchema.type === "object" &&
      Array.isArray(jsonSchema.required) &&
      jsonSchema.properties &&
      typeof jsonSchema.properties === "object"
    ) {
      jsonSchema.required = jsonSchema.required.filter((fieldName: string) => {
        const field = jsonSchema.properties?.[fieldName];
        // Keep field as required only if it doesn't have a default value
        return (
          !field ||
          typeof field !== "object" ||
          field === null ||
          !("default" in field)
        );
      });

      // Remove required array if it's empty
      if (jsonSchema.required.length === 0) {
        delete jsonSchema.required;
      }
    }

    return jsonSchema;
  } catch {
    return {
      type: "object",
    };
  }
}
