/**
 * AI Tools Route Handler
 * Handles GET requests for available AI tools
 * Supports search by query (matches name, description, aliases, tags)
 * and filtering by category.
 * When toolName is provided, returns detail view with parameter schema.
 */

import { success } from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import { definitionsRegistry } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definitions/registry";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  FieldUsage,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  endpointToToolName,
  getPreferredToolName,
} from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

import toolsDefinition, { type AIToolsListResponseOutput } from "./definition";

type ToolItem = AIToolsListResponseOutput["tools"][number];

/**
 * Generate JSON Schema for an endpoint's input parameters.
 * Combines RequestData + RequestUrlParams into one object schema.
 */
function getParameterSchema(
  endpoint: ReturnType<typeof definitionsRegistry.getEndpointsForUser>[number],
): ToolItem["parameters"] | null {
  if (!endpoint.fields) {
    return null;
  }

  try {
    const requestDataSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestData,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

    const urlPathParamsSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestUrlParams,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

    const combinedShape: Record<string, z.ZodTypeAny> = {};

    if (requestDataSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, requestDataSchema.shape);
    }

    if (urlPathParamsSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, urlPathParamsSchema.shape);
    }

    if (Object.keys(combinedShape).length === 0) {
      return null;
    }

    const combined = z.object(combinedShape);
    const schema = z.toJSONSchema(combined, {
      target: "draft-7",
      io: "input",
      unrepresentable: "any",
      override: (ctx) => {
        if (ctx.zodSchema._zod.def.type === "custom") {
          ctx.jsonSchema.type = "object";
        }
      },
    });
    // z.toJSONSchema returns a JSON-serializable object that satisfies Record<string, ...>
    return schema;
  } catch {
    return null;
  }
}

/** Serialize a tool to the compact response shape (matches the Zod schema) */
function serializeTool(
  tool: ReturnType<
    typeof definitionsRegistry.getSerializedToolsForUser
  >[number],
  parameters?: ToolItem["parameters"],
): ToolItem {
  return {
    name: tool.name,
    method: tool.method,
    description: tool.description,
    category: tool.category,
    tags: tool.tags,
    toolName: tool.toolName,
    allowedRoles: tool.allowedRoles,
    aliases: tool.aliases,
    requiresConfirmation: tool.requiresConfirmation,
    parameters,
  };
}

/** Serialize a tool for compact search results (omit heavy fields) */
function serializeToolCompact(
  tool: ReturnType<
    typeof definitionsRegistry.getSerializedToolsForUser
  >[number],
): ToolItem {
  return {
    name: tool.toolName,
    method: tool.method,
    description: tool.description,
    category: tool.category,
    tags: [],
    toolName: tool.toolName,
    allowedRoles: [],
    aliases: tool.aliases,
  };
}

/** Max tools returned in search/category mode to avoid context overflow */
const MAX_COMPACT_RESULTS = 25;

export const { GET, tools } = endpointsHandler({
  endpoint: toolsDefinition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, locale, data, platform }) => {
      const isAI = platform === Platform.AI;
      const allTools = definitionsRegistry.getSerializedToolsForUser(
        Platform.AI,
        user,
        locale,
      );

      const totalCount = allTools.length;

      // Build category summary (used in overview and as context)
      const categoryMap = new Map<string, number>();
      for (const tool of allTools) {
        const cat = tool.category || "Other";
        categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
      }
      const categories = [...categoryMap.entries()]
        .toSorted((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

      // Detail mode: return full info for a specific tool
      if (data.toolName) {
        const needle = data.toolName.toLowerCase().trim();
        const matchedTool = allTools.find(
          (tool) =>
            tool.toolName.toLowerCase() === needle ||
            tool.name.toLowerCase() === needle ||
            tool.aliases?.some((a) => a.toLowerCase() === needle),
        );

        if (!matchedTool) {
          return success({
            tools: [] satisfies ToolItem[],
            totalCount,
            matchedCount: 0,
            categories,
            hint: `Tool "${data.toolName}" not found. Use query to search by keyword.`,
          });
        }

        // Find the actual endpoint to extract parameter schema
        const allEndpoints = definitionsRegistry.getEndpointsForUser(
          Platform.AI,
          user,
        );
        const endpoint = allEndpoints.find((e) => {
          const preferred = getPreferredToolName(e);
          const internal = endpointToToolName(e);
          return (
            preferred.toLowerCase() === needle ||
            internal.toLowerCase() === needle ||
            e.aliases?.some((a) => a.toLowerCase() === needle)
          );
        });

        const parameters = endpoint
          ? (getParameterSchema(endpoint) ?? undefined)
          : undefined;

        return success({
          tools: [serializeTool(matchedTool, parameters)],
          totalCount,
          matchedCount: 1,
        });
      }

      // Search/filter mode
      const query = data.query?.toLowerCase().trim();
      const category = data.category?.toLowerCase().trim();

      // AI overview mode: no params → category summary only (saves context tokens)
      if (isAI && !query && !category) {
        return success({
          tools: [] satisfies ToolItem[],
          totalCount,
          matchedCount: 0,
          categories,
          hint: "Use query to search by keyword, category to list tools in a category, or toolName to get full parameter schema for a specific tool.",
        });
      }

      let filtered = allTools;

      if (query) {
        filtered = filtered.filter(
          (tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.toolName.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.aliases?.some((a) => a.toLowerCase().includes(query)) ||
            tool.tags.some((t) => t.toLowerCase().includes(query)),
        );
      }

      if (category) {
        filtered = filtered.filter((tool) =>
          tool.category?.toLowerCase().includes(category),
        );
      }

      const matchedCount = filtered.length;

      // AI: compact results capped at 25 to save context tokens
      // Web/CLI/MCP: full results for UI rendering
      if (isAI) {
        const capped = filtered.slice(0, MAX_COMPACT_RESULTS);
        const compactTools = capped.map(serializeToolCompact);

        const hint =
          matchedCount > MAX_COMPACT_RESULTS
            ? `Showing ${MAX_COMPACT_RESULTS} of ${matchedCount} matches. Narrow your search or use toolName to get details for a specific tool.`
            : undefined;

        return success({
          tools: compactTools,
          totalCount,
          matchedCount,
          categories:
            matchedCount > MAX_COMPACT_RESULTS ? categories : undefined,
          hint,
        });
      }

      // Non-AI platforms: return full tool metadata
      return success({
        tools: filtered.map((tool) => serializeTool(tool)),
        totalCount,
        matchedCount,
        categories,
      });
    },
  },
});
