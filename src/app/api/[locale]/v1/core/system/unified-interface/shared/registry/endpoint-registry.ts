/**
 * Endpoint Registry
 * Single source of truth for loading endpoint definitions from generated index
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import { endpoints } from "@/app/api/[locale]/v1/core/system/generated/endpoints";
import type { EndpointLogger } from "../logger/endpoint";
import type { Methods } from "../types/enums";
import type { ApiSection, CreateApiEndpointAny } from "../types/endpoint";
import { normalizeRoutePath } from "./normalize-route-path";
import type { DefinitionLoaderResult } from "./definition-loader";

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
 * Endpoint Registry Class
 * Centralized endpoint definition loading with normalization
 */
export class EndpointRegistry {
  /**
   * Load endpoint definition from generated index
   */
  loadDefinition<TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny>(
    options: EndpointLoadOptions,
    logger: EndpointLogger,
  ): DefinitionLoaderResult<TEndpoint> {
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
      let currentSection: ApiSection | undefined = endpoints;

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

      const definition = currentSection[method];

      if (definition && typeof definition === "object" && "method" in definition) {
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
        error: parseError(error).message,
      });
      return {
        definition: null,
        source: null,
        error: "Failed to load from generated index",
      };
    }
  }

  /**
   * Load entire endpoint section (all methods)
   */
  loadSection(
    routePath: string,
    logger: EndpointLogger,
  ): DefinitionLoaderResult<ApiSection> {
    const normalized = normalizeRoutePath(routePath);

    logger.debug(`[Endpoint Registry] Loading endpoint section`, {
      routePath,
      normalized,
    });

    try {
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
          currentSection = undefined;
          break;
        }
      }

      if (!currentSection) {
        return {
          definition: null,
          source: null,
          error: "Endpoint section not found",
        };
      }

      return {
        definition: currentSection,
        source: "generated-index",
      };
    } catch (error) {
      return {
        definition: null,
        source: null,
        error: parseError(error).message,
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
