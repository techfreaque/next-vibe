/**
 * Zod Required Fields Utility
 *
 * Safely extracts required field names from Zod schemas
 */

import { z } from "zod";

/**
 * Safely extracts required field names from a Zod schema
 * @param schema - The Zod schema to analyze
 * @returns Array of required field names
 */
export function safeGetRequiredFields(schema: z.ZodTypeAny): string[] {
  try {
    // Handle ZodObject schemas
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape as Record<string, z.ZodTypeAny>;
      const requiredFields: string[] = [];

      for (const [key, fieldSchema] of Object.entries(shape)) {
        if (isFieldRequired(fieldSchema)) {
          requiredFields.push(key);
        }
      }

      return requiredFields;
    }

    // Handle other schema types that might have nested objects

    if (
      "typeName" in schema._def &&
      schema._def.typeName === "ZodEffects" &&
      "schema" in schema._def
    ) {
      return safeGetRequiredFields(schema._def.schema as z.ZodTypeAny);
    }

    if (schema instanceof z.ZodDefault) {
      return safeGetRequiredFields(schema._def.innerType as z.ZodTypeAny);
    }

    if (schema instanceof z.ZodOptional) {
      return []; // Optional schemas have no required fields
    }

    if (schema instanceof z.ZodNullable) {
      return []; // Nullable schemas have no required fields
    }

    // For other schema types, return empty array
    return [];
  } catch {
    // If anything goes wrong, return empty array to be safe
    return [];
  }
}

/**
 * Checks if a field schema is required (not optional, nullable, or has default)
 * @param fieldSchema - The field schema to check
 * @returns True if the field is required
 */
function isFieldRequired(fieldSchema: z.ZodTypeAny): boolean {
  try {
    // Check if field is optional
    if (fieldSchema instanceof z.ZodOptional) {
      return false;
    }

    // Check if field is nullable
    if (fieldSchema instanceof z.ZodNullable) {
      return false;
    }

    // Check if field has a default value
    if (fieldSchema instanceof z.ZodDefault) {
      return false;
    }

    // Check if field is wrapped in effects (like transforms)

    if (
      "typeName" in fieldSchema._def &&
      fieldSchema._def.typeName === "ZodEffects" &&
      "schema" in fieldSchema._def
    ) {
      return isFieldRequired(fieldSchema._def.schema as z.ZodTypeAny);
    }

    // For union types, check if undefined/null is allowed
    if (fieldSchema instanceof z.ZodUnion) {
      const options = fieldSchema._def.options as z.ZodTypeAny[];
      const hasUndefined = options.some(
        (option: z.ZodTypeAny) =>
          option instanceof z.ZodUndefined || option instanceof z.ZodNull,
      );
      return !hasUndefined;
    }

    // For intersection types, all parts must be satisfied
    if (fieldSchema instanceof z.ZodIntersection) {
      return (
        isFieldRequired(fieldSchema._def.left as z.ZodTypeAny) &&
        isFieldRequired(fieldSchema._def.right as z.ZodTypeAny)
      );
    }

    // By default, assume the field is required
    return true;
  } catch {
    // If anything goes wrong, assume field is not required to be safe
    return false;
  }
}
