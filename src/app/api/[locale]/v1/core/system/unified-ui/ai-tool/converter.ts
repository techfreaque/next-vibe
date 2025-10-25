/**
 * AI Tool Converter
 * Converts endpoint definitions to AI SDK tool specifications
 */

import "server-only";

import { tool } from "ai";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { aiToolConfig } from "./config";
import { AI_TOOL_CONSTANTS } from "./constants";
import type {
  AIToolMetadata,
  CoreTool,
  DiscoveredEndpoint,
  IToolConverter,
  ToolConverterOptions,
  ToolParameterValue,
} from "./types";

/**
 * Tool Converter Implementation
 */
export class ToolConverter implements IToolConverter {
  /**
   * Convert endpoint to AI tool metadata
   */
  async convert(
    endpoint: DiscoveredEndpoint,
    options: ToolConverterOptions = {},
  ): Promise<AIToolMetadata> {
    const defaultLocale: CountryLanguage = "en-GLOBAL";
    const locale = options.locale || defaultLocale;
    const description = await this.generateDescription(
      endpoint,
      locale,
      options,
    );

    // Extract request schema for parameters
    const parameters = this.extractParameters(endpoint);

    // Get category from path (e.g., "system", "user", "leads")
    const category = this.extractCategory(endpoint);

    // Get tags from definition
    const tags = this.extractTags(endpoint);

    // Generate display name from title or path
    const displayName = this.generateDisplayName(endpoint, locale);

    // Extract icon and cost from definition metadata
    const icon = endpoint.definition.aiTool?.icon;
    const cost = endpoint.definition.credits ?? 0;

    const metadata: AIToolMetadata = {
      name: endpoint.toolName,
      displayName,
      description,
      icon,
      category,
      tags,
      cost,
      endpointId: endpoint.id,
      allowedRoles: endpoint.allowedRoles,
      isManualTool: false,
      parameters,
    };

    return metadata;
  }

  /**
   * Convert endpoint to AI SDK CoreTool
   */
  async convertToAISDKTool(
    endpoint: DiscoveredEndpoint,
    executor: (
      params: Record<string, ToolParameterValue>,
    ) => Promise<ToolParameterValue>,
    options: ToolConverterOptions = {},
  ): Promise<CoreTool> {
    const defaultLocale: CountryLanguage = "en-GLOBAL";
    const locale = options.locale || defaultLocale;
    const description = await this.generateDescription(
      endpoint,
      locale,
      options,
    );

    // Extract request schema for parameters
    const parameters = this.extractParameters(endpoint);

    // Create AI SDK tool
    // Use type assertion to work around tool() generic inference issues
    const aiTool = tool({
      description,
      parameters: parameters || z.object({}),
      execute: executor,
    }) as CoreTool;

    return aiTool;
  }

  /**
   * Generate display name from endpoint
   */
  generateDisplayName(
    endpoint: DiscoveredEndpoint,
    locale: CountryLanguage,
  ): string {
    const { t } = simpleT(locale);
    const { definition } = endpoint;

    // Try to get translated title
    let displayName = "";

    try {
      if (definition.aiTool?.displayName) {
        displayName = definition.aiTool.displayName;
      } else if (definition.title) {
        displayName = t(definition.title);
      }
    } catch {
      // Translation failed, use key as fallback
      displayName = definition.aiTool?.displayName || definition.title || "";
    }

    // If still empty, generate from path
    if (!displayName) {
      displayName = this.generateDisplayNameFromPath([...endpoint.path]);
    }

    return displayName;
  }

  /**
   * Generate tool description from endpoint
   */
  generateDescription(
    endpoint: DiscoveredEndpoint,
    locale: CountryLanguage,
    options: ToolConverterOptions = {},
  ): Promise<string> {
    const { t } = simpleT(locale);
    const { definition } = endpoint;

    // Try to get translated description
    let description = "";

    try {
      if (definition.description) {
        description = t(definition.description);
      } else if (definition.title) {
        description = t(definition.title);
      }
    } catch {
      // Translation failed, use key as fallback
      description = definition.description || definition.title || "";
    }

    // If still empty, generate from path
    if (!description) {
      description = this.generateDescriptionFromPath([...endpoint.path]);
    }

    // Add examples if configured
    if (options.includeExamples && definition.examples) {
      const exampleDesc = this.generateExampleDescription(endpoint);
      if (exampleDesc) {
        description += AI_TOOL_CONSTANTS.converter.examplePrefix + exampleDesc;
      }
    }

    // Truncate if needed
    if (options.maxDescriptionLength) {
      description = description.slice(0, options.maxDescriptionLength);
    }

    return Promise.resolve(description);
  }

