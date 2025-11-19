/**
 * AI Tool Loader
 * Loads and prepares tools for AI execution
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CoreTool } from "./types";

export async function loadTools(params: {
  requestedTools: string[] | null | undefined;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  systemPrompt: string;
}): Promise<{
  tools: Record<string, CoreTool> | undefined;
  systemPrompt: string;
}> {
  let tools: Record<string, CoreTool> | undefined = undefined;
  let enhancedSystemPrompt = params.systemPrompt;

  if (
    params.requestedTools === null ||
    params.requestedTools === undefined ||
    params.requestedTools.length === 0
  ) {
    params.logger.debug("No tools requested, skipping tool loading");
    return { tools, systemPrompt: enhancedSystemPrompt };
  }

  try {
    const { ToolRegistry } =
      await import("@/app/api/[locale]/v1/core/system/unified-interface/ai/registry");

    const enabledEndpoints = await ToolRegistry.getEndpointsByIdsLazy(
      params.requestedTools,
      params.user,
    );

    params.logger.debug("Lazy loaded tools by endpoint IDs", {
      requestedCount: params.requestedTools.length,
      loadedCount: enabledEndpoints.length,
      loadedIds: enabledEndpoints.map((endpoint) => endpoint.id),
      loadedNames: enabledEndpoints.map((endpoint) => endpoint.toolName),
    });

    if (enabledEndpoints.length) {
      const { getToolExecutor } =
        await import("@/app/api/[locale]/v1/core/system/unified-interface/ai/executor");
      const { createToolsFromEndpoints } =
        await import("@/app/api/[locale]/v1/core/system/unified-interface/ai/factory");
      const toolExecutor = getToolExecutor();
      const toolsMap = createToolsFromEndpoints(
        enabledEndpoints,
        toolExecutor,
        {
          user: params.user,
          locale: params.locale,
          logger: params.logger,
        },
      );

      tools = Object.fromEntries(toolsMap.entries());

      params.logger.info("Tools created", {
        count: toolsMap.size,
        toolNames: [...toolsMap.keys()],
      });
    }
  } catch (error) {
    params.logger.error("Failed to load tools from registry", {
      error: parseError(error).message,
    });
  }

  return { tools, systemPrompt: enhancedSystemPrompt };
}
