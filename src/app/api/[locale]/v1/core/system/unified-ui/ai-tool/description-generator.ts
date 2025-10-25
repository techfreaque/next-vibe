/**
 * Description Generator
 * Generates AI-friendly tool descriptions from endpoint definitions
 */

import "server-only";

import type { ToolFactoryOptions } from "./factory";
import type { DiscoveredEndpoint } from "./types";

/**
 * Generate tool description from endpoint definition
 */
export function generateToolDescription(
  endpoint: DiscoveredEndpoint,
  options: ToolFactoryOptions = {},
): string {
  // Use custom description if provided
  if (options.description) {
    return options.description;
  }

  // Use AI tool instructions if available (highest priority)
  if (endpoint.definition?.aiTool?.instructions) {
    return endpoint.definition.aiTool.instructions;
  }

  // Build description from endpoint metadata
  return buildDescriptionFromMetadata(endpoint, options);
}

/**
 * Build description from endpoint metadata
 */
function buildDescriptionFromMetadata(
  endpoint: DiscoveredEndpoint,
  options: ToolFactoryOptions,
): string {
  const parts: string[] = [];

  // Add title/description
  if (endpoint.definition?.description) {
    parts.push(endpoint.definition.description);
  }

  // Add usage instructions
  // eslint-disable-next-line i18next/no-literal-string
  parts.push(`\nEndpoint: ${endpoint.method} ${endpoint.path.join("/")}`);

  // Add parameter hints if verbose
  if (options.verbose && endpoint.definition?.fields) {
    // eslint-disable-next-line i18next/no-literal-string
    parts.push("\nParameters: See the input schema for available parameters.");
  }

  return parts.join("\n");
}

/**
 * Check if endpoint has a valid description
 */
export function hasValidDescription(endpoint: DiscoveredEndpoint): boolean {
  return !!(
    endpoint.definition?.aiTool?.instructions ||
    endpoint.definition?.description
  );
}
