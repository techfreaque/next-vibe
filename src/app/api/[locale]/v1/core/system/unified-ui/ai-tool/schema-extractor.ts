/**
 * Schema Extractor
 * Extracts Zod schemas from endpoint field definitions
 */

import "server-only";

import { z } from "zod";

import type { EndpointDefinition } from "../cli/vibe/endpoints/endpoint-types/core/types";
import type { DiscoveredEndpoint } from "./types";

/**
 * Extract input schema from endpoint definition
 */
export function extractInputSchema(endpoint: DiscoveredEndpoint): z.ZodTypeAny {
  // If endpoint has a request schema, use it directly
  if (endpoint.definition?.requestSchema) {
    return endpoint.definition.requestSchema;
  }

  // If endpoint has fields, try to extract request schema
  if (endpoint.definition?.fields) {
    return extractSchemaFromFields(endpoint.definition);
  }

  // Fallback to empty object
  return z.object({});
}

/**
 * Extract schema from field definitions
 * This is a simplified version - full implementation would need to handle all field types
 */
function extractSchemaFromFields(
  _definition: EndpointDefinition,
): z.ZodTypeAny {
  // For now, return a generic object schema that accepts any fields
  // TODO: Implement full field-to-schema conversion
  // This would require analyzing the field definitions and converting them to Zod schemas
  return z.object({}).passthrough();
}

/**
 * Check if endpoint has a valid input schema
 */
export function hasValidInputSchema(endpoint: DiscoveredEndpoint): boolean {
  return !!(endpoint.definition?.requestSchema || endpoint.definition?.fields);
}
