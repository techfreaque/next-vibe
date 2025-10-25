/**
 * Widget Metadata Extractor
 * Shared utility for extracting widget metadata from endpoint definitions
 */

import "server-only";

import type { EndpointLogger } from "../cli/vibe/endpoints/endpoint-handler/logger";
import { responseMetadataExtractor } from "../cli/vibe/endpoints/renderers/cli-ui/response-metadata-extractor";
import type { DiscoveredEndpoint, ToolCallWidgetMetadata } from "./types";

/**
 * Extract widget metadata from an endpoint definition
 */

export function extractWidgetMetadata(
  endpoint: DiscoveredEndpoint,
  // eslint-disable-next-line no-restricted-syntax
  resultData: unknown,
  logger: EndpointLogger,
): ToolCallWidgetMetadata | null {
  try {
    if (!endpoint.definition) {
      return null;
    }

    // Extract response metadata from endpoint definition
    const responseMetadata = responseMetadataExtractor.extractResponseMetadata(
      endpoint.definition,
      resultData || {},
    );

    if (!responseMetadata || responseMetadata.fields.length === 0) {
      return null;
    }

    // Convert to ToolCallWidgetMetadata format
    const widgetMetadata: ToolCallWidgetMetadata = {
      endpointId: endpoint.id,
      responseFields: responseMetadata.fields.map((field) => ({
        name: field.name,
        widgetType: field.widgetType,
        label: field.label,
        description: field.description,
        layout: field.config ? { ...field.config } : undefined,
        validation: field.required ? { required: field.required } : undefined,
        options: field.choices?.map((choice) => ({
          value: choice,
          label: choice,
        })),
      })),
      creditsUsed: endpoint.definition.credits,
    };

    logger.debug("[Widget Metadata Extractor] Metadata extracted", {
      endpointId: endpoint.id,
      fieldCount: widgetMetadata.responseFields.length,
    });

    return widgetMetadata;
  } catch (error) {
    logger.warn("[Widget Metadata Extractor] Failed to extract metadata", {
      endpointId: endpoint.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Extract widget metadata by endpoint ID
 */

export async function extractWidgetMetadataById(
  endpointId: string,
  // eslint-disable-next-line no-restricted-syntax
  resultData: unknown,
  logger: EndpointLogger,
): Promise<ToolCallWidgetMetadata | null> {
  try {
    // Lazy load to avoid circular dependencies
    const { toolDiscovery } = await import("./index");

    // Get endpoint definition
    const allEndpoints = await toolDiscovery.discover({ cache: true });
    const endpoint = allEndpoints.find((e) => e.id === endpointId);

    if (!endpoint) {
      logger.warn("[Widget Metadata Extractor] Endpoint not found", {
        endpointId,
      });
      return null;
    }

    return extractWidgetMetadata(endpoint, resultData, logger);
  } catch (error) {
    logger.warn(
      "[Widget Metadata Extractor] Failed to extract metadata by ID",
      {
        endpointId,
        error: error instanceof Error ? error.message : String(error),
      },
    );
    return null;
  }
}
