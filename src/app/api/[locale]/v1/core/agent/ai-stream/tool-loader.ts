/**
 * Tool Loader
 * Handles loading and initialization of AI tools (manual + dynamic)
 */

import "server-only";

import type { CoreTool } from "ai";

import { braveSearch } from "@/app/api/[locale]/v1/core/agent/brave-search/repository";
import { getToolExecutor } from "@/app/api/[locale]/v1/core/system/unified-ui/ai-tool/executor";
import { createToolsFromEndpoints } from "@/app/api/[locale]/v1/core/system/unified-ui/ai-tool/factory";
import type { AIToolMetadata } from "@/app/api/[locale]/v1/core/system/unified-ui/ai-tool/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Tool loading result
 */
export interface ToolLoadingResult {
  tools: Record<string, CoreTool>;
  manualToolCount: number;
  dynamicToolCount: number;
}

/**
 * Load AI tools (manual + dynamic) for a user
 */
export async function loadToolsForUser(
  enabledToolMetadata: AIToolMetadata[],
  userId: string | undefined,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ToolLoadingResult> {
  const tools: Record<string, CoreTool> = {};
  let manualToolCount = 0;
  let dynamicToolCount = 0;

  if (enabledToolMetadata.length === 0) {
    logger.debug("[Tool Loader] No tools enabled");
    return { tools, manualToolCount, dynamicToolCount };
  }

  // Separate manual tools from dynamic tools
  const manualTools = enabledToolMetadata.filter((t) => t.isManualTool);
  const dynamicTools = enabledToolMetadata.filter((t) => !t.isManualTool);

  // Load manual tools
  manualToolCount = loadManualTools(manualTools, tools, logger);

  // Load dynamic tools
  dynamicToolCount = await loadDynamicTools(
    dynamicTools,
    tools,
    userId,
    locale,
    logger,
  );

  logger.info("[Tool Loader] Tools loaded successfully", {
    total: Object.keys(tools).length,
    manual: manualToolCount,
    dynamic: dynamicToolCount,
  });

  return { tools, manualToolCount, dynamicToolCount };
}

/**
 * Load manual tools (braveSearch, etc.)
 */
function loadManualTools(
  manualTools: AIToolMetadata[],
  tools: Record<string, CoreTool>,
  logger: EndpointLogger,
): number {
  let count = 0;

  for (const toolMeta of manualTools) {
    if (toolMeta.name === "search") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      tools.search = braveSearch as CoreTool;
      count++;
      logger.debug("[Tool Loader] Added manual tool: search");
    }
    // Add more manual tools here as needed
  }

  return count;
}

/**
 * Load dynamic tools from endpoints
 */
async function loadDynamicTools(
  dynamicTools: AIToolMetadata[],
  tools: Record<string, CoreTool>,
  userId: string | undefined,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<number> {
  if (dynamicTools.length === 0) {
    return 0;
  }

  try {
    // Get tool executor
    const toolExecutor = getToolExecutor();

    // Get tool discovery to fetch endpoint definitions
    const { toolDiscovery } = await import(
      "@/app/api/[locale]/v1/core/system/unified-ui/ai-tool"
    );

    // Get all endpoints
    const allEndpoints = await toolDiscovery.discover({ cache: true });

    // Filter to only the endpoints we need
    const endpointIds = new Set(
      dynamicTools.map((t) => t.endpointId).filter((id): id is string => !!id),
    );

    const validEndpoints = allEndpoints.filter((e) => endpointIds.has(e.id));

    if (validEndpoints.length === 0) {
      logger.warn("[Tool Loader] No valid endpoints found for dynamic tools");
      return 0;
    }

    // Create tools from endpoints
    const dynamicToolsMap = createToolsFromEndpoints(
      validEndpoints,
      toolExecutor,
      {
        user: {
          id: userId,
          email: "",
          roles: [],
          isPublic: !userId,
        },
        locale,
        logger,
      },
    );

    // Add dynamic tools to tools object
    for (const [toolName, tool] of dynamicToolsMap.entries()) {
      tools[toolName] = tool;
      logger.debug("[Tool Loader] Added dynamic tool", { toolName });
    }

    logger.info("[Tool Loader] Dynamic tools created", {
      count: dynamicToolsMap.size,
      toolNames: Array.from(dynamicToolsMap.keys()),
    });

    return dynamicToolsMap.size;
  } catch (error) {
    logger.error("[Tool Loader] Failed to create dynamic tools", {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}
