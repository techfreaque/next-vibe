import type { ModelOption } from "@/app/api/[locale]/agent/models/models";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  getFullPath,
  getPreferredName,
} from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { WAIT_FOR_TASK_ALIAS } from "../../../../system/unified-interface/tasks/wait-for-task/constants";
import type { ToolExecutionContext } from "../../../chat/config";
import { getDefaultToolIds } from "../../../chat/constants";
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
   * @param pinnedTools - Tools loaded into AI SDK context (visible to model). null = load all.
   * @param availableTools - Permission layer: tools the model is allowed to execute.
   *                      null = all tools allowed. When model calls a tool not in pinnedTools
   *                      but in availableTools, it's executed via fallback in tool-error-handler.
   */
  static async setupStreamingTools(params: {
    modelConfig: ModelOption;
    pinnedTools: ToolConfigItem[] | null | undefined;
    availableTools: ToolConfigItem[] | null | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    systemPrompt: string;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    streamContext: ToolExecutionContext;
  }): Promise<{
    tools: Record<string, CoreTool> | undefined;
    toolsConfig: Map<
      string,
      { requiresConfirmation: boolean; credits: number }
    >;
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

    // Resolve a toolId (alias or canonical) to the preferred name (first alias if any).
    const resolveToPreferredName = (toolId: string): string =>
      getPreferredName(toolId);

    // Build confirmed tools set for quick lookup (uses preferred names)
    const confirmedToolNames = new Set(
      params.toolConfirmationResults.map((r) => r.toolCall.toolName),
    );

    // Build client confirmation config from visible + active tools
    // Keyed by preferred tool name for consistent lookup
    const clientConfirmationConfig = new Map<string, boolean>();
    const allToolConfigs = [
      ...(params.pinnedTools ?? []),
      ...(params.availableTools ?? []),
    ];
    for (const toolConfig of allToolConfigs) {
      const preferredName = resolveToPreferredName(toolConfig.toolId);
      const isConfirmedTool = confirmedToolNames.has(preferredName);
      clientConfirmationConfig.set(
        preferredName,
        isConfirmedTool ? false : toolConfig.requiresConfirmation,
      );
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
    const isAgentMode = !params.pinnedTools;

    // Build visible tool IDs from client request, or use defaults in agent mode.
    // Always inject wait-for-task so AI can pause on background tasks regardless
    // of the user's saved tool list (it may predate the tool being added to defaults).
    const visibleToolIdsFromClient = params.pinnedTools
      ? params.pinnedTools.map((t) => getFullPath(t.toolId) ?? t.toolId)
      : [...getDefaultToolIds()]; // agent mode = default tool set

    // Inject pinned remote tools (from availableTools) into visible set.
    // Remote tools use "instanceId__toolName" format and are only in availableTools
    // (permissions). They must also be in pinnedTools for the AI to see them.
    if (params.availableTools) {
      const visibleSet = new Set(visibleToolIdsFromClient);
      for (const tool of params.availableTools) {
        if (tool.toolId.includes("__") && !visibleSet.has(tool.toolId)) {
          visibleToolIdsFromClient.push(tool.toolId);
        }
      }
    }

    const waitForTaskFullPath =
      getFullPath(WAIT_FOR_TASK_ALIAS) ?? WAIT_FOR_TASK_ALIAS;
    const visibleToolIds =
      visibleToolIdsFromClient.includes(waitForTaskFullPath) ||
      visibleToolIdsFromClient.includes(WAIT_FOR_TASK_ALIAS)
        ? visibleToolIdsFromClient
        : [...visibleToolIdsFromClient, waitForTaskFullPath];

    const toolsResult = await loadTools({
      requestedTools: visibleToolIds,
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      systemPrompt: params.systemPrompt,
      toolConfirmationConfig,
      streamContext: params.streamContext,
    });

    // Build toolsConfig from toolsMeta (which has credits + requiresConfirmation from the loaded endpoints)
    // Client config overrides endpoint definition; confirmed tools are never re-confirmed
    const toolsConfig = new Map<
      string,
      { requiresConfirmation: boolean; credits: number }
    >();
    for (const [toolName, meta] of toolsResult.toolsMeta) {
      const credits = meta.credits;
      if (confirmedToolNames.has(toolName)) {
        toolsConfig.set(toolName, { requiresConfirmation: false, credits });
      } else {
        const clientConfig = clientConfirmationConfig.get(toolName);
        toolsConfig.set(toolName, {
          requiresConfirmation: clientConfig ?? meta.requiresConfirmation,
          credits,
        });
      }
    }

    // Build activeToolNames set (permission layer for fallback execution)
    // Uses preferred names (matching what tool-error-handler receives as part.toolName)
    // null = all tools allowed (no restriction)
    let activeToolNames: Set<string> | null = null;
    if (params.availableTools) {
      activeToolNames = new Set<string>();
      for (const toolConfig of params.availableTools) {
        activeToolNames.add(resolveToPreferredName(toolConfig.toolId));
      }
    }

    params.logger.debug("[AI Stream] Tools loaded", {
      visibleToolCount: toolsResult.tools
        ? Object.keys(toolsResult.tools).length
        : 0,
      hasTools: !!toolsResult.tools,
      isAgentMode,
      toolsConfigSize: toolsConfig.size,
      availableToolsCount: activeToolNames?.size ?? "all",
    });

    return {
      tools: toolsResult.tools,
      toolsConfig,
      activeToolNames,
      systemPrompt: toolsResult.systemPrompt,
    };
  }
}
