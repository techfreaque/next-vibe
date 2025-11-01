/**
 * Endpoint Registry
 * Single source of truth for loading endpoint definitions from generated index
 */

import "server-only";

import { endpoints } from "@/app/api/[locale]/v1/core/system/generated/endpoints";
import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import type { ApiSection } from "../../types/endpoint";
import { normalizeRoutePath } from "../utils/normalize-route-path";

/**
 * Endpoint loading options
 */
export interface EndpointLoadOptions {
  /** Route path (can be filesystem path, normalized path, or alias) */
  routePath: string;
  /** HTTP method */
  method: Methods | string;
}

/**
 * Endpoint loading result
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Dynamic module loading requires 'unknown' for runtime type discovery
export interface EndpointLoadResult<TEndpoint = unknown> {
  /** Loaded endpoint definition */
  definition: TEndpoint | null;
  /** Where the definition was loaded from */
  source: "generated-index" | null;
  /** Error if loading failed */
  error?: string;
}

/**
 * Endpoint Registry Class
 * Centralized endpoint definition loading with normalization
 */
export class EndpointRegistry {
  /**
   * Load endpoint definition from generated index
   */
  // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Definition type extraction requires 'unknown' for generic module support
  loadDefinition<TEndpoint = unknown>(
    options: EndpointLoadOptions,
    logger: EndpointLogger,
  ): EndpointLoadResult<TEndpoint> {
    const { routePath: originalPath, method } = options;

    // Normalize the path
    const routePath = normalizeRoutePath(originalPath);

    logger.debug(`[Endpoint Registry] Loading endpoint definition`, {
      originalPath,
      routePath,
      method,
    });

    try {
      // Navigate through the endpoints object
      const pathSegments = routePath.split("/");
      let currentSection: ApiSection | undefined = endpoints as ApiSection;

      for (const segment of pathSegments) {
        if (
          currentSection &&
          typeof currentSection === "object" &&
          segment in currentSection
        ) {
          currentSection = (currentSection as Record<string, ApiSection>)[
            segment
          ];
        } else {
          currentSection = undefined;
          break;
        }
      }

      if (!currentSection) {
        logger.debug(`[Endpoint Registry] No endpoint found`, {
          originalPath,
          routePath,
        });
        return {
          definition: null,
          source: null,
          error: "Endpoint not found in generated index",
        };
      }

      // Extract definition for the specific method
      const definitions = currentSection as Record<string, TEndpoint>;
      const definition =
        definitions[method] || definitions.POST || definitions.GET || null;

      if (definition) {
        logger.debug(`[Endpoint Registry] Found definition`, {
          method,
          routePath,
        });
        return {
          definition: definition as TEndpoint,
          source: "generated-index",
        };
      }

      return {
        definition: null,
        source: null,
        error: "Method not found in endpoint definition",
      };
    } catch (error) {
      logger.debug(`[Endpoint Registry] Failed to load definition`, {
        originalPath,
        routePath,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        definition: null,
        source: null,
        error: "Failed to load from generated index",
      };
    }
  }

  /**
   * Check if an endpoint exists
   */
  hasEndpoint(path: string): boolean {
    const normalized = normalizeRoutePath(path);
    const pathSegments = normalized.split("/");
    let currentSection: ApiSection | undefined = endpoints as ApiSection;

    for (const segment of pathSegments) {
      if (
        currentSection &&
        typeof currentSection === "object" &&
        segment in currentSection
      ) {
        currentSection = (currentSection as Record<string, ApiSection>)[
          segment
        ];
      } else {
        return false;
      }
    }

    return currentSection !== undefined;
  }
}

/**
 * Singleton instance
 */
export const endpointRegistry = new EndpointRegistry();