  /**
   * Convert endpoint path to tool name
   */
  pathToToolName(path: string[]): string {
    const { prefix, separator } = aiToolConfig.naming;

    // Remove version and core segments
    const versionSegments = AI_TOOL_CONSTANTS.converter.versionSegments;
    const filteredSegments = path.filter(
      (segment) => !(versionSegments as readonly string[]).includes(segment),
    );

    // Convert to snake_case
    const specialCharsRegex = /[^a-zA-Z0-9]+/g;
    const camelCaseRegex = /([a-z])([A-Z])/g;
    const underscore = AI_TOOL_CONSTANTS.converter.underscore;
    const dollarOne = AI_TOOL_CONSTANTS.converter.dollarOne;
    const dollarTwo = AI_TOOL_CONSTANTS.converter.dollarTwo;
    const name = filteredSegments
      .map((segment) =>
        segment
          .replace(specialCharsRegex, underscore)
          .replace(camelCaseRegex, `${dollarOne}${underscore}${dollarTwo}`)
          .toLowerCase(),
      )
      .join(separator);

    return prefix ? `${prefix}${separator}${name}` : name;
  }

  /**
   * Extract parameters schema from endpoint
   */
  private extractParameters(
    endpoint: DiscoveredEndpoint,
  ): z.ZodTypeAny | undefined {
    const { definition } = endpoint;

    // Get request schema
    if (definition.requestSchema) {
      return definition.requestSchema as z.ZodTypeAny;
    }

    return undefined;
  }

  /**
   * Extract category from endpoint path
   */
  private extractCategory(endpoint: DiscoveredEndpoint): string | undefined {
    // Get first meaningful segment after "core"
    const coreIndex = endpoint.path.findIndex((seg) => seg === "core");
    if (coreIndex >= 0 && coreIndex < endpoint.path.length - 1) {
      return endpoint.path[coreIndex + 1];
    }

    // Fallback to first segment
    return endpoint.path[0];
  }

  /**
   * Extract tags from endpoint
   */
  private extractTags(endpoint: DiscoveredEndpoint): string[] {
    const { definition } = endpoint;
    const tags: string[] = [];

    // Add tags from definition
    if (definition.tags) {
      tags.push(...definition.tags);
    }

    // Add category as tag
    const category = this.extractCategory(endpoint);
    if (category && !tags.includes(category)) {
      tags.push(category);
    }

    // Add method as tag
    tags.push(endpoint.method.toLowerCase());

    return tags;
  }

  /**
   * Generate display name from path segments
   */
  private generateDisplayNameFromPath(path: string[]): string {
    const versionSegments = AI_TOOL_CONSTANTS.converter.versionSegments;
    const filteredPath = path.filter(
      (seg) => !(versionSegments as readonly string[]).includes(seg),
    );

    // Convert path to readable title case

    const space = " ";
    // eslint-disable-next-line i18next/no-literal-string
    const dollarOne = "$1";
    // eslint-disable-next-line i18next/no-literal-string
    const dollarTwo = "$2";
    const readable = filteredPath
      .map((seg) =>
        seg
          .replace(/[^a-zA-Z0-9]+/g, space)
          .replace(/([a-z])([A-Z])/g, `${dollarOne} ${dollarTwo}`)
          .split(space)
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(space),
      )
      .join(space);

    return readable;
  }

  /**
   * Generate description from path segments
   */
  private generateDescriptionFromPath(path: string[]): string {
    const versionSegments = AI_TOOL_CONSTANTS.converter.versionSegments;
    const filteredPath = path.filter(
      (seg) => !(versionSegments as readonly string[]).includes(seg),
    );

    // Convert path to readable description
    const space = AI_TOOL_CONSTANTS.converter.space;
    const dollarOne = AI_TOOL_CONSTANTS.converter.dollarOne;
    const dollarTwo = AI_TOOL_CONSTANTS.converter.dollarTwo;
    const readable = filteredPath
      .map((seg) =>
        seg
          .replace(/[^a-zA-Z0-9]+/g, space)
          .replace(/([a-z])([A-Z])/g, `${dollarOne}${space}${dollarTwo}`)
          .toLowerCase(),
      )
      .join(space);

    return `${AI_TOOL_CONSTANTS.converter.endpointForPrefix}${readable}`;
  }

  /**
   * Generate example description
   */
  private generateExampleDescription(
    endpoint: DiscoveredEndpoint,
  ): string | null {
    const { definition } = endpoint;

    if (!definition.examples?.requests) {
      return null;
    }

    // Get first example
    const exampleKeys = Object.keys(definition.examples.requests);
    if (exampleKeys.length === 0) {
      return null;
    }

    const firstKey = exampleKeys[0];
    const example = definition.examples.requests[firstKey];

    if (!example || typeof example !== "object") {
      return null;
    }

    // Format example as JSON
    try {
      return JSON.stringify(example, null, 2);
    } catch {
      return null;
    }
  }

  /**
   * Enhance schema with AI-friendly descriptions
   */
  private enhanceSchemaDescriptions(schema: z.ZodTypeAny): z.ZodTypeAny {
    // This is a placeholder for future enhancement
    // Could add more detailed descriptions to schema fields
    return schema;
  }
}

/**
 * Singleton instance
 */
let toolConverterInstance: ToolConverter | null = null;

/**
 * Get or create tool converter instance
 */
export function getToolConverter(): ToolConverter {
  if (!toolConverterInstance) {
    toolConverterInstance = new ToolConverter();
  }
  return toolConverterInstance;
}

/**
 * Export singleton
 */
export const toolConverter = getToolConverter();
