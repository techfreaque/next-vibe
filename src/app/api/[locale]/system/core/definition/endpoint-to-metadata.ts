/**
 * Endpoint to Metadata Converter
 * Shared conversion logic for all platforms
 * Eliminates duplication across MCP, AI, CLI converters
 * Pure logic - no server dependencies
 */

import { z } from "zod";

import { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

/**
 * Convert Zod schema to JSON Schema
 * z.toJSONSchema automatically handles transforms and refinements
 * Post-processes to make fields with defaults optional (not required)
 * and adds type hints for anyOf schemas
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function zodSchemaToJsonSchema(schema: z.ZodTypeAny): any {
  try {
    // z.toJSONSchema handles most schemas; unrepresentable:"any" ensures
    // fields with transforms/pipelines still appear (as {} / any) rather than throwing.
    // Override: ZodPipe (z.coerce.number, z.string().pipe(...)) - emit type from the
    // output schema so clients see "number"/"integer" instead of unknown {}.
    const jsonSchema = z.toJSONSchema(schema, {
      target: "draft-7",
      // io:"input" uses the input side of ZodPipe/transforms, which is always
      // representable (string, number, etc.) unlike the output (Date, custom, etc.)
      io: "input",
      unrepresentable: "any",
      override: (ctx) => {
        const def = ctx.zodSchema._zod?.def;
        if (!def) {
          return;
        }
        // ZodDate - emit as ISO string (JSON has no native date type)
        if (def.type === "date") {
          ctx.jsonSchema.type = "string";
          ctx.jsonSchema.format = "date-time";
        }
        // ZodCustom types - treat as object
        if (def.type === "custom") {
          ctx.jsonSchema.type = "object";
        }
      },
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

      // Post-process properties: clean anyOf and replace bare {} (unrepresentable)
      for (const [key, value] of Object.entries(jsonSchema.properties)) {
        if (value && typeof value === "object") {
          if ("anyOf" in value) {
            jsonSchema.properties[key] = cleanupAnyOf(value);
          } else if (Object.keys(value).length === 0) {
            // Bare {} means fully unrepresentable - fall back to string
            jsonSchema.properties[key] = { type: "string" };
          }
        }
      }
    }

    // Post-process top-level anyOf to add type hint
    if (jsonSchema && typeof jsonSchema === "object" && "anyOf" in jsonSchema) {
      return cleanupAnyOf(jsonSchema);
    }

    return jsonSchema;
  } catch {
    return {
      type: "object",
    };
  }
}

/**
 * Clean up anyOf schemas for better MCP client compatibility:
 * - Removes empty {} (unrepresentable) entries
 * - Flattens nested anyOf arrays
 * - Adds top-level type hint when possible
 * - If only one option remains after cleanup, inlines it
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanupAnyOf(schema: any): any {
  if (!schema.anyOf || !Array.isArray(schema.anyOf)) {
    return schema;
  }

  // Recursively clean nested anyOf options first, then flatten
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatOptions: any[] = [];
  for (const option of schema.anyOf) {
    if (!option || typeof option !== "object") {
      continue;
    }
    // Skip empty {} (unrepresentable/any types)
    if (Object.keys(option).length === 0) {
      continue;
    }
    // Flatten nested anyOf
    if ("anyOf" in option && Array.isArray(option.anyOf)) {
      const cleaned = cleanupAnyOf(option);
      if (cleaned.anyOf) {
        flatOptions.push(...cleaned.anyOf);
      } else {
        flatOptions.push(cleaned);
      }
    } else {
      flatOptions.push(option);
    }
  }

  // Build base without anyOf for inline cases
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { anyOf: _anyOf, ...schemaRest } = schema;

  // If only one option remains, inline it (drop the anyOf wrapper)
  if (flatOptions.length === 1) {
    return { ...flatOptions[0], ...schemaRest };
  }

  // If no options remain (all were empty), return as string fallback
  if (flatOptions.length === 0) {
    return { type: "string", ...schemaRest };
  }

  const cleanedSchema = { ...schema, anyOf: flatOptions };

  // Only add type hint if not already present
  if ("type" in cleanedSchema) {
    return cleanedSchema;
  }

  // Collect all types from the cleaned options
  const types = new Set<string>();
  let arrayItemsType: string | undefined;

  for (const option of flatOptions) {
    if (option && typeof option === "object" && "type" in option) {
      if (typeof option.type === "string") {
        types.add(option.type);
        // If this is an array type, capture the items type
        if (
          option.type === "array" &&
          option.items &&
          typeof option.items === "object" &&
          "type" in option.items &&
          typeof option.items.type === "string"
        ) {
          arrayItemsType = option.items.type;
        }
      }
    }
  }

  // If all options are the same type, add it as top-level type.
  // Exception: don't promote "null" as the sole type when there are
  // untyped options (e.g. oneOf/discriminated unions) in the mix —
  // those are objects and "null" alone is misleading.
  if (types.size === 1) {
    const [singleType] = types;
    const hasUntypedOptions = flatOptions.some(
      (o) =>
        o &&
        typeof o === "object" &&
        !("type" in o) &&
        ("oneOf" in o || "anyOf" in o || "properties" in o),
    );
    if (singleType === "null" && hasUntypedOptions) {
      // Promote to object|null since the untyped option is likely an object
      return { type: ["object", "null"], ...cleanedSchema };
    }
    return { type: singleType, ...cleanedSchema };
  }

  // Multiple types - add type array (JSON Schema draft-7 supports this)
  if (types.size > 0) {
    const result = { type: [...types], ...cleanedSchema };
    if (types.has("array") && arrayItemsType) {
      result.items = { type: arrayItemsType };
    }
    return result;
  }

  // Can't determine type, return cleaned schema as-is
  return cleanedSchema;
}

/**
 * Map FieldDataType to JSON Schema type/format overrides.
 * Returns a partial JSON Schema object to merge into the property.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fieldDataTypeToJsonSchemaHint(fieldType: string): Record<string, any> {
  switch (fieldType) {
    case FieldDataType.INT:
      return { type: "integer" };
    case FieldDataType.NUMBER:
    case FieldDataType.SLIDER:
    case FieldDataType.PERCENTAGE:
    case FieldDataType.RATING:
    case FieldDataType.CURRENCY:
      return { type: "number" };
    case FieldDataType.BOOLEAN:
      return { type: "boolean" };
    case FieldDataType.EMAIL:
      return { type: "string", format: "email" };
    case FieldDataType.URL:
    case FieldDataType.LINK:
    case FieldDataType.IMAGE:
      return { type: "string", format: "uri" };
    case FieldDataType.UUID:
      return { type: "string", format: "uuid" };
    case FieldDataType.DATE:
      return { type: "string", format: "date" };
    case FieldDataType.DATETIME:
      return { type: "string", format: "date-time" };
    case FieldDataType.TIME:
      return { type: "string", format: "time" };
    case FieldDataType.PASSWORD:
      return { type: "string", format: "password" };
    case FieldDataType.COLOR:
      return { type: "string", format: "color" };
    case FieldDataType.TAGS:
    case FieldDataType.TEXT_ARRAY:
    case FieldDataType.MULTISELECT:
    case FieldDataType.FILTER_PILLS:
      return { type: "array", items: { type: "string" } };
    case FieldDataType.JSON:
    case FieldDataType.OBJECT:
      return { type: "object" };
    case FieldDataType.ARRAY:
      return { type: "array" };
    // TEXT, TEL, TEXTAREA, SELECT, TIMEZONE, CURRENCY_SELECT,
    // LANGUAGE_SELECT, COUNTRY_SELECT, ICON, BADGE, STATUS, CODE,
    // MARKDOWN, AVATAR - all string
    default:
      return { type: "string" };
  }
}

/**
 * Enrich a JSON Schema object's properties using fieldType metadata from the
 * endpoint field tree. Walks the top-level children and applies accurate
 * type/format hints, preserving existing constraints (enum, min, max, pattern).
 *
 * Only overrides type/format - never removes constraints Zod already emitted.
 */
export function enrichJsonSchemaFromFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonSchema: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any> | undefined,
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any {
  if (
    !fields ||
    !jsonSchema ||
    typeof jsonSchema !== "object" ||
    !jsonSchema.properties ||
    typeof jsonSchema.properties !== "object"
  ) {
    return jsonSchema;
  }

  for (const [key, field] of Object.entries(fields)) {
    if (!field || typeof field !== "object") {
      continue;
    }
    const prop = jsonSchema.properties[key];
    if (!prop || typeof prop !== "object") {
      continue;
    }
    const fieldType = (field as Record<string, string>).fieldType;
    if (!fieldType) {
      continue;
    }

    const hint = fieldDataTypeToJsonSchemaHint(fieldType);

    // Apply type override - but only when the current type is missing,
    // is "string" (may be wrong from io:input), or is an anyOf without a clear type.
    // Never downgrade a more specific type (e.g. don't overwrite "integer" with "number").
    const currentType = prop.type;
    const shouldOverrideType =
      !currentType ||
      // anyOf with no top-level type - add the hint type
      (!("type" in prop) && "anyOf" in prop) ||
      // Zod emitted "string" from io:input for a coerced number/int - upgrade it
      (currentType === "string" &&
        (hint.type === "number" ||
          hint.type === "integer" ||
          hint.type === "boolean" ||
          hint.type === "array" ||
          hint.type === "object")) ||
      // Zod emitted "number" but fieldType says integer - upgrade precision
      (currentType === "number" && hint.type === "integer");

    if (shouldOverrideType) {
      prop.type = hint.type;
    }

    // Always apply format from fieldType if not already set by Zod
    if (hint.format && !prop.format) {
      prop.format = hint.format;
    }

    // For array fieldTypes, add items hint if missing
    if (hint.type === "array" && hint.items && !prop.items) {
      prop.items = hint.items;
    }
  }

  return jsonSchema;
}
