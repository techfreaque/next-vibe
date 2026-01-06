/**
 * ToolsSetupHandler - Handles AI streaming tools setup
 */

import { getModelById, type ModelId } from "@/app/api/[locale]/agent/models/models";
import { getFullPath } from "@/app/api/[locale]/system/generated/endpoint";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolCall } from "../../../chat/db";

export class ToolsSetupHandler {
  /**
   * Setup tools for OpenRouter streaming
   * Returns tools and updated system prompt
   */
  static async setupStreamingTools(params: {
    model: ModelId;
    requestedTools: Array<{ toolId: string; requiresConfirmation: boolean }> | null | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    systemPrompt: string;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
  }): Promise<{
    tools: Record<string, CoreTool> | undefined;
    toolsConfig: Map<string, { requiresConfirmation: boolean }>;
    systemPrompt: string;
  }> {
    const modelConfig = getModelById(params.model);

    if (!modelConfig?.supportsTools) {
      return {
        tools: undefined,
        toolsConfig: new Map(),
        systemPrompt: params.systemPrompt,
      };
    }

    // Extract tool IDs and build confirmation config map
    const toolIds = params.requestedTools?.map((t) => t.toolId) ?? null;

    // Build confirmed tools set for quick lookup
    const confirmedToolNames = new Set(
      params.toolConfirmationResults.map((r) => r.toolCall.toolName),
    );

    // Build toolConfirmationConfig map BEFORE calling loadTools
    // Map tool IDs to their confirmation requirements (from API request)
    const toolConfirmationConfig = new Map<string, boolean>();
    if (params.requestedTools) {
      for (const toolConfig of params.requestedTools) {
        // Map tool alias/path to AI SDK tool name using getFullPath
        const aiSdkToolName = getFullPath(toolConfig.toolId);
        if (aiSdkToolName) {
          // If this tool was just confirmed, DON'T require confirmation again
          // This prevents the infinite loop where the AI calls the same tool again after confirmation
          const isConfirmedTool = confirmedToolNames.has(aiSdkToolName);

          toolConfirmationConfig.set(
            aiSdkToolName,
            isConfirmedTool ? false : toolConfig.requiresConfirmation,
          );
        }
      }
    }

    const toolsResult = await loadTools({
      requestedTools: toolIds,
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      systemPrompt: params.systemPrompt,
      toolConfirmationConfig,
    });

    // Build toolsConfig map using AI SDK tool names (not aliases)
    // The loadTools function returns tools with AI SDK names like 'v1_core_agent_brave-search_GET'
    // We need to map tool aliases to their AI SDK names using getFullPath
    const toolsConfig = new Map<string, { requiresConfirmation: boolean }>();
    if (toolsResult.tools && params.requestedTools) {
      for (const toolConfig of params.requestedTools) {
        // Map tool alias/path to AI SDK tool name using getFullPath
        const aiSdkToolName = getFullPath(toolConfig.toolId);
        if (aiSdkToolName && toolsResult.tools[aiSdkToolName]) {
          // If this tool was just confirmed, DON'T require confirmation again
          const isConfirmedTool = confirmedToolNames.has(aiSdkToolName);

          toolsConfig.set(aiSdkToolName, {
            requiresConfirmation: isConfirmedTool ? false : toolConfig.requiresConfirmation,
          });
        }
      }
    }

    params.logger.info("[AI Stream] Tools loaded", {
      toolCount: toolsResult.tools ? Object.keys(toolsResult.tools).length : 0,
      hasTools: !!toolsResult.tools,
      requestedTools: toolIds,
    });

    return {
      tools: toolsResult.tools,
      toolsConfig,
      systemPrompt: toolsResult.systemPrompt,
    };
  }
}
