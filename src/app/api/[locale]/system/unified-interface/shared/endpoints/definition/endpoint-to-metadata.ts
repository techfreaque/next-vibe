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
 * and adds type hints for anyOf schemas
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
      jsonSchema.properties &&
      typeof jsonSchema.properties === "object"
    ) {
      // Remove fields with defaults from required array
      if (Array.isArray(jsonSchema.required)) {
        jsonSchema.required = jsonSchema.required.filter(
          (fieldName: string) => {
            const field = jsonSchema.properties?.[fieldName];
            // Keep field as required only if it doesn't have a default value
            return (
              !field ||
              typeof field !== "object" ||
              field === null ||
              !("default" in field)
            );
          },
        );

        // Remove required array if it's empty
        if (jsonSchema.required.length === 0) {
          delete jsonSchema.required;
        }
      }

      // Post-process properties to add type hints for anyOf schemas
      for (const [key, value] of Object.entries(jsonSchema.properties)) {
        if (
          value &&
          typeof value === "object" &&
          "anyOf" in value &&
          !("type" in value)
        ) {
          jsonSchema.properties[key] = addTypeHintToAnyOf(value);
        }
      }
    }

    // Post-process top-level anyOf to add type hint
    if (
      jsonSchema &&
      typeof jsonSchema === "object" &&
      "anyOf" in jsonSchema &&
      !("type" in jsonSchema)
    ) {
      return addTypeHintToAnyOf(jsonSchema);
    }

    return jsonSchema;
  } catch {
    return {
      type: "object",
    };
  }
}

/**
 * Add type hint to anyOf schemas for better MCP client compatibility
 * Analyzes the anyOf options and adds a top-level type field when possible
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addTypeHintToAnyOf(schema: any): any {
  if (!schema.anyOf || !Array.isArray(schema.anyOf)) {
    return schema;
  }

  // Collect all types from anyOf options
  const types = new Set<string>();
  let arrayItemsType: string | undefined;

  for (const option of schema.anyOf) {
    if (option && typeof option === "object" && "type" in option) {
      types.add(option.type);

      // If this is an array type, capture the items type
      if (
        option.type === "array" &&
        option.items &&
        typeof option.items === "object" &&
        "type" in option.items
      ) {
        arrayItemsType = option.items.type;
      }
    }
  }

  // If all options are the same type, add it as top-level type
  if (types.size === 1) {
    const [singleType] = types;
    return {
      type: singleType,
      ...schema,
    };
  }

  // If we have string and array, it's a multi-type field
  // Add both types as an array (JSON Schema allows this)
  if (types.size > 0) {
    const result = {
      type: [...types],
      ...schema,
    };

    // If we have an array type with items, add the items type hint
    if (types.has("array") && arrayItemsType) {
      result.items = { type: arrayItemsType };
    }

    return result;
  }

  // Can't determine type, return as-is
  return schema;
}
