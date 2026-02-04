import "server-only";

import { z } from "zod";

import { zodSchemaToJsonSchema } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/endpoint-to-metadata";
import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { endpointToToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import {
  hasChild,
  hasChildren,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/type-guards";
import type { SchemaTypes } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { MCPTool } from "./types";

/**
 * Generate input schema from endpoint fields with descriptions
 * Combines RequestData and RequestUrlParams for MCP tools
 */
function generateInputSchema(
  endpoint: CreateApiEndpointAny,
  locale: CountryLanguage,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  if (!endpoint.fields) {
    return z.object({});
  }

  try {
    // Combine request data and URL params
    const requestDataSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestData,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

    const urlPathParamsSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestUrlParams,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

    const combinedShape: { [key: string]: z.ZodTypeAny } = {};

    if (requestDataSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, requestDataSchema.shape);
    }

    if (urlPathParamsSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, urlPathParamsSchema.shape);
    }

    if (Object.keys(combinedShape).length === 0) {
      return z.object({});
    }
    // Add descriptions from field metadata
    const shapeWithDescriptions = addFieldDescriptions(
      combinedShape,
      endpoint.fields,
      locale,
      endpoint,
    );

    return z.object(shapeWithDescriptions);
  } catch {
    return z.object({});
  }
}

/**
 * Add descriptions to schema fields from endpoint field metadata
 * Recursively processes nested objects and arrays
 */
function addFieldDescriptions<TFields>(
  shape: Record<string, z.ZodTypeAny>,
  fields: TFields,
  locale: CountryLanguage,
  endpoint: CreateApiEndpointAny,
): Record<string, z.ZodTypeAny> {
  if (!fields) {
    return shape;
  }

  if (!hasChildren(fields)) {
    return shape;
  }

  const enhancedShape: Record<string, z.ZodTypeAny> = {};

  for (const [key, schema] of Object.entries(shape)) {
    const fieldDef = fields.children[key];
    if (!fieldDef) {
      enhancedShape[key] = schema;
      continue;
    }

    // Get description from field config if available
    let description: string | undefined;
    if ("description" in fieldDef && typeof fieldDef.description === "string") {
      const descKey = fieldDef.description;
      const { t } = endpoint.scopedTranslation.scopedT(locale);
      description = t(descKey);
    }

    // Recursively process nested schemas
    let enhancedSchema = schema;

    // Handle ZodObject - recursively add descriptions to nested fields
    if (schema instanceof z.ZodObject) {
      enhancedSchema = addDescriptionsToZodObject(
        schema,
        fieldDef,
        locale,
        endpoint,
      );
    }
    // Handle ZodArray - recursively add descriptions to array items
    else if (
      schema instanceof z.ZodArray &&
      "schemaType" in fieldDef &&
      typeof fieldDef.schemaType === "string"
    ) {
      enhancedSchema = addDescriptionsToZodArray(
        schema,
        fieldDef as { schemaType: SchemaTypes },
        locale,
        endpoint,
      );
    }
    // Handle ZodOptional/ZodNullable - unwrap and process inner schema
    else if (
      schema instanceof z.ZodOptional ||
      schema instanceof z.ZodNullable
    ) {
      enhancedSchema = addDescriptionsToWrappedSchema(
        schema,
        fieldDef,
        locale,
        endpoint,
      );
    }

    // Add description to schema
    enhancedShape[key] = description
      ? enhancedSchema.describe(description)
      : enhancedSchema;
  }

  return enhancedShape;
}

/**
 * Add descriptions to ZodObject fields recursively
 */
function addDescriptionsToZodObject<TFieldDef>(
  schema: z.ZodTypeAny,
  fieldDef: TFieldDef,
  locale: CountryLanguage,
  endpoint: CreateApiEndpointAny,
): z.ZodTypeAny {
  if (!(schema instanceof z.ZodObject)) {
    return schema;
  }

  // Use type guard to narrow to object fields
  if (!hasChildren(fieldDef)) {
    return schema;
  }

  const shape: Record<string, z.ZodTypeAny> = { ...schema.shape };
  const enhancedShape = addFieldDescriptions(shape, fieldDef, locale, endpoint);

  return z.object(enhancedShape);
}

