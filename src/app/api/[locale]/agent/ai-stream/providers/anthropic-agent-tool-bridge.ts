/**
 * Anthropic Agent SDK Tool Bridge
 *
 * Bridges the gap between AI SDK CoreTool objects (which have execute functions)
 * and the Agent SDK's MCP tool format (which needs handler functions).
 *
 * This module provides a tool executor registry that:
 * 1. Stores CoreTool execute functions keyed by tool name
 * 2. Is used by the Agent SDK MCP handler to actually run tools
 * 3. Is scoped per-request to avoid conflicts
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/**
 * Tool executor function type — matches CoreTool's execute signature
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, oxlint-plugin-restricted/restricted-syntax -- tool args are dynamic
type ToolExecutor = (args: any) => Promise<unknown>;

/**
 * Per-request tool executor registry.
 * Created before streaming starts, passed to the Agent SDK provider.
 */
export class AgentToolExecutorRegistry {
  private executors = new Map<string, ToolExecutor>();

  /**
   * Register all CoreTools from the AI SDK tools map
   */
  registerTools(tools: Record<string, CoreTool>, logger: EndpointLogger): void {
    for (const [toolName, coreTool] of Object.entries(tools)) {
      const execute = (coreTool as { execute?: ToolExecutor }).execute;
      if (execute) {
        this.executors.set(toolName, execute);
      } else {
        logger.warn("[AgentToolBridge] Tool has no execute function", {
          toolName,
        });
      }
    }
    logger.info("[AgentToolBridge] Registered tool executors", {
      count: this.executors.size,
    });
  }

  /**
   * Execute a tool by name. Called by the Agent SDK MCP handler.
   */
  async execute(
    toolName: string,
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- MCP tool args are dynamic
    args: Record<string, unknown>,
    logger: EndpointLogger,
  ): Promise<{
    content: Array<{ type: "text"; text: string }>;
    isError?: boolean;
  }> {
    const executor = this.executors.get(toolName);
    if (!executor) {
      logger.error("[AgentToolBridge] Tool not found in registry", {
        toolName,
        registered: [...this.executors.keys()],
      });
      return {
        content: [
          {
            type: "text" as const,
            // eslint-disable-next-line i18next/no-literal-string -- error for AI
            text: `Error: Tool '${toolName}' not found`,
          },
        ],
        isError: true,
      };
    }

    try {
      const result = await executor(args);
      return {
        content: [
          {
            type: "text" as const,
            text:
              typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const parsed = parseError(error);
      logger.warn("[AgentToolBridge] Tool execution error", {
        toolName,
        error: parsed.message,
      });
      return {
        content: [
          {
            type: "text" as const,
            // eslint-disable-next-line i18next/no-literal-string -- error for AI
            text: `Error: ${parsed.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Get all registered tool names
   */
  getToolNames(): string[] {
    return [...this.executors.keys()];
  }
}
