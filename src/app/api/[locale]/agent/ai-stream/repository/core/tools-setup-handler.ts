import type { ModelOption } from "@/app/api/[locale]/agent/models/models";
import { getFullPath } from "@/app/api/[locale]/system/generated/endpoint";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import { definitionsRegistry } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getPreferredToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolCall } from "../../../chat/db";

/**
 * Tool config item from the API request
 */
interface ToolConfigItem {
  toolId: string;
  requiresConfirmation: boolean;
}

export class ToolsSetupHandler {
  /**
   * Set up tools for AI streaming.
   *
   * @param visibleTools - Tools loaded into AI SDK context (visible to model). null = load all.
   * @param activeTools - Permission layer: tools the model is allowed to execute.
   *                      null = all tools allowed. When model calls a tool not in visibleTools
   *                      but in activeTools, it's executed via fallback in tool-error-handler.
   */
  static async setupStreamingTools(params: {
    modelConfig: ModelOption;
    visibleTools: ToolConfigItem[] | null | undefined;
    activeTools: ToolConfigItem[] | null | undefined;
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
    /** Set of tool names (preferred) the model is allowed to execute. null = all allowed. */
    activeToolNames: Set<string> | null;
    systemPrompt: string;
  }> {
    const modelConfig = params.modelConfig;

    if (!modelConfig?.supportsTools) {
      return {
        tools: undefined,
        toolsConfig: new Map(),
        activeToolNames: null,
        systemPrompt: params.systemPrompt,
      };
    }

    // Build endpoint lookup maps for resolving toolId → preferred name
    const allEndpoints = definitionsRegistry.getEndpointsForUser(
      Platform.AI,
      params.user,
    );
    const endpointByPreferredName = new Map(
      allEndpoints.map((e) => [getPreferredToolName(e), e]),
    );

    // Build reverse lookup: full path → preferred name
    const fullPathToPreferred = new Map<string, string>();
    for (const ep of allEndpoints) {
      const preferred = getPreferredToolName(ep);
      // Map both the preferred name and any aliases/full paths to the preferred name
      fullPathToPreferred.set(preferred, preferred);
      // The full path from getFullPath maps to this preferred name
      const fullPath = getFullPath(preferred);
      if (fullPath) {
        fullPathToPreferred.set(fullPath, preferred);
      }
    }

    // Resolve a toolId (alias or full path) to the preferred tool name
    // toolResult.tools keys use preferred names, so all lookups must use preferred names
    const resolveToPreferredName = (toolId: string): string | null => {
      // Direct lookup (handles both preferred names and full paths)
      const direct = fullPathToPreferred.get(toolId);
      if (direct) {
        return direct;
      }
      // Try resolving alias → full path → preferred name
      const fullPath = getFullPath(toolId);
      if (fullPath) {
        return fullPathToPreferred.get(fullPath) ?? null;
      }
      return null;
    };

    // Build confirmed tools set for quick lookup (uses preferred names)
    const confirmedToolNames = new Set(
      params.toolConfirmationResults.map((r) => r.toolCall.toolName),
    );

    // Build client confirmation config from visible + active tools
    // Keyed by preferred tool name for consistent lookup
    const clientConfirmationConfig = new Map<string, boolean>();
    const allToolConfigs = [
      ...(params.visibleTools ?? []),
      ...(params.activeTools ?? []),
    ];
    for (const toolConfig of allToolConfigs) {
      const preferredName = resolveToPreferredName(toolConfig.toolId);
      if (preferredName) {
        const isConfirmedTool = confirmedToolNames.has(preferredName);
        clientConfirmationConfig.set(
          preferredName,
          isConfirmedTool ? false : toolConfig.requiresConfirmation,
        );
      }
    }

    // Also build a full-path keyed version for loadTools (which checks both preferred + internal names)
    const toolConfirmationConfig = new Map<string, boolean>();
    for (const [preferredName, value] of clientConfirmationConfig) {
      toolConfirmationConfig.set(preferredName, value);
      // Also add the full path key so loadTools can find it by internal name
      const fullPath = getFullPath(preferredName);
      if (fullPath && fullPath !== preferredName) {
        toolConfirmationConfig.set(fullPath, value);
      }
    }

    // Load only VISIBLE tools into the AI SDK to keep context compact.
    // AI can discover other tools via tool-help and execute them via fallback.
    const isAgentMode = !params.visibleTools;

    const visibleToolIds = params.visibleTools
      ? params.visibleTools.map((t) => {
          const fullPath = getFullPath(t.toolId);
          return fullPath ?? t.toolId;
        })
      : null; // null = agent mode, load all

    const toolsResult = await loadTools({
      requestedTools: visibleToolIds,
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      systemPrompt: params.systemPrompt,
      toolConfirmationConfig,
    });

    // Build toolsConfig map for confirmation checks (used by tool-call-handler AND tool-error-handler)
    // Keys are preferred tool names (matching toolsResult.tools keys)
    // Source of truth priority: confirmed tools > client config > endpoint definition > false
    const toolsConfig = new Map<string, { requiresConfirmation: boolean }>();
    if (toolsResult.tools) {
      for (const toolName of Object.keys(toolsResult.tools)) {
        if (confirmedToolNames.has(toolName)) {
          toolsConfig.set(toolName, { requiresConfirmation: false });
          continue;
        }

        // Check client config first (already keyed by preferred name)
        const clientConfig = clientConfirmationConfig.get(toolName);
        if (clientConfig !== undefined) {
          toolsConfig.set(toolName, { requiresConfirmation: clientConfig });
        } else {
          // Fall back to endpoint definition's requiresConfirmation
          const ep = endpointByPreferredName.get(toolName);
          toolsConfig.set(toolName, {
            requiresConfirmation: ep?.requiresConfirmation ?? false,
          });
        }
      }
    }

    // Build activeToolNames set (permission layer for fallback execution)
    // Uses preferred names (matching what tool-error-handler receives as part.toolName)
    // null = all tools allowed (no restriction)
    let activeToolNames: Set<string> | null = null;
    if (params.activeTools) {
      activeToolNames = new Set<string>();
      for (const toolConfig of params.activeTools) {
        const preferredName = resolveToPreferredName(toolConfig.toolId);
        if (preferredName) {
          activeToolNames.add(preferredName);
        }
      }
    }

    params.logger.debug("[AI Stream] Tools loaded", {
      visibleToolCount: toolsResult.tools
        ? Object.keys(toolsResult.tools).length
        : 0,
      hasTools: !!toolsResult.tools,
      isAgentMode,
      toolsConfigSize: toolsConfig.size,
      activeToolsCount: activeToolNames?.size ?? "all",
    });

    return {
      tools: toolsResult.tools,
      toolsConfig,
      activeToolNames,
      systemPrompt: toolsResult.systemPrompt,
    };
  }
}