/**
 * Add descriptions to ZodArray item schema recursively
 */
function addDescriptionsToZodArray<
  TFieldDef extends { schemaType: SchemaTypes },
>(
  schema: z.ZodTypeAny,
  fieldDef: TFieldDef,
  locale: CountryLanguage,
  endpoint: CreateApiEndpointAny,
): z.ZodTypeAny {
  if (!(schema instanceof z.ZodArray)) {
    return schema;
  }

  // Use type guard to narrow to array fields
  if (!hasChild(fieldDef)) {
    return schema;
  }

  const itemSchema = schema.element;

  // If array items are objects, recursively add descriptions
  if (itemSchema instanceof z.ZodObject) {
    const enhancedItemSchema = addDescriptionsToZodObject(
      itemSchema,
      fieldDef.child,
      locale,
      endpoint,
    );
    return z.array(enhancedItemSchema);
  }

  return schema;
}

/**
 * Add descriptions to wrapped schemas (ZodOptional, ZodNullable)
 */
function addDescriptionsToWrappedSchema<TFieldDef>(
  schema: z.ZodTypeAny,
  fieldDef: TFieldDef,
  locale: CountryLanguage,
  endpoint: CreateApiEndpointAny,
): z.ZodTypeAny {
  if (
    !(schema instanceof z.ZodOptional) &&
    !(schema instanceof z.ZodNullable)
  ) {
    return schema;
  }

  const innerSchema = schema.unwrap();

  // Recursively process inner schema
  if (innerSchema instanceof z.ZodObject) {
    const enhancedInner = addDescriptionsToZodObject(
      innerSchema,
      fieldDef,
      locale,
      endpoint,
    );
    if (schema instanceof z.ZodOptional) {
      return enhancedInner.optional();
    } else {
      return enhancedInner.nullable();
    }
  } else if (
    innerSchema instanceof z.ZodArray &&
    typeof fieldDef === "object" &&
    fieldDef !== null &&
    "schemaType" in fieldDef &&
    typeof fieldDef.schemaType === "string"
  ) {
    const enhancedInner = addDescriptionsToZodArray(
      innerSchema,
      fieldDef as { schemaType: SchemaTypes },
      locale,
      endpoint,
    );
    if (schema instanceof z.ZodOptional) {
      return enhancedInner.optional();
    } else {
      return enhancedInner.nullable();
    }
  }

  return schema;
}

/**
 * Convert endpoint to MCP tool format
 * Uses shared zodSchemaToJsonSchema for consistent schema conversion
 */
export function endpointToMCPTool(
  endpoint: CreateApiEndpointAny,
  locale: CountryLanguage,
): MCPTool {
  // Use first alias if available, otherwise fall back to full tool name using shared utility
  const toolName =
    endpoint.aliases && endpoint.aliases.length > 0
      ? endpoint.aliases[0]
      : endpointToToolName(endpoint);

  // Translate description - use description or title
  const { t } = endpoint.scopedTranslation.scopedT(locale);
  const descriptionKey = endpoint.description || endpoint.title;
  const translatedDescription = descriptionKey ? t(descriptionKey) : "";

  // Compact description - just the translated text, no verbose paths
  const description = translatedDescription || toolName;

  // Generate Zod schema from endpoint fields with translated descriptions
  const zodSchema = generateInputSchema(endpoint, locale);

  // Convert to JSON Schema using shared utility
  // z.toJSONSchema automatically handles transforms and includes descriptions
  const jsonSchema = zodSchemaToJsonSchema(zodSchema);

  return {
    name: toolName,
    description,
    inputSchema: jsonSchema as MCPTool["inputSchema"],
  };
}
